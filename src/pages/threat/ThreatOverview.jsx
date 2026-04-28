import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ShieldAlert, AlertCircle, Lock, TrendingUp, Search, Eye, ArrowRight, Zap, Activity, ShieldX, Clock } from 'lucide-react';

const ThreatOverview = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    flaggedTransactions: 0,
    lockedUsers: 0,
    totalTransactionVolume: 0,
    recentAlerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const riskData = [
    { name: 'Low', value: stats.totalTransactions - stats.flaggedTransactions, color: '#10B981' },
    { name: 'High', value: stats.flaggedTransactions, color: '#EF4444' }
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center p-20">
       <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Command Intelligence</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2 italic">
            <span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse"></span>
            Global Analysis Matrix
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-navy-800 px-5 py-3 rounded-lg border border-navy-700 flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Last Sync</span>
              <span className="text-[11px] font-black text-white uppercase italic mt-1.5">Node-Delta-04</span>
           </div>
        </div>
      </div>

      {/* KPI Row - Standardized Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Network Throughput', value: stats.totalTransactions, bg: 'bg-navy-800/50', border: 'border-white/5', icon: <Activity size={18} className="text-electric"/>, change: '+12.4%' },
          { label: 'Threat Signals', value: stats.flaggedTransactions, bg: 'bg-danger/5', border: 'border-danger/20', icon: <ShieldAlert size={18} className="text-danger"/>, change: 'Critical' },
          { label: 'Containment Unit', value: stats.lockedUsers, bg: 'bg-navy-800/50', border: 'border-white/5', icon: <Lock size={18} className="text-white"/>, change: 'Isolated' },
          { label: 'Asset Volume', value: `₹${(stats.totalTransactionVolume/100000).toFixed(1)}L`, bg: 'bg-navy-800/50', border: 'border-white/5', icon: <Zap size={18} className="text-success"/>, change: 'Synced' },
          { label: 'Intelligence Feed', value: stats.recentAlerts?.length, bg: 'bg-navy-800/50', border: 'border-white/5', icon: <AlertCircle size={18} className="text-purple-400"/>, change: 'Live' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} ${stat.border} p-6 rounded-xl border shadow-xl flex flex-col justify-between group hover:translate-y-[-2px] transition-all`}>
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-black/20 rounded-lg group-hover:scale-110 transition-transform">
                   {stat.icon}
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase italic">{stat.change}</span>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black italic tracking-tighter text-white">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 lg:gap-10">
        {/* Main Charts Area */}
        <div className="col-span-12 lg:col-span-8 space-y-8 lg:space-y-10">
          <div className="bg-navy-800/30 p-8 lg:p-10 rounded-xl border border-white/5 shadow-2xl h-[450px] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-6 transition-transform duration-1000">
                <TrendingUp size={150} />
             </div>
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic border-l-2 border-danger pl-6 leading-none">Neural Traffic Analysis</h3>
                <div className="flex gap-2">
                   {['H', 'D', 'W', 'M'].map(p => (
                      <button key={p} className="w-8 h-8 rounded-lg bg-black/20 border border-white/5 text-[10px] font-black text-slate-500 hover:text-white hover:border-danger transition-all">{p}</button>
                   ))}
                </div>
             </div>
             <ResponsiveContainer width="100%" aspect={2}>
                <AreaChart data={[{ day: 'Mon', threats: 10 }, { day: 'Tue', threats: 15 }, { day: 'Wed', threats: stats.flaggedTransactions }]}>
                   <defs>
                      <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                         <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                   <XAxis dataKey="day" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} dy={10} fontWeight="900" />
                   <YAxis stroke="#475569" fontSize={9} axisLine={false} tickLine={false} dx={-10} fontWeight="900" />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', fontSize: '12px' }}
                     itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                   />
                   <Area type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={4} fillOpacity={1} fill="url(#colorThreat)" animationDuration={2000} />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
             <div className="bg-navy-800/30 p-8 lg:p-10 rounded-xl border border-white/5 shadow-2xl h-[380px]">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 italic border-l-2 border-danger pl-6 leading-none">Risk Attribution</h3>
                <ResponsiveContainer width="100%" aspect={1.5}>
                   <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={105}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             
             <div className="bg-navy-900 border border-white/5 p-10 rounded-xl flex flex-col justify-center gap-8 relative group overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 text-danger/5 group-hover:scale-110 transition-transform duration-1000">
                   <ShieldAlert size={180} />
                </div>
                <div className="relative z-10 space-y-5">
                   <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Vector Sync</h3>
                   <p className="text-slate-500 text-xs leading-relaxed font-bold italic opacity-60">
                      Neural stress testing is active. Autonomous response logic is being trained on multi-vector search trajectories via edge nodes.
                   </p>
                   <div className="pt-4">
                      <button className="flex items-center gap-4 group/btn">
                        <div className="bg-danger/10 p-4 rounded-lg border border-danger/20 transition-all duration-300 group-hover/btn:bg-danger group-hover/btn:text-white">
                           <Zap size={22} className="text-danger group-hover/btn:text-white transition-colors" />
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-danger group-hover/btn:tracking-[0.4em] transition-all">Engage Pulse</p>
                           <p className="text-[9px] font-bold text-slate-600 uppercase italic mt-1">Manual Logic Injection</p>
                        </div>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Recent Alert Feed Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-navy-800/30 rounded-xl border border-white/5 overflow-hidden flex flex-col h-full shadow-2xl backdrop-blur-xl">
              <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
                 <h2 className="font-black text-white uppercase tracking-tighter flex gap-3 items-center text-lg italic leading-none">
                    <Activity size={20} className="text-danger animate-pulse" />
                    Security Pulse
                 </h2>
              </div>
              <div className="p-8 space-y-8 flex-1 overflow-y-auto max-h-[720px] custom-scrollbar">
                 {stats.recentAlerts.length > 0 ? stats.recentAlerts.map((alert) => (
                   <div key={alert._id} className="relative pl-10 pb-10 border-l-2 border-white/5 last:border-0 last:pb-0 group">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-navy-900 shadow-xl ${
                        alert.severity === 'CRITICAL' ? 'bg-danger shadow-danger/30' : 
                        alert.severity === 'WARNING' ? 'bg-orange-500' : 'bg-success'
                      }`}></div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase italic">#{alert._id.slice(-6)}</span>
                           <span className="text-[10px] font-black text-slate-500 italic flex items-center gap-2">
                              <Clock size={12} /> {new Date(alert.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-200 leading-relaxed group-hover:text-danger transition-colors italic uppercase tracking-tight">{alert.message}</h4>
                        <div className="flex items-center gap-6">
                           <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg border ${
                             alert.severity === 'CRITICAL' ? 'bg-danger/10 text-danger border-danger/20' : 
                             alert.severity === 'WARNING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                             'bg-success/10 text-success border-success/20'
                           }`}>
                             {alert.severity}
                           </span>
                           <button className="text-[10px] font-black text-danger uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-all italic">
                               Analysis <ArrowRight size={14} />
                           </button>
                        </div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-24 text-center flex flex-col items-center gap-6 opacity-30">
                      <ShieldX size={60} className="text-slate-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">No Anomalous Clusters</p>
                   </div>
                 )}
              </div>
              <div className="p-8 bg-black/40 border-t border-white/5">
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none">Protocol Stack Status</h5>
                    <div className="flex flex-wrap gap-3">
                       {['Sentinel', 'Vector', 'Risk-AI', 'Auto-Lock'].map((step, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-100 bg-navy-800 px-4 py-2 rounded-lg border border-white/5 shadow-2xl italic">{step}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatOverview;
