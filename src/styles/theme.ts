/**
 * theme.ts - Design system and theme configuration
 * Provides colors, spacing, typography, and other design tokens
 * Works consistently across Web (CSS-in-JS) and React Native
 */

/**
 * Color palette - Dark mode theme matching original app
 */
export const colors = {
  // Background colors
  bgPrimary: '#0f172a', // Very dark blue - main background
  bgSecondary: '#1e293b', // Dark slate - secondary background
  bgTertiary: '#334155', // Medium gray - hover states

  // Text colors
  textPrimary: '#f1f5f9', // Light gray - primary text
  textSecondary: '#94a3b8', // Medium gray - secondary text
  textMuted: '#64748b', // Darker gray - disabled text

  // Accent colors
  accentPrimary: '#0ea5e9', // Cyan/Sky blue - primary actions
  accentHover: '#0284c7', // Darker cyan - hover state
  accentFocus: '#0369a1', // Even darker cyan - focus state

  // Status colors
  statusWorking: '#10b981', // Emerald green - active rep
  statusResting: '#f59e0b', // Amber - rest phase
  statusCountdown: '#ec4899', // Pink - countdown phase
  statusDanger: '#ef4444', // Red - stop/danger
};

/**
 * Spacing scale - Consistent spacing throughout app
 * Based on 0.25rem base unit (4px)
 */
export const spacing = {
  xs: 4, // 0.25rem
  sm: 8, // 0.5rem
  md: 16, // 1rem
  lg: 24, // 1.5rem
  xl: 32, // 2rem
  '2xl': 48, // 3rem
};

/**
 * Font sizes - Hierarchical typography scale
 */
export const fontSizes = {
  xxs: 8, // 0.5rem
  xs: 12, // 0.75rem
  sm: 14, // 0.875rem
  base: 16, // 1rem
  lg: 18, // 1.125rem
  xl: 24, // 1.5rem
  '2xl': 32, // 2rem
  '4xl': 64, // 4rem
};

/**
 * Font weights for typography hierarchy
 */
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Border radius values for consistent rounding
 */
export const borderRadius = {
  sm: 6, // 0.375rem
  md: 8, // 0.5rem
  lg: 12, // 0.75rem
};

/**
 * Transition/animation timing
 */
export const transitions = {
  fast: 150, // 150ms
  base: 250, // 250ms
};

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dialog: 1000,
  toast: 1001,
};

/**
 * Component-specific sizes
 */
export const sizes = {
  // Button sizes
  buttonSmall: 32,
  buttonBase: 48,
  buttonLarge: 56,

  // Input sizes
  inputSmall: 40,
  inputBase: 48,
  inputLarge: 56,

  // Icon sizes
  iconSmall: 16,
  iconBase: 24,
  iconLarge: 32,
};

/**
 * Shadow definitions for elevation
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

/**
 * Complete theme object for easy access
 */
export const theme = {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  borderRadius,
  transitions,
  zIndex,
  sizes,
  shadows,
};

/**
 * Type-safe theme access helper
 */
export type Theme = typeof theme;
