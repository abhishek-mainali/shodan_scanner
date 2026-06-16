import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';

const ScanStatus = ({ status = 'idle', progress }) => {
  if (status === 'idle') return null;

  const steps = [
    { label: 'Resolving target', threshold: 10 },
    { label: 'Fetching host data', threshold: 45 },
    { label: 'Analyzing services', threshold: 55 },
    { label: 'Checking CVEs', threshold: 65 },
    { label: 'Verifying SSL', threshold: 75 },
    { label: 'Mapping location', threshold: 85 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {status === 'running' ? (
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          ) : status === 'completed' ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-red-500" />
          )}
          
          <div>
            <h4 className="font-bold uppercase tracking-wider">
              {progress?.step || 'Operation Active'}
            </h4>
            <p className="text-secondary text-xs">
              Mantle protocol active. Processing stream...
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black font-mono text-accent">{progress?.percent || 0}%</p>
          <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Progress</p>
        </div>
      </div>

      <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border relative">
        <div 
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
          style={{ width: `${progress?.percent || 0}%` }} 
        />
        {status === 'running' && (
          <div className="absolute top-0 h-full bg-white/20 animate-[scan_2s_infinite_linear]" style={{ width: '40%' }} />
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-border/40 pt-4">
        {steps.map((step) => {
          const isDone = (progress?.percent || 0) >= step.threshold;
          const isActive = progress?.step && progress.step.toLowerCase().includes(step.label.toLowerCase().split(' ')[0]);
          
          return (
            <div key={step.label} className={`flex items-center gap-2 transition-colors ${isDone ? 'text-green-500' : isActive ? 'text-accent' : 'text-secondary/40'}`}>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isDone ? 'bg-green-500 border-green-500' : isActive ? 'border-accent animate-pulse' : 'border-border'}`}>
                {isDone && <Check className="w-3 h-3 text-background" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScanStatus;
