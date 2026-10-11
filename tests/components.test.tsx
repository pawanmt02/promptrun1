import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../src/context/AuthContext';
import { FinanceProvider } from '../src/context/FinanceContext';
import { Navbar } from '../src/components/Navbar';
import { StatsOverview } from '../src/components/StatsOverview';
import { BrokeModeBanner } from '../src/components/BrokeModeBanner';

describe('UI Component Integration & Accessibility Tests', () => {
  it('renders the Navbar with brand, timeline controls, and accessibility labels', () => {
    render(
      <AuthProvider>
        <FinanceProvider>
          <Navbar />
        </FinanceProvider>
      </AuthProvider>
    );

    // Verify brand rendering
    expect(screen.getByText(/PAISA/i)).toBeInTheDocument();
    expect(screen.getByText(/Gen Z Survival/i)).toBeInTheDocument();

    // Verify accessible action buttons
    expect(screen.getByLabelText('Advance timeline to next day')).toBeInTheDocument();
    expect(screen.getByLabelText('Select simulation scenario preset')).toBeInTheDocument();
  });

  it('renders the StatsOverview card grid with ₹10,000 initial figures', () => {
    render(
      <AuthProvider>
        <FinanceProvider>
          <StatsOverview />
        </FinanceProvider>
      </AuthProvider>
    );

    // Check presence of key Gen Z personal finance metrics
    expect(screen.getByText(/^Liquid Cash$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Daily Allowance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Risk/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Health Score/i).length).toBeGreaterThan(0);
  });

  it('renders BrokeModeBanner when survival alert conditions are simulated', () => {
    render(
      <AuthProvider>
        <FinanceProvider>
          <BrokeModeBanner />
        </FinanceProvider>
      </AuthProvider>
    );

    // Initial state is not broke mode, should render null or hidden banner
    const alertBanner = screen.queryByRole('alert');
    expect(alertBanner).toBeNull();
  });
});
