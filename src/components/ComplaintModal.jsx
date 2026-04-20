import React, { useState } from 'react';
import { ShieldAlert, Send, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ComplaintModal = ({ isOpen, onClose, transactionId }) => {
  const { raiseComplaint } = useApp();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await raiseComplaint({
        subject,
        description,
        transactionId
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSubject('');
        setDescription('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
        <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-navy-900 italic tracking-tighter uppercase">Initialize Dispute</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct SOC Perimeter Communication</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-navy-900 transition-colors">✕</button>
        </div>

        {success ? (
          <div className="p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto transition-all animate-bounce">
              <ShieldAlert size={40} />
            </div>
            <h4 className="text-2xl font-black text-navy-900 italic uppercase">Complaint Registered</h4>
            <p className="text-sm font-bold text-slate-500 italic">Dispute vector ID generated. SOC analysts notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-[10px] font-black flex items-center gap-2 uppercase tracking-tight">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-2">Dispute Subject</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Unauthorized Transaction" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-8 focus:ring-electric/5 focus:border-electric outline-none font-bold italic text-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-2">Incident Details</label>
              <textarea 
                required
                placeholder="Describe the anomaly in detail..." 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-8 focus:ring-electric/5 focus:border-electric outline-none font-bold italic text-sm h-32 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {transactionId && (
              <div className="p-4 bg-navy-900/5 rounded-lg border border-navy-900/10 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Vector</span>
                <span className="text-[10px] font-mono font-bold text-navy-900">#{transactionId.slice(-8)}</span>
              </div>
            )}

            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full py-5 bg-navy-900 text-white rounded-lg font-black italic text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-electric transition-all shadow-xl shadow-navy-900/20 disabled:opacity-50"
            >
              {isSubmitting ? 'SYNCING DISPUTE...' : 'DEPLOY COMPLAINT'}
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComplaintModal;
