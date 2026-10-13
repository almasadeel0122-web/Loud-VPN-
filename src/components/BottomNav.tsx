import React from 'react';
import { useVPN } from '../context/VPNContext';
import { Power, Globe, BarChart3, ShieldCheck, Settings } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, connectionState, adBlockStats } = useVPN();

  const isConnected = connectionState === 'connected';

  const navItems = [
    {
      id: 'home' as const,
      label: 'Tunnel',
      icon: Power,
      activeColor: isConnected ? 'text-emerald-400' : 'text-cyan-400',
    },
    {
      id: 'servers' as const,
      label: 'Servers',
      icon: Globe,
      activeColor: 'text-cyan-400',
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      activeColor: 'text-cyan-400',
    },
    {
      id: 'shield' as const,
      label: 'Ad Shield',
      icon: ShieldCheck,
      activeColor: 'text-cyan-400',
      badge: adBlockStats.adsBlocked > 0 ? `${adBlockStats.adsBlocked}` : undefined,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      activeColor: 'text-cyan-400',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/90 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2 sm:max-w-lg">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-all ${
                isActive
                  ? 'text-cyan-400 scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? item.activeColor : ''}`} />
                {item.id === 'home' && isConnected && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <span className={`mt-1 text-[11px] font-medium tracking-wide ${isActive ? 'text-white font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 h-1 w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
