import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Calendar as CalendarIcon, Lock, Tv, ChevronRight } from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const CalendarView: React.FC = () => {
  const {
    currentDay,
    totalDays,
    jumpToDay,
    transactions,
    commitments,
    subscriptions
  } = useFinance();

  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  // Group spends and events by day
  const spendsByDay: Record<number, number> = {};
  transactions.forEach((t) => {
    spendsByDay[t.day] = (spendsByDay[t.day] || 0) + t.amount;
  });

  const commitmentsByDay: Record<number, typeof commitments> = {};
  commitments.forEach((c) => {
    commitmentsByDay[c.dueDay] = [...(commitmentsByDay[c.dueDay] || []), c];
  });

  const subsByDay: Record<number, typeof subscriptions> = {};
  subscriptions.forEach((s) => {
    if (s.isActive) {
      subsByDay[s.billingDay] = [...(subsByDay[s.billingDay] || []), s];
    }
  });

  const selectedDayTransactions = transactions.filter((t) => t.day === selectedDay);
  const selectedDayCommitments = commitmentsByDay[selectedDay] || [];
  const selectedDaySubs = subsByDay[selectedDay] || [];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              30-Day Financial Horizon Grid
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap any day to inspect historical spends, scheduled renewals, and due dates.
          </p>
        </div>

        <button
          onClick={() => jumpToDay(selectedDay)}
          disabled={selectedDay === currentDay}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
        >
          <span>Jump to Day {selectedDay}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 30-Day Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 mb-4">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isToday = day === currentDay;
          const isPast = day < currentDay;
          const isSelected = day === selectedDay;
          const hasCommitment = commitmentsByDay[day] && commitmentsByDay[day].length > 0;
          const hasSub = subsByDay[day] && subsByDay[day].length > 0;
          const daySpend = spendsByDay[day] || 0;

          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                soundEffects.playClick();
              }}
              className={`relative p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[58px] ${
                isToday
                  ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold ring-2 ring-indigo-500/50 shadow-md shadow-indigo-500/20'
                  : isSelected
                  ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                  : isPast
                  ? 'bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full text-[10px]">
                <span className="font-mono font-bold">D{day}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                )}
              </div>

              {/* Badges for events on this day */}
              <div className="flex items-center gap-1 my-0.5">
                {hasCommitment && (
                  <span
                    title="Fixed commitment due"
                    className="w-2 h-2 rounded-full bg-amber-400"
                  />
                )}
                {hasSub && (
                  <span
                    title="Subscription billing day"
                    className="w-2 h-2 rounded-full bg-purple-400"
                  />
                )}
              </div>

              <div className="text-[9px] font-mono">
                {isPast ? (
                  <span className={daySpend > 300 ? 'text-rose-400' : 'text-slate-400'}>
                    ₹{daySpend}
                  </span>
                ) : isToday ? (
                  <span className="text-indigo-300 font-bold">₹{daySpend}</span>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspector Drawer */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="text-indigo-400 font-mono">Day {selectedDay}</span>
            {selectedDay === currentDay ? ' (Today)' : selectedDay < currentDay ? ' (Past)' : ' (Upcoming)'}
          </span>
          <span className="font-mono text-slate-400">
            Total Spent: <strong className="text-white">₹{spendsByDay[selectedDay] || 0}</strong>
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-1.5">
          {selectedDayCommitments.length > 0 && (
            <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Commitment Due:</strong>{' '}
                {selectedDayCommitments.map((c) => `${c.title} (₹${c.amount})`).join(', ')}
              </span>
            </div>
          )}

          {selectedDaySubs.length > 0 && (
            <div className="flex items-center gap-2 text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
              <Tv className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Auto-Debit Subscription:</strong>{' '}
                {selectedDaySubs.map((s) => `${s.name} (₹${s.cost})`).join(', ')}
              </span>
            </div>
          )}

          {selectedDayTransactions.length > 0 ? (
            <div className="text-slate-300 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Transactions:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDayTransactions.map((t) => (
                  <span
                    key={t.id}
                    className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px]"
                  >
                    {t.title} <strong className="text-rose-400 font-mono">-₹{t.amount}</strong>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-[11px]">
              No transactions recorded for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
