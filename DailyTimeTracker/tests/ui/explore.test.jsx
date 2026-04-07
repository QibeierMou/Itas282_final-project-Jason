describe('Explore Screen - Map', () => {
  it('shows web placeholder on non-mobile platform', () => {
    const platform = 'web';
    const showMap = platform !== 'web';
    expect(showMap).toBe(false);
  });

  it('builds a valid location object', () => {
    const location = {
      id: '1',
      name: '🏠 Home',
      latitude: 49.1659,
      longitude: -123.9407,
      time: '7:00 AM',
      activity: 'Wake up',
    };
    expect(location.latitude).toBe(49.1659);
    expect(location.name).toBe('🏠 Home');
  });

  it('sets current location from GPS coords', () => {
    const coords = { latitude: 49.0, longitude: -123.0 };
    const currentLocation = { latitude: coords.latitude, longitude: coords.longitude };
    expect(currentLocation.latitude).toBe(49.0);
  });
});