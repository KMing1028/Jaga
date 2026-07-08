export const providerLogos = {
  perkeso: require('../assets/logos/perkeso.png'),
  kwsp: require('../assets/logos/kwsp.png'),
  tokiomarine: require('../assets/logos/tokiomarine.png'),
  policystreet: require('../assets/logos/policystreet.png'),
  aia: require('../assets/logos/aia.png'),
  greateastern: require('../assets/logos/greateastern.png'),
  manulife: require('../assets/logos/manulife.png'),
  allianz: require('../assets/logos/allianz.png'),
  etiqa: require('../assets/logos/etiqa.png'),
  zurich: require('../assets/logos/zurich.png'),
  prubsn: require('../assets/logos/prubsn.png'),
  tekun: require('../assets/logos/tekun.png'),
  bsn: require('../assets/logos/bsn.png'),
  directlending: require('../assets/logos/directlending.png'),
  fundingsocieties: require('../assets/logos/fundingsocieties.png'),
  boost: require('../assets/logos/boost.png'),
  aham: require('../assets/logos/aham.png'),
};

export const appLogo = require('../assets/logo.png');

export type Occupation = {
  id: string;
  label: string;
  emoji: string;
  hint: string;
};

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  group: 'insurance' | 'retirement';
};

export type Product = {
  id: string;
  sectionId: string;
  name: string;
  provider: string;
  initials: string;
  brandColor: string;
  logo?: number; // bundled provider logo asset (require id)
  aimedFor: string; // brief description of who the product targets
  monthly: string; // headline price, per month where possible
  monthlyValue?: number | null; // RM/mo used for dashboard totals; null = quote/usage-based
  monthlyNote?: string; // e.g. "RM1/day" original pricing
  estimated?: boolean;
  badge?: string;
  referenceOnly?: string; // set when the product can't be bought via JAGA; value = where to get it
  shariah?: boolean; // true = Shariah-compliant, false = conventional-only (hidden for Muslim users), undefined = neutral
  risk?: string; // fund risk / allocation type
  returns?: { YTD: number; '1Y': number; '3Y': number }; // fund returns, 3Y is % p.a.
  coverage: string[];
  note?: string;
  relevantTo: string[] | 'all'; // occupation ids
};

export type Loan = {
  id: string;
  name: string;
  provider: string;
  initials: string;
  brandColor: string;
  logo?: number;
  aimedFor: string;
  amount: string;
  rate: string;
  tenure: string;
  features: string[];
  note?: string;
  applyUrl?: string; // lender's real application/landing page
  relevantTo: string[] | 'all';
};

export const occupations: Occupation[] = [
  { id: 'rider', label: 'Delivery Rider', emoji: '🛵', hint: 'Grab, Foodpanda, Lalamove' },
  { id: 'ehailing', label: 'E-Hailing Driver', emoji: '🚗', hint: 'Grab, Maxim, inDrive' },
  { id: 'videographer', label: 'Videographer / Photographer', emoji: '📷', hint: 'Shoots, events, weddings' },
  { id: 'editor', label: 'Video / Content Editor', emoji: '🎬', hint: 'Post-production, media' },
  { id: 'designer', label: 'Web / Graphic Designer', emoji: '💻', hint: 'Freelance design & dev' },
  { id: 'creator', label: 'Content Creator', emoji: '🎙️', hint: 'Social media, streaming' },
  { id: 'consultant', label: 'Freelance Consultant', emoji: '📊', hint: 'Projects & contracts' },
  { id: 'hawker', label: 'Hawker / Small Business', emoji: '🍜', hint: 'Stalls & own-account work' },
];

