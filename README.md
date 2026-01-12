# @next-vibe/checker aka vibe check

Run Oxlint, ESLint, and TypeScript in parallel. Fast caching, auto-fix by default.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

## Features

- **Parallel execution** - All checks run simultaneously
- **Smart caching** - 10x faster on large projects (41s → 4s)
- **Auto-fix** - Fixes issues by default
- **100+ rules** - React, TypeScript, a11y, Next.js, Node.js, custom plugins
- **MCP server** - Integrate with Claude via Model Context Protocol
- **Fast type checking** - tsgo (2-3x faster than tsc)

## Performance

| Project | Cold Cache | Warm Cache | Speed |
| ------- | ---------- | ---------- | ----- |
| Small   | 0.69s      | 0.71s      | 1x    |
| Medium  | 5.51s      | 1.30s      | 4x    |
| Large   | 41.24s     | 4.29s      | 10x   |

Caching is automatic. Add `.tmp/` to `.gitignore`.

## Quick Start

```bash
npm install --save-dev @next-vibe/checker
npx @next-vibe/checker config-create
npm run check
```

That's it. `config-create` adds check/lint/typecheck scripts to package.json. Then just use `npm run check`.

For global install (optional):

```bash
npm install -g @next-vibe/checker
vibe config-create # or shorter: v cc
vibe check # or shorter: v c
```

## Migrate from ESLint/Prettier

Copy this prompt to your AI agent:

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
- Install globally?
- VSCode integration?

STEP 2: Install and create config
1. Detect package manager (bun.lockb, package-lock.json, yarn.lock, pnpm-lock.yaml)
2. Install: npm add -D @next-vibe/checker (or equivalent for your package manager)
3. If global: npm install -g @next-vibe/checker
4. Run: npm exec @next-vibe/checker config-create
   (or: npx @next-vibe/checker config-create)

STEP 3: Configure
1. Read check.config.ts
2. To disable ESLint: Change `skipEslint: false` to `skipEslint: true`
3. To enable pedantic: In the `features` object at line 46, change `pedantic: false` to `pedantic: true`
4. Analyze old .eslintrc, .prettierrc, eslint config files
5. Port custom rules to Oxlint plugins (oxlint-plugins/*.ts)
6. Add plugin paths to jsPlugins array in config (around line 124)
7. Setup editor:
   - VSCode: .vscode/settings.json (oxc extension, tsgo)
   - JetBrains: oxlint file watcher, tsgo for TypeScript
   - Neovim/Vim: LSP for oxlint and tsgo
8. Remove old linter packages and configs
9. Test: npm exec @next-vibe/checker check (or: npx @next-vibe/checker check)
10. Report what was changed and migrated

Note: Oxlint plugins are much faster than ESLint rules - prefer them.
```

The AI will handle the complete migration automatically.

## Commands

```bash
vibe check [paths]              # Run all checks
vibe check src                  # Check specific directory
vibe check src app.tsx          # Check multiple paths
vibe check --limit=50           # Show first 50 issues (default: 200)
vibe check --fix                # Auto-fix issues
vibe check --timeout=600        # Max execution time (seconds)
vibe check --page=2             # View page 2 of results
vibe config-create              # Create/update configuration
vibe mcp                         # Start MCP server
vibe list                        # All available commands
```

Without global install, replace `vibe` with `npx @next-vibe/checker` or `npm exec @next-vibe/checker`.

**Short aliases** (global install only): `v c` = check, `v cc` = config-create

## Configuration

Edit `check.config.ts`. Key settings:

```typescript
const vibeCheck = {
  fix: true, // Auto-fix enabled by default
  limit: 200, // Max issues per page
  timeout: 3600, // Max execution time (seconds)
  skipEslint: false, // Set to true to disable ESLint
  skipOxlint: false, // Set to true to disable Oxlint
  skipTypecheck: false, // Set to true to skip TypeScript
};

const features = {
  pedantic: false, // Set to true for stricter rules
  react: true,
  nextjs: true,
  i18n: true,
  tsgo: true, // ~2-3x faster than tsc
  // ... other feature flags
};
```

See [check.config.ts](./check.config.ts) for the complete configuration.

## What Gets Checked

**Oxlint** (~1-5s) - React, TypeScript, a11y, custom plugins

- 100+ built-in rules
- i18n validation (no hardcoded strings)
- JSX capitalization enforcement
- Restricted syntax (no throw/unknown/any)

**ESLint** (~1-40s, optional) - Import sorting, React hooks, React compiler rules

- Disable: Set `skipEslint: true` in config
- Without it: lose import sorting & React hook checks

**TypeScript** (~0.05-5s) - Full type checking with tsgo

- ~2-3x faster than tsc
- Strict type rules (optional)

All run in parallel. Total time ≈ slowest check.

## MCP Server

Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "vibe": {
      "command": "npx",
      "args": ["@next-vibe/checker", "mcp"],
      "env": { "PROJECT_ROOT": "/path/to/project" }
    }
  }
}
```

Compatible with any MCP-compatible client.

## CI/CD Integration

### GitHub Actions

```yaml
- run: npm install
- run: npm exec @next-vibe/checker check
```

### GitLab CI

```yaml
script:
  - npm install
  - npm exec @next-vibe/checker check
```

## Caching

Caching is automatic and enabled by default.

**Speed improvements:**

- Medium projects: 5.5s → 1.3s **(4x faster)**
- Large projects: 41s → 4.3s **(10x faster)**

**Cache directories:**

```
.tmp/eslint-cache/
.tmp/typecheck-cache/
```

Clear cache: `rm -rf .tmp/`

## Troubleshooting

**Not finding issues?**

- Enable stricter rules: Set `pedantic: true` in `features`
- Check that checks aren't disabled (skipEslint, skipOxlint, skipTypecheck)

**Too slow?**

- Disable ESLint: `skipEslint: true`

**Cache not working?**

- Check that `.tmp/` directory is writable
- Clear and rebuild: `rm -rf .tmp/ && vibe check`

**MCP broken?**

- Verify `.mcp.json` in project root
- Check `PROJECT_ROOT` environment variable
- Restart Claude/Cursor

**Command not found?**

- If no global install: Add "check": `vibe check` to your `package.json` and use with `npm run check`
- If globally installed: Ensure npm global bin is in PATH

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more help.

## Development

```bash
git clone https://github.com/techfreaque/next-vibe.git
cd next-vibe && git checkout vibe-check
bun install && vibe check --fix
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

GPL-3.0-only

## Links

- [GitHub](https://github.com/techfreaque/next-vibe/tree/vibe-check)
- [npm](https://www.npmjs.com/package/@next-vibe/checker)
- [Issues](https://github.com/techfreaque/next-vibe/issues)
