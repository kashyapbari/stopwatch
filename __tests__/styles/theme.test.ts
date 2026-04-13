/**
 * theme.test.ts - Tests for theme and design system
 * Verifies all design tokens are properly defined
 */

import {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  borderRadius,
  transitions,
  zIndex,
  sizes,
  shadows,
  theme,
} from '../../src/styles/theme';

describe('Theme Design System', () => {
  describe('Colors', () => {
    it('should have background colors', () => {
      expect(colors.bgPrimary).toBe('#0f172a');
      expect(colors.bgSecondary).toBe('#1e293b');
      expect(colors.bgTertiary).toBe('#334155');
    });

    it('should have text colors', () => {
      expect(colors.textPrimary).toBe('#f1f5f9');
      expect(colors.textSecondary).toBe('#94a3b8');
      expect(colors.textMuted).toBe('#64748b');
    });

    it('should have accent colors', () => {
      expect(colors.accentPrimary).toBe('#0ea5e9');
      expect(colors.accentHover).toBe('#0284c7');
      expect(colors.accentFocus).toBe('#0369a1');
    });

    it('should have status colors', () => {
      expect(colors.statusWorking).toBe('#10b981');
      expect(colors.statusResting).toBe('#f59e0b');
      expect(colors.statusCountdown).toBe('#ec4899');
      expect(colors.statusDanger).toBe('#ef4444');
    });
  });

  describe('Spacing', () => {
    it('should have spacing scale', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(16);
      expect(spacing.lg).toBe(24);
      expect(spacing.xl).toBe(32);
      expect(spacing['2xl']).toBe(48);
    });
  });

  describe('Font Sizes', () => {
    it('should have font size scale', () => {
      expect(fontSizes.xs).toBe(12);
      expect(fontSizes.sm).toBe(14);
      expect(fontSizes.base).toBe(16);
      expect(fontSizes.lg).toBe(18);
      expect(fontSizes.xl).toBe(24);
      expect(fontSizes['2xl']).toBe(32);
      expect(fontSizes['4xl']).toBe(64);
    });
  });

  describe('Font Weights', () => {
    it('should have font weight options', () => {
      expect(fontWeights.normal).toBe('400');
      expect(fontWeights.medium).toBe('500');
      expect(fontWeights.semibold).toBe('600');
      expect(fontWeights.bold).toBe('700');
    });
  });

  describe('Border Radius', () => {
    it('should have border radius values', () => {
      expect(borderRadius.sm).toBe(6);
      expect(borderRadius.md).toBe(8);
      expect(borderRadius.lg).toBe(12);
    });
  });

  describe('Transitions', () => {
    it('should have transition timings', () => {
      expect(transitions.fast).toBe(150);
      expect(transitions.base).toBe(250);
    });
  });

  describe('Z-Index', () => {
    it('should have z-index values', () => {
      expect(zIndex.base).toBe(0);
      expect(zIndex.dialog).toBe(1000);
      expect(zIndex.toast).toBe(1001);
    });
  });

  describe('Sizes', () => {
    it('should have component sizes', () => {
      expect(sizes.buttonSmall).toBe(32);
      expect(sizes.buttonBase).toBe(48);
      expect(sizes.buttonLarge).toBe(56);

      expect(sizes.inputSmall).toBe(40);
      expect(sizes.inputBase).toBe(48);
      expect(sizes.inputLarge).toBe(56);

      expect(sizes.iconSmall).toBe(16);
      expect(sizes.iconBase).toBe(24);
      expect(sizes.iconLarge).toBe(32);
    });
  });

  describe('Shadows', () => {
    it('should have shadow definitions', () => {
      expect(shadows.sm).toBeDefined();
      expect(shadows.base).toBeDefined();
      expect(shadows.lg).toBeDefined();
      expect(shadows.xl).toBeDefined();
      expect(typeof shadows.sm).toBe('string');
    });
  });

  describe('Theme object', () => {
    it('should export complete theme object', () => {
      expect(theme.colors).toBe(colors);
      expect(theme.spacing).toBe(spacing);
      expect(theme.fontSizes).toBe(fontSizes);
      expect(theme.fontWeights).toBe(fontWeights);
      expect(theme.borderRadius).toBe(borderRadius);
      expect(theme.transitions).toBe(transitions);
      expect(theme.zIndex).toBe(zIndex);
      expect(theme.sizes).toBe(sizes);
      expect(theme.shadows).toBe(shadows);
    });
  });
});
