import React from 'react';
import { render } from '@testing-library/react-native';

/* ================= MOCKS ================= */

// Mock react-native Platform properly
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Platform.OS = 'web';
  return RN;
});

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 10,
        longitude: 20,
      },
    })
  ),
}));

// Mock database
jest.mock('../../database', () => ({
  addTask: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

/* ================= IMPORT ================= */

import ExploreScreen from '../../app/(tabs)/explore';

/* ================= TEST ================= */

describe('ExploreScreen UI', () => {
  it('renders fallback UI on web', () => {
    const { getByText } = render(<ExploreScreen />);

    expect(getByText('Map only works on mobile')).toBeTruthy();
  });
});