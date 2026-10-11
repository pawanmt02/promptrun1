import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';
import {
  Target,
  ShieldCheck,
  Minus,
  Ticket,
  Headphones,
  Laptop,
  CheckCircle2
} from 'lucide-react';

export const SavingsGoalsManager: React.FC = () => {
  const {
    savingsGoals,
    allocateToGoal,
    liquidBalance,
    savingsLocked
  } = useFinance();

  const getGoalIcon = (icon: string) => {
    switch (icon) {
      case 'shield-alert':
      case 'shield-check':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ticket':
        return <Ticket className="w-4 h-4 text-purple-400" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-cyan-400" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-indigo-400" />;
      default:
        return <Target className="w-4 h-4 text-amber-400" />;
    }
  };

  const getPriorityBadge = (priority: SavingsGoal['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Medium':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Low':
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              Savings Targets & Emergency Cushion
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Resilience
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Lock funds away from daily temptation to build resilience or fund bucket-list goals.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Locked Stash</span>
          <span className="text-sm font-extrabold font-mono text-emerald-400">
            ₹{savingsLocked.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Goals Cards List */}
      <div className="space-y-3">
        {savingsGoals.map((goal) => {
          const progressPct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const isCompleted = goal.savedAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getGoalIcon(goal.icon)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {goal.title}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded-full border ${getPriorityBadge(
                          goal.priority
                        )}`}
                      >
                        {goal.priority}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Achieved!
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Target: ₹{goal.targetAmount.toLocaleString('en-IN')} by Day {goal.targetDay}
                    </span>
                  </div>
                </div>

                {/* Stash Numbers */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      ₹{goal.savedAmount.toLocaleString('en-IN')}{' '}
                      <span className="text-slate-500 font-normal">/ ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {progressPct}% funded
                    </span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {goal.savedAmount > 0 && (
                      <button
                        onClick={() => allocateToGoal(goal.id, -100)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="Withdraw ₹100 to liquid balance"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => allocateToGoal(goal.id, 100)}
                      disabled={liquidBalance < 100 || isCompleted}
                      className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      title="Lock ₹100 into this goal"
                    >
                      +₹100
                    </button>

                    <button
                      onClick={() => allocateToGoal(goal.id, 250)}
                      disabled={liquidBalance < 250 || isCompleted}
                      className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/50 text-[11px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      title="Lock ₹250 into this goal"
                    >
                      +₹250
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
