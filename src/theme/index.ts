export const Colors = {
  // Brand
  primary: '#5C4A1E',        // Dark warm brown (crown/logo color)
  primaryLight: '#8B6914',
  primaryDark: '#3D3010',
  accent: '#C4A96D',         // Gold accent
  accentLight: '#E8D5A3',

  // Backgrounds — warm cream/beige
  background: '#F5EFE6',     // Main warm cream background
  surface: '#FFFFFF',        // Card white
  surfaceAlt: '#EDE7DC',     // Slightly darker cream
  surfaceWarm: '#FAF6F0',    // Very light warm

  // Borders
  border: '#E0D5C5',
  borderLight: '#EDE7DC',

  // Text
  textPrimary: '#2C1F0E',    // Very dark brown
  textSecondary: '#6B5840',  // Medium brown
  textMuted: '#A08060',      // Light brown/tan
  textInverse: '#FFFFFF',

  // Status
  success: '#4A7C59',
  successLight: '#D4EDDA',
  warning: '#C4A96D',
  warningLight: '#FEF3C7',
  error: '#C0392B',
  errorLight: '#FADBD8',
  info: '#2E6DA4',
  infoLight: '#D6EAF8',

  // Star rating
  star: '#C4A96D',
  starEmpty: '#E0D5C5',

  // Social
  friendBadge: '#5C4A1E',
  like: '#C0392B',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Tab bar
  tabActive: '#2C1F0E',
  tabInactive: '#A08060',
  tabBarBg: '#FFFFFF',

  // Plus button
  plusButton: '#2C1F0E',
};

export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  families: {
    sans: undefined,
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
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#2C1F0E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C1F0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C1F0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
