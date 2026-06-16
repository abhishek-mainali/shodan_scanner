import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon }) => {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-card border border-border p-6 rounded-lg hover:border-accent/40 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        {Icon && <Icon className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />}
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
          isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-secondary text-sm font-medium uppercase tracking-wider">{label}</h3>
        <p className="text-3xl font-bold font-mono tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
