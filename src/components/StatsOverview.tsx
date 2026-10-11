import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Wallet,
  Zap,
  AlertTriangle,
  Award,
  Lock,
  ShieldCheck
} from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const {
    liquidBalance,
    totalBudget,
    totalSpent,
    savingsLocked,
    pendingCommitmentsTotal,
    dailyAllowance,
    todaySpent,
    daysRemaining,
    riskLevel,
    riskScorePct,
    riskReason,
    healthScore
  } = useFinance();

  // Color schemes for Risk
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Minimal':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          bar: 'bg-emerald-500'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          bar: 'bg-amber-500'
        };
      case 'High':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          bar: 'bg-orange-500'
        };
      case 'Critical':
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          bar: 'bg-rose-500'
        };
    }
  };

  const riskStyle = getRiskColor(riskLevel);

  // Grade badge color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (grade === 'B') return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (grade === 'C') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Liquid Balance Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5 group border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-indigo-400" />
            Liquid Cash
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
            Pool: ₹{totalBudget.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="mb-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-1">
            ₹{liquidBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-400 mt-1">Available to spend right now</p>
        </div>

        {/* Breakdown pills */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
          <span className="text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Spent: ₹{totalSpent.toLocaleString('en-IN')}
          </span>
          <span className="text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800/80 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-400" />
            Committed: ₹{pendingCommitmentsTotal.toLocaleString('en-IN')}
          </span>
          {savingsLocked > 0 && (
            <span className="text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800/80 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Saved: ₹{savingsLocked.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* 2. Safe Daily Allowance Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-purple-500/5 group border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" />
            Daily Allowance
          </span>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            {daysRemaining} Days Left
          </span>
        </div>

        <div className="mb-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-1">
            ₹{dailyAllowance.toLocaleString('en-IN')}
            <span className="text-xs font-medium text-slate-400">/day</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">
              Today's Spend:{' '}
              <strong className={todaySpent > dailyAllowance ? 'text-rose-400' : 'text-emerald-400'}>
                ₹{todaySpent}
              </strong>
            </span>
          </div>
        </div>

        {/* Burn pace bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Today's Allowance Used</span>
            <span>{dailyAllowance > 0 ? Math.min(100, Math.round((todaySpent / dailyAllowance) * 100)) : 100}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                todaySpent > dailyAllowance ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}
              style={{
                width: `${dailyAllowance > 0 ? Math.min(100, (todaySpent / dailyAllowance) * 100) : 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Financial Risk Index Card */}
      <div className={`glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all hover:shadow-xl border border-slate-800`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Financial Risk
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${riskStyle.badge}`}>
            {riskLevel}
          </span>
        </div>

        <div className="mb-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-1">
            {riskScorePct}%
            <span className="text-xs font-medium text-slate-400">exposure</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1" title={riskReason}>
            {riskReason}
          </p>
        </div>

        {/* Risk meter bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${riskStyle.bar}`}
              style={{ width: `${riskScorePct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>Chill</span>
            <span>Moderate</span>
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* 4. Financial Health Score Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-emerald-500/5 group border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            Health Score
          </span>
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${getGradeColor(healthScore.grade)}`}>
            Grade {healthScore.grade}
          </span>
        </div>

        <div className="mb-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-1">
            {healthScore.score}
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1" title={healthScore.summary}>
            {healthScore.summary}
          </p>
        </div>

        {/* 4 Pillar Mini Indicators */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-1.5 text-center">
          <div title={`Budget Discipline: ${healthScore.budgetDiscipline}/25`}>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${(healthScore.budgetDiscipline / 25) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 block">Budget</span>
          </div>

          <div title={`Bill Coverage: ${healthScore.billCoverage}/25`}>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-full"
                style={{ width: `${(healthScore.billCoverage / 25) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 block">Bills</span>
          </div>

          <div title={`Savings Goals: ${healthScore.savingsProgress}/25`}>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-purple-400 h-full"
                style={{ width: `${(healthScore.savingsProgress / 25) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 block">Savings</span>
          </div>

          <div title={`Impulse Control: ${healthScore.impulseControl}/25`}>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${(healthScore.impulseControl / 25) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 block">Control</span>
          </div>
        </div>
      </div>
    </div>
  );
};
