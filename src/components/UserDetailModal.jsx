import React from 'react';
import { Shield, ShieldX, X } from 'lucide-react';

const UserDetailModal = ({ user, isOpen, onClose, onUnlock, onIssueCard }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
        <div className="bg-slate-50 px-12 py-10 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-navy-900 rounded-lg flex items-center justify-center font-black text-electric text-2xl shadow-2xl border-4 border-white">
              {user.name?.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h3 className="text-3xl font-black text-navy-900 italic tracking-tighter uppercase">{user.name}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] bg-electric/10 text-electric px-3 py-1 rounded-full font-black uppercase tracking-widest border border-electric/10">Customer ID: {user._id.slice(-8)}</span>
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-current ${
                  !user.isBlocked && !user.isLocked ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {!user.isBlocked && !user.isLocked ? 'Active Protocol' : 'Neural Lock Active'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-navy-900 transition-colors shadow-sm"><X size={20}/></button>
        </div>
        
        <div className="p-12 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Column 1: Financial */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Financial Core</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                  <p className="text-3xl font-black italic tracking-tighter text-navy-900">₹{user.balance?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                  <p className="text-sm font-bold font-mono text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">{user.accountNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">UPI Identity</p>
                  <p className="text-sm font-bold text-electric italic">{user.upiId}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Personal */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Identity Matrix</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Contact</p>
                  <p className="text-sm font-black text-navy-900">{user.mobile}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Handle</p>
                  <p className="text-sm font-black text-navy-900 italic">@{user.username}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Address</p>
                  <p className="text-sm font-bold text-slate-500 italic leading-relaxed">{user.address}</p>
                </div>
              </div>
            </div>

            {/* Column 3: Security */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-4">Security Perimeter</h4>
              <div className="space-y-6">
                <div className="p-5 bg-navy-900 rounded-lg border border-navy-800 shadow-xl shadow-navy-900/20">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Debit Card State</p>
                  <div className="space-y-4">
                    <p className="text-electric font-mono text-sm tracking-widest">{user.debitCard?.cardNumber}</p>
                    <div className="flex justify-between items-center">
                       <div>
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Expiry</p>
                         <p className="text-white text-xs font-bold">{user.debitCard?.expiryMonth}/{user.debitCard?.expiryYear}</p>
                       </div>
                       {!user.debitCard?.isIssued ? (
                          <button 
                            onClick={() => onIssueCard(user._id)}
                            className="px-4 py-2 bg-electric text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-navy-900 transition-all shadow-lg active:scale-95"
                          >
                            ISSUE CARD
                          </button>
                       ) : (
                          <div className="flex flex-col items-end">
                             <p className="text-[8px] font-black text-success uppercase tracking-widest">Active</p>
                             <Shield size={16} className="text-success" />
                          </div>
                       )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Neural Risk Score</p>
                  <div className="flex items-end gap-2">
                    <p className={`text-2xl font-black italic ${user.riskScore > 70 ? 'text-danger' : 'text-success'}`}>{user.riskScore || 0}%</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`mt-12 p-8 rounded-lg border flex items-center justify-between ${
            user.isLocked ? 'bg-danger/5 border-danger/10 text-danger' : 'bg-success/5 border-success/10 text-success'
          }`}>
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-lg ${user.isLocked ? 'bg-danger text-white shadow-xl shadow-danger/20' : 'bg-success text-white shadow-xl shadow-success/20'}`}>
                {user.isLocked ? <ShieldX size={32} /> : <Shield size={32} />}
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-black italic tracking-tighter uppercase mb-1">
                  {user.isLocked ? 'Autonomous Containment Active' : 'Neural Core Integrity Nominal'}
                </h5>
                <p className="text-xs font-bold italic opacity-70">
                  {user.isLocked ? `Locked due to: ${user.lockReason || 'Unusual Pattern Detection'}` : 'System monitoring for deviant behavioral clusters in real-time.'}
                </p>
              </div>
            </div>
            {user.isLocked && onUnlock && (
              <button 
                onClick={() => onUnlock(user._id)}
                className="px-10 py-4 bg-danger text-white rounded-lg font-black italic text-sm hover:bg-navy-900 hover:text-electric transition-all shadow-xl shadow-danger/20 active:scale-95"
              >
                INITIATE MANUAL OVERRIDE
              </button>
            )}
          </div>
        </div>
        
        <div className="px-12 py-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Last Neural Pulse: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never Synced'}
           </div>
           <button onClick={onClose} className="px-12 py-4 bg-navy-900 text-white font-black italic rounded-lg shadow-xl shadow-navy-900/20 hover:bg-electric transition-all active:scale-95">CLOSE VAULT</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
