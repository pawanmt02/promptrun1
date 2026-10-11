import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Category, Necessity } from '../types/finance';
import {
  Receipt,
  Plus,
  Trash2
} from 'lucide-react';

const QUICK_EXPENSE_PRESETS = [
  { title: 'Chai & Maggi', amount: 50, category: 'Food & Chai' as Category, necessity: 'Need' as Necessity, icon: '☕' },
  { title: 'Metro Smart Card', amount: 150, category: 'Commute & Travel' as Category, necessity: 'Need' as Necessity, icon: '🚇' },
  { title: 'Late Night Swiggy', amount: 320, category: 'Guilt / Impulse' as Category, necessity: 'Want' as Necessity, icon: '🛵' },
  { title: 'Quick Groceries', amount: 220, category: 'Food & Chai' as Category, necessity: 'Need' as Necessity, icon: '🛒' },
  { title: 'College Xerox & Notes', amount: 45, category: 'Study & Gear' as Category, necessity: 'Need' as Necessity, icon: '📄' },
  { title: 'Boba / Iced Coffee', amount: 240, category: 'Food & Chai' as Category, necessity: 'Want' as Necessity, icon: '🧋' }
];

export const ExpenseTracker: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    currentDay,
    todaySpent
  } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<Category>('Food & Chai');
  const [necessity, setNecessity] = useState<Necessity>('Need');
  const [filter, setFilter] = useState<'all' | 'needs' | 'wants' | 'today'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: Number(amount),
      category,
      necessity
    });

    setTitle('');
    setAmount('');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'needs') return t.necessity === 'Need';
    if (filter === 'wants') return t.necessity === 'Want' || t.category === 'Guilt / Impulse';
    if (filter === 'today') return t.day === currentDay;
    return true;
  });

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'Food & Chai':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Commute & Travel':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Study & Gear':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Social & Outings':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Guilt / Impulse':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Emergency':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-indigo-400" />
              Live Expense Tracker & Log
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Day {currentDay} Burn
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Log real-time spends to keep your daily allowance and health score synced.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Logged Today</span>
          <span className="text-sm font-extrabold font-mono text-white">
            ₹{todaySpent.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 1-Tap Quick Spend Presets */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
          1-Tap Quick Spends:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_EXPENSE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                addTransaction({
                  title: p.title,
                  amount: p.amount,
                  category: p.category,
                  necessity: p.necessity
                });
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>{p.icon}</span>
              <span>{p.title}</span>
              <span className="font-mono text-indigo-300 font-bold">₹{p.amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Expense Form */}
      <form onSubmit={handleSubmit} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="col-span-1 md:col-span-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Expense title (e.g. Cutting chai, Auto fare)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Amount (₹)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Food & Chai">Food & Chai</option>
              <option value="Commute & Travel">Commute & Travel</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Social & Outings">Social & Outings</option>
              <option value="Study & Gear">Study & Gear</option>
              <option value="Guilt / Impulse">Guilt / Impulse</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 mr-1">Type:</span>
            {(['Need', 'Want', 'Emergency'] as Necessity[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setNecessity(type)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  necessity === type
                    ? type === 'Need'
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : type === 'Want'
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 font-bold'
                      : 'bg-rose-600/20 text-rose-300 border-rose-500/40 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Expense</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <span className="text-xs font-bold text-slate-300">
          Transaction Activity ({filteredTransactions.length})
        </span>

        <div className="flex items-center gap-1 text-xs">
          {(['all', 'today', 'needs', 'wants'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-0.5 rounded-lg capitalize transition-colors ${
                filter === tab
                  ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Feed */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No transactions match this filter. Keep it up!
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                  D{tx.day}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-tight">
                      {tx.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full border ${getCategoryColor(
                        tx.category
                      )}`}
                    >
                      {tx.category}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full border ${
                        tx.necessity === 'Need'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : tx.necessity === 'Want'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {tx.necessity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-rose-400">
                  -₹{tx.amount.toLocaleString('en-IN')}
                </span>

                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="opacity-40 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                  title="Undo / Delete transaction"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
