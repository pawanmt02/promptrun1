import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { BrokeModeBanner } from './components/BrokeModeBanner';
import { StatsOverview } from './components/StatsOverview';
import { ForecastChart } from './components/ForecastChart';
import { ExpenseTracker } from './components/ExpenseTracker';
import { CommitmentsManager } from './components/CommitmentsManager';
import { SubscriptionsManager } from './components/SubscriptionsManager';
import { SavingsGoalsManager } from './components/SavingsGoalsManager';
import { CalendarView } from './components/CalendarView';
import { SurvivalCoach } from './components/SurvivalCoach';
import { SimulatorModal } from './components/SimulatorModal';
import { LifeEventsDrawer } from './components/LifeEventsDrawer';
import { MonthEndModal } from './components/MonthEndModal';
import { AuthModal } from './components/AuthModal';

function MainApp() {
  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation with Auth profile & controls */}
      <Navbar />

      {/* Broke Mode Alert Protocol */}
      <BrokeModeBanner />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* 1. Hero KPI Stat Cards */}
        <StatsOverview />

        {/* 2. 30-Day Monthly Forecast & Cashflow Projection */}
        <ForecastChart />

        {/* 3. Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Daily Spending & 30-Day Calendar (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ExpenseTracker />
            <CalendarView />
          </div>

          {/* Right Column: Commitments, Subscriptions, Goals & Coach (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <CommitmentsManager />
            <SubscriptionsManager />
            <SavingsGoalsManager />
            <SurvivalCoach />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight">PAISA.OS</span>
            <span>•</span>
            <span>Broke But Functional — Survive the Month</span>
          </div>
          <div>
            Built for <strong className="text-slate-400">Prompt Run 2026</strong> • Fully Interactive Gen Z Financial Simulator
          </div>
        </div>
      </footer>

      {/* Interactive Modals and Drawers */}
      <SimulatorModal />
      <LifeEventsDrawer />
      <MonthEndModal />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MainApp />
      </FinanceProvider>
    </AuthProvider>
  );
}
