import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, FileText, Download, Target, Lock, Cpu, Globe, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ClientPortalPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeScanId, setActiveScanId] = useState(null);
  const [activeScan, setActiveScan] = useState(null);

  useEffect(() => {
    const fetchPortal = async () => {
      try {
        const { data: portal } = await api.get(`/api/portal/${token}`);
        setData(portal);
        if (portal.scanIds?.length > 0) setActiveScanId(portal.scanIds[0]);
      } catch (e) {
        console.error('Portal access failed');
      } finally {
        setLoading(false);
      }
    };
    fetchPortal();
  }, [token]);

  useEffect(() => {
    if (activeScanId) {
      const fetchScan = async () => {
        try {
          const { data: scan } = await api.get(`/api/portal/${token}/scans/${activeScanId}`);
          setActiveScan(scan);
        } catch (e) {
          console.error('Failed to load scan data');
        }
      };
      fetchScan();
    }
  }, [activeScanId, token]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Securing access to assessment report...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 border border-slate-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 text-sm">This secure assessment link has expired, been revoked, or is otherwise invalid.</p>
        </div>
        <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all">
          Contact Security Team
        </button>
      </div>
    </div>
  );

  const stats = data.branding || { companyName: 'ReconX Security', reporterName: 'Security Analyst' };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 h-20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{stats.companyName}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Intelligence Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-500">CLIENT ASSESSMENT</p>
              <p className="text-sm font-bold text-slate-900">{data.clientName}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Download className="w-4 h-4" />
              DOWNLOAD PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <nav className="w-full lg:w-64 space-y-2 shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Assessment Scopes</p>
          {data.scanIds?.map((id, idx) => (
            <button
              key={id}
              onClick={() => setActiveScanId(id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${activeScanId === id ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4" />
                <span className="text-sm font-bold truncate">Target Assessment {idx + 1}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
          
          <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-white space-y-4">
            <h3 className="text-sm font-bold">Confidentiality</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">"This report contains sensitive security intelligence. Unauthorized distribution is strictly prohibited and governed by non-disclosure agreements."</p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase">{stats.reporterName[0]}</div>
              <div>
                <p className="text-[10px] font-bold">{stats.reporterName}</p>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest">Lead Analyst</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {activeScan ? (
            <>
              {/* Executive Overview */}
              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-slate-900">{activeScan.target}</h2>
                    <p className="text-sm text-slate-500">Scan Finalized: {new Date(activeScan.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-center px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Rating</p>
                    <p className={`text-2xl font-black ${activeScan.cves?.length > 5 ? 'text-red-600' : 'text-blue-600'}`}>
                      {activeScan.cves?.length > 5 ? 'CRITICAL' : 'ELEVATED'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <Cpu className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Network Exposure</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{activeScan.ports?.length}</p>
                    <p className="text-xs text-slate-500">Active listening services detected</p>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Vulnerabilities</span>
                    </div>
                    <p className="text-3xl font-black text-red-600">{activeScan.cves?.length || 0}</p>
                    <p className="text-xs text-slate-500">Known exploits found in registry</p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                      <Lock className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Transport Security</span>
                    </div>
                    <p className="text-3xl font-black text-blue-600">{activeScan.ssl ? 'ENCRYPTED' : 'PLAIN'}</p>
                    <p className="text-xs text-slate-500">TLS/SSL configuration status</p>
                  </div>
                </div>
              </section>

              {/* Security Recommendations */}
              <section className="bg-slate-900 rounded-2xl p-8 text-white space-y-6 shadow-xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-lg font-bold">Tactical Recommendations</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-bold border border-emerald-500/20">1</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">Patch High-Severity CVEs</h4>
                      <p className="text-xs text-white/60 leading-relaxed">Prioritize remediation of detected RCE and Elevation of Privilege vulnerabilities.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/20">2</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold">Harden Attack Surface</h4>
                      <p className="text-xs text-white/60 leading-relaxed">Review the {activeScan.ports?.length} open ports and disable non-essential services like Telnet or Legacy SSL.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Table */}
              <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Detailed Intelligence
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-4">Service</th>
                        <th className="px-8 py-4">Port</th>
                        <th className="px-8 py-4">Technology</th>
                        <th className="px-8 py-4 text-right">Observation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeScan.ports?.map((p, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-slate-900">{p.service}</td>
                          <td className="px-8 py-4 text-sm font-mono text-slate-500">{p.port}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-tighter">
                              {p.version || 'Version Masked'}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${p.state === 'open' ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {p.state || 'active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Select a scan target to view intelligence details...</div>
          )}
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {stats.companyName} | Operational Intelligence Report</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Token Verified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> AES-256 Encrypted Delivery</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientPortalPage;
