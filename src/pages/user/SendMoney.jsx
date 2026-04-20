import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  ChevronLeft, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  Zap,
  Activity,
  History,
  Info,
  HelpCircle,
  ShieldCheck,
  User,
  Users
} from 'lucide-react';

const SendMoney = () => {
  const { user, fetchProfile, fetchRecipients } = useApp();
  const [recipients, setRecipients] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [upiPin, setUpiPin] = useState('');
  const [step, setStep] = useState('list'); // list, amount, pin, processing, result
  const [result, setResult] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('Analyzing Risk...');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipients = async () => {
        const data = await fetchRecipients();
        setRecipients(data || []);
    };
    loadRecipients();
  }, [fetchRecipients]);

  if (!user) return null;

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.upiId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!amount || !recipient || !upiPin) return;

    setStep('processing');
    setLoadingMsg('Scanning Vector Matrix...');
    
    try {
      const response = await api.post('user/transfer', {
        receiverUpiId: recipient,
        amount: parseFloat(amount),
        upiPin,
        device: "Authorized Desktop Node",
        location: "Mumbai, IN", 
        note: "Secure Transfer"
      });

      setResult({
        status: 'success',
        title: 'Transfer Secure',
        message: response.message || `₹${amount} sent successfully.`,
        icon: <CheckCircle2 className="text-success" size={64} />
      });
      await fetchProfile();
    } catch (error) {
      if (error.blocked) {
        setResult({
            status: 'blocked',
            title: 'AUTONOMOUS LOCK',
            message: error.error || 'Account frozen due to high risk patterns.',
            icon: <ShieldAlert className="text-danger" size={64} />
          });
      } else if (error.status === 404 || error.error?.includes('Recipient not found')) {
        setResult({
            status: 'error',
            title: 'Protocol Error',
            message: 'Transfer blocked: Recipient not located within the VaultSight authorized banking network.',
            icon: <ShieldAlert className="text-warning" size={64} />
          });
      } else {
        setResult({
            status: 'error',
            title: 'Transfer Failed',
            message: error.error || 'Neural check failed. Please try again.',
            icon: <AlertTriangle className="text-danger" size={64} />
          });
      }
    } finally {
      setStep('result');
    }
  };

  const renderStep = () => {
    switch(step) {
        case 'list':
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-electric transition-colors">
                            <Search size={24} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Find recipient by name or handle..." 
                            className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-lg border-2 border-slate-100 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-bold italic text-sm text-navy-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredRecipients.length === 0 ? (
                             <div className="col-span-full py-20 text-center text-slate-400 font-bold italic">No authorized recipients located...</div>
                        ) : (
                            filteredRecipients.map(r => (
                                <button 
                                    key={r._id}
                                    onClick={() => {
                                        setRecipient(r.upiId);
                                        setStep('amount');
                                    }}
                                    className="flex items-center gap-4 p-5 bg-slate-50 hover:bg-electric/5 hover:border-electric border-2 border-transparent rounded-lg transition-all group text-left"
                                >
                                    <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center font-black text-electric group-hover:scale-110 transition-transform">
                                        {r.name.split(' ').map(n=>n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-black text-navy-900 text-sm group-hover:text-electric transition-colors">{r.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.upiId}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Manual Entry Mode</p>
                         <button 
                            onClick={() => {
                                setRecipient('');
                                setStep('amount');
                            }}
                            className="text-[10px] font-black text-electric uppercase tracking-widest hover:underline"
                        >
                            Enter UPI ID Manually
                        </button>
                    </div>
                </div>
            );
        case 'amount':
            return (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-5 duration-500">
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-navy-900 uppercase tracking-[0.4em] px-4 italic border-l-4 border-electric flex items-center gap-3">
                            Target Identity Handler
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-electric transition-colors">
                                <Search size={24} />
                            </div>
                            <input 
                            type="text" 
                            placeholder="Enter UPI ID" 
                            className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-lg border-2 border-slate-100 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black italic text-xl text-navy-900 placeholder:text-slate-200"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-navy-900 uppercase tracking-[0.4em] px-4 italic border-l-4 border-electric">
                            Quantum Payload Quantity
                        </label>
                        <div className="relative group">
                            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-6xl font-black text-electric/40 group-focus-within:text-electric transition-colors italic">₹</span>
                            <input 
                            type="number" 
                            placeholder="0.00" 
                            className="w-full pl-24 pr-8 py-12 bg-slate-50 rounded-lg border-2 border-slate-100 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black text-7xl italic text-navy-900 placeholder:text-slate-100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            />
                        </div>
                        <div className="flex flex-wrap gap-3 px-2 pt-2">
                             {[500, 5000, 25000, 100000].map(val => (
                                <button 
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val.toString())}
                                    className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 hover:border-electric hover:text-white hover:bg-electric transition-all shadow-sm"
                                >
                                    ₹{val < 1000 ? val : (val/1000) + 'K'}
                                </button>
                             ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="button" 
                            onClick={() => setStep('list')}
                            className="flex-1 py-6 bg-slate-100 text-slate-400 rounded-lg font-black italic text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Back
                        </button>
                        <button 
                            disabled={!amount || !recipient}
                            onClick={() => setStep('pin')}
                            className="flex-[2] py-6 bg-navy-900 text-white rounded-lg font-black italic text-sm uppercase tracking-widest hover:bg-electric transition-all shadow-xl disabled:opacity-30"
                        >
                            Proceed to Verify
                        </button>
                    </div>
                </div>
            );
        case 'pin':
            return (
                <div className="space-y-10 animate-in fade-in zoom-in duration-500 text-center py-10">
                    <div className="inline-flex p-6 bg-electric/10 rounded-lg border-4 border-white shadow-xl mb-6">
                        <ShieldCheck size={64} className="text-electric" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-navy-900 italic uppercase">Enter UPI PIN</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify authorization for payload dispatch</p>
                    </div>

                    <div className="max-w-[280px] mx-auto">
                         <input 
                            autoFocus
                            type="password" 
                            maxLength={6}
                            placeholder="......" 
                            className="w-full text-center py-6 bg-slate-50 rounded-lg border-2 border-slate-200 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black text-4xl tracking-[1em] text-navy-900"
                            value={upiPin}
                            onChange={(e) => {
                                setUpiPin(e.target.value);
                                if (e.target.value.length === 6) {
                                    // Could auto-submit
                                }
                            }}
                         />
                    </div>

                    <div className="flex gap-4 max-w-sm mx-auto">
                        <button 
                            type="button" 
                            onClick={() => setStep('amount')}
                            className="flex-1 py-5 bg-slate-100 text-slate-400 rounded-lg font-black italic text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Back
                        </button>
                        <button 
                            disabled={upiPin.length < 4}
                            onClick={handleSend}
                            className="flex-[2] py-5 bg-navy-900 text-white rounded-lg font-black italic text-xs uppercase tracking-widest hover:bg-electric transition-all shadow-xl disabled:opacity-30"
                        >
                            Confirm Dispatch
                        </button>
                    </div>
                </div>
            );
        default: return null;
    }
  };

  if (step === 'processing') {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur rounded-lg border border-white shadow-2xl animate-in fade-in duration-500">
        <div className="relative mb-10 scale-125">
           <div className="w-32 h-32 border-[8px] border-slate-100 rounded-full"></div>
           <div className="w-32 h-32 border-[8px] border-electric border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="text-electric animate-pulse" size={48} />
           </div>
        </div>
        <h2 className="text-3xl font-black text-navy-900 mb-4 italic uppercase tracking-tighter shadow-sm">{loadingMsg}</h2>
        <p className="text-slate-500 text-sm font-bold max-w-lg leading-relaxed italic">VaultSight AI is processing multidimensional embeddings to verify transaction intent and perimeter integrity.</p>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500 bg-white/50 backdrop-blur rounded-lg border border-white shadow-2xl">
        <div className="mb-10 p-10 bg-slate-50 rounded-lg border-4 border-white shadow-2xl relative">
           <div className="absolute -inset-2 bg-gradient-to-br from-electric/20 to-blue-500/10 blur-xl opacity-50"></div>
           <div className="relative z-10">{result.icon}</div>
        </div>
        <h2 className="text-4xl font-black text-navy-900 mb-4 italic uppercase tracking-tighter leading-none">{result.title}</h2>
        <p className={`font-bold text-base mb-14 max-w-md ${result.status === 'blocked' ? 'text-danger italic' : 'text-slate-500'}`}>
           {result.message}
        </p>
        <button 
           onClick={() => {
              if (result.status === 'success') navigate('/user/dashboard');
              else setStep('list');
           }}
           className="px-16 py-6 bg-navy-900 text-white rounded-lg font-black text-xs uppercase tracking-[0.3em] italic active:scale-95 transition-all shadow-2xl shadow-navy-900/30 hover:bg-electric"
        >
          {result.status === 'success' ? 'Return to Operations' : 'Reset Vector'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-lg text-navy-900 hover:bg-slate-50 active:scale-90 transition-all border border-slate-200 shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-navy-900 uppercase tracking-tighter italic">Funds Dispatch</h1>
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                <div className="w-2 h-2 bg-electric rounded-full"></div>
                Initializing Secure Protocol Matrix
             </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex flex-col text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Credit</p>
              <p className="text-lg font-black text-navy-900 italic">₹{user.balance?.toLocaleString()}</p>
           </div>
           <div className="p-3 bg-electric/10 text-electric rounded-lg">
              <Zap size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Main Form Area */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-lg p-12 border border-slate-200 shadow-sm relative overflow-hidden min-h-[600px]">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-electric/5 rounded-full blur-[80px]"></div>
           <div className="relative z-10 h-full">
              {renderStep()}
           </div>
        </div>

        {/* Informational Sidebar Area */}
        <div className="col-span-12 lg:col-span-5 space-y-10">
           <div className="bg-navy-900 rounded-lg p-10 text-white border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 text-electric/5 translate-x-1/4 -translate-y-1/4 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <ShieldAlert size={180} />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-electric/20 rounded-lg border border-electric/20">
                       <Activity size={24} className="text-electric" />
                    </div>
                    <h5 className="text-xs font-black uppercase tracking-[0.4em] italic shadow-lg shadow-black">Security Protocol 2.4</h5>
                 </div>
                 <div className="space-y-6">
                    <p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l-2 border-electric pl-6">
                       Every transaction is verified using high-dimensional vector embeddings. 
                       Autonomous locking will initialize if the payload deviates from your historical behavior matrix.
                    </p>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10 flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Level</p>
                          <p className="text-sm font-black text-success uppercase italic">Negligible</p>
                       </div>
                       <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-lg border border-slate-200 p-10 shadow-sm space-y-8">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic text-center">Protocol Reminders</h5>
              <div className="space-y-6">
                 {[
                   { icon: <History size={20}/>, title: "Traceability", text: "All transfers generate immutable ledger entries within your neural history." },
                   { icon: <CheckCircle2 size={20}/>, title: "UPI PIN", text: "Verified 6-digit PIN required for all outbound dispatches." },
                   { icon: <Users size={20}/>, title: "Directory", text: "Select from authorized recipients to bypass neural verification points." },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-5">
                      <div className="p-3 bg-slate-50 rounded-lg text-electric h-fit shadow-sm">{item.icon}</div>
                      <div className="space-y-1">
                         <h6 className="text-[11px] font-black text-navy-900 uppercase tracking-widest">{item.title}</h6>
                         <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{item.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
