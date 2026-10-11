import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Flame } from 'lucide-react';

export const BrokeModeBanner: React.FC = () => {
  const { isBrokeMode, toggleBrokeMode, riskLevel, dailyAllowance } = useFinance();

  if (!isBrokeMode) return null;

  return (
    <div className="w-full bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-b border-rose-500/40 text-rose-100 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
            <Flame className="w-4 h-4 animate-bounce" />
          </span>
          <div>
            <span className="font-bold uppercase tracking-wider text-rose-300">
              🚨 Broke Protocol Active ({riskLevel} Risk):
            </span>{' '}
            <span className="text-rose-200">
              Daily budget squeezed to <strong className="text-white font-mono">₹{dailyAllowance}/day</strong>. Discretionary wants, luxury deliveries, and non-essential spends are locked down.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-rose-300 border border-rose-500/30">
            Strict Survival Mode
          </span>
          <button
            onClick={toggleBrokeMode}
            className="p-1 rounded-md hover:bg-rose-900/60 text-rose-300 hover:text-white transition-colors"
            title="Dismiss Broke Protocol"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
