import React from 'react';
import { AlertCircle, RotateCcw, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center bg-card border border-red-500/20 rounded-2xl m-8">
          <div className="p-4 bg-red-500/10 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">System Fault Detected</h1>
          <p className="text-secondary max-w-md mb-8 leading-relaxed">
            A critical error occurred in the ReconX UI layer. Operational continuity has been interrupted.
          </p>
          <div className="bg-background/50 p-4 rounded font-mono text-xs text-red-400 mb-8 max-w-xl overflow-auto border border-border">
            {this.state.error?.message}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-background font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Station
            </button>
            <button className="px-6 py-3 bg-card border border-border text-secondary font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:text-white transition-all">
              <Bug className="w-4 h-4" />
              Report Bug
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
