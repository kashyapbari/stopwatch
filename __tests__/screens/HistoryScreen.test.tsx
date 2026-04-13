import React from 'react';
import { render } from '@testing-library/react';
import { HistoryScreen } from '../../src/screens/HistoryScreen';

describe('HistoryScreen', () => {
  const mockOnNavigateBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    const { getByText } = render(
      <HistoryScreen onNavigateBack={mockOnNavigateBack} />
    );

    expect(getByText('Workout History')).toBeDefined();
  });

  test('should render back button', () => {
    const { getByText } = render(
      <HistoryScreen onNavigateBack={mockOnNavigateBack} />
    );

    expect(getByText('Back to Setup')).toBeDefined();
  });

  test('should be a function component', () => {
    expect(typeof HistoryScreen).toBe('function');
    expect(HistoryScreen.name).toBe('HistoryScreen');
  });

  test('should accept required props', () => {
    const props = {
      onNavigateBack: mockOnNavigateBack,
    };

    const { getByText } = render(<HistoryScreen {...props} />);
    expect(getByText('Workout History')).toBeDefined();
  });

  test('should render loading state initially', () => {
    const { getByText } = render(
      <HistoryScreen onNavigateBack={mockOnNavigateBack} />
    );

    // Should show loading or empty state message
    expect(
      getByText(/loading|no workout history|complete a workout/i)
    ).toBeDefined();
  });
});
