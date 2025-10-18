# AW Lint

Comprehensive ESLint config for Anywhere Widgets projects

## Installation

```bash
bun add --dev lint
```

## Usage

Create an `eslint.config.mjs` file in your project root:

```javascript
import { createEslintConfig } from "lint";

export default createEslintConfig({
  projectRoot: import.meta.dirname,
  enableNext: false, // Set to true for Next.js projects
  tsConfigPaths: ["./tsconfig.json"],
  additionalIgnores: [],
  customRules: {},
});
```

## Features

- TypeScript support with strict rules
- React and Next.js rules (optional)
- Import sorting and organization
- Accessibility checks
- Performance optimizations
- Code quality enforcement
- Prettier integration

## Configuration Options

- `projectRoot`: Project root directory
- `enableNext`: Enable Next.js specific rules
- `tsConfigPaths`: TypeScript config file paths
- `additionalIgnores`: Additional files/patterns to ignore
- `customRules`: Custom ESLint rules to override
- `reactVersion`: React version for rules (default: "detect")
- `enableReactCompiler`: Enable React Compiler rules (default: true)

## License

MIT
