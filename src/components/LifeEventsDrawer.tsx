import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  AlertTriangle,
  TrendingUp,
  X
} from 'lucide-react';

export const LifeEventsDrawer: React.FC = () => {
  const {
    activeLifeEvent,
    resolveLifeEvent,
    dismissLifeEvent,
    currentDay
  } = useFinance();

  if (!activeLifeEvent) return null;

  const isWindfall = activeLifeEvent.type === 'Windfall';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-amber-500/40 p-5 sm:p-6 shadow-2xl shadow-amber-500/10 text-slate-100 animate-slide-up">
        {/* Dismiss Button */}
        <button
          onClick={dismissLifeEvent}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Dismiss Event"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Event Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
              isWindfall
                ? 'bg-emerald-600 shadow-emerald-500/30'
                : 'bg-amber-600 shadow-amber-500/30'
            }`}
          >
            {isWindfall ? (
              <TrendingUp className="w-5 h-5 text-white" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Day {currentDay} Unexpected Event
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {activeLifeEvent.type}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
              {activeLifeEvent.title}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {activeLifeEvent.description}
        </p>

        {/* Options / Decisions */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Choose Your Financial Response:
          </span>

          {activeLifeEvent.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => resolveLifeEvent(idx)}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group active:scale-[0.99]"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {opt.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {opt.impactDescription}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    opt.healthScoreDelta >= 0
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {opt.healthScoreDelta >= 0 ? `+${opt.healthScoreDelta}` : opt.healthScoreDelta} pts
                </span>

                <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  {opt.cost < 0 ? `+₹${Math.abs(opt.cost)}` : opt.cost === 0 ? '₹0' : `-₹${opt.cost}`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
