import {
  Commitment,
  Subscription,
  SavingsGoal,
  Transaction,
  LifeEvent,
  ScenarioPreset
} from '../types/finance';

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: 'c1',
    title: 'PG Room / Flat Share',
    amount: 3500,
    dueDay: 5,
    isPaid: false,
    category: 'Rent & Stay',
    criticality: 'Mandatory'
  },
  {
    id: 'c2',
    title: 'Wi-Fi & Mobile Recharge',
    amount: 499,
    dueDay: 10,
    isPaid: false,
    category: 'Bills & Utilities',
    criticality: 'Mandatory'
  },
  {
    id: 'c3',
    title: 'Tiffin / Mess Advance',
    amount: 1200,
    dueDay: 15,
    isPaid: false,
    category: 'Food & Chai',
    criticality: 'High'
  },
  {
    id: 'c4',
    title: 'Course Lab Material / Books',
    amount: 450,
    dueDay: 22,
    isPaid: false,
    category: 'Study & Gear',
    criticality: 'Flexible'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 's1',
    name: 'Spotify Premium (Student)',
    cost: 59,
    billingDay: 8,
    isActive: true,
    iconName: 'music',
    category: 'Entertainment'
  },
  {
    id: 's2',
    name: 'Netflix Mobile Screen',
    cost: 149,
    billingDay: 14,
    isActive: true,
    iconName: 'tv',
    category: 'Streaming'
  },
  {
    id: 's3',
    name: 'YouTube Premium',
    cost: 129,
    billingDay: 19,
    isActive: true,
    iconName: 'youtube',
    category: 'Streaming'
  },
  {
    id: 's4',
    name: 'iCloud / Drive 50GB',
    cost: 75,
    billingDay: 25,
    isActive: true,
    iconName: 'cloud',
    category: 'Cloud'
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'g1',
    title: 'Emergency Cushion Buffer',
    targetAmount: 1000,
    savedAmount: 600,
    priority: 'High',
    targetDay: 30,
    icon: 'shield-alert'
  },
  {
    id: 'g2',
    title: 'Weekend Concert / Goa Plan',
    targetAmount: 1500,
    savedAmount: 400,
    priority: 'Medium',
    targetDay: 28,
    icon: 'ticket'
  },
  {
    id: 'g3',
    title: 'ANC Wireless Earbuds',
    targetAmount: 1200,
    savedAmount: 200,
    priority: 'Low',
    targetDay: 30,
    icon: 'headphones'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: 'Tapri Chai & Bun Maska with Friends',
    amount: 75,
    category: 'Food & Chai',
    necessity: 'Want',
    day: 1,
    timestamp: '2026-10-01T11:00:00Z'
  },
  {
    id: 't2',
    title: 'Metro Smart Card Top-up',
    amount: 250,
    category: 'Commute & Travel',
    necessity: 'Need',
    day: 1,
    timestamp: '2026-10-01T16:30:00Z'
  },
  {
    id: 't3',
    title: 'Quick Groceries (Bread, Milk, Maggi)',
    amount: 210,
    category: 'Food & Chai',
    necessity: 'Need',
    day: 2,
    timestamp: '2026-10-02T19:15:00Z'
  },
  {
    id: 't4',
    title: 'Printouts & Assignment Spiral Bind',
    amount: 110,
    category: 'Study & Gear',
    necessity: 'Need',
    day: 3,
    timestamp: '2026-10-03T14:20:00Z'
  },
  {
    id: 't5',
    title: 'Late Night Swiggy Biryani Craving',
    amount: 380,
    category: 'Guilt / Impulse',
    necessity: 'Want',
    day: 3,
    timestamp: '2026-10-03T23:45:00Z'
  }
];

