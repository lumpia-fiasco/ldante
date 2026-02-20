import { ServiceCategory, RatingDimension } from '../types';

export const SERVICE_CATEGORIES: { key: ServiceCategory; label: string; icon: string }[] = [
  { key: 'hair', label: 'Hair', icon: '✂️' },
  { key: 'nails', label: 'Nails', icon: '💅' },
  { key: 'massage', label: 'Massage', icon: '💆' },
  { key: 'fitness', label: 'Fitness', icon: '🏋️' },
  { key: 'esthetics', label: 'Esthetics', icon: '✨' },
  { key: 'wellness', label: 'Wellness', icon: '🧘' },
  { key: 'other', label: 'Other', icon: '⭐' },
];

export const STYLE_PREFERENCES = {
  hair: [
    { key: 'classic', label: 'Classic & Clean' },
    { key: 'edgy', label: 'Edgy & Bold' },
    { key: 'natural', label: 'Natural & Effortless' },
    { key: 'vibrant', label: 'Vibrant & Colorful' },
    { key: 'trendy', label: 'Trendy & Fashion-Forward' },
  ],
  nails: [
    { key: 'minimal', label: 'Minimal & Natural' },
    { key: 'bold', label: 'Bold & Artistic' },
    { key: 'classic', label: 'Classic & Polished' },
    { key: 'trendy', label: 'On-Trend' },
  ],
  fitness: [
    { key: 'strength', label: 'Strength & Powerlifting' },
    { key: 'hiit', label: 'HIIT & Cardio' },
    { key: 'flexibility', label: 'Yoga & Flexibility' },
    { key: 'rehabilitation', label: 'Rehab & Recovery' },
    { key: 'general', label: 'General Fitness' },
  ],
};

export const PRIORITY_FACTORS = [
  { key: 'quality', label: 'Quality of Results', icon: '⭐', defaultWeight: 80 },
  { key: 'service', label: 'Customer Service', icon: '💬', defaultWeight: 50 },
  { key: 'value', label: 'Value for Money', icon: '💰', defaultWeight: 70 },
  { key: 'timeliness', label: 'Timeliness', icon: '⏰', defaultWeight: 40 },
  { key: 'atmosphere', label: 'Atmosphere / Vibe', icon: '✨', defaultWeight: 30 },
  { key: 'expertise', label: 'Expertise / Skill', icon: '🎓', defaultWeight: 100 },
] as const;

export const RATING_DIMENSIONS = [
  { key: 'quality', label: 'Quality of Results', icon: '⭐' },
  { key: 'service', label: 'Customer Service', icon: '💬' },
  { key: 'value', label: 'Value for Money', icon: '💰' },
  { key: 'timeliness', label: 'Timeliness', icon: '⏰' },
  { key: 'atmosphere', label: 'Atmosphere / Vibe', icon: '✨' },
  { key: 'expertise', label: 'Expertise / Skill', icon: '🎓' },
];

export const BEST_FOR_TAGS = [
  'Great for first-timers',
  'Advanced techniques',
  'Budget-friendly',
  'Luxury experience',
  'Quick appointments',
  'Detailed consultations',
  'Creative styles',
  'Classic styles',
  'Color specialist',
  'Natural looks',
];

export const SPECIALTY_TAGS = [
  'Color Specialist',
  'Balayage',
  'Keratin Treatment',
  'Natural Hair',
  'Extensions',
  'Precision Cuts',
  'Highlights',
  'Braiding',
  'Gel Nails',
  'Acrylic Nails',
  'Nail Art',
  'Deep Tissue',
  'Sports Massage',
  'Prenatal',
  'Swedish',
  'HIIT Training',
  'Strength Training',
  'Injury Recovery',
  'Yoga',
  'Pilates',
  'Waxing',
  'Facials',
  'Brow Design',
  'Lash Extensions',
];

export const AGE_RANGES = [
  { key: '18-24', label: '18–24' },
  { key: '25-34', label: '25–34' },
  { key: '35-44', label: '35–44' },
  { key: '45-54', label: '45–54' },
  { key: '55-64', label: '55–64' },
  { key: '65+', label: '65+' },
];

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8; // 8am to 9pm
  const minute = i % 2 === 0 ? '00' : '30';
  const h = hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${h}:${minute} ${period}`,
  };
});

// Supabase config - replace with your actual keys
export const SUPABASE_URL = 'https://ipjchvxjapuqrajycfat.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_i-tKBoQ2Pf9N3utdTi_M1A_TM-DFEZK';
