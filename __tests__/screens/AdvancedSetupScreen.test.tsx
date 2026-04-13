import React from 'react';
import { render } from '@testing-library/react';
import { AdvancedSetupScreen } from '../../src/screens/AdvancedSetupScreen';

describe('AdvancedSetupScreen', () => {
  const mockOnStartWorkout = jest.fn();
  const mockOnNavigateBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    const { getByText } = render(
      <AdvancedSetupScreen
        onStartWorkout={mockOnStartWorkout}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    expect(getByText('Advanced Setup')).toBeDefined();
  });

  test('should render all input fields', () => {
    const { getByText } = render(
      <AdvancedSetupScreen
        onStartWorkout={mockOnStartWorkout}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    expect(getByText('Seconds Per Rep')).toBeDefined();
    expect(getByText('Rest Between Reps (seconds)')).toBeDefined();
    expect(getByText('Reps Per Set')).toBeDefined();
    expect(getByText('Number of Sets')).toBeDefined();
    expect(getByText('Rest Between Sets (seconds)')).toBeDefined();
    expect(getByText('Preset Name (optional)')).toBeDefined();
  });

  test('should render action buttons', () => {
    const { getByText } = render(
      <AdvancedSetupScreen
        onStartWorkout={mockOnStartWorkout}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    expect(getByText('Start Workout')).toBeDefined();
    expect(getByText('Save as Preset')).toBeDefined();
    expect(getByText('Back')).toBeDefined();
  });

  test('should be a function component', () => {
    expect(typeof AdvancedSetupScreen).toBe('function');
    expect(AdvancedSetupScreen.name).toBe('AdvancedSetupScreen');
  });

  test('should accept all required props', () => {
    const props = {
      onStartWorkout: mockOnStartWorkout,
      onNavigateBack: mockOnNavigateBack,
    };

    const { getByText } = render(<AdvancedSetupScreen {...props} />);
    expect(getByText('Advanced Setup')).toBeDefined();
  });
});
