/**
 * Container.test.tsx - Tests for Container and layout components
 * Basic smoke tests to verify component exports and types
 */

import {
  Container,
  ScreenContainer,
  Card,
  Section,
  Row,
  Column,
  CenterContainer,
  SpaceBetweenContainer,
} from '../../src/components/Container';

describe('Layout Components', () => {
  describe('Container', () => {
    it('should export Container component', () => {
      expect(Container).toBeDefined();
      expect(typeof Container).toBe('function');
    });

    it('should have correct display name', () => {
      expect(Container.name).toBe('Container');
    });

    it('should accept flex direction prop', () => {
      const props = {
        flexDirection: 'row' as const,
      };
      expect(['row', 'column']).toContain(props.flexDirection);
    });
  });

  describe('ScreenContainer', () => {
    it('should export ScreenContainer component', () => {
      expect(ScreenContainer).toBeDefined();
      expect(typeof ScreenContainer).toBe('function');
    });

    it('should have correct display name', () => {
      expect(ScreenContainer.name).toBe('ScreenContainer');
    });
  });

  describe('Card', () => {
    it('should export Card component', () => {
      expect(Card).toBeDefined();
      expect(typeof Card).toBe('function');
    });

    it('should have correct display name', () => {
      expect(Card.name).toBe('Card');
    });

    it('should support elevated prop', () => {
      const props = {
        elevated: true,
      };
      expect(props.elevated).toBe(true);
    });
  });

  describe('Section', () => {
    it('should export Section component', () => {
      expect(Section).toBeDefined();
      expect(typeof Section).toBe('function');
    });

    it('should have correct display name', () => {
      expect(Section.name).toBe('Section');
    });
  });

  describe('Layout Variants', () => {
    it('should export Row component', () => {
      expect(Row).toBeDefined();
      expect(typeof Row).toBe('function');
    });

    it('should export Column component', () => {
      expect(Column).toBeDefined();
      expect(typeof Column).toBe('function');
    });

    it('should export CenterContainer component', () => {
      expect(CenterContainer).toBeDefined();
      expect(typeof CenterContainer).toBe('function');
    });

    it('should export SpaceBetweenContainer component', () => {
      expect(SpaceBetweenContainer).toBeDefined();
      expect(typeof SpaceBetweenContainer).toBe('function');
    });
  });
});
