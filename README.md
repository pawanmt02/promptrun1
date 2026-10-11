# 💸 PAISA.OS — Broke But Functional (Survive the Month)
### Prompt Run 2026 Hackathon | Web Development Vibe Coding Challenge

> A modern, interactive personal finance experience designed specifically for Gen Z to manage a limited **₹10,000 budget over 30 days**, simulate financial decisions before taking them, and make informed choices in a high-consequence interconnected economic sandbox.

---

## 🌟 The Challenge & Problem Statement
* **Challenge Track**: *Broke But Functional — Survive the Month*
* **Core Problem**: Gen Z users on tight monthly allowances (e.g., college hostellers, interns, freshers) often struggle because standard expense trackers merely record past spending after the damage is already done.
* **Our Solution**: **PAISA.OS** connects income, liquid cash, fixed commitments, savings goals, recurring subscriptions, random life emergencies, financial risk, and financial health into a real-time reactive simulation. Every single spending choice has immediate, transparent consequences on runway, daily allowance, bill default risk, and month-end survival.

---

## 🚀 Key Features & Interconnected Architecture

### 1. 🧮 Pure Interconnected Financial Engine
* **₹10,000 Baseline Budget over 30 Days**: Tracks starting liquidity and real-time balance.
* **Dynamic Safe Daily Allowance**: 
  $$\text{Daily Allowance} = \frac{\text{Liquid Cash} - \text{Pending Mandatory Commitments} - \text{Pending Subscriptions}}{\text{Days Remaining}}$$
  Adjusts dynamically every time an expense is logged or days are advanced.
* **Commitment Shield (Rent & Bills Protection)**:
  Protects fixed non-negotiables (PG rent, Wi-Fi, mess fee, tuition) so users cannot accidentally spend rent money on impulse cravings.
* **Subscription Audit & Boost Calculator**:
  Tracks recurring drains (Spotify, Netflix, YouTube, iCloud). Toggling or pausing a subscription instantly recalculates future obligations and boosts your daily cash allowance!
* **Savings Targets & Resilience Cushion**:
  Lock liquid money into specific goals (Emergency Cushion, Concert Ticket, Gadgets). Warns if an impulse purchase will force the liquidation of an emergency cushion.

---

### 2. 🔮 "What-If" Decision Simulator (Interactive Sandbox)
Before making ANY purchase, open the **Simulator Modal** to preview the exact ripple effect:
* **Side-by-Side Impact Matrix**:
  * Liquid Balance: Before vs After (Exact ₹ delta)
  * Daily Allowance: Before vs After (e.g., drops by ₹50/day)
  * Risk Exposure: Chill $\rightarrow$ High
  * Health Score: 84 $\rightarrow$ 68 (-16 pts)
  * Runway / Days to Zero: "Survives Month" vs "Goes broke on Day 21"
  * Savings Goal Threat: Detects if emergency reserves will be breached
* **AI Wingman Verdict**:
  Generates witty, blunt Gen Z reality checks (e.g., *"Buying these sneakers drops your daily food budget to 2 packets of Maggi for the next 18 days. Eviction speedrun!"*).
* **Two Choices**:
  * **"Apply Decision to Budget"**: Commits transaction directly.
  * **"Nah, Resisting FOMO"**: Discards with zero budget impact.

---

### 3. 📈 30-Day Monthly Forecast & Trajectory Engine
* **Interactive SVG Cashflow Chart**:
  * **Historical Actual Line**: Tracks actual cash balance up to current day.
  * **Conservative Scenario**: Disciplined spending pacing with buffer.
  * **Current Pace Scenario**: Dynamic burn projection based on historical velocity.
  * **Impulsive / High Risk Scenario**: 1.35x burn rate simulating spending temptations.
  * **Broke Threshold ($₹0$)**: Highlights the exact day cash drops to zero.
  * **Hover Crosshair**: Displays projected balance and upcoming scheduled bills for any day.

---

