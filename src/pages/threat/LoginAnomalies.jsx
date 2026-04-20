import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ShieldAlert, Globe, Smartphone, Clock, ShieldX, User, ShieldCheck } from 'lucide-react';

const LoginAnomalies = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/logins');
        // Filter for FAILED attempts
        const anomalies = response.data.filter(l => l.status === 'FAILED');
        setLogs(anomalies);
      } catch (err) {
        console.error('Login logs fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
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
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Identity Intel</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2 italic leading-none">
            <span className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse"></span>
            Authentication Deviation Stream
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-navy-800 px-6 py-3 rounded-lg border border-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
              <ShieldAlert size={16} />
              Neural Check Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {logs.length > 0 ? logs.map((item) => (
          <div key={item._id} className="bg-navy-800/30 p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 group hover:border-warning/30 transition-all duration-500">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <ShieldX size={120} />
             </div>
             
             <div className="shrink-0 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-black/20 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 mb-6 shadow-2xl group-hover:text-warning transition-colors relative overflow-hidden">
                   <User size={40} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="px-4 py-2 bg-danger text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-danger/20">
                   {item.status}
                </div>
             </div>

             <div className="space-y-8 flex-1">
                <div>
                   <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2 group-hover:text-warning transition-colors uppercase">@{item.username}</h3>
                   <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                      <span className="flex items-center gap-2"><Clock size={12} /> {new Date(item.createdAt).toLocaleString()}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-slate-600">
                         <Globe size={14} className="text-electric" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Target IP</span>
                      </div>
                      <p className="text-sm font-black text-slate-400 font-mono tracking-tight bg-black/20 p-2 rounded-lg border border-white/5 inline-block">{item.ipAddress}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-slate-600">
                         <Smartphone size={14} className="text-warning" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Device Node</span>
                      </div>
                      <p className="text-sm font-black text-slate-400 truncate uppercase tracking-tighter italic">{item.device ? item.device.split(' ')[0] : 'Unknown Agent'}</p>
                   </div>
                </div>

                <div className="p-6 bg-black/30 rounded-lg border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-danger/40"></div>
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Threat Diagnostic Result</p>
                   <p className="text-xs text-slate-400 leading-relaxed font-bold italic opacity-70">
                      Authentication deviation detected. Autonomous response logic suggests session shielding protocols. Potential vector matching at {item.ipAddress}.
                   </p>
                </div>

                <div className="flex gap-4 pt-4">
                   <button className="flex-1 py-4 bg-navy-950 text-slate-400 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all active:scale-95">Neutralize</button>
                   <button className="flex-1 py-4 bg-warning/10 text-warning border border-warning/20 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-warning/5 hover:bg-warning hover:text-navy-900 transition-all active:scale-95">Challenge</button>
                </div>
             </div>
          </div>
        )) : (
           <div className="col-span-full py-40 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center gap-8 opacity-20">
              <ShieldCheck size={80} className="text-slate-500" />
              <p className="text-2xl font-black uppercase tracking-[0.4em] text-slate-500 italic">Identity Perimeter Sealed</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default LoginAnomalies;
