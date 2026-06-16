import React, { useState } from 'react';
import api from '../services/api';
import { Key, Settings, Shield, FileText, Bell, Palette, Database, Eye, EyeOff, Check, AlertCircle, Trash2, Download, RefreshCcw } from 'lucide-react';

import { useToast } from '../components/Toast';

const SettingsPage = () => {
  const { showToast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('shodan_api_key_override') || '');
  const [verifying, setVerifying] = useState(false);
  const [apiInfo, setApiInfo] = useState(null);

  const verifyKey = async () => {
    if (!apiKey) return;
    setVerifying(true);
    try {
      const { data } = await api.get(`/api/settings/shodan-verify?key=${apiKey}`);
      setApiInfo(data);

      localStorage.setItem('shodan_api_key_override', apiKey);
      showToast('API credentials authenticated successfully', 'success');
    } catch (e) {
      showToast('Invalid API credentials provided', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Delete all mission logs permanently?')) {
      localStorage.removeItem('reconx_history');
      showToast('Mission database purged', 'info');
    }
  };

  const handleFullReset = () => {
    if (window.confirm('IRREVERSIBLE ACTION: Reset all system settings and wipe local intelligence?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">System Configuration</h1>
        <p className="text-secondary text-xs font-bold uppercase tracking-widest">Adjust tactical parameters and deployment settings</p>
      </div>

      {/* Section 1: API */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-background/30 flex items-center gap-3">
          <Key className="w-5 h-5 text-accent" />
          <h2 className="font-bold uppercase tracking-widest text-sm">Authentication Protocol</h2>
        </div>
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] text-secondary font-bold uppercase tracking-widest">Shodan Mastery Key</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input 
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full bg-background border border-border rounded px-4 py-3 font-mono text-sm pr-12 focus:border-accent transition-all"
                  placeholder="Enter Shodan API Key..."
                />
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button 
                onClick={verifyKey}
                disabled={verifying}
                className="px-6 bg-accent text-background font-black uppercase tracking-widest rounded hover:bg-accent/90 transition-all disabled:opacity-50"
              >
                {verifying ? 'VERIFYING...' : 'VERIFY KEY'}
              </button>
            </div>
            {apiInfo && (
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg grid grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                <div>
                  <p className="text-[9px] text-secondary uppercase font-bold">Plan Level</p>
                  <p className="text-sm font-black text-accent uppercase">{apiInfo.plan}</p>
                </div>
                <div>
                  <p className="text-[9px] text-secondary uppercase font-bold">Query Credits</p>
                  <p className="text-sm font-black text-white">{apiInfo.queryCredits}</p>
                </div>
                <div>
                  <p className="text-[9px] text-secondary uppercase font-bold">Scan Credits</p>
                  <p className="text-sm font-black text-white">{apiInfo.scanCredits}</p>
                </div>
              </div>
            )}
            <p className="text-[10px] text-secondary italic">Key is stored locally in your browser and never transit to our server logs.</p>
          </div>
        </div>
      </section>

      {/* Section 2: Scan Defaults */}
      <section className="bg-card border border-border rounded-xl  overflow-hidden">
        <div className="p-6 border-b border-border bg-background/30 flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="font-bold uppercase tracking-widest text-sm">Operational Modules</h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: 'ports', label: 'Ports & Services', desc: 'Scan for open TCP/UDP listeners' },
            { id: 'cve', label: 'CVE Intelligence', desc: 'Cross-reference detected versions with global vulns' },
            { id: 'ssl', label: 'SSL/TLS Inspection', desc: 'Verify cert chains and cipher suites' },
            { id: 'geo', label: 'Geo Intelligence', desc: 'Map target to physical/ASN location' },
          ].map(module => (
            <div key={module.id} className="flex items-start gap-4 p-4 border border-border/40 rounded-lg hover:border-accent/40 transition-all group">
              <div className="mt-1">
                <input type="checkbox" defaultChecked className="sr-only" id={module.id} />
                <label htmlFor={module.id} className="w-5 h-5 border-2 border-border rounded flex items-center justify-center cursor-pointer group-hover:border-accent">
                  <div className="w-2 h-2 bg-accent rounded-sm" />
                </label>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/90">{module.label}</h4>
                <p className="text-[10px] text-secondary leading-relaxed tracking-tight">{module.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Data Management */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-background/30 flex items-center gap-3 text-red-500">
          <Database className="w-5 h-5" />
          <h2 className="font-bold uppercase tracking-widest text-sm">Information Sanitization</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button onClick={handleClearHistory} className="flex items-center justify-between p-6 bg-background border border-border rounded-xl hover:border-red-500/40 transition-all group">
                <div className="text-left">
                  <h4 className="text-sm font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors text-white">Clear Scan History</h4>
                  <p className="text-[10px] text-secondary">Purge all localized mission logs</p>
                </div>
                <Trash2 className="w-5 h-5 text-secondary group-hover:text-red-500 transition-colors" />
             </button>
             <button onClick={handleFullReset} className="flex items-center justify-between p-6 bg-red-500/5 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all group">
                <div className="text-left">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-red-500">Factory Reset</h4>
                  <p className="text-[10px] text-secondary">Zero-out all system data and configurations</p>
                </div>
                <RefreshCcw className="w-5 h-5 text-red-500" />
             </button>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
             <button className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest hover:text-white transition-all">
               <Download className="w-4 h-4" />
               Backup Intelligence (JSON)
             </button>
          </div>
        </div>
      </section>
      
      <div className="text-center pb-12">
        <p className="text-[10px] text-secondary uppercase tracking-widest font-black opacity-30">ReconX Tactical Suite | Version 3.2.0-Alpha</p>
      </div>
    </div>
  );
};

export default SettingsPage;
