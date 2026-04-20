import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Send, Smartphone, Clock, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

const UPITransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/admin/transactions');
        // Filter for UPI-like transactions or just show all
        setTransactions(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle2 size={16} className="text-success" />;
      case 'PENDING': return <Clock size={16} className="text-warning" />;
      case 'FLAGGED': return <AlertTriangle size={16} className="text-danger" />;
      case 'BLOCKED': return <XCircle size={16} className="text-danger" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Synchronizing UPI Ledger...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter italic">UPI Transaction Logs</h1>
          <p className="text-slate-500 text-sm">Monitor peer-to-peer transfers and merchant UPI payments in real-time.</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
           Index Count: {transactions.length}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-left">Sender Context</th>
              <th className="px-6 py-5 text-left">Receiver Identity</th>
              <th className="px-6 py-5 text-left">Payload Amount</th>
              <th className="px-6 py-5 text-left">Temporal Lock</th>
              <th className="px-6 py-5 text-center">Neural Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length > 0 ? transactions.map((txn) => (
              <tr key={txn._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="font-black text-navy-900 italic text-sm">{txn.userId?.name || 'Authorized User'}</span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{txn.transactionId}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-electric" />
                      <span className="font-bold text-slate-600 italic text-xs">{txn.receiverUpiId}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className="font-black text-navy-900 text-lg italic tracking-tighter">₹{txn.amount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5 font-bold text-slate-400 text-xs">
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       txn.status === 'COMPLETED' ? 'bg-success/10 text-success' : 
                       txn.status === 'FLAGGED' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                    }`}>
                       {getStatusIcon(txn.status)}
                       {txn.status}
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                   <div className="flex flex-col items-center gap-2 opacity-20">
                      <Search size={48} />
                      <p className="font-bold uppercase tracking-widest text-sm text-slate-900">No Transaction Vectors Located</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UPITransactions;
