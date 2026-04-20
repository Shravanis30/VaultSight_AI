import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../lib/api';
import { Filter, Search, ChevronDown, ChevronUp, AlertCircle, MapPin, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionLogs = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Logs fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    filter === 'All' || t.riskLevel === filter
  );

  const getRiskColor = (level) => {
    switch(level) {
      case 'LOW': return 'bg-success text-success';
      case 'MEDIUM': return 'bg-warning text-warning';
      case 'HIGH': return 'bg-danger text-danger';
      default: return 'bg-slate-500 text-slate-500';
    }
  };

  const handleInvestigate = (txn) => {
    const query = txn.riskFlags?.length > 0 
      ? `Transaction ${txn.transactionId} with flags: ${txn.riskFlags.join(', ')} in ${txn.location}`
      : `${txn.riskLevel} risk transaction ${txn.transactionId} at ${txn.location} using ${txn.device}`;
    
    navigate(`/threat/search?query=${encodeURIComponent(query)}`);
  };

  const handleFlagFalsePositive = async (txnId) => {
    setUpdatingId(txnId);
    try {
      await api.post(`/admin/transactions/${txnId}/status`, { status: 'COMPLETED' });
      // Update local state
      setTransactions(prev => prev.map(t => t._id === txnId ? { ...t, status: 'COMPLETED' } : t));
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update transaction status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center p-20">
       <div className="w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-900">Transaction Logs</h1>
          <p className="text-slate-500 text-sm">Real-time monitoring of all banking transactions across the network.</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
           <div className="flex flex-wrap bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
             {['All', 'LOW', 'MEDIUM', 'HIGH'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/20 translate-y-[-2px]' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {f === 'All' ? 'Global Feed' : `${f} Risk Matrix`}
               </button>
             ))}
           </div>
           
           <div className="flex items-center gap-3 w-full lg:w-auto">
             <button 
              onClick={() => fetchLogs()} 
              className="flex-1 lg:flex-none bg-white border border-slate-200 px-6 py-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all shadow-sm active:scale-95 italic"
             >
                <Filter size={14} className="text-electric" /> Update Intelligence Feed
             </button>
           </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1100px]">
               <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] border-b border-slate-200">
                  <tr>
                     <th className="px-10 py-6 text-left italic">Transaction Vector</th>
                     <th className="px-10 py-6 text-left italic">Sender/Recipient Pulse</th>
                     <th className="px-10 py-6 text-left italic">Financial Payload</th>
                     <th className="px-10 py-6 text-left italic">Gateway/Identity</th>
                     <th className="px-10 py-6 text-left italic">Neural Risk</th>
                     <th className="px-10 py-6 text-left italic">Status</th>
                     <th className="px-10 py-6"></th>
                  </tr>
               </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? filteredTransactions.map((txn) => (
                  <React.Fragment key={txn._id}>
                    <tr 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedRow === txn._id ? 'bg-slate-50/80' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === txn._id ? null : txn._id)}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">
                        {txn.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{txn.senderUpiId || 'LEGACY_SYNC'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(txn.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold">₹</span>
                          <span className="text-lg font-black text-slate-900">{txn.amount?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin size={12} className="text-slate-400" /> {txn.location || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Smartphone size={12} className="text-slate-400" /> {txn.device || 'Direct API'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${getRiskColor(txn.riskLevel).split(' ')[0]}`}></div>
                           <span className={`text-xs font-black tracking-tighter uppercase ${getRiskColor(txn.riskLevel).split(' ')[1]}`}>
                             {txn.riskLevel}
                           </span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                           txn.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                           txn.status === 'FLAGGED' ? 'bg-warning/10 text-warning' :
                           'bg-danger/10 text-danger'
                         }`}>
                           {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {expandedRow === txn._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                    </tr>
                    {expandedRow === txn._id && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={7} className="px-8 py-6 border-l-4 border-navy-900">
                          <div className="flex gap-12">
                             <div className="space-y-4 flex-1">
                               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Intelligence</h4>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Risk Score</p>
                                     <div className="flex items-end gap-2">
                                        <p className="text-2xl font-black text-slate-900">{txn.riskScore}</p>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-1">
                                          <div className={`h-full rounded-full ${txn.riskScore > 70 ? 'bg-danger' : txn.riskScore > 30 ? 'bg-warning' : 'bg-success'}`} style={{width: `${txn.riskScore}%`}}></div>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Device IP / Fingerprint</p>
                                     <p className="text-xs font-mono text-slate-600 truncate">{txn.ipAddress || '192.168.1.xxx'}</p>
                                  </div>
                               </div>
                               {txn.riskFlags?.length > 0 && (
                                 <div className="bg-danger/5 border border-danger/20 p-4 rounded-lg flex gap-3">
                                    <AlertCircle className="text-danger shrink-0" size={18} />
                                    <div>
                                      <p className="text-xs font-bold text-danger uppercase tracking-tight">Threat Signature Detected</p>
                                      <p className="text-sm text-danger/80">{txn.riskFlags.join(', ')}</p>
                                    </div>
                                 </div>
                               )}
                             </div>
                             <div className="w-64 space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Actions</h4>
                                <div className="space-y-2">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleInvestigate(txn); }}
                                     className="w-full py-2 bg-navy-900 text-white rounded-lg text-sm font-bold shadow-sm shadow-navy-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                   >
                                     <Search size={14} /> Investigate Cluster
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleFlagFalsePositive(txn._id); }}
                                     disabled={updatingId === txn._id || txn.status === 'COMPLETED'}
                                     className={`w-full py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-2 ${txn.status === 'COMPLETED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                   >
                                     {updatingId === txn._id ? (
                                       <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
                                     ) : txn.status === 'COMPLETED' ? (
                                       <><CheckCircle2 size={14} className="text-success" /> Marked Safe</>
                                     ) : (
                                       'Flag as False Positive'
                                     )}
                                   </button>
                                </div>
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-bold italic">No transaction records detected in this cycle.</td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionLogs;
