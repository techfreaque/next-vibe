# vibe-check

> Minimal TypeScript code quality checker with CLI and MCP support

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![npm version](https://badge.fury.io/js/vibe-check.svg)](https://www.npmjs.com/package/vibe-check)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

A lightning-fast, zero-config code quality tool that combines **Oxlint**, **ESLint**, and **TypeScript** checking with built-in release management and MCP server support.

## Features

### 🚀 Code Quality

- **Triple-layer validation**: Oxlint (Rust-powered speed) + ESLint (custom rules) + TypeScript (type safety)
- **Zero configuration**: Works out of the box with sensible defaults
- **Parallel execution**: Multi-core processing for maximum performance
- **Auto-fix support**: Automatically fix linting and formatting issues
- **Comprehensive rules**: 100+ built-in rules for React, TypeScript, a11y, and more

### 📦 Release Management

- **Semantic versioning**: Automated version bumping (major, minor, patch)
- **Git integration**: Automatic tagging, committing, and pushing
- **Interactive prompts**: Guided release workflow with confirmations
- **npm publishing**: Built-in support for publishing to npm registry
- **Changelog generation**: Optional automated changelog creation
- **Multi-package support**: Manage monorepo releases

### 🤖 MCP Server

- **Claude Desktop integration**: Use vibe-check as a Model Context Protocol server
- **AI-powered code review**: Let Claude analyze your codebase quality
- **Interactive debugging**: Real-time feedback on code issues

### 🛠️ Developer Experience

- **Fast**: Rust-based oxlint + parallel processing
- **Smart**: Auto-detects project structure and configuration
- **Flexible**: Customize via `check.config.ts`
- **Universal**: Works with any TypeScript/JavaScript project

## Installation

### NPM

```bash
npm install -g vibe-check
```

### Bun (Recommended)

```bash
bun add -g vibe-check
```

### Local Installation

```bash
npm install --save-dev vibe-check
```

## Quick Start

### 1. Initialize Configuration

```bash
vibe check --create-config
```

This creates a `check.config.ts` file with sensible defaults.

### 2. Run Code Quality Checks

```bash
vibe check
```

This runs:
- ✓ **Oxlint** - Fast Rust linter (1-2s for most projects)
- ✓ **ESLint** - Custom rules (import sorting, React hooks, i18n)
- ✓ **TypeScript** - Type checking with tsgo

### 3. Auto-fix Issues

```bash
vibe check --fix
```

Automatically fixes:
- Formatting issues
- Import order
- Common linting violations

## CLI Commands

### Code Quality

```bash
# Run all checks
vibe check

# Run with auto-fix
vibe check --fix

# Run specific checks
vibe check --skip-lint        # Skip linting
vibe check --skip-typecheck   # Skip type checking

# Verbose output
vibe check --verbose
```

### Release Management

```bash
# Interactive release (recommended)
vibe release

# Automated release with version increment
vibe release --version-increment patch  # 1.0.0 → 1.0.1
vibe release --version-increment minor  # 1.0.0 → 1.1.0
vibe release --version-increment major  # 1.0.0 → 2.0.0

# CI/CD mode (non-interactive)
vibe release --ci

# Dry run (preview changes)
vibe release --dry-run
```

### Build & Setup

```bash
# Build the project
vibe builder

# Setup/update CLI
vibe setup install
vibe setup status
vibe setup update
vibe setup uninstall
```

### MCP Server

```bash
# Start MCP server for Claude Desktop
vibe mcp

# Test MCP server
bunx @modelcontextprotocol/inspector bun vibe mcp
```

## Configuration

### check.config.ts

Create `check.config.ts` in your project root:

```typescript
import type { CheckConfig } from "vibe-check/system/check/config/types";

const config: CheckConfig = {
  // Oxlint (fast Rust linter)
  oxlint: {
    enabled: true,
    configPath: ".tmp/.oxlintrc.json",
    cachePath: ".tmp/oxlint-cache",
  },

  // ESLint (custom rules)
  eslint: {
    enabled: true,
    configPath: ".tmp/eslint.config.mjs",
    cachePath: ".tmp/eslint-cache",
  },

  // TypeScript type checking
  typecheck: {
    enabled: true,
    cachePath: ".tmp/typecheck-cache",
    useTsgo: true, // Use tsgo instead of tsc (faster)
  },

  // Prettier formatting
  prettier: {
    enabled: true,
    configPath: ".tmp/.oxfmtrc.json",
  },

  // VSCode integration
  vscode: {
    enabled: true,
    autoGenerateSettings: true,
  },
};

export default config;
```

### release.config.ts

Create `release.config.ts` for release automation:

```typescript
import type { ReleaseFileConfig } from "vibe-check/system/release-tool/definition";

const releaseConfig: ReleaseFileConfig = {
  packageManager: "bun", // or "npm", "yarn", "pnpm"
  globalVersion: "1.0.0", // Synchronized version

  branch: {
    main: "main",
    develop: "dev",
    allowNonMain: false,
  },

  packages: [
    {
      directory: "./",
      updateDeps: true,
      typecheck: "bun run vibe check",
      build: true,

      release: {
        tagPrefix: "v",

        git: {
          skipPush: false,
          skipTag: false,
          commitMessage: "chore(release): ${version}",
          remote: "origin",
        },

        npm: {
          enabled: true,
          access: "public",
          provenance: true,
        },

        changelog: {
          enabled: true,
          file: "CHANGELOG.md",
        },
      },
    },
  ],
};

export default releaseConfig;
```

## Advanced Usage

### Custom Rules

Customize linting rules in `check.config.ts`:

```typescript
const config: CheckConfig = {
  oxlint: {
    enabled: true,
    rules: {
      "no-console": "error",
      "no-debugger": "error",
      "typescript/no-explicit-any": "error",
    },
    ignorePatterns: ["dist", "node_modules", ".next"],
  },
};
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun vibe check
```

#### GitLab CI

```yaml
check:
  image: oven/bun:latest
  script:
    - bun install
    - bun vibe check
```

### Programmatic Usage

```typescript
import { vibeCheck } from "vibe-check/system/check/vibe-check/repository";
import { EndpointLogger } from "vibe-check/system/unified-interface/shared/logger/endpoint";

const logger = new EndpointLogger({ level: "info" });

const result = await vibeCheck.execute(
  {
    path: "./src",
    fix: true,
    skipTypecheck: false,
  },
  logger,
);

if (!result.success) {
  console.error("Check failed:", result.data.issues);
  process.exit(1);
}
```

## MCP Server Setup

### Claude Desktop Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "vibe-check": {
      "command": "bun",
      "args": ["vibe", "mcp"]
    }
  }
}
```

### Available MCP Tools

- `check_code_quality` - Run comprehensive code quality checks
- `fix_code_issues` - Auto-fix linting and formatting issues
- `analyze_typescript` - Deep TypeScript analysis
- `get_lint_config` - View current linting configuration

## Performance

### Benchmark Results

Tested on a typical Next.js project (500 files, 50k LoC):

| Tool      | Time   | Files/sec |
| --------- | ------ | --------- |
| Oxlint    | 1.2s   | ~417      |
| ESLint    | 3.5s   | ~143      |
| TypeScript| 2.8s   | ~179      |
| **Total** | **3.9s** | **~128** |

*Parallel execution ensures total time ≈ slowest check, not sum of all checks*

### Optimization Tips

1. **Use tsgo**: 2-3x faster than `tsc`
2. **Enable caching**: Reuse results across runs
3. **Parallel workers**: Auto-scales to CPU cores
4. **Incremental checks**: Only check changed files

## Troubleshooting

### Common Issues

**Q: "Config file not found"**
```bash
vibe check --create-config
```

**Q: "Oxlint fails to parse config"**
- Ensure you're using `ignorePatterns` not `ignores`
- Check schema URL: `./node_modules/oxlint/configuration_schema.json`

**Q: "Type checking is slow"**
```typescript
// In check.config.ts
typecheck: {
  enabled: true,
  useTsgo: true, // Enable tsgo instead of tsc
}
```

**Q: "Release tool doesn't bump version correctly"**
- Ensure `globalVersion` in `release.config.ts` matches your package.json
- Version increments work from max(git tag, configured version)

### Debug Mode

```bash
vibe check --debug
```

Shows detailed execution logs, file discovery, and rule evaluation.

## Contributing

Contributions are welcome! This project is built with:

- **Bun** - Fast JavaScript runtime
- **TypeScript** - Type safety
- **Oxlint** - Rust-based linter
- **Next.js** - Framework patterns

### Development Setup

```bash
git clone https://github.com/maxbrandstatter/next-vibe.git
cd next-vibe
git checkout vibe-check
bun install
bun vibe check
```

### Running Tests

```bash
bun test
```

## License

GPL-3.0-only - see [LICENSE](LICENSE) for details.

## Credits

Created by **Max Brandstätter** ([@maxbrandstatter](https://github.com/maxbrandstatter))

Built with contributions from:
- Claude Code
- Augment
- t3.chat
- Cursor

### Special Thanks

Tools that didn't make the cut (RIP):
- ~~ChatGPT~~ (fired)
- ~~Copilot~~ (fired)
- ~~v0.dev~~ (fired)
- ~~Devin~~ (fired)

---

**Need help?** [Open an issue](https://github.com/maxbrandstatter/next-vibe/issues)

**Love vibe-check?** [Star the repo](https://github.com/maxbrandstatter/next-vibe) ⭐
