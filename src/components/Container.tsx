/**
 * Container.tsx - Reusable container and layout components
 * Provides common layout patterns (flex, grid, sections, etc.)
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  ScrollViewProps,
  Text as RNText,
} from 'react-native';
import { colors, spacing, fontSizes } from '../styles/theme';

/**
 * Container component props
 */
export interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  flex?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  gap?: number;
  backgroundColor?: string;
  borderRadius?: number;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

/**
 * Styles for container component
 */
const styles = StyleSheet.create({
  base: {
    flexDirection: 'column',
  },

  fullWidth: {
    width: '100%',
  },

  fullHeight: {
    height: '100%',
  },
});

/**
 * Container component - Flexible layout container
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  flex,
  flexDirection = 'column',
  justifyContent,
  alignItems,
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  gap,
  backgroundColor,
  borderRadius,
  fullWidth = false,
  fullHeight = false,
}) => {
  const containerStyle: ViewStyle = {
    flex,
    flexDirection,
    justifyContent,
    alignItems,
    padding,
    paddingHorizontal,
    paddingVertical,
    margin,
    marginHorizontal,
    marginVertical,
    gap,
    backgroundColor,
    borderRadius,
  };

  const computedStyle = [
    styles.base,
    fullWidth && styles.fullWidth,
    fullHeight && styles.fullHeight,
    containerStyle,
    style,
  ];

  return <View style={computedStyle}>{children}</View>;
};

/**
 * Screen container props - Full screen container
 */
export interface ScreenContainerProps extends ScrollViewProps {
  children: React.ReactNode;
}

/**
 * Screen container component - Full screen scrollable container
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, ...props }) => {
  const containerStyle = {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  };

  return (
    <ScrollView
      {...props}
      style={containerStyle}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
      }}
      scrollEnabled={true}
    >
      {children}
    </ScrollView>
  );
};

/**
 * Card component props
 */
export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

const cardStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },

  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

/**
 * Card component - Content card with consistent styling
 */
export const Card: React.FC<CardProps> = ({ children, style, onPress, elevated = false }) => {
  const cardStyle = [cardStyles.base, elevated && cardStyles.elevated, style];

  if (onPress) {
    // Implement as TouchableOpacity if pressable
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

/**
 * Section component props
 */
export interface SectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  gap?: number;
}

const sectionStyles = StyleSheet.create({
  base: {
    marginVertical: spacing.lg,
  },

  title: {
    fontSize: fontSizes.lg,
    fontWeight: '600' as const,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});

/**
 * Section component - Grouped content section with optional title
 */
export const Section: React.FC<SectionProps> = ({ children, style, title, gap = spacing.md }) => {
  return (
    <View style={[sectionStyles.base, style]}>
      {title && <RNText style={sectionStyles.title}>{title}</RNText>}
      <View style={{ gap }}>{children}</View>
    </View>
  );
};

/**
 * Note: Using RNText directly to avoid circular imports
 */

/**
 * Row component - Horizontal flex container
 */
export const Row: React.FC<ContainerProps> = (props) => {
  return <Container {...props} flexDirection="row" />;
};

/**
 * Column component - Vertical flex container
 */
export const Column: React.FC<ContainerProps> = (props) => {
  return <Container {...props} flexDirection="column" />;
};

/**
 * CenterContainer - Center aligned container
 */
export const CenterContainer: React.FC<ContainerProps> = (props) => {
  return <Container {...props} justifyContent="center" alignItems="center" />;
};

/**
 * SpaceBetweenContainer - Space between aligned container
 */
export const SpaceBetweenContainer: React.FC<ContainerProps> = (props) => {
  return (
    <Container {...props} flexDirection="row" justifyContent="space-between" alignItems="center" />
  );
};

export default Container;
