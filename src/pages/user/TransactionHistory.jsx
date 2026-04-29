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

  const [selectedTxn, setSelectedTxn] = useState(null);

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
    t.displayIdentity?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.transactionId?.includes(searchTerm) ||
    t.receiverUpiId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in slide-in-from-right-10 duration-500 pb-20">
      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-md" onClick={() => setSelectedTxn(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Protocol Record</p>
                   <h3 className="text-xl font-black text-navy-900 uppercase italic tracking-tighter">Transaction Detail</h3>
                </div>
                <button onClick={() => setSelectedTxn(null)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">
                   <ChevronLeft size={24} className="text-slate-400" />
                </button>
             </div>

             <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${selectedTxn.type === 'send' ? 'bg-danger/5 text-danger' : 'bg-success/5 text-success'} border border-current/10 shadow-sm`}>
                         {selectedTxn.type === 'send' ? <TrendingDown size={32} /> : <TrendingUp size={32} />}
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-navy-900 italic uppercase tracking-tighter">{selectedTxn.displayIdentity}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTxn.transactionId}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-3xl font-black italic tracking-tighter ${selectedTxn.type === 'send' ? 'text-navy-900' : 'text-success'}`}>
                        {selectedTxn.type === 'send' ? '-' : '+'}₹{selectedTxn.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Payload Quantity</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temporal Stamp</p>
                      <p className="text-sm font-black text-navy-900 italic uppercase">{new Date(selectedTxn.createdAt).toLocaleString()}</p>
                   </div>
                   <div className="text-right space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</p>
                      <p className={`text-sm font-black italic uppercase ${selectedTxn.status === 'COMPLETED' ? 'text-success' : 'text-warning'}`}>{selectedTxn.status}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Node</p>
                      <p className="text-sm font-black text-navy-900 italic uppercase">{selectedTxn.device || 'Legacy Sync'}</p>
                   </div>
                   <div className="text-right space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Geolocation Vector</p>
                      <p className="text-sm font-black text-navy-900 italic uppercase">{selectedTxn.location || 'Unknown'}</p>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Encryption Note</p>
                   <p className="text-xs font-bold text-navy-900 italic opacity-80 leading-relaxed">
                      {selectedTxn.note || "No additional payload descriptions provided."}
                   </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-navy-900 rounded-lg text-white">
                   <ShieldCheck className="text-electric" size={20} />
                   <p className="text-[9px] font-black uppercase tracking-widest italic">Hash Verified by VaultSight Neural Network</p>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => navigate(-1)} className="p-3 md:p-4 bg-white rounded-lg text-navy-900 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-black text-navy-900 uppercase tracking-tighter italic leading-none truncate">Neural Logs</h1>
            <div className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 italic flex items-center gap-2">
               <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-success rounded-full"></div>
               Immutable Transaction Ledger
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 md:gap-4">
           <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-white border border-slate-200 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest text-navy-900 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={14} className="md:w-4 md:h-4 text-electric" />
              Secure Export
           </button>
           <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-navy-900 text-white rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-electric transition-all shadow-2xl shadow-navy-900/10">
              <Filter size={14} className="md:w-4 md:h-4" />
              Refine Vector
           </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Search Header */}
        <div className="p-4 md:p-10 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4 md:gap-8">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors" size={18} className="md:w-5 md:h-5" />
              <input 
                type="text" 
                placeholder="Locate entries by UUID, Recipient..." 
                className="w-full pl-12 md:pl-16 pr-4 md:pr-8 py-3 md:py-5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-bold focus:ring-8 focus:ring-electric/5 outline-none transition-all shadow-sm italic placeholder:text-slate-300"
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
                     <th className="py-4 md:py-6 px-6 md:px-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 border-b border-slate-100 italic whitespace-nowrap">Vector Identity</th>
                     <th className="py-4 md:py-6 px-6 md:px-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 border-b border-slate-100 italic whitespace-nowrap">Temporal Key</th>
                     <th className="py-4 md:py-6 px-6 md:px-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 border-b border-slate-100 italic text-center whitespace-nowrap">Protocol Status</th>
                     <th className="py-4 md:py-6 px-6 md:px-10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400 border-b border-slate-100 italic text-right pr-12 whitespace-nowrap">Payload Quantity</th>
                  </tr>
                </thead>
               <tbody className="divide-y divide-slate-50">
                 {filtered.map((txn) => (
                   <tr key={txn._id} onClick={() => setSelectedTxn(txn)} className="group hover:bg-slate-50/60 transition-all cursor-pointer relative">
                       <td className="py-6 md:py-8 px-6 md:px-10">
                          <div className="flex items-center gap-4 md:gap-6">
                             <div className={`w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${txn.type === 'send' ? 'bg-danger/5 text-danger' : 'bg-success/5 text-success'} border border-current/10 shadow-sm shrink-0`}>
                                {txn.type === 'send' ? <TrendingDown size={18} className="md:w-6 md:h-6" /> : <TrendingUp size={18} className="md:w-6 md:h-6" />}
                             </div>
                             <div className="space-y-1 min-w-[150px] md:min-w-[200px]">
                                <h4 className="font-black text-navy-900 text-sm md:text-base tracking-tight italic truncate uppercase">{txn.displayIdentity || 'Internal Arc Sync'}</h4>
                                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono truncate max-w-[100px] md:max-w-none">{txn.transactionId}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-6 md:py-8 px-6 md:px-10">
                          <div className="space-y-1 whitespace-nowrap">
                             <p className="text-xs md:text-sm font-black text-navy-900 italic uppercase">{new Date(txn.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</p>
                             <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 md:gap-2">
                                <Clock size={10} className="md:w-3 md:h-3 text-electric" />
                                {new Date(txn.createdAt).toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'})}
                             </p>
                          </div>
                       </td>
                       <td className="py-6 md:py-8 px-6 md:px-10 text-center">
                          <div className={`inline-flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${
                             txn.status === 'COMPLETED' ? 'bg-success/10 text-success border border-success/10' : 
                             txn.status === 'FLAGGED' ? 'bg-warning/10 text-warning border border-warning/10' : 
                             'bg-danger/10 text-danger border border-danger/10'
                          }`}>
                             <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${txn.status === 'COMPLETED' ? 'bg-success' : 'bg-warning animate-ping'}`}></div>
                             {txn.status}
                          </div>
                       </td>
                       <td className="py-6 md:py-8 px-6 md:px-10 text-right pr-6 md:pr-12">
                          <div className="space-y-1 whitespace-nowrap">
                             <p className={`text-lg md:text-2xl font-black italic tracking-tighter ${txn.type === 'send' ? 'text-navy-900' : 'text-success'}`}>
                                {txn.type === 'send' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                             </p>
                             {txn.riskLevel === 'LOW' ? (
                                <div className="inline-flex items-center gap-1 text-[8px] md:text-[9px] font-black text-success uppercase tracking-[0.2em] italic">
                                   <ShieldCheck size={10} className="md:w-3 md:h-3" />
                                   Secured Vector
                                </div>
                             ) : (
                                <div className="inline-flex items-center gap-1 text-[8px] md:text-[9px] font-black text-danger uppercase tracking-[0.2em] italic">
                                   <AlertCircle size={10} className="md:w-3 md:h-3" />
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

      <div className="bg-navy-900 rounded-lg p-6 md:p-12 text-white border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
         <div className="absolute -top-12 -left-12 w-64 h-64 bg-electric/10 rounded-full blur-[80px]"></div>
         <div className="relative z-10 space-y-4 max-w-2xl text-center md:text-left">
            <h5 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">Global Log Synchronization</h5>
            <p className="text-xs md:text-sm font-medium text-slate-400 leading-relaxed italic">
               Your logs are cryptographically hashed and synchronized across regional nodes for maximum redundancy. 
               Any dispute can be initiated directly with our SOC analyst team.
            </p>
         </div>
         <button className="w-full md:w-auto relative z-10 px-8 md:px-12 py-4 md:py-5 bg-white text-navy-900 rounded-lg font-black text-[10px] md:text-xs uppercase tracking-[0.2em] italic hover:bg-electric hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap">
            Initialize Regional Sync
         </button>
      </div>
    </div>
  );
};

export default TransactionHistory;