export const sections: Section[] = [
  {
    id: 'socso',
    title: 'SOCSO Self-Employed',
    subtitle: 'Government injury protection — becoming mandatory',
    emoji: '🛡️',
    group: 'insurance',
  },
  {
    id: 'pa',
    title: 'Personal Accident',
    subtitle: 'Covers you 24/7, on and off the job',
    emoji: '🩹',
    group: 'insurance',
  },
  {
    id: 'health',
    title: 'Health & Hospital Income',
    subtitle: 'Medical bills + cash while you can’t work',
    emoji: '🏥',
    group: 'insurance',
  },
  {
    id: 'vehicle',
    title: 'Vehicle & E-Hailing Cover',
    subtitle: 'Motor insurance built for gig driving',
    emoji: '🏍️',
    group: 'insurance',
  },
  {
    id: 'work',
    title: 'Work & Equipment Cover',
    subtitle: 'Parcels, gear and professional liability',
    emoji: '🧰',
    group: 'insurance',
  },
  {
    id: 'retirement',
    title: 'Retirement & Savings',
    subtitle: 'Small monthly amounts + free government top-ups',
    emoji: '🌱',
    group: 'retirement',
  },
  {
    id: 'emergency',
    title: 'Emergency Fund',
    subtitle: 'Instant-access savings for when a month goes wrong',
    emoji: '🌧️',
    group: 'retirement',
  },
];

// Research snapshot date for all hard-coded pricing and fund returns below.
export const DATA_AS_OF = '7 July 2026';

