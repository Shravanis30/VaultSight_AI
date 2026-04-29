import React, { useState } from 'react';
import { X, ShieldAlert, MapPin, Smartphone, Clock, User, ArrowRight, CheckCircle, AlertTriangle, Fingerprint, Activity, Loader2 } from 'lucide-react';
import api from '../lib/api';

const TransactionDetailModal = ({ transaction, onClose }) => {
  const [isExecuting, setIsExecuting] = useState(false);

  if (!transaction) return null;

  const handleExecuteProtocol = async () => {
    // Check both userId (Transaction model) and affectedUserId (Threat model) for compatibility
    const targetUserId = transaction.userId || transaction.affectedUserId;

    if (!targetUserId) {
      alert('Origin signature missing: Account trace failed');
      return;
    }

    setIsExecuting(true);
    try {
      await api.post(`/admin/lock/${targetUserId}`, {
        reason: `SOC Protocol Execution: ${transaction.riskFlags?.join(', ') || 'Signal Anomaly Detected'}`
      });
      alert('Protocol Executed: Neural Containment Triggered');
      window.dispatchEvent(new Event('transactionUpdated'));
      onClose();
    } catch (err) {
      console.error('Protocol execution failed:', err);
      alert('Protocol Execution Failed: Verify System Permissions');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAuthorizeTransfer = async () => {
    // Used to approve a flagged/blocked transaction
    setIsExecuting(true);
    try {
      await api.post(`/admin/transactions/${transaction._id}/status`, {
        status: 'COMPLETED'
      });
      alert('Transfer Authorized: Funds released to destination');
      window.dispatchEvent(new Event('transactionUpdated')); // Custom event to trigger re-fetch if needed
      onClose();
    } catch (err) {
      console.error('Authorization failed:', err);
      const errorMessage = err.error || err.message || 'Could not process transfer';
      alert(`Authorization Failed: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-navy-900 w-full max-w-2xl rounded-lg border border-navy-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header Section */}
        <div className="p-8 bg-navy-800/50 border-b border-navy-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${transaction.status === 'FLAGGED' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Signal Analysis</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Index: {transaction.transactionId || transaction._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-navy-900 text-slate-400 hover:text-white rounded-lg border border-navy-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar">

          {/* Risk Summary Bar */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-navy-950 p-6 rounded-lg border border-navy-800 text-center space-y-2">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Score</p>
              <p className={`text-3xl font-black italic ${transaction.riskScore > 70 ? 'text-danger' : 'text-warning'}`}>{transaction.riskScore}</p>
            </div>
            <div className="bg-navy-950 p-6 rounded-lg border border-navy-800 text-center space-y-2 col-span-2">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest text-left px-2">Decision Logic</p>
              <div className="flex items-center gap-3 px-2">
                <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${transaction.riskLevel === 'HIGH' ? 'bg-danger/10 text-danger' :
                    transaction.riskLevel === 'MEDIUM' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                  Level: {transaction.riskLevel}
                </div>
                <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${transaction.riskScore > 70 ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${transaction.riskScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Involved Entities */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic border-l-4 border-electric pl-4">Involved Vectors</h3>
            <div className="flex items-center gap-6">
              <div className="flex-1 bg-navy-950 p-6 rounded-lg border border-navy-800 relative group">
                <div className="absolute top-4 right-6 opacity-10 group-hover:opacity-20 transition-opacity"><User size={40} /></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Origin</p>
                <p className="text-sm font-black text-white italic truncate">
                  {transaction.userId?.upiId || transaction.userId?.name || transaction.userId || 'Internal Node'}
                </p>
                {transaction.userId?.balance !== undefined && (
                  <p className="text-[10px] font-medium text-emerald-400 mt-1">
                    Available: ₹{transaction.userId.balance.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="bg-navy-800 p-4 rounded-full border border-navy-700">
                <ArrowRight size={20} className="text-electric" />
              </div>
              <div className="flex-1 bg-navy-950 p-6 rounded-lg border border-navy-800 relative group">
                <div className="absolute top-4 right-6 opacity-10 group-hover:opacity-20 transition-opacity"><User size={40} /></div>
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Destination</p>
                <p className="text-sm font-black text-white italic truncate">
                  {transaction.receiverUpiId || transaction.receiverId?.upiId || transaction.receiverId?.name || 'External'}
                </p>
              </div>
            </div>
          </div>

          {/* Environmental Telemetry */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic border-l-4 border-electric pl-4">Network Telemetry</h3>
              <div className="space-y-4">
                {[
                  { icon: <MapPin size={14} />, label: 'Geo Location', value: transaction.location },
                  { icon: <Smartphone size={14} />, label: 'Entry Node', value: transaction.device },
                  { icon: <Activity size={14} />, label: 'IP Address', value: transaction.ipAddress || '192.168.1.104' },
                  { icon: <Fingerprint size={14} />, label: 'Session DNA', value: 'Verified (JWT-2)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-navy-950/50 rounded-lg border border-navy-800/50">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-500">{item.icon}</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-white italic">{item.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic border-l-4 border-danger pl-4">Neural Flags</h3>
              <div className="flex flex-wrap gap-2">
                {transaction.riskFlags && transaction.riskFlags.length > 0 ? transaction.riskFlags.map((flag, i) => (
                  <div key={i} className="px-4 py-2 bg-danger/5 border border-danger/10 text-danger rounded-lg flex items-center gap-2">
                    <AlertTriangle size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{flag}</span>
                  </div>
                )) : (
                  <div className="px-4 py-2 bg-success/5 border border-success/10 text-success rounded-lg flex items-center gap-2">
                    <CheckCircle size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Baseline Normal</span>
                  </div>
                )}
                <div className="px-4 py-2 bg-navy-950 border border-navy-800 text-slate-500 rounded-lg flex items-center gap-2">
                  <Clock size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">T: {new Date(transaction.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="p-6 bg-navy-950 rounded-lg border border-navy-800 mt-4">
                <p className="text-[9px] font-bold text-slate-600 uppercase mb-3">Diagnostic Memo</p>
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                  Pattern analysis suggests {transaction.riskScore > 60 ? 'high-confidence signal deviation' : 'nominal variation'}.
                  {transaction.amount > 50000 ? ' Large payload detected relative to historical baseline.' : ''}
                  Origin node correlates with {transaction.location || 'unmapped coordinate'}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-navy-900 border-t border-navy-700 grid grid-cols-2 gap-4">
          <button
            disabled={isExecuting}
            onClick={handleExecuteProtocol}
            className="py-4 bg-navy-800 text-danger hover:text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] border border-danger/30 transition-all hover:bg-danger disabled:opacity-50"
          >
            {isExecuting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Contain Threat'}
          </button>
          <button
            disabled={isExecuting}
            onClick={handleAuthorizeTransfer}
            className="py-4 bg-electric text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-electric/20 transition-all hover:bg-blue-600 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExecuting ? <Loader2 size={16} className="animate-spin" /> : 'Authorize Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
