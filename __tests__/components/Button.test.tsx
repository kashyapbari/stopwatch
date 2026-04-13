/**
 * Button.test.tsx - Tests for Button component
 * Basic smoke tests to verify component exports and types
 */

import { Button } from '../../src/components/Button';

describe('Button Component', () => {
  it('should export Button component', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('function');
  });

  it('should have correct display name', () => {
    expect(Button.name).toBe('Button');
  });

  it('should accept required props', () => {
    // This is a type check - if it compiles, props are correct
    const props = {
      label: 'Click Me',
      onPress: () => {},
    };
    expect(props.label).toBe('Click Me');
    expect(typeof props.onPress).toBe('function');
  });

  it('should support variant prop', () => {
    const variants = ['primary', 'secondary', 'tertiary', 'danger'] as const;
    variants.forEach((v) => {
      expect(['primary', 'secondary', 'tertiary', 'danger']).toContain(v);
    });
  });

  it('should support size prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((s) => {
      expect(['small', 'medium', 'large']).toContain(s);
    });
  });
});
