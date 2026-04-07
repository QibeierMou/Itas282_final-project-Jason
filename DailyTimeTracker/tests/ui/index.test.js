import React from 'react';
import { render } from '@testing-library/react-native';

// Mock navigation if used
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
}));

// Import your screen (adjust path if needed)
import IndexScreen from '../../app/(tabs)/index';

describe('Index Screen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<IndexScreen />);
    expect(toJSON()).toBeTruthy();
  });
});