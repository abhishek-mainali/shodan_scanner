import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TargetInput from '../components/scan/TargetInput';
import ScanStatus from '../components/scan/ScanStatus';
import { useShodan } from '../hooks/useShodan';
import { AlertCircle } from 'lucide-react';

const ScanPage = () => {
  const navigate = useNavigate();
  const { scan, loading, error, progress, cancelScan } = useShodan();

  const handleStartScan = async (target) => {
    try {
      const result = await scan(target);
      if (result) {
        navigate(`/results/${result.id}`, { state: { scanResult: result } });
      }
    } catch (e) {
      console.error("Scan rejected", e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Mission Control</h1>
        <p className="text-secondary tracking-widest text-xs uppercase font-bold">Initiate deep reconnaissance operations</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 text-red-500 animate-in shake-in-1 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-sm">
            <span className="font-bold uppercase mr-2">Error:</span>
            {error.message}
          </div>
        </div>
      )}

      <TargetInput onStart={handleStartScan} isLoading={loading} onCancel={cancelScan} />
      
      {loading && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] border-b border-border pb-2">Active Tasking</h3>
          <ScanStatus status="running" progress={progress} />
        </div>
      )}
    </div>
  );
};

export default ScanPage;
