import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Commitment } from '../types/finance';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard
} from 'lucide-react';

export const CommitmentsManager: React.FC = () => {
  const {
    commitments,
    currentDay,
    payCommitment,
    pendingCommitmentsTotal
  } = useFinance();

  const getCriticalityBadge = (crit: Commitment['criticality']) => {
    switch (crit) {
      case 'Mandatory':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Flexible':
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
              <Lock className="w-4 h-4 text-amber-400" />
              Fixed Commitments & Bills
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Reserved Pool
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-negotiable obligations locked in advance so you don't spend rent money on biryani.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Pending Shield</span>
          <span className="text-sm font-extrabold font-mono text-amber-400">
            ₹{pendingCommitmentsTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Commitment Protection Note */}
      <div className="mb-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Commitment Shield Active:</strong> ₹{pendingCommitmentsTotal} is automatically subtracted before calculating your safe daily allowance.
        </span>
      </div>

      {/* Commitments List */}
      <div className="space-y-2.5">
        {commitments.map((comm) => {
          const isOverdue = !comm.isPaid && comm.dueDay < currentDay;
          const isDueToday = !comm.isPaid && comm.dueDay === currentDay;

          return (
            <div
              key={comm.id}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                comm.isPaid
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-70'
                  : isDueToday
                  ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/5'
                  : isOverdue
                  ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    comm.isPaid
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isDueToday
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {comm.isPaid ? '✓' : `D${comm.dueDay}`}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {comm.title}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded-full border ${getCriticalityBadge(
                        comm.criticality
                      )}`}
                    >
                      {comm.criticality}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Due: Day {comm.dueDay}</span>
                    <span>•</span>
                    <span className="font-mono font-semibold text-slate-300">
                      ₹{comm.amount.toLocaleString('en-IN')}
                    </span>
                    {isDueToday && (
                      <span className="text-[10px] text-amber-400 font-bold animate-pulse">
                        (Due Today!)
                      </span>
                    )}
                    {isOverdue && (
                      <span className="text-[10px] text-rose-400 font-bold">
                        (Overdue!)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status / Pay Action */}
              <div className="flex items-center justify-end gap-2 self-end sm:self-auto">
                {comm.isPaid ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paid
                  </span>
                ) : (
                  <button
                    onClick={() => payCommitment(comm.id)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center gap-1.5"
                    title={`Pay ₹${comm.amount} now`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay ₹{comm.amount}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
