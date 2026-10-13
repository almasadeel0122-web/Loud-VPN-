/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VPNProvider, useVPN } from './context/VPNContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ServerListScreen } from './components/ServerListScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { AdShieldScreen } from './components/AdShieldScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { VipModal } from './components/VipModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { SpeedTestModal } from './components/SpeedTestModal';
import { DnsLeakModal } from './components/DnsLeakModal';
import { OnboardingModal } from './components/OnboardingModal';

const MainContent: React.FC = () => {
  const { activeTab } = useVPN();

  return (
    <main className="mx-auto w-full max-w-xl px-4">
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'servers' && <ServerListScreen />}
      {activeTab === 'analytics' && <AnalyticsScreen />}
      {activeTab === 'shield' && <AdShieldScreen />}
      {activeTab === 'settings' && <SettingsScreen />}
    </main>
  );
};

export default function App() {
  return (
    <VPNProvider>
      <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        {/* Subtle Cyber Grid & Ambient Lighting */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]"></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">
            <MainContent />
          </div>
          <BottomNav />
        </div>

        {/* Global Modals */}
        <VipModal />
        <RewardedAdModal />
        <SpeedTestModal />
        <DnsLeakModal />
        <OnboardingModal />
      </div>
    </VPNProvider>
  );
}
