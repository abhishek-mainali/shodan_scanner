import React, { useState } from 'react';
import { FileText, Database, Link, Loader2, Check } from 'lucide-react';
import { useToast } from '../Toast';
import axios from 'axios';

const ExportToolbar = ({ scanResult }) => {
  const [loading, setLoading] = useState(null);
  const { showToast } = useToast();

  const handleExportPDF = async () => {
    setLoading('pdf');
    try {
      const response = await axios.post('http://localhost:3001/api/export/pdf', { scanResult }, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ReconX_Report_${scanResult.target}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      showToast('PDF Report generated successfully', 'success');
    } catch (err) {
      showToast('failed to generate PDF report', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleExportJSON = async () => {
    setLoading('json');
    try {
      const response = await axios.post('http://localhost:3001/api/export/json', { scanResult });
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `ReconX_Report_${scanResult.target}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showToast('JSON Report downloaded', 'success');
    } catch (err) {
      showToast('failed to export JSON', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleCopyLink = () => {
    const baseUrl = window.location.origin + '/results';
    const deepLink = `${baseUrl}?scan=${btoa(scanResult.id)}`;
    navigator.clipboard.writeText(deepLink);
    showToast('Secure report link copied to clipboard', 'info');
  };

  return (
    <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-lg mb-8">
      <button 
        onClick={handleExportPDF}
        disabled={!!loading}
        className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accent/20 transition-all disabled:opacity-50"
      >
        {loading === 'pdf' ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
        Export PDF
      </button>

      <button 
        onClick={handleExportJSON}
        disabled={!!loading}
        className="flex items-center gap-2 px-4 py-2 text-secondary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all disabled:opacity-50"
      >
        {loading === 'json' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
        Export JSON
      </button>

      <div className="h-4 w-px bg-border mx-2" />

      <button 
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 text-secondary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
      >
        <Link className="w-3 h-3" />
        Copy Report Link
      </button>
    </div>
  );
};

export default ExportToolbar;
