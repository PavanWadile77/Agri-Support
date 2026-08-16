import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Camera, Upload, Search, Loader2, CheckCircle2, History, Trash2, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CropDiagnosis() {
  const [activeView, setActiveView] = useState<'new' | 'history'>('new');
  const [cropType, setCropType] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'diagnoses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(docs);
      setIsLoadingHistory(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'diagnoses');
    });

    return () => unsubscribe();
  }, []);

  const handleDiagnose = async () => {
    if (!cropType.trim() || !auth.currentUser) return;
    setIsDiagnosing(true);
    setResult(null);

    // Simulate AI diagnosis
    setTimeout(async () => {
      const mockResult = `Based on the analysis of your ${cropType}, we've detected early signs of fungal leaf spot. 
      Recommendation: Apply organic neem oil spray and ensure proper spacing between plants to improve air circulation. 
      Avoid overhead watering to keep foliage dry.`;

      try {
        await addDoc(collection(db, 'diagnoses'), {
          cropType,
          result: mockResult,
          imageUrl: `https://picsum.photos/seed/${cropType}/800/600`,
          timestamp: serverTimestamp(),
          userId: auth.currentUser.uid
        });
        setResult(mockResult);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'diagnoses');
      } finally {
        setIsDiagnosing(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Health Monitoring</p>
          <h2 className="text-5xl font-serif text-[#2d3436] tracking-tight">Crop Diagnosis</h2>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => setActiveView('new')}
            className={cn("px-6 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2", 
              activeView === 'new' ? "bg-[#2d3436] text-white shadow-lg shadow-[#2d3436]/20" : "text-gray-400 hover:text-[#2d3436]")}
          >
            <Camera size={16} />
            New Diagnosis
          </button>
          <button 
            onClick={() => setActiveView('history')}
            className={cn("px-6 py-2.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2", 
              activeView === 'history' ? "bg-[#2d3436] text-white shadow-lg shadow-[#2d3436]/20" : "text-gray-400 hover:text-[#2d3436]")}
          >
            <History size={16} />
            History
          </button>
        </div>
      </header>

      {activeView === 'new' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="stat-card space-y-8">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-[#2d3436]">Analyze Crop Health</h3>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                Upload a photo of your crop or describe the symptoms to get an instant AI-powered health assessment and treatment plan.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Crop Type</label>
                <input 
                  type="text" 
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  placeholder="e.g., Wheat, Tomato, Rice"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center space-y-4 bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-all">
                  <Upload className="text-gray-400 group-hover:text-[#556b2f]" size={24} />
                </div>
                <div>
                  <p className="font-sans font-bold text-sm text-[#2d3436]">Upload Crop Photo</p>
                  <p className="text-xs text-gray-400 font-sans mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <button 
                onClick={handleDiagnose}
                disabled={isDiagnosing || !cropType.trim()}
                className="w-full bg-[#556b2f] text-white py-5 rounded-full font-sans text-sm font-bold hover:bg-[#4a5d29] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#556b2f]/20 disabled:opacity-50"
              >
                {isDiagnosing ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                {isDiagnosing ? 'Analyzing Crop...' : 'Run AI Diagnosis'}
              </button>
            </div>
          </div>

          <div className="relative">
            {result ? (
              <div className="stat-card bg-[#2d3436] text-white border-none h-full animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-[#556b2f] rounded-xl">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="font-serif text-2xl">Diagnosis Result</h3>
                </div>
                <div className="space-y-6">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-white/10">
                    <img 
                      src={`https://picsum.photos/seed/${cropType}/800/600`} 
                      alt="Diagnosis" 
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-sans font-bold uppercase tracking-widest text-[#556b2f]">Findings & Recommendations</p>
                    <p className="text-sm leading-relaxed font-sans opacity-90">{result}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="stat-card border-dashed border-2 flex flex-col items-center justify-center text-center p-12 h-full opacity-40">
                <Bot size={48} className="text-gray-300 mb-4" />
                <p className="font-serif text-xl text-gray-400">Waiting for analysis...</p>
                <p className="text-xs font-sans text-gray-400 mt-2">Your diagnosis result will appear here.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingHistory ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-[#556b2f]" size={32} />
            </div>
          ) : history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="stat-card group hover:shadow-xl transition-all duration-500">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.cropType} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#556b2f]">{item.cropType}</p>
                      <h4 className="font-serif text-lg text-[#2d3436] mt-1">Health Report</h4>
                    </div>
                    <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">
                      {item.timestamp?.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 font-sans line-clamp-3 leading-relaxed">
                    {item.result}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-gray-100">
              <History size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="font-serif text-xl text-gray-400">No diagnosis history found</p>
              <p className="text-xs font-sans text-gray-400 mt-2">Start your first diagnosis to see it here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
