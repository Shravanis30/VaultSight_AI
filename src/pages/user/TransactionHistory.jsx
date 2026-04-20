import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  ChevronLeft, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Download,
  Filter,
  ArrowRight
} from 'lucide-react';

const TransactionHistory = () => {
  const { user } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('user/transactions');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [user]);

  if (!user || loading) return (
    <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
       <div className="w-16 h-16 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
       <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic animate-pulse">Synchronizing Regional Vault Logs...</p>
    </div>
  );

  const filtered = history.filter(t => 
    t.receiverUpiId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.transactionId?.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-in slide-in-from-right-10 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-lg text-navy-900 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-navy-900 uppercase tracking-tighter italic leading-none">Neural Logs</h1>
            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <div className="w-2 h-2 bg-success rounded-full"></div>
               Immutable Transaction Ledger
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-navy-900 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={16} className="text-electric" />
              Secure Export
           </button>
           <button className="flex items-center gap-3 px-8 py-4 bg-navy-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-electric transition-all shadow-2xl shadow-navy-900/10">
              <Filter size={16} />
              Refine Vector
           </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Search Header */}
        <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex items-center gap-8">
           <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Locate entries by UUID, Recipient, or Metadata keys..." 
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-8 focus:ring-electric/5 outline-none transition-all shadow-sm italic placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="hidden lg:flex items-center gap-6 pr-4">
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Index</p>
                 <p className="text-xs font-black text-navy-900 uppercase">{history.length} Entities</p>
              </div>
           </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-x-auto">
           {filtered.length > 0 ? (
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 italic">Vector Identity</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 italic">Temporal Key</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 italic text-center">Protocol Status</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 italic text-right pr-12">Payload Quantity</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {filtered.map((txn) => (
                   <tr key={txn._id} className="group hover:bg-slate-50/60 transition-all cursor-default relative">
                      <td className="py-8 px-10">
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${txn.type === 'send' ? 'bg-danger/5 text-danger' : 'bg-success/5 text-success'} border border-current/10 shadow-sm shrink-0`}>
                               {txn.type === 'send' ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                            </div>
                            <div className="space-y-1 min-w-[200px]">
                               <h4 className="font-black text-navy-900 text-base tracking-tight italic truncate uppercase">{txn.receiverUpiId || 'Internal Arc Sync'}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{txn.transactionId}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-8 px-10">
                         <div className="space-y-1">
                            <p className="text-sm font-black text-navy-900 italic uppercase">{new Date(txn.createdAt).toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                               <Clock size={12} className="text-electric" />
                               {new Date(txn.createdAt).toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'})}
                            </p>
                         </div>
                      </td>
                      <td className="py-8 px-10 text-center">
                         <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            txn.status === 'COMPLETED' ? 'bg-success/10 text-success border border-success/10' : 
                            txn.status === 'FLAGGED' ? 'bg-warning/10 text-warning border border-warning/10' : 
                            'bg-danger/10 text-danger border border-danger/10'
                         }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${txn.status === 'COMPLETED' ? 'bg-success' : 'bg-warning animate-ping'}`}></div>
                            {txn.status}
                         </div>
                      </td>
                      <td className="py-8 px-10 text-right pr-12">
                         <div className="space-y-1">
                            <p className={`text-2xl font-black italic tracking-tighter ${txn.type === 'send' ? 'text-navy-900' : 'text-success'}`}>
                               {txn.type === 'send' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                            </p>
                            {txn.riskLevel === 'LOW' ? (
                               <div className="inline-flex items-center gap-1 text-[9px] font-black text-success uppercase tracking-[0.2em] italic">
                                  <ShieldCheck size={12} />
                                  Secured Vector
                               </div>
                            ) : (
                               <div className="inline-flex items-center gap-1 text-[9px] font-black text-danger uppercase tracking-[0.2em] italic">
                                  <AlertCircle size={12} />
                                  Risk Flagged
                               </div>
                            )}
                         </div>
                      </td>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                         <button className="p-3 bg-white rounded-lg border border-slate-200 text-electric shadow-xl active:scale-95">
                            <ArrowRight size={20} />
                         </button>
                      </div>
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8 bg-slate-50/20 grayscale opacity-40">
                <div className="p-12 bg-white rounded-full border border-slate-100 shadow-inner">
                   <AlertCircle size={80} className="text-slate-200" />
                </div>
                <div>
                   <h5 className="text-xl font-black text-slate-400 uppercase tracking-[0.4em] italic mb-2">Zero Dimensional Logs</h5>
                   <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">No matching vectors located in primary indexes.</p>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="bg-navy-900 rounded-lg p-12 text-white border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="absolute -top-12 -left-12 w-64 h-64 bg-electric/10 rounded-full blur-[80px]"></div>
         <div className="relative z-10 space-y-4 max-w-2xl">
            <h5 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Global Log Synchronization</h5>
            <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
               Your logs are cryptographically hashed and synchronized across regional nodes for maximum redundancy. 
               Any dispute regarding the temporal keys above can be initiated directly with our SOC analyst team.
            </p>
         </div>
         <button className="relative z-10 px-12 py-5 bg-white text-navy-900 rounded-lg font-black text-xs uppercase tracking-[0.2em] italic hover:bg-electric hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap">
            Initialize Regional Sync
         </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
