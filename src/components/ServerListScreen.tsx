import React, { useState, useMemo } from 'react';
import { useVPN } from '../context/VPNContext';
import { SERVERS } from '../data/servers';
import { VPNServer, ServerCategory } from '../types/vpn';
import { 
  Search, 
  Zap, 
  Crown, 
  Tv, 
  Gamepad2, 
  ShieldCheck, 
  Filter, 
  Check, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const ServerListScreen: React.FC = () => {
  const { 
    currentServer, 
    selectServer, 
    autoSelectFastestServer, 
    connectionState, 
    vipState, 
    setShowVipModal,
    setActiveTab 
  } = useVPN();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServerCategory>('all');
  const [sortBy, setSortBy] = useState<'ping' | 'load' | 'name'>('ping');

  const categories: { id: ServerCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Servers', icon: <Filter className="h-3.5 w-3.5" /> },
    { id: 'streaming', label: 'Fast Streaming', icon: <Tv className="h-3.5 w-3.5" /> },
    { id: 'gaming', label: 'Low Ping Gaming', icon: <Gamepad2 className="h-3.5 w-3.5" /> },
    { id: 'privacy', label: 'Privacy Vaults', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: 'adfree', label: 'Ad-Free DNS', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: 'free', label: 'Free Tier', icon: <Zap className="h-3.5 w-3.5" /> },
  ];

  const filteredServers = useMemo(() => {
    return SERVERS.filter((server) => {
      // Search matching
      const matchesSearch =
        server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.streamingServices && server.streamingServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchesSearch) return false;

      // Category matching
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'free') return !server.isVip;
      return server.category.includes(selectedCategory as 'streaming' | 'gaming' | 'privacy' | 'adfree');
    }).sort((a, b) => {
      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'load') return a.load - b.load;
      return a.country.localeCompare(b.country);
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSelectServer = (server: VPNServer) => {
    if (server.isVip && !vipState.isVip) {
      setShowVipModal(true);
      return;
    }
    selectServer(server);
    // Switch to home tab to see connection progress
    setActiveTab('home');
  };

  const getPingColor = (ping: number) => {
    if (ping < 20) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (ping < 40) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (ping < 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="flex flex-col pb-24 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-extrabold text-white">Global Server Locations</h1>
        <p className="text-xs text-slate-400">
          Smart categorized high-speed nodes with military-grade encryption
        </p>
      </div>

      {/* Auto-Select Fastest Banner */}
      <div className="mt-4 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Smart Location Routing</div>
              <div className="text-[11px] text-slate-400">
                Auto-connect to server with lowest latency & least congestion
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              autoSelectFastestServer();
              setActiveTab('home');
            }}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Fastest Node</span>
          </button>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country, city or streaming..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setSortBy((prev) => (prev === 'ping' ? 'load' : prev === 'load' ? 'name' : 'ping'));
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 hover:border-slate-700"
          title={`Sorting by: ${sortBy.toUpperCase()}`}
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
          <span className="capitalize">{sortBy}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? 'border border-cyan-500/60 bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Servers List */}
      <div className="mt-4 space-y-2.5">
        {filteredServers.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
            <p className="text-sm text-slate-400">No servers match your search filter.</p>
          </div>
        ) : (
          filteredServers.map((server) => {
            const isCurrent = server.id === currentServer.id;
            const isVipLocked = server.isVip && !vipState.isVip;
            const pingStyle = getPingColor(server.ping);

            return (
              <div
                key={server.id}
                onClick={() => handleSelectServer(server)}
                className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Left: Flag & Server Details */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-sm">{server.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {server.country}
                      </span>
                      <span className="text-xs text-slate-400">({server.city})</span>
                      {server.isVip && (
                        <span className="flex items-center gap-0.5 rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                          <Crown className="h-3 w-3" />
                          <span>VIP</span>
                        </span>
                      )}
                    </div>

                    {/* Tags / Capabilities */}
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                      {server.category.includes('streaming') && (
                        <span className="flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                          <Tv className="h-3 w-3 text-cyan-400" />
                          <span>4K Stream</span>
                        </span>
                      )}
                      {server.category.includes('gaming') && (
                        <span className="flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                          <Gamepad2 className="h-3 w-3 text-emerald-400" />
                          <span>{server.gamingScore}/100</span>
                        </span>
                      )}
                      {server.category.includes('privacy') && (
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                          RAM-Only
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Ping, Load & Action */}
                <div className="flex items-center gap-3">
                  {/* Server Load Bar */}
                  <div className="hidden text-right sm:block">
                    <div className="text-[10px] text-slate-400">LOAD</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            server.load < 40 ? 'bg-emerald-400' : server.load < 75 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${server.load}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-slate-300">{server.load}%</span>
                    </div>
                  </div>

                  {/* Latency Pill */}
                  <div className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-mono font-semibold ${pingStyle}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                    <span>{server.ping}ms</span>
                  </div>

                  {/* Selected / VIP Lock Badge */}
                  {isCurrent ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-md">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                  ) : isVipLocked ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/20 text-amber-400">
                      <Crown className="h-3.5 w-3.5" />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
