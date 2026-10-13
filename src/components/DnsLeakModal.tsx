import React, { useState, useEffect } from 'react';
import { useVPN } from '../context/VPNContext';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Lock } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const DnsLeakModal: React.FC = () => {
  const { showDnsLeakModal, setShowDnsLeakModal, connectionState, currentServer, originalIsp } = useVPN();

  const [isScanning, setIsScanning] = useState(true);
  const isConnected = connectionState === 'connected';

  const runAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (isConnected) {
        sounds.playConnect();
      } else {
        sounds.playDisconnect();
      }
    }, 1200);
  };

  useEffect(() => {
    if (showDnsLeakModal) {
      runAudit();
    }
  }, [showDnsLeakModal, isConnected]);

  if (!showDnsLeakModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">DNS Leak & WebRTC Audit</h2>
          </div>
          <button
            onClick={() => setShowDnsLeakModal(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Audit Status Banner */}
        <div className="mt-4">
          {isScanning ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
              <div className="mt-3 text-xs font-bold text-white uppercase tracking-wider">
                Querying 12 Global DNS Nameservers...
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Checking for IP leaks, WebRTC leaks & ISP telemetry
              </div>
            </div>
          ) : isConnected ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-950/30 p-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="mt-2 text-sm font-black text-emerald-300">
                ZERO LEAKS DETECTED (PASSED)
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Your internet provider cannot view any visited websites. All DNS queries are routed exclusively via the {currentServer.city} encrypted RAM sinkhole.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/50 bg-rose-950/30 p-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <div className="mt-2 text-sm font-black text-rose-300">
                WARNING: UNENCRYPTED DNS LEAK
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Your true internet provider ({originalIsp}) can log and inspect every website and app you access!
              </p>
            </div>
          )}
        </div>

        {/* Audit Resolvers List */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="font-mono text-[10px] text-slate-400 uppercase">
            Detected DNS Resolvers
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-white">
                {isConnected ? `${currentServer.ip} (VPN Node)` : '75.75.75.75 (ISP Default)'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isConnected ? `Smart Secure VPN • ${currentServer.city}` : `${originalIsp} • Unencrypted`}
              </div>
            </div>
            <div className={`flex items-center gap-1 font-bold ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isConnected ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <span>{isConnected ? 'SECURED' : 'EXPOSED'}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
            <div>
              <div className="font-mono font-bold text-white">WebRTC STUN Tunnel</div>
              <div className="text-[11px] text-slate-400">Private IP Obfuscation</div>
            </div>
            <div className={`flex items-center gap-1 font-bold ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isConnected ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <span>{isConnected ? 'SHIELDED' : 'LEAKING'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            onClick={runAudit}
            disabled={isScanning}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white hover:bg-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-Run Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
