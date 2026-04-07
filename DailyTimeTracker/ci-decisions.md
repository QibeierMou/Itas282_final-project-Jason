# CI/CD Decisions – Daily Time Tracker

## Tech Stack
- React (Vite)
- JavaScript
- Node.js
- GitHub Actions

---

# 1. Linting Tools Comparison

## ESLint
- Industry standard for JavaScript
- Supports React plugins
- Highly configurable
- Integrates easily into CI pipelines

## JSHint
- Older linting tool
- Limited React-specific support
- Less modern ecosystem

### Decision
We selected **ESLint** because it is the industry standard, supports React well, and integrates easily with CI/CD pipelines.

---

# 2. Testing Tools Comparison

## Vitest
- Designed for Vite
- Fast and lightweight
- Built-in code coverage
- Easy configuration

## Jest
- Popular and mature testing framework
- Larger setup for Vite projects
- More configuration required

### Decision
We selected **Vitest** because it integrates natively with Vite and provides built-in code coverage support.

Minimum required code coverage: **80%**

---

# 3. Static Application Security Testing (SAST)

## GitHub CodeQL
- Native GitHub integration
- Automatically maintained rules
- No external setup required

## SonarCloud
- Cloud-based service
- Requires additional configuration

### Decision
We selected **GitHub CodeQL** due to native integration and ease of setup.

---

# 4. Software Composition Analysis (SCA)

## npm audit
- Built into npm
- Checks dependency vulnerabilities
- Simple CI integration

## Snyk
- Advanced scanning
- Requires account and configuration

### Decision
We selected **npm audit** because it requires no external services and integrates easily into CI.

---

# Pipeline Design

Order of execution:

1. Lint
2. Test (only if lint passes)
3. Security (only if lint passes)
4. Build (only if lint + test + security pass)
5. Deploy (only if build passes)

Artifacts are stored for 28 days.
Node modules caching is enabled for faster builds.

---

## BDD Tools Comparison

| Tool | Language | Pros | Cons |
|------|--------|------|------|
| Cucumber.js | JavaScript | Industry standard, Gherkin support | Slightly complex setup |
| jest-cucumber | JavaScript | Easy integration with Jest | Limited features |

### Decision
We chose **Cucumber.js** because it provides strong Gherkin support and aligns with industry standards for behavior-driven development.

---

## UI Testing Tools Comparison

| Tool | Pros | Cons |
|------|------|------|
| Jest | Fast and modern | Learning curve |
| Selenium | Very popular | Slower and complex |

### Decision
We chose **Playwright** because it is fast and works well with modern web applications.

---

## UAT / ADD Tools Comparison

| Tool | Pros | Cons |
|------|------|------|
| Robot Framework | Easy to read, business-focused | Uses Python |
| Cucumber.js | Already used for BDD | More developer-focused |

### Decision
We chose **Robot Framework** because it is easy to read and focuses on business-level testing.

---

## BDD Features

Feature: Task Management

  Scenario: Add a valid task
    Given the user is on the Edit screen
    When the user adds a task
    Then the task should appear in the list

  Scenario: Add task with missing information
    Given the user is on the Edit screen
    When the user does not enter task details
    Then an error message should be shown


Feature: Time Calculation

  Scenario: Calculate correct duration
    Given the user enters "10:00 AM" as start time
    And enters "11:00 AM" as end time
    Then the duration should be 60 minutes

  Scenario: Invalid time input
    Given the user enters "11:00 AM" as start time
    And enters "10:00 AM" as end time
    Then an error should be shown


Feature: Map Navigation

  Scenario: Add a new location
    Given the user taps on the map
    When the user enters location details
    Then a new pin should be added

  Scenario: Navigate to next destination
    Given multiple locations exist
    When the user selects next destination
    Then the next location should be shown