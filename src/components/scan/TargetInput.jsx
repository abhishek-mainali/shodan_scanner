import React, { useState } from 'react';
import { Search, Info, Globe, Cpu, Hash, ShieldAlert, Lock, Zap, Loader2 } from 'lucide-react';


const TargetInput = ({ onStart, isLoading, onCancel }) => {
  const [target, setTarget] = useState('');
  const [type, setType] = useState('ip');
  const [params, setParams] = useState({
    ports: true,
    cves: true,
    ssl: true,
    geo: true
  });

  const detectType = (val) => {
    setTarget(val);
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(val)) setType('ip');
    else if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(val)) setType('domain');
    else if (val.includes('/')) setType('cidr');
  };


  const toggleParam = (id) => {
    setParams(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    if (target && onStart) onStart(target, params);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8 space-y-8">
      <div className="space-y-4">
        <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
          <Search className="w-4 h-4 text-accent" />
          Define Target
        </label>
        <div className="relative group">
          <input
            type="text"
            value={target}
            onChange={(e) => detectType(e.target.value)}
            disabled={isLoading}
            placeholder="IP, domain, or CIDR range (e.g., 8.8.8.8, example.com, 192.168.1.0/24)"
            className="w-full bg-background border-border text-lg font-mono py-4 px-6 rounded-lg focus:border-accent ring-1 ring-transparent focus:ring-accent/20 transition-all placeholder:text-secondary/30 disabled:opacity-50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border ${
              type === 'ip' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-card border-border text-secondary'
            }`}>IP</span>
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border ${
              type === 'domain' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-card border-border text-secondary'
            }`}>DOMAIN</span>
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border ${
              type === 'cidr' ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-card border-border text-secondary'
            }`}>CIDR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Operational Parameters</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'ports', label: 'Ports & Services', icon: Cpu },
              { id: 'cves', label: 'CVEs & Vulns', icon: ShieldAlert },
              { id: 'ssl', label: 'SSL/TLS Info', icon: Lock },
              { id: 'geo', label: 'Geo/ASN Data', icon: Globe },
            ].map((opt) => (
              <label 
                key={opt.id} 
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  params[opt.id] 
                    ? 'bg-accent/5 border-accent shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]' 
                    : 'bg-background border-border hover:border-accent/40'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={params[opt.id]} 
                  onChange={() => toggleParam(opt.id)}
                  className="sr-only" 
                />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 transition-all ${
                  params[opt.id] ? 'bg-accent border-accent' : 'border-border'
                }`}>
                  {params[opt.id] && <div className="w-2 h-2 bg-background rounded-sm" />}
                </div>
                <span className={`text-sm font-bold uppercase tracking-tighter transition-colors ${
                  params[opt.id] ? 'text-white' : 'text-secondary'
                }`}>
                  {opt.label}
                </span>
              </label>
            ))}

          </div>
        </div>


        <div className="flex flex-col justify-end gap-4">
          <button 
            disabled={isLoading || !target}
            onClick={handleSubmit}
            className="w-full py-4 bg-accent hover:bg-accent/90 text-background font-black text-lg rounded-lg tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                ANALYZING...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 fill-current" />
                INITIATE SCAN
              </>
            )}
          </button>
          {isLoading && (
            <button onClick={onCancel} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-[0.2em] transition-colors">
              ABORT MISSION
            </button>
          )}
          <p className="text-[10px] text-secondary text-center uppercase tracking-widest">
            Authorization required: By clicking initiate, you confirm legal right to scan target.
          </p>
        </div>
      </div>
    </div>

  );
};

export default TargetInput;
