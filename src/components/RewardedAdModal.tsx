import React, { useState, useEffect } from 'react';
import { useVPN } from '../context/VPNContext';
import { X, Play, CheckCircle2, Zap, ShieldAlert, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const RewardedAdModal: React.FC = () => {
  const { 
    showRewardedAdModal, 
    setShowRewardedAdModal, 
    claimRewardedAdBonus 
  } = useVPN();

  const [countdown, setCountdown] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!showRewardedAdModal) {
      setCountdown(5);
      setIsCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          sounds.playConnect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showRewardedAdModal]);

  if (!showRewardedAdModal) return null;

  const handleClaim = () => {
    claimRewardedAdBonus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 shadow-2xl">
        {/* Top bar with ad timer / close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-300">
            <span>SPONSORED AD</span>
          </div>

          {isCompleted ? (
            <button
              onClick={() => setShowRewardedAdModal(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-400">
              <span>Reward in {countdown}s</span>
            </div>
          )}
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative mt-4 flex h-52 flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 p-4 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

          {!isCompleted ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
                <Play className="h-6 w-6 fill-current" />
              </div>
              <h3 className="mt-3 text-lg font-black text-white">
                CyberShield Cloud Vault
              </h3>
              <p className="mt-1 max-w-xs text-xs text-slate-300">
                Zero-knowledge encrypted cloud storage. Back up your files securely anywhere in the world.
              </p>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                <div
                  className="h-full bg-cyan-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">
                Reward Unlocked!
              </h3>
              <p className="text-xs text-emerald-300">
                +1 Hour of VIP Speed & Tokyo/Zurich nodes added
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="mt-5">
          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-98"
            >
              <Award className="h-5 w-5" />
              <span>Claim +1 Hour VIP Pass</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
              <Zap className="h-4 w-4 text-yellow-400 animate-spin" />
              <span>Please watch the full 5 seconds to receive your VIP reward...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
