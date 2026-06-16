import React, { useState, useEffect } from 'react';
import { Target, Plus, Folder, Trash2, Search, ExternalLink, Tag, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { useToast } from '../components/Toast';

const TargetsPage = () => {
  const [targets, setTargets] = useState([]);
  const [groups, setGroups] = useState(['Personal', 'Production', 'Staging']);
  const [activeGroup, setActiveGroup] = useState('Personal');
  const [viewMode, setViewMode] = useState('grid');
  const { showToast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reconx_targets') || '[]');
    setTargets(saved);
  }, []);

  const saveTargets = (updated) => {
    setTargets(updated);
    localStorage.setItem('reconx_targets', JSON.stringify(updated));
  };

  const handleAddTarget = () => {
    const target = prompt('Enter Target IP or Domain:');
    if (!target) return;
    const label = prompt('Enter Tactical Label:');
    
    const newEntry = {
      id: Date.now().toString(),
      target,
      label: label || target,
      group: activeGroup,
      tags: ['external'],
      lastScan: null,
      risk: null
    };

    saveTargets([...targets, newEntry]);
    showToast('Target initialized in registry', 'success');
  };

  const deleteTarget = (id) => {
    saveTargets(targets.filter(t => t.id !== id));
    showToast('Target removed from database', 'info');
  };

  const filtered = targets.filter(t => t.group === activeGroup);

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500">
      {/* Group Sidebar */}
      <aside className="w-64 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] px-2 flex justify-between items-center">
            Operational Groups
            <button className="text-accent hover:text-white"><Plus className="w-4 h-4" /></button>
          </h3>
          <div className="space-y-1">
            {groups.map(g => (
              <button 
                key={g} 
                onClick={() => setActiveGroup(g)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${activeGroup === g ? 'bg-accent/10 text-accent font-bold' : 'text-secondary hover:bg-card hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">{g}</span>
                </div>
                <span className="text-[10px] bg-background px-1.5 rounded">{targets.filter(t => t.group === g).length}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">{activeGroup} Registry</h1>
            <p className="text-secondary text-xs font-bold uppercase tracking-widest">{filtered.length} targets under surveillance</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-background border border-border p-1 rounded-lg">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-card text-accent' : 'text-secondary'}`}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-card text-accent' : 'text-secondary'}`}><List className="w-4 h-4" /></button>
            </div>
            <button onClick={handleAddTarget} className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-black uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-all">
              <Plus className="w-4 h-4" />
              Register Target
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filtered.length === 0 ? (
            <div className="col-span-full p-24 text-center border border-dashed border-border rounded-2xl">
              <Target className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
              <p className="text-secondary uppercase tracking-widest text-xs font-bold">No assets registered in this group</p>
            </div>
          ) : (
            filtered.map(t => (
              <div key={t.id} className="bg-card border border-border p-6 rounded-xl space-y-6 hover:border-accent/40 transition-all group relative">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-white/90">{t.label}</h4>
                    <p className="font-mono text-xs text-accent">{t.target}</p>
                  </div>
                  <button onClick={() => deleteTarget(t.id)} className="text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {t.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded bg-background border border-border text-[10px] text-secondary font-bold uppercase">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  <button className="px-2 py-0.5 rounded border border-dashed border-border text-[10px] text-secondary hover:text-white">+</button>
                </div>

                <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Last Recon</p>
                    <p className="text-[10px] font-mono">{t.lastScan || 'NEVER'}</p>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest group-hover:underline transition-all">
                    EXAMINE
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default TargetsPage;
