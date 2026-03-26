# Getting Started

Follow these steps to set up the Man-Hours Calculator on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (comes with Node.js)

To verify your installation:

```bash
node --version  # Should be v20 or higher
npm --version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/marksxiety/man-hours-calculator.git
cd man-hours-calculator
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Vue 3, TypeScript, TailwindCSS, and other dependencies.

## Development

### Running the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is in use). Open this URL in your browser.

The dev server supports:
- Hot Module Replacement (HMR) — your changes appear instantly
- TypeScript checking
- Vue SFC compilation

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

### Type Checking

```bash
npm run type-check
```

This runs the TypeScript compiler to check for type errors without generating output files.

### Linting

```bash
# Check for lint errors
npm run lint:check

# Auto-fix lint errors
npm run lint
```

## Building for Production

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally to test it before deployment.

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# The dev server will automatically use the next available port
# Or specify a port manually:
npm run dev -- --port 3000
```

**Node.js version mismatch:**
Ensure you're using Node.js v20 or higher. You can use `nvm` (Node Version Manager) to switch versions:
```bash
nvm use 20
```

**Dependencies not installing:**
Try clearing the cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read [Usage Guide](./usage.md) to learn how to use the application
- Check the [README.md](../README.md) for an overview of PERT methodology
