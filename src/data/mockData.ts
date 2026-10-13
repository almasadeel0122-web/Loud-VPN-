import { SessionLog, VPNProtocol } from '../types/vpn';

export interface ProtocolInfo {
  id: VPNProtocol;
  name: string;
  tagline: string;
  badge: string;
  encryption: string;
  ports: string;
  speedRating: number; // 1-5
  securityRating: number; // 1-5
  obfuscationRating: number; // 1-5
  description: string;
  recommendedFor: string;
}

export const PROTOCOLS_INFO: ProtocolInfo[] = [
  {
    id: 'wireguard',
    name: 'WireGuard®',
    tagline: 'Blazing Fast & Ultra Lightweight',
    badge: 'Recommended',
    encryption: 'ChaCha20-Poly1305 / Noise IK',
    ports: 'UDP 51820',
    speedRating: 5,
    securityRating: 5,
    obfuscationRating: 3,
    description: 'Modern cryptographic state-of-the-art tunnel. Uses only ~4,000 lines of kernel code for minimal battery drain and maximum throughput.',
    recommendedFor: 'Gaming, 4K/8K Streaming, Mobile Battery Life'
  },
  {
    id: 'openvpn-udp',
    name: 'OpenVPN (UDP)',
    tagline: 'Battle-Tested Military Grade',
    badge: 'Standard',
    encryption: 'AES-256-GCM / SHA-512',
    ports: 'UDP 1194',
    speedRating: 4,
    securityRating: 5,
    obfuscationRating: 4,
    description: 'Industry standard for robust enterprise security. Fast transfer rates over UDP with zero latency overhead for reliable connections.',
    recommendedFor: 'Confidential Browsing, Remote Work, Public Wi-Fi'
  },
  {
    id: 'openvpn-tcp',
    name: 'OpenVPN (TCP)',
    tagline: 'Fail-Safe Packet Guarantee',
    badge: 'Resilient',
    encryption: 'AES-256-GCM / RSA-4096',
    ports: 'TCP 443 (HTTPS Mask)',
    speedRating: 3,
    securityRating: 5,
    obfuscationRating: 4,
    description: 'Guarantees reliable packet delivery over restrictive networks and hotel/airport Wi-Fi firewalls by masquerading as standard HTTPS port 443.',
    recommendedFor: 'Restrictive Wi-Fi, Lossy Cellular Networks'
  },
  {
    id: 'v2ray',
    name: 'V2Ray / VMess Shadows',
    tagline: 'Anti-Censorship Deep Packet Bypass',
    badge: 'Stealth',
    encryption: 'AES-128-GCM / TLS 1.3 Camouflage',
    ports: 'TCP/WebSocket 443',
    speedRating: 4,
    securityRating: 4,
    obfuscationRating: 5,
    description: 'Advanced stealth proxy protocol engineered to pierce Great Firewalls, university DPI filters, and strict governmental network restrictions.',
    recommendedFor: 'Censorship Bypassing, School/Corporate Deep Firewalls'
  }
];

export const INITIAL_SESSION_LOGS: SessionLog[] = [
  {
    id: 'sess-001',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    durationSeconds: 3840,
    downloadMB: 2840,
    uploadMB: 390,
    server: {
      id: 'de-fra-1',
      name: 'Frankfurt Core-01',
      country: 'Germany',
      city: 'Frankfurt',
      flag: '🇩🇪',
    },
    protocol: 'wireguard',
    originalIp: '73.189.24.112',
    vpnIp: '185.220.101.5',
    adsBlocked: 48,
  },
  {
    id: 'sess-002',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    durationSeconds: 5420,
    downloadMB: 4620,
    uploadMB: 610,
    server: {
      id: 'us-nyc-1',
      name: 'New York Metro-04',
      country: 'United States',
      city: 'New York',
      flag: '🇺🇸',
    },
    protocol: 'wireguard',
    originalIp: '73.189.24.112',
    vpnIp: '198.54.133.12',
    adsBlocked: 94,
  },
  {
    id: 'sess-003',
    timestamp: new Date(Date.now() - 3600000 * 42).toISOString(),
    durationSeconds: 1980,
    downloadMB: 840,
    uploadMB: 120,
    server: {
      id: 'sg-sin-1',
      name: 'Singapore Equinix-02',
      country: 'Singapore',
      city: 'Singapore',
      flag: '🇸🇬',
    },
    protocol: 'v2ray',
    originalIp: '73.189.24.112',
    vpnIp: '103.114.160.88',
    adsBlocked: 32,
  },
  {
    id: 'sess-004',
    timestamp: new Date(Date.now() - 3600000 * 70).toISOString(),
    durationSeconds: 7200,
    downloadMB: 6800,
    uploadMB: 1450,
    server: {
      id: 'nl-ams-1',
      name: 'Amsterdam North-01',
      country: 'Netherlands',
      city: 'Amsterdam',
      flag: '🇳🇱',
    },
    protocol: 'openvpn-udp',
    originalIp: '73.189.24.112',
    vpnIp: '194.187.249.77',
    adsBlocked: 112,
  }
];

export const WEEKLY_USAGE_STATS = [
  { day: 'Mon', downloadMB: 4200, uploadMB: 640 },
  { day: 'Tue', downloadMB: 3100, uploadMB: 480 },
  { day: 'Wed', downloadMB: 5800, uploadMB: 920 },
  { day: 'Thu', downloadMB: 2900, uploadMB: 390 },
  { day: 'Fri', downloadMB: 7400, uploadMB: 1250 },
  { day: 'Sat', downloadMB: 8900, uploadMB: 1420 },
  { day: 'Sun', downloadMB: 6200, uploadMB: 890 },
];

export const HOURLY_TRAFFIC_ESTIMATE = [
  { hour: '00:00', mbps: 45 },
  { hour: '03:00', mbps: 12 },
  { hour: '06:00', mbps: 28 },
  { hour: '09:00', mbps: 84 },
  { hour: '12:00', mbps: 110 },
  { hour: '15:00', mbps: 95 },
  { hour: '18:00', mbps: 142 },
  { hour: '21:00', mbps: 188 },
];
