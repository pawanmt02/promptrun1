import {
  Commitment,
  Subscription,
  SavingsGoal,
  Transaction,
  RiskLevel,
  HealthScoreBreakdown,
  SimulationResult,
  Category,
  Necessity
} from '../types/finance';

export const TOTAL_BUDGET = 10000;
export const TOTAL_DAYS = 30;

export function calculateTotalSpent(transactions: Transaction[]): number {
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
}

export function calculateTotalSavingsLocked(goals: SavingsGoal[]): number {
  return goals.reduce((sum, g) => sum + g.savedAmount, 0);
}

export function calculateTotalSavingsTarget(goals: SavingsGoal[]): number {
  return goals.reduce((sum, g) => sum + g.targetAmount, 0);
}

export function calculatePendingCommitments(commitments: Commitment[], currentDay: number): {
  total: number;
  upcomingList: Commitment[];
} {
  const upcoming = commitments.filter(c => !c.isPaid && c.dueDay >= currentDay);
  const total = upcoming.reduce((sum, c) => sum + c.amount, 0);
  return { total, upcomingList: upcoming };
}

export function calculatePendingSubscriptions(subscriptions: Subscription[], currentDay: number): {
  total: number;
  upcomingList: Subscription[];
} {
  const upcoming = subscriptions.filter(s => s.isActive && s.billingDay >= currentDay);
  const total = upcoming.reduce((sum, s) => sum + s.cost, 0);
  return { total, upcomingList: upcoming };
}

export function calculateLiquidBalance(
  totalBudget: number,
  totalSpent: number,
  savingsLocked: number
): number {
  return Math.max(0, totalBudget - totalSpent - savingsLocked);
}

export function calculateDailyAllowance(
  liquidBalance: number,
  pendingCommitments: number,
  pendingSubscriptions: number,
  currentDay: number,
  totalDays: number = TOTAL_DAYS
): number {
  const daysRemaining = Math.max(1, totalDays - currentDay + 1);
  const unencumberedPool = liquidBalance - pendingCommitments - pendingSubscriptions;
  
  if (unencumberedPool <= 0) return 0;
  return Math.floor(unencumberedPool / daysRemaining);
}

export function calculateRiskLevel(
  liquidBalance: number,
  dailyAllowance: number,
  pendingCommitments: number,
  daysRemaining: number
): { level: RiskLevel; scorePct: number; reason: string } {
  // Can we cover mandatory commitments?
  if (liquidBalance < pendingCommitments) {
    return {
      level: 'Critical',
      scorePct: 92,
      reason: `Deficit Alert: Cash (₹${liquidBalance.toLocaleString('en-IN')}) is less than upcoming commitments (₹${pendingCommitments.toLocaleString('en-IN')}). High default risk!`
    };
  }

  const runwayDays = dailyAllowance > 0 ? Math.floor(liquidBalance / Math.max(1, dailyAllowance)) : 0;
  if (runwayDays < daysRemaining && dailyAllowance <= 90) {
    return {
      level: 'Critical',
      scorePct: 88,
      reason: `Depletion Warning: At this burn rate, runway covers only ${runwayDays} of ${daysRemaining} remaining days.`
    };
  }

  // Daily allowance thresholds for ₹10k monthly budget
  if (dailyAllowance <= 75) {
    return {
      level: 'Critical',
      scorePct: 88,
      reason: `Barebones alert: Daily allowance is ₹${dailyAllowance}/day. You are on extreme survival mode!`
    };
  }

  if (dailyAllowance <= 160) {
    return {
      level: 'High',
      scorePct: 65,
      reason: `High Risk: Allowance is ₹${dailyAllowance}/day. Any unexpected bill will derail your month.`
    };
  }

  if (dailyAllowance <= 250) {
    return {
      level: 'Moderate',
      scorePct: 35,
      reason: `Moderate Risk: ₹${dailyAllowance}/day. Maintain discipline on food & social outings.`
    };
  }

  return {
    level: 'Minimal',
    scorePct: 12,
    reason: `Chill Zone: Healthy runway of ₹${dailyAllowance}/day with commitments covered.`
  };
}

