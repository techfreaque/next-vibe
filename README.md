# @next-vibe/checker

> Comprehensive TypeScript code quality checker combining Oxlint, ESLint, and TypeScript

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

Run parallel code quality checks (Oxlint + ESLint + TypeScript) with auto-fix enabled by default. Built with Rust-powered Oxlint for maximum performance.

## Features

- **Parallel execution** - All checks run simultaneously
- **Smart caching** - Dramatically faster on subsequent runs
- **Auto-fix** - Automatically fixes issues (enabled by default)
- **100+ rules** - React, TypeScript, a11y, Next.js, Node.js
- **Custom plugins** - i18n validation, JSX capitalization, restricted syntax
- **MCP server** - Expose tools via Model Context Protocol
- **Fast type checking** - Uses tsgo (2-3x faster than tsc)

## Performance

Times vary by project size and cache state. **tsgo is enabled by default** (2-3x faster than tsc).

**Small project:**

- With cache: 1.1s total (Oxlint: 0.48s, ESLint: 1.06s, TypeScript: 0.20s)
- Without cache: 1.1s total (Oxlint: 0.48s, ESLint: 1.06s, TypeScript: 0.20s)
- *With tsc: 1.1s cached / 1.5s uncached*

**Medium project:**

- With cache: 2.8s total (Oxlint: 2.55s, ESLint: 2.76s, TypeScript: 0.62s)
- Without cache: 5.9s total (Oxlint: 3.17s, ESLint: 4.37s, TypeScript: 5.81s)
- *With tsc: 12.5s cached / 13.9s uncached*

**Large project:**

- With cache: 9.8s total (Oxlint: 9.80s, ESLint: 3.71s, TypeScript: 3.83s)
- Without cache: 51.3s total (Oxlint: 16.76s, ESLint: 23.87s, TypeScript: 51.30s)
- *With tsc: 12.7s cached / 72.9s uncached*

**Key insights:**

- **Caching provides 5x speedup on large projects**
- **tsgo is 2-3x faster than tsc for TypeScript checking**
- **ESLint can be disabled** if you only need Oxlint rules (saves ~3s on large projects)

## Installation

### Recommended: AI-Assisted Setup (Clean Migration)

**Best for:** Migrating from existing linters (ESLint, Prettier, etc.) or setting up from scratch.

Copy this prompt to your AI agent (Claude Code, Cursor, etc.):

```
Migrate to @next-vibe/checker:

STEP 1: Ask user questions
- Strictness? (relaxed/balanced/strict/pedantic)
- Disable ESLint for max speed? (~3s faster, loses: import sorting, React hooks)
- Enable React rules? (react-hooks, jsx-a11y, react-compiler)
- Enable Next.js rules?
- Enable i18n rules?
- Enable pedantic rules?
- Enable restricted syntax? (no throw, unknown, any, object)
- Create .mcp.json?
- Install globally? (makes `vibe` and `v` commands available everywhere)
- VSCode integration? (only ask if .vscode folder doesn't exist - auto-enable if it exists)

STEP 2: Install and create config
1. Detect package manager (check for bun.lockb, package-lock.json, yarn.lock, pnpm-lock.yaml)
2. Install locally: <pm> add -D @next-vibe/checker
3. If user wants global: <pm> add -g @next-vibe/checker (or global install command for pm)
4. Delete old check.config.ts if it exists
5. Detect VSCode: Check if .vscode folder exists
6. Create config with user's answers:
   <pm-exec> @next-vibe/checker config-create \
     --update-package-json=true \
     --create-mcp-config=<true|false> \
     --update-vscode-settings=<true if .vscode exists OR user said yes> \
     --enable-react-rules=<true|false> \
     --enable-nextjs-rules=<true|false> \
     --enable-i18n-rules=<true|false> \
     --enable-pedantic-rules=<true|false> \
     --enable-restricted-syntax=<true|false>
   Note: package.json scripts updated automatically to "v c"

STEP 3: Customize check.config.ts and editor
1. Read check.config.ts
2. If user wants to disable ESLint: Change line 721 from `enabled: true,` to `enabled: false,`
3. If strictness is pedantic: Change line 47 from `pedantic: false,` to `pedantic: true,`
4. Analyze old linter configs (.eslintrc.*, .prettierrc, etc.) for custom rules
5. Port custom rules to Oxlint plugins (create files in oxlint-plugins/*.ts)
6. Add custom plugin paths to jsPlugins array around line 125
7. Setup editor integration:
   - VSCode: Already configured via .vscode/settings.json (oxc extension, tsgo)
   - Other editors: Detect editor, configure for tsgo and oxlint:
     * JetBrains IDEs: Setup oxlint file watcher, configure tsgo for TypeScript
     * Neovim/Vim: Configure LSP for oxlint and tsgo
     * Sublime/Atom/etc: Setup linter plugins
8. Remove old linter packages and configs
9. Test: <pm-exec> @next-vibe/checker check
10. Report results (what was changed, what rules were ported, editor setup)

Oxlint plugins are much faster than ESLint - always prefer them for custom rules.
```

The AI agent will handle the complete migration automatically.

### Manual Installation

```bash
npm install --save-dev @next-vibe/checker
# or
bun add -d @next-vibe/checker
```

