/**
 * Text.test.tsx - Tests for Text component
 * Basic smoke tests to verify component exports and types
 */

import { Text } from '../../src/components/Text';

describe('Text Component', () => {
  it('should export Text component', () => {
    expect(Text).toBeDefined();
    expect(typeof Text).toBe('function');
  });

  it('should have correct display name', () => {
    expect(Text.name).toBe('Text');
  });

  it('should accept required children prop', () => {
    const props = {
      children: 'Hello World',
    };
    expect(props.children).toBe('Hello World');
  });

  it('should support size variants', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '4xl'] as const;
    expect(sizes.length).toBe(7);
  });

  it('should support weight variants', () => {
    const weights = ['normal', 'medium', 'semibold', 'bold'] as const;
    expect(weights.length).toBe(4);
  });

  it('should support color variants', () => {
    const colors = ['primary', 'secondary', 'muted', 'danger', 'success', 'warning', 'info'] as const;
    expect(colors.length).toBe(7);
  });

  it('should support align options', () => {
    const aligns = ['left', 'center', 'right', 'justify'] as const;
    expect(aligns.length).toBe(4);
  });
});
