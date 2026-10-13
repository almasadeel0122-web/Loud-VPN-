import React, { useState } from 'react';
import { useVPN } from '../context/VPNContext';
import { X, ShieldCheck, Zap, Lock, ChevronRight, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const OnboardingModal: React.FC = () => {
  const { showOnboardingModal, setShowOnboardingModal } = useVPN();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showOnboardingModal) return null;

  const slides = [
    {
      title: 'Military-Grade Cryptography',
      subtitle: 'ChaCha20-Poly1305 & AES-256-GCM',
      description: 'Your traffic is securely wrapped in state-of-the-art encrypted tunnels. Even public Wi-Fi sniffers and malicious ISP snoops see only scrambled cipher.',
      icon: <Lock className="h-10 w-10 text-cyan-400" />,
      color: 'from-cyan-600 to-blue-600',
    },
    {
      title: 'Smart Categorized Nodes',
      subtitle: 'Streaming, Low-Ping Gaming & Privacy',
      description: 'Automatically pick the optimum node for 4K Netflix streaming, esports low latency (<20ms ping), or deep firewall bypass using V2Ray stealth protocols.',
      icon: <Zap className="h-10 w-10 text-amber-400" />,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      title: 'Hardware DNS Sinkhole',
      subtitle: 'Built-in Ad-Blocker & Kill Switch',
      description: 'Block intrusive ads, tracking pixels, and malware at the DNS layer before they load on your device. Zero browsing logs, 100% private.',
      icon: <ShieldCheck className="h-10 w-10 text-emerald-400" />,
      color: 'from-emerald-600 to-teal-700',
    },
  ];

  const handleNext = () => {
    sounds.playClick();
    if (currentStep < slides.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowOnboardingModal(false);
    }
  };

  const handleSkip = () => {
    sounds.playClick();
    setShowOnboardingModal(false);
  };

  const currentSlide = slides[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        {/* Skip button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Skip
          </button>
        </div>

        {/* Slide Visual */}
        <div className="my-8 flex flex-col items-center text-center">
          <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr ${currentSlide.color} shadow-lg shadow-cyan-500/20`}>
            {currentSlide.icon}
          </div>

          <h2 className="mt-5 text-xl font-black text-white">
            {currentSlide.title}
          </h2>
          <div className="mt-1 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
            {currentSlide.subtitle}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-300">
            {currentSlide.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 active:scale-98"
          >
            <span>{currentStep === slides.length - 1 ? 'Launch Smart VPN' : 'Continue'}</span>
            {currentStep === slides.length - 1 ? <Check className="h-4 w-4 stroke-[3]" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