export const LIFE_EVENTS_DECK: LifeEvent[] = [
  {
    id: 'le1',
    title: '⚡ Laptop Charger Burnout!',
    description: 'Your OEM laptop charger spark-plug blew up while working on a project deadline.',
    type: 'Expense',
    impactAmount: 850,
    options: [
      {
        label: 'Buy official reliable replacement (-₹850)',
        cost: 850,
        impactDescription: 'Safe gear, zero risk of motherboard fire.',
        healthScoreDelta: -4
      },
      {
        label: 'Buy cheap duplicate at Nehru Place / Lamington (-₹350)',
        cost: 350,
        impactDescription: 'Saves ₹500, but high anxiety of sparking.',
        healthScoreDelta: -1
      },
      {
        label: 'Borrow friend’s charger during their night shift (₹0)',
        cost: 0,
        impactDescription: 'Zero cash spent! Supreme resourcefulness.',
        healthScoreDelta: 4
      }
    ]
  },
  {
    id: 'le2',
    title: '🎂 Bestie’s Surprise Rooftop Birthday',
    description: 'The whole college squad booked a table. Group split is expected.',
    type: 'Dilemma',
    impactAmount: 600,
    options: [
      {
        label: 'Go all out with group split (-₹600)',
        cost: 600,
        impactDescription: 'Maximum vibe, major hit to your daily allowance.',
        healthScoreDelta: -6
      },
      {
        label: 'Eat before leaving, drink iced tea only (-₹200)',
        cost: 200,
        impactDescription: 'Present for the birthday boy, saved ₹400!',
        healthScoreDelta: 2
      },
      {
        label: 'Fake an exam headache and send wholesome meme (₹0)',
        cost: 0,
        impactDescription: 'Financial safety maintained, social guilt high.',
        healthScoreDelta: 3
      }
    ]
  },
  {
    id: 'le3',
    title: '🚀 Side-Hustle Design Gig Windfall!',
    description: 'A junior batchmate’s startup paid you for redesigning their landing page pitch deck!',
    type: 'Windfall',
    impactAmount: 1500,
    options: [
      {
        label: 'Deposit directly into Emergency Savings (+₹1,500)',
        cost: -1500,
        impactDescription: 'Instant financial armor! Health score jumps.',
        healthScoreDelta: 10
      },
      {
        label: 'Add to liquid cash balance (+₹1,500)',
        cost: -1500,
        impactDescription: 'Expands your daily allowance by ~₹60/day.',
        healthScoreDelta: 8
      }
    ]
  },
  {
    id: 'le4',
    title: '🌧️ Monsoon Auto Surge Nightmare',
    description: 'It poured torrential rain. Metro station is 3.5 km away and autos are demanding 3x surge.',
    type: 'Expense',
    impactAmount: 260,
    options: [
      {
        label: 'Book surge auto (-₹260)',
        cost: 260,
        impactDescription: 'Stay dry and arrive on time.',
        healthScoreDelta: -2
      },
      {
        label: 'Wait out rain with ₹20 chai & take crowded bus (-₹35)',
        cost: 35,
        impactDescription: 'Saved ₹225 like a certified street veteran.',
        healthScoreDelta: 3
      }
    ]
  },
  {
    id: 'le5',
    title: '🛍️ Flash 50% Off Sneaker Sale Alert',
    description: 'The sneakers sitting in your wishlist just hit lightning clearance for ₹1,299!',
    type: 'Dilemma',
    impactAmount: 1299,
    options: [
      {
        label: 'Impulse buy now! YOLO (-₹1,299)',
        cost: 1299,
        impactDescription: 'Dope kicks, but you are eating plain khichdi till day 25.',
        healthScoreDelta: -14
      },
      {
        label: 'Close the app, touch grass, resist FOMO (₹0)',
        cost: 0,
        impactDescription: 'Chad discipline unlocked! ₹1,299 saved.',
        healthScoreDelta: 6
      }
    ]
  },
  {
    id: 'le6',
    title: '💊 Sudden Wisdom Tooth / Viral Flu',
    description: 'Sudden fever and pharmacy run for paracetamol, ORS, and antibiotics.',
    type: 'Expense',
    impactAmount: 420,
    options: [
      {
        label: 'Buy prescribed meds from pharmacy (-₹420)',
        cost: 420,
        impactDescription: 'Health comes first. Non-negotiable.',
        healthScoreDelta: -2
      },
      {
        label: 'Visit campus dispensary for free generics (-₹50)',
        cost: 50,
        impactDescription: 'Saved ₹370 using student campus clinic.',
        healthScoreDelta: 3
      }
    ]
  }
];

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'preset-standard',
    name: 'Hostel Survivor',
    tagline: 'Standard ₹10,000 monthly allowance with shared PG rent and essential bills.',
    startingBudget: 10000,
    commitments: INITIAL_COMMITMENTS,
    subscriptions: INITIAL_SUBSCRIPTIONS,
    savingsGoals: INITIAL_SAVINGS_GOALS,
    initialTransactions: INITIAL_TRANSACTIONS,
    currentDay: 4
  },
  {
    id: 'preset-freelancer',
    name: 'Side-Hustle Fresher',
    tagline: 'Starts with ₹10,000, lower fixed rent, but fluctuating tool & cafe expenses.',
    startingBudget: 10000,
    commitments: [
      { id: 'c1', title: 'Room Share', amount: 2800, dueDay: 7, isPaid: false, category: 'Rent & Stay', criticality: 'Mandatory' },
      { id: 'c2', title: '5G Mobile Unlimited', amount: 399, dueDay: 12, isPaid: false, category: 'Bills & Utilities', criticality: 'Mandatory' },
      { id: 'c3', title: 'Domain & Cloud Server', amount: 550, dueDay: 18, isPaid: false, category: 'Bills & Utilities', criticality: 'High' }
    ],
    subscriptions: [
      { id: 's1', name: 'Spotify Student', cost: 59, billingDay: 5, isActive: true, iconName: 'music', category: 'Audio' },
      { id: 's2', name: 'GitHub Copilot', cost: 350, billingDay: 15, isActive: true, iconName: 'code', category: 'Dev Tools' },
      { id: 's3', name: 'Figma Pro Share', cost: 200, billingDay: 22, isActive: true, iconName: 'pen-tool', category: 'Design' }
    ],
    savingsGoals: [
      { id: 'g1', title: 'M2 Mac Mini Downpayment', targetAmount: 3000, savedAmount: 1200, priority: 'High', targetDay: 30, icon: 'laptop' },
      { id: 'g2', title: 'Rainy Day Cushion', targetAmount: 1000, savedAmount: 500, priority: 'Medium', targetDay: 30, icon: 'shield-alert' }
    ],
    initialTransactions: [
      { id: 't1', title: 'Cafe Cold Brew + Wi-Fi Work', amount: 240, category: 'Food & Chai', necessity: 'Want', day: 1, timestamp: '2026-10-01' },
      { id: 't2', title: 'Metro Transit Card', amount: 300, category: 'Commute & Travel', necessity: 'Need', day: 2, timestamp: '2026-10-02' }
    ],
    currentDay: 3
  },
  {
    id: 'preset-danger',
    name: 'Impulse Danger Zone',
    tagline: 'Already splurged on Day 1-6. High risk, 5 active subscriptions, must clutch survival.',
    startingBudget: 10000,
    commitments: [
      { id: 'c1', title: 'Rent Share', amount: 3800, dueDay: 8, isPaid: false, category: 'Rent & Stay', criticality: 'Mandatory' },
      { id: 'c2', title: 'Credit Card Minimum Due', amount: 950, dueDay: 14, isPaid: false, category: 'Bills & Utilities', criticality: 'Mandatory' },
      { id: 'c3', title: 'Gym Membership Due', amount: 800, dueDay: 20, isPaid: false, category: 'Bills & Utilities', criticality: 'High' }
    ],
    subscriptions: [
      { id: 's1', name: 'Netflix Premium', cost: 499, billingDay: 9, isActive: true, iconName: 'tv', category: 'Streaming' },
      { id: 's2', name: 'Spotify Duo', cost: 149, billingDay: 11, isActive: true, iconName: 'music', category: 'Music' },
      { id: 's3', name: 'Zomato Gold 3-Months', cost: 99, billingDay: 16, isActive: true, iconName: 'utensils', category: 'Food' },
      { id: 's4', name: 'Discord Nitro', cost: 249, billingDay: 21, isActive: true, iconName: 'gamepad-2', category: 'Gaming' },
      { id: 's5', name: 'Gym Add-on Lockers', cost: 200, billingDay: 27, isActive: true, iconName: 'lock', category: 'Fitness' }
    ],
    savingsGoals: [
      { id: 'g1', title: 'Goa Music Fest', targetAmount: 2000, savedAmount: 100, priority: 'Low', targetDay: 30, icon: 'party-popper' }
    ],
    initialTransactions: [
      { id: 't1', title: 'Sneakers Flash Sale (Impulse)', amount: 1650, category: 'Guilt / Impulse', necessity: 'Want', day: 1, timestamp: '2026-10-01' },
      { id: 't2', title: 'Pub Night Drinks', amount: 1200, category: 'Social & Outings', necessity: 'Want', day: 2, timestamp: '2026-10-02' },
      { id: 't3', title: 'Gourmet Sushi Delivery', amount: 680, category: 'Food & Chai', necessity: 'Want', day: 4, timestamp: '2026-10-04' }
    ],
    currentDay: 6
  },
  {
    id: 'preset-frugal',
    name: 'Frugal Master Monk',
    tagline: 'Disciplined saver aiming to retain ₹3,500+ unspent at the end of 30 days.',
    startingBudget: 10000,
    commitments: [
      { id: 'c1', title: 'Shared Dorm Bed', amount: 2600, dueDay: 6, isPaid: false, category: 'Rent & Stay', criticality: 'Mandatory' },
      { id: 'c2', title: 'Student Bus Pass', amount: 350, dueDay: 10, isPaid: false, category: 'Commute & Travel', criticality: 'Mandatory' }
    ],
    subscriptions: [
      { id: 's1', name: 'Spotify Free (Ad-supported)', cost: 0, billingDay: 1, isActive: false, iconName: 'music', category: 'Audio' }
    ],
    savingsGoals: [
      { id: 'g1', title: 'Mutual Fund SIP Buffer', targetAmount: 2500, savedAmount: 1800, priority: 'High', targetDay: 30, icon: 'trending-up' },
      { id: 'g2', title: 'Emergency Cushion', targetAmount: 1500, savedAmount: 1200, priority: 'High', targetDay: 30, icon: 'shield-check' }
    ],
    initialTransactions: [
      { id: 't1', title: 'Bulk Oatmeal & Peanut Butter', amount: 260, category: 'Food & Chai', necessity: 'Need', day: 1, timestamp: '2026-10-01' },
      { id: 't2', title: 'Library Xerox & Notes', amount: 45, category: 'Study & Gear', necessity: 'Need', day: 2, timestamp: '2026-10-02' }
    ],
    currentDay: 3
  }
];

