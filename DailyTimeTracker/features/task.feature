Feature: Task Management

  Scenario: Add a valid task
    Given the user is on the Edit screen
    When the user adds a task
    Then the task should appear in the list

  Scenario: Add task with missing information
    Given the user is on the Edit screen
    When the user does not enter task details
    Then an error message should be shown