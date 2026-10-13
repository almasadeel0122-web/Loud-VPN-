import React, { createContext, useContext, useState, useEffect, useRef, useTransition } from 'react';
import { 
  VPNServer, 
  ConnectionState, 
  VPNProtocol, 
  SessionLog, 
  SecuritySettings, 
  VIPState, 
  SpeedTelemetry,
  AdBlockStats
} from '../types/vpn';
import { SERVERS, DEFAULT_SERVER } from '../data/servers';
import { INITIAL_SESSION_LOGS } from '../data/mockData';
import { sounds } from '../utils/soundEffects';

interface VPNContextType {
  connectionState: ConnectionState;
  currentServer: VPNServer;
  originalIp: string;
  originalIsp: string;
  originalCountry: string;
  currentIp: string;
  connectedDuration: number;
  sessionDownloadMB: number;
  sessionUploadMB: number;
  telemetry: SpeedTelemetry;
  settings: SecuritySettings;
  vipState: VIPState;
  adBlockStats: AdBlockStats;
  sessionLogs: SessionLog[];
  activeTab: 'home' | 'servers' | 'analytics' | 'shield' | 'settings';
  connectingStatusText: string;
  
  // Modals
  showVipModal: boolean;
  showRewardedAdModal: boolean;
  showSpeedTestModal: boolean;
  showDnsLeakModal: boolean;
  showOnboardingModal: boolean;
  
  // Actions
  setActiveTab: (tab: 'home' | 'servers' | 'analytics' | 'shield' | 'settings') => void;
  toggleConnection: () => void;
  selectServer: (server: VPNServer) => void;
  autoSelectFastestServer: () => void;
  updateSettings: (partial: Partial<SecuritySettings>) => void;
  clearSessionLogs: () => void;
  setShowVipModal: (show: boolean) => void;
  setShowRewardedAdModal: (show: boolean) => void;
  setShowSpeedTestModal: (show: boolean) => void;
  setShowDnsLeakModal: (show: boolean) => void;
  setShowOnboardingModal: (show: boolean) => void;
  unlockVipTier: (planName: string) => void;
  claimRewardedAdBonus: () => void;
}

const VPNContext = createContext<VPNContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'smart_vpn_settings_v1',
  VIP: 'smart_vpn_vip_v1',
  LOGS: 'smart_vpn_logs_v1',
  AD_STATS: 'smart_vpn_ad_stats_v1',
  ONBOARDED: 'smart_vpn_onboarded_v1',
};

const INITIAL_SETTINGS: SecuritySettings = {
  protocol: 'wireguard',
  killSwitch: true,
  adBlockerEnabled: true,
  dnsLeakProtection: true,
  autoConnectPublicWifi: false,
  splitTunneling: false,
  blockMalware: true,
  blockTrackers: true,
  soundEffects: true,
  hapticFeedback: true,
};

const INITIAL_AD_STATS: AdBlockStats = {
  adsBlocked: 1420,
  trackersBlocked: 3890,
  bandwidthSavedMB: 284,
  threatsPrevented: 19,
};

