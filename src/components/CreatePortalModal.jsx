import React, { useState } from 'react';
import { Shield, Send, Copy, Check, Clock, User, Palette, Globe, X, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';

const CreatePortalModal = ({ scanIds, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    expiresIn: '168', // 7 days in hours
    branding: {
      companyName: 'ReconX Intelligence',
      reporterName: 'Lead Security Analyst',
      accentColor: '#06b6d4'
    }
  });

  const [loading, setLoading] = useState(false);
  const [portalData, setPortalData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/portal/reports', {
        scanIds,
        ...form
      });
      setPortalData(data);
      setStep(3);
    } catch (e) {
      console.error('Failed to create portal');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const fullUrl = `${window.location.origin}${portalData.portalUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-white tracking-tight">Client Portal Generator</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-secondary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Client Name / Organization</label>
                  <input 
                    type="text" 
                    value={form.clientName}
                    onChange={e => setForm({...form, clientName: e.target.value})}
                    placeholder="e.g. Acme Corp Cybersecurity Team"
                    className="w-full bg-background border-border rounded-lg px-4 py-3 focus:border-accent ring-1 ring-transparent focus:ring-accent/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Link Expiry</label>
                  <select 
                    value={form.expiresIn}
                    onChange={e => setForm({...form, expiresIn: e.target.value})}
                    className="w-full bg-background border-border rounded-lg px-4 py-3 text-sm"
                  >
                    <option value="24">24 Hours (Tactical)</option>
                    <option value="168">7 Days (Standard)</option>
                    <option value="720">30 Days (Extended)</option>
                    <option value="never">Never (Persistent)</option>
                  </select>
                </div>
              </div>
              <button 
                disabled={!form.clientName}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-accent hover:bg-accent/90 text-background font-black text-xs rounded-lg tracking-[0.2em] disabled:opacity-50"
              >
                CUSTOMIZE BRANDING
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Reporter Identification</label>
                  <input 
                    type="text" 
                    value={form.branding.reporterName}
                    onChange={e => setForm({...form, branding: {...form.branding, reporterName: e.target.value}})}
                    className="w-full bg-background border-border rounded-lg px-4 py-3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Portal Accent Color</label>
                  <div className="flex gap-2">
                    {['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setForm({...form, branding: {...form.branding, accentColor: c}})}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${form.branding.accentColor === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs rounded-lg tracking-[0.2em]">BACK</button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] py-4 bg-accent hover:bg-accent/90 text-background font-black text-xs rounded-lg tracking-[0.2em]"
                >
                  {loading ? 'GENERATING SECURE LINK...' : 'GENERATE PORTAL'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500 mb-2">
                  <Check className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Portal Active</h3>
                <p className="text-sm text-secondary">A secure intelligence channel has been established for {form.clientName}.</p>
              </div>

              <div className="bg-background/50 border border-border rounded-2xl p-6 space-y-6">
                <div className="flex justify-center bg-white p-4 rounded-xl">
                  <QRCodeSVG value={`${window.location.origin}${portalData.portalUrl}`} size={160} />
                </div>
                
                <div className="relative group">
                  <input 
                    readOnly
                    value={`${window.location.origin}${portalData.portalUrl}`}
                    className="w-full bg-card border-border rounded-lg pl-4 pr-12 py-3 text-sm font-mono text-accent"
                  />
                  <button 
                    onClick={copyLink}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-accent/10 text-accent rounded-lg transition-all"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs rounded-lg tracking-[0.2em]"
              >
                CLOSE DISPATCHER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePortalModal;
