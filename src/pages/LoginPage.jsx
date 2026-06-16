import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, Zap, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';
import api from '../services/api';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isSignup) {
        await api.post('/api/auth/signup', { username, email, password });
        setSuccess('Operator Registered. You may now login.');
        setIsSignup(false);
      } else {
        await login(username, password);
        const origin = location.state?.from?.pathname || '/';
        navigate(origin);
      }
    } catch (err) {
      setError(err.response?.data?.error || (isSignup ? 'Registration Failed' : 'Authentication Failed'));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_100%)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center text-background shadow-[0_0_30px_rgba(6,182,212,0.3)] mb-6 transition-all duration-500 transform hover:rotate-12">
            {isSignup ? <UserPlus className="w-12 h-12" /> : <Shield className="w-12 h-12" />}
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            RECON<span className="text-accent underline decoration-2 underline-offset-8">X</span>
          </h1>
          <p className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            {isSignup ? 'Operator Registration' : 'Security Nexus Terminal'}
          </p>
        </div>

        <div className="bg-[#1e293b] border border-border/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
          <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${isSignup ? 'bg-purple-500' : 'bg-accent'}`} />
          
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 text-red-500 animate-in shake-in-1 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-center gap-3 text-emerald-500 animate-in fade-in duration-300">
                <Shield className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{success}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">Operator ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-accent transition-colors" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-accent ring-1 ring-transparent focus:ring-accent/20 transition-all font-mono text-sm"
                  placeholder="NEW_OPERATOR"
                />
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">Operational Email</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-accent transition-colors" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-accent ring-1 ring-transparent focus:ring-accent/20 transition-all font-mono text-sm"
                    placeholder="operator@reconx.local"
                  />
                </div>
              </div>
            )}


            <div className="space-y-2">
              <label className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-accent transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-accent ring-1 ring-transparent focus:ring-accent/20 transition-all font-mono text-sm"
                  placeholder="••••••••"
                />
              </div>
              {isSignup && (
                <p className="text-[8px] text-secondary/50 font-bold uppercase tracking-widest mt-1 ml-1">Minimum 8 characters required</p>
              )}
            </div>

            <button 
              disabled={isLoading}
              className={`w-full py-4 text-background font-black text-xs rounded-xl tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-95 disabled:opacity-50 ${isSignup ? 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/20' : 'bg-accent hover:bg-accent/90 shadow-accent/20'}`}
            >
              {isLoading ? (
                <Zap className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignup ? <UserPlus className="w-5 h-5 fill-current" /> : <Zap className="w-5 h-5 fill-current" />}
                  {isSignup ? 'CREATE PROFILE' : 'AUTHORIZE ACCESS'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <button 
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setSuccess('');
              }}
              className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors"
            >
              {isSignup ? (
                <>PROCEED TO LOGIN <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>REQUEST ACCESS PROFILE <UserPlus className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="h-[1px] w-12 bg-white" />
            <span className="text-[10px] font-mono text-white">SEC_LEVEL_4</span>
            <div className="h-[1px] w-12 bg-white" />
          </div>
          <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold">
            Unauthorized access to the ReconX registry is strictly prohibited under Operational Policy.
          </p>
          <p className="text-[9px] text-secondary/30 font-mono tracking-widest">NEXUS_SYSTEM_v5_DISTROL</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
