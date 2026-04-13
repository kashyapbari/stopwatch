/**
 * Text.tsx - Reusable text component with typography variants
 * Provides consistent text styling across the application
 */

import React from 'react';
import { StyleSheet, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { colors, fontSizes } from '../styles/theme';

/**
 * Text size types
 */
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '4xl';

/**
 * Text weight types
 */
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Text color types
 */
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

/**
 * Text component props
 */
export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** Text size */
  size?: TextSize;

  /** Text weight/font-weight */
  weight?: TextWeight;

  /** Text color */
  color?: TextColor;

  /** Custom color override */
  customColor?: string;

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';

  /** Custom text style */
  style?: TextStyle;

  /** Children text */
  children: React.ReactNode;
}

/**
 * Styles for text variants
 */
const styles = StyleSheet.create({
  // Size styles
  sizeXs: {
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * 1.5,
  },
  sizeSm: {
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.5,
  },
  sizeBase: {
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * 1.5,
  },
  sizeLg: {
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * 1.5,
  },
  sizeXl: {
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * 1.5,
  },
  size2xl: {
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * 1.3,
  },
  size4xl: {
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * 1.2,
  },

  // Weight styles
  weightNormal: {
    fontWeight: '400' as const,
  },
  weightMedium: {
    fontWeight: '500' as const,
  },
  weightSemibold: {
    fontWeight: '600' as const,
  },
  weightBold: {
    fontWeight: '700' as const,
  },

  // Color styles
  colorPrimary: {
    color: colors.textPrimary,
  },
  colorSecondary: {
    color: colors.textSecondary,
  },
  colorMuted: {
    color: colors.textMuted,
  },
  colorDanger: {
    color: colors.statusDanger,
  },
  colorSuccess: {
    color: colors.statusWorking,
  },
  colorWarning: {
    color: colors.statusResting,
  },
  colorInfo: {
    color: colors.accentPrimary,
  },

  // Alignment styles
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignJustify: {
    textAlign: 'justify',
  },
});

/**
 * Text component - Reusable text with typography variants
 */
export const Text: React.FC<TextProps> = ({
  size = 'base',
  weight = 'normal',
  color = 'primary',
  customColor,
  align = 'left',
  style,
  children,
  ...props
}) => {
  // Get size style
  const getSizeStyle = () => {
    switch (size) {
      case 'xs':
        return styles.sizeXs;
      case 'sm':
        return styles.sizeSm;
      case 'base':
        return styles.sizeBase;
      case 'lg':
        return styles.sizeLg;
      case 'xl':
        return styles.sizeXl;
      case '2xl':
        return styles.size2xl;
      case '4xl':
        return styles.size4xl;
      default:
        return styles.sizeBase;
    }
  };

  // Get weight style
  const getWeightStyle = () => {
    switch (weight) {
      case 'normal':
        return styles.weightNormal;
      case 'medium':
        return styles.weightMedium;
      case 'semibold':
        return styles.weightSemibold;
      case 'bold':
        return styles.weightBold;
      default:
        return styles.weightNormal;
    }
  };

  // Get color style
  const getColorStyle = () => {
    if (customColor) {
      return { color: customColor };
    }

    switch (color) {
      case 'primary':
        return styles.colorPrimary;
      case 'secondary':
        return styles.colorSecondary;
      case 'muted':
        return styles.colorMuted;
      case 'danger':
        return styles.colorDanger;
      case 'success':
        return styles.colorSuccess;
      case 'warning':
        return styles.colorWarning;
      case 'info':
        return styles.colorInfo;
      default:
        return styles.colorPrimary;
    }
  };

  // Get alignment style
  const getAlignStyle = () => {
    switch (align) {
      case 'left':
        return styles.alignLeft;
      case 'center':
        return styles.alignCenter;
      case 'right':
        return styles.alignRight;
      case 'justify':
        return styles.alignJustify;
      default:
        return styles.alignLeft;
    }
  };

  const textStyle = [getSizeStyle(), getWeightStyle(), getColorStyle(), getAlignStyle(), style];

  return (
    <RNText {...props} style={textStyle}>
      {children}
    </RNText>
  );
};

export default Text;
