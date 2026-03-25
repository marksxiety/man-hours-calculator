# Testing Guide

This guide covers how to test the Man-Hours Calculator, including unit tests, linting, and build verification.

---

## Overview

The project uses the following testing and quality assurance tools:

| Tool | Purpose | Command |
|------|---------|---------|
| **Vitest** | Unit and integration testing | `npm run test` |
| **TypeScript** | Static type checking | `npm run type-check` |
| **ESLint** | Code quality and style | `npm run lint` |
| **Vue TSC** | Vue component type checking | Included in type-check |
| **GitHub Actions** | Continuous integration | Automated on push/PR |

---

## Unit Testing

### Running Tests

#### Watch Mode (Recommended for Development)
```bash
npm run test
```
- Runs tests in watch mode
- Re-runs tests on file changes
- Shows coverage in terminal
- Great for TDD workflow

#### One-Time Run (CI Mode)
```bash
npm run test:run
```
- Runs all tests once
- Exits with code 1 if any test fails
- Used in CI/CD pipelines

#### Interactive UI
```bash
npm run test:ui
```
- Opens a web-based test UI
- Visual test explorer
- Coverage reports
- Great for debugging failed tests

### Test Structure

Tests are co-located with the code they test:

```
src/
├── utils/
│   ├── calculateExpectedTime.ts
│   └── __tests__/
│       └── calculateExpectedTime.test.ts
├── stores/
│   ├── projectStore.ts
│   └── __tests__/
│       └── projectStore.test.ts
```

### Writing Tests

Tests should cover:

- **Business logic**: Calculations, state management, data transformations
- **Component behavior**: User interactions, events, conditional rendering
- **Edge cases**: Null values, undefined, zero, extreme values
- **Error handling**: How functions behave with invalid input

Tests are structured using Vitest's `describe`, `it`, and `expect` functions.

### Test Configuration

The Vitest configuration is located in `vitest.config.ts` at the project root. It sets up Vue plugin, path aliases, and uses jsdom environment for DOM testing.

### Coverage Reports

To generate a coverage report:

```bash
npm run test:run -- --coverage
```

Coverage files are generated in the `coverage/` directory.

---

## Type Checking

### Running Type Checks

```bash
npm run type-check
```

This command:
- Runs Vue TypeScript Compiler (`vue-tsc`)
- Checks all TypeScript files
- Validates Vue component props and emits
- Does not emit output files (no build)

### When to Run Type Checks

- **Before committing** changes
- **After refactoring** code
- **In CI/CD pipeline**
- **Before merging** pull requests

### Common Type Errors

Watch out for:
- Missing or incorrect prop type definitions
- Loose event emitter declarations without typed events
- Inconsistent use of relative imports vs path aliases
- Missing return type annotations on exported functions

---

## Linting

### Running Linter

#### Check Only (No Auto-Fix)
```bash
npm run lint:check
```

#### Auto-Fix Issues
```bash
npm run lint
```

The linter will:
- Identify code quality issues
- Check for unused variables
- Enforce consistent style
- Fix auto-correctable issues

### Linting Rules

The project uses ESLint with the following configurations:

- **TypeScript ESLint** - TS-specific rules
- **Vue ESLint** - Vue component rules
- **Standard JS conventions** - General JavaScript best practices

### Common Linting Issues

Watch out for:
- Unused variables or imports
- Missing semicolons at line ends
- Inconsistent quote usage (single vs double)
- Trailing whitespace
- Console.log statements left in code

---

## Build Testing

### Production Build

```bash
npm run build
```

This command:
- Runs type checking (`vue-tsc`)
- Bundles the application with Vite
- Optimizes assets
- Outputs to `dist/` directory

### Testing the Production Build

```bash
npm run build
npm run preview
```

The `preview` command:
- Serves the production build locally
- Uses the exact same configuration as production
- Allows you to test the bundled app before deployment

### Build Checks

After building, verify:

1. **No build errors** — Check terminal for errors
2. **dist/ directory exists** — Contains the bundled files
3. **File sizes are reasonable** — Large bundles indicate code bloat
4. **Preview works** — Run `npm run preview` and test functionality

---

## Continuous Integration

### GitHub Actions Workflows

The project uses GitHub Actions for automated testing:

#### Tests Workflow (`.github/workflows/tests.yml`)

Triggers on:
- Push to `main` branch
- Pull requests to `main` branch

Runs:
1. Checkout code
2. Setup Node.js v20
3. Install dependencies
4. Run all tests (`npm run test:run`)

#### Lint Workflow (`.github/workflows/lints.yml`)

Triggers on:
- Push to `main` branch
- Pull requests to `main` branch

Runs:
1. Checkout code
2. Setup Node.js v20
3. Install dependencies
4. Run type check (`npm run type-check`)
5. Run lint (`npm run lint`)

#### Build Workflow (`.github/workflows/build.yml`)

Triggers on:
- Push to `main` branch
- Pull requests to `main` branch

Runs:
1. Checkout code
2. Setup Node.js v20
3. Install dependencies
4. Build application (`npm run build`)

### Local Pre-commit Checks

Before pushing, run all checks locally:

```bash
# Run all checks
npm run type-check && npm run lint && npm run test:run

# Or use a script (if configured)
npm run ci
```

---

## Test Best Practices

### 1. Test What Matters

Focus on:
- Business logic (calculations, state management)
- Component behavior (interactions, events)
- Edge cases (null, undefined, extreme values)
- Error handling

Don't test:
- Framework internals (Vue, Pinia)
- Third-party libraries
- Implementation details

### 2. Write Descriptive Tests

Test names should clearly describe:
- What function or component is being tested
- What condition or scenario is being verified
- What the expected behavior is

### 3. Use Data-Driven Tests

When testing the same logic with multiple inputs, use data-driven tests to avoid code duplication and make tests more maintainable.

### 4. Isolate Tests

Each test should be independent:
- Don't rely on other tests
- Clean up after yourself
- Use `beforeEach`/`afterEach` for setup/teardown

### 5. Mock External Dependencies

Use mocks for:
- API calls and network requests
- External libraries
- File system operations
- Browser APIs

---

## Troubleshooting

### Tests Fail But Code Works

1. **Check test setup** — Ensure mocks are configured correctly
2. **Verify test isolation** — Tests shouldn't depend on each other
3. **Review assertions** — Ensure you're testing the right thing

### Type Check Passes But Build Fails

1. **Clear cache** — `rm -rf node_modules/.vite`
2. **Reinstall dependencies** — `rm -rf node_modules package-lock.json && npm install`
3. **Check Vue components** — Some issues only appear during bundling

### Linting Won't Fix Issues

Some issues require manual fixes:
- Unused variables (may be intentional)
- Complex logic (needs refactoring)
- Type definitions (may need explicit types)

---

## Checklist

Before committing code:

- [ ] All tests pass (`npm run test:run`)
- [ ] No type errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] New features have tests
- [ ] Code follows project conventions
