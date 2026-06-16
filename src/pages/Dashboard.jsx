import React, { useState, useEffect } from 'react';
import { Shield, Target, AlertTriangle, Monitor, Trash2, History } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentScans from '../components/dashboard/RecentScans';
import { mockScans, stats as mockStats } from '../utils/mockData';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const icons = [Shield, Target, AlertTriangle, Monitor];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reconx_history') || '[]');
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Initialize history deletion protocol? All local scan logs will be purged.')) {
      localStorage.removeItem('reconx_history');
      setHistory([]);
    }
  };

  // Combine mock scans and history for display
  const allScans = [...history, ...mockScans].slice(0, 10);

  // Derive stats from history + mock
  const totalScans = history.length + 128; // Using mock base
  const dashboardStats = [
    { label: "Total Operations", value: totalScans, trend: "+12%" },
    { label: "Live Nodes", value: 412, trend: "+5%" },
    { label: "High Risk CVEs", value: 24, trend: "-2%" },
    { label: "Network Coverage", value: "89%", trend: "+8%" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            icon={icons[index]}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold tracking-tight uppercase">Operational Logs</h3>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="h-px w-32 bg-border/50 hidden md:block" />
             <button 
              onClick={clearHistory}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded border border-red-500/20 transition-all disabled:opacity-30"
            >
              <Trash2 className="w-3 h-3" />
              Purge Database
            </button>
          </div>
        </div>

        <RecentScans scans={allScans} />
      </div>
    </div>
  );
};

export default Dashboard;
