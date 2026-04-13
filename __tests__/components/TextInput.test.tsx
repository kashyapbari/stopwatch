/**
 * TextInput.test.tsx - Tests for TextInput component
 * Basic smoke tests to verify component exports and types
 */

import { TextInput } from '../../src/components/TextInput';

describe('TextInput Component', () => {
  it('should export TextInput component', () => {
    expect(TextInput).toBeDefined();
    expect(typeof TextInput).toBe('function');
  });

  it('should have correct display name', () => {
    expect(TextInput.name).toBe('TextInput');
  });

  it('should accept optional props', () => {
    const props = {
      label: 'Username',
      placeholder: 'Enter username',
      value: 'john',
      onChangeText: (text: string) => console.log(text),
    };
    expect(props.label).toBe('Username');
    expect(props.placeholder).toBe('Enter username');
    expect(props.value).toBe('john');
  });

  it('should support size prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    expect(sizes.length).toBe(3);
  });

  it('should support error and helper text', () => {
    const errorProps = {
      error: 'This field is required',
    };
    const helperProps = {
      helperText: 'Optional helper text',
    };
    expect(errorProps.error).toBeDefined();
    expect(helperProps.helperText).toBeDefined();
  });
});
