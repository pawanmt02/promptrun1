import React, { useState, useMemo, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';
import { generate30DayForecast } from '../utils/financialEngine';
import { TrendingDown, Calendar, AlertCircle, Sparkles } from 'lucide-react';

export const ForecastChart: React.FC = () => {
  const {
    totalBudget,
    transactions,
    commitments,
    subscriptions,
    currentDay,
    totalDays
  } = useFinance();

  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [activeScenario, setActiveScenario] = useState<'all' | 'current' | 'conservative' | 'overspending'>('all');

  const forecastData = useMemo(() => {
    return generate30DayForecast(
      totalBudget,
      transactions,
      commitments,
      subscriptions,
      currentDay,
      totalDays
    );
  }, [totalBudget, transactions, commitments, subscriptions, currentDay, totalDays]);

  // SVG Chart Geometry
  const width = 800;
  const height = 240;
  const paddingX = 45;
  const paddingY = 25;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const maxVal = totalBudget;

  const getX = useCallback(
    (day: number) => paddingX + ((day - 1) / (totalDays - 1)) * chartW,
    [chartW, totalDays]
  );
  const getY = useCallback(
    (val: number) => paddingY + chartH - (Math.max(0, Math.min(maxVal, val)) / maxVal) * chartH,
    [chartH, maxVal]
  );

  // Build SVG Paths
  const actualPath = useMemo(() => {
    const pts = forecastData
      .filter((d) => d.day <= currentDay && d.actual !== undefined)
      .map((d) => `${getX(d.day)},${getY(d.actual!)}`);
    return pts.length > 0 ? `M ${pts.join(' L ')}` : '';
  }, [forecastData, currentDay, getX, getY]);

  const conservativePath = useMemo(() => {
    const pts = forecastData.map((d) => `${getX(d.day)},${getY(d.conservative)}`);
    return `M ${pts.join(' L ')}`;
  }, [forecastData, getX, getY]);

  const currentPacePath = useMemo(() => {
    const pts = forecastData.map((d) => `${getX(d.day)},${getY(d.currentPace)}`);
    return `M ${pts.join(' L ')}`;
  }, [forecastData, getX, getY]);

  const overspendPath = useMemo(() => {
    const pts = forecastData.map((d) => `${getX(d.day)},${getY(d.overspending)}`);
    return `M ${pts.join(' L ')}`;
  }, [forecastData, getX, getY]);

  // Find projected broke day under current pace
  const brokeDay = useMemo(() => {
    const item = forecastData.find((d) => d.day > currentDay && d.currentPace <= 0);
    return item ? item.day : null;
  }, [forecastData, currentDay]);

  const hoveredItem = hoveredDay ? forecastData.find((d) => d.day === hoveredDay) : null;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-indigo-400" />
              30-Day Monthly Forecast & Cashflow
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Trajectory Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time projection across 3 burn scenarios based on commitments and spending pace.
          </p>
        </div>

        {/* Legend / Scenarios toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveScenario('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeScenario === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Models
          </button>
          <button
            onClick={() => setActiveScenario('current')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeScenario === 'current' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Current Pace
          </button>
          <button
            onClick={() => setActiveScenario('conservative')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeScenario === 'conservative' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Disciplined
          </button>
          <button
            onClick={() => setActiveScenario('overspending')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeScenario === 'overspending' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Impulsive
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] bg-slate-950/70 rounded-2xl border border-slate-900 overflow-hidden p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair overflow-visible select-none"
          onMouseLeave={() => setHoveredDay(null)}
        >
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 2500, 5000, 7500, 10000].map((tick) => (
            <g key={tick}>
              <line
                x1={paddingX}
                y1={getY(tick)}
                x2={width - paddingX}
                y2={getY(tick)}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={getY(tick) + 3}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                ₹{tick / 1000}k
              </text>
            </g>
          ))}

          {/* Broke line threshold (₹0) */}
          <line
            x1={paddingX}
            y1={getY(0)}
            x2={width - paddingX}
            y2={getY(0)}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Current Day vertical separator line */}
          <line
            x1={getX(currentDay)}
            y1={paddingY}
            x2={getX(currentDay)}
            y2={height - paddingY}
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <text
            x={getX(currentDay)}
            y={paddingY - 6}
            fill="#a5b4fc"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
            fontWeight="bold"
          >
            Today (Day {currentDay})
          </text>

          {/* Future Projected Lines */}
          {(activeScenario === 'all' || activeScenario === 'conservative') && (
            <path
              d={conservativePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5 3"
              opacity="0.8"
            />
          )}

          {(activeScenario === 'all' || activeScenario === 'overspending') && (
            <path
              d={overspendPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          )}

          {(activeScenario === 'all' || activeScenario === 'current') && (
            <path
              d={currentPacePath}
              fill="none"
              stroke="#c084fc"
              strokeWidth="2.5"
            />
          )}

          {/* Historical Actual Line */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Data Points on historical track */}
          {forecastData
            .filter((d) => d.day <= currentDay && d.actual !== undefined)
            .map((d) => (
              <circle
                key={d.day}
                cx={getX(d.day)}
                cy={getY(d.actual!)}
                r={d.day === currentDay ? '5' : '3'}
                fill={d.day === currentDay ? '#a855f7' : '#6366f1'}
                stroke="#090a0f"
                strokeWidth="2"
              />
            ))}

          {/* Interactive Hover Hit Zones */}
          {forecastData.map((d) => (
            <rect
              key={d.day}
              x={getX(d.day) - chartW / (totalDays * 2)}
              y={paddingY}
              width={chartW / totalDays}
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredDay(d.day)}
            />
          ))}

          {/* Hover Crosshair */}
          {hoveredDay && (
            <g>
              <line
                x1={getX(hoveredDay)}
                y1={paddingY}
                x2={getX(hoveredDay)}
                y2={height - paddingY}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {hoveredItem && (
                <circle
                  cx={getX(hoveredDay)}
                  cy={getY(hoveredItem.day <= currentDay ? (hoveredItem.actual ?? hoveredItem.currentPace) : hoveredItem.currentPace)}
                  r="6"
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                />
              )}
            </g>
          )}

          {/* Day markers along X axis */}
          {[1, 5, 10, 15, 20, 25, 30].map((d) => (
            <text
              key={d}
              x={getX(d)}
              y={height - paddingY + 16}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              D{d}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredItem && (
          <div
            className="absolute top-3 right-3 sm:right-6 bg-slate-900/95 border border-indigo-500/40 p-2.5 rounded-xl shadow-xl text-xs pointer-events-none backdrop-blur-md z-10 font-mono"
          >
            <div className="font-bold text-white flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Day {hoveredItem.day} of 30
            </div>
            {hoveredItem.day <= currentDay ? (
              <div className="text-indigo-300">
                Actual Cash: <strong>₹{hoveredItem.actual?.toLocaleString('en-IN')}</strong>
              </div>
            ) : (
              <div className="space-y-0.5 text-[11px]">
                <div className="text-purple-300">
                  Current Pace: <strong>₹{hoveredItem.currentPace.toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-emerald-400">
                  Disciplined: ₹{hoveredItem.conservative.toLocaleString('en-IN')}
                </div>
                <div className="text-rose-400">
                  Impulsive: ₹{hoveredItem.overspending.toLocaleString('en-IN')}
                </div>
              </div>
            )}
            {hoveredItem.eventsCount > 0 && (
              <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-amber-300">
                ⚠️ Scheduled bills due on this day
              </div>
            )}
          </div>
        )}
      </div>

      {/* Projection Summary Pill */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {brokeDay ? (
            <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              Depletion Alert: At current burn, balance drops to ₹0 on{' '}
              <strong className="font-bold underline">Day {brokeDay}</strong>!
            </span>
          ) : (
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Survival Projected: You will survive Day 30 with surplus cash.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Actual
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Current Pace
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Disciplined
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Impulsive
          </span>
        </div>
      </div>
    </div>
  );
};
