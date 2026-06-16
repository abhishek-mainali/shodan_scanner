import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, History, Bell, Search, Layers, Settings } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dash' },
    { to: '/scan', icon: Zap, label: 'Scan' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
    { to: '/templates', icon: Layers, label: 'Menu' },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-t border-border z-50 flex items-center justify-around px-4 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-accent' : 'text-secondary opacity-60'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
