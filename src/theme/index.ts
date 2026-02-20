export const Colors = {
  // ─── Brand ─────────────────────────────────────────────────────────────────
  primary: '#1F1D1D',        // Onyx — main brand color
  primaryLight: '#3F3E3E',   // Charcoal
  primaryDark: '#0D0D0D',

  secondary: '#E4B568',      // Gold
  secondaryLight: '#F0CC8E',
  secondaryDark: '#C49440',

  accent: '#7AA0B0',         // Storm blue-gray
  accentLight: '#B4CDD7',    // Light gray-blue
  accentDark: '#497283',     // Info / deeper storm

  // ─── Backgrounds ───────────────────────────────────────────────────────────
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#D9E6EB',     // Light gray-blue tint
  surfaceWarm: '#F5F5F5',    // Near-white

  // ─── Borders ───────────────────────────────────────────────────────────────
  border: '#B4CDD7',         // Spec border color
  borderLight: '#E5E5E5',

  // ─── Text ──────────────────────────────────────────────────────────────────
  textPrimary: '#3F3E3E',    // Charcoal
  textSecondary: 'rgba(63, 62, 62, 0.7)',
  textMuted: 'rgba(63, 62, 62, 0.4)',
  textInverse: '#FFFFFF',

  // ─── Semantic ──────────────────────────────────────────────────────────────
  success: '#395E26',
  successLight: '#D4EDDA',
  warning: '#926C3E',
  warningLight: '#FEF3C7',
  error: '#CF6049',
  errorLight: '#FADBD8',
  info: '#497283',
  infoLight: '#D6EAF8',

  // ─── Star rating ───────────────────────────────────────────────────────────
  star: '#E4B568',           // Gold stars
  starEmpty: '#E5E5E5',

  // ─── Social ────────────────────────────────────────────────────────────────
  friendBadge: '#497283',
  like: '#CF6049',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ─── Tab bar (floating pill) ───────────────────────────────────────────────
  tabActive: '#926C3E',      // Warm brown/gold for active
  tabInactive: '#3F3E3E',    // Charcoal inactive
  tabBarBg: '#FFFFFF',

  // ─── Plus button ───────────────────────────────────────────────────────────
  plusButton: '#497283',     // Storm/teal per spec (#008B8B-ish → using #497283)
};

export const Typography = {
  sizes: {
    xs: 10,    // Tiny
    sm: 12,    // Small
    base: 14,  // Body
    md: 16,    // H3-ish
    lg: 18,    // Button / Screen title
    xl: 24,    // H2
    '2xl': 28,
    '3xl': 32, // H1
    '4xl': 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    heading: 1.2,
    body: 1.5,
  },
  families: {
    sans: undefined, // Inter (loaded via expo-font or system)
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 28,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  // Floating nav shadow
  nav: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
};
