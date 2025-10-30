# Oxlint Configuration System

This directory contains the oxlint implementation for the Next-Vibe project. Oxlint is a Rust-based linter that provides fast, comprehensive code quality checks.

## Overview

The oxlint system uses a **TypeScript configuration wrapper** (`lint.config.ts` in project root) that is automatically converted to JSON at runtime. This approach provides the best of both worlds:

- **TypeScript benefits**: Type safety, logic, switches, and IDE autocomplete
- **Oxlint compatibility**: Native JSON config format for maximum performance

## Project Structure

```
/lint.config.ts              # TypeScript config with logic (project root)
├── .tmp/.oxlintrc.json      # Auto-generated JSON config (git-ignored)
└── src/app/api/.../oxlint/
    ├── config-generator.ts  # Converts TS to JSON
    ├── repository.ts        # Parallel execution engine
    ├── definition.ts        # API endpoint definition
    ├── route.ts             # API route handler
    └── i18n/                # Translations
```

## Configuration

### TypeScript Config (lint.config.ts)

The main configuration file is `lint.config.ts` in the project root. It provides:

**Feature Switches:**

```typescript
const enableI18nRules = true;
const enableStrictTypeScript = true;
const enableReactRules = true;
const enableAccessibilityRules = true;
const strictMode = true; // Use "error" instead of "warn"
```

**Dynamic Logic:**

```typescript
const severity = (enabled: boolean): Severity => {
  return enabled ? (strictMode ? "error" : "warn") : "off";
};
```

**Full Type Safety:**

```typescript
interface OxlintConfig {
  plugins?: string[];
  categories?: Record<string, Severity>;
  rules?: Record<string, Severity | [Severity, unknown]>;
  // ... full type definitions
}
```

### Automatic Config Generation

The config generator (`config-generator.ts`) automatically:

1. Detects changes to `lint.config.ts`
2. Converts TypeScript config to `.oxlintrc.json`
3. Caches the JSON for fast subsequent runs
4. Regenerates only when TS file is modified

## Usage

### CLI Commands

```bash
# Lint entire project
vibe olint

# Lint specific file/directory
vibe olint path/to/file.ts
vibe olint src/app

# Auto-fix issues
vibe olint --fix=true

# Verbose output
vibe olint --verbose=true
```

### API Usage

```typescript
import { oxlintRepository } from './repository';

const result = await oxlintRepository.execute({
  path: './src',
  fix: false,
  verbose: false,
  timeout: 3600,
  cacheDir: './.tmp'
}, locale, logger);
```

## Performance

### Parallel Execution

The repository uses a worker distribution system:

- **Automatic CPU detection**: Determines optimal worker count
- **Memory-aware**: Scales based on available RAM
- **File distribution**: Evenly distributes files across workers
- **Parallel processing**: Runs multiple oxlint instances simultaneously

## Supported Rules

### Categories

- **correctness**: Code that is outright wrong (error)
- **suspicious**: Code that is likely wrong (error)
- **pedantic**: Strict rules (configurable)
- **style**: Code style rules (error/warn)

### Plugins

- **typescript**: TypeScript-specific rules
- **react**: React best practices
- **jsx-a11y**: Accessibility rules
- **import**: Import/export rules
- **nextjs**: Next.js-specific rules
- **unicorn**: Additional quality rules
- **oxc**: Oxlint unique rules

### Rule Examples

```json
{
  "no-debugger": "error",
  "no-console": "error",
  "typescript/no-explicit-any": "error",
  "react/jsx-key": "error",
  "jsx-a11y/alt-text": "error",
  "import/no-duplicates": "error"
}
```

## Troubleshooting

### Config Not Regenerating

If changes to `lint.config.ts` aren't being picked up:

```bash
# Force regeneration by removing cached JSON
rm .tmp/.oxlintrc.json

# Run oxlint again
vibe olint
```

### High Error Count

If you're seeing thousands of errors:

1. **Adjust switches in `lint.config.ts`**:

   ```typescript
   const enablePedanticRules = false; // Reduce noise
   const strictMode = false;          // Use warnings
   ```

2. **Disable specific rules**:

   ```typescript
   rules: {
     "eslint(sort-keys)": "off",
     "eslint(no-magic-numbers)": "off",
   }
   ```

3. **Use categories**:

   ```typescript
   categories: {
     pedantic: "off",  // Disable all pedantic rules
     style: "warn",    // Downgrade style to warnings
   }
   ```
