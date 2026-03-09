export const RIGHT_PANEL_CONTENT = {
  1: {
    label: 'WHY THIS QUESTION MATTERS',
    quote: '\u201cYour situation determines everything \u2014 the type of advisor, the kind of advice, and where to start.\u201d',
    subtext: 'Not generic advice. Advice that fits exactly where you are.',
    badges: ['CFP Matched', 'CFA Matched', 'CA Matched'],
  },
  2: {
    label: 'MOST INDIANS\u2019 SAVINGS DISTRIBUTION',
    chartData: [
      { label: 'FD/Savings', pct: 65 },
      { label: 'MF', pct: 40 },
      { label: 'Equity', pct: 25 },
      { label: 'RE', pct: 20 },
      { label: 'Other', pct: 10 },
    ],
    subtext: '67% of wealth sits in low-yield instruments.',
    accent: 'An advisor changes this.',
  },
  3: {
    label: 'THE IMPACT OF GETTING THIS RIGHT',
    stats: [
      { value: '\u20b91.4Cr', desc: 'Average tax saved over 10 years with proper structuring' },
      { value: '2.1%', desc: 'Average annual return improvement from portfolio restructuring alone' },
    ],
  },
  4: {
    label: 'WHY WE ASK THIS',
    quote: '\u201cThe right advice for a \u20b950K/month earner and a \u20b95L/month earner are completely different. Your numbers shape everything.\u201d',
    subtext: 'Your financial data is never shared without your permission.',
    showLock: true,
  },
  5: {
    label: 'ALMOST THERE',
    quote: '\u201cThe right advisor isn\u2019t the most qualified one. It\u2019s the one who understands exactly where you are.\u201d',
    advisorPreview: {
      initials: 'PK',
      name: 'Priya Krishnamurthy, CFP',
      detail: 'SEBI RIA \u00b7 9 years experience',
    },
  },
  6: {
    label: '',
    headline: 'You\u2019re 30 seconds away from meeting your match.',
    subtext: 'Our matching engine is processing your profile against every verified advisor in our network.',
  },
};

export const STEP1_OPTIONS = [
  {
    id: 'new_earner',
    emoji: '\ud83d\ude80',
    title: 'I just started earning and want to get it right',
    description: 'First salary, first investments \u2014 I want a proper foundation.',
  },
  {
    id: 'confused_investor',
    emoji: '\ud83d\ude30',
    title: "I'm investing but have no idea if I'm doing it right",
    description: 'Some SIPs running, maybe some stocks. No real plan behind it.',
  },
  {
    id: 'big_decision',
    emoji: '\u26a1',
    title: 'I have a big financial decision coming up',
    description: 'House, job change, business \u2014 need someone to think it through with me.',
  },
  {
    id: 'retirement_planning',
    emoji: '\ud83c\udfd6\ufe0f',
    title: 'I want to plan seriously for retirement',
    description: "I know I should have started earlier. I want a real number and a real plan.",
  },
];

export const STEP2_OPTIONS = [
  { id: 'savings', emoji: '\ud83c\udfe6', title: 'Savings account mostly' },
  { id: 'sips', emoji: '\ud83d\udcca', title: 'Some SIPs / mutual funds' },
  { id: 'stocks_sips', emoji: '\ud83d\udcc8', title: 'Stocks + SIPs scattered' },
  { id: 'real_estate_fd', emoji: '\ud83c\udfe0', title: 'Real estate / FD heavy' },
  { id: 'not_sure', emoji: '\ud83d\ude05', title: 'Honestly not sure' },
  { id: 'foreign_nri', emoji: '\ud83c\udf0d', title: 'Foreign / NRI accounts' },
];

