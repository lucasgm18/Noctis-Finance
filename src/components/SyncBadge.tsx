import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface SyncBadgeProps {
  className?: string;
  variant?: 'pill' | 'header' | 'sidebar';
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ className = '', variant = 'pill' }) => {
  const { syncStatus, refreshFromSupabase } = useFinance();

  if (variant === 'sidebar') {
    return (
      <div 
        onClick={() => refreshFromSupabase()}
        title="Status da conexão em tempo real com Supabase PostgreSQL. Clique para forçar sincronização."
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
          syncStatus === 'synced'
            ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/25'
            : syncStatus === 'syncing'
            ? 'bg-amber-500/20 border border-amber-400/40 text-amber-100 hover:bg-amber-500/30'
            : 'bg-rose-500/20 border border-rose-400/40 text-rose-100 hover:bg-rose-500/30'
        } ${className}`}
      >
        {syncStatus === 'synced' && (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="truncate">🟢 Sincronizado com Supabase</span>
          </>
        )}

        {syncStatus === 'syncing' && (
          <>
            <RefreshCw className="w-3 h-3 text-amber-300 animate-spin shrink-0" />
            <span className="truncate">🟡 Sincronizando...</span>
          </>
        )}

        {syncStatus === 'error' && (
          <>
            <AlertCircle className="w-3 h-3 text-rose-300 shrink-0" />
            <span className="truncate">🔴 Reconectar Supabase</span>
          </>
        )}
      </div>
    );
  }

  // Header / Pill variant
  return (
    <div
      onClick={() => refreshFromSupabase()}
      title="Sincronização em tempo real (WebSockets). Clique para atualizar."
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
        syncStatus === 'synced'
          ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/20'
          : syncStatus === 'syncing'
          ? 'bg-amber-500/20 border border-amber-400/40 text-amber-100 hover:bg-amber-500/30'
          : 'bg-rose-500/20 border border-rose-400/40 text-rose-100 hover:bg-rose-500/30'
      } ${className}`}
    >
      {syncStatus === 'synced' && (
        <>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
          <span>🟢 Sincronizado</span>
        </>
      )}

      {syncStatus === 'syncing' && (
        <>
          <RefreshCw className="w-3 h-3 text-amber-300 animate-spin shrink-0" />
          <span>🟡 Sincronizando...</span>
        </>
      )}

      {syncStatus === 'error' && (
        <>
          <AlertCircle className="w-3 h-3 text-rose-300 shrink-0" />
          <span>🔴 Offline</span>
        </>
      )}
    </div>
  );
};

export default SyncBadge;
