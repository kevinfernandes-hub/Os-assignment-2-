import React, { useState } from 'react';
import { Terminal, Download, Trash2, Filter, Search } from 'lucide-react';
import { LogEntry, LogCategory } from '../types/simulation';

interface EventAuditLogProps {
  logs: LogEntry[];
  logFilter: LogCategory;
  setLogFilter: (filter: LogCategory) => void;
  onClearLogs?: () => void;
}

export const EventAuditLog: React.FC<EventAuditLogProps> = ({
  logs,
  logFilter,
  setLogFilter,
  onClearLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (logFilter !== 'ALL' && log.category !== logFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Export logs to JSON
  const exportLogsAsJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mars_colony_ipc_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActorBadge = (actor: LogEntry['actor']) => {
    switch (actor) {
      case 'PRODUCER':
        return <span className="text-orange-400 font-bold">PROD</span>;
      case 'CONSUMER':
        return <span className="text-cyan-400 font-bold">CONS</span>;
      case 'KERNEL':
        return <span className="text-emerald-400 font-bold">KERN</span>;
      case 'SYSTEM':
        return <span className="text-purple-400 font-bold">SYS</span>;
    }
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-bold text-white font-display">
            Kernel Synchronization Audit Log
          </h3>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            ({filteredLogs.length} events)
          </span>
        </div>

        {/* Filter buttons & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-[#07090d] p-1 rounded-lg border border-slate-800">
            {(['ALL', 'PRODUCER', 'CONSUMER', 'MUTEX', 'SEMAPHORE'] as LogCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setLogFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors cursor-pointer ${
                    logFilter === cat
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-[#07090d] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-300 placeholder:text-slate-600 focus:outline-hidden focus:border-slate-700 w-36 md:w-44 font-mono"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={exportLogsAsJson}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Download audit trail as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="h-64 overflow-y-auto font-mono text-xs space-y-1.5 pr-1 select-text">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs font-mono">
            No events match current filter. Start simulation to generate process logs.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="py-1 px-2 rounded-md hover:bg-slate-900/60 transition-colors flex items-start gap-2 text-slate-300 leading-snug border border-transparent hover:border-slate-800/60"
            >
              <span className="text-[11px] text-slate-500 shrink-0 tabular-nums">
                {log.timestamp}
              </span>
              <span className="shrink-0 text-[11px] px-1 rounded bg-slate-900 border border-slate-800/80">
                {getActorBadge(log.actor)}
              </span>
              <span className="text-orange-300/90 font-medium shrink-0">[{log.action}]</span>
              <span className="text-slate-400 break-words">{log.detail}</span>

              {/* State snapshot badge */}
              <span className="ml-auto text-[10px] text-slate-500 shrink-0 hidden md:inline-flex items-center gap-2">
                <span>E:{log.emptyVal}</span>
                <span>F:{log.fullVal}</span>
                <span>M:{log.mutexLocked ? 'L' : 'U'}</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
