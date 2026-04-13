/**
 * Button.tsx - Reusable button component with multiple variants
 * Supports primary, secondary, tertiary, and danger variants
 * Works consistently across Web and React Native
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius as br } from '../styles/theme';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props
 */
export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button label text */
  label: string;

  /** Button variant style */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Is button disabled */
  disabled?: boolean;

  /** Is button loading */
  loading?: boolean;

  /** Callback when button is pressed */
  onPress?: () => void;

  /** Custom style */
  style?: ViewStyle;

  /** Icon element (optional, appears before text) */
  icon?: React.ReactNode;

  /** Full width button */
  fullWidth?: boolean;

  /** Text style override */
  textStyle?: TextStyle;
}

/**
 * Styles for button variants
 */
const styles = StyleSheet.create({
  // Variant styles
  variantPrimary: {
    backgroundColor: colors.accentPrimary,
  },

  variantSecondary: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
  },

  variantTertiary: {
    backgroundColor: colors.bgTertiary,
  },

  variantDanger: {
    backgroundColor: colors.statusDanger,
  },

  // Size styles
  sizeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 32,
  },

  sizeMedium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },

  sizeLarge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },

  // Base styles
  base: {
    borderRadius: br.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },

  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },

  // Text styles
  textBase: {
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },

  textSmall: {
    fontSize: fontSizes.sm,
  },

  textMedium: {
    fontSize: fontSizes.base,
  },

  textLarge: {
    fontSize: fontSizes.lg,
  },

  textPrimary: {
    color: '#ffffff',
  },

  textSecondary: {
    color: colors.accentPrimary,
  },

  textTertiary: {
    color: colors.textPrimary,
  },

  textDanger: {
    color: '#ffffff',
  },
});

/**
 * Button component - Reusable button with variant support
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  style,
  icon,
  fullWidth = false,
  textStyle,
  ...props
}) => {
  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.variantPrimary;
      case 'secondary':
        return styles.variantSecondary;
      case 'tertiary':
        return styles.variantTertiary;
      case 'danger':
        return styles.variantDanger;
      default:
        return styles.variantPrimary;
    }
  };

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.sizeSmall;
      case 'medium':
        return styles.sizeMedium;
      case 'large':
        return styles.sizeLarge;
      default:
        return styles.sizeMedium;
    }
  };

  // Get text color style
  const getTextColorStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.textPrimary;
      case 'secondary':
        return styles.textSecondary;
      case 'tertiary':
        return styles.textTertiary;
      case 'danger':
        return styles.textDanger;
      default:
        return styles.textPrimary;
    }
  };

  // Get text size style
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'medium':
        return styles.textMedium;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const buttonStyle = [
    styles.base,
    getVariantStyle(),
    getSizeStyle(),
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  const textColor = getTextColorStyle();
  const textSize = getTextSizeStyle();

  return (
    <TouchableOpacity
      {...props}
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'secondary'
              ? colors.accentPrimary
              : variant === 'tertiary'
                ? colors.textPrimary
                : '#ffffff'
          }
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.textBase, textColor, textSize, textStyle]} numberOfLines={1}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
