import React from 'react';

const PortsTable = ({ ports = [] }) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-background/50 text-secondary text-[10px] uppercase tracking-[0.2em] font-bold">
          <tr>
            <th className="px-6 py-3 border-b border-border text-accent">Port</th>
            <th className="px-6 py-3 border-b border-border">Protocol</th>
            <th className="px-6 py-3 border-b border-border">Service</th>
            <th className="px-6 py-3 border-b border-border">Version</th>
            <th className="px-6 py-3 border-b border-border">State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {ports.map((p, idx) => (
            <tr key={idx} className="hover:bg-white/5 transition-colors font-mono text-sm leading-relaxed">
              <td className="px-6 py-4 text-accent font-bold">{p.port}</td>
              <td className="px-6 py-4 uppercase text-white/70">{p.protocol}</td>
              <td className="px-6 py-4 font-bold">{p.service}</td>
              <td className="px-6 py-4 text-secondary">{p.version}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                  {p.state}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortsTable;
