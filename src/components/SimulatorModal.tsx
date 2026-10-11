import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Category, Necessity } from '../types/finance';
import {
  Wand2,
  X,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Award,
  Zap,
  Wallet,
  CheckCircle2,
  Flame,
  Sparkles
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const SimulatorModal: React.FC = () => {
  const {
    isSimulatorOpen,
    setIsSimulatorOpen,
    runSimulation,
    applySimulationDecision
  } = useFinance();

  const [title, setTitle] = useState('Weekend Concert Pass');
  const [amount, setAmount] = useState<number>(1200);
  const [category, setCategory] = useState<Category>('Social & Outings');
  const [necessity, setNecessity] = useState<Necessity>('Want');

  // Quick preset decision templates
  const PRESET_DECISIONS = [
    { title: 'Concert Ticket', amount: 1500, category: 'Social & Outings' as Category, necessity: 'Want' as Necessity },
    { title: 'Late Night Swiggy', amount: 420, category: 'Food & Chai' as Category, necessity: 'Want' as Necessity },
    { title: 'College Textbook', amount: 650, category: 'Study & Gear' as Category, necessity: 'Need' as Necessity },
    { title: 'Gym Protein Powder', amount: 1200, category: 'Bills & Utilities' as Category, necessity: 'Want' as Necessity },
    { title: 'Sneaker Sale', amount: 1800, category: 'Guilt / Impulse' as Category, necessity: 'Want' as Necessity },
    { title: 'Metro Monthly Recharge', amount: 400, category: 'Commute & Travel' as Category, necessity: 'Need' as Necessity }
  ];

  // Run live simulation on every input change
  const simResult = useMemo(() => {
    if (!amount || amount <= 0) return null;
    return runSimulation(title, amount, category, necessity);
  }, [title, amount, category, necessity, runSimulation]);

  if (!isSimulatorOpen) return null;

  const handleApply = () => {
    if (!simResult) return;
    soundEffects.playChaChing();
    applySimulationDecision(simResult);
  };

  const handleDiscard = () => {
    soundEffects.playClick();
    setIsSimulatorOpen(false);
  };

  const getVerdictBadge = (rec: string) => {
    switch (rec) {
      case 'Safe to buy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Proceed with caution':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Bad idea / Broke Alert':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulator-modal-title"
    >
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-indigo-500/30 p-5 sm:p-7 shadow-2xl shadow-indigo-500/20 my-auto text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30" aria-hidden="true">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="simulator-modal-title" className="text-xl font-extrabold text-white tracking-tight">
                  What-If Decision Simulator
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Test the ripple effects of any spending decision BEFORE you swipe.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 focus-ring transition-colors"
            title="Close Simulator"
            aria-label="Close Simulator Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 mb-2 block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            Quick Gen Z Temptations:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PRESET_DECISIONS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(p.title);
                  setAmount(p.amount);
                  setCategory(p.category);
                  setNecessity(p.necessity);
                  soundEffects.playClick();
                }}
                className={`text-xs px-2.5 py-1 rounded-xl border focus-ring transition-all ${
                  title === p.title && amount === p.amount
                    ? 'bg-indigo-600 border-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {p.title} (₹{p.amount})
              </button>
            ))}
          </div>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-5">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="sim-title-input" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Decision / Expense Title
            </label>
            <input
              id="sim-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vintage Denim Jacket"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus-ring"
            />
          </div>

          <div>
            <label htmlFor="sim-amount-input" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Amount (₹)
            </label>
            <input
              id="sim-amount-input"
              type="number"
              min="1"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="₹ Amount"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-slate-600 focus-ring"
            />
          </div>

          <div>
            <label htmlFor="sim-necessity-select" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Necessity Type
            </label>
            <select
              id="sim-necessity-select"
              value={necessity}
              onChange={(e) => setNecessity(e.target.value as Necessity)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-sm text-white focus-ring cursor-pointer"
            >
              <option value="Need">Essential (Need)</option>
              <option value="Want">Discretionary (Want)</option>
              <option value="Emergency">Emergency Shock</option>
            </select>
          </div>
        </div>

        {/* Side-by-Side Impact Matrix */}
        {simResult && (
          <div className="space-y-4 mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-purple-400" />
              Interconnected Impact Analysis (Before vs After)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Metric 1: Balance */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Wallet className="w-3 h-3 text-indigo-400" />
                  Liquid Balance
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-400 line-through">
                    ₹{simResult.currentBalance}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className={`text-base font-bold font-mono ${simResult.projectedBalance < 500 ? 'text-rose-400' : 'text-white'}`}>
                    ₹{simResult.projectedBalance}
                  </span>
                </div>
                <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                  -₹{amount}
                </span>
              </div>

              {/* Metric 2: Daily Allowance */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  Daily Allowance
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-400 line-through">
                    ₹{simResult.currentDailyAllowance}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className={`text-base font-bold font-mono ${simResult.projectedDailyAllowance < 100 ? 'text-rose-400' : 'text-white'}`}>
                    ₹{simResult.projectedDailyAllowance}
                  </span>
                </div>
                <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                  -₹{simResult.currentDailyAllowance - simResult.projectedDailyAllowance}/day
                </span>
              </div>

              {/* Metric 3: Financial Risk */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  Risk Exposure
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">
                    {simResult.currentRisk}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className={`text-xs font-bold ${simResult.projectedRisk === 'Critical' ? 'text-rose-400' : simResult.projectedRisk === 'High' ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {simResult.projectedRisk}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Runway: {simResult.daysToZero === 'Survives' ? 'Survives Month' : `Broke on Day ${simResult.daysToZero}`}
                </span>
              </div>

              {/* Metric 4: Health Score */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Award className="w-3 h-3 text-emerald-400" />
                  Health Score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-400 line-through">
                    {simResult.currentHealthScore}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="text-base font-bold font-mono text-white">
                    {simResult.projectedHealthScore}
                  </span>
                </div>
                <span className={`text-[11px] font-mono mt-1 block ${simResult.projectedHealthScore < simResult.currentHealthScore ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {simResult.projectedHealthScore - simResult.currentHealthScore} pts
                </span>
              </div>
            </div>

            {/* Savings Goal ripple check */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
              <span className="text-amber-400 font-bold">🎯 Savings Goal Impact:</span>
              <span>{simResult.savingsImpact}</span>
            </div>

            {/* Gen Z AI Wingman Verdict Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              simResult.recommendation === 'Safe to buy'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : simResult.recommendation === 'Proceed with caution'
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  AI Wingman Verdict
                </span>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getVerdictBadge(simResult.recommendation)}`}>
                  {simResult.recommendation}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-100 font-medium">
                {simResult.verdict}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Decision Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleDiscard}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold focus-ring transition-colors"
          >
            Nah, Resisting FOMO (Save My Cash)
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-95 focus-ring transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Apply Decision to Budget</span>
          </button>
        </div>
      </div>
    </div>
  );
};
