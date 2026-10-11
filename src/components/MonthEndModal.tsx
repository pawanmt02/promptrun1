import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Sparkles,
  Trophy,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const MonthEndModal: React.FC = () => {
  const {
    isMonthEndModalOpen,
    setIsMonthEndModalOpen,
    liquidBalance,
    totalSpent,
    savingsLocked,
    healthScore,
    resetAllData
  } = useFinance();

  const [copied, setCopied] = useState(false);

  if (!isMonthEndModalOpen) return null;

  const isSurvived = liquidBalance > 0;

  const handleCopyReceipt = () => {
    soundEffects.playClick();
    const receiptText = `💸 PAISA.OS // 30-Day Budget Survival Receipt
------------------------------------------------
Outcome: ${isSurvived ? '🎉 SURVIVED THE MONTH' : '💀 WENT BROKE BEFORE DAY 30'}
Liquid Cash Remaining: ₹${liquidBalance.toLocaleString('en-IN')}
Total Stashed in Goals: ₹${savingsLocked.toLocaleString('en-IN')}
Total Spent: ₹${totalSpent.toLocaleString('en-IN')}
Financial Health Score: ${healthScore.score}/100 (Grade ${healthScore.grade})
Status: Broke But Functional Certified!
------------------------------------------------
Built with PromptRun 2026`;

    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="month-end-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-indigo-500/40 p-5 sm:p-7 shadow-2xl shadow-indigo-500/20 text-slate-100 my-auto animate-slide-up">
        {/* Banner */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-500/30">
            {isSurvived ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-200" />
            )}
          </div>

          <h2 id="month-end-title" className="text-2xl font-extrabold text-white tracking-tight">
            {isSurvived ? '🎉 Month Conquered!' : '💀 Out of Cash!'}
          </h2>

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Month Evaluation Complete
          </span>

          <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
            {isSurvived ? '🎉 Month Conquered!' : '💀 Budget Depleted!'}
          </h2>

          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            {isSurvived
              ? 'You successfully navigated 30 days on a ₹10,000 budget without defaulting on your rent or obligations.'
              : 'You ran out of liquid funds before completing Day 30. Review your impulses and try again!'}
          </p>
        </div>

        {/* Score Card Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-5">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Remaining Liquid Cash
            </span>
            <span className="text-lg font-extrabold font-mono text-emerald-400">
              ₹{liquidBalance.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Savings Goals Stashed
            </span>
            <span className="text-lg font-extrabold font-mono text-purple-400">
              ₹{savingsLocked.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total 30-Day Spend
            </span>
            <span className="text-lg font-extrabold font-mono text-slate-200">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Health Grade
            </span>
            <span className="text-lg font-extrabold font-mono text-indigo-400">
              Grade {healthScore.grade} ({healthScore.score}/100)
            </span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Badges & Accolades Unlocked:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Rent Shield</span>
                <span className="text-[10px] text-slate-400">Zero eviction risk</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Sub Slayer</span>
                <span className="text-[10px] text-slate-400">Trimmed drains</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleCopyReceipt}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Receipt!' : 'Copy Brag Receipt'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsMonthEndModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                resetAllData();
                setIsMonthEndModalOpen(false);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Run</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
