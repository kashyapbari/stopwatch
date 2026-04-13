/**
 * styles.test.ts - Tests for style utilities
 * Verifies all style helpers are properly defined
 */

import {
  flexStyles,
  spacingStyles,
  textStyles,
  colorStyles,
  shapeStyles,
  shadowStyles,
  componentStyles,
  mergeStyles,
  getResponsiveValue,
} from '../../src/styles/styles';

describe('Style Utilities', () => {
  describe('Flex Styles', () => {
    it('should have flex utility styles', () => {
      expect(flexStyles.flex).toBeDefined();
      expect(flexStyles.flexRow).toBeDefined();
      expect(flexStyles.flexCenter).toBeDefined();
      expect(flexStyles.flexBetween).toBeDefined();
    });

    it('flex style should have flex property', () => {
      expect(flexStyles.flex.flex).toBe(1);
    });

    it('flexRow should have flexDirection row', () => {
      expect(flexStyles.flexRow.flexDirection).toBe('row');
    });
  });

  describe('Spacing Styles', () => {
    it('should have padding utility styles', () => {
      expect(spacingStyles.pXs).toBeDefined();
      expect(spacingStyles.pSm).toBeDefined();
      expect(spacingStyles.pMd).toBeDefined();
    });

    it('should have margin utility styles', () => {
      expect(spacingStyles.mXs).toBeDefined();
      expect(spacingStyles.mSm).toBeDefined();
      expect(spacingStyles.mMd).toBeDefined();
    });
  });

  describe('Text Styles', () => {
    it('should have text size styles', () => {
      expect(textStyles.textXs).toBeDefined();
      expect(textStyles.textSm).toBeDefined();
      expect(textStyles.textBase).toBeDefined();
      expect(textStyles.textLg).toBeDefined();
    });

    it('should have font weight styles', () => {
      expect(textStyles.fontNormal).toBeDefined();
      expect(textStyles.fontMedium).toBeDefined();
      expect(textStyles.fontSemibold).toBeDefined();
      expect(textStyles.fontBold).toBeDefined();
    });
  });

  describe('Color Styles', () => {
    it('should have background color styles', () => {
      expect(colorStyles.bgPrimary).toBeDefined();
      expect(colorStyles.bgSecondary).toBeDefined();
    });

    it('should have text color styles', () => {
      expect(colorStyles.textPrimary).toBeDefined();
      expect(colorStyles.textSecondary).toBeDefined();
    });
  });

  describe('Shape Styles', () => {
    it('should have border radius styles', () => {
      expect(shapeStyles.radiusSm).toBeDefined();
      expect(shapeStyles.radiusMd).toBeDefined();
      expect(shapeStyles.radiusLg).toBeDefined();
    });

    it('should have border styles', () => {
      expect(shapeStyles.borderSm).toBeDefined();
      expect(shapeStyles.borderMd).toBeDefined();
    });
  });

  describe('Shadow Styles', () => {
    it('should have shadow utility styles', () => {
      expect(shadowStyles.shadowSm).toBeDefined();
      expect(shadowStyles.shadowBase).toBeDefined();
      expect(shadowStyles.shadowLg).toBeDefined();
      expect(shadowStyles.shadowXl).toBeDefined();
    });
  });

  describe('Component Styles', () => {
    it('should have common component styles', () => {
      expect(componentStyles.container).toBeDefined();
      expect(componentStyles.screenContainer).toBeDefined();
      expect(componentStyles.contentContainer).toBeDefined();
      expect(componentStyles.buttonBase).toBeDefined();
      expect(componentStyles.inputBase).toBeDefined();
      expect(componentStyles.card).toBeDefined();
    });
  });

  describe('mergeStyles', () => {
    it('should merge multiple styles', () => {
      const style1 = { padding: 10 };
      const style2 = { margin: 5 };
      const merged = mergeStyles(style1, style2);

      expect(merged).toBeDefined();
    });

    it('should handle falsy values', () => {
      const style1 = { padding: 10 };
      const merged = mergeStyles(style1, false, null, undefined);

      expect(merged).toBeDefined();
    });
  });

  describe('getResponsiveValue', () => {
    it('should return small value for small screens', () => {
      const result = getResponsiveValue(300, {
        small: 'small-value',
        default: 'default-value',
      });
      expect(result).toBe('small-value');
    });

    it('should return medium value for medium screens', () => {
      const result = getResponsiveValue(500, {
        medium: 'medium-value',
        default: 'default-value',
      });
      expect(result).toBe('medium-value');
    });

    it('should return large value for large screens', () => {
      const result = getResponsiveValue(900, {
        large: 'large-value',
        default: 'default-value',
      });
      expect(result).toBe('large-value');
    });

    it('should return default when size variant not provided', () => {
      const result = getResponsiveValue(500, {
        default: 'default-value',
      });
      expect(result).toBe('default-value');
    });
  });
});
