import React from 'react';
import { useVPN } from '../context/VPNContext';
import { ShieldCheck, ShieldAlert, Crown, Zap, Info } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    connectionState, 
    vipState, 
    setShowVipModal, 
    setShowRewardedAdModal,
    setShowOnboardingModal,
    settings 
  } = useVPN();

  const isConnected = connectionState === 'connected';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
            {isConnected && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white sm:text-lg">
                SMART <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SECURE</span> VPN
              </span>
              <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                v2.4
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Fast, Secure & Zero-Knowledge Tunnel
            </p>
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex items-center gap-2">
          {/* Help / Guide */}
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition hover:border-slate-700 hover:text-white"
            title="Privacy Features Guide"
            aria-label="Features Guide"
          >
            <Info className="h-4 w-4" />
          </button>

          {/* Ad Shield Mini Badge */}
          {settings.adBlockerEnabled && (
            <div className="hidden items-center gap-1.5 rounded-lg border border-emerald-900/50 bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-400 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Ad-Shield Active
            </div>
          )}

          {/* VIP Status / Upgrade Button */}
          {vipState.isVip ? (
            <button
              onClick={() => setShowVipModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 shadow-sm transition hover:border-amber-400"
            >
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span>VIP ACTIVE</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowRewardedAdModal(true)}
                className="hidden items-center gap-1 rounded-xl border border-cyan-800/60 bg-cyan-950/40 px-2.5 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-900/40 sm:flex"
                title="Watch 5s ad to get 1 hour free VIP access"
              >
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                <span>+1h Free VIP</span>
              </button>

              <button
                onClick={() => setShowVipModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition hover:brightness-110 active:scale-95"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>GO VIP</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
