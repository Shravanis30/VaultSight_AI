import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Zap, Cpu, ArrowRight, ShieldCheck, BarChart3, Users, Globe } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900 text-white selection:bg-electric/30">
      {/* Premium Header */}
      <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-electric rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Shield className="text-white" size={24} fill="currentColor" fillOpacity={0.2} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              VaultSight<span className="text-electric"> AI</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-electric transition-colors">Features</a>
            <a href="#security" className="hover:text-electric transition-colors">Security</a>
            <a href="#panels" className="hover:text-electric transition-colors">Panels</a>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/user/login')}
              className="px-8 py-3 bg-electric text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-electric/30 hover:-translate-y-1 active:translate-y-0 transition-all italic"
            >
              Access Gateway
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-electric/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-electric/10 border border-electric/20 rounded-full">
              <span className="w-2 h-2 bg-electric rounded-full animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-electric">Autonomous Threat Matrix 2.0</span>
            </div>
            
            <h2 className="text-6xl sm:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
              Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-blue-400">Secure</span> Banking.
            </h2>
            
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
              Enterprise-grade financial ecosystem powered by real-time vector embeddings, 
              risk-based autonomous locking, and proactive fraud identification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/threat')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-navy-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-electric hover:text-white transition-all duration-500"
              >
                Access SOC Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/5">
              <div>
                <p className="text-3xl font-black text-white italic">0.2ms</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Scoring</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-3xl font-black text-white italic">99.9%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fraud Accuracy</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-3xl font-black text-white italic">ISO</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">27001 Certified</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-electric/20 rounded-[3rem] blur-3xl scale-90 group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative bg-navy-800 border border-white/10 p-4 rounded-[3rem] shadow-2xl backdrop-blur-3xl overflow-hidden">
               <img 
                 src="/images/vaultsight_dashboard_mockup.png" 
                 alt="VaultSight AI Dashboard"
                 className="rounded-[2.5rem] w-full object-cover shadow-inner hover:scale-[1.02] transition-transform duration-700"
               />
               
               {/* Decorative UI elements overlay */}
               <div className="absolute top-10 right-10 bg-navy-900/80 backdrop-blur rounded-2xl p-4 border border-white/10 shadow-2xl animate-bounce duration-[3000ms]">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-success/20 rounded-lg text-success">
                     <ShieldCheck size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 leading-none">Status</p>
                     <p className="text-xs font-black text-white">SYSTEM SECURED</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 bg-navy-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-electric">Next-Gen Architecture</h3>
             <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic">Engineered for <span className="text-electric">Stability</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Zap className="text-electric" size={32} />, 
                title: "Vector Embeddings", 
                desc: "Semantic threat pattern matching using multidimensional vector analysis across historical metadata." 
              },
              { 
                icon: <Lock className="text-blue-400" size={32} />, 
                title: "Autonomous Locking", 
                desc: "AI triggers instant account freezing when risk patterns deviate from established behavioral norms." 
              },
              { 
                icon: <Cpu className="text-purple-400" size={32} />, 
                title: "Neural Risk Engine", 
                desc: "Proprietary risk scoring models processing 50+ variables in sub-millisecond real-time streams." 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-navy-900 border border-white/5 p-10 rounded-[2.5rem] hover:border-electric/30 transition-all duration-500 group">
                <div className="mb-8 p-4 bg-white/5 rounded-2xl inline-block group-hover:scale-110 group-hover:bg-electric/10 transition-all">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel Entry points */}
      <section id="panels" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div 
              onClick={() => navigate('/admin')}
              className="relative p-12 bg-navy-800 rounded-[3rem] border border-white/5 overflow-hidden group cursor-pointer"
            >
               <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-110 transition-transform">
                  <BarChart3 size={160} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-2xl font-black uppercase italic mb-2">Admin Panel</h4>
                 <p className="text-slate-400 text-sm mb-8 pr-12 font-medium">Centralized management for bank officials, audits, and user controls.</p>
                 <ArrowRight className="text-electric group-hover:translate-x-2 transition-transform" />
               </div>
            </div>

            <div 
              onClick={() => navigate('/user')}
              className="relative p-12 bg-electric rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl shadow-electric/20"
            >
               <div className="absolute top-0 right-0 p-12 text-white/10 group-hover:scale-110 transition-transform">
                  <Users size={160} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-2xl font-black uppercase italic mb-2">Consumer App</h4>
                 <p className="text-white/80 text-sm mb-8 pr-12 font-medium">Secure mobile-first banking with AI protection for individual users.</p>
                 <ArrowRight className="text-white group-hover:translate-x-2 transition-transform" />
               </div>
            </div>

            <div 
              onClick={() => navigate('/threat')}
              className="relative p-12 bg-navy-800 rounded-[3rem] border border-white/5 overflow-hidden group cursor-pointer"
            >
               <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-110 transition-transform">
                  <Globe size={160} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-2xl font-black uppercase italic mb-2">Threat Intel</h4>
                 <p className="text-slate-400 text-sm mb-8 pr-12 font-medium">Global SOC dashboard monitoring real-time anomalies and vector patterns.</p>
                 <ArrowRight className="text-electric group-hover:translate-x-2 transition-transform" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2">
              <Shield className="text-electric" size={16} />
              <span>&copy; 2026 VaultSight AI Financial Ecosystem</span>
           </div>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Compliance</a>
              <a href="#" className="hover:text-white transition-colors">Whitepaper</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
