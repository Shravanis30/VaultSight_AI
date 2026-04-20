import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  CreditCard, 
  Activity, 
  Search, 
  AlertTriangle, 
  Eye, 
  Unlock, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import UserDetailModal from '../../components/UserDetailModal';

const SecurityControl = () => {
  const { users, fetchUsers } = useApp();
  const [stats, setStats] = useState({
    lockedUsers: 0,
    activeThreats: 0,
    flaggedToday: 0,
    alertsActive: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats({
          lockedUsers: response.data.lockedUsers,
          activeThreats: response.data.flaggedTransactions, 
          flaggedToday: response.data.flaggedTransactions,
          alertsActive: response.data.recentAlerts?.length || 0
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    fetchUsers();
    fetchStats();
  }, []);

  const lockedUsersList = users.filter(u => u.isLocked);

  const handleUnlock = async (userId) => {
    try {
      await api.post(`/admin/unlock/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Unlock failed');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-900 italic tracking-tighter uppercase">Security Control Center</h1>
          <p className="text-slate-500 text-sm font-medium italic">Autonomous response matrix and manual override protocols.</p>
        </div>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-success/5 text-success rounded-lg border border-success/10 shadow-sm">
           <ShieldCheck size={20} className="animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Guard Protocol: Active</span>
        </div>
      </div>

       {/* Top Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Locked Accounts', value: stats.lockedUsers, icon: <Users size={24}/>, color: 'text-danger', bg: 'bg-red-50' },
          { label: 'Active Threats', value: stats.activeThreats, icon: <ShieldAlert size={24}/>, color: 'text-warning', bg: 'bg-amber-50' },
          { label: 'Flagged Today', value: stats.flaggedToday, icon: <CreditCard size={24}/>, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Alerts Active', value: stats.alertsActive, icon: <Activity size={24}/>, color: 'text-electric', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-xl hover:translate-y-[-4px] group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 group-hover:text-electric transition-colors">{stat.label}</p>
              <p className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center shadow-inner border-4 border-white`}>
               {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        {/* Main Table section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
             <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <h2 className="font-black text-navy-900 uppercase italic tracking-tighter flex items-center gap-4 text-2xl">
                   <AlertTriangle className="text-danger animate-bounce-slow" size={28} />
                   Containment Queue
                </h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-6 py-2 rounded-full border border-slate-100 italic">
                   L2 Review Required
                </div>
             </div>
             <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[800px]">
                   <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] border-b border-slate-200">
                      <tr>
                        <th className="px-10 py-6 text-left italic">Subject Identity</th>
                        <th className="px-10 py-6 text-left italic">Core Vector</th>
                        <th className="px-10 py-6 text-left italic">Breach Reason</th>
                        <th className="px-10 py-6 text-left italic">Event Time</th>
                        <th className="px-10 py-6 text-right italic">Override</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {lockedUsersList.length > 0 ? lockedUsersList.map(user => (
                        <tr key={user._id} className="hover:bg-slate-50/50 transition-all group">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center text-sm font-black text-electric shadow-xl border-2 border-white">
                                    {user.name?.split(' ').map(n=>n[0]).join('')}
                                 </div>
                                 <span className="font-black text-navy-900 group-hover:text-electric transition-colors italic tracking-tighter text-lg">{user.name}</span>
                              </div>
                           </td>
                           <td className="px-10 py-8 font-mono text-xs font-bold text-slate-500">#{user.accountNumber}</td>
                           <td className="px-10 py-8">
                              <span className="text-[10px] px-4 py-1.5 bg-danger/5 text-danger border border-danger/10 rounded-full font-black uppercase tracking-widest italic">
                                 {user.lockReason || 'Anomalous Activity'}
                              </span>
                           </td>
                           <td className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                             {user.lockedAt ? new Date(user.lockedAt).toLocaleTimeString() : 'RECENT'}
                           </td>
                           <td className="px-10 py-8 text-right">
                              <div className="flex items-center justify-end gap-3">
                                 <button 
                                   onClick={() => handleUnlock(user._id)}
                                   className="px-6 py-2.5 bg-success text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-success/10 hover:translate-y-[-2px] transition-all active:scale-95 italic"
                                 >
                                    <Unlock size={14} /> Restore
                                 </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsViewModalOpen(true);
                                    }}
                                    className="p-3 text-slate-400 hover:text-electric hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all shadow-sm"
                                  >
                                     <Eye size={20} />
                                  </button>
                              </div>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="px-10 py-24 text-center">
                              <div className="flex flex-col items-center gap-6 opacity-10">
                                 <ShieldCheck size={80} />
                                 <p className="font-black uppercase tracking-[0.5em] text-sm text-slate-900 italic">Integrity Nominal : No Locks Found</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          <div className="bg-navy-900 rounded-lg p-12 text-white relative overflow-hidden group border border-white/5">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]">
                <Activity size={240} />
             </div>
             <div className="relative z-10 space-y-8">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Autonomous Core Protocols</h3>
                <p className="text-slate-400 text-base font-medium leading-relaxed italic max-w-2xl">
                   The VaultSight Neural Engine automatically triggers protective freezes when risk scores exceed <span className="text-electric font-black">75%</span> or anomalous high-velocity movements are detected from unauthorized gateways.
                </p>
                <div className="flex flex-wrap gap-8 pt-4">
                   <div className="bg-white/5 p-8 rounded-lg border border-white/5 flex-1 min-w-[240px] backdrop-blur-sm">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Probability Confidence</p>
                      <p className="text-4xl font-black text-electric italic tracking-tighter">92.4%</p>
                   </div>
                   <div className="bg-white/5 p-8 rounded-lg border border-white/5 flex-1 min-w-[240px] backdrop-blur-sm">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Matrix Response Time</p>
                      <p className="text-4xl font-black text-success italic tracking-tighter">14ms</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Alerts Feed Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[700px]">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                 <h2 className="font-black text-navy-900 uppercase tracking-[0.3em] italic text-xs flex gap-4 items-center">
                    <Clock size={16} className="text-electric" />
                    Neural Pulse Feed
                 </h2>
              </div>
              <div className="p-6 space-y-2 overflow-y-auto custom-scrollbar flex-1">
                 {[
                   { type: 'CRITICAL', title: 'Unauthorized API Access Attempt', time: '2m ago', color: 'text-danger', bg: 'bg-danger' },
                   { type: 'WARNING', title: 'Multiple failed logins detected', time: '15m ago', color: 'text-warning', bg: 'bg-warning' },
                   { type: 'INFO', title: 'System-wide neural backup complete', time: '1h ago', color: 'text-electric', bg: 'bg-electric' },
                   { type: 'CRITICAL', title: 'Velocity limit hit for User ID: 442', time: '2h ago', color: 'text-danger', bg: 'bg-danger' },
                   { type: 'WARNING', title: 'New device added to Trusted List', time: '3h ago', color: 'text-warning', bg: 'bg-warning' },
                   { type: 'INFO', title: 'AI Model Refined: Batch 102', time: '5h ago', color: 'text-success', bg: 'bg-success' },
                 ].map((alert, i) => (
                   <div key={i} className="flex gap-6 p-6 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                      <div className={`w-1 rounded-full ${alert.bg} opacity-20 group-hover:opacity-100 transition-opacity`}></div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-2">
                            <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${alert.color}`}>{alert.type}</span>
                            <span className="text-[10px] text-slate-400 font-bold italic">{alert.time}</span>
                         </div>
                         <h4 className="text-sm font-black text-navy-900 leading-tight uppercase group-hover:text-electric transition-colors italic tracking-tight">{alert.title}</h4>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-8 mt-auto border-t border-slate-50">
                <button className="w-full py-5 bg-slate-50 hover:bg-navy-900 hover:text-white rounded-lg text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] transition-all italic border border-slate-100">
                   System Event Ledger
                </button>
              </div>
           </div>
        </div>
       </div>

      <UserDetailModal 
        user={selectedUser} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        onUnlock={handleUnlock}
      />
    </div>
  );
};

export default SecurityControl;
