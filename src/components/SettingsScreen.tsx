import React from 'react';
import { useVPN } from '../context/VPNContext';
import { PROTOCOLS_INFO } from '../data/mockData';
import { VPNProtocol } from '../types/vpn';
import { 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Lock, 
  Gauge, 
  RefreshCw, 
  Check, 
  Smartphone,
  ExternalLink,
  Shield,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const SettingsScreen: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    setShowSpeedTestModal, 
    setShowDnsLeakModal,
    setShowOnboardingModal,
    vipState,
    setShowVipModal
  } = useVPN();

  const handleProtocolSelect = (proto: VPNProtocol) => {
    updateSettings({ protocol: proto });
  };

  return (
    <div className="flex flex-col pb-24 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white">Security & Protocol Settings</h1>
        <p className="text-xs text-slate-400">
          Configure encryption tunnels, kill switch, leaks & system preferences
        </p>
      </div>

      {/* Protocol Selection Section */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              VPN Protocol Selection
            </h2>
          </div>
          <span className="font-mono text-xs text-cyan-400">
            Current: {settings.protocol.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2.5">
          {PROTOCOLS_INFO.map((proto) => {
            const isSelected = settings.protocol === proto.id;

            return (
              <div
                key={proto.id}
                onClick={() => handleProtocolSelect(proto.id)}
                className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/25 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{proto.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-slate-700">
                      {proto.badge}
                    </span>
                  </div>

                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                    isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-700 bg-slate-800'
                  }`}>
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {proto.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Encryption:</span>
                    <span className="font-mono text-slate-300">{proto.encryption}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Ports:</span>
                    <span className="font-mono text-slate-300">{proto.ports}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Best for:</span>
                    <span className="text-cyan-300 font-medium">{proto.recommendedFor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Architecture & Defense Toggles */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Network Defense & Leaks
          </h2>
        </div>

        <div className="space-y-3.5">
          {/* Kill Switch */}
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Always-On Kill Switch</span>
                <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-300 border border-rose-500/30">
                  CRITICAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Instantly drops all network traffic if the encrypted tunnel disconnects unexpectedly to avoid raw IP leaks.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={settings.killSwitch}
                onChange={(e) => updateSettings({ killSwitch: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          {/* DNS Leak Protection */}
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <div className="pr-4">
              <div className="text-xs font-bold text-white">DNS Leak Routing Guard</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Routes all domain lookups exclusively through our zero-knowledge RAM-only encrypted DNS servers.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={settings.dnsLeakProtection}
                onChange={(e) => updateSettings({ dnsLeakProtection: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          {/* Auto-Connect on Public Wi-Fi */}
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <div className="pr-4">
              <div className="text-xs font-bold text-white">Auto-Shield on Public Wi-Fi</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically engages VPN encryption whenever an unsecured or captive portal Wi-Fi network is detected.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={settings.autoConnectPublicWifi}
                onChange={(e) => updateSettings({ autoConnectPublicWifi: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          {/* Split Tunneling */}
          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <div className="pr-4">
              <div className="text-xs font-bold text-white">Split Tunneling</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Permit banking or local streaming apps to bypass VPN while keeping browsing encrypted.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center shrink-0">
              <input
                type="checkbox"
                checked={settings.splitTunneling}
                onChange={(e) => updateSettings({ splitTunneling: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Diagnostics & Verification Tools */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          Diagnostics & Security Audit
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowSpeedTestModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <Gauge className="h-4 w-4 text-cyan-400" />
            <span>Speed Benchmark</span>
          </button>

          <button
            onClick={() => setShowDnsLeakModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>DNS Leak Audit</span>
          </button>
        </div>
      </div>

      {/* Audio & Feedback Preferences */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          Sensory & UI Feedback
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.soundEffects ? (
                <Volume2 className="h-4 w-4 text-cyan-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-500" />
              )}
              <div>
                <div className="text-xs font-semibold text-white">Synthesized Cyber Audio FX</div>
                <div className="text-[11px] text-slate-400">Futuristic lock, unlock, and ping sound cues</div>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => updateSettings({ soundEffects: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-slate-300 after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs font-semibold text-white">Feature Introduction Guide</div>
                <div className="text-[11px] text-slate-400">Replay onboarding slides & security explanations</div>
              </div>
            </div>
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white"
            >
              Open Guide
            </button>
          </div>
        </div>
      </div>

      {/* Strict No-Logs Guarantee Badge */}
      <div className="mt-5 rounded-2xl border border-cyan-900/40 bg-gradient-to-r from-cyan-950/30 via-slate-950 to-blue-950/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Strict Verified No-Logs Architecture</div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Our servers run entirely in volatile RAM (Random Access Memory). No hard drives, no session logs, no IP mapping, and no browsing history are ever written to disk or stored.
            </p>
          </div>
        </div>
      </div>

      {/* About & Version */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <p>Smart Secure VPN • Version 2.4.1 (Stable Build)</p>
        <p className="mt-0.5">WireGuard® is a registered trademark of Jason A. Donenfeld.</p>
      </div>
    </div>
  );
};
