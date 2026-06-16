import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Decrypting Session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-12 text-center">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">ACCESS DENIED</h1>
        <p className="text-secondary max-w-md uppercase text-xs font-bold tracking-widest leading-relaxed">
          Insufficient clearance level. Your current credentials do not grant access to this secure operational vector.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="mt-8 px-8 py-3 border border-border hover:border-accent text-accent font-black uppercase tracking-widest rounded transition-all"
        >
          RETURN TO SAFETY
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
