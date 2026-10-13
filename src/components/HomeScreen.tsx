import React, { useState, useEffect } from 'react';
import { useVPN } from '../context/VPNContext';
import { 
  Power, 
  ArrowDown, 
  ArrowUp, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  Lock, 
  Zap, 
  Gauge, 
  RefreshCw,
  Copy,
  Check,
  Radio
} from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export const HomeScreen: React.FC = () => {
  const {
    connectionState,
    currentServer,
    originalIp,
    originalIsp,
    originalCountry,
    currentIp,
    connectedDuration,
    sessionDownloadMB,
    sessionUploadMB,
    telemetry,
    settings,
    vipState,
    connectingStatusText,
    toggleConnection,
    setActiveTab,
    autoSelectFastestServer,
    setShowSpeedTestModal,
    setShowDnsLeakModal,
    setShowVipModal,
  } = useVPN();

  const [copiedIp, setCopiedIp] = useState(false);
  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting';
  const isDisconnecting = connectionState === 'disconnecting';

  // Copy IP to clipboard
  const handleCopyIp = () => {
    navigator.clipboard?.writeText(currentIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  // Sparkline history for live speed graph
  const [speedHistory, setSpeedHistory] = useState<number[]>([12, 18, 25, 40, 35, 60, 55, 75, 70, 95]);

  useEffect(() => {
    if (isConnected) {
      setSpeedHistory((prev) => [...prev.slice(1), telemetry.downloadMbps]);
    } else {
      setSpeedHistory((prev) => [...prev.slice(1), 0]);
    }
  }, [telemetry.downloadMbps, isConnected]);

  // Generate SVG path for sparkline
  const maxVal = Math.max(...speedHistory, 100);
  const points = speedHistory
    .map((val, idx) => {
      const x = (idx / (speedHistory.length - 1)) * 100;
      const y = 100 - (val / maxVal) * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center pb-24 pt-4">
      {/* Top Security Status Banner */}
      <div className="mb-6 flex w-full max-w-md items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isConnecting
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isConnected ? (
              <ShieldCheck className="h-6 w-6" />
            ) : isConnecting ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <ShieldAlert className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Connection Status
              </span>
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isConnected
                    ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                    : isConnecting
                    ? 'bg-cyan-400 animate-ping'
                    : 'bg-rose-500'
                }`}
              />
            </div>
            <div className="font-bold text-white text-base">
              {isConnected
                ? 'Protected & Encrypted'
                : isConnecting
                ? connectingStatusText
                : isDisconnecting
                ? 'Disconnecting...'
                : 'Unprotected (Exposed)'}
            </div>
          </div>
        </div>

        {/* Live Timer or Protocol */}
        <div className="text-right">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            {isConnected ? 'Duration' : 'Protocol'}
          </div>
          <div className="font-mono text-sm font-bold text-cyan-300">
            {isConnected ? formatDuration(connectedDuration) : settings.protocol.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Center Big One-Tap Toggle Button */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer Pulsing Glow Rings */}
        <div
          className={`absolute h-64 w-64 rounded-full transition-all duration-700 pointer-events-none ${
            isConnected
              ? 'bg-emerald-500/15 animate-ping opacity-30'
              : isConnecting
              ? 'bg-cyan-500/20 animate-spin opacity-40'
              : 'bg-slate-800/20 opacity-0'
          }`}
        />

        <div
          className={`absolute h-56 w-56 rounded-full border transition-all duration-700 pointer-events-none ${
            isConnected
              ? 'border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
              : isConnecting
              ? 'border-cyan-400/50 shadow-[0_0_40px_rgba(34,211,238,0.3)] animate-pulse'
              : 'border-slate-800/80 shadow-[0_0_20px_rgba(15,23,42,0.6)]'
          }`}
        />

        {/* Interactive Main Power Button */}
        <button
          onClick={toggleConnection}
          disabled={isConnecting || isDisconnecting}
          className={`group relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full transition-all duration-300 active:scale-95 cursor-pointer ${
            isConnected
              ? 'bg-gradient-to-b from-emerald-600 to-teal-800 shadow-[0_0_40px_rgba(16,185,129,0.5)] border-4 border-emerald-400/80'
              : isConnecting
              ? 'bg-gradient-to-b from-cyan-600 to-blue-800 shadow-[0_0_35px_rgba(34,211,238,0.4)] border-4 border-cyan-400'
              : 'bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-slate-700/80 hover:border-cyan-500/60 shadow-xl'
          }`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
              isConnected
                ? 'bg-emerald-400/20 text-white'
                : isConnecting
                ? 'bg-cyan-400/20 text-white animate-spin'
                : 'bg-slate-700/50 text-slate-300 group-hover:text-cyan-400'
            }`}
          >
            {isConnecting ? (
              <RefreshCw className="h-8 w-8" />
            ) : (
              <Power className={`h-8 w-8 ${isConnected ? 'text-white drop-shadow-[0_0_8px_white]' : ''}`} />
            )}
          </div>

          <span
            className={`mt-2 font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
              isConnected
                ? 'text-emerald-100'
                : isConnecting
                ? 'text-cyan-200'
                : 'text-slate-400 group-hover:text-white'
            }`}
          >
            {isConnected ? 'DISCONNECT' : isConnecting ? 'CONNECTING' : 'TAP TO CONNECT'}
          </span>
        </button>
      </div>

      {/* Sub-label */}
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-400">
          {isConnected
            ? `Protected by ${settings.protocol.toUpperCase()} Tunnel`
            : 'Single tap to secure your connection instantly'}
        </p>
      </div>

      {/* Selected Server Card */}
      <div className="mt-6 w-full max-w-md">
        <div
          onClick={() => setActiveTab('servers')}
          className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-cyan-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center gap-3.5">
            <span className="text-3xl filter drop-shadow-sm">{currentServer.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {currentServer.country}
                </span>
                {currentServer.isVip && (
                  <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                    VIP
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{currentServer.city}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  {currentServer.ping}ms
                </span>
                <span>•</span>
                <span>{currentServer.load}% load</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 group-hover:translate-x-0.5 transition-transform">
            <span>Change</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Quick auto-connect recommendation button */}
        {!isConnected && (
          <button
            onClick={autoSelectFastestServer}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-cyan-300"
          >
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            <span>Auto-Pick Fastest Node (Lowest Ping)</span>
          </button>
        )}
      </div>

      {/* Real-Time Speed & Telemetry Dashboard */}
      <div className="mt-5 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Live Network Telemetry
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Radio className={`h-3 w-3 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{isConnected ? 'TUNNEL ACTIVE' : 'STANDBY'}</span>
          </div>
        </div>

        {/* Download & Upload Speed Gauges */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          {/* Download */}
          <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Download</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <ArrowDown className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-white">
                {isConnected ? telemetry.downloadMbps : '0.0'}
              </span>
              <span className="text-xs font-medium text-slate-400">Mbps</span>
            </div>
            {isConnected && (
              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                Total: {sessionDownloadMB} MB
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">Upload</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <ArrowUp className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-white">
                {isConnected ? telemetry.uploadMbps : '0.0'}
              </span>
              <span className="text-xs font-medium text-slate-400">Mbps</span>
            </div>
            {isConnected && (
              <div className="mt-1 text-[10px] text-slate-400 font-mono">
                Total: {sessionUploadMB} MB
              </div>
            )}
          </div>
        </div>

        {/* Live Sparkline Graph */}
        <div className="mt-3 rounded-xl border border-slate-800/50 bg-slate-950/80 p-2.5">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Throughput Real-Time Waveform</span>
            <span className="font-mono text-cyan-400">{telemetry.downloadMbps} Mbps</span>
          </div>
          <svg className="h-10 w-full overflow-hidden" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="speedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,100 ${points} 100,100`}
              fill="url(#speedGrad)"
            />
            <polyline
              points={points}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Ping & Jitter details */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-slate-950/50 p-2 border border-slate-800/40">
            <div className="text-[10px] text-slate-400">LATENCY</div>
            <div className="mt-0.5 font-mono font-bold text-emerald-400">
              {isConnected ? `${telemetry.currentPing} ms` : '--'}
            </div>
          </div>
          <div className="rounded-lg bg-slate-950/50 p-2 border border-slate-800/40">
            <div className="text-[10px] text-slate-400">JITTER</div>
            <div className="mt-0.5 font-mono font-bold text-cyan-400">
              {isConnected ? `${telemetry.jitter} ms` : '--'}
            </div>
          </div>
          <div className="rounded-lg bg-slate-950/50 p-2 border border-slate-800/40">
            <div className="text-[10px] text-slate-400">PACKET LOSS</div>
            <div className="mt-0.5 font-mono font-bold text-slate-300">
              {isConnected ? `${telemetry.packetLossPercent}%` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* IP Masking Transparency Card */}
      <div className="mt-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Public IP Masking
            </span>
          </div>
          <button
            onClick={handleCopyIp}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {copiedIp ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedIp ? 'Copied' : 'Copy IP'}</span>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950 p-3">
          <div>
            <div className="text-[11px] text-slate-400">
              {isConnected ? 'Virtual Tunnel IP (Encrypted)' : 'Real Public IP (Exposed)'}
            </div>
            <div className="mt-0.5 font-mono text-sm font-bold text-white tracking-wider">
              {currentIp}
            </div>
            <div className="text-[11px] text-slate-400">
              {isConnected ? `${currentServer.city}, ${currentServer.country}` : `${originalIsp} (${originalCountry})`}
            </div>
          </div>
          <div
            className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isConnected ? 'MASKED' : 'EXPOSED'}
          </div>
        </div>
      </div>

      {/* Diagnostics Quick Launcher */}
      <div className="mt-4 flex w-full max-w-md gap-3">
        <button
          onClick={() => setShowSpeedTestModal(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <Gauge className="h-4 w-4 text-cyan-400" />
          <span>Run Speed Test</span>
        </button>

        <button
          onClick={() => setShowDnsLeakModal(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>DNS Leak Audit</span>
        </button>
      </div>

      {/* Free Tier Promotion Banner if not VIP */}
      {!vipState.isVip && (
        <div className="mt-5 w-full max-w-md rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">Unlock 10Gbps VIP Nodes</div>
              <div className="text-[11px] text-slate-400">Tokyo, Seoul, Zurich Bunker & No Ads</div>
            </div>
          </div>
          <button
            onClick={() => setShowVipModal(true)}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
          >
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
};
