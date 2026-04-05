Feature: Map Navigation

  Scenario: Add a new location
    Given the user taps on the map
    When the user enters location details
    Then a new pin should be added

  Scenario: Navigate to next destination
    Given multiple locations exist
    When the user selects next destination
    Then the next location should be shown