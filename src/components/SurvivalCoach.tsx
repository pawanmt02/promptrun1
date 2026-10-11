import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { GEN_Z_SURVIVAL_HACKS } from '../data/initialData';
import {
  Flame,
  Lightbulb,
  Sparkles
} from 'lucide-react';

export const SurvivalCoach: React.FC = () => {
  const {
    riskLevel,
    dailyAllowance,
    healthScore
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'roast' | 'hacks'>('roast');

  // Generate dynamic, witty Gen Z roast or praise
  const getCoachRoast = () => {
    if (riskLevel === 'Critical') {
      return {
        mood: '💀 Critical Roast',
        title: 'Broke Emergency Protocol',
        quote: '“You are spending like you run a Y-Combinator funded startup, but your runway is literally 48 hours. Put the phone down, delete Swiggy, and eat mess food.”',
        tactic: 'Immediate Action: Pause every single subscription and lock all spending to ₹50/day.'
      };
    }
    if (riskLevel === 'High') {
      return {
        mood: '👀 Reality Check',
        title: 'Dangerously Close to Broke',
        quote: '“Your daily allowance is down to ₹' + dailyAllowance + '/day. That is not enough for an iced latte and an auto ride. Pick one or start walking.”',
        tactic: 'Immediate Action: Say no to the next social outing split and switch to student metro pass.'
      };
    }
    if (riskLevel === 'Moderate') {
      return {
        mood: '⚠️ Watch Your Pacing',
        title: 'Cruising, But Vulnerable',
        quote: '“You are doing okay, but one surprise cracked phone screen or birthday dinner split will push you into the danger zone. Keep your guard up.”',
        tactic: 'Immediate Action: Allocate ₹200 to your Emergency Buffer before spending on clothes or games.'
      };
    }
    return {
      mood: '✨ Financial Chad Status',
      title: 'Top Tier Discipline',
      quote: '“Rent is protected, bills are accounted for, and you have healthy daily breathing room. Keep holding the line and you will survive the month like a boss.”',
      tactic: 'Bonus Move: Any leftover money on Day 30 rolls straight into your long-term savings goals!'
    };
  };

  const coach = getCoachRoast();

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              AI Financial Wingman
            </h3>
            <span className="text-[10px] text-slate-400">
              No BS Gen Z Advice & Survival Tactics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('roast')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'roast'
                ? 'bg-rose-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vibe Check
          </button>
          <button
            onClick={() => setActiveTab('hacks')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === 'hacks'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Survival Hacks
          </button>
        </div>
      </div>

      {/* Tab 1: Vibe Check / Roast */}
      {activeTab === 'roast' ? (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {coach.mood}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Health Score: {healthScore.score}/100
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white mb-2">
              {coach.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed mb-3">
              {coach.quote}
            </p>

            <div className="pt-2.5 border-t border-slate-800 flex items-center gap-2 text-xs text-indigo-300 font-medium">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{coach.tactic}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Survival Hacks */
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {GEN_Z_SURVIVAL_HACKS.map((hack) => (
            <div
              key={hack.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white tracking-tight">
                  {hack.title}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Save {hack.savings}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {hack.tip}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
