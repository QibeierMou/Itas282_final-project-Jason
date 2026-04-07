import React from 'react';
import { render } from '@testing-library/react-native';
import IndexScreen from '../../app/(tabs)/index';
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

describe('Index Screen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<IndexScreen />);
    expect(toJSON()).toBeTruthy();
  });
});