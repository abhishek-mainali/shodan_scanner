import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, Zap, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_100%)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center text-background shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-6">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            RECON<span className="text-accent underline decoration-2 underline-offset-8">X</span>
          </h1>
          <p className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mt-4">Security Nexus Terminal</p>
        </div>

        <div className="bg-[#1e293b] border border-border/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 text-red-500 animate-in shake-in-1 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-accent transition-colors" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent ring-1 ring-transparent focus:ring-accent/20 transition-all font-mono"
                  placeholder="OPS_COMMANDER"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">Authorization Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-accent transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-white focus:border-accent ring-1 ring-transparent focus:ring-accent/20 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 bg-accent hover:bg-accent/90 text-background font-black text-lg rounded-xl tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 transition-all transform active:scale-95"
            >
              {isLoading ? (
                <Zap className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Zap className="w-6 h-6 fill-current" />
                  AUTHORIZE
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-secondary uppercase tracking-widest">
            Unauthorised access to ReconX console is strictly prohibited.
          </p>
          <p className="text-[10px] text-secondary/40 font-mono mt-2">SYS_REF: 0xRECONX_NEXUS_v4</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
