import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Shield, Globe, Cpu, ArrowRight, ChevronLeft, ChevronRight, Hash, Trash2, RotateCcw } from 'lucide-react';
import api from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    risk: searchParams.get('risk') || '',
    type: searchParams.get('type') || '',
    port: searchParams.get('port') || '',
    service: searchParams.get('service') || ''
  });

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      const { data } = await api.get(`/api/search?${params.toString()}`);
      setResults(data.results);
      setTotal(data.total);
    } catch (e) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams, page]);

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setPage(1);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const empty = { q: '', risk: '', type: '', port: '', service: '' };
    setFilters(empty);
    setSearchParams({});
  };

  const getRiskColor = (score) => {
    const s = score * 10;
    if (s > 70) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (s > 40) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (s > 10) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-80 space-y-6 shrink-0">
        <div className="bg-card border border-border rounded-xl p-6 space-y-8 sticky top-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              Advanced Filters
            </h2>
            <button onClick={clearFilters} className="text-[10px] text-secondary hover:text-white transition-colors flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Query</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                <input 
                  type="text" 
                  value={filters.q}
                  onChange={e => handleFilterChange('q', e.target.value)}
                  placeholder="Target, Org, CVE..."
                  className="w-full bg-background border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-accent ring-1 ring-transparent focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Risk Level</label>
              <div className="grid grid-cols-2 gap-2">
                {['critical', 'high', 'medium', 'low'].map(r => (
                  <button
                    key={r}
                    onClick={() => handleFilterChange('risk', filters.risk === r ? '' : r)}
                    className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-tighter border transition-all ${filters.risk === r ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border text-secondary hover:border-accent/40'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Type</label>
              <div className="flex gap-2">
                {['IP', 'Domain', 'CIDR'].map(t => (
                  <button
                    key={t}
                    onClick={() => handleFilterChange('type', filters.type === t ? '' : t)}
                    className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-tighter border transition-all ${filters.type === t.toLowerCase() ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border text-secondary hover:border-accent/40'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Port / Service</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Port (80)"
                  value={filters.port}
                  onChange={e => handleFilterChange('port', e.target.value)}
                  className="w-1/3 bg-background border-border rounded-lg px-3 py-2 text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Nginx, SSH..."
                  value={filters.service}
                  onChange={e => handleFilterChange('service', e.target.value)}
                  className="flex-1 bg-background border-border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={applyFilters}
            className="w-full py-4 bg-accent hover:bg-accent/90 text-background font-black text-xs rounded-lg tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            APPLY INTELLIGENCE
          </button>
        </div>
      </aside>

      {/* Results Area */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Intelligence Registry</h1>
            <p className="text-xs text-secondary font-bold uppercase tracking-[0.2em]">
              Showing {results.length} of {total} operational findings
            </p>
          </div>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-card border border-border rounded-lg text-secondary hover:text-white disabled:opacity-20"><ChevronLeft className="w-5 h-5" /></button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="p-2 bg-card border border-border rounded-lg text-secondary hover:text-white disabled:opacity-20"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {results.map((res) => {
              const riskColor = getRiskColor(res.cves?.length || 0);
              return (
                <div 
                  key={res.id} 
                  onClick={() => navigate(`/results/${res.id}`)}
                  className="bg-card border border-border rounded-xl p-6 hover:border-accent/40 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl group-hover:bg-accent/10 transition-all" />
                  
                  <div className="flex items-start justify-between mb-4 relative">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest border ${riskColor}`}>
                          {res.cves?.length > 7 ? 'CRITICAL' : res.cves?.length > 4 ? 'HIGH' : 'STABLE'}
                        </span>
                        <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">{res.type}</span>
                      </div>
                      <h3 className="text-lg font-mono font-bold text-white group-hover:text-accent transition-colors">{res.target}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">{new Date(res.timestamp).toLocaleDateString()}</p>
                      <p className="text-[10px] text-accent font-black tracking-[0.2em]">{res.scannedBy || 'OPERATOR'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-4 relative">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-secondary uppercase tracking-[0.2em]">Organization</p>
                      <p className="text-xs font-medium text-white truncate">{res.geo?.org || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-secondary uppercase tracking-[0.2em]">Vulnerabilities</p>
                      <p className={`text-xs font-black ${res.cves?.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {res.cves?.length || 0} DETECTED
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-secondary uppercase tracking-[0.2em]">Port Surface</p>
                      <p className="text-xs font-black text-accent">{res.ports?.length || 0} OPEN</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
