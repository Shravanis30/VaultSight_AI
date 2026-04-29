import React from 'react';
import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Send, 
  History as HistoryIcon, 
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(true);

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
    { icon: <HistoryIcon size={22} />, label: "Neural Logs", path: "/user/history" },
    { icon: <CreditCard size={22} />, label: "Cyber Card", path: "/user/card" },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#F0F2F5] overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <aside className={`
        fixed lg:relative top-0 h-full bg-white border-r border-slate-200 flex flex-col z-[70] transition-all duration-300 shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDesktopSidebarOpen ? 'lg:w-[280px]' : 'lg:w-[80px]'}
        w-[280px]
      `}>
        <div className="p-4 lg:p-8 overflow-hidden h-full flex flex-col relative">
           {/* Mobile Close Button */}
           <button 
             onClick={() => setIsSidebarOpen(false)}
             className="lg:hidden absolute top-4 right-4 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 border border-slate-200 transition-all active:scale-95 z-[80]"
           >
              <div className="w-5 h-5 relative">
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-current rotate-45 rounded-full"></span>
                <span className="absolute top-1/2 left-0 w-full h-0.5 bg-current -rotate-45 rounded-full"></span>
              </div>
           </button>
           <div className={`flex items-center gap-3 mb-10 transition-all ${!isDesktopSidebarOpen && 'lg:justify-center lg:gap-0'}`}>
              <div className="bg-navy-900 p-2 rounded-lg shadow-lg shrink-0">
                 <ShieldCheck size={24} className="text-electric" />
              </div>
              <div className={`transition-opacity duration-300 ${!isDesktopSidebarOpen ? 'lg:hidden' : 'block'}`}>
                <h1 className="text-xl font-black tracking-tighter italic text-navy-900 whitespace-nowrap">VaultSight <span className="text-electric">AI</span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Consumer Portal</p>
              </div>
           </div>

           <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `flex items-center gap-4 py-4 rounded-lg transition-all font-black text-xs uppercase tracking-widest group relative ${
                    isDesktopSidebarOpen ? 'px-6' : 'lg:px-0 lg:justify-center'
                  } ${
                    isActive ? 'bg-navy-900 text-white shadow-xl shadow-navy-900/10' : 'text-slate-400 hover:bg-slate-50 hover:text-navy-900'
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`${isActive ? 'text-electric' : 'group-hover:text-electric'} transition-colors shrink-0`}>{item.icon}</span>
                      <span className={`transition-opacity duration-300 ${!isDesktopSidebarOpen ? 'lg:hidden' : 'block'}`}>
                        {item.label}
                      </span>
                      {!isDesktopSidebarOpen && isActive && (
                        <div className="hidden lg:block absolute left-0 w-1 h-6 bg-electric rounded-r-full" />
                      )}
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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-all w-full shrink-0">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(true);
                  else setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
                }}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-navy-900 transition-all border border-slate-200 shadow-sm"
              >
                 <div className="flex flex-col gap-1 w-5">
                    <span className={`h-0.5 bg-current rounded-full transition-all ${isDesktopSidebarOpen ? 'w-full' : 'w-3'}`}></span>
                    <span className="h-0.5 bg-current rounded-full w-full"></span>
                    <span className={`h-0.5 bg-current rounded-full transition-all ${isDesktopSidebarOpen ? 'w-3' : 'w-full'}`}></span>
                 </div>
              </button>

              <div className="lg:hidden flex items-center gap-2">
                 <ShieldCheck size={20} className="text-electric" />
                 <span className="text-sm font-black italic tracking-tighter">VaultSight</span>
              </div>

              <div className="relative w-96 group hidden lg:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search secure environment..." 
                   className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-4 focus:ring-electric/5 outline-none transition-all"
                 />
              </div>
           </div>

           <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                 <div className="flex flex-col text-right hidden xs:flex">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry Ref</p>
                    <p className="text-[10px] font-black text-navy-900 truncate max-w-[100px]">{user.name?.split(' ')[0]}</p>
                 </div>
                 <div className="w-8 h-8 sm:w-10 sm:h-10 bg-navy-900 rounded-lg flex items-center justify-center font-black text-[10px] sm:text-xs text-electric border-2 border-white shadow-lg shrink-0">
                    {user.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase() : 'VS'}
                 </div>
              </div>
              <button className="hidden sm:flex p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-navy-900 transition-all">
                 <Bell size={18} />
              </button>
           </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Improved Aesthetics & Responsiveness */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-navy-900 text-white p-3 rounded-2xl shadow-2xl flex justify-around items-center z-50 animate-in slide-in-from-bottom-10 duration-700">
         {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `p-3 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-electric text-white scale-110 shadow-lg shadow-electric/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {({ isActive }) => (
                <div className="relative">
                  {item.icon}
                  {/* Visual Dot for active state */}
                  <div className={`absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2 border-navy-900 transition-transform ${isActive ? 'scale-100' : 'scale-0'}`} />
                </div>
              )}
            </NavLink>
         ))}
      </nav>
    </div>
  );
};

export default UserLayout;
