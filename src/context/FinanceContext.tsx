/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Transaction,
  Commitment,
  Subscription,
  SavingsGoal,
  LifeEvent,
  RiskLevel,
  HealthScoreBreakdown,
  SimulationResult,
  Category,
  Necessity
} from '../types/finance';
import {
  TOTAL_BUDGET,
  TOTAL_DAYS,
  calculateTotalSpent,
  calculateTotalSavingsLocked,
  calculateLiquidBalance,
  calculatePendingCommitments,
  calculatePendingSubscriptions,
  calculateDailyAllowance,
  calculateRiskLevel,
  calculateHealthScore,
  simulateDecision
} from '../utils/financialEngine';
import {
  INITIAL_COMMITMENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS,
  LIFE_EVENTS_DECK,
  SCENARIO_PRESETS
} from '../data/initialData';
import { soundEffects } from '../utils/audio';

interface FinanceContextType {
  currentDay: number;
  totalBudget: number;
  totalDays: number;
  commitments: Commitment[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
  currentPresetId: string;
  isBrokeMode: boolean;
  soundEnabled: boolean;
  activeLifeEvent: LifeEvent | null;
  isSimulatorOpen: boolean;
  isMonthEndModalOpen: boolean;
  recentSimulations: SimulationResult[];

  // Computed values
  totalSpent: number;
  savingsLocked: number;
  liquidBalance: number;
  pendingCommitmentsTotal: number;
  upcomingCommitments: Commitment[];
  pendingSubscriptionsTotal: number;
  dailyAllowance: number;
  riskLevel: RiskLevel;
  riskScorePct: number;
  riskReason: string;
  healthScore: HealthScoreBreakdown;
  todaySpent: number;
  daysRemaining: number;

  // Actions
  advanceDay: () => void;
  jumpToDay: (day: number) => void;
  addTransaction: (tx: { title: string; amount: number; category: Category; necessity: Necessity }) => void;
  deleteTransaction: (id: string) => void;
  payCommitment: (id: string) => void;
  toggleSubscription: (id: string) => void;
  allocateToGoal: (goalId: string, deltaAmount: number) => boolean;
  resolveLifeEvent: (optionIndex: number) => void;
  dismissLifeEvent: () => void;
  triggerRandomEvent: () => void;
  toggleBrokeMode: () => void;
  toggleSound: () => void;
  loadPreset: (presetId: string) => void;
  resetAllData: () => void;
  setIsSimulatorOpen: (open: boolean) => void;
  setIsMonthEndModalOpen: (open: boolean) => void;
  runSimulation: (title: string, amount: number, category: Category, necessity: Necessity) => SimulationResult;
  applySimulationDecision: (simulation: SimulationResult) => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const STORAGE_KEY = 'paisa_finance_state_v1';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary State
  const [currentDay, setCurrentDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).currentDay ?? 4;
    } catch {}
    return 4;
  });

  const [totalBudget, setTotalBudget] = useState<number>(TOTAL_BUDGET);
  const [totalDays] = useState<number>(TOTAL_DAYS);

  const [commitments, setCommitments] = useState<Commitment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).commitments ?? INITIAL_COMMITMENTS;
    } catch {}
    return INITIAL_COMMITMENTS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).subscriptions ?? INITIAL_SUBSCRIPTIONS;
    } catch {}
    return INITIAL_SUBSCRIPTIONS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).savingsGoals ?? INITIAL_SAVINGS_GOALS;
    } catch {}
    return INITIAL_SAVINGS_GOALS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).transactions ?? INITIAL_TRANSACTIONS;
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [currentPresetId, setCurrentPresetId] = useState<string>('preset-standard');
  const [isBrokeMode, setIsBrokeMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(!soundEffects.getMuted());
  const [activeLifeEvent, setActiveLifeEvent] = useState<LifeEvent | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isMonthEndModalOpen, setIsMonthEndModalOpen] = useState<boolean>(false);
  const [recentSimulations, setRecentSimulations] = useState<SimulationResult[]>([]);

  // Save to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        currentDay,
        commitments,
        subscriptions,
        savingsGoals,
        transactions,
        currentPresetId,
        isBrokeMode
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {}
  }, [currentDay, commitments, subscriptions, savingsGoals, transactions, currentPresetId, isBrokeMode]);

  // Calculations
  const totalSpent = useMemo(() => calculateTotalSpent(transactions), [transactions]);
  const savingsLocked = useMemo(() => calculateTotalSavingsLocked(savingsGoals), [savingsGoals]);
  const liquidBalance = useMemo(
    () => calculateLiquidBalance(totalBudget, totalSpent, savingsLocked),
    [totalBudget, totalSpent, savingsLocked]
  );

  const { total: pendingCommitmentsTotal, upcomingList: upcomingCommitments } = useMemo(
    () => calculatePendingCommitments(commitments, currentDay),
    [commitments, currentDay]
  );

  const { total: pendingSubscriptionsTotal } = useMemo(
    () => calculatePendingSubscriptions(subscriptions, currentDay),
    [subscriptions, currentDay]
  );

  const daysRemaining = useMemo(() => Math.max(1, totalDays - currentDay + 1), [totalDays, currentDay]);

  const dailyAllowance = useMemo(
    () => calculateDailyAllowance(liquidBalance, pendingCommitmentsTotal, pendingSubscriptionsTotal, currentDay, totalDays),
    [liquidBalance, pendingCommitmentsTotal, pendingSubscriptionsTotal, currentDay, totalDays]
  );

  const { level: riskLevel, scorePct: riskScorePct, reason: riskReason } = useMemo(
    () => calculateRiskLevel(liquidBalance, dailyAllowance, pendingCommitmentsTotal, daysRemaining),
    [liquidBalance, dailyAllowance, pendingCommitmentsTotal, daysRemaining]
  );

  const healthScore = useMemo(
    () => calculateHealthScore(liquidBalance, pendingCommitmentsTotal, totalBudget, transactions, savingsGoals, currentDay, totalDays),
    [liquidBalance, pendingCommitmentsTotal, totalBudget, transactions, savingsGoals, currentDay, totalDays]
  );

  const todaySpent = useMemo(() => {
    return transactions
      .filter(t => t.day === currentDay)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentDay]);

  // Derive effective broke mode based on manual toggle or critical risk
  const isEffectiveBrokeMode = isBrokeMode || riskLevel === 'Critical' || (riskLevel === 'High' && dailyAllowance < 120);

  // Advance Day Handler
  const advanceDay = useCallback(() => {
    soundEffects.playClick();
    if (currentDay >= totalDays) {
      soundEffects.playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setIsMonthEndModalOpen(true);
      return;
    }

    const nextDay = currentDay + 1;
    setCurrentDay(nextDay);

    // Auto-charge active subscriptions due on nextDay
    const dueSubs = subscriptions.filter(s => s.isActive && s.billingDay === nextDay);
    if (dueSubs.length > 0) {
      dueSubs.forEach(s => {
        setTransactions(prev => [
          ...prev,
          {
            id: `sub_auto_${s.id}_day${nextDay}`,
            title: `Auto-Renew: ${s.name}`,
            amount: s.cost,
            category: 'Subscriptions',
            necessity: 'Need',
            day: nextDay,
            timestamp: new Date().toISOString()
          }
        ]);
      });
    }

    // Check if end of month reached
    if (nextDay >= totalDays) {
      soundEffects.playVictory();
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      setIsMonthEndModalOpen(true);
      return;
    }

    // Opportunity for surprise Life Event on specific milestone days if none active
    if (!activeLifeEvent && (nextDay === 7 || nextDay === 12 || nextDay === 18 || nextDay === 23 || nextDay === 27)) {
      const unusedEvents = LIFE_EVENTS_DECK;
      const randomEv = unusedEvents[Math.floor(Math.random() * unusedEvents.length)];
      setActiveLifeEvent(randomEv);
      soundEffects.playWarning();
    }
  }, [currentDay, totalDays, subscriptions, activeLifeEvent]);

  const jumpToDay = useCallback((targetDay: number) => {
    soundEffects.playClick();
    const clamped = Math.max(1, Math.min(totalDays, targetDay));
    setCurrentDay(clamped);
    if (clamped >= totalDays) {
      setIsMonthEndModalOpen(true);
    }
  }, [totalDays]);

  const addTransaction = useCallback((txData: { title: string; amount: number; category: Category; necessity: Necessity }) => {
    const newTx: Transaction = {
      id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 6),
      title: txData.title.trim() || 'Quick Expense',
      amount: Math.abs(txData.amount),
      category: txData.category,
      necessity: txData.necessity,
      day: currentDay,
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);

    if (txData.necessity === 'Want' || txData.category === 'Guilt / Impulse') {
      soundEffects.playWarning();
    } else {
      soundEffects.playClick();
    }
  }, [currentDay]);

  const deleteTransaction = useCallback((id: string) => {
    soundEffects.playClick();
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const payCommitment = useCallback((id: string) => {
    const commitment = commitments.find(c => c.id === id);
    if (!commitment || commitment.isPaid) return;

    soundEffects.playChaChing();

    // Mark paid
    setCommitments(prev => prev.map(c => c.id === id ? { ...c, isPaid: true } : c));

    // Log as transaction
    setTransactions(prev => [
      {
        id: `pay_comm_${commitment.id}_${Date.now()}`,
        title: `Paid Commitment: ${commitment.title}`,
        amount: commitment.amount,
        category: commitment.category,
        necessity: 'Need',
        day: currentDay,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  }, [commitments, currentDay]);

  const toggleSubscription = useCallback((id: string) => {
    soundEffects.playClick();
    setSubscriptions(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.isActive;
        if (!nextState) {
          // Play cha-ching when canceling a subscription!
          soundEffects.playChaChing();
        }
        return { ...s, isActive: nextState };
      }
      return s;
    }));
  }, []);

  const allocateToGoal = useCallback((goalId: string, deltaAmount: number): boolean => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (!goal) return false;

    if (deltaAmount > 0) {
      // Trying to add to savings - verify liquid cash is available
      if (liquidBalance < deltaAmount) {
        soundEffects.playWarning();
        return false;
      }
      const newSaved = Math.min(goal.targetAmount, goal.savedAmount + deltaAmount);
      setSavingsGoals(prev => prev.map(g => g.id === goalId ? { ...g, savedAmount: newSaved } : g));
      soundEffects.playChaChing();

      if (newSaved >= goal.targetAmount) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
      return true;
    } else {
      // Releasing savings back to liquid balance
      const withdraw = Math.min(goal.savedAmount, Math.abs(deltaAmount));
      setSavingsGoals(prev => prev.map(g => g.id === goalId ? { ...g, savedAmount: g.savedAmount - withdraw } : g));
      soundEffects.playClick();
      return true;
    }
  }, [savingsGoals, liquidBalance]);

  const resolveLifeEvent = useCallback((optionIndex: number) => {
    if (!activeLifeEvent || !activeLifeEvent.options || !activeLifeEvent.options[optionIndex]) return;
    const option = activeLifeEvent.options[optionIndex];

    if (option.cost > 0) {
      // Expense
      soundEffects.playWarning();
      setTransactions(prev => [
        {
          id: `le_opt_${Date.now()}`,
          title: `${activeLifeEvent.title} (${option.label})`,
          amount: option.cost,
          category: 'Emergency',
          necessity: 'Emergency',
          day: currentDay,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } else if (option.cost < 0) {
      // Windfall cash boost!
      soundEffects.playChaChing();
      const bonus = Math.abs(option.cost);
      setTotalBudget(prev => prev + bonus);
    } else {
      soundEffects.playClick();
    }

    setActiveLifeEvent(null);
  }, [activeLifeEvent, currentDay]);

  const dismissLifeEvent = useCallback(() => {
    soundEffects.playClick();
    setActiveLifeEvent(null);
  }, []);

  const triggerRandomEvent = useCallback(() => {
    const randomEv = LIFE_EVENTS_DECK[Math.floor(Math.random() * LIFE_EVENTS_DECK.length)];
    setActiveLifeEvent(randomEv);
    soundEffects.playWarning();
  }, []);

  const toggleBrokeMode = useCallback(() => {
    soundEffects.playClick();
    setIsBrokeMode(prev => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEffects.setMuted(!nextState);
    if (nextState) soundEffects.playClick();
  }, [soundEnabled]);

  const loadPreset = useCallback((presetId: string) => {
    soundEffects.playClick();
    const preset = SCENARIO_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setCurrentPresetId(presetId);
    setTotalBudget(preset.startingBudget);
    setCommitments(preset.commitments);
    setSubscriptions(preset.subscriptions);
    setSavingsGoals(preset.savingsGoals);
    setTransactions(preset.initialTransactions);
    setCurrentDay(preset.currentDay);
    setActiveLifeEvent(null);
  }, []);

  const resetAllData = useCallback(() => {
    soundEffects.playClick();
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPresetId('preset-standard');
    setTotalBudget(TOTAL_BUDGET);
    setCommitments(INITIAL_COMMITMENTS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrentDay(1);
    setIsBrokeMode(false);
    setActiveLifeEvent(null);
    setRecentSimulations([]);
  }, []);

  const runSimulation = useCallback((title: string, amount: number, category: Category, necessity: Necessity): SimulationResult => {
    const result = simulateDecision(
      title,
      amount,
      category,
      necessity,
      totalBudget,
      transactions,
      commitments,
      subscriptions,
      savingsGoals,
      currentDay,
      totalDays
    );

    setRecentSimulations(prev => [result, ...prev.slice(0, 4)]);
    return result;
  }, [totalBudget, transactions, commitments, subscriptions, savingsGoals, currentDay, totalDays]);

  const applySimulationDecision = useCallback((simulation: SimulationResult) => {
    addTransaction({
      title: simulation.title,
      amount: simulation.amount,
      category: simulation.category,
      necessity: simulation.necessity
    });
    setIsSimulatorOpen(false);
  }, [addTransaction]);

  return (
    <FinanceContext.Provider
      value={{
        currentDay,
        totalBudget,
        totalDays,
        commitments,
        subscriptions,
        savingsGoals,
        transactions,
        currentPresetId,
        isBrokeMode: isEffectiveBrokeMode,
        soundEnabled,
        activeLifeEvent,
        isSimulatorOpen,
        isMonthEndModalOpen,
        recentSimulations,
        totalSpent,
        savingsLocked,
        liquidBalance,
        pendingCommitmentsTotal,
        upcomingCommitments,
        pendingSubscriptionsTotal,
        dailyAllowance,
        riskLevel,
        riskScorePct,
        riskReason,
        healthScore,
        todaySpent,
        daysRemaining,
        advanceDay,
        jumpToDay,
        addTransaction,
        deleteTransaction,
        payCommitment,
        toggleSubscription,
        allocateToGoal,
        resolveLifeEvent,
        dismissLifeEvent,
        triggerRandomEvent,
        toggleBrokeMode,
        toggleSound,
        loadPreset,
        resetAllData,
        setIsSimulatorOpen,
        setIsMonthEndModalOpen,
        runSimulation,
        applySimulationDecision
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
