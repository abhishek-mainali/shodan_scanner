import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import GlobalSearch from '../GlobalSearch';
import MobileNav from './MobileNav';


const Layout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex bg-background text-white min-h-screen font-sans selection:bg-accent/30 selection:text-white">
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Sidebar />
      <div className="flex-1 flex flex-col mb-16 sm:mb-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Layout;
