import React, { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  UserX, 
  Search, 
  BarChart3, 
  Clock, 
  Menu, 
  X, 
  Shield,
  LayoutDashboard,
  Bell,
  Zap,
  ChevronLeft,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ThreatLayout = () => {
  const { user, loading } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return null;
  if (!user || (user.role !== 'soc' && user.role !== 'admin')) {
    return <Navigate to="/user/login" replace />;
  }

  const navItems = [
    { icon: <Activity size={20} />, label: "Overview", path: "." },
    { icon: <ShieldAlert size={20} />, label: "Fraud Logs", path: "fraud" },
    { icon: <UserX size={20} />, label: "Anomalies", path: "anomalies" },
    { icon: <Search size={20} />, label: "Intel Search", path: "search" },
    { icon: <BarChart3 size={20} />, label: "Risk Analysis", path: "risk" },
    { icon: <Clock size={20} />, label: "Auto-Locks", path: "locks" },
  ];

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-navy-900 text-slate-100 overflow-hidden relative">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar - Amazon/Enterprise Style */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:flex bg-navy-900 flex-col border-r border-white/5 shadow-2xl transition-all duration-300
        ${isSidebarCollapsed ? 'w-20' : 'w-72'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className={`p-6 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
               <div className="p-2 bg-danger rounded-lg shadow-lg shadow-danger/20">
                  <Shield size={16} className="text-white" />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
                  SOC <span className="text-danger">Intel</span>
               </h2>
            </div>
          )}
          <button onClick={toggleSidebar} className="hidden lg:block text-slate-500 hover:text-white transition-colors">
            {isSidebarCollapsed ? <LayoutDashboard size={20} /> : <Menu size={20} />}
          </button>
          <button onClick={toggleMobileMenu} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {!isSidebarCollapsed && (
            <p className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Security Matrix</p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "."}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-xs uppercase tracking-tight
                ${isActive 
                  ? 'bg-danger/10 text-white border border-danger/20 shadow-lg shadow-danger/5' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <span className={isSidebarCollapsed ? '' : ''}>{item.icon}</span>
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {!isSidebarCollapsed && item.path === "fraud" && (
                <span className="ml-auto w-1.5 h-1.5 bg-danger rounded-full animate-pulse"></span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Status Indicators */}
        <div className="p-6 border-t border-white/5 bg-black/10">
          <div className="space-y-6">
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic leading-none">AI Latency</span>
                <span className="text-[9px] text-success font-black tracking-widest italic leading-none">12ms</span>
              </div>
            )}
            <div className="flex items-center gap-3">
               <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                  <div className="bg-danger h-full w-[94%] rounded-full shadow-lg shadow-danger/20"></div>
               </div>
               {isSidebarCollapsed && <Zap size={14} className="text-danger animate-pulse" />}
            </div>
            {!isSidebarCollapsed && (
              <p className="text-[9px] font-bold text-slate-600 italic leading-snug">Threat clusters synchronized at edge nodes.</p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0f1d]">
        
        {/* Internal Header */}
        <header className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between bg-navy-900/10 backdrop-blur-md sticky top-0 z-30 w-full overflow-hidden">
          <div className="flex items-center gap-4 min-w-0">
             <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-slate-400 hover:text-white shrink-0">
                <Menu size={20} />
             </button>
             <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-tight sm:tracking-widest text-slate-500 italic truncate leading-none">
                <LayoutDashboard size={14} className="shrink-0 hidden xs:block" />
                <span className="hidden sm:inline">SOC Terminal</span>
                <span className="text-slate-800 hidden sm:inline">/</span>
                <span className="text-slate-100 truncate">Intelligent Threat Matrix</span>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/5">
                <div className="flex flex-col text-right">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node Status</p>
                   <p className="text-[10px] font-black text-success uppercase italic">Synchronized</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success border border-success/20">
                   <Activity size={14} className="animate-pulse" />
                </div>
             </div>
             
             <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-danger rounded-full border border-navy-900"></span>
             </button>
             <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Settings size={18} />
             </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ThreatLayout;