Optional global install for `vibe` command:

```bash
npm install -g @next-vibe/checker
# or
bun add -g @next-vibe/checker
```

Without global install, use `npx @next-vibe/checker` instead of `vibe`.

## Quick Start

```bash
# 1. Install in your project
npm install --save-dev @next-vibe/checker

# 2. Create configuration (interactive)
vibe config-create

# 3. Run checks
vibe check
# or use the short version:
v c
```

**Tip:** Use `v` as a short alias for `vibe` and `c` for `check` (e.g., `v c` instead of `vibe check`).

The `config-create` command interactively sets up:

- `check.config.ts` - Main configuration
- ESLint enable/disable - Only needed for rules not in Oxlint (import sorting, React hooks)
- `.mcp.json` - MCP server config (optional)
- `.vscode/settings.json` - VSCode integration (optional)
- `package.json` scripts - npm run check/lint/typecheck (optional)

## Commands

```bash
vibe check                # Run all checks (auto-fix enabled)
vibe check src            # Check specific paths
vibe check src public     # Check multiple paths
vibe check some/path.ts   # Check specific file
vibe check --limit=50     # Limit displayed issues
vibe config-create        # Create/update configuration
vibe mcp                  # Start MCP server
vibe list                 # List all commands

# Short versions
v c                       # Same as: vibe check
v c src                   # Same as: vibe check src
v cc           # Same as: vibe config-create
```

## Configuration

The `check.config.ts` file controls all behavior:

```typescript
import type { CheckConfig } from "@next-vibe/checker/system/check/config/types";

const config: CheckConfig = {
  vibeCheck: {
    fix: true,              // Auto-fix (default: true)
    limit: 200,             // Max issues to display
    timeout: 3600,          // Max execution time (seconds)
  },

  oxlint: {
    enabled: true,
    configPath: ".tmp/.oxlintrc.json",
    cachePath: ".tmp/oxlint-cache",  // Enable caching
  },

  eslint: {
    enabled: true,
    configPath: ".tmp/eslint.config.mjs",
    cachePath: ".tmp/eslint-cache",  // Enable caching
  },

  typecheck: {
    enabled: true,
    useTsgo: true,  // 2-3x faster than tsc
  },
};

export default config;
```

See [check.config.ts](./check.config.ts) for complete example with all options.

## What Gets Checked

### Oxlint (Rust-powered)

- 100+ built-in rules for React, TypeScript, a11y
- Custom plugins:
  - i18n validation (no hardcoded strings)
  - JSX capitalization enforcement
  - Restricted syntax (no `throw`, `unknown`, `object` types)
- Promise best practices
- Node.js patterns
- Unicorn modern JS rules
- **Uses cache** for faster subsequent runs

### ESLint (Optional)

- Import/export sorting
- React hooks validation
- React compiler rules
- **Uses cache** for faster subsequent runs
- **Can be disabled** if you don't need these rules (Oxlint covers most cases)
- Only needed for rules not yet supported by Oxlint

### TypeScript

- Full type checking with tsgo or tsc
- Strict type rules (optional)

All checks run **in parallel** for maximum speed.

## MCP Server

Configure in `.mcp.json` (created by `vibe config-create`):

```json
{
  "mcpServers": {
    "vibe": {
      "command": "npx",
      "args": ["@next-vibe/checker", "mcp"],
      "env": {
        "PROJECT_ROOT": "/path/to/your/project"
      }
    }
  }
}
```

The MCP server exposes:

- `check` - Run comprehensive code quality checks

Compatible with any MCP client.

## Usage in Projects

### With npm Scripts

If you selected package.json update during `config-create`:

```json
{
  "scripts": {
    "check": "v c",
    "lint": "v c",
    "typecheck": "v c"
  }
}
```

The scripts use the short version `v c` (equivalent to `vibe check`).

Then run:

```bash
npm run check
# or
npm run lint
# or
npm run typecheck
```

### Without Global Install

```bash
npx @next-vibe/checker check
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Code Quality
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm run check  # Uses "v c" script from package.json
```

### GitLab CI

```yaml
check:
  image: node:18
  script:
    - npm install
    - npm run check  # Uses "v c" script from package.json
```

**Note:** If you didn't add package.json scripts during `config-create`, use `npx @next-vibe/checker check` directly in CI.

## Caching

The checker uses caching to speed up subsequent runs:

- **Oxlint cache**: `.tmp/oxlint-cache`
- **ESLint cache**: `.tmp/eslint-cache`

Cache directories are created automatically. Add `.tmp/` to your `.gitignore`.

On first run (cold cache), checks are slower. Subsequent runs are significantly faster.

## Contributing

This project lives on the `vibe-check` branch:

```bash
git clone https://github.com/techfreaque/next-vibe.git
cd next-vibe
git checkout vibe-check
bun install
bun vibe check
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## License

GPL-3.0-only - see [LICENSE](LICENSE)

## Links

- [GitHub Repository](https://github.com/techfreaque/next-vibe/tree/vibe-check)
- [npm Package](https://www.npmjs.com/package/@next-vibe/checker)
- [Report Issues](https://github.com/techfreaque/next-vibe/issues)
