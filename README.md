# @next-vibe/checker

> Fast TypeScript code quality checker combining Oxlint, ESLint, and TypeScript

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

Parallel code quality checks for TypeScript projects. Runs Oxlint (Rust), ESLint, and TypeScript in parallel (~3-5s total). Auto-fix enabled by default.

## Quick Start

```bash
# Install in your project (required)
npm install --save-dev @next-vibe/checker

# Install globally for 'vibe' command (optional)
npm install -g @next-vibe/checker

# Setup
vibe config-create

# Run checks
vibe check
```

## Commands

```bash
vibe check              # Run all checks (auto-fix enabled)
vibe check src          # Check specific paths
vibe check src public   # Check multiple paths
vibe check some/path.ts # Check specific file
vibe check --limit=50   # Limit displayed issues
vibe config-create      # Create configuration
vibe mcp                # Start MCP server
vibe list               # List all commands
```

## Configuration

`vibe config-create` creates `check.config.ts` with options for:
- React/Next.js rules
- i18n validation
- MCP server (.mcp.json)
- VSCode settings
- package.json scripts (check, lint, typecheck)

See [check.config.ts](./check.config.ts) for complete example.

## MCP Server

Configure in `.mcp.json`:

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

Exposes `check` tool to MCP clients.

## CI/CD

```yaml
# GitHub Actions
- run: npm install
- run: npm run check
```

## What Gets Checked

**Oxlint** (1-2s): 100+ rules for React, TypeScript, a11y, custom plugins (i18n, JSX capitalization, restricted syntax)

**ESLint** (~2s): Import sorting, React hooks, React compiler

**TypeScript** (2-8s): Type checking with tsgo (2-3x faster than tsc) or tsc

## Contributing

```bash
git clone https://github.com/techfreaque/next-vibe.git
cd next-vibe
git checkout vibe-check
bun install
bun vibe check
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

GPL-3.0-only

## Links

- [GitHub](https://github.com/techfreaque/next-vibe/tree/vibe-check)
- [npm](https://www.npmjs.com/package/@next-vibe/checker)
- [Issues](https://github.com/techfreaque/next-vibe/issues)
