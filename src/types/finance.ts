export type Category = 
  | 'Food & Chai'
  | 'Rent & Stay'
  | 'Commute & Travel'
  | 'Bills & Utilities'
  | 'Subscriptions'
  | 'Social & Outings'
  | 'Study & Gear'
  | 'Emergency'
  | 'Guilt / Impulse';

export type Necessity = 'Need' | 'Want' | 'Emergency';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: Category;
  necessity: Necessity;
  day: number;
  timestamp: string;
  isSimulated?: boolean;
}

export interface Commitment {
  id: string;
  title: string;
  amount: number;
  dueDay: number;
  isPaid: boolean;
  category: Category;
  criticality: 'Mandatory' | 'High' | 'Flexible';
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingDay: number;
  isActive: boolean;
  iconName: string;
  category: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  priority: 'High' | 'Medium' | 'Low';
  targetDay: number;
  icon: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  type: 'Expense' | 'Windfall' | 'Dilemma';
  impactAmount: number;
  options?: {
    label: string;
    cost: number;
    impactDescription: string;
    healthScoreDelta: number;
  }[];
}

export type RiskLevel = 'Minimal' | 'Moderate' | 'High' | 'Critical';

export interface HealthScoreBreakdown {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  budgetDiscipline: number; // 0 - 25
  billCoverage: number; // 0 - 25
  savingsProgress: number; // 0 - 25
  impulseControl: number; // 0 - 25
  summary: string;
}

export interface SimulationResult {
  title: string;
  amount: number;
  category: Category;
  necessity: Necessity;
  currentBalance: number;
  projectedBalance: number;
  currentDailyAllowance: number;
  projectedDailyAllowance: number;
  currentRisk: RiskLevel;
  projectedRisk: RiskLevel;
  currentHealthScore: number;
  projectedHealthScore: number;
  daysToZero: number | 'Survives';
  savingsImpact: string;
  verdict: string;
  recommendation: 'Safe to buy' | 'Proceed with caution' | 'Bad idea / Broke Alert';
}

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  startingBudget: number;
  commitments: Commitment[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  initialTransactions: Transaction[];
  currentDay: number;
}
