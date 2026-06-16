import React, { useState } from 'react';
import { AlertCircle, Terminal, X, ExternalLink } from 'lucide-react';

const CVEList = ({ cves = [] }) => {
  const [selectedCVE, setSelectedCVE] = useState(null);

  if (cves.length === 0) return (
    <div className="bg-card border border-border rounded-lg p-12 text-center">
      <p className="text-secondary uppercase tracking-[0.2em] font-bold">No High-Risk Vulnerabilities Detected</p>
    </div>
  );

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
      case 'HIGH': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
      case 'MEDIUM': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      case 'LOW': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      default: return { color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' };
    }
  };

  return (
    <div className="space-y-4">
      {cves.map((cve) => {
        const style = getSeverityStyle(cve.severity);
        return (
          <div 
            key={cve.id} 
            onClick={() => setSelectedCVE(cve)}
            className={`bg-card border-l-4 border-y border-r border-border rounded-r-lg p-6 cursor-pointer hover:bg-white/5 transition-all group ${cve.severity === 'CRITICAL' ? 'border-l-red-500' : cve.severity === 'HIGH' ? 'border-l-orange-500' : 'border-l-border hover:border-l-accent'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <AlertCircle className={`w-5 h-5 ${style.color}`} />
                <h4 className={`font-mono font-black text-lg tracking-tight ${style.color}`}>{cve.id}</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                  <div className={`h-full ${style.bg.replace('/10', '')}`} style={{ width: `${(cve.cvss || 0) * 10}%` }} />
                </div>
                <span className={`px-3 py-1 rounded ${style.bg} ${style.color} text-xs font-black uppercase tracking-widest border ${style.border}`}>
                  {cve.severity}: {cve.cvss}
                </span>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-4 text-sm line-clamp-2">{cve.summary}</p>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                Click for Analysis
              </span>
            </div>
          </div>
        );
      })}

      {/* Detail Drawer */}
      {selectedCVE && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedCVE(null)} />
          <div className="relative w-full max-w-2xl bg-card border-l border-border h-full shadow-2xl animate-in slide-in-from-right duration-300 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black font-mono text-accent">{selectedCVE.id}</h2>
              <button onClick={() => setSelectedCVE(null)} className="p-2 hover:bg-background rounded-full text-secondary hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8 flex-1 overflow-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-background/50 p-4 rounded-lg border border-border">
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1">CVSS Score</p>
                  <p className="text-3xl font-black font-mono text-white">{selectedCVE.cvss}</p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg border border-border">
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1">Severity</p>
                  <p className={`text-3xl font-black font-mono ${getSeverityStyle(selectedCVE.severity).color}`}>{selectedCVE.severity}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] border-b border-border pb-2">Analysis Summary</h3>
                <p className="text-white/90 leading-relaxed italic">{selectedCVE.summary}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] border-b border-border pb-2">Intelligence Links</h3>
                <div className="grid grid-cols-1 gap-3">
                  <a href={`https://nvd.nist.gov/vuln/detail/${selectedCVE.id}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-background hover:bg-accent/5 border border-border hover:border-accent/40 rounded-lg group transition-all">
                    <span className="text-sm font-medium">National Vulnerability Database</span>
                    <ExternalLink className="w-4 h-4 text-secondary group-hover:text-accent" />
                  </a>
                  <a href={`https://vulners.com/cve/${selectedCVE.id}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-background hover:bg-accent/5 border border-border hover:border-accent/40 rounded-lg group transition-all">
                    <span className="text-sm font-medium">Vulners Analysis</span>
                    <ExternalLink className="w-4 h-4 text-secondary group-hover:text-accent" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              <button className="w-full py-4 bg-accent text-background font-black uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-colors">
                Generate Remediation Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVEList;
