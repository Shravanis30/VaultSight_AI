import React from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Send, 
  History, 
  CreditCard, 
  ShieldCheck, 
  LayoutDashboard,
  Settings,
  HelpCircle,
  Bell,
  Search
} from 'lucide-react';

const UserLayout = () => {
  const { user, loading } = useApp();
  const location = useLocation();

  if (loading) return null;
  if (!user && location.pathname !== '/user/login') {
    return <Navigate to="/user/login" replace />;
  }

  // If login page, don't show the dashboard layout
  if (location.pathname === '/user/login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Outlet />
      </div>
    );
  }

  const navItems = [
    { icon: <LayoutDashboard size={22} />, label: "Command Center", path: "/user/dashboard" },
    { icon: <Send size={22} />, label: "Dispatch Funds", path: "/user/send" },
    { icon: <History size={22} />, label: "Neural Logs", path: "/user/history" },
    { icon: <CreditCard size={22} />, label: "Cyber Card", path: "/user/card" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      {/* Side Navigation - Fixed */}
      <aside className="w-[280px] bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
           <div className="flex items-center gap-3 mb-10">
              <div className="bg-navy-900 p-2 rounded-lg shadow-lg">
                 <ShieldCheck size={24} className="text-electric" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter italic text-navy-900">VaultSight <span className="text-electric">AI</span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumer Portal</p>
              </div>
           </div>

           <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-lg transition-all font-black text-xs uppercase tracking-widest group ${
                    isActive ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/10' : 'text-slate-400 hover:bg-slate-50 hover:text-navy-900'
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`${isActive ? 'text-electric' : 'group-hover:text-electric'} transition-colors`}>{item.icon}</span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
           </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
           <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</p>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs font-bold text-navy-900">All neural shields active. Last sync 2m ago.</p>
              <button className="w-full py-3 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Deep Analysis</button>
           </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
           <div className="relative w-96 group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources, logs, or transactions..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-electric/5 outline-none transition-all"
              />
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Entry Point</p>
                 <p className="text-sm font-black text-navy-900 truncate max-w-[150px]">{user.name}</p>
              </div>
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center font-black text-electric border-2 border-white shadow-xl">
                 {user.name ? user.name.split(' ').map(n=>n[0]).join('') : ''}
              </div>
              <button className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-navy-900 transition-all">
                 <Settings size={20} />
              </button>
           </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Footer Nav - Only visible on small screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
         {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all ${
                isActive ? 'text-electric scale-110' : 'text-slate-400'
              }`}
            >
              {({ isActive }) => (
                <div className={`p-2 rounded-lg ${isActive ? 'bg-electric/10' : ''}`}>
                  {item.icon}
                </div>
              )}
            </NavLink>
         ))}
      </nav>
    </div>
  );
};

export default UserLayout;
