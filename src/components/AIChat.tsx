import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Message } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your AgriSupport AI. How can I help you with your farming today? Ask me about crop diseases, planting schedules, or soil health.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'advice'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: Message[] = [
        { role: 'model', text: 'Hello! I am your AgriSupport AI. How can I help you with your farming today? Ask me about crop diseases, planting schedules, or soil health.' }
      ];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        history.push({ role: 'user', text: data.query });
        history.push({ role: 'model', text: data.response });
      });
      setMessages(history);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'advice');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !auth.currentUser) return;

    const userQuery = input;
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })).concat([{ role: 'user', parts: [{ text: userQuery }] }]),
        config: {
          systemInstruction: "You are an expert agricultural advisor. Provide practical, scientific, and sustainable farming advice. Focus on crop management, pest control, soil health, and modern agricultural techniques. Keep responses concise and helpful for farmers."
        }
      });

      const modelText = response.text || "I'm sorry, I couldn't process that request.";
      
      // Save to Firestore
      try {
        await addDoc(collection(db, 'advice'), {
          query: userQuery,
          response: modelText,
          timestamp: serverTimestamp(),
          userId: auth.currentUser.uid
        });
      } catch (fsError) {
        handleFirestoreError(fsError, OperationType.CREATE, 'advice');
      }

    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'user', text: userQuery }, { role: 'model', text: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-chat-container" className="flex flex-col h-[600px] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-[#2d3436] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="font-serif text-xl">Agri Advisor</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-sans font-bold">AI Expert System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold opacity-60">Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fdfdfb]">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-4 max-w-[90%]", m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", m.role === 'user' ? "bg-gray-100" : "bg-[#556b2f] text-white")}>
              {m.role === 'user' ? <User size={18} className="text-gray-400" /> : <Bot size={18} />}
            </div>
            <div className={cn("p-4 rounded-3xl text-sm leading-relaxed shadow-sm", m.role === 'user' ? "bg-[#2d3436] text-white rounded-tr-none" : "bg-white border border-gray-100 rounded-tl-none")}>
              <div className={cn("markdown-body prose prose-sm max-w-none", m.role === 'user' ? "prose-invert" : "")}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 mr-auto">
            <div className="w-10 h-10 rounded-2xl bg-[#556b2f] flex items-center justify-center shadow-sm">
              <Loader2 size={18} className="animate-spin text-white" />
            </div>
            <div className="p-4 rounded-3xl bg-white border border-gray-100 rounded-tl-none text-sm italic text-gray-400 shadow-sm">
              Analyzing agricultural data...
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-50 bg-white">
        <div className="flex gap-3 bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about crops, pests, or soil..."
            className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:ring-0 outline-none font-sans"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-[#2d3436] text-white p-3 rounded-2xl hover:bg-[#1a1c1e] transition-all disabled:opacity-50 shadow-lg shadow-[#2d3436]/10"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
