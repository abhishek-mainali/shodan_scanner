import React, { useEffect, useState } from 'react';

const RiskGauge = ({ score }) => {
  const [offset, setOffset] = useState(251); // Total circumference for 40px radius
  
  useEffect(() => {
    const progress = (score / 100) * 251;
    const timer = setTimeout(() => {
      setOffset(251 - progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score > 75) return '#ef4444'; // Critical - Red
    if (score > 50) return '#f97316'; // High - Orange
    if (score > 25) return '#eab308'; // Medium - Yellow
    return '#22c55e'; // Low - Green
  };

  const getLabel = () => {
    if (score > 75) return 'CRITICAL';
    if (score > 50) return 'HIGH';
    if (score > 25) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg relative overflow-hidden group">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-secondary/10"
          />
          <circle
            cx="80"
            cy="80"
            r="40"
            stroke={getColor()}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251"
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-mono tracking-tighter" style={{ color: getColor() }}>{score}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Risk Score</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className={`text-xs font-black px-3 py-1 rounded border inline-block tracking-widest`} style={{ borderColor: `${getColor()}20`, backgroundColor: `${getColor()}10`, color: getColor() }}>
          {getLabel()} THREAT LEVEL
        </div>
      </div>

      {/* Decorative pulse background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none transition-colors duration-500" 
        style={{ backgroundColor: getColor() }} 
      />
    </div>
  );
};

export default RiskGauge;
