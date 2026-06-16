import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Share2, Activity, ArrowLeft } from 'lucide-react';
import { mockScans } from '../utils/mockData';
import PortsTable from '../components/results/PortsTable';
import CVEList from '../components/results/CVEList';
import SSLInfo from '../components/results/SSLInfo';
import GeoASNCard from '../components/results/GeoASNCard';
import IntelTab from '../components/results/IntelTab';
import ExportToolbar from '../components/results/ExportToolbar';
import RiskGauge from '../components/results/RiskGauge';
import CreatePortalModal from '../components/CreatePortalModal';

import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

const ResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  
  // Use real data from navigation state, otherwise look in history/mock
  const [scan, setScan] = useState(() => {
    if (location.state?.scanResult) return location.state.scanResult;
    
    const history = JSON.parse(localStorage.getItem('reconx_history') || '[]');
    const historyItem = history.find(h => h.id === id);
    if (historyItem && historyItem.fullData) return historyItem.fullData; // We should store full data in history for detail view

    return mockScans.find(s => s.id === id) || mockScans[0];
  });

  const tabs = ['Overview', 'Ports & Services', 'CVEs', 'SSL/TLS', 'Geo & ASN', 'Intelligence'];

  // Frontend calculation matching backend algorithm
  const calculateRisk = (s) => {
    let score = 0;
    const cves = s.cves || [];
    const ports = s.ports || [];
    const ssl = s.ssl;
    const intel = s.intel;

    score += Math.min(cves.filter(c => c.severity === 'CRITICAL').length * 20, 60);
    score += Math.min(cves.filter(c => c.severity === 'HIGH').length * 10, 40);
    score += Math.min(cves.filter(c => c.severity === 'MEDIUM').length * 5, 20);
    if (ports.length > 20) score += 10;
    if (ports.some(p => p.service === 'ssh' && p.port !== 22)) score += 5;
    if (ssl && !ssl.valid) score += 15;
    if (intel && intel.threatLevel === 'MALICIOUS') score += 20;
    if (!cves.length) score -= 10;
    return Math.max(0, Math.min(100, score));
  };


  const riskScore = calculateRisk(scan);

  useKeyboardShortcuts({
    onExportPDF: () => document.querySelector('button[title="Export PDF"]')?.click(),
    onEscape: () => navigate('/dashboard')
  });

  // Port distribution data for chart
  const portData = (scan?.ports || []).reduce((acc, p) => {
    const service = p.service || 'unknown';
    const existing = acc.find(item => item.name === service);
    if (existing) existing.value += 1;
    else acc.push({ name: service, value: 1 });
    return acc;
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Ports & Services': return <PortsTable ports={scan.ports} />;
      case 'CVEs': return <CVEList cves={scan.cves} />;
      case 'SSL/TLS': return <SSLInfo ssl={scan.ssl} />;
      case 'Geo & ASN': return <GeoASNCard geo={scan.geo} />;
      case 'Intelligence': return <IntelTab intel={scan.intel} geo={scan.geo} />;
      default: return (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-6">Service Distribution</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {portData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#0891b2'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-lg pointer-events-none">
                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Total Vulnerabilities</h4>
                <p className="text-4xl font-black font-mono text-white">{scan.cves?.length || 0}</p>
              </div>
              <div className="bg-card border border-border p-6 rounded-lg pointer-events-none">
                <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Unique Services</h4>
                <p className="text-4xl font-black font-mono text-white">{new Set(scan.ports?.map(p => p.service)).size}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
              <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Target Intel Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Primary IP</p>
                  <p className="font-mono text-sm">{scan.geo?.ip || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">ASN / Org</p>
                  <p className="text-sm font-medium">{scan.geo?.asn || 'N/A'} - {scan.geo?.org || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Processed</p>
                  <p className="text-sm font-medium">{new Date(scan.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-lg hover:border-accent text-[10px] font-bold uppercase tracking-widest transition-colors">
              <Download className="w-4 h-4" />
              Download RAW JSON
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-lg hover:border-accent text-[10px] font-bold uppercase tracking-widest transition-colors">
              <Share2 className="w-4 h-4" />
              Generate API Link
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-card rounded-full text-secondary hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-black font-mono tracking-tighter text-white/90">
              {scan.target}
            </h1>
            <span className="px-2 py-0.5 rounded bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-tighter">
              {scan.type}
            </span>
          </div>
          <p className="text-secondary text-xs font-mono uppercase tracking-widest ml-11">
            REPORT-ID: {scan.id}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-accent text-background border border-accent shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'text-secondary hover:text-white border border-border bg-card'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ExportToolbar scanResult={scan} />

      <div className="min-h-[400px]">
        {activeTab === 'Overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-6">Service Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {portData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#0891b2'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border p-6 rounded-lg">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Total Vulnerabilities</h4>
                  <p className="text-4xl font-black font-mono text-white">{scan.cves?.length || 0}</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-lg text-right">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">Unique Services</h4>
                  <p className="text-4xl font-black font-mono text-white">{new Set(scan.ports?.map(p => p.service)).size}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <RiskGauge score={riskScore} />
              
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Target Intel Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Primary IP</p>
                    <p className="font-mono text-sm">{scan.geo?.ip || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">ASN / Org</p>
                    <p className="text-sm font-medium">{scan.geo?.asn || 'N/A'} - {scan.geo?.org || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Processed</p>
                    <p className="text-sm font-medium">{new Date(scan.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsPortalModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-background rounded-lg hover:bg-accent/90 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-accent/20"
              >
                <Share2 className="w-4 h-4" />
                Intelligence Briefing Portal
              </button>
            </div>
          </div>
        ) : (
          renderContent()
        )}

        <CreatePortalModal 
          isOpen={isPortalModalOpen} 
          onClose={() => setIsPortalModalOpen(false)} 
          scanIds={[scan.id]} 
        />
      </div>
    </div>
  );
};



export default ResultsPage;