export const STEP3_OPTIONS = [
  {
    id: 'investment_plan',
    emoji: '\ud83c\udfaf',
    title: 'Build a proper investment plan',
    description: 'Right funds, right allocation, right SIP amount.',
  },
  {
    id: 'tax_reduction',
    emoji: '\ud83d\udcb0',
    title: 'Reduce my tax burden',
    description: '80C, HRA, NPS \u2014 actually understand and use them.',
  },
  {
    id: 'retirement',
    emoji: '\ud83c\udfd6\ufe0f',
    title: 'Know my retirement number',
    description: 'A real, inflation-adjusted corpus target I can work towards.',
  },
  {
    id: 'insurance',
    emoji: '\ud83d\udee1\ufe0f',
    title: 'Get the right insurance coverage',
    description: 'Stop overpaying for the wrong policies.',
  },
  {
    id: 'major_goal',
    emoji: '\ud83c\udfe0',
    title: 'Plan for a major goal',
    description: "House, car, wedding, children's education.",
  },
  {
    id: 'nri',
    emoji: '\ud83c\udf0d',
    title: 'Sort out my NRI finances',
    description: 'Manage money and investments across borders properly.',
  },
  {
    id: 'second_opinion',
    emoji: '\ud83d\udd0d',
    title: 'Get a second opinion',
    description: 'Something feels off. I want an expert to check my portfolio.',
  },
  {
    id: 'debt',
    emoji: '\ud83d\udcb3',
    title: 'Deal with my debt',
    description: 'Get on top of EMIs and loans with a clear plan.',
  },
];

export const EMPLOYMENT_OPTIONS = [
  { id: 'salaried', emoji: '\ud83c\udfe2', title: 'Salaried' },
  { id: 'self_employed', emoji: '\ud83d\udcbc', title: 'Self-Employed' },
  { id: 'business_owner', emoji: '\ud83c\udfd7\ufe0f', title: 'Business Owner' },
  { id: 'freelancer', emoji: '\ud83d\udcbb', title: 'Freelancer' },
];

export const INCOME_OPTIONS = [
  'below_3L', '3L_5L', '5L_8L', '8L_10L', '10L_15L', '15L_20L', '20L_25L', 'above_25L',
];

export const INCOME_LABELS: Record<string, string> = {
  below_3L: 'Below \u20b93L',
  '3L_5L': '\u20b93L\u2013\u20b95L',
  '5L_8L': '\u20b95L\u2013\u20b98L',
  '8L_10L': '\u20b98L\u2013\u20b910L',
  '10L_15L': '\u20b910L\u2013\u20b915L',
  '15L_20L': '\u20b915L\u2013\u20b920L',
  '20L_25L': '\u20b920L\u2013\u20b925L',
  above_25L: '\u20b925L+',
};

export const SURPLUS_OPTIONS = ['below_25K', '25K_75K', '75K_2L', 'above_2L'];
export const SURPLUS_LABELS: Record<string, string> = {
  below_25K: 'Below \u20b925K',
  '25K_75K': '\u20b925K\u2013\u20b975K',
  '75K_2L': '\u20b975K\u2013\u20b92L',
  above_2L: '\u20b92L+',
};

export const INVESTMENTS_OPTIONS = ['below_5L', '5L_25L', '25L_1Cr', 'above_1Cr', 'not_sure'];
export const INVESTMENTS_LABELS: Record<string, string> = {
  below_5L: 'Below \u20b95L',
  '5L_25L': '\u20b95L\u2013\u20b925L',
  '25L_1Cr': '\u20b925L\u2013\u20b91Cr',
  above_1Cr: 'Above \u20b91Cr',
  not_sure: 'Not sure',
};

export const STEP5_OPTIONS = [
  {
    id: 'single_session',
    emoji: '\ud83d\udd50',
    title: 'One deep session to get a full plan',
    description: "60\u201390 minutes, comprehensive, then I'll execute myself.",
  },
  {
    id: 'ongoing',
    emoji: '\ud83d\udd04',
    title: 'Regular check-ins over time',
    description: 'Quarterly reviews, adjustments as my life changes.',
  },
  {
    id: 'explore',
    emoji: '\ud83d\udc40',
    title: "I'm not sure yet \u2014 let me explore first",
    description: "Just want to see what's available and go from there.",
  },
];

export const CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Other',
];
