import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Shield, Plus, Trash2, Zap, Clock, ShieldAlert, CheckCircle } from 'lucide-react';

import { useToast } from '../components/Toast';

const AlertsPage = () => {
  const [targets, setTargets] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [newTarget, setNewTarget] = useState({ target: '', label: '', threshold: 'critical' });

  useEffect(() => {
    fetchAlerts();
    fetchHistory();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await api.get('/api/alerts/targets');
      setTargets(data);
    } catch (e) {
      showToast('Failed to fetch alert targets', 'error');
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/api/alerts/history');
      setHistory(data);
    } catch (e) {
      console.error('Failed to fetch history', e);
    }
  };

  const handleAddTarget = async (e) => {
    e.preventDefault();
    if (!newTarget.target) return;
    try {
      await api.post('/api/alerts/targets', newTarget);
      showToast('Asset added to watch list', 'success');
      setNewTarget({ target: '', label: '', threshold: 'critical' });
      fetchAlerts();
    } catch (e) {
      showToast('Failed to add target', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/alerts/targets/${id}`);
      showToast('Target removed from analysis', 'info');
      fetchAlerts();
    } catch (e) {
      showToast('Failed to delete target', 'error');
    }
  };

  const triggerCheck = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/alerts/check');
      showToast(`Manual check complete. ${data.eventsFound} new events detected.`, 'info');
      fetchAlerts();
      fetchHistory();
    } catch (e) {
      showToast('Alert check failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Vulnerability Watchtower</h1>
          <p className="text-secondary text-xs font-bold uppercase tracking-widest">Active monitoring and automated threat detection</p>
        </div>
        <button 
          onClick={triggerCheck}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-black uppercase tracking-widest rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50"
        >
          {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Execute Global Check
        </button>
      </div>

      {/* Add Form */}
      <section className="bg-card border border-border p-8 rounded-xl space-y-6">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
          <Plus className="w-4 h-4 text-accent" />
          Enlist New Asset
        </h3>
        <form onSubmit={handleAddTarget} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] text-secondary font-bold uppercase">Target Value</label>
            <input 
              value={newTarget.target}
              onChange={e => setNewTarget({...newTarget, target: e.target.value})}
              placeholder="IP or Domain" 
              className="w-full bg-background border-border rounded px-4 py-2 font-mono" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-secondary font-bold uppercase">Tactical Label</label>
            <input 
              value={newTarget.label}
              onChange={e => setNewTarget({...newTarget, label: e.target.value})}
              placeholder="e.g. Prod DB" 
              className="w-full bg-background border-border rounded px-4 py-2" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-secondary font-bold uppercase">Alert Threshold</label>
            <select 
              value={newTarget.threshold}
              onChange={e => setNewTarget({...newTarget, threshold: e.target.value})}
              className="w-full bg-background border-border rounded px-4 py-2"
            >
              <option value="critical">Critical Only</option>
              <option value="high">High +</option>
              <option value="medium">Medium +</option>
              <option value="all">All Changes</option>
            </select>
          </div>
          <button className="h-[42px] bg-accent/10 border border-accent/20 text-accent font-black uppercase tracking-widest rounded hover:bg-accent/20 transition-all">
            Start Watch
          </button>
        </form>
      </section>

      {/* Watch List */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Active Assets</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background/50 text-secondary text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Label / Target</th>
                <th className="px-6 py-4">Threshold</th>
                <th className="px-6 py-4">Last Checked</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {targets.map(target => (
                <tr key={target.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold">{target.label}</div>
                    <div className="text-xs font-mono text-secondary">{target.target}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase border border-border px-2 py-0.5 rounded">{target.threshold}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-secondary">
                    {target.lastChecked ? new Date(target.lastChecked).toLocaleString() : 'PENDING'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${target.status === 'alert_triggered' ? 'text-red-500' : 'text-accent'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${target.status === 'alert_triggered' ? 'bg-red-500 animate-pulse' : 'bg-accent'}`} />
                      {target.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(target.id)} className="p-2 text-secondary hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* History */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Event Intelligence Feed
        </h3>
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl text-secondary text-xs uppercase tracking-widest">
              No security events detected in latest cycles
            </div>
          ) : (
            history.map(event => (
              <div key={event.id} className="bg-card border border-border p-6 rounded-xl flex items-center justify-between gap-6 hover:border-red-500/40 transition-all border-l-4 border-l-red-500">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-white/90">
                      Vulnerability Delta Detected: {event.target}
                    </h4>
                    <p className="text-secondary text-xs mt-1">
                      {event.count} new findings discovered on external surface area.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-secondary mb-1">{new Date(event.timestamp).toLocaleString()}</div>
                  <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Analysis Report</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AlertsPage;
