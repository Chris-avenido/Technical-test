'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { DemoUserStatus } from '../lib/types';
import { Lock, Unlock, RefreshCw, Diamond, Layers } from 'lucide-react';

interface DemoControlPanelProps {
  userStatus: DemoUserStatus | null;
  onToggleStatus: () => void;
  loading: boolean;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  userStatus,
  onToggleStatus,
  loading,
}) => {
  const { t } = useI18n();
  const isSubscribed = userStatus?.isSubscribed ?? false;

  return (
    <div className="w-full bg-[#0B0F14] text-zinc-100 border-b border-zinc-800/80 px-3 sm:px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        {/* Left indicators */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
            <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs text-zinc-300">
              {t.evaluatorMode}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300 min-w-0">
            <Diamond className="w-3 h-3 text-emerald-400 fill-emerald-400/20 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none text-zinc-300 text-[11px] sm:text-xs">
              {userStatus?.email || 'demo@example.com'}
            </span>
          </div>

          <span className="text-zinc-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-zinc-400 text-[11px] sm:text-xs">Status:</span>
            <span
              className={`font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase ${
                isSubscribed
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : 'bg-[#F6BA29] text-zinc-950 shadow-sm shadow-amber-500/20'
              }`}
            >
              {isSubscribed ? t.proSubscriber : t.freeTier}
            </span>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] shrink-0">
            {isSubscribed ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nutritional data is unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Nutritional data is locked</span>
              </>
            )}
          </div>

          <button
            onClick={onToggleStatus}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-200 font-medium transition-colors cursor-pointer disabled:opacity-50 text-[11px] sm:text-xs shrink-0 ml-auto sm:ml-0 shadow-sm"
          >
            <RefreshCw className={`w-3 h-3 shrink-0 ${loading ? 'animate-spin' : ''}`} />
            <span>{isSubscribed ? t.toggleFree : t.togglePro}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
