import { describe, it, expect } from 'vitest';
import {
  calculateDailyAllowance,
  calculateRiskLevel,
  calculateHealthScore,
  calculateLiquidBalance,
  calculateTotalSpent,
  calculateTotalSavingsLocked,
  calculatePendingCommitments,
  calculatePendingSubscriptions,
  generate30DayForecast,
  simulateDecision,
  TOTAL_BUDGET
} from '../src/utils/financialEngine';
import {
  INITIAL_COMMITMENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS
} from '../src/data/initialData';

describe('Financial Engine Core Calculation Tests', () => {
  it('correctly calculates safe daily allowance accounting for commitments and subscriptions', () => {
    // ₹6,000 liquid - ₹2,000 commitments - ₹500 subscriptions = ₹3,500 unencumbered
    // Over 10 days remaining (day 21 of 30) = ₹350/day
    const allowance = calculateDailyAllowance(6000, 2000, 500, 21, 30);
    expect(allowance).toBe(350);
  });

  it('returns 0 daily allowance when commitments exceed liquid balance', () => {
    // When commitments exceed liquid cash, discretionary daily budget must be zero
    const allowance = calculateDailyAllowance(1500, 2000, 300, 15, 30);
    expect(allowance).toBe(0);
  });

  it('calculates liquid balance accurately', () => {
    const balance = calculateLiquidBalance(TOTAL_BUDGET, 2500, 1500);
    expect(balance).toBe(6000);
  });

  it('determines risk level dynamically across key financial thresholds', () => {
    // Critical: Cash less than pending commitments
    const critDeficit = calculateRiskLevel(1000, 100, 2500, 20);
    expect(critDeficit.level).toBe('Critical');

    // Critical: Daily allowance is barebones <= ₹75
    const critAllowance = calculateRiskLevel(3000, 60, 500, 20);
    expect(critAllowance.level).toBe('Critical');

    // High Risk: ₹76 - ₹160
    const highRisk = calculateRiskLevel(4000, 120, 500, 20);
    expect(highRisk.level).toBe('High');

    // Moderate Risk: ₹161 - ₹250
    const modRisk = calculateRiskLevel(5000, 200, 500, 20);
    expect(modRisk.level).toBe('Moderate');

    // Minimal Risk: > ₹250
    const minRisk = calculateRiskLevel(7000, 300, 500, 20);
    expect(minRisk.level).toBe('Minimal');
  });

  it('calculates aggregate metrics and health score', () => {
    const totalSpent = calculateTotalSpent(INITIAL_TRANSACTIONS);
    expect(totalSpent).toBeGreaterThan(0);

    const locked = calculateTotalSavingsLocked(INITIAL_SAVINGS_GOALS);
    expect(locked).toBeGreaterThan(0);

    const pendingComm = calculatePendingCommitments(INITIAL_COMMITMENTS, 5);
    expect(pendingComm.total).toBeGreaterThan(0);

    const pendingSubs = calculatePendingSubscriptions(INITIAL_SUBSCRIPTIONS, 5);
    expect(pendingSubs.total).toBeGreaterThan(0);

    const health = calculateHealthScore(
      6000,
      2500,
      TOTAL_BUDGET,
      INITIAL_TRANSACTIONS,
      INITIAL_SAVINGS_GOALS,
      5,
      30
    );

    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
    expect(['A+', 'A', 'B', 'C', 'D', 'F']).toContain(health.grade);
    expect(health.budgetDiscipline).toBeDefined();
    expect(health.billCoverage).toBeDefined();
    expect(health.savingsProgress).toBeDefined();
    expect(health.impulseControl).toBeDefined();
  });

  it('accurately simulates what-if decision and calculates delta impacts', () => {
    const sim = simulateDecision(
      'Weekend Roadtrip',
      1200,
      'Commute & Travel',
      'Want',
      TOTAL_BUDGET,
      INITIAL_TRANSACTIONS,
      INITIAL_COMMITMENTS,
      INITIAL_SUBSCRIPTIONS,
      INITIAL_SAVINGS_GOALS,
      5,
      30
    );

    expect(sim.projectedBalance).toBeLessThan(sim.currentBalance);
    expect(sim.projectedDailyAllowance).toBeLessThanOrEqual(sim.currentDailyAllowance);
    expect(sim.verdict).toBeDefined();
    expect(sim.recommendation).toBeDefined();
  });

  it('generates 30-day forecast curves with valid numbers', () => {
    const forecast = generate30DayForecast(
      TOTAL_BUDGET,
      INITIAL_TRANSACTIONS,
      INITIAL_COMMITMENTS,
      INITIAL_SUBSCRIPTIONS,
      5,
      30
    );

    expect(forecast).toHaveLength(30);
    expect(forecast[0].day).toBe(1);
    expect(forecast[29].day).toBe(30);
    expect(typeof forecast[15].conservative).toBe('number');
    expect(typeof forecast[15].currentPace).toBe('number');
    expect(typeof forecast[15].overspending).toBe('number');
  });
});