// TODO: replace with live provider API — prices, availability and fund
// returns below are a static research snapshot, not a feed.
export const products: Product[] = [
  // ── SOCSO ──────────────────────────────────────────────
  {
    id: 'sksps',
    sectionId: 'socso',
    name: 'SKSPS — Lindung Kendiri',
    provider: 'PERKESO (SOCSO)',
    initials: 'PK',
    brandColor: '#1B5FAA',
    logo: providerLogos.perkeso,
    aimedFor: 'All self-employed & gig workers — riders, e-hailing, freelancers, photographers & videographers',
    monthly: 'from RM13.10/mo',
    monthlyValue: 13.1,
    monthlyNote: 'RM157.20/yr · Plan 1 · monthly, quarterly or yearly contribution',
    badge: 'Mandatory soon',
    coverage: [
      'Work injury & accident coverage',
      'Temporary & permanent disablement benefits',
      'Dependents’ pension if the worst happens',
      'Funeral & education benefits',
    ],
    note: 'Becoming mandatory under the Gig Workers Bill (2026) — only 26% of 1.16M gig workers are enrolled today. JAGA helps you register and stay compliant; the government subsidises up to 80% of contributions for eligible gig sectors.',
    relevantTo: 'all',
  },

  // ── Personal Accident ─────────────────────────────────
  {
    id: 'tm-pa-rider',
    sectionId: 'pa',
    name: 'Personal Accident for Riders',
    provider: 'Tokio Marine',
    initials: 'TM',
    brandColor: '#00A650',
    logo: providerLogos.tokiomarine,
    aimedFor: 'Delivery riders & logistics gig workers on any platform',
    monthly: 'RM30/mo',
    monthlyValue: 30,
    monthlyNote: 'RM1/day pay-per-use',
    coverage: [
      'Accidental death & permanent disability',
      'Medical expenses from accidents',
      'Ambulance fees covered',
      'Protects 24/7 — not just during delivery trips',
    ],
    note: 'Platform-agnostic — works whichever apps you ride for. Distributed via Finology’s embedded-finance API.',
    relevantTo: ['rider', 'ehailing'],
  },
  {
    id: 'ps-directcare',
    sectionId: 'pa',
    name: 'DirectCare+ Microtakaful',
    provider: 'PolicyStreet',
    initials: 'PS',
    brandColor: '#6C4CF1',
    logo: providerLogos.policystreet,
    aimedFor: 'Freelancers & gig workers with active loans or financing',
    monthly: 'Get quote',
    monthlyValue: null,
    monthlyNote: 'billed monthly, tied to your loan schedule',
    coverage: [
      'Accidental death & permanent disability',
      'Loan protection if you have active financing',
      'Shariah-compliant microtakaful',
    ],
    note: 'Pairs naturally with a micro-loan — if something happens to you, the loan doesn’t fall on your family.',
    relevantTo: 'all',
  },
  {
    id: 'aia-flexpa',
    sectionId: 'pa',
    name: 'Flex PA Plus',
    provider: 'AIA Malaysia',
    initials: 'AIA',
    brandColor: '#D31145',
    logo: providerLogos.aia,
    aimedFor: 'Anyone wanting customisable accident cover that grows with income',
    monthly: 'from ~RM25/mo',
    monthlyValue: 25,
    estimated: true,
    coverage: [
      'Customisable personal accident cover',
      'Optional medical & living-benefit riders',
      'Adjust protection as your income grows',
    ],
    relevantTo: 'all',
  },
  {
    id: 'ge-classicpa',
    sectionId: 'pa',
    name: 'Classic PA',
    provider: 'Great Eastern',
    initials: 'GE',
    brandColor: '#E87511',
    logo: providerLogos.greateastern,
    aimedFor: 'General fallback accident protection for any gig worker',
    monthly: 'from ~RM20/mo',
    monthlyValue: 20,
    estimated: true,
    coverage: [
      'Accidental death benefit',
      'Medical expenses reimbursement',
      'Bereavement allowance',
    ],
    relevantTo: 'all',
  },

  // ── Health & Hospital Income ──────────────────────────
  {
    id: 'prubsn-anugerahmax',
    sectionId: 'health',
    name: 'PruBSN AnugerahMax',
    provider: 'Prudential BSN Takaful',
    initials: 'PB',
    brandColor: '#ED1B2E',
    logo: providerLogos.prubsn,
    aimedFor: 'Freelancers & gig workers with no fixed payslip — riders, drivers, digital freelancers',
    monthly: 'from RM50/mo',
    monthlyValue: 50,
    monthlyNote: '~RM150–250/mo typical with medical card rider',
    estimated: true,
    badge: 'Income protection',
    coverage: [
      'High-limit medical card',
      'Death & total permanent disability benefit',
      'Optional Crisis TotalCare rider — lump sum for lost income during hospitalisation or critical illness',
    ],
    note: 'The first takaful plan marketed directly at the “no payslip” gig segment — its income-replacement rider answers the sick-leave gap. Premiums vary by age and plan; confirm with PruBSN.',
    relevantTo: 'all',
  },
  {
    id: 'manulife-hcash',
    sectionId: 'health',
    name: 'Hospital Cash Plan',
    provider: 'Manulife',
    initials: 'ML',
    brandColor: '#00A758',
    logo: providerLogos.manulife,
    aimedFor: 'Gig workers with no employer-paid sick leave',
    monthly: 'from RM60/mo',
    monthlyValue: 60,
    monthlyNote: 'entry plans from RM2/day',
    badge: 'Income protection',
    coverage: [
      'Daily cash allowance ~RM200–500 per night hospitalised',
      'Replaces lost income while you recover',
      'Entry plans with no medical checkup',
    ],
    note: 'SOCSO only pays for work injuries — this covers income lost to any illness. Premiums eligible for up to RM4,000/yr tax relief.',
    relevantTo: 'all',
  },
  {
    id: 'ps-freelancer-health',
    sectionId: 'health',
    name: 'Freelancer Health & Dental',
    provider: 'PolicyStreet',
    initials: 'PS',
    brandColor: '#6C4CF1',
    logo: providerLogos.policystreet,
    aimedFor: 'Creative & digital freelancers — videographers, editors, web editors, designers',
    monthly: 'Get quote',
    monthlyValue: null,
    badge: 'For freelancers',
    coverage: [
      'Health & dental insurance built for freelancers',
      'No employer needed to qualify',
      'Backed by MDEC’s freelancer initiative',
    ],
    note: 'The closest product in Malaysia designed specifically for creative and digital freelancers.',
    relevantTo: ['videographer', 'editor', 'designer', 'creator', 'consultant'],
  },
  {
    id: 'allianz-medical',
    sectionId: 'health',
    name: 'Medical Card + Hospital Income',
    provider: 'Allianz',
    initials: 'AZ',
    brandColor: '#003781',
    logo: providerLogos.allianz,
    aimedFor: 'Gig workers wanting full hospital-bill coverage',
    monthly: '~RM100–300/mo',
    monthlyValue: 150,
    estimated: true,
    coverage: [
      'Full medical card for hospital bills',
      'Optional daily hospital income rider',
      'Cashless admission at panel hospitals',
    ],
    relevantTo: 'all',
  },

  // ── Vehicle & E-Hailing ───────────────────────────────
  {
    id: 'zurich-autocover',
    sectionId: 'vehicle',
    name: 'Auto Cover — E-Hailing Add-On',
    provider: 'Zurich Malaysia',
    initials: 'ZU',
    brandColor: '#2167AE',
    logo: providerLogos.zurich,
    aimedFor: 'E-hailing drivers on any platform — Grab, MyCar, inDrive',
    monthly: '~RM30–58/mo',
    monthlyValue: 45,
    monthlyNote: 'RM350–700/yr by vehicle type & usage hours',
    estimated: true,
    coverage: [
      'Comprehensive car insurance',
      'E-hailing use add-on — covers ride-hailing driving that a standard private policy excludes',
      'Not locked to any single platform',
    ],
    note: 'The non-exclusive alternative to Grab’s insurer panel — buy directly from Zurich and drive for any e-hailing app.',
    relevantTo: ['ehailing'],
  },
  {
    id: 'zurich-zrider',
    sectionId: 'vehicle',
    name: 'Z-Rider / Z-Rider Takaful',
    provider: 'Zurich Malaysia',
    initials: 'ZU',
    brandColor: '#2167AE',
    logo: providerLogos.zurich,
    aimedFor: 'Motorcycle-riding gig workers — food delivery & couriers',
    monthly: 'Varies by bike',
    monthlyValue: null,
    monthlyNote: 'yearly policy · instalments via Shopee PayLater',
    coverage: [
      'Comprehensive / third-party fire & theft motorcycle cover',
      'Conventional or takaful options',
      'Distributed through Shopee / SeaMoney',
    ],
    note: 'Standard motor premium priced by bike value and coverage type — not a flat gig rate. Instalment plans make the yearly premium feel monthly.',
    relevantTo: ['rider'],
  },
  {
    id: 'grab-etiqa',
    sectionId: 'vehicle',
    name: 'Grab Daily E-Hailing Insurance',
    provider: 'Etiqa',
    initials: 'ET',
    brandColor: '#FFC20E',
    logo: providerLogos.etiqa,
    aimedFor: 'Grab e-hailing drivers only — pay-per-day cover',
    monthly: '~RM41/mo',
    monthlyValue: null,
    monthlyNote: '~RM1.36/day, charged only on days you drive',
    referenceOnly: 'Available only inside the Grab Driver app',
    coverage: [
      'Daily motor & personal accident e-hailing add-on',
      'Pay only on active driving days',
    ],
    note: 'Closed panel — shown here as a price benchmark so you can compare against open-market options like Zurich Auto Cover.',
    relevantTo: ['ehailing'],
  },
  {
    id: 'grab-zurich',
    sectionId: 'vehicle',
    name: 'Grab Daily E-Hailing Insurance',
    provider: 'Zurich',
    initials: 'ZU',
    brandColor: '#2167AE',
    logo: providerLogos.zurich,
    aimedFor: 'Grab e-hailing drivers only — cheapest of Grab’s panel',
    monthly: '~RM40/mo',
    monthlyValue: null,
    monthlyNote: '~RM1.33/day, charged only on days you drive',
    referenceOnly: 'Available only inside the Grab Driver app',
    coverage: [
      'Daily motor & personal accident e-hailing add-on',
      'Cheapest of the three Grab panel insurers',
    ],
    note: 'Closed panel — shown as a benchmark only.',
    relevantTo: ['ehailing'],
  },

  // ── Work & Equipment ──────────────────────────────────
  {
    id: 'tm-git',
    sectionId: 'work',
    name: 'Goods in Transit',
    provider: 'Tokio Marine',
    initials: 'TM',
    brandColor: '#00A650',
    logo: providerLogos.tokiomarine,
    aimedFor: 'Delivery & courier gig workers carrying parcels',
    monthly: 'from RM2/parcel',
    monthlyValue: null,
    monthlyNote: 'pay only when you deliver',
    coverage: [
      'Covers parcels you carry against loss & damage',
      'Higher sum insured than typical platform cover',
      'Pairs with Personal Accident for full rider protection',
    ],
    relevantTo: ['rider'],
  },
  {
    id: 'ps-indemnity',
    sectionId: 'work',
    name: 'Professional Indemnity & Liability',
    provider: 'PolicyStreet',
    initials: 'PS',
    brandColor: '#6C4CF1',
    logo: providerLogos.policystreet,
    aimedFor: 'Freelancers whose work could trigger client claims — shoots, events, projects',
    monthly: 'Get quote',
    monthlyValue: null,
    badge: 'For freelancers',
    coverage: [
      'Protects you if a client claims your work caused loss',
      'Liability cover for shoots, events & projects',
      'Part of PolicyStreet’s freelancer suite',
    ],
    note: 'Essential once you take on bigger clients or on-location work.',
    relevantTo: ['videographer', 'editor', 'designer', 'consultant', 'creator'],
  },

  // ── Retirement & Savings ──────────────────────────────
  {
    id: 'isaraan',
    sectionId: 'retirement',
    name: 'i-Saraan',
    provider: 'KWSP (EPF)',
    initials: 'EPF',
    brandColor: '#003DA5',
    logo: providerLogos.kwsp,
    aimedFor: 'Any self-employed or gig worker without mandatory EPF',
    monthly: 'from RM10/mo',
    monthlyValue: 10,
    monthlyNote: 'any amount, any time',
    badge: 'Govt +20% match',
    coverage: [
      'Government adds 20% of what you save — up to RM500/yr',
      'Earns EPF’s declared dividend — 6.15% for 2025',
      'Contribute any amount, skip slow months',
      '10% sits in a flexible account you can withdraw anytime',
    ],
    note: 'Not fully locked-in anymore: EPF’s Akaun Fleksibel lets you withdraw a portion (min RM50) with no documents needed.',
    relevantTo: 'all',
  },
  {
    id: 'isaraan-plus',
    sectionId: 'retirement',
    name: 'i-Saraan Plus',
    provider: 'KWSP (EPF)',
    initials: 'EPF',
    brandColor: '#003DA5',
    logo: providerLogos.kwsp,
    aimedFor: 'E-hailing & p-hailing drivers, riders and couriers',
    monthly: 'from RM10/mo',
    monthlyValue: 10,
    monthlyNote: 'any amount, any time',
    badge: 'Up to RM600/yr match',
    coverage: [
      'New Budget 2026 scheme for gig & p-hailing workers',
      'Same EPF dividend pool — 6.15% declared for 2025',
      'Government matching up to RM600/yr (RM6,000 lifetime)',
      'Stacks retirement savings on top of every gig',
    ],
    note: 'Brand-new scheme targeted at e-hailing drivers, riders and couriers.',
    relevantTo: ['rider', 'ehailing'],
  },
  {
    id: 'aham-prs-growth',
    sectionId: 'retirement',
    name: 'AHAM PRS Growth Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Younger gig workers with 15+ years to retirement who can ride out market swings',
    monthly: 'from RM100',
    monthlyValue: 100,
    monthlyNote: 'min. RM100 initial · top up anytime',
    risk: 'Core · Aggressive',
    shariah: false,
    returns: { YTD: 8.2, '1Y': 14.46, '3Y': 25.36 },
    badge: 'Tax relief RM3,000/yr',
    coverage: [
      'Equity-heavy PRS core fund for long-horizon growth',
      'Personal tax relief up to RM3,000/yr on contributions',
      'Running since 2012 under the PPA framework',
    ],
    relevantTo: 'all',
  },
  {
    id: 'aham-prs-moderate',
    sectionId: 'retirement',
    name: 'AHAM PRS Moderate Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Mid-career gig workers wanting growth with a smoother ride',
    monthly: 'from RM100',
    monthlyValue: 100,
    monthlyNote: 'min. RM100 initial · top up anytime',
    risk: 'Core · Moderate',
    shariah: false,
    returns: { YTD: 7.8, '1Y': 11.34, '3Y': 21.11 },
    badge: 'Tax relief RM3,000/yr',
    coverage: [
      'Balanced equity/bond allocation — less volatile than Growth',
      'Personal tax relief up to RM3,000/yr on contributions',
      'Same AHAM PRS series as the Growth fund',
    ],
    relevantTo: 'all',
  },
  {
    id: 'aham-prs-conservative',
    sectionId: 'retirement',
    name: 'AHAM PRS Conservative Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Gig workers close to retirement who want to protect what they’ve built',
    monthly: 'from RM100',
    monthlyValue: 100,
    monthlyNote: 'min. RM100 initial · top up anytime',
    risk: 'Core · Cautious',
    shariah: false,
    returns: { YTD: 2.0, '1Y': 4.71, '3Y': 13.96 },
    badge: 'Tax relief RM3,000/yr',
    coverage: [
      'Capital-preservation option in the AHAM PRS series',
      'Personal tax relief up to RM3,000/yr on contributions',
      'Lower returns, much lower risk of a bad year',
    ],
    relevantTo: 'all',
  },
  {
    id: 'aham-aiiman-growth',
    sectionId: 'retirement',
    name: 'AHAM Aiiman PRS Shariah Growth Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Long-horizon savers who want Shariah-compliant growth',
    monthly: 'from RM100',
    monthlyValue: 100,
    monthlyNote: 'min. RM100 initial · top up anytime',
    risk: 'Core · Aggressive · Shariah',
    shariah: true,
    returns: { YTD: 10.4, '1Y': 17.96, '3Y': 28.46 },
    badge: 'Shariah-compliant',
    coverage: [
      'Shariah-compliant equity growth fund',
      'Outperformed its conventional counterpart over the past year',
      'Personal tax relief up to RM3,000/yr on contributions',
    ],
    relevantTo: 'all',
  },
  {
    id: 'aham-aiiman-moderate',
    sectionId: 'retirement',
    name: 'AHAM Aiiman PRS Shariah Moderate Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Savers who want balanced, Shariah-compliant retirement growth',
    monthly: 'from RM100',
    monthlyValue: 100,
    monthlyNote: 'min. RM100 initial · top up anytime',
    risk: 'Core · Moderate · Mixed assets · Shariah',
    shariah: true,
    returns: { YTD: 9.2, '1Y': 14.43, '3Y': 20.63 },
    badge: 'Shariah-compliant',
    coverage: [
      'Shariah-compliant mixed-asset allocation',
      'Middle ground between the Growth and Conservative funds',
      'Personal tax relief up to RM3,000/yr on contributions',
    ],
    relevantTo: 'all',
  },
  {
    id: 'aham-aiiman-conservative',
    sectionId: 'retirement',
    name: 'AHAM Aiiman PRS Shariah Conservative Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Savers near retirement who want Shariah-compliant capital protection',
    monthly: 'from RM100',
    monthlyValue: 100,
    monthlyNote: 'min. RM100 initial · top up anytime',
    risk: 'Core · Conservative · Shariah',
    shariah: true,
    returns: { YTD: 2.7, '1Y': 5.25, '3Y': 10.42 },
    badge: 'Shariah-compliant',
    coverage: [
      'Shariah-compliant capital-preservation fund',
      'Newest of the Aiiman PRS series (2022)',
      'Personal tax relief up to RM3,000/yr on contributions',
    ],
    relevantTo: 'all',
  },

  // ── Emergency Fund ────────────────────────────────────
  {
    id: 'aham-mmf',
    sectionId: 'emergency',
    name: 'AHAM Aiiman Money Market Fund',
    provider: 'AHAM Asset Management',
    initials: 'AH',
    brandColor: '#E4002B',
    logo: providerLogos.aham,
    aimedFor: 'Every gig worker — a parkable emergency fund for the months work dries up',
    monthly: 'Any amount',
    monthlyValue: null,
    monthlyNote: 'no lock-in · withdraw when you need it',
    shariah: true,
    badge: 'Shariah-compliant',
    coverage: [
      'Money-market returns comparable to fixed deposits, without the lock-in',
      'Withdraw anytime — cash typically back within days',
      'RM14B+ fund managed by AHAM',
      'Shariah-compliant, open to everyone',
    ],
    note: 'This is not insurance or retirement money — it’s the buffer that stops a slow month from becoming a loan. JAGA sets a personal goal for you based on your commitments.',
    relevantTo: 'all',
  },
];

