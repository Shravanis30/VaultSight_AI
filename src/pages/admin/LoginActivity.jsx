import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { MapPin, Smartphone, Clock, ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';

const LoginActivity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/logins');
        setLogs(response.data);
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
       <div className="w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-navy-900 italic tracking-tighter uppercase">Neural Access Logs</h1>
           <p className="text-slate-500 text-sm font-medium">Monitoring cross-dimensional authentication clusters.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20">
           <ShieldCheck size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Protocol Sync: Active</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-200">
            <tr>
              <th className="px-8 py-5 text-left">Entity</th>
              <th className="px-8 py-5 text-left">Vector IP</th>
              <th className="px-8 py-5 text-left">Hardware Cluster / Geo</th>
              <th className="px-8 py-5 text-left">Timestamp</th>
              <th className="px-8 py-5 text-right">Access State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length > 0 ? logs.map((login) => (
              <tr key={login._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center font-black text-electric shadow-lg shadow-navy-900/10">
                         {login.username[0].toUpperCase()}
                      </div>
                      <p className="font-black text-navy-900 italic">@{login.username}</p>
                   </div>
                </td>
                <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">{login.ipAddress}</td>
                <td className="px-8 py-5">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-tighter">
                         <Smartphone size={14} className="text-slate-400" /> {login.device ? login.device.split(' ')[0] : 'Unknown'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <MapPin size={12} className="text-slate-400" /> {login.location || 'Encrypted Node'}
                      </div>
                   </div>
                </td>
                <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {new Date(login.createdAt).toLocaleString()}
                </td>
                <td className="px-8 py-5 text-right">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                     login.status === 'SUCCESS' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger animate-pulse'
                   }`}>
                     {login.status}
                   </span>
                </td>
              </tr>
            )) : (
              <tr>
                 <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No access logs detected in current vault cycle.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginActivity;
