import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, ShieldAlert, Cpu, Globe, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginType, setLoginType] = useState('customer'); // customer, admin, soc
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useApp();

  // Watch for user changes to perform redirection
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/security');
      else if (user.role === 'soc') navigate('/threat');
      else navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const [userLocation, setUserLocation] = useState('Unknown');

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city && data.country_name) {
          setUserLocation(`${data.city}, ${data.country_code}`);
        }
      } catch (err) {
        console.warn('Location detection failed');
      }
    };
    detectLocation();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const result = await login(username, password, userLocation);
    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  const getThematicColor = () => {
    if (loginType === 'admin') return 'text-danger shadow-danger/20';
    if (loginType === 'soc') return 'text-warning shadow-warning/20';
    return 'text-electric shadow-electric/20';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] w-full max-w-xl mx-auto px-4 md:px-0 py-10 md:py-20">
      <div className="w-full bg-white/70 backdrop-blur-3xl rounded-lg border border-white/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700">
        
        {/* Role Selector Tabs */}
        <div className="flex flex-col sm:flex-row p-2 bg-slate-100/50 border-b border-slate-200">
           {[
             { id: 'customer', label: 'Customer', icon: <Users size={12} className="md:w-[14px] md:h-[14px]"/> },
             { id: 'admin', label: 'Bank Official', icon: <Cpu size={12} className="md:w-[14px] md:h-[14px]"/> },
             { id: 'soc', label: 'SOC Analyst', icon: <Globe size={12} className="md:w-[14px] md:h-[14px]"/> },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setLoginType(tab.id)}
               className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                 loginType === tab.id ? 'bg-white text-navy-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {tab.icon}
               <span className="truncate">{tab.label}</span>
             </button>
           ))}
        </div>

        <div className="p-6 md:p-12 text-center">
          <div className={`inline-block p-4 md:p-6 rounded-lg bg-navy-900 shadow-2xl mb-6 md:mb-8 border-[4px] md:border-[6px] border-white group relative transition-all duration-500 ${getThematicColor().split(' ')[1]}`}>
            <Shield size={40} className={`md:w-16 md:h-16 relative z-10 transition-colors duration-500 ${getThematicColor().split(' ')[0]}`} />
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black text-navy-900 mb-2 italic tracking-tighter">
            {loginType === 'admin' ? 'Administrative Vault' : loginType === 'soc' ? 'Neural SOC Access' : 'Command Auth'}
          </h1>
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-8 md:mb-12 italic">
            {loginType === 'admin' ? 'Root Privilege Gateway' : loginType === 'soc' ? 'SOC Perimeter Synchronizer' : 'Universal Access Gateway'}
          </p>

          {error && (
            <div className="p-5 mb-8 bg-danger/5 border border-danger/10 rounded-lg text-danger text-[10px] font-black flex items-center justify-center gap-3 animate-shake uppercase tracking-widest">
              <ShieldAlert size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            <div className="relative group">
              <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors">
                <User size={18} className="md:w-5 md:h-5" />
              </div>
              <input 
                type="text" 
                placeholder={loginType === 'customer' ? "USER HANDLE" : "IDENTITY TOKEN"}
                className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 bg-slate-50 rounded-lg border border-slate-200 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black italic text-xs md:text-sm tracking-tight"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="relative group">
              <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors">
                <Lock size={18} className="md:w-5 md:h-5" />
              </div>
              <input 
                type="password" 
                placeholder="SECURE PASSKEY" 
                className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 bg-slate-50 rounded-lg border border-slate-200 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black italic text-xs md:text-sm tracking-tight"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 md:py-6 bg-navy-900 text-white rounded-lg font-black italic text-base md:text-lg flex items-center justify-center gap-3 transition-all shadow-2xl mt-6 md:mt-8 group disabled:opacity-50 active:scale-95 ${
                loginType === 'admin' ? 'hover:bg-danger shadow-danger/20' : 
                loginType === 'soc' ? 'hover:bg-warning shadow-warning/20' : 'hover:bg-electric shadow-electric/20'
              }`}
            >
              {isSubmitting ? 'SYNCING NEURAL...' : 'INITIALIZE ENTRY'}
              {!isSubmitting && <ArrowRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />}
            </button>
          </form>
 
          <div className="mt-10 md:mt-16 pt-8 md:pt-10 border-t border-slate-100 space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic px-2">
               <span>Neural Protocol v2.4</span>
               <span className="text-electric">End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-6 md:mt-8 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
        Unauthorized access attempts monitored by <span className="text-navy-900 font-black">VaultSight SOC</span>
      </p>
    </div>
  );
};

export default UserLogin;
