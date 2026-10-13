import React, { useState } from 'react';
import { useVPN } from '../context/VPNContext';
import { 
  X, 
  Crown, 
  Check, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Tv, 
  Gamepad2, 
  Headphones, 
  Film
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const VipModal: React.FC = () => {
  const { 
    showVipModal, 
    setShowVipModal, 
    setShowRewardedAdModal, 
    unlockVipTier, 
    vipState 
  } = useVPN();

  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly' | 'lifetime'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showVipModal) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const planTitle = selectedPlan === 'yearly' ? 'Yearly VIP Pass' : selectedPlan === 'lifetime' ? 'Lifetime Unlimited VIP' : 'Monthly VIP Pass';
      unlockVipTier(planTitle);
    }, 1000);
  };

  const handleWatchAd = () => {
    setShowVipModal(false);
    setShowRewardedAdModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-6 shadow-[0_0_60px_rgba(245,158,11,0.2)]">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowVipModal(false);
          }}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/30">
            <Crown className="h-8 w-8 fill-current" />
          </div>

          <h2 className="mt-3 text-2xl font-black text-white">
            Unlock <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">VIP Elite</span> Access
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Dedicated 10Gbps uplinks, zero latency caps, 4K streaming & unlimited bandwidth
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="grid grid-cols-3 text-xs font-bold pb-2 border-b border-slate-800 text-slate-400">
            <span>FEATURE</span>
            <span className="text-center">FREE TIER</span>
            <span className="text-center text-amber-400">VIP ELITE</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            <div className="grid grid-cols-3 py-2 text-slate-300">
              <span>Server Speed</span>
              <span className="text-center text-slate-400">1 Gbps Shared</span>
              <span className="text-center font-bold text-amber-300">10 Gbps Dedicated</span>
            </div>
            <div className="grid grid-cols-3 py-2 text-slate-300">
              <span>Exclusive Nodes</span>
              <span className="text-center text-slate-400">6 Core Regions</span>
              <span className="text-center font-bold text-emerald-400">50+ Global (Tokyo, Seoul, etc.)</span>
            </div>
            <div className="grid grid-cols-3 py-2 text-slate-300">
              <span>Streaming Bypass</span>
              <span className="text-center text-slate-400">Standard</span>
              <span className="text-center font-bold text-emerald-400">Netflix 4K, Disney+, Hulu</span>
            </div>
            <div className="grid grid-cols-3 py-2 text-slate-300">
              <span>Built-in Ads</span>
              <span className="text-center text-rose-400">Supported</span>
              <span className="text-center font-bold text-emerald-400">100% Ad-Free Zero Clutter</span>
            </div>
            <div className="grid grid-cols-3 py-2 text-slate-300">
              <span>Multi-Hop Onion</span>
              <span className="text-center text-slate-400">Single Hop</span>
              <span className="text-center font-bold text-emerald-400">Double Encryption Bunker</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {/* Monthly */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`cursor-pointer rounded-2xl border p-3 text-center transition ${
              selectedPlan === 'monthly'
                ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-300">1 Month</div>
            <div className="mt-1 font-mono text-base font-extrabold text-white">$9.99</div>
            <div className="text-[10px] text-slate-400">Billed monthly</div>
          </div>

          {/* Yearly - Best Value */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`relative cursor-pointer rounded-2xl border p-3 text-center transition ${
              selectedPlan === 'yearly'
                ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-2 py-0.5 text-[9px] font-black text-slate-950 uppercase tracking-wider">
              Save 60%
            </div>
            <div className="text-xs font-bold text-amber-300">12 Months</div>
            <div className="mt-1 font-mono text-base font-extrabold text-white">$3.99<span className="text-[10px] font-normal text-slate-400">/mo</span></div>
            <div className="text-[10px] text-slate-400">$47.88 / year</div>
          </div>

          {/* Lifetime */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`cursor-pointer rounded-2xl border p-3 text-center transition ${
              selectedPlan === 'lifetime'
                ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-slate-300">Lifetime</div>
            <div className="mt-1 font-mono text-base font-extrabold text-white">$69.99</div>
            <div className="text-[10px] text-slate-400">One-time pay</div>
          </div>
        </div>

        {/* Subscribe Action Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:brightness-110 active:scale-98 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
              <span>Activating Dedicated VIP Node Tunnel...</span>
            </div>
          ) : (
            <>
              <Crown className="h-5 w-5" />
              <span>
                {selectedPlan === 'yearly'
                  ? 'Start 12-Month VIP Pass ($3.99/mo)'
                  : selectedPlan === 'lifetime'
                  ? 'Get Unlimited Lifetime VIP ($69.99)'
                  : 'Start 1-Month VIP Pass ($9.99)'}
              </span>
            </>
          )}
        </button>

        {/* Free Rewarded Ad Alternative */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-2 w-full text-slate-500 text-xs my-1">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span>OR TRY FOR FREE</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <button
            onClick={handleWatchAd}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-800/80 bg-cyan-950/40 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/40 transition"
          >
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Watch a 5-sec Ad to Unlock 1 Hour VIP Free</span>
          </button>
        </div>

        <div className="mt-3 text-center text-[10px] text-slate-400">
          30-day money-back guarantee. Cancel anytime in one click.
        </div>
      </div>
    </div>
  );
};
