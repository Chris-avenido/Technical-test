'use client';

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { DemoUserStatus } from '../lib/types';
import { ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

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
    <div className="w-full bg-zinc-900 text-zinc-100 border-b border-zinc-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-700">
            {t.evaluatorMode}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userStatus?.email || 'demo@example.com'}</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Current Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                isSubscribed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isSubscribed ? t.proSubscriber : t.freeTier}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-zinc-400 text-[11px]">
            {isSubscribed
              ? 'Nutritional data is unlocked'
              : 'Nutritional data is locked'}
          </span>
          <button
            onClick={onToggleStatus}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 border border-zinc-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>{isSubscribed ? t.toggleFree : t.togglePro}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
