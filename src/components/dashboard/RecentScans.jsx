import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Clock, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          Completed
        </span>
      );
    case 'running':
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-wider animate-pulse">
          <Zap className="w-3 h-3" />
          Running
        </span>
      );
    case 'failed':
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-3 h-3" />
          Failed
        </span>
      );
    default:
      return null;
  }
};

const RecentScans = ({ scans }) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          Recent Operations
        </h3>
        <button className="text-xs text-accent hover:underline font-bold uppercase tracking-widest">
          View All Logs
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-background/50 text-secondary text-[10px] uppercase tracking-[0.2em] font-bold">
            <tr>
              <th className="px-6 py-3 border-b border-border">Target</th>
              <th className="px-6 py-3 border-b border-border">Type</th>
              <th className="px-6 py-3 border-b border-border">Status</th>
              <th className="px-6 py-3 border-b border-border">Date</th>
              <th className="px-6 py-3 border-b border-border text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-mono text-sm font-bold text-white/90">{scan.target}</div>
                  <div className="text-[10px] text-secondary font-mono">{scan.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-white/70 font-medium">{scan.type}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={scan.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-secondary font-mono">{scan.timestamp}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    to={`/results/${scan.id}`}
                    className="inline-flex items-center gap-1.5 text-accent hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    RESULTS
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScans;
