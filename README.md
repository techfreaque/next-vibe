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

### Required: Install in Your Project

```bash
npm install --save-dev @next-vibe/checker
# or
bun add -d @next-vibe/checker
```

### Optional: Install Globally

For the `vibe` command:

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
```

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
    "check": "vibe check",
    "lint": "vibe check",
    "typecheck": "vibe check"
  }
}
```

Then run:

```bash
npm run check
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
      - run: npm run check
```

### GitLab CI

```yaml
check:
  image: node:18
  script:
    - npm install
    - npm run check
```

## Caching

The checker uses caching to speed up subsequent runs:

- **Oxlint cache**: `.tmp/oxlint-cache`
- **ESLint cache**: `.tmp/eslint-cache`

Cache directories are created automatically. Add `.tmp/` to your `.gitignore`.

On first run (cold cache), checks are slower. Subsequent runs are significantly faster.

## Migrating from Existing Linters

If you have existing ESLint, Prettier, or other linter configurations, use this AI agent prompt to migrate cleanly to vibe-check. The agent will port your custom rules to **Oxlint plugins** (preferred, faster) or ESLint where necessary.

### AI Agent Migration Prompt

Copy and paste this into your AI agent (Claude, Cursor, etc.):

```
I need to migrate my project to @next-vibe/checker and port all existing linting configurations.

PROJECT CONTEXT:
- Current linters: [list your linters: ESLint, Prettier, TSLint, etc.]
- Custom rules: [describe any custom rules you have]
- Config files: [list: .eslintrc.js, .prettierrc, etc.]

MIGRATION REQUIREMENTS:

1. INSTALL & SETUP
   - Install: npm install --save-dev @next-vibe/checker
   - Run: vibe config-create (interactive setup)
   - Select all relevant options (React, Next.js, i18n, etc.)

2. PORT CUSTOM RULES TO OXLINT PLUGINS (PREFERRED)
   - Analyze my existing custom ESLint rules
   - Create Oxlint plugins as TypeScript files in oxlint-plugins/
   - Follow the pattern from check.config.ts jsPlugins configuration
   - Oxlint plugins are FASTER than ESLint - prefer this approach
   - Only use ESLint for rules that absolutely cannot be implemented in Oxlint

3. OXLINT PLUGIN STRUCTURE
   Each plugin should be a TypeScript file that exports rules:
   ```typescript
   // oxlint-plugins/my-custom-rule.ts
   export default {
     rules: {
       'my-rule-name': {
         create(context) {
           // Rule implementation
         }
       }
     }
   };
   ```

   Register in check.config.ts:

   ```typescript
   jsPlugins: [
     "oxlint-plugins/my-custom-rule.ts"
   ]
   ```

1. UPDATE check.config.ts
   - Port all rule configurations from old config files
   - Map ESLint rules to equivalent Oxlint rules where possible
   - Configure custom Oxlint plugins
   - Only add ESLint rules that have no Oxlint equivalent
   - Set appropriate severity levels (error/warn)

2. CLEAN UP OLD CONFIGS
   - Remove old config files: .eslintrc.*, .prettierrc, etc.
   - Remove old linter packages from package.json
   - Update package.json scripts to use vibe check
   - Remove old linter-specific ignore files

3. TEST THE MIGRATION
   - Run: vibe check
   - Verify all custom rules are working
   - Test auto-fix functionality
   - Compare results with old linter to ensure nothing is missed
   - Run on a few test files with known issues
   - Verify TypeScript checking works correctly

4. VERIFY CUSTOM RULES
   - Create test files that should trigger each custom rule
   - Confirm rules are enforced correctly
   - Test that auto-fix works for fixable rules
   - Document any rules that couldn't be migrated and why

5. UPDATE DOCUMENTATION
   - Update project README with new lint commands
   - Document any custom Oxlint plugins created
   - Add notes about which rules are Oxlint vs ESLint

PREFERENCES:

- ALWAYS prefer Oxlint plugins over ESLint (much faster)
- Use ESLint only when absolutely necessary
- Maintain the same strictness level as before
- Preserve all custom rule logic
- Enable auto-fix where possible

OUTPUT REQUIREMENTS:

- List of all custom Oxlint plugins created
- Explanation of which ESLint rules couldn't be ported and why
- Summary of migration changes
- Test results showing rules work correctly
- Any recommendations for further optimization

Please proceed with the migration step by step, asking for clarification if needed.

```

### After Migration

1. **Verify everything works:**
   ```bash
   vibe check
   ```

1. **Test on specific files:**

   ```bash
   vibe check src/problematic-file.ts
   ```

2. **Check CI/CD:**
   Update your CI configuration to use `npm run check`

3. **Commit changes:**

   ```bash
   git add .
   git commit -m "Migrate to @next-vibe/checker with custom Oxlint plugins"
   ```

### Oxlint Plugin Resources

- See `oxlint-plugins/` directory in this repository for examples
- Oxlint plugins are TypeScript files that export rule definitions
- Much faster than ESLint (Rust-powered execution)
- Full access to AST for powerful custom rules

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
