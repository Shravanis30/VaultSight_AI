import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  CreditCard, 
  LogIn, 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  Bell, 
  LayoutDashboard,
  Settings,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminLayout = () => {
  const { user, loading } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/user/login" replace />;
  }

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: "Security Console", path: "security" },
    { icon: <Users size={18} />, label: "User Directory", path: "users" },
    { icon: <FileText size={18} />, label: "Global Ledger", path: "transactions" },
    { icon: <CreditCard size={18} />, label: "Card Protocols", path: "upi" },
    { icon: <LogIn size={18} />, label: "Access Analytics", path: "logins" },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70] 
        ${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-navy-900 text-slate-300 
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-white/5 shadow-2xl
      `}>
        {/* Sidebar Header - CLEANED (No repeats) */}
        <div className={`p-6 border-b border-white/5 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
          <button onClick={toggleSidebar} className="hidden lg:block text-slate-500 hover:text-white transition-colors mr-auto">
            <Menu size={20} />
          </button>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
               <Shield size={16} className="text-electric" />
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Console
               </h2>
            </div>
          )}
          <button onClick={toggleMobileMenu} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8">
          <div className="px-4 mb-8">
            {!isSidebarCollapsed && <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6 px-4">Management Console</h3>}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-4 px-6'} py-4 rounded-lg transition-all font-bold text-sm
                    ${isActive 
                      ? 'bg-electric text-white shadow-xl shadow-electric/20' 
                      : 'hover:bg-white/5 hover:text-white'}
                  `}
                  title={item.label}
                >
                  <span className={location.pathname.includes(item.path) ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Sidebar Footer */}
        {!isSidebarCollapsed && (
          <div className="p-6 bg-navy-800/20 border-t border-white/5">
            <div className="bg-navy-900/50 rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Kernal Load</p>
                 <span className="text-[9px] font-black text-success">8.4ms</span>
              </div>
              <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                 <div className="h-full bg-electric w-[24%]" />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Section (CLEANED) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 select-none shadow-sm">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <button 
              onClick={toggleMobileMenu} 
              className="lg:hidden p-2.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-all shadow-sm"
            >
              <Menu size={18} />
            </button>
            
            <div className="relative flex-1 group hidden sm:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-electric transition-colors" size={16} />
               <input 
                  type="text" 
                  placeholder="Universal Intelligence Search (Cmd+K)" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold italic focus:ring-4 focus:ring-electric/5 transition-all outline-none"
               />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-4">
             <div className="hidden lg:flex items-center gap-2 text-slate-400">
                <ChevronRight size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
                  {location.pathname.split('/').filter(Boolean).slice(-1)[0].replace(/-/g, ' ')}
                </span>
             </div>
             
             {/* Profile button removed - handle at global navbar level */}
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Matrix Synced</span>
             </div>
          </div>
        </header>

        {/* Main Scrolling Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
