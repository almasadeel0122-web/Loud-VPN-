import React, { useState } from 'react';
import { useVPN } from '../context/VPNContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  EyeOff, 
  Zap, 
  Activity, 
  Lock, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const AdShieldScreen: React.FC = () => {
  const { settings, updateSettings, adBlockStats } = useVPN();

  // Simulated live sinkhole query log
  const [liveBlockedDomains] = useState([
    { domain: 'pagead2.googlesyndication.com', type: 'Ad Banner', status: '0.0.0.0 SINKHOLE', time: '1s ago' },
    { domain: 'analytics.tiktok.com', type: 'Tracker', status: 'BLOCKED', time: '4s ago' },
    { domain: 'static.criteo.net', type: 'Retargeting', status: '0.0.0.0 SINKHOLE', time: '8s ago' },
    { domain: 'pixel.facebook.com', type: 'Fingerprint', status: 'BLOCKED', time: '12s ago' },
    { domain: 'telemetry.sdk.unity3d.com', type: 'Telemetry', status: 'BLOCKED', time: '19s ago' },
    { domain: 'adservice.google.com', type: 'Ad Auction', status: '0.0.0.0 SINKHOLE', time: '26s ago' },
  ]);

  return (
    <div className="flex flex-col pb-24 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white">Ad-Shield & Threat Filter</h1>
        <p className="text-xs text-slate-400">
          Hardware-accelerated DNS sinkhole blocking intrusive ads, scripts & trackers
        </p>
      </div>

      {/* Master Toggle Banner */}
      <div className={`mt-4 rounded-2xl border p-4 transition-all ${
        settings.adBlockerEnabled
          ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
          : 'border-slate-800 bg-slate-900/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              settings.adBlockerEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">DNS-Level Cyber Shield</div>
              <div className="text-xs text-slate-400">
                {settings.adBlockerEnabled
                  ? 'Active — 180,000+ ad domains filtered'
                  : 'Disabled — Ads & tracking allowed'}
              </div>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.adBlockerEnabled}
              onChange={(e) => updateSettings({ adBlockerEnabled: e.target.checked })}
              className="peer sr-only"
            />
            <div className="peer h-7 w-13 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[3px] after:h-6 after:w-6 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950 peer-focus:outline-none"></div>
          </label>
        </div>
      </div>

      {/* 4 Big Metrics Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Ads Blocked</span>
            <Ban className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-emerald-400">
            {adBlockStats.adsBlocked.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Popups, banners & video ads</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Trackers Deflected</span>
            <EyeOff className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-cyan-400">
            {adBlockStats.trackersBlocked.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Cross-site profile beacons</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Bandwidth Saved</span>
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-yellow-300">
            {Math.round(adBlockStats.bandwidthSavedMB)} MB
          </div>
          <div className="text-[10px] text-slate-400">Mobile data conserved</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Threats Blocked</span>
            <Flame className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-extrabold text-rose-400">
            {adBlockStats.threatsPrevented}
          </div>
          <div className="text-[10px] text-slate-400">Malware & phishing links</div>
        </div>
      </div>

      {/* Protection Categories */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Sinkhole Filtering Categories
        </h2>

        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Intrusive Ads & Popups</div>
              <div className="text-[11px] text-slate-400">Blocks auto-playing videos, interstitials, and banners</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.adBlockerEnabled}
                onChange={(e) => updateSettings({ adBlockerEnabled: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <div>
              <div className="text-xs font-semibold text-white">Behavioral Telemetry & Trackers</div>
              <div className="text-[11px] text-slate-400">Stops Facebook Pixel, Google Analytics, and ad profiling</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.blockTrackers}
                onChange={(e) => updateSettings({ blockTrackers: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <div>
              <div className="text-xs font-semibold text-white">Malicious Domains & Phishing</div>
              <div className="text-[11px] text-slate-400">Prevents connection to known malware command servers</div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.blockMalware}
                onChange={(e) => updateSettings({ blockMalware: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Live Intercept Stream */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Intercepted Queries (Simulated)
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            ACTIVE SINKHOLE
          </span>
        </div>

        <div className="space-y-2">
          {liveBlockedDomains.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/80 p-2.5 text-xs"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="truncate font-mono text-slate-300">{item.domain}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                  {item.type}
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
