import React, { useState, useEffect, useRef } from 'react';
import { Search, Target, ShieldAlert, Cpu, FileText, X, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const { data } = await api.get(`/api/search?q=${query}&pageSize=10`);
          setResults(data.results);
        } catch (e) {
          console.error('Global search failed');
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    onClose();
    navigate(`/results/${item.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="p-6 border-b border-border bg-background/50 flex items-center gap-4">
          <Search className="w-5 h-5 text-accent" />
          <input 
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search targets, CVEs, or services... (Enter to select)"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-white placeholder:text-secondary/30"
          />
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 text-accent animate-spin" />}
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-secondary transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent opacity-20">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-[10px] text-secondary font-black uppercase tracking-[0.3em]">
                {query.length > 0 ? 'No intelligence findings' : 'Awaiting Operational Directives'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, idx) => (
                <button
                  key={res.id}
                  onClick={() => handleSelect(res)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${selectedIndex === idx ? 'bg-accent/10 border-accent/20 border ring-1 ring-accent/20' : 'border border-transparent hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${res.type === 'IP' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white/90">{res.target}</h4>
                      <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">
                        {res.geo?.org || 'Unknown Provider'} • {new Date(res.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {res.cves?.length > 0 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded border border-red-500/20">
                          <ShieldAlert className="w-3 h-3" />
                          {res.cves.length} VULNS
                        </span>
                      )}
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-accent/10 text-accent text-[8px] font-black uppercase rounded border border-accent/20">
                        <Cpu className="w-3 h-3" />
                        {res.ports?.length || 0} PORTS
                      </span>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-accent transition-all ${selectedIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-background/50 border-t border-border flex justify-between items-center px-6">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[8px] font-bold text-secondary uppercase">
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-white">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5 text-[8px] font-bold text-secondary uppercase">
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-white">Enter</kbd>
              Select
            </span>
          </div>
          <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Global Intelligence Registry</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
