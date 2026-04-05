Feature: Time Calculation

  Scenario: Calculate correct duration
    Given the user enters "10:00 AM" as start time
    And enters "11:00 AM" as end time
    Then the duration should be 60 minutes

  Scenario: Invalid time input
    Given the user enters "11:00 AM" as start time
    And enters "10:00 AM" as end time
    Then an error should be shown