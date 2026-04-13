/**
 * styles.ts - Reusable style utilities and helpers
 * Provides style objects that work on both Web (CSS objects) and React Native
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme, colors, spacing, fontSizes } from './theme';

/**
 * Common flex utilities
 */
export const flexStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexStart: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  flexAround: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexEvenly: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

/**
 * Common spacing utilities
 */
export const spacingStyles = StyleSheet.create({
  pXs: { padding: spacing.xs },
  pSm: { padding: spacing.sm },
  pMd: { padding: spacing.md },
  pLg: { padding: spacing.lg },
  pXl: { padding: spacing.xl },

  mXs: { margin: spacing.xs },
  mSm: { margin: spacing.sm },
  mMd: { margin: spacing.md },
  mLg: { margin: spacing.lg },
  mXl: { margin: spacing.xl },

  pxXs: { paddingHorizontal: spacing.xs },
  pxSm: { paddingHorizontal: spacing.sm },
  pxMd: { paddingHorizontal: spacing.md },
  pxLg: { paddingHorizontal: spacing.lg },

  pyXs: { paddingVertical: spacing.xs },
  pySm: { paddingVertical: spacing.sm },
  pyMd: { paddingVertical: spacing.md },
  pyLg: { paddingVertical: spacing.lg },

  mxXs: { marginHorizontal: spacing.xs },
  mxSm: { marginHorizontal: spacing.sm },
  mxMd: { marginHorizontal: spacing.md },
  mxLg: { marginHorizontal: spacing.lg },

  myXs: { marginVertical: spacing.xs },
  mySm: { marginVertical: spacing.sm },
  myMd: { marginVertical: spacing.md },
  myLg: { marginVertical: spacing.lg },
});

/**
 * Common text styles
 */
export const textStyles = StyleSheet.create({
  textXs: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * 1.5,
  },
  textSm: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.5,
  },
  textBase: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * 1.5,
  },
  textLg: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * 1.5,
  },
  textXl: {
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * 1.5,
  },
  text2xl: {
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * 1.5,
  },
  text4xl: {
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * 1.3,
  },

  fontNormal: { fontWeight: '400' },
  fontMedium: { fontWeight: '500' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
});

/**
 * Color utilities
 */
export const colorStyles = StyleSheet.create({
  bgPrimary: { backgroundColor: colors.bgPrimary },
  bgSecondary: { backgroundColor: colors.bgSecondary },
  bgTertiary: { backgroundColor: colors.bgTertiary },

  textPrimary: { color: colors.textPrimary },
  textSecondary: { color: colors.textSecondary },
  textMuted: { color: colors.textMuted },

  accentPrimary: { color: colors.accentPrimary },
  accentDanger: { color: colors.statusDanger },
  accentWorking: { color: colors.statusWorking },
  accentResting: { color: colors.statusResting },
  accentCountdown: { color: colors.statusCountdown },
});

/**
 * Border and shape utilities
 */
export const shapeStyles = StyleSheet.create({
  radiusSm: { borderRadius: theme.borderRadius.sm },
  radiusMd: { borderRadius: theme.borderRadius.md },
  radiusLg: { borderRadius: theme.borderRadius.lg },

  borderSm: {
    borderWidth: 1,
    borderColor: colors.bgTertiary,
  },
  borderMd: {
    borderWidth: 2,
    borderColor: colors.bgTertiary,
  },
});

/**
 * Merge multiple style arrays/objects
 * Useful for combining utility styles with component styles
 */
export function mergeStyles(
  ...styles: (ViewStyle | TextStyle | ImageStyle | undefined | false | null)[]
) {
  return StyleSheet.flatten(styles);
}

/**
 * Create responsive style values based on screen width
 * Useful for different device sizes
 */
export function getResponsiveValue<T>(
  screenWidth: number,
  values: {
    small?: T;
    medium?: T;
    large?: T;
    default: T;
  }
): T {
  if (screenWidth < 400) return values.small ?? values.default;
  if (screenWidth < 768) return values.medium ?? values.default;
  return values.large ?? values.default;
}

/**
 * Shadow utilities for elevation
 */
export const shadowStyles = StyleSheet.create({
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  shadowBase: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  shadowXl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
});

/**
 * Common component style combinations
 */
export const componentStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  screenContainer: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  // Button base
  buttonBase: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: theme.sizes.buttonBase,
  },

  // Input base
  inputBase: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.bgTertiary,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    minHeight: theme.sizes.inputBase,
  },

  // Card style
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },

  // Section heading
  sectionHeading: {
    fontSize: fontSizes.xl,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginVertical: spacing.md,
  },
});