export function calculateHealthScore(
  liquidBalance: number,
  pendingCommitments: number,
  totalBudget: number,
  transactions: Transaction[],
  goals: SavingsGoal[],
  currentDay: number,
  totalDays: number = TOTAL_DAYS
): HealthScoreBreakdown {
  // 1. Budget Discipline (0-25): actual spend vs linear baseline
  const expectedSpendRate = (currentDay / totalDays) * totalBudget;
  const actualSpend = calculateTotalSpent(transactions);
  let budgetScore = 25;
  if (actualSpend > expectedSpendRate) {
    const overspendRatio = (actualSpend - expectedSpendRate) / (totalBudget * 0.4);
    budgetScore = Math.max(5, Math.round(25 - overspendRatio * 20));
  } else {
    budgetScore = 25;
  }

  // 2. Bill / Commitment Coverage (0-25)
  let billCoverageScore = 25;
  if (pendingCommitments > 0) {
    const coverageRatio = liquidBalance / pendingCommitments;
    if (coverageRatio < 1) {
      billCoverageScore = Math.max(0, Math.round(coverageRatio * 15));
    } else if (coverageRatio < 1.3) {
      billCoverageScore = 20;
    } else {
      billCoverageScore = 25;
    }
  }

  // 3. Savings Discipline (0-25)
  const totalTarget = calculateTotalSavingsTarget(goals);
  const totalSaved = calculateTotalSavingsLocked(goals);
  let savingsScore = 15;
  if (totalTarget > 0) {
    const progress = totalSaved / totalTarget;
    savingsScore = Math.min(25, Math.round(progress * 25));
  }

  // 4. Impulse Control (0-25): Need vs Want spending ratio
  let impulseScore = 25;
  const discretionarySpend = transactions
    .filter(t => t.necessity === 'Want' || t.category === 'Guilt / Impulse')
    .reduce((sum, t) => sum + t.amount, 0);

  if (actualSpend > 0) {
    const discretionaryRatio = discretionarySpend / actualSpend;
    if (discretionaryRatio > 0.45) {
      impulseScore = Math.max(4, Math.round(25 - (discretionaryRatio - 0.45) * 40));
    } else {
      impulseScore = 25;
    }
  }

  const totalScore = Math.min(100, Math.max(10, budgetScore + billCoverageScore + savingsScore + impulseScore));

  let grade: HealthScoreBreakdown['grade'] = 'F';
  if (totalScore >= 90) grade = 'A+';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 55) grade = 'C';
  else if (totalScore >= 40) grade = 'D';

  let summary = 'Solid financial management. You are cruising comfortably!';
  if (totalScore < 45) {
    summary = 'Mayday! You are running dangerously low on funds. Trigger Broke Mode immediately!';
  } else if (totalScore < 65) {
    summary = 'Watch your daily burn rate. Discretionary expenses are hurting your savings.';
  } else if (totalScore < 80) {
    summary = 'Decent pacing. Keep commitments funded and limit late-night deliveries.';
  }

  return {
    score: totalScore,
    grade,
    budgetDiscipline: budgetScore,
    billCoverage: billCoverageScore,
    savingsProgress: savingsScore,
    impulseControl: impulseScore,
    summary
  };
}

export function generate30DayForecast(
  totalBudget: number,
  transactions: Transaction[],
  commitments: Commitment[],
  subscriptions: Subscription[],
  currentDay: number,
  totalDays: number = TOTAL_DAYS
): {
  day: number;
  actual?: number;
  conservative: number;
  currentPace: number;
  overspending: number;
  eventsCount: number;
}[] {
  const result = [];
  const spentByDay: Record<number, number> = {};
  
  transactions.forEach(t => {
    spentByDay[t.day] = (spentByDay[t.day] || 0) + t.amount;
  });

  // Calculate current running balance up to currentDay
  let runningBalance = totalBudget;
  const history: Record<number, number> = {};

  for (let d = 1; d <= currentDay; d++) {
    // subtract expenses logged on day d
    const daySpend = spentByDay[d] || 0;
    runningBalance -= daySpend;
    history[d] = Math.max(0, runningBalance);
  }

  const currentLiquid = runningBalance;
  const avgHistoricalDailyBurn = currentDay > 1 
    ? (totalBudget - currentLiquid) / currentDay 
    : 200;

  let conservativeRun = currentLiquid;
  let currentPaceRun = currentLiquid;
  let overspendRun = currentLiquid;

  for (let d = 1; d <= totalDays; d++) {
    const isPastOrToday = d <= currentDay;

    // Check scheduled obligations on this future day
    const dayCommitments = commitments.filter(c => !c.isPaid && c.dueDay === d).reduce((s, c) => s + c.amount, 0);
    const daySubs = subscriptions.filter(s => s.isActive && s.billingDay === d).reduce((s, sItem) => s + sItem.cost, 0);
    const fixedDue = dayCommitments + daySubs;

    if (isPastOrToday) {
      result.push({
        day: d,
        actual: history[d] ?? totalBudget,
        conservative: history[d] ?? totalBudget,
        currentPace: history[d] ?? totalBudget,
        overspending: history[d] ?? totalBudget,
        eventsCount: (spentByDay[d] ? 1 : 0) + (commitments.some(c => c.dueDay === d) ? 1 : 0)
      });
    } else {
      // Conservative: only 70% of historical burn + fixed
      conservativeRun = Math.max(0, conservativeRun - (avgHistoricalDailyBurn * 0.7 + fixedDue));
      
      // Current pace: normal burn + fixed
      currentPaceRun = Math.max(0, currentPaceRun - (avgHistoricalDailyBurn + fixedDue));
      
      // Overspending: 1.35x burn + fixed
      overspendRun = Math.max(0, overspendRun - (avgHistoricalDailyBurn * 1.35 + fixedDue));

      result.push({
        day: d,
        conservative: Math.round(conservativeRun),
        currentPace: Math.round(currentPaceRun),
        overspending: Math.round(overspendRun),
        eventsCount: (dayCommitments > 0 ? 1 : 0) + (daySubs > 0 ? 1 : 0)
      });
    }
  }

  return result;
}

