import React, { useState, useEffect } from 'react';
import { Layers, Plus, Play, Trash2, Edit3, Globe, Shield, Lock, Cpu, Zap, Clock, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/api/templates');
      setTemplates(data);
    } catch (e) {
      showToast('Failed to fetch tactical templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleLaunch = (template) => {
    navigate('/scan', { state: { template } });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Mission Templates</h1>
          <p className="text-sm text-secondary font-bold uppercase tracking-[0.2em]">Pre-configured tactical reconnaissance parameters</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-black text-xs rounded-lg tracking-[0.2em] hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
          <Plus className="w-4 h-4" />
          CREATE TEMPLATE
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-card/40 border border-border rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-card border border-border rounded-2xl p-6 space-y-6 hover:border-accent/40 transition-all group relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{tpl.name}</h3>
                    {tpl.isGlobal && (
                      <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[8px] font-black uppercase rounded border border-accent/20">GLOBAL</span>
                    )}
                  </div>
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">{tpl.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 relative z-10">
                {Object.entries(tpl.config.modules).map(([mod, active]) => (
                  <div key={mod} className={`flex flex-col items-center gap-1 p-2 rounded-lg border ${active ? 'bg-accent/5 border-accent/20 text-accent' : 'bg-background/20 border-border text-secondary/30 grayscale opacity-40'}`}>
                    <span className="text-[8px] font-black uppercase tracking-tighter">{mod}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4 text-[10px] text-secondary font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {tpl.config.timeout}s</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> x{tpl.useCount}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleLaunch(tpl)}
                    className="p-2.5 bg-accent/10 text-accent hover:bg-accent hover:text-background rounded-lg transition-all"
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                  <button className="p-2.5 bg-white/5 text-secondary hover:text-red-500 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Decoration */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
