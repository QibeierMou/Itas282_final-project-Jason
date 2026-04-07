import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import EditScreen from '../../app/(tabs)/edit';
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

describe('Edit Screen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<EditScreen />);
    expect(toJSON()).toBeTruthy();
  });
});