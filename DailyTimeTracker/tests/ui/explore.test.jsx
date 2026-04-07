import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react-native';
import ExploreScreen from '../../app/(tabs)/explore';
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

/* ================= TEST ================= */

describe('ExploreScreen UI', () => {
  it('renders fallback UI on web', () => {
    const { getByText } = render(<ExploreScreen />);

    expect(getByText('Map only works on mobile')).toBeTruthy();
  });
});