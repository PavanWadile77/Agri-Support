import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Post } from '../types';
import { MessageSquare, Heart, Plus, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [category, setCategory] = useState<Post['category']>('general');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    if (!auth.currentUser || !newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous Farmer',
        authorPhoto: auth.currentUser.photoURL,
        title: newPostTitle,
        content: newPostContent,
        category,
        createdAt: serverTimestamp(),
        likes: []
      });
      setNewPostTitle('');
      setNewPostContent('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleLike = async (postId: string, likes: string[]) => {
    if (!auth.currentUser) return;
    const postRef = doc(db, 'posts', postId);
    const isLiked = likes.includes(auth.currentUser.uid);

    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div id="community-container" className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Knowledge Exchange</p>
          <h2 className="font-serif text-5xl text-[#2d3436] tracking-tight">Farmer's Community</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#2d3436] text-white px-8 py-4 rounded-full flex items-center gap-3 hover:bg-[#1a1c1e] transition-all shadow-xl shadow-[#2d3436]/20"
        >
          <Plus size={20} />
          <span className="font-sans text-sm font-bold uppercase tracking-widest">New Discussion</span>
        </button>
      </div>

      {isAdding && (
        <div className="stat-card space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <input
            type="text"
            placeholder="Discussion Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-serif focus:ring-2 focus:ring-[#2d3436] outline-none shadow-sm"
          />
          <textarea
            placeholder="Share your thoughts, questions or experiences..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={5}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none resize-none shadow-sm"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Category:</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Post['category'])}
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 focus:ring-2 focus:ring-[#2d3436] outline-none"
              >
                <option value="general">General</option>
                <option value="crops">Crops</option>
                <option value="livestock">Livestock</option>
                <option value="machinery">Machinery</option>
                <option value="market">Market</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsAdding(false)} className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              <button onClick={handleAddPost} className="bg-[#556b2f] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#556b2f]/20">Post Discussion</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {posts.map((post) => (
          <div key={post.id} className="stat-card group hover:border-[#556b2f]/30">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 shadow-sm">
                  {post.authorPhoto ? (
                    <img src={post.authorPhoto} alt={post.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2d3436] font-serif uppercase text-xl font-bold">
                      {post.authorName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-serif text-lg text-[#2d3436] font-bold">{post.authorName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#556b2f] bg-[#556b2f]/10 px-2 py-0.5 rounded-md uppercase tracking-widest font-bold font-sans">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold font-sans">
                      {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-serif text-2xl mb-3 text-[#2d3436] tracking-tight">{post.title}</h3>
            <p className="text-sm text-gray-500 font-sans line-clamp-3 mb-6 leading-relaxed font-light">{post.content}</p>
            <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
              <button 
                onClick={() => handleLike(post.id, post.likes || [])}
                className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all", 
                  post.likes?.includes(auth.currentUser?.uid || '') ? "text-red-500" : "text-gray-400 hover:text-[#556b2f]")}
              >
                <Heart size={18} fill={post.likes?.includes(auth.currentUser?.uid || '') ? "currentColor" : "none"} />
                <span>{post.likes?.length || 0} Likes</span>
              </button>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#556b2f] transition-all">
                <MessageSquare size={18} />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
