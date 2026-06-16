import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Bell, User } from 'lucide-react';

const Topbar = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    switch (path) {
      case 'dashboard': return 'Command Dashboard';
      case 'scan': return 'New Recon Mission';
      case 'results': return 'Intelligence Reports';
      default: return 'ReconX System';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-white/90">
        {getPageTitle()}
      </h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
        </div>

        <Link 
          to="/scan"
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-background px-4 py-1.5 rounded font-bold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          NEW SCAN
        </Link>

        <div className="flex items-center gap-4 border-l border-border pl-6">
          <button className="text-secondary hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 text-secondary hover:text-white transition-colors">
            <div className="w-8 h-8 rounded bg-card border border-border flex items-center justify-center text-xs font-bold">
              RX
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
