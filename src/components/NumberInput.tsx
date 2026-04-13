/**
 * NumberInput.tsx - Number input with +/- buttons on the same line as label
 * Provides an intuitive way to adjust numeric values with increment/decrement buttons
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  ViewStyle,
  Text as RNText,
  Pressable,
} from 'react-native';
import { colors, spacing, fontSizes } from '../styles/theme';

export interface NumberInputProps {
  /** Input label */
  label: string;

  /** Current value as string */
  value: string;

  /** Callback when value changes */
  onChangeText: (value: string) => void;

  /** Custom container style */
  containerStyle?: ViewStyle;

  /** Minimum allowed value */
  min?: number;

  /** Maximum allowed value */
  max?: number;

  /** Suffix to display after value (e.g., 's' for seconds) */
  suffix?: string;
}

/**
 * NumberInput component - Number input with label and +/- buttons on same line
 * Layout: Label -[input]+ with optional suffix
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChangeText,
  containerStyle,
  min = 1,
  max = 999,
  suffix = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const numValue = parseInt(value, 10) || 0;

  const handleDecrement = () => {
    const newValue = Math.max(numValue - 1, min);
    onChangeText(newValue.toString());
  };

  const handleIncrement = () => {
    const newValue = Math.min(numValue + 1, max);
    onChangeText(newValue.toString());
  };

  const handleChangeText = (text: string) => {
    // Allow empty string for editing, but validate on blur
    if (text === '') {
      onChangeText(text);
      return;
    }

    // Only allow numeric input
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue)) {
      const constrainedValue = Math.max(min, Math.min(numericValue, max));
      onChangeText(constrainedValue.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Ensure a valid value when input loses focus
    if (value === '' || isNaN(parseInt(value, 10))) {
      onChangeText(min.toString());
    }
  };

  const inputStyle = [styles.inputBase];

  const wrapperStyle = [styles.inputWrapper, isFocused && styles.inputFocused];

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <RNText style={styles.label}>{label}</RNText>

      {/* Input with buttons container */}
      <View style={styles.inputGroupContainer}>
        {/* Minus button */}
        <Pressable
          onPress={handleDecrement}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <RNText style={styles.buttonText}>−</RNText>
        </Pressable>

        {/* Number input with suffix wrapper */}
        <View style={wrapperStyle}>
          <RNTextInput
            style={inputStyle}
            value={value}
            onChangeText={handleChangeText}
            keyboardType="number-pad"
            textAlign="center"
            placeholderTextColor={colors.textMuted}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            maxLength={3}
          />
          {suffix && <RNText style={styles.suffix}>{suffix}</RNText>}
        </View>

        {/* Plus button */}
        <Pressable
          onPress={handleIncrement}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <RNText style={styles.buttonText}>+</RNText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },

  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    minWidth: 60,
    marginRight: spacing.xs,
  },

  inputGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'flex-end',
  },

  button: {
    width: 24,
    height: 28,
    borderRadius: 0,
    backgroundColor: colors.accentPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: fontSizes.sm,
    fontWeight: '600' as const,
    color: colors.bgPrimary,
    textAlign: 'center',
  },

  inputBase: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.textPrimary,
    fontWeight: '400' as const,
    fontSize: fontSizes.sm,
    paddingHorizontal: 0,
    paddingVertical: 2,
    width: 35,
    textAlign: 'center',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.bgTertiary,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    minHeight: 28,
  },

  suffix: {
    fontSize: fontSizes.xs,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginLeft: 0,
  },

  inputFocused: {
    borderColor: colors.accentPrimary,
  },
});

export default NumberInput;