// ── Fund returns metadata ────────────────────────────────
export type PrsPeriod = 'YTD' | '1Y' | '3Y';

export const returnsDisclaimer =
  'Returns from PPA’s consolidated performance table as of 7 Jul 2026. 3Y is total return % p.a. Past performance is not a guarantee of future results.';

// ── Account creation ─────────────────────────────────────
export type Account = {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  age: string;
  religion: string;
  viaGoogle: boolean;
};

export const religions = ['Islam', 'Buddhism', 'Christianity', 'Hinduism', 'Other', 'Prefer not to say'];

// ── Emergency fund goal ──────────────────────────────────
export type EmergencyGoal = { burden: string; months: number; expenses: number; goal: number };

export const burdenOptions = [
  { id: 'single', label: 'Single', months: 3, hint: 'Just you to look after' },
  { id: 'married', label: 'Married', months: 6, hint: 'Two people share the risk — and the bills' },
  { id: 'children', label: 'Married with children', months: 12, hint: 'Others depend on your income' },
];

// ── Micro-loans ──────────────────────────────────────────
export const loans: Loan[] = [
  {
    id: 'tekun',
    applyUrl: 'https://www.tekun.gov.my/en/',
    name: 'TEKUN Mikro Financing',
    provider: 'TEKUN Nasional',
    initials: 'TK',
    brandColor: '#00703C',
    logo: providerLogos.tekun,
    aimedFor: 'Small entrepreneurs & informal workers — hawkers, stall operators, home businesses',
    amount: 'RM1,000 – RM10,000',
    rate: '~4%/yr flat (est.)',
    tenure: 'up to 5 years',
    features: [
      'Government micro-financing agency — no bank account history needed',
      'Designed for informal income, no payslip required',
      'Small weekly or monthly repayments',
    ],
    note: 'Government-backed and the most forgiving entry point if you have no formal credit record.',
    relevantTo: ['hawker', 'rider', 'ehailing'],
  },
  {
    id: 'bsn-micro',
    applyUrl: 'https://www.bsn.com.my/page/MyRinggit-i?language=en',
    name: 'BSN Micro / MyRinggit-i',
    provider: 'Bank Simpanan Nasional',
    initials: 'BSN',
    brandColor: '#00A19C',
    logo: providerLogos.bsn,
    aimedFor: 'Micro-entrepreneurs & self-employed wanting a bank-grade micro loan',
    amount: 'RM5,000 – RM50,000',
    rate: 'from ~4.5%/yr (est.)',
    tenure: '1 – 7 years',
    features: [
      'National savings bank with branches everywhere in Malaysia',
      'Islamic financing options available',
      'Builds a formal credit record for future borrowing',
    ],
    relevantTo: 'all',
  },
  {
    id: 'directlending',
    applyUrl: 'https://directlending.com.my/personal-financing/',
    name: 'Gig Worker Personal Financing',
    provider: 'Direct Lending',
    initials: 'DL',
    brandColor: '#F5821F',
    logo: providerLogos.directlending,
    aimedFor: 'Gig workers rejected by banks — accepts e-hailing & delivery income statements',
    amount: 'RM1,000 – RM15,000',
    rate: 'from ~8%/yr (est.)',
    tenure: '6 months – 3 years',
    features: [
      'KPKT-licensed digital lender, fully online application',
      'Accepts Grab/Foodpanda earnings screenshots as income proof',
      'Same partner behind DirectCare+ loan protection takaful',
    ],
    note: 'Pair with DirectCare+ microtakaful so the loan is protected if anything happens to you.',
    relevantTo: 'all',
  },
  {
    id: 'fundingsocieties',
    applyUrl: 'https://fundingsocieties.com.my/',
    name: 'Micro Business Financing',
    provider: 'Funding Societies',
    initials: 'FS',
    brandColor: '#4B32C3',
    logo: providerLogos.fundingsocieties,
    aimedFor: 'Freelancers & micro-businesses needing working capital between projects',
    amount: 'RM5,000 – RM100,000',
    rate: 'from ~8%/yr (est.)',
    tenure: '1 – 18 months',
    features: [
      'SEA’s largest SME digital financing platform',
      'Short tenures — bridge a slow month or fund equipment',
      'No collateral for smaller amounts',
    ],
    relevantTo: ['videographer', 'editor', 'designer', 'consultant', 'creator', 'hawker'],
  },
  {
    id: 'boost-credit',
    applyUrl: 'https://myboostbank.co/',
    name: 'Boost Credit Micro-Loan',
    provider: 'Boost Bank',
    initials: 'BC',
    brandColor: '#EA0029',
    logo: providerLogos.boost,
    aimedFor: 'Gig workers already using the Boost eWallet who want instant small credit',
    amount: 'RM100 – RM5,000',
    rate: 'from ~1.5%/mo (est.)',
    tenure: '1 – 12 months',
    features: [
      'Fully in-app — disbursed to your eWallet in minutes',
      'Micro amounts for emergencies, not big commitments',
      'Repay from wallet balance as you earn',
    ],
    note: 'Fastest option for a small emergency top-up; watch the monthly rate on longer tenures.',
    relevantTo: 'all',
  },
];

export const loansDisclaimer =
  'Rates and limits are indicative estimates for this prototype — confirm with each provider before applying. Borrow only what a slow month can still repay.';

// ── Banks for account linking ────────────────────────────
export const banks = [
  { id: 'maybank', name: 'Maybank', color: '#FFC83D' },
  { id: 'cimb', name: 'CIMB Bank', color: '#EC1D24' },
  { id: 'publicbank', name: 'Public Bank', color: '#C8102E' },
  { id: 'rhb', name: 'RHB Bank', color: '#0067B1' },
  { id: 'bankislam', name: 'Bank Islam', color: '#00754A' },
  { id: 'gxbank', name: 'GXBank', color: '#1A1A1A' },
  { id: 'tng', name: "Touch 'n Go eWallet", color: '#005FE7' },
];

export const disclaimer =
  'Pricing shown is indicative and converted to monthly where possible. Final premiums are confirmed by each provider.';