export const GEN_Z_SURVIVAL_HACKS = [
  {
    id: 'h1',
    title: 'The 20-Minute Craving Rule',
    tip: 'Before ordering Swiggy/Zomato at midnight, drink a full glass of water and wait 20 minutes. 70% of cravings dissolve.',
    savings: '₹250 - ₹400 / order'
  },
  {
    id: 'h2',
    title: 'Campus / Hostel WiFi Hoarding',
    tip: 'Download Spotify playlists, Netflix series, and course videos on free college Wi-Fi instead of topping up extra 4G data packs.',
    savings: '₹120 / month'
  },
  {
    id: 'h3',
    title: 'Metro / Bus Smart Pass',
    tip: 'Daily auto fares bleed ₹60-₹100 each way. A monthly student travel card cuts transit cost by 65%.',
    savings: '₹1,200 / month'
  },
  {
    id: 'h4',
    title: 'Subscription Shadow Audit',
    tip: 'Pause streaming services during exam weeks. You won’t watch anyway, and you immediately reclaim ₹300-₹500 liquid cash.',
    savings: '₹300 - ₹500 / month'
  },
  {
    id: 'h5',
    title: 'Chai Tapri vs Fancy Cafe',
    tip: 'A ₹15 tapri chai with friends has 10x more lore and laughs than a ₹320 iced caramel macchiato.',
    savings: '₹305 / meetup'
  }
];
