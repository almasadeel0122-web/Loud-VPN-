import React, { useState, useEffect } from 'react';
import { useVPN } from '../context/VPNContext';
import { X, Play, RefreshCw, ArrowDown, ArrowUp, Activity, CheckCircle, Gauge } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const SpeedTestModal: React.FC = () => {
  const { showSpeedTestModal, setShowSpeedTestModal, currentServer, connectionState } = useVPN();

  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [testResults, setTestResults] = useState({
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
  });

  const isConnected = connectionState === 'connected';

  useEffect(() => {
    if (!showSpeedTestModal) {
      setPhase('idle');
      setCurrentSpeed(0);
      return;
    }
  }, [showSpeedTestModal]);

  const runTest = () => {
    sounds.playClick();
    setPhase('ping');
    setCurrentSpeed(0);

    // Ping phase
    setTimeout(() => {
      const pingVal = isConnected ? currentServer.ping : Math.round(currentServer.ping * 1.8 + 15);
      const jitterVal = +(1.2 + Math.random() * 0.8).toFixed(1);
      setTestResults((prev) => ({ ...prev, ping: pingVal, jitter: jitterVal }));
      sounds.playPing();
      setPhase('download');

      // Download phase animation
      const baseDl = isConnected ? (currentServer.isVip ? 460 : 230) : 85;
      let step = 0;
      const dlInterval = setInterval(() => {
        step++;
        const target = Math.round((baseDl * (step / 10)) + (Math.random() - 0.5) * 20);
        setCurrentSpeed(Math.max(5, target));

        if (step >= 10) {
          clearInterval(dlInterval);
          setTestResults((prev) => ({ ...prev, download: target }));
          setPhase('upload');

          // Upload phase animation
          const baseUl = Math.round(baseDl * 0.32);
          let ulStep = 0;
          const ulInterval = setInterval(() => {
            ulStep++;
            const ulTarget = Math.round((baseUl * (ulStep / 10)) + (Math.random() - 0.5) * 10);
            setCurrentSpeed(Math.max(2, ulTarget));

            if (ulStep >= 10) {
              clearInterval(ulInterval);
              setTestResults((prev) => ({ ...prev, upload: ulTarget }));
              setPhase('complete');
              sounds.playConnect();
            }
          }, 150);
        }
      }, 150);
    }, 1200);
  };

  if (!showSpeedTestModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Speed Benchmark Meter</h2>
          </div>
          <button
            onClick={() => setShowSpeedTestModal(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Target Server Card */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentServer.flag}</span>
            <div>
              <div className="font-bold text-white">{currentServer.city}, {currentServer.country}</div>
              <div className="text-[11px] text-slate-400">Node: {currentServer.name}</div>
            </div>
          </div>
          <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
            isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
          }`}>
            {isConnected ? 'TUNNEL ACTIVE' : 'DIRECT ISP'}
          </span>
        </div>

        {/* Central Speedometer Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-slate-800 bg-slate-900/40 shadow-inner">
            <div className="absolute inset-2 rounded-full border border-slate-800/60 border-dashed"></div>

            {phase === 'idle' ? (
              <button
                onClick={runTest}
                className="group flex flex-col items-center justify-center gap-1 text-cyan-400 transition hover:scale-110"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Play className="h-7 w-7 fill-current ml-0.5" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  START TEST
                </span>
              </button>
            ) : phase === 'complete' ? (
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Speed Rating</span>
                <span className="font-mono text-3xl font-black text-emerald-400">
                  A+ ELITE
                </span>
                <span className="text-[10px] text-slate-300 mt-1 max-w-[130px]">
                  4K Ultra HD & Low Ping Gaming Certified
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
                  TESTING {phase.toUpperCase()}
                </span>
                <span className="font-mono text-4xl font-black text-white">
                  {currentSpeed}
                </span>
                <span className="text-xs text-slate-400 font-mono">Mbps</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Activity className="h-3 w-3 text-cyan-400" />
              <span>PING</span>
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-white">
              {testResults.ping ? `${testResults.ping} ms` : '--'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ArrowDown className="h-3 w-3 text-cyan-400" />
              <span>DOWNLOAD</span>
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-cyan-300">
              {testResults.download ? `${testResults.download} Mbps` : '--'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ArrowUp className="h-3 w-3 text-emerald-400" />
              <span>UPLOAD</span>
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-emerald-300">
              {testResults.upload ? `${testResults.upload} Mbps` : '--'}
            </div>
          </div>
        </div>

        {/* Retry Button if complete */}
        {phase === 'complete' && (
          <button
            onClick={runTest}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white hover:bg-slate-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Test Speed Again</span>
          </button>
        )}
      </div>
    </div>
  );
};
