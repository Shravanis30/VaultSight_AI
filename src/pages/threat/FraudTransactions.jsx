import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ShieldAlert, MapPin, Smartphone, ArrowRight, Eye, AlertCircle, Clock, ShieldX } from 'lucide-react';
import TransactionDetailModal from '../../components/TransactionDetailModal';

const FraudTransactions = () => {
  const [fraudTxns, setFraudTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    const fetchFraud = async () => {
      try {
        const response = await api.get('/admin/transactions');
        // Only show FLAGGED or HIGH risk
        const filtered = response.data.filter(t => t.riskLevel === 'HIGH' || t.status === 'FLAGGED');
        setFraudTxns(filtered);
      } catch (err) {
        console.error('Fraud logs fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFraud();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center p-20">
       <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Anomalous Audit</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2 italic leading-none">
            <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse"></span>
            Critical Signal Intelligence Feed
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-danger px-6 py-3 rounded-lg text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-danger/20">
              <ShieldAlert size={16} />
              Focus Matrix Enabled
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fraudTxns.length > 0 ? fraudTxns.map((txn) => (
          <div key={txn._id} className="bg-navy-800/30 border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col group hover:translate-y-[-4px] transition-all duration-500">
             <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase font-mono">#{txn.transactionId.slice(-8)}</span>
                <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${txn.riskLevel === 'HIGH' ? 'bg-danger text-white border-danger/30 shadow-lg shadow-danger/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                   {txn.riskLevel}
                </div>
             </div>
             <div className="p-8 flex-1 flex flex-col space-y-8">
                <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Origin Node</p>
                   <h3 className="text-xl font-black text-white italic tracking-tight truncate uppercase">{txn.senderUpiId}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1.5">Value</p>
                      <p className="text-lg font-black text-white italic tracking-tighter">₹{txn.amount?.toLocaleString()}</p>
                   </div>
                   <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1.5">Risk Vector</p>
                      <p className="text-lg font-black text-danger italic tracking-tighter">{txn.riskScore}/100</p>
                   </div>
                </div>

                <div className="space-y-4 pt-2">
                   <div className="flex items-center gap-3 text-slate-400">
                      <MapPin size={16} className="text-danger opacity-60" />
                      <span className="text-[10px] font-bold uppercase tracking-widest italic">{txn.location || 'Unknown Node'}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <Smartphone size={16} className="text-electric opacity-60" />
                      <span className="text-[10px] font-bold uppercase tracking-widest italic">{txn.device || 'API Endpoint'}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-400">
                      <Clock size={16} className="text-slate-600" />
                      <span className="text-[10px] font-black uppercase italic">{new Date(txn.createdAt).toLocaleString()}</span>
                   </div>
                </div>

                <div className="pt-6 mt-auto border-t border-white/5 flex gap-3">
                   <button 
                     onClick={() => setSelectedTxn(txn)}
                     className="flex-1 py-3.5 bg-danger text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl shadow-danger/20 hover:bg-white hover:text-danger hover:shadow-none transition-all active:scale-95"
                   >
                     Audit Vector
                   </button>
                   <button 
                     onClick={() => setSelectedTxn(txn)}
                     className="p-3.5 bg-navy-950 text-slate-500 rounded-lg hover:text-white transition-colors border border-white/5"
                   >
                      <Eye size={18} />
                   </button>
                </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center gap-6 opacity-30">
             <ShieldX size={80} className="text-slate-500" />
             <p className="text-xl font-black uppercase tracking-[0.4em] text-slate-500 italic">Perimeter Integrity Nominal</p>
          </div>
        )}
      </div>

      <TransactionDetailModal 
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </div>
  );
};

export default FraudTransactions;
