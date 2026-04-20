import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CreditCard as CardIcon, 
  Copy, 
  Eye, 
  EyeOff,
  Zap,
  Activity,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const DebitCard = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [showFull, setShowFull] = useState(false);

  if (!user) return null;

  const card = user.debitCard || {};
  const isBlocked = user.isBlocked || user.isLocked;

  React.useEffect(() => {
    if (!card.isIssued) {
      navigate('/user/dashboard');
    }
  }, [card.isIssued, navigate]);

  if (!card.isIssued) return null;

  return (
    <div className="space-y-12 animate-in slide-in-from-left-10 duration-500 pb-20">
      <div className="flex items-center gap-6">
        <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-lg text-navy-900 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black text-navy-900 uppercase tracking-tighter italic leading-none">Cyber Shield</h1>
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <div className="w-2 h-2 bg-electric rounded-full animate-pulse"></div>
               Virtual Asset Management
            </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Side: Card Visualization */}
        <div className="col-span-12 lg:col-span-7 space-y-10">
           <div className="relative h-[400px] group perspective-1000">
              <div className={`w-full h-full bg-gradient-to-br from-navy-900 via-navy-800 to-black rounded-lg p-16 text-white shadow-2xl relative overflow-hidden transition-all duration-1000 flex flex-col justify-between border-4 border-white/5 ${isBlocked ? 'grayscale opacity-75' : 'hover:shadow-electric/40 hover:-translate-y-2'}`}>
                 
                 {/* Decorative Layers */}
                 <div className="absolute top-0 right-0 p-16 text-white/5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                    <ShieldCheck size={300} />
                 </div>
                 <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-electric/10 rounded-full blur-[120px]"></div>

                 <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-3xl font-black tracking-tighter italic">VaultSight<span className="text-electric"> AI</span></h3>
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic shadow-black drop-shadow-md">Titanium Network</p>
                    </div>
                    <div className="w-20 h-16 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 backdrop-blur-xl group-hover:border-electric transition-colors">
                       <div className="w-14 h-10 bg-gradient-to-br from-amber-400/40 to-amber-600/20 rounded-lg border border-amber-400/30 flex flex-col justify-center gap-1.5 p-3">
                          <div className="w-full h-[1px] bg-amber-200/40"></div>
                          <div className="w-full h-[1px] bg-amber-200/40"></div>
                          <div className="w-full h-[1px] bg-amber-200/40"></div>
                       </div>
                    </div>
                 </div>

                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-8">
                       <p className="text-4xl md:text-5xl font-black font-mono tracking-[0.2em] italic shadow-black drop-shadow-2xl">
                          {showFull ? 
                            card.cardNumber?.match(/.{1,4}/g)?.join(' ') : 
                            '•••• •••• •••• ' + card.cardNumber?.slice(-4)}
                       </p>
                       <button onClick={() => setShowFull(!showFull)} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all border border-white/5 backdrop-blur-3xl shadow-xl">
                          {showFull ? <EyeOff size={28} /> : <Eye size={28} />}
                       </button>
                    </div>
                    
                    <div className="flex gap-16">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Expiry</p>
                          <p className="text-2xl font-black font-mono italic text-slate-200">{card.expiryMonth?.toString().padStart(2,'0')} / {card.expiryYear?.toString().slice(-2)}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">CVV</p>
                          <p className="text-2xl font-black font-mono tracking-[0.4em] text-electric">{showFull ? card.cvv : '•••'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Card PIN</p>
                          <p className="text-2xl font-black font-mono tracking-[0.4em] text-success">{showFull ? card.cardPin || '0000' : '••••'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="relative z-10 flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Owner</p>
                       <p className="text-lg font-black uppercase tracking-[0.2em] italic text-slate-100 shadow-black shadow-lg">{user.name}</p>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-12 h-12 bg-red-600/80 rounded-full border border-white/5"></div>
                       <div className="w-12 h-12 bg-amber-500/80 rounded-full -ml-8 border border-white/5"></div>
                    </div>
                 </div>

                 {isBlocked && (
                   <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-[8px] flex items-center justify-center p-12 z-40 transition-all duration-700 animate-in fade-in">
                      <div className="bg-danger text-white px-10 py-5 rounded-lg font-black uppercase text-sm shadow-2xl flex items-center gap-4 border-2 border-white/20 animate-pulse tracking-widest italic">
                         <Lock size={20} /> Protection Engaged
                      </div>
                   </div>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group hover:border-electric transition-all cursor-pointer">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg text-navy-900 group-hover:bg-electric group-hover:text-white transition-all">
                       <Copy size={24} />
                    </div>
                    <span className="text-sm font-black text-navy-900 italic uppercase">Copy Card Vector</span>
                 </div>
                 <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group hover:border-danger transition-all cursor-pointer">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg text-danger group-hover:bg-danger group-hover:text-white transition-all">
                       <Lock size={24} />
                    </div>
                    <span className="text-sm font-black text-navy-900 italic uppercase">Freeze Asset</span>
                 </div>
                 <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>

        {/* Right Side: Controls & Analytics */}
        <div className="col-span-12 lg:col-span-5 space-y-10">
           
           <div className="bg-white rounded-lg border border-slate-200 p-12 shadow-sm space-y-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] italic text-center border-b border-slate-50 pb-8">Interface Controls</h3>
              
              <div className="space-y-10">
                 {[
                   { icon: <CardIcon size={24}/>, title: "Expenditure Ceiling", desc: "Monthly Limit Set", val: "84%", active: true },
                   { icon: <Smartphone size={24}/>, title: "Contactless Sync", desc: "Biometric bypass active", val: "Active", active: true },
                   { icon: <Lock size={24}/>, title: "Kill-Switch", desc: "Instant freezing", val: "Standby", active: false, danger: true },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                         <div className={`p-5 bg-slate-50 rounded-lg transition-all ${item.danger ? 'text-danger' : 'text-navy-900 group-hover:text-electric'} shadow-sm border border-slate-100`}>
                            {item.icon}
                         </div>
                         <div>
                            <p className="text-base font-black text-navy-900 italic tracking-tight">{item.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                         </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1.5 flex transition-all ${item.active ? 'bg-success justify-end' : 'bg-slate-200 justify-start'}`}>
                         <div className="w-5 h-5 bg-white rounded-full shadow-lg"></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-navy-900 p-12 rounded-lg text-white space-y-8 shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-electric/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] relative z-10">
                 <span className="text-slate-500 italic">Neural Throughput</span>
                 <span className="text-electric animate-pulse italic">72% Synchronized</span>
              </div>
              
              <div className="h-4 bg-white/5 rounded-full border border-white/10 overflow-hidden p-1 shadow-inner relative z-10">
                 <div className="h-full bg-electric rounded-full shadow-xl shadow-electric/20 transition-all duration-[2000ms]" style={{ width: '72%' }}></div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/5 relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                    <Activity size={18} className="text-electric" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Live Telemetry Report</p>
                 </div>
                 <p className="text-xs font-medium text-slate-400 leading-relaxed italic border-l border-electric/30 pl-4">
                    Vector analysis of your recent patterns indicates stable regional patterns. 
                    Next rotation in <span className="text-white font-bold">5 Days</span>.
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                <button 
                  onClick={() => navigate('/user/change-pin')}
                  className="py-5 bg-white/5 border border-white/10 text-white rounded-lg font-black text-[10px] uppercase tracking-widest italic hover:bg-white hover:text-navy-900 transition-all shadow-xl active:scale-95"
                >
                   Change UPI PIN
                </button>
                <button className="py-5 bg-electric text-white rounded-lg font-black text-[10px] uppercase tracking-widest italic hover:bg-white hover:text-navy-900 transition-all shadow-xl active:scale-95">
                   Security Metadata
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DebitCard;
