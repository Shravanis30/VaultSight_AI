import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, ShieldAlert, Cpu, Info, ArrowRight, Activity } from 'lucide-react';
import api from '../../lib/api';

const SemanticSearch = () => {
  const { threats, setThreats } = useApp();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState('Semantic');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('query');
    if (urlQuery) {
      setQuery(urlQuery);
      // Small delay to ensure state is set
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} };
        handleSearch(fakeEvent, urlQuery);
      }, 500);
    }
  }, []);

  const handleSearch = async (e, overrideQuery = null) => {
    if (e) e.preventDefault();
    const activeQuery = overrideQuery || query;
    if (!activeQuery) return;

    setIsSearching(true);
    
    try {
      if (searchMode === 'Semantic' || searchMode === 'Hybrid') {
        // Real Vector Search
        const response = await api.post('threats/semantic-search', { 
          query: activeQuery,
          limit: 10
        });
        
        if (response.success) {
          // Map backend results to frontend format
          const formattedResults = response.data.map(item => ({
            ...item,
            similarity: item.similarityScore.replace('%', ''), // Page expects a number for the display
            matches: [activeQuery] // For highlighting
          }));
          setResults(formattedResults);
        }
      } else {
        // Fallback to simple keyword filtering if 'Exact' mode is chosen
        let currentThreats = threats;
        if (!currentThreats || currentThreats.length === 0) {
          const res = await api.get('threats');
          if (res.success || res.data) {
            currentThreats = res.data || [];
            if (setThreats) setThreats(currentThreats);
          }
        }

        const filtered = currentThreats.filter(t => 
          t.description.toLowerCase().includes(activeQuery.toLowerCase())
        ).map(t => ({
          ...t,
          similarity: '100.00',
          matches: [activeQuery]
        }));
        setResults(filtered);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback on error so the UI doesn't break
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };


  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Neural Search Matrix</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2 italic leading-none">
            <span className="w-1.5 h-1.5 bg-electric rounded-full animate-pulse"></span>
            Pattern Discovery & Threat Intel
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-electric/10 px-6 py-3 rounded-lg border border-electric/20 flex gap-3 items-center group cursor-pointer shadow-xl shadow-electric/5">
              <Info size={18} className="text-electric" />
              <div className="text-[10px] text-slate-400 group-hover:text-white transition-colors font-black uppercase">
                 Atlas Vector <span className="text-electric">Engine</span>
              </div>
           </div>
        </div>
      </div>

      {/* Search Console */}
      <div className="bg-navy-800/30 p-10 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:rotate-6 transition-transform">
           <Cpu size={140} />
        </div>
        
        <form onSubmit={handleSearch} className="relative z-10 space-y-10 max-w-4xl mx-auto">
           <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/20 rounded-lg border border-white/5 shadow-2xl">
                 <Sparkles size={14} className="text-electric animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sentence-Transformers v2.0</span>
              </div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Identify Latent Threats</h2>
           </div>
           
           <div className="relative group">
              <div className="absolute inset-0 bg-electric blur-[80px] opacity-10 group-focus-within:opacity-20 transition-opacity duration-700"></div>
              <div className="relative flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                    <input 
                      type="text" 
                      placeholder="e.g. Unusual transfers from VPN in Mumbai..." 
                      className="w-full pl-16 pr-6 py-5 bg-navy-900 rounded-xl border-2 border-white/5 text-xl text-white focus:border-electric focus:bg-black/40 outline-none transition-all shadow-2xl placeholder:text-slate-700 placeholder:italic placeholder:font-black"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                 </div>
                 <button 
                   type="submit"
                   className="px-12 py-5 bg-electric text-white rounded-xl font-black text-xl italic uppercase tracking-tighter hover:bg-white hover:text-black transition-all shadow-2xl shadow-electric/20 active:scale-95 flex items-center justify-center gap-4"
                 >
                   {isSearching ? <Cpu className="animate-spin" size={24}/> : (
                     <>Execute Query <ArrowRight size={20} /></>
                   )}
                 </button>
              </div>
           </div>

           <div className="flex items-center justify-center gap-6">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Logic Layer:</span>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                 {['Exact', 'Semantic', 'Hybrid'].map(mode => (
                   <button 
                     key={mode}
                     type="button"
                     onClick={() => setSearchMode(mode)}
                     className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === mode ? 'bg-electric text-white shadow-xl' : 'text-slate-600 hover:text-slate-400'}`}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
           </div>
        </form>
      </div>

      {/* Results Viewport */}
      <div className="space-y-8">
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3].map(i => (
               <div key={i} className="bg-navy-800/20 border border-white/5 h-80 rounded-xl animate-pulse"></div>
             ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic leading-none border-l-2 border-electric pl-6">Neural Match Grid ({results.length})</h3>
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic flex items-center gap-2">
                  <Activity size={14} className="text-electric" /> Latency: 14.2ms
               </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {results.map((res, i) => (
                 <div key={i} className="bg-navy-800/30 border border-white/5 p-8 rounded-xl hover:border-electric transition-all shadow-2xl group hover:translate-y-[-4px] flex flex-col h-full overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-electric/10 transition-all"></div>
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-black/20 rounded-lg border border-white/5 group-hover:scale-110 transition-transform">
                             <Cpu size={16} className="text-electric" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{res.similarity}%</span>
                             <span className="text-[8px] font-black text-slate-600 uppercase mt-1 tracking-widest">Similarity</span>
                          </div>
                       </div>
                       <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                         res.riskLevel === 'CRITICAL' ? 'bg-danger text-white border-danger/20 shadow-lg shadow-danger/20' : 'bg-warning/10 text-warning border-warning/20'
                       }`}>
                         {res.riskLevel}
                       </div>
                    </div>
                    
                    <div className="flex-1 relative z-10">
                       <p className="text-slate-400 font-bold text-sm leading-relaxed group-hover:text-white transition-colors italic">
                          {res.description.split(' ').map((word, idx) => (
                            <span key={idx} className={res.matches.some(m => word.toLowerCase().includes(m.toLowerCase())) ? 'bg-electric/20 text-electric px-1 rounded-md' : ''}>
                              {word}{' '}
                            </span>
                          ))}
                       </p>
                    </div>

                    <div className="flex items-center gap-6 pt-8 mt-8 border-t border-white/5 relative z-10">
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-600 uppercase mb-1.5 tracking-widest leading-none italic font-mono uppercase">Impacted Identity</p>
                          <p className="text-[11px] font-black text-white italic truncate uppercase">{res.userName}</p>
                       </div>
                       <button className="p-4 bg-navy-900 border border-white/5 rounded-xl text-slate-500 group-hover:text-electric group-hover:border-electric group-hover:bg-black transition-all shadow-xl active:scale-90">
                          <ArrowRight size={22} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </>
        ) : query && !isSearching ? (
          <div className="py-32 text-center flex flex-col items-center">
             <div className="p-10 bg-navy-800/30 rounded-xl border border-white/5 mb-8 text-slate-800 shadow-2xl">
                <ShieldAlert size={80} className="text-slate-700" />
             </div>
             <h3 className="text-3xl font-black text-white italic tracking-tighter mb-3 uppercase leading-none">No Similar TTPs Found</h3>
             <p className="text-slate-500 max-w-sm mx-auto font-bold italic opacity-60">This specific threat signature does not match any known malicious clusters in our vector database.</p>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-16">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                {[
                  { tag: 'SECURITY PATTERN', desc: 'Identify account takeover clusters via deep IP sequence analysis' },
                  { tag: 'BEHAVIORAL SYNC', desc: 'Scan for dormant accounts activated via strategic UPI probes' },
                  { tag: 'GEOSPATIAL DRIFT', desc: 'Detect rapid velocity anomalies across inter-city corridors' },
                ].map((hint, i) => (
                  <div key={i} className="bg-navy-800/10 p-8 rounded-xl border border-white/5 text-center space-y-6 hover:bg-white/5 transition-colors cursor-help group shadow-2xl">
                     <div className="w-12 h-12 bg-black/20 rounded-xl mx-auto flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all">
                        <Search size={20} className="text-slate-600 group-hover:text-electric" />
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-electric tracking-[0.4em] uppercase block mb-3 leading-none">{hint.tag}</span>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold italic opacity-60">{hint.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="flex items-center gap-4 animate-pulse">
                <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] italic">Sequence Matrix: Standby</p>
                <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemanticSearch;
