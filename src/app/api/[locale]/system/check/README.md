# @next-vibe/checker

Standalone code quality checker for [next-vibe](https://github.com/next-vibe/next-vibe) projects — oxlint + ESLint + TypeScript in one command.

The same checker that powers [unbottled.ai](https://unbottled.ai) and the next-vibe framework, packaged as a standalone tool you can drop into any TypeScript project.

## Features

- **Fast** — oxlint, ESLint, and TypeScript run in parallel
- **TypeScript-aware** — full type checking via `tsc` or `tsgo`
- **MCP server** — expose checks as AI tools (Claude Code, Cursor, etc.)
- **Single config** — one `check.config.ts` controls everything
- **Auto-fix** — fixable issues auto-corrected on every run
- **VSCode integration** — auto-generates `.vscode/settings.json`
- **Extensive mode** — include test and generated files for release validation

## Installation

```sh
bun add -D @next-vibe/checker
# or
npm install -D @next-vibe/checker
```

### Peer Dependencies

The checker invokes oxlint and ESLint from your project. Install them:

```sh
bun add -D oxlint eslint typescript \
  eslint-plugin-react-compiler \
  eslint-plugin-react-hooks \
  eslint-plugin-simple-import-sort \
  typescript-eslint
```

| Package                            | Version    | Purpose                     |
| ---------------------------------- | ---------- | --------------------------- |
| `oxlint`                           | `>=1.0.0`  | Fast Rust-based linter      |
| `eslint`                           | `>=9.0.0`  | Import sorting, react hooks |
| `typescript`                       | `>=5.0.0`  | Type checking               |
| `eslint-plugin-react-compiler`     | `>=19.0.0` | React compiler lint rules   |
| `eslint-plugin-react-hooks`        | `>=5.0.0`  | React hooks lint rules      |
| `eslint-plugin-simple-import-sort` | `>=12.0.0` | Import sorting              |
| `typescript-eslint`                | `>=8.0.0`  | TypeScript ESLint parser    |

## Quick Start

```sh
# Create a check.config.ts in your project root
vibe-check config

# Run all checks
vibe-check

# Auto-fix linting issues
vibe-check --fix

# Check specific paths only
vibe-check src/components src/lib

# Include test + generated files (release validation)
vibe-check --extensive
```

## CLI Reference

```sh
vibe-check [paths...]          # Run all checks (oxlint + ESLint + TypeScript)
vibe-check --fix               # Auto-fix linting issues
vibe-check --skip-eslint       # Skip ESLint pass
vibe-check --skip-oxlint       # Skip oxlint pass
vibe-check --skip-typecheck    # Skip TypeScript type checking
vibe-check --extensive         # Include test/generated files
vibe-check --timeout=60        # Timeout in seconds (default: 3600)
vibe-check --limit=100         # Max issues to display (default: 20000)
vibe-check config              # Create check.config.ts in current directory
vibe-check mcp                 # Start MCP server
vibe-check help                # List available commands
```

## MCP Server

The checker exposes two MCP tools:

- **`check`** — Run oxlint + ESLint + TypeScript checks
- **`config-create`** — Create a `check.config.ts` configuration file

Add to your MCP client config (e.g. `.claude.json` or Claude Desktop `config.json`):

```json
{
  "mcpServers": {
    "vibe-check": {
      "command": "vibe-check",
      "args": ["mcp"],
      "env": {
        "PROJECT_ROOT": "/path/to/your/project"
      }
    }
  }
}
```

## Configuration

Run `vibe-check config` to scaffold a `check.config.ts`, or create it manually.

The config exports a function (not a plain object) — run `vibe-check config` to scaffold the full template. Structure:

```ts
import type {
  CheckConfig,
  EslintFlatConfigItem,
  EslintParser,
  EslintPluginLike,
} from "@next-vibe/checker/system/check/config/types";

const config = (): CheckConfig => ({
  vibeCheck: {
    // default config for vibe check cli
    fix: true,
    timeout: 3600,
    limit: 20000,
    mcpLimit: 20, // max issues to display per page for MCP platform
    extensive: false,
  },
  oxlint: {
    enabled: true,
    plugins: ["typescript", "oxc", "unicorn", "react", "jsx-a11y", "nextjs"],
    jsPlugins: [
      "@next-vibe/checker/oxlint-plugins/restricted-syntax.ts",
      "@next-vibe/checker/oxlint-plugins/jsx-capitalization.ts",
      "@next-vibe/checker/oxlint-plugins/i18n.ts",
    ],
    categories: { correctness: "error", suspicious: "error" },
    rules: { "typescript/no-explicit-any": "error" /* ... */ },
  },
  typecheck: { enabled: true, useTsgo: true },
  eslint: {
    enabled: true,
    // handles import sorting + react hooks (things oxlint can't do)
    buildFlatConfig(rc, hooks, importSort, tseslint): EslintFlatConfigItem[] {
      return [
        {
          plugins: {
            "simple-import-sort": importSort,
            "react-hooks": hooks,
            "react-compiler": rc,
          },
          rules: {
            "simple-import-sort/imports": "error",
            "react-hooks/rules-of-hooks": "error",
          },
        },
      ];
    },
  },
  prettier: { enabled: true, singleQuote: false, trailingComma: "all" },
  vscode: { enabled: true, autoGenerateSettings: true },
});

export default config;
```

### Custom Oxlint Plugins

The checker ships three custom oxlint JS plugins you can enable via `jsPlugins`:

| Plugin path                                               | What it checks                               |
| --------------------------------------------------------- | -------------------------------------------- |
| `@next-vibe/checker/oxlint-plugins/restricted-syntax.ts`  | Bans `throw`, `unknown`, bare `object` types |
| `@next-vibe/checker/oxlint-plugins/jsx-capitalization.ts` | Enforces translated text in JSX elements     |
| `@next-vibe/checker/oxlint-plugins/i18n.ts`               | Catches untranslated literal strings         |

Reference them in your oxlint config:

```ts
const oxlint: CheckConfig["oxlint"] = {
  enabled: true,
  jsPlugins: [
    "@next-vibe/checker/oxlint-plugins/restricted-syntax.ts",
    "@next-vibe/checker/oxlint-plugins/jsx-capitalization.ts",
    "@next-vibe/checker/oxlint-plugins/i18n.ts",
  ],
  // ...
};
```

### Extensive Mode

By default, `**/generated/**`, `**/*.test.ts`, and `**/*.test.tsx` are excluded from checks. Pass `--extensive` (or set `vibeCheck.extensive: true`) to include them — useful for release validation.

### VSCode Integration

Set `vscode.enabled: true` and `vscode.autoGenerateSettings: true` in your config. On each run, `vibe-check` writes `.vscode/settings.json` with oxlint, formatter, and TypeScript settings pre-configured.

## Library API

Import the check repositories directly in your own scripts:

```ts
import { VibeCheckRepository } from "@next-vibe/checker";
import { OxlintRepository } from "@next-vibe/checker/oxlint";
import { EslintRepository } from "@next-vibe/checker/lint";
import { TypecheckRepository } from "@next-vibe/checker/typecheck";
```

Config types:

```ts
import type {
  CheckConfig,
  OxlintConfig,
  EslintConfig,
  TypecheckConfig,
  PrettierConfig,
  VSCodeConfig,
  VibeCheckConfig,
  EslintFlatConfigItem,
  EslintPluginLike,
  EslintParser,
} from "@next-vibe/checker/system/check/config/types";
```

## Source

Built from the [next-vibe](https://github.com/next-vibe/next-vibe) open-source monorepo.

- [Source code](https://github.com/next-vibe/next-vibe/tree/main/src/app/api/%5Blocale%5D/system/check)
- [Issues](https://github.com/next-vibe/next-vibe/issues)
- [next-vibe framework](https://github.com/next-vibe/next-vibe)

## License

GPL-3.0-only
