import React from 'react';
import { ShieldCheck, Calendar, User, Fingerprint } from 'lucide-react';

const SSLInfo = ({ ssl }) => {
  if (!ssl) return <div className="bg-card border border-border p-8 rounded-lg text-secondary">No SSL information available for this target.</div>;

  return (
    <div className="bg-card border border-border rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${ssl.valid ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-wider">Certificate Status</h4>
            <p className={ssl.valid ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
              {ssl.valid ? 'VALID & TRUSTED' : 'INVALID / EXPIRED'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-secondary mt-1" />
            <div>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Subject</p>
              <p className="font-mono text-sm">{ssl.subject}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-secondary mt-1" />
            <div>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Issuer</p>
              <p className="font-mono text-sm">{ssl.issuer}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-secondary mt-1" />
          <div>
            <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Expiry Date</p>
            <p className="font-mono text-sm">{ssl.expiry}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Fingerprint className="w-4 h-4 text-secondary mt-1" />
          <div className="overflow-hidden">
            <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Fingerprint</p>
            <p className="font-mono text-[10px] break-all leading-tight text-white/60">{ssl.fingerprint}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSLInfo;