export function simulateDecision(
  title: string,
  amount: number,
  category: Category,
  necessity: Necessity,
  totalBudget: number,
  transactions: Transaction[],
  commitments: Commitment[],
  subscriptions: Subscription[],
  goals: SavingsGoal[],
  currentDay: number,
  totalDays: number = TOTAL_DAYS
): SimulationResult {
  const currentTotalSpent = calculateTotalSpent(transactions);
  const currentLocked = calculateTotalSavingsLocked(goals);
  const currentBalance = calculateLiquidBalance(totalBudget, currentTotalSpent, currentLocked);

  const { total: pendingCommitments } = calculatePendingCommitments(commitments, currentDay);
  const { total: pendingSubscriptions } = calculatePendingSubscriptions(subscriptions, currentDay);

  const currentAllowance = calculateDailyAllowance(
    currentBalance,
    pendingCommitments,
    pendingSubscriptions,
    currentDay,
    totalDays
  );

  const { level: currentRisk } = calculateRiskLevel(
    currentBalance,
    currentAllowance,
    pendingCommitments,
    totalDays - currentDay + 1
  );

  const currentHealth = calculateHealthScore(
    currentBalance,
    pendingCommitments,
    totalBudget,
    transactions,
    goals,
    currentDay,
    totalDays
  );

  // Projected metrics
  const projectedBalance = Math.max(0, currentBalance - amount);
  const projectedAllowance = calculateDailyAllowance(
    projectedBalance,
    pendingCommitments,
    pendingSubscriptions,
    currentDay,
    totalDays
  );

  const { level: projectedRisk } = calculateRiskLevel(
    projectedBalance,
    projectedAllowance,
    pendingCommitments,
    totalDays - currentDay + 1
  );

  // Simulated transaction list
  const simTransactions: Transaction[] = [
    ...transactions,
    {
      id: 'sim_test',
      title,
      amount,
      category,
      necessity,
      day: currentDay,
      timestamp: new Date().toISOString()
    }
  ];

  const projectedHealth = calculateHealthScore(
    projectedBalance,
    pendingCommitments,
    totalBudget,
    simTransactions,
    goals,
    currentDay,
    totalDays
  );

  // Days to zero calculation
  const burnRate = Math.max(120, projectedAllowance > 0 ? projectedAllowance : 150);
  const daysPossible = Math.floor(projectedBalance / burnRate);
  const daysRemaining = totalDays - currentDay + 1;
  const daysToZero = daysPossible < daysRemaining ? currentDay + daysPossible : 'Survives';

  // Savings impact
  let savingsImpact = 'Savings goals remain protected.';
  if (projectedBalance < pendingCommitments) {
    savingsImpact = `⚠️ Warning: You will have to raid your savings goals to pay upcoming commitments!`;
  } else if (goals.some(g => g.savedAmount > 0 && projectedBalance < 500)) {
    savingsImpact = 'Cushion evaporated. Emergency fund at immediate risk of liquidation.';
  }

  // Gen Z Verdict & Recommendation
  let recommendation: SimulationResult['recommendation'] = 'Safe to buy';
  let verdict = '';

  const allowanceDrop = currentAllowance - projectedAllowance;

  if (projectedBalance < pendingCommitments) {
    recommendation = 'Bad idea / Broke Alert';
    verdict = `🚨 BROKE BEHAVIOR: Paying ₹${amount} leaves you short for upcoming rent/bills by ₹${(pendingCommitments - projectedBalance).toLocaleString('en-IN')}. Eviction speedrun!`;
  } else if (projectedAllowance < 90) {
    recommendation = 'Bad idea / Broke Alert';
    verdict = `💀 Survival Threat: Your daily food budget crashes to ₹${projectedAllowance}/day. That is 2 packets of Maggi and boiled water for the rest of the month.`;
  } else if (necessity === 'Want' && allowanceDrop > 60) {
    recommendation = 'Proceed with caution';
    verdict = `👀 Reality Check: Buying this chops ₹${allowanceDrop}/day from your daily allowance. If you can wait 2 weeks, do it then.`;
  } else if (necessity === 'Emergency') {
    recommendation = 'Proceed with caution';
    verdict = `🩹 Essential Hit: Unavoidable cost. Broke Mode recommendations will adjust to cushion this impact.`;
  } else {
    recommendation = 'Safe to buy';
    verdict = `✨ Certified Guilt-Free: Fits cleanly within your ₹${currentAllowance}/day allowance without endangering rent or savings goals.`;
  }

  return {
    title,
    amount,
    category,
    necessity,
    currentBalance,
    projectedBalance,
    currentDailyAllowance: currentAllowance,
    projectedDailyAllowance: projectedAllowance,
    currentRisk,
    projectedRisk,
    currentHealthScore: currentHealth.score,
    projectedHealthScore: projectedHealth.score,
    daysToZero,
    savingsImpact,
    verdict,
    recommendation
  };
}
