import React from 'react';
import { render } from '@testing-library/react';
import { WorkoutScreen } from '../../src/screens/WorkoutScreen';
import { WorkoutConfig } from '../../src/types';

describe('WorkoutScreen', () => {
  const mockConfig: WorkoutConfig = {
    secondsPerRep: 45,
    restBetweenReps: 15,
    repsPerSet: 10,
    numberOfSets: 3,
    restBetweenSets: 60,
  };

  const mockOnWorkoutComplete = jest.fn();
  const mockOnNavigateBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    const { getByText } = render(
      <WorkoutScreen
        config={mockConfig}
        onWorkoutComplete={mockOnWorkoutComplete}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    // Should show loading state initially
    expect(getByText(/initializing|pause|resume/i)).toBeDefined();
  });

  test('should be a function component', () => {
    expect(typeof WorkoutScreen).toBe('function');
    expect(WorkoutScreen.name).toBe('WorkoutScreen');
  });

  test('should accept all required props', () => {
    const props = {
      config: mockConfig,
      onWorkoutComplete: mockOnWorkoutComplete,
      onNavigateBack: mockOnNavigateBack,
    };

    const { container } = render(<WorkoutScreen {...props} />);
    expect(container).toBeDefined();
  });

  test('should accept config with various values', () => {
    const customConfig: WorkoutConfig = {
      secondsPerRep: 60,
      restBetweenReps: 20,
      repsPerSet: 15,
      numberOfSets: 5,
      restBetweenSets: 90,
    };

    const { container } = render(
      <WorkoutScreen
        config={customConfig}
        onWorkoutComplete={mockOnWorkoutComplete}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    expect(container).toBeDefined();
  });

  test('should render control buttons', async () => {
    const { findByText } = render(
      <WorkoutScreen
        config={mockConfig}
        onWorkoutComplete={mockOnWorkoutComplete}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    // Wait for component to load
    const stopButton = await findByText(/stop/i);
    expect(stopButton).toBeDefined();
  });

  test('should have display time initially', () => {
    const { getByText } = render(
      <WorkoutScreen
        config={mockConfig}
        onWorkoutComplete={mockOnWorkoutComplete}
        onNavigateBack={mockOnNavigateBack}
      />
    );

    // Should display time format like 00:00
    expect(getByText(/\d{1,2}:\d{2}/)).toBeDefined();
  });
});
