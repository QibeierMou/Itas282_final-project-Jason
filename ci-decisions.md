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