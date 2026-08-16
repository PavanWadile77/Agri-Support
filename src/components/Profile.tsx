import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User as UserIcon, MapPin, Ruler, CreditCard, Save, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Profile() {
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    farmerId: '',
    farmLocation: '',
    farmLength: '',
    farmBreadth: '',
    farmUnit: 'acre'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!auth.currentUser) return;
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as any);
        } else {
          setProfile(prev => ({
            ...prev,
            displayName: auth.currentUser?.displayName || '',
            email: auth.currentUser?.email || ''
          }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser.uid}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, {
        ...profile,
        timestamp: serverTimestamp()
      }, { merge: true });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#556b2f]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Farmer Identity</p>
        <h2 className="text-5xl font-serif text-[#2d3436] tracking-tight">Farmer Profile</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="stat-card space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-xl text-gray-500">
              <UserIcon size={20} />
            </div>
            <h3 className="font-serif text-xl text-[#2d3436]">Personal Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Full Name</label>
              <input 
                type="text" 
                value={profile.displayName}
                onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                disabled
                className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
              <input 
                type="tel" 
                value={profile.phoneNumber}
                onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Farmer ID (12 Digits)</label>
              <input 
                type="text" 
                value={profile.farmerId}
                onChange={(e) => setProfile(prev => ({ ...prev, farmerId: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                placeholder="1234 5678 9012"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="stat-card space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-xl text-gray-500">
              <MapPin size={20} />
            </div>
            <h3 className="font-serif text-xl text-[#2d3436]">Farm Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Farm Location</label>
              <input 
                type="text" 
                value={profile.farmLocation}
                onChange={(e) => setProfile(prev => ({ ...prev, farmLocation: e.target.value }))}
                placeholder="Village, District, State"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Length</label>
                <input 
                  type="text" 
                  value={profile.farmLength}
                  onChange={(e) => setProfile(prev => ({ ...prev, farmLength: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Breadth</label>
                <input 
                  type="text" 
                  value={profile.farmBreadth}
                  onChange={(e) => setProfile(prev => ({ ...prev, farmBreadth: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Measurement Unit</label>
              <select 
                value={profile.farmUnit}
                onChange={(e) => setProfile(prev => ({ ...prev, farmUnit: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none"
              >
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="guntha">Guntha</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {message && (
          <p className={cn("text-sm font-sans font-bold", message.type === 'success' ? "text-green-600" : "text-red-600")}>
            {message.text}
          </p>
        )}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#2d3436] text-white px-12 py-4 rounded-full font-sans text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-[#2d3436]/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Profile Changes
        </button>
      </div>
    </div>
  );
}
