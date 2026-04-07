import React from 'react';
import { render } from '@testing-library/react-native';

// Mock router if used
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getAllAsync: jest.fn(() => []),
    getFirstAsync: jest.fn(() => null),
  })),
}));

// Import your edit screen (adjust path if needed)
import EditScreen from '../../app/(tabs)/edit';

describe('Edit Screen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<EditScreen />);
    expect(toJSON()).toBeTruthy();
  });
});