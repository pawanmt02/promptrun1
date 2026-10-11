import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Tv,
  Music,
  Video,
  Cloud,
  Pause,
  Play,
  Sparkles,
  CreditCard
} from 'lucide-react';

export const SubscriptionsManager: React.FC = () => {
  const {
    subscriptions,
    toggleSubscription,
    currentDay,
    daysRemaining
  } = useFinance();

  const totalMonthlyCost = useMemo(() => {
    return subscriptions
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + s.cost, 0);
  }, [subscriptions]);

  const totalPausedSavings = useMemo(() => {
    return subscriptions
      .filter((s) => !s.isActive)
      .reduce((sum, s) => sum + s.cost, 0);
  }, [subscriptions]);

  const dailyBoost = Math.round(totalPausedSavings / Math.max(1, daysRemaining));

  const getSubIcon = (iconName: string) => {
    switch (iconName) {
      case 'music':
        return <Music className="w-4 h-4 text-emerald-400" />;
      case 'tv':
        return <Tv className="w-4 h-4 text-rose-400" />;
      case 'youtube':
        return <Video className="w-4 h-4 text-red-400" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-cyan-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-purple-400" />
              Subscriptions & Recurring Drains
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Audit Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pause unused streaming & tools to instantly unlock liquid daily cash.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Monthly Drain</span>
          <span className="text-sm font-extrabold font-mono text-purple-400">
            ₹{totalMonthlyCost.toLocaleString('en-IN')}/mo
          </span>
        </div>
      </div>

      {/* Paused Savings Banner */}
      {totalPausedSavings > 0 && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-2 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Smart Pause Bonus:</strong> You saved ₹{totalPausedSavings}/mo!
            </span>
          </div>
          <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold">
            +{dailyBoost} ₹/day allowance boost
          </span>
        </div>
      )}

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {subscriptions.map((sub) => {
          const isDueSoon = sub.isActive && sub.billingDay >= currentDay && sub.billingDay <= currentDay + 3;

          return (
            <div
              key={sub.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                sub.isActive
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {getSubIcon(sub.iconName)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-tight">
                      {sub.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono text-slate-300 font-semibold">₹{sub.cost}/mo</span>
                    <span>•</span>
                    <span>Renews Day {sub.billingDay}</span>
                    {isDueSoon && (
                      <span className="text-[10px] text-amber-400 font-semibold animate-pulse">
                        (Renews Soon!)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pause / Resume Button */}
              <button
                onClick={() => toggleSubscription(sub.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  sub.isActive
                    ? 'bg-slate-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800/60 border border-slate-700 text-slate-300'
                    : 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                }`}
                title={sub.isActive ? 'Pause subscription to save cash' : 'Resume subscription'}
              >
                {sub.isActive ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Resume</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