export const VPNProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, startTransition] = useTransition();

  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [currentServer, setCurrentServer] = useState<VPNServer>(DEFAULT_SERVER);
  const [connectedDuration, setConnectedDuration] = useState<number>(0);
  const [sessionDownloadMB, setSessionDownloadMB] = useState<number>(0);
  const [sessionUploadMB, setSessionUploadMB] = useState<number>(0);
  const [connectingStatusText, setConnectingStatusText] = useState<string>('Ready');

  // Real ISP details (original client IP)
  const originalIp = '73.189.24.112';
  const originalIsp = 'Comcast Business Broadband';
  const originalCountry = 'United States';

  // Current IP dynamically masks when connected
  const [currentIp, setCurrentIp] = useState<string>(originalIp);

  // Settings
  const [settings, setSettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // VIP State
  const [vipState, setVipState] = useState<VIPState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VIP);
      return saved ? JSON.parse(saved) : { isVip: false };
    } catch {
      return { isVip: false };
    }
  });

  // Ad Block Stats
  const [adBlockStats, setAdBlockStats] = useState<AdBlockStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.AD_STATS);
      return saved ? JSON.parse(saved) : INITIAL_AD_STATS;
    } catch {
      return INITIAL_AD_STATS;
    }
  });

  // Session Logs
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_SESSION_LOGS;
    } catch {
      return INITIAL_SESSION_LOGS;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'servers' | 'analytics' | 'shield' | 'settings'>('home');

  // Modals
  const [showVipModal, setShowVipModal] = useState<boolean>(false);
  const [showRewardedAdModal, setShowRewardedAdModal] = useState<boolean>(false);
  const [showSpeedTestModal, setShowSpeedTestModal] = useState<boolean>(false);
  const [showDnsLeakModal, setShowDnsLeakModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(() => {
    try {
      const hasOnboarded = localStorage.getItem(LOCAL_STORAGE_KEYS.ONBOARDED);
      return !hasOnboarded;
    } catch {
      return false;
    }
  });

  // Telemetry speeds
  const [telemetry, setTelemetry] = useState<SpeedTelemetry>({
    downloadMbps: 0,
    uploadMbps: 0,
    currentPing: currentServer.ping,
    jitter: 1.2,
    packetLossPercent: 0,
  });

  // Keep sound FX state updated
  useEffect(() => {
    sounds.enabled = settings.soundEffects;
  }, [settings.soundEffects]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Storage quota or disabled
    }
  }, [settings]);

  // Persist VIP
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.VIP, JSON.stringify(vipState));
    } catch {
      // Ignored
    }
  }, [vipState]);

  // Persist logs
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LOGS, JSON.stringify(sessionLogs));
    } catch {
      // Ignored
    }
  }, [sessionLogs]);

  // Persist AdBlock Stats
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AD_STATS, JSON.stringify(adBlockStats));
    } catch {
      // Ignored
    }
  }, [adBlockStats]);

  // Active session timer & realistic live telemetry
  const sessionStartRef = useRef<number | null>(null);
  const sessionAdsBlockedRef = useRef<number>(0);

  useEffect(() => {
    if (connectionState !== 'connected') {
      setCurrentIp(originalIp);
      setTelemetry((prev) => ({
        ...prev,
        downloadMbps: 0,
        uploadMbps: 0,
        currentPing: currentServer.ping,
      }));
      return;
    }

    setCurrentIp(currentServer.ip);
    sessionStartRef.current = Date.now();
    sessionAdsBlockedRef.current = 0;

    const interval = setInterval(() => {
      setConnectedDuration((d) => d + 1);

      // Random speed fluctuations based on server and protocol
      const baseSpeed = currentServer.isVip ? 420 : 185;
      const speedJitter = (Math.random() - 0.45) * 35;
      const download = Math.max(12, Math.round(baseSpeed + speedJitter));
      const upload = Math.max(8, Math.round(download * 0.28 + (Math.random() - 0.5) * 10));

      setTelemetry({
        downloadMbps: download,
        uploadMbps: upload,
        currentPing: Math.max(4, Math.round(currentServer.ping + (Math.random() - 0.5) * 4)),
        jitter: +(1.1 + Math.random() * 0.8).toFixed(1),
        packetLossPercent: 0,
      });

      // Increment downloaded/uploaded MB
      const deltaDownloadMB = +(download / 8 / 2).toFixed(2); // approximate MB in tick
      const deltaUploadMB = +(upload / 8 / 4).toFixed(2);

      setSessionDownloadMB((prev) => +(prev + deltaDownloadMB).toFixed(1));
      setSessionUploadMB((prev) => +(prev + deltaUploadMB).toFixed(1));

      // Periodic ad-blocker simulation
      if (settings.adBlockerEnabled && Math.random() > 0.65) {
        const newAds = Math.floor(Math.random() * 2) + 1;
        const newTrackers = Math.floor(Math.random() * 3) + 1;
        sessionAdsBlockedRef.current += newAds;

        setAdBlockStats((prev) => ({
          adsBlocked: prev.adsBlocked + newAds,
          trackersBlocked: prev.trackersBlocked + newTrackers,
          bandwidthSavedMB: prev.bandwidthSavedMB + (newAds * 0.45),
          threatsPrevented: Math.random() > 0.95 ? prev.threatsPrevented + 1 : prev.threatsPrevented,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [connectionState, currentServer, settings.adBlockerEnabled]);

  // Connect / Disconnect Action
  const toggleConnection = () => {
    sounds.playClick();

    if (connectionState === 'connected') {
      // Disconnecting
      setConnectionState('disconnecting');
      setConnectingStatusText('Securing tear-down...');
      sounds.playDisconnect();

      setTimeout(() => {
        // Record completed session log
        if (connectedDuration > 3) {
          const newLog: SessionLog = {
            id: 'sess-' + Date.now(),
            timestamp: new Date().toISOString(),
            durationSeconds: connectedDuration,
            downloadMB: sessionDownloadMB || 14.2,
            uploadMB: sessionUploadMB || 3.1,
            server: {
              id: currentServer.id,
              name: currentServer.name,
              country: currentServer.country,
              city: currentServer.city,
              flag: currentServer.flag,
            },
            protocol: settings.protocol,
            originalIp,
            vpnIp: currentServer.ip,
            adsBlocked: sessionAdsBlockedRef.current,
          };
          setSessionLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep up to 50 logs
        }

        setConnectionState('disconnected');
        setConnectingStatusText('Disconnected');
        setConnectedDuration(0);
        setSessionDownloadMB(0);
        setSessionUploadMB(0);
      }, 700);

    } else if (connectionState === 'disconnected') {
      // Check VIP requirement
      if (currentServer.isVip && !vipState.isVip) {
        setShowVipModal(true);
        return;
      }

      // Connecting
      setConnectionState('connecting');
      setConnectingStatusText('Generating ephemeral keys...');

      setTimeout(() => {
        setConnectingStatusText(`Routing via ${currentServer.city}...`);
      }, 500);

      setTimeout(() => {
        setConnectingStatusText('Applying DNS Sinkhole & Kill Switch...');
      }, 950);

      setTimeout(() => {
        setConnectionState('connected');
        setConnectingStatusText('Protected');
        sounds.playConnect();
      }, 1400);
    }
  };

  const selectServer = (server: VPNServer) => {
    sounds.playClick();

    if (server.isVip && !vipState.isVip) {
      setShowVipModal(true);
      return;
    }

    if (server.id === currentServer.id) return;

    if (connectionState === 'connected') {
      // Smooth reconnect
      setConnectionState('connecting');
      setConnectingStatusText(`Switching tunnel to ${server.city}...`);
      setCurrentServer(server);

      setTimeout(() => {
        setConnectionState('connected');
        setConnectingStatusText('Protected');
        sounds.playConnect();
      }, 1100);
    } else {
      setCurrentServer(server);
    }
  };

  const autoSelectFastestServer = () => {
    sounds.playClick();
    // Filter available servers based on VIP status
    const candidateServers = SERVERS.filter((s) => !s.isVip || vipState.isVip);
    // Sort by ping + load factor
    const fastest = [...candidateServers].sort((a, b) => {
      const scoreA = a.ping + (a.load * 0.2);
      const scoreB = b.ping + (b.load * 0.2);
      return scoreA - scoreB;
    })[0];

    if (fastest) {
      selectServer(fastest);
    }
  };

  const updateSettings = (partial: Partial<SecuritySettings>) => {
    sounds.playClick();
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      // If protocol changed while connected, brief refresh
      if (partial.protocol && partial.protocol !== prev.protocol && connectionState === 'connected') {
        setConnectionState('connecting');
        setConnectingStatusText(`Switching to ${partial.protocol.toUpperCase()}...`);
        setTimeout(() => {
          setConnectionState('connected');
          setConnectingStatusText('Protected');
          sounds.playConnect();
        }, 900);
      }
      return next;
    });
  };

  const clearSessionLogs = () => {
    sounds.playClick();
    setSessionLogs([]);
  };

  const unlockVipTier = (planName: string) => {
    sounds.playConnect();
    startTransition(() => {
      setVipState({
        isVip: true,
        planName,
        validUntil: planName.includes('Lifetime') ? 'Lifetime Unlimited' : new Date(Date.now() + 365 * 86400000).toISOString(),
      });
      setShowVipModal(false);
    });
  };

  const claimRewardedAdBonus = () => {
    sounds.playConnect();
    startTransition(() => {
      setVipState((prev) => ({
        ...prev,
        isVip: true,
        planName: 'VIP Pass (Rewarded Ad)',
        bonusHoursRemaining: (prev.bonusHoursRemaining || 0) + 1,
        validUntil: new Date(Date.now() + 3600000 * ((prev.bonusHoursRemaining || 0) + 1)).toISOString(),
      }));
      setShowRewardedAdModal(false);
    });
  };

  const handleSetShowOnboardingModal = (show: boolean) => {
    setShowOnboardingModal(show);
    if (!show) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ONBOARDED, 'true');
      } catch {
        // Ignored
      }
    }
  };

  return (
    <VPNContext.Provider
      value={{
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
        adBlockStats,
        sessionLogs,
        activeTab,
        connectingStatusText,
        showVipModal,
        showRewardedAdModal,
        showSpeedTestModal,
        showDnsLeakModal,
        showOnboardingModal,
        setActiveTab,
        toggleConnection,
        selectServer,
        autoSelectFastestServer,
        updateSettings,
        clearSessionLogs,
        setShowVipModal,
        setShowRewardedAdModal,
        setShowSpeedTestModal,
        setShowDnsLeakModal,
        setShowOnboardingModal: handleSetShowOnboardingModal,
        unlockVipTier,
        claimRewardedAdBonus,
      }}
    >
      {children}
    </VPNContext.Provider>
  );
};

export const useVPN = () => {
  const context = useContext(VPNContext);
  if (!context) {
    throw new Error('useVPN must be used within a VPNProvider');
  }
  return context;
};
