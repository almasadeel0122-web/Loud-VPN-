export type VPNProtocol = 'wireguard' | 'openvpn-udp' | 'openvpn-tcp' | 'v2ray';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export type ServerCategory = 'all' | 'streaming' | 'gaming' | 'privacy' | 'adfree' | 'free';

export interface VPNServer {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  ip: string;
  ping: number; // latency in ms
  load: number; // 0 - 100%
  category: ('streaming' | 'gaming' | 'privacy' | 'adfree')[];
  isVip: boolean;
  supportedProtocols: VPNProtocol[];
  streamingServices?: string[];
  gamingScore?: number; // e.g. 98/100
  encryption: string; // e.g. 'AES-256-GCM', 'ChaCha20-Poly1305'
  speedLimitMbps: number;
}

export interface SessionLog {
  id: string;
  timestamp: string;
  durationSeconds: number;
  downloadMB: number;
  uploadMB: number;
  server: {
    id: string;
    name: string;
    country: string;
    city: string;
    flag: string;
  };
  protocol: VPNProtocol;
  originalIp: string;
  vpnIp: string;
  adsBlocked: number;
}

export interface AdBlockStats {
  adsBlocked: number;
  trackersBlocked: number;
  bandwidthSavedMB: number;
  threatsPrevented: number;
}

export interface SecuritySettings {
  protocol: VPNProtocol;
  killSwitch: boolean;
  adBlockerEnabled: boolean;
  dnsLeakProtection: boolean;
  autoConnectPublicWifi: boolean;
  splitTunneling: boolean;
  blockMalware: boolean;
  blockTrackers: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}

export interface VIPState {
  isVip: boolean;
  planName?: string;
  validUntil?: string; // ISO date string or "Lifetime"
  bonusHoursRemaining?: number;
}

export interface SpeedTelemetry {
  downloadMbps: number;
  uploadMbps: number;
  currentPing: number;
  jitter: number;
  packetLossPercent: number;
}
