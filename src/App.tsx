import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { LogIn, LogOut, User as UserIcon, LayoutDashboard, MessageSquare, LineChart as ChartIcon, Users, Bot, Bell, Settings, Search as SearchIcon, Sprout, Briefcase } from 'lucide-react';
import { cn } from './lib/utils';
import AIChat from './components/AIChat';
import MarketTrends from './components/MarketTrends';
import Community from './components/Community';
import WeatherWidget from './components/WeatherWidget';
import SoilHealthWidget from './components/SoilHealthWidget';
import BusinessHub from './components/BusinessHub';
import Profile from './components/Profile';
import CropDiagnosis from './components/CropDiagnosis';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'market' | 'community' | 'business' | 'diagnosis' | 'profile'>('dashboard');
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });

    // Test Firestore connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/unauthorized-domain') {
        // Silently fallback to mock login for preview environment
        console.warn("Firebase unauthorized domain. Switching to Demo Mode.");
        mockLogin();
      } else {
        console.error("Login error:", error);
      }
    }
  };

  const mockLogin = () => {
    const mockUser = {
      uid: 'mock-user-123',
      displayName: 'Pavan Wadile',
      email: 'pavanwadile777@gmail.com',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pavan',
    } as User;
    setUser(mockUser);
    setIsAuthReady(true);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#2d3436] rounded-full"></div>
          <p className="font-serif text-[#2d3436] text-xl">Agri Support</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <header className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#2d3436] rounded-2xl flex items-center justify-center text-white font-serif text-2xl shadow-xl shadow-[#2d3436]/20">A</div>
            <h1 className="font-serif text-3xl text-[#2d3436] tracking-tight">Agri Support</h1>
          </div>
          <button onClick={login} className="bg-[#2d3436] text-white px-8 py-3 rounded-full font-sans text-sm font-bold hover:bg-[#1a1c1e] transition-all flex items-center gap-2 shadow-lg shadow-[#2d3436]/10">
            <LogIn size={18} />
            Sign In
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-4xl space-y-12">
            <div className="space-y-4">
              <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.3em] text-sm">Precision Agriculture</p>
              <h2 className="text-7xl md:text-9xl font-serif leading-[0.9] text-[#2d3436] tracking-tighter">
                Cultivating <span className="italic text-[#556b2f]">Intelligence</span> on Every Acre
              </h2>
            </div>
            <p className="text-xl text-gray-500 font-sans max-w-2xl mx-auto leading-relaxed font-light">
              A professional-grade ecosystem for modern farmers. Real-time soil analytics, AI-driven crop advice, and global market insights.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              {[
                { icon: Bot, label: "AI Advisor" },
                { icon: ChartIcon, label: "Market Intel" },
                { icon: Users, label: "Community" },
                { icon: Sprout, label: "Soil Health" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 w-44 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <item.icon className="mx-auto mb-4 text-[#556b2f]" size={32} />
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <button onClick={login} className="bg-[#556b2f] text-white px-12 py-5 rounded-full font-sans text-xl font-bold hover:bg-[#4a5d29] transition-all shadow-2xl shadow-[#556b2f]/30">
                Launch Dashboard
              </button>
              <button onClick={mockLogin} className="bg-white text-[#2d3436] border border-gray-200 px-12 py-5 rounded-full font-sans text-xl font-bold hover:bg-gray-50 transition-all shadow-xl">
                Try Demo Mode
              </button>
            </div>
          </div>
        </main>

        <footer className="p-12 border-t border-gray-100 text-center text-gray-400 text-[10px] font-sans font-bold uppercase tracking-[0.4em]">
          &copy; 2026 Agri Support &bull; The Standard in Agricultural Intelligence
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside id="sidebar" className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col p-8 gap-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2d3436] rounded-xl flex items-center justify-center text-white font-serif text-xl shadow-lg shadow-[#2d3436]/20">A</div>
          <h1 className="font-serif text-2xl text-[#2d3436] tracking-tight">Agri Support</h1>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'chat', icon: MessageSquare, label: 'AI Advisor' },
            { id: 'market', icon: ChartIcon, label: 'Market Intel' },
            { id: 'community', icon: Users, label: 'Community' },
            { id: 'business', icon: Briefcase, label: 'Business Hub' },
            { id: 'diagnosis', icon: Sprout, label: 'Diagnosis' },
            { id: 'profile', icon: UserIcon, label: 'Profile' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-sans text-sm font-bold", 
                activeTab === tab.id ? "bg-[#2d3436] text-white shadow-xl shadow-[#2d3436]/20" : "text-gray-400 hover:bg-gray-50 hover:text-[#2d3436]")}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-gray-50 space-y-6">
          <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden border border-gray-100 shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-full h-full p-3 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-[#2d3436] truncate font-bold">{user.displayName || 'Farmer'}</p>
              <p className="text-[10px] text-gray-400 font-sans truncate font-bold uppercase tracking-wider">Premium Plan</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-sans text-[10px] font-bold uppercase tracking-widest border border-red-100">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md hidden lg:block">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics, reports, or community..." 
                className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-sans focus:ring-2 focus:ring-[#2d3436] outline-none shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#2d3436] transition-all shadow-sm">
                <Bell size={20} />
              </button>
              <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#2d3436] transition-all shadow-sm">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Operational Overview</p>
                  <h2 className="text-5xl md:text-6xl font-serif text-[#2d3436] tracking-tight">Welcome, <span className="italic text-[#556b2f]">{user.displayName?.split(' ')[0] || 'Farmer'}</span></h2>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs font-sans font-bold text-gray-500 uppercase tracking-wider">Systems Online</p>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <WeatherWidget />
                    <SoilHealthWidget />
                  </div>
                  <MarketTrends />
                </div>
                <div className="space-y-8">
                  <AIChat />
                  <div className="stat-card bg-[#2d3436] text-white border-none overflow-hidden relative">
                    <div className="relative z-10">
                      <h3 className="font-serif text-2xl mb-4">Crop Cycle</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-60">Wheat • Phase 3</p>
                          <p className="text-xl font-serif">72%</p>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#556b2f] w-[72%] rounded-full" />
                        </div>
                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60">Est. Harvest: June 12, 2026</p>
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#556b2f]/20 rounded-full blur-3xl"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <header>
                <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Expert Consultation</p>
                <h2 className="text-5xl font-serif text-[#2d3436] tracking-tight">AI Agricultural Advisor</h2>
              </header>
              <AIChat />
            </div>
          )}

          {activeTab === 'market' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <header>
                <p className="text-[#556b2f] font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Global Intelligence</p>
                <h2 className="text-5xl font-serif text-[#2d3436] tracking-tight">Market Intelligence</h2>
              </header>
              <div className="grid gap-8">
                <MarketTrends />
                <div className="stat-card">
                  <h3 className="font-serif text-2xl mb-6 text-[#2d3436]">Strategic Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed font-sans">
                        Global wheat prices are seeing a steady climb due to supply chain disruptions in Eastern Europe. 
                        Local demand remains strong, suggesting a favorable window for harvest sales in the coming month.
                      </p>
                      <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                        <p className="text-xs font-sans font-bold text-green-700 uppercase tracking-widest mb-1">Recommendation</p>
                        <p className="text-sm text-green-800 font-sans">Hold inventory for 15-20 days to maximize ROI.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed font-sans">
                        Fertilizer costs are projected to rise by 5% in Q3. We recommend early procurement of nitrogen-based fertilizers to hedge against inflation.
                      </p>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs font-sans font-bold text-amber-700 uppercase tracking-widest mb-1">Alert</p>
                        <p className="text-sm text-amber-800 font-sans">Potassium supply tightening in regional markets.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="animate-in fade-in duration-700">
              <Community />
            </div>
          )}

          {activeTab === 'business' && (
            <BusinessHub />
          )}

          {activeTab === 'diagnosis' && (
            <CropDiagnosis />
          )}

          {activeTab === 'profile' && (
            <Profile />
          )}
        </div>
      </main>
    </div>
  );
}