### 4. 📅 30-Day Financial Horizon Grid
* Day-by-day interactive month calendar (Days 1 to 30).
* Highlights the current timeline day, days with mandatory commitments due, and days with auto-renewing subscriptions.
* Tap any day to inspect historical spends or preview upcoming scheduled debits.
* Timeline controller with "+ Day" advance and timeline jump capabilities.

---

### 5. 🚨 Broke Mode Protocol & Tactical Survival Hacks
* Automatically triggers when Financial Risk reaches **Critical** or daily allowance falls below **₹120/day**.
* Neon warning banner locking down discretionary "Want" recommendations.
* **Gen Z Survival Tactics**:
  * *The 20-Minute Craving Rule* (drink water, delay midnight delivery).
  * *Campus/Hostel Wi-Fi Hoarding* (download media on free Wi-Fi).
  * *Metro/Bus Transit Pass* (cut commute cost by 65%).
  * *Subscription Shadow Audit* (pause streaming during exams).
  * *Chai Tapri vs Fancy Cafe* (save ₹300 per meetup).

---

### 6. 🎲 "Life Happens" Unexpected Events Deck
Simulates realistic random Gen Z financial shocks and windfalls:
* *Laptop Charger Burnout* (Buy OEM, buy cheap duplicate, or borrow).
* *Bestie's Surprise Rooftop Birthday* (Go all out, order iced tea only, or stay home).
* *Side-Hustle Design Gig Windfall* (+₹1,500 bonus cash!).
* *Monsoon Auto Surge Nightmare* (Pay 3x surge or wait it out with chai).
* *Flash 50% Off Sneaker Sale* (Resist FOMO vs YOLO splurge).
* *Sudden Wisdom Tooth / Flu* (Pharmacy meds vs campus clinic).

---

### 7. 🏆 Month-End Evaluation & Brag Receipt Card
* Triggers at Day 30 or upon completing the month.
* Generates a final report card:
  * Outcome: Survived Month with Surplus vs Depleted
  * Final Health Grade (A+, A, B, C, D, F)
  * Liquid Cash Left, Total Saved, Total Spent
  * Badges unlocked (*Rent Shield Defender*, *Subscription Slayer*, *FOMO Champ*)
  * **1-Click Copy Brag Receipt** formatted for sharing on social media.

---

## 🛠️ Tech Stack & Implementation Quality
* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS v4 with custom dark-mode glassmorphism and neon glows
* **Icons**: Lucide React
* **Micro-interactions & Audio**: Custom Web Audio API synthesizer (no external asset dependencies; works 100% offline)
* **Celebration FX**: Canvas Confetti
* **State Management & Persistence**: React Context + LocalStorage persistence engine
* **Code Quality**: 0 errors, 0 warnings across Oxlint & TypeScript

---

## 🏃 Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd PromptRun
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build & Linting
```bash
npm run lint    # Verifies 0 linter errors
npm run build   # Produces optimized production bundle in dist/
npm run preview # Previews the production bundle
```

---

## 🎯 Evaluator Quick-Test Guide (FAIE Optimization)
1. **Explore the 4 Scenario Presets** in the top navbar (*Hostel Survivor*, *Side-Hustle Fresher*, *Impulse Danger Zone*, *Frugal Master Monk*).
2. **Launch the What-If Simulator** by clicking the **"Simulator"** button. Choose a preset like *"Concert Ticket (₹1,500)"* and observe the live side-by-side delta on balance, allowance, risk, and health score. Click *"Apply"* or *"Discard"*.
3. **Advance the Timeline** using the **"+ Day"** button. Watch subscriptions auto-debit on renewal days and witness random life events trigger.
4. **Trigger an Unexpected Life Event** manually at any time by clicking the **"Event 🎲"** button in the header.
5. **Pause a Subscription** in the Subscriptions card and observe the immediate `+₹/day` boost to your daily allowance.
6. **Allocate Cash to a Savings Goal** and watch your locked reserves and health score climb.
7. **Toggle "Broke Mode"** to experience the survival dashboard protocol.
8. **Advance to Day 30** to view the celebratory victory report card and copy the receipt!
