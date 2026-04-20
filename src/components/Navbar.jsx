import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, User, ShieldAlert, Bell, LogIn, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="bg-navy-900 text-white h-20 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-50 border-b border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden w-full">
      <div className="flex items-center gap-2 sm:gap-4 cursor-pointer shrink-0" onClick={() => navigate('/')}>
        <div className="bg-electric p-1.5 sm:p-2 rounded-lg shadow-xl shadow-electric/20">
          <Shield size={22} className="text-white sm:size-[26px]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-2xl font-black tracking-tighter italic leading-none truncate max-w-[110px] sm:max-w-none">VaultSight<span className="text-electric"> AI</span></h1>
          <p className="text-[8px] sm:text-[10px] text-slate-500 font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase">Cyber-Defense</p>
        </div>
      </div>

      <div className="flex-1 px-2 sm:px-12 flex justify-center overflow-hidden">
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 bg-navy-800/50 rounded-full border border-white/5 backdrop-blur-md max-w-full">
            <div className={`shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${user.role === 'admin' ? 'bg-danger' : user.role === 'soc' ? 'bg-warning' : 'bg-success'}`}></div>
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 truncate">
              {user.role} <span className="hidden xs:inline">Session</span> : {user.name?.split(' ')[0]}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-6 py-2 bg-navy-800/50 rounded-full border border-white/5 hidden sm:flex">
             <div className="w-2 bg-slate-700 rounded-full"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Perimeter Standby</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group">
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-navy-900"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10 group cursor-pointer" onClick={() => logout()}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black italic tracking-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.role} Access</p>
              </div>
              <div className="w-11 h-11 bg-navy-800 rounded-lg flex items-center justify-center font-black text-electric border border-white/5 group-hover:border-electric/50 transition-all shadow-xl">
                {user.name ? user.name.split(' ').map(n=>n[0]).join('') : 'VS'}
              </div>
              <LogOut size={18} className="text-slate-500 group-hover:text-danger transition-colors" />
            </div>
          </>
        ) : (
          <NavLink 
            to="/user/login" 
            className="flex items-center gap-2 px-6 py-3 bg-electric text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-xl shadow-electric/20 hover:scale-105 active:scale-95 transition-all"
          >
            <LogIn size={16} />
            Secure Entry
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
