/**
 * TextInput.tsx - Reusable text input component
 * Provides consistent input styling and behavior across platforms
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
  Text as RNText,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius as br } from '../styles/theme';

/**
 * TextInput component props
 */
export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  /** Input label (displayed above input) */
  label?: string;

  /** Helper text (displayed below input) */
  helperText?: string;

  /** Error message (displayed in red below input) */
  error?: string;

  /** Input size */
  size?: 'small' | 'medium' | 'large';

  /** Is input disabled */
  disabled?: boolean;

  /** Placeholder text */
  placeholder?: string;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Full width input */
  fullWidth?: boolean;

  /** On change callback */
  onChangeText?: (text: string) => void;

  /** Current value */
  value?: string;
}

/**
 * Styles for text input component
 */
const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },

  fullWidth: {
    width: '100%',
  },

  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  // Size styles
  sizeSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: fontSizes.sm,
    minHeight: 40,
  },

  sizeMedium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.base,
    minHeight: 48,
  },

  sizeLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.lg,
    minHeight: 56,
  },

  // Base input styles
  inputBase: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.bgTertiary,
    borderRadius: br.md,
    color: colors.textPrimary,
    fontWeight: '400' as const,
  },

  inputFocused: {
    borderColor: colors.accentPrimary,
  },

  inputError: {
    borderColor: colors.statusDanger,
  },

  inputDisabled: {
    backgroundColor: colors.bgTertiary,
    opacity: 0.5,
  },

  // Helper and error text
  helperText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  errorText: {
    fontSize: fontSizes.xs,
    color: colors.statusDanger,
    marginTop: spacing.xs,
  },
});

/**
 * TextInput component - Reusable text input with label and validation
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  size = 'medium',
  disabled = false,
  placeholder,
  containerStyle,
  fullWidth = false,
  onChangeText,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Get size style
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

  const inputStyle = [
    styles.inputBase,
    getSizeStyle(),
    ...(isFocused && !error ? [styles.inputFocused] : []),
    ...(error ? [styles.inputError] : []),
    ...(disabled ? [styles.inputDisabled] : []),
  ];

  const containerStyles = [styles.container, fullWidth && styles.fullWidth, containerStyle];

  return (
    <View style={containerStyles}>
      {label && <RNText style={styles.label}>{label}</RNText>}

      <RNTextInput
        {...props}
        style={inputStyle}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {error ? (
        <RNText style={styles.errorText}>{error}</RNText>
      ) : helperText ? (
        <RNText style={styles.helperText}>{helperText}</RNText>
      ) : null}
    </View>
  );
};

export default TextInput;
