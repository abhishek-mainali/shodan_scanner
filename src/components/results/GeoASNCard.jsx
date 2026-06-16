import React from 'react';
import { MapPin, Globe, Server, Hash, Crosshair } from 'lucide-react';

const GeoASNCard = ({ geo }) => {
  if (!geo) return (
    <div className="bg-card border border-border p-12 text-center rounded-lg">
      <p className="text-secondary uppercase tracking-[0.2em] font-bold">No Geographical Intel Available</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        {/* Map Section */}
        <div className="flex-1 bg-background relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
          {/* Simple SVG World Map Placeholder */}
          <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20 fill-secondary">
            <path d="M150 100 L850 100 L850 400 L150 400 Z" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="5,5" />
            <circle cx="500" cy="250" r="200" stroke="currentColor" fill="none" strokeWidth="0.5" />
            <line x1="0" y1="250" x2="1000" y2="250" stroke="currentColor" strokeWidth="0.5" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* Dynamic Pin Indicator */}
          <div className="absolute flex flex-col items-center animate-bounce">
            <MapPin className="w-8 h-8 text-red-500 fill-red-500/20" />
            <div className="w-4 h-1 bg-red-500/40 rounded-full blur-[2px]" />
          </div>

          <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded border border-white/10">
            <p className="text-[10px] font-mono text-accent">LAT: {geo.lat || '0.00'}</p>
            <p className="text-[10px] font-mono text-accent">LNG: {geo.lng || '0.00'}</p>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Target Locked</span>
          </div>
        </div>

        {/* Data Section */}
        <div className="flex-1 flex flex-col divide-y divide-border/40">
          <div className="p-8 space-y-6">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] border-b border-border pb-4">Geographic Intel</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Country</p>
                  <p className="font-bold text-white/90">{geo.country || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">City</p>
                  <p className="font-bold text-white/90">{geo.city || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 bg-background/20 space-y-6">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] border-b border-border pb-4">Network Backbone</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Server className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Organization / ISP</p>
                  <p className="font-bold text-white/90">{geo.org || geo.isp || 'Internal Network'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Hash className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Autonomous System (ASN)</p>
                  <p className="font-mono text-accent font-bold">{geo.asn || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoASNCard;
