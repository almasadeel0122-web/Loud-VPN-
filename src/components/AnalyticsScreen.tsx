import React, { useState } from 'react';
import { useVPN } from '../context/VPNContext';
import { WEEKLY_USAGE_STATS, HOURLY_TRAFFIC_ESTIMATE } from '../data/mockData';
import { formatBytes, formatDuration, formatTimeAgo } from '../utils/formatters';
import { 
  BarChart3, 
  Clock, 
  Database, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Activity, 
  Calendar,
  Lock,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const AnalyticsScreen: React.FC = () => {
  const { 
    sessionLogs, 
    clearSessionLogs, 
    connectedDuration, 
    connectionState, 
    sessionDownloadMB, 
    sessionUploadMB 
  } = useVPN();

  const [timeframe, setTimeframe] = useState<'weekly' | 'hourly'>('weekly');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Compute total lifetime stats
  const totalLogsDownload = sessionLogs.reduce((acc, log) => acc + log.downloadMB, 0);
  const totalLogsUpload = sessionLogs.reduce((acc, log) => acc + log.uploadMB, 0);
  const totalDataMB = totalLogsDownload + totalLogsUpload + sessionDownloadMB + sessionUploadMB;
  const totalDurationSec = sessionLogs.reduce((acc, log) => acc + log.durationSeconds, 0) + connectedDuration;
  const totalAdsBlocked = sessionLogs.reduce((acc, log) => acc + log.adsBlocked, 0);

  // Export logs function
  const handleExportLogs = () => {
    sounds.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `smart_vpn_session_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Max value for weekly chart
  const maxWeeklyMB = Math.max(...WEEKLY_USAGE_STATS.map(d => d.downloadMB + d.uploadMB));

  return (
    <div className="flex flex-col pb-24 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white">Network Analytics & Logs</h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry, bandwidth consumption & audit history
          </p>
        </div>
        {sessionLogs.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
              title="Export session logs as JSON"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={clearSessionLogs}
              className="flex items-center gap-1 rounded-xl border border-rose-900/40 bg-rose-950/20 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-900/30"
              title="Clear all recorded session logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Aggregate KPI Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Data Shielded</span>
            <Database className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-extrabold text-white">
            {formatBytes(totalDataMB)}
          </div>
          <div className="text-[10px] text-slate-400">Encrypted in Tunnel</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Total Uptime</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-extrabold text-white">
            {formatDuration(totalDurationSec)}
          </div>
          <div className="text-[10px] text-slate-400">Secure browsing time</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Trackers Blocked</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-extrabold text-white">
            {totalAdsBlocked + 1420}
          </div>
          <div className="text-[10px] text-slate-400">Intrusive telemetry cut</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Security Rating</span>
            <Lock className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2 font-mono text-xl font-extrabold text-emerald-400">
            A+ (100%)
          </div>
          <div className="text-[10px] text-slate-400">Zero DNS/IP Leaks</div>
        </div>
      </div>

      {/* Interactive Usage Graph Card */}
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Data Consumption History
            </span>
          </div>

          <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-0.5 text-xs">
            <button
              onClick={() => {
                sounds.playClick();
                setTimeframe('weekly');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                timeframe === 'weekly' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setTimeframe('hourly');
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                timeframe === 'hourly' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hourly Peak
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Download
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Upload
            </span>
          </div>
          {hoveredBar !== null && (
            <div className="font-mono text-cyan-300">
              {timeframe === 'weekly' 
                ? `${WEEKLY_USAGE_STATS[hoveredBar].day}: ${formatBytes(WEEKLY_USAGE_STATS[hoveredBar].downloadMB + WEEKLY_USAGE_STATS[hoveredBar].uploadMB)}`
                : `${HOURLY_TRAFFIC_ESTIMATE[hoveredBar].hour}: ${HOURLY_TRAFFIC_ESTIMATE[hoveredBar].mbps} Mbps`}
            </div>
          )}
        </div>

        {/* Chart Visualization */}
        <div className="mt-4 flex h-40 items-end gap-2 pt-4">
          {timeframe === 'weekly' ? (
            WEEKLY_USAGE_STATS.map((stat, idx) => {
              const total = stat.downloadMB + stat.uploadMB;
              const heightPercent = (total / maxWeeklyMB) * 100;
              const isHovered = hoveredBar === idx;

              return (
                <div
                  key={stat.day}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                >
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 flex flex-col justify-end overflow-hidden ${
                      isHovered ? 'brightness-125 scale-105' : 'opacity-90'
                    }`}
                    style={{ height: `${Math.max(12, heightPercent)}%` }}
                  >
                    <div
                      className="w-full bg-emerald-400"
                      style={{ height: `${(stat.uploadMB / total) * 100}%` }}
                    />
                    <div
                      className="w-full bg-cyan-500"
                      style={{ height: `${(stat.downloadMB / total) * 100}%` }}
                    />
                  </div>
                  <span className={`mt-2 font-mono text-[11px] ${isHovered ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    {stat.day}
                  </span>
                </div>
              );
            })
          ) : (
            HOURLY_TRAFFIC_ESTIMATE.map((item, idx) => {
              const heightPercent = (item.mbps / 200) * 100;
              const isHovered = hoveredBar === idx;

              return (
                <div
                  key={item.hour}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                >
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-300 ${
                      isHovered ? 'brightness-125 scale-105' : 'opacity-85'
                    }`}
                    style={{ height: `${Math.max(10, heightPercent)}%` }}
                  />
                  <span className={`mt-2 font-mono text-[10px] ${isHovered ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
                    {item.hour.slice(0, 2)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Session Logs History List */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Tunnel Session History
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {sessionLogs.length} Records
          </span>
        </div>

        {sessionLogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
            <p className="text-sm text-slate-400">No session history recorded yet.</p>
            <p className="mt-1 text-xs text-slate-400">
              Sessions will appear here automatically when you disconnect.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessionLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 transition hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{log.server.flag}</span>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {log.server.city}, {log.server.country}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatTimeAgo(log.timestamp)} • Protocol: <span className="font-mono text-cyan-400 uppercase">{log.protocol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-white">
                      {formatDuration(log.durationSeconds)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Duration
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-slate-800/60 bg-slate-950/60 p-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">DOWNLOAD</span>
                    <div className="flex items-center justify-center gap-1 font-mono font-semibold text-cyan-300">
                      <ArrowDown className="h-3 w-3" />
                      <span>{formatBytes(log.downloadMB)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400">UPLOAD</span>
                    <div className="flex items-center justify-center gap-1 font-mono font-semibold text-emerald-300">
                      <ArrowUp className="h-3 w-3" />
                      <span>{formatBytes(log.uploadMB)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400">VIRTUAL IP</span>
                    <div className="font-mono text-[11px] font-semibold text-slate-300">
                      {log.vpnIp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
