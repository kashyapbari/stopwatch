import React from 'react';
import { render } from '@testing-library/react';
import { QuickSetupScreen } from '../../src/screens/QuickSetupScreen';

describe('QuickSetupScreen', () => {
  const mockOnStartWorkout = jest.fn();
  const mockOnNavigateToAdvanced = jest.fn();
  const mockOnNavigateToHistory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    const { getByText } = render(
      <QuickSetupScreen
        onStartWorkout={mockOnStartWorkout}
        onNavigateToAdvanced={mockOnNavigateToAdvanced}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(getByText('Workout Timer')).toBeDefined();
    expect(getByText('Quick Setup')).toBeDefined();
  });

  test('should render all input fields', () => {
    const { getByText } = render(
      <QuickSetupScreen
        onStartWorkout={mockOnStartWorkout}
        onNavigateToAdvanced={mockOnNavigateToAdvanced}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(getByText('Seconds Per Rep')).toBeDefined();
    expect(getByText('Rest Between Reps (seconds)')).toBeDefined();
    expect(getByText('Reps Per Set')).toBeDefined();
    expect(getByText('Number of Sets')).toBeDefined();
    expect(getByText('Rest Between Sets (seconds)')).toBeDefined();
  });

  test('should render action buttons', () => {
    const { getByText } = render(
      <QuickSetupScreen
        onStartWorkout={mockOnStartWorkout}
        onNavigateToAdvanced={mockOnNavigateToAdvanced}
        onNavigateToHistory={mockOnNavigateToHistory}
      />
    );

    expect(getByText('Start Workout')).toBeDefined();
    expect(getByText('Advanced Setup')).toBeDefined();
    expect(getByText('View History')).toBeDefined();
  });

  test('should be a function component', () => {
    expect(typeof QuickSetupScreen).toBe('function');
    expect(QuickSetupScreen.name).toBe('QuickSetupScreen');
  });

  test('should accept all required props', () => {
    const props = {
      onStartWorkout: mockOnStartWorkout,
      onNavigateToAdvanced: mockOnNavigateToAdvanced,
      onNavigateToHistory: mockOnNavigateToHistory,
    };

    const { getByText } = render(<QuickSetupScreen {...props} />);
    expect(getByText('Workout Timer')).toBeDefined();
  });
});
