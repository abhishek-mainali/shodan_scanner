import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Database, Globe, Search } from 'lucide-react';

const IntelTab = ({ intel, geo }) => {
  if (!intel) return (
    <div className="bg-card border border-border p-12 text-center rounded-lg">
      <p className="text-secondary uppercase tracking-[0.2em] font-bold">Intelligence Feed Unavailable</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Reputation Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <div className={`p-4 rounded-full mb-4 ${intel.threatLevel === 'MALICIOUS' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
            {intel.threatLevel === 'MALICIOUS' ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <h4 className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Overall Threat level</h4>
          <div className={`text-2xl font-black ${intel.threatLevel === 'MALICIOUS' ? 'text-red-500' : 'text-green-500'}`}>
            {intel.threatLevel}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black uppercase text-secondary tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              AbuseIPDB Confidence Score
            </h4>
            <span className="text-lg font-black font-mono text-accent">{intel.abuseScore}%</span>
          </div>
          <div className="w-full h-4 bg-background rounded-full overflow-hidden border border-border p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${intel.abuseScore > 50 ? 'bg-red-500' : 'bg-accent'}`} 
              style={{ width: `${intel.abuseScore}%` }} 
            />
          </div>
          <p className="text-[10px] text-secondary mt-4 leading-relaxed italic">
            This confidence score represents the probability that the IP address is currently associated with malicious activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WHOIS Replacement/Placeholder */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
             <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
               <Globe className="w-4 h-4 text-accent" />
               Network Registry Intel
             </h3>
             <span className="text-[10px] text-accent font-bold px-2 py-0.5 bg-accent/10 border border-accent/20 rounded">PUBLIC RECORDS</span>
          </div>
          
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[10px] text-secondary uppercase font-bold tracking-widest mb-1">Primary ASN</p>
                   <p className="text-sm font-mono text-white">{geo?.asn || 'Unknown'}</p>
                </div>
                <div>
                   <p className="text-[10px] text-secondary uppercase font-bold tracking-widest mb-1">Organization</p>
                   <p className="text-sm font-bold text-white truncate">{geo?.org || 'N/A'}</p>
                </div>
             </div>
             
             <div className="p-4 bg-background border border-border rounded-lg">
                <p className="text-[10px] text-secondary uppercase font-bold tracking-widest mb-2">VirusTotal Diagnostics</p>
                <div className="flex items-center gap-4">
                   <div className="text-2xl font-black font-mono text-white">{intel.vtMalicious} / {intel.vtTotal}</div>
                   <div className="text-xs text-secondary">Flagged as malicious by global engines.</div>
                </div>
             </div>
          </div>
        </div>

        {/* Tech Stack Mock */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
           <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 pb-4 border-b border-border">
             <Search className="w-4 h-4 text-accent" />
             Fingerprinted Tech Stack
           </h3>
           <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Nginx', category: 'Web Server', confidence: 100 },
                { name: 'Cloudflare', category: 'CDN/WAF', confidence: 95 },
                { name: 'React', category: 'Frontend', confidence: 45 },
                { name: 'Ubuntu', category: 'OS', confidence: 80 }
              ].map(tech => (
                <div key={tech.name} className="p-3 bg-background border border-border rounded-lg flex flex-col gap-1">
                   <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-white/90">{tech.name}</span>
                      <span className="text-[8px] px-1 bg-accent/10 text-accent rounded uppercase">{tech.category}</span>
                   </div>
                   <div className="w-full h-1 bg-card rounded-full mt-2">
                      <div className="h-full bg-accent/40 rounded-full" style={{ width: `${tech.confidence}%` }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntelTab;
