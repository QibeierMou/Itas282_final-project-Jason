# CI/CD Pipeline - Final Configuration

**Project:** Daily Time Tracker Mobile App / Trackify
**Student:** Jason 

---

## What is This Document?

This document explains the security tools I chose for my mobile app and how my CI/CD pipeline works.

---

## Part 1: Security Tools I Chose

### 🔍 Tool #1: SCA (Checks Dependencies for Vulnerabilities)

**What does SCA do?**  
SCA scans the packages/libraries my app uses (like React Native, Expo, etc.) to find known security problems.

**My Tool Comparison:**

| Tool Name | Good Things | Bad Things | My Choice |
|-----------|-------------|------------|-----------|
| **npm audit** | • Already built into npm<br>• Very fast<br>• Free<br>• Easy to use | • Basic reports<br>• No fancy features | ✅ **I picked this one** |
| **Snyk** | • More detailed reports<br>• Can auto-fix issues<br>• Professional tool | • Need to create account<br>• Free version has limits | Could use later |

**Why I chose npm audit:**
- It's simple and already installed
- Works perfectly for a student project
- Gives me a list of vulnerable packages
- I can run it with just `npm audit`

**Example of what it finds:**
```
Found 3 vulnerabilities (1 moderate, 2 high)
- package-name: 1.2.3 has a security flaw
- Recommendation: Update to version 1.2.4
```

---

### 🛡️ Tool #2: SAST (Checks My Code for Security Problems)

**What does SAST do?**  
SAST reads my JavaScript/TypeScript code and looks for security mistakes I made.

**My Tool Comparison:**

| Tool Name | Good Things | Bad Things | My Choice |
|-----------|-------------|------------|-----------|
| **ESLint Security Plugin** | • Works with my existing ESLint<br>• Fast<br>• Free<br>• Easy to add | • Only checks JavaScript patterns<br>• Not super advanced | ✅ **I picked this one** |
| **SonarQube** | • Very powerful<br>• Used by professionals<br>• Great reports | • Hard to set up<br>• Needs a server<br>• Overkill for my project | Too complicated |

**Why I chose ESLint Security Plugin:**
- My project already uses ESLint
- Just had to add one plugin
- Finds common security mistakes
- Shows results right in VS Code

---

### 🔐 Tool #3: DAST (Checks the Built App for Security Problems)

**What does DAST do?**  
DAST tests the actual built app file (.apk for Android) to find security issues.

**My Tool Comparison:**

| Tool Name | Good Things | Bad Things | My Choice |
|-----------|-------------|------------|-----------|
| **MobSF** | • Made specifically for mobile apps<br>• Tests Android & iOS<br>• Free and open source | • Needs Docker to run<br>• Takes time to scan | ✅ **I picked this one** |
| **Firebase Test Lab** | • Easy to use<br>• Google's tool<br>| • Costs money<br>• Not focused on security | Not for security |

**Why I chose MobSF:**
- It's the standard tool for mobile app security
- Checks for common mobile security problems
- Scans the actual .apk file I built

## Part 2: How My Pipeline Works

Think of the pipeline like a factory assembly line. Each station checks something before moving forward.

### The Pipeline Steps:

```
1. LINT (Check Code Style)
   ↓
2. SECURITY SCANS (Check for Vulnerabilities)
   ├── SCA (Check packages)
   └── SAST (Check my code)
   ↓
3. TESTS (Make sure code works)
   ├── Unit Tests
   ├── BDD Tests
   └── UI Tests
   ↓
4. BUILD (Create the app)
   ↓
5. DAST (Check built app security)
   ↓
6. DEPLOY (Publish to Expo)
```

---

## Part 3: Reports & Artifacts

Every step saves a report for 28 days:

| Step | Report File | What's Inside |
|------|-------------|---------------|
| Lint | `lint-report.txt` | List of code style issues |
| SCA | `npm-audit-report.json` | Vulnerable packages found |
| SAST | `eslint-security-report.json` | Security bugs in my code |
| Tests | `test-report.json` | Which tests passed/failed |
| Build | `app-build.apk` | The actual app file |
| DAST | `mobsf-report.pdf` | Security scan results |

**Why save for 28 days?**  
So I can look back and see what went wrong if there's a problem.

---

## Part 4: How I Deploy (Publish the App)

For mobile apps, its not able to upload on digital ocean

---

## Part 5: Simple Summary

**What my pipeline does:**

1. **Checks my code style** (Linting)
2. **Scans for security problems** (SCA + SAST)
3. **Runs tests** to make sure code works
4. **Builds the app**
5. **Scans the built app** for security issues (DAST)
6. **Publishes to Expo** if everything passes

---

