import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../types/auth';
import {
  LogIn,
  X,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  MapPin,
  ArrowRight,
  Flame,
  Zap
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    loginAsDemo,
    isAuthenticated
  } = useAuth();

  const [tab, setTab] = useState<'demo' | 'custom'>('demo');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email, name || 'Gen Z Explorer', city || 'Delhi NCR');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-indigo-500/40 p-5 sm:p-7 shadow-2xl shadow-indigo-500/20 text-slate-100 my-auto animate-slide-up">
        {/* Close Button (if already logged in) */}
        {isAuthenticated && (
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors focus-ring"
            aria-label="Close authentication modal"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Brand Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-indigo-500/30">
            <span className="text-2xl font-bold text-white">₹</span>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h2 id="auth-modal-title" className="font-extrabold text-xl text-white tracking-tight">
              PAISA<span className="text-indigo-400">.OS</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Auth Gateway
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Log in to manage your 30-day ₹10,000 budget and simulate your financial survival.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-5 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('demo');
              soundEffects.playClick();
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'demo'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Personas</span>
          </button>

          <button
            onClick={() => {
              setTab('custom');
              soundEffects.playClick();
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'custom'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Custom Sign In</span>
          </button>
        </div>

        {/* Tab 1: 1-Click Demo Personas (Ideal for Evaluators) */}
        {tab === 'demo' ? (
          <div className="space-y-2.5 mb-5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Choose a Demo Account:
            </span>

            {DEMO_USERS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => loginAsDemo(demo.id)}
                className="w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all flex items-center justify-between text-left group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={demo.avatar}
                    alt={demo.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                      {demo.name}
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        {demo.handle}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {demo.role} • {demo.campusOrCity}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Tab 2: Custom Sign In Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3 mb-5">
            <div>
              <label htmlFor="auth-custom-name" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  id="auth-custom-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryan Verma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus-ring"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-custom-email" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  id="auth-custom-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aryan@college.edu"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus-ring"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-custom-city" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                College Campus / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  id="auth-custom-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. BITS Pilani / Hyderabad"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus-ring"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 focus-ring"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In & Start Simulation</span>
            </button>
          </form>
        )}

        {/* Feature Badges Footer */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rent Shield</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulator</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Broke Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};
