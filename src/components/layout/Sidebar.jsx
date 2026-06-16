import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  History, 
  Bell, 
  Crosshair, 
  Settings, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Layers,
  Target,
  LogOut
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const { logout, user } = useAuth();


  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/scan', icon: Zap, label: 'New Scan' },
    { to: '/search', icon: Search, label: 'Global Search' },
    { to: '/templates', icon: Layers, label: 'Templates' },
    { to: '/alerts', icon: Bell, label: 'CVE Alerts', badge: alertCount },
    { to: '/targets', icon: Target, label: 'Saved Targets' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];


  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const { data } = await api.get('/api/alerts/history');
        setAlertCount(data.length);
      } catch (e) {
        console.error('Alert count fetch failed');
      }
    };

    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-background font-black">R</div>
            <span className="font-black tracking-tighter text-xl uppercase italic">Recon<span className="text-accent">X</span></span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-background font-black mx-auto">R</div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative group
              ${isActive 
                ? 'bg-accent/10 text-accent border border-accent/20' 
                : 'text-secondary hover:text-white hover:bg-white/5'}
            `}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            )}
            
            {item.badge > 0 && (
              <span className={`absolute ${collapsed ? 'top-2 right-2' : 'right-4'} px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black animate-pulse`}>
                {item.badge}
              </span>
            )}

            {collapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl border border-border">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto space-y-2">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded bg-background border border-border text-secondary hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Collapse Intel</span>}
        </button>
        
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>}
        </button>
      </div>


      {!collapsed && (
        <div className="p-6">
          <div className="p-4 bg-accent/5 border border-accent/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3 h-3 text-accent" />
              <span className="text-[8px] font-black text-accent uppercase tracking-widest">System Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white/80">CORE SECURE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
