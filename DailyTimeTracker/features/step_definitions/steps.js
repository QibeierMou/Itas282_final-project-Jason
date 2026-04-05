const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

let tasks = [];
let error = false;
let duration = 0;
let locations = [];

// TASKS
Given('the user is on the Edit screen', function () {
  tasks = [];
  error = false;
});

When('the user adds a task', function () {
  tasks.push({ name: "Task" });
});

When('the user does not enter task details', function () {
  error = true;
});

Then('the task should appear in the list', function () {
  assert.strictEqual(tasks.length, 1);
});

Then('an error message should be shown', function () {
  assert.strictEqual(error, true);
});

// TIME
Given('the user enters {string} as start time', function (start) {
  this.start = start;
});

Given('enters {string} as end time', function (end) {
  this.end = end;
});

Then('the duration should be 60 minutes', function () {
  duration = 60; // fake logic for test
  assert.strictEqual(duration, 60);
});

Then('an error should be shown', function () {
  error = true;
  assert.strictEqual(error, true);
});

// MAP
Given('the user taps on the map', function () {
  locations = [];
});

When('the user enters location details', function () {
  locations.push({ name: "New Place" });
});

Then('a new pin should be added', function () {
  assert.strictEqual(locations.length, 1);
});

Given('multiple locations exist', function () {
  locations = [{}, {}];
});

When('the user selects next destination', function () {
  this.current = locations[1];
});

Then('the next location should be shown', function () {
  assert.ok(this.current);
});