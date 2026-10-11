import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { SCENARIO_PRESETS } from '../data/initialData';
import {
  Calendar,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Wand2,
  LogIn,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentDay,
    totalDays,
    advanceDay,
    currentPresetId,
    loadPreset,
    isBrokeMode,
    toggleBrokeMode,
    soundEnabled,
    toggleSound,
    resetAllData,
    setIsSimulatorOpen,
    triggerRandomEvent
  } = useFinance();

  const {
    user,
    isAuthenticated,
    logout,
    openAuthModal
  } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#07080d]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              <span className="text-xl">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  PAISA<span className="text-indigo-400">.OS</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Gen Z Survival
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                ₹10,000 Budget • 30-Day Interconnected Financial Simulator
              </p>
            </div>
          </div>

          {/* Quick preset selector on mobile */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1 shadow-md shadow-indigo-600/30"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Simulate
            </button>
          </div>
        </div>

        {/* Center: Day Tracker & Next Day Controller */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-3 py-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-slate-400">Timeline:</span>
            <span className="font-mono font-bold text-white px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
              Day {currentDay} <span className="text-slate-500">/ {totalDays}</span>
            </span>
          </div>

          <div className="w-16 sm:w-24 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${(currentDay / totalDays) * 100}%` }}
            />
          </div>

          <button
            onClick={advanceDay}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all focus-ring"
            aria-label="Advance timeline to next day"
            title="Advance timeline to next day"
          >
            <span>+ Day</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Preset Selector */}
          <select
            value={currentPresetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus-ring cursor-pointer"
            aria-label="Select simulation scenario preset"
            title="Load realistic scenario presets"
          >
            {SCENARIO_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                Scenario: {p.name}
              </option>
            ))}
          </select>

          {/* Life Event Trigger (Tester) */}
          <button
            onClick={triggerRandomEvent}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors focus-ring"
            aria-label="Trigger unexpected life event"
            title="Trigger an unexpected life event"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event 🎲</span>
          </button>

          {/* Broke Mode Toggle */}
          <button
            onClick={toggleBrokeMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all focus-ring ${
              isBrokeMode
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-sm shadow-rose-900/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Toggle broke mode protocol"
            title="Toggle Broke / Survival Mode protocol"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${isBrokeMode ? 'text-rose-400 animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Broke Mode</span>
          </button>

          {/* What-If Simulator Trigger */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 active:scale-95 transition-all focus-ring"
            aria-label="Open what-if decision simulator"
            title="Open What-If Decision Sandbox"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-200" />
            <span>Simulator</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset All */}
          <button
            onClick={resetAllData}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Reset to Day 1 default state"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Auth: User Profile Pill or Login Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all text-xs"
                title="Account Settings & Logout"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-lg object-cover bg-slate-800 border border-slate-700"
                  />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 absolute -bottom-0.5 -right-0.5" />
                </div>
                <span className="font-semibold text-slate-200 hidden sm:inline max-w-[90px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl border border-slate-800 p-3 shadow-2xl shadow-black/80 z-50 text-xs animate-slide-up">
                  <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-slate-800">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover bg-slate-800 border border-slate-700"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                      <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                        {user.campusOrCity}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-slate-800/80 text-slate-300 hover:text-white text-left flex items-center gap-2 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Switch Account / Persona</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 text-left flex items-center gap-2 transition-colors font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
