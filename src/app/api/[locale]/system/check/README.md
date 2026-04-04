# @next-vibe/checker

Fast parallel checks. Clean output for humans and AI.

`vibe-check` runs **oxlint + oxfmt + tsgo + ESLint** in parallel from one config file — linting, formatting, and type checking in a single command. The same toolchain powers [unbottled.ai](https://unbottled.ai).

**For humans:** one command replaces four tools, output is structured and readable, warm runs are near-instant.

**For AI agents:** add the MCP server and agents receive the `check` tool with instructions baked into the tool schema itself — not a README they might skip, not a shell command they'll misuse. The tool description enforces: _use this, never shell out to `tsc` or `eslint`_. Paginated structured results, no context pollution.

## What it runs

| Tool       | Role                                                           | Speed (warm) |
| ---------- | -------------------------------------------------------------- | ------------ |
| **oxlint** | Rust linter — primary linter, handles most rules               | ~240ms       |
| **oxfmt**  | Rust formatter — auto-formats on every run, no separate step   | ~50ms        |
| **tsgo**   | Native TypeScript checker (`@typescript/native-preview`)       | ~130ms       |
| **ESLint** | Optional bridge — rules not yet in oxlint (import sort, hooks) | ~830ms       |

All four run in parallel. Total time = slowest tool, not the sum.

**ESLint is optional.** It exists only for rules not yet ported to oxlint. Set `skipEslint: true` or drop the eslint peer deps entirely if you don't need import sorting or React hooks rules.

## Performance

tsgo uses incremental builds (`tsbuildinfo`) — warm runs on unchanged files are near-instant.

| Project size     | Files | Cold  | Warm   |
| ---------------- | ----- | ----- | ------ |
| Small            | 13    | ~1.2s | ~300ms |
| Medium (Next.js) | 77    | ~4s   | ~440ms |
| Large (monorepo) | 8k+   | ~25s  | ~3s    |

## Install

```sh
bun add -D @next-vibe/checker oxlint oxfmt @typescript/native-preview typescript \
  eslint eslint-plugin-react-compiler eslint-plugin-react-hooks \
  eslint-plugin-simple-import-sort typescript-eslint
```

No ESLint needed? Skip the `eslint*` packages and set `skipEslint: true` in `check.config.ts`.

| Package                            | Version    | Role                                                   |
| ---------------------------------- | ---------- | ------------------------------------------------------ |
| `oxlint`                           | `>=1.0.0`  | Rust linter                                            |
| `oxfmt`                            | `>=0.40.0` | Rust formatter — replaces Prettier, runs automatically |
| `@typescript/native-preview`       | `>=7.0.0`  | Native TS checker (`tsgo`) — 10× faster than `tsc`     |
| `typescript`                       | `>=5.0.0`  | Type definitions (used by tsgo + ESLint)               |
| `eslint`                           | `>=9.0.0`  | Optional — import sorting, React hooks rules           |
| `eslint-plugin-react-compiler`     | `>=19.0.0` | React compiler rules                                   |
| `eslint-plugin-react-hooks`        | `>=5.0.0`  | React hooks rules                                      |
| `eslint-plugin-simple-import-sort` | `>=12.0.0` | Import sorting                                         |
| `typescript-eslint`                | `>=8.0.0`  | TypeScript ESLint parser                               |

## Quick Start

```sh
# Configure (interactive wizard — detects your stack)
bunx vibe-check config

# Run
bunx vibe-check src/
```

## MCP Server

The MCP server is what makes agents use `check` correctly — the tool description instructs them at the protocol level, not via a README they might skip.

**Ask the user which editor/agent they use, then write the right config — don't dump all variants on them:**

| Editor / Agent                | Config location                                                           |
| ----------------------------- | ------------------------------------------------------------------------- |
| Claude Code, Cursor, Windsurf | `.mcp.json` in the project root                                           |
| Claude Desktop                | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) |
| Claude Desktop (Win)          | `%APPDATA%\Claude\claude_desktop_config.json`                             |
| Zed                           | `.zed/settings.json` in the project root                                  |

The MCP entry is the same in all cases — only the file location differs:

```json
{
  "mcpServers": {
    "vibe-check": {
      "command": "bunx",
      "args": ["@next-vibe/checker@latest", "mcp"],
      "env": { "PROJECT_ROOT": "/absolute/path/to/your/project" }
    }
  }
}
```

The config wizard (`vibe-check config`) handles `.mcp.json` automatically — just say yes to the MCP question and it writes the file. For other editors, write the entry to the correct location above.

Once set up, agents see `check` in their tool list with a description that instructs: _use this tool, never `tsc` or `eslint` in a shell_. Enforcement is at the MCP protocol level — in the tool schema the agent receives.

## CLI Reference

```sh
vibe-check [paths...]     # Run all checks (defaults to check tool)
vibe-check src/           # Check src/ directory
vibe-check --extensive    # Also check test and auto-generated files
vibe-check --timeout=60   # Timeout in seconds (default: 3600)
vibe-check --limit=100    # Max issues per page (default: 20000)
vibe-check config         # Create/update check.config.ts
vibe-check mcp            # Start MCP server
vibe-check help           # List all commands
```

## Configuration

Run `vibe-check config` to scaffold `check.config.ts` with an interactive wizard.

```ts
import type { CheckConfig } from "@next-vibe/checker/system/check/config/types";

const config = (): CheckConfig => ({
  vibeCheck: {
    timeout: 3600,
    limit: 20000,
    mcpLimit: 20, // compact output for MCP/AI
    extensive: false, // true to also check test/generated files
    skipEslint: false, // true to skip ESLint entirely
    skipOxlint: false,
  },
  oxlint: {
    enabled: true,
    plugins: ["typescript", "oxc", "unicorn", "react", "jsx-a11y", "nextjs"],
    jsPlugins: [
      "@next-vibe/checker/oxlint-plugins/restricted-syntax.js", // ban throw/unknown/object
    ],
    categories: { correctness: "error", suspicious: "error" },
    rules: { "typescript/no-explicit-any": "error" },
  },
  typecheck: {
    enabled: true,
    tsgo: true, // @typescript/native-preview — 10× faster than tsc
  },
  // ESLint: optional. Remove eslint peer deps + set skipEslint: true to go fully ESLint-free.
  eslint: {
    enabled: true,
    buildFlatConfig(rc, hooks, importSort): EslintFlatConfigItem[] {
      return [
        {
          plugins: { "simple-import-sort": importSort, "react-hooks": hooks },
          rules: {
            "simple-import-sort/imports": "error",
            "react-hooks/rules-of-hooks": "error",
          },
        },
      ];
    },
  },
  prettier: {
    enabled: true, // oxfmt reads this — runs automatically on every check
    singleQuote: false,
    trailingComma: "all",
  },
  vscode: { enabled: true, autoGenerateSettings: true },
});

export default config;
```

### Feature Flags

| Flag                | Default | What it enables                                          |
| ------------------- | ------- | -------------------------------------------------------- |
| `react`             | `true`  | React-specific oxlint rules                              |
| `nextjs`            | `true`  | Next.js-specific rules                                   |
| `i18n`              | `true`  | i18n string literal checks                               |
| `tsgo`              | `true`  | Use `@typescript/native-preview` — 10× faster than `tsc` |
| `jsxCapitalization` | `false` | Enforce uppercase JSX component names                    |
| `pedantic`          | `false` | Stricter style rules                                     |
| `restrictedSyntax`  | `true`  | Ban `throw`, `unknown`, bare `object` types              |

### Custom Oxlint Plugins

| Plugin                                                    | What it checks                               |
| --------------------------------------------------------- | -------------------------------------------- |
| `@next-vibe/checker/oxlint-plugins/restricted-syntax.js`  | Bans `throw`, `unknown`, bare `object` types |
| `@next-vibe/checker/oxlint-plugins/jsx-capitalization.js` | Enforces uppercase JSX component names       |
| `@next-vibe/checker/oxlint-plugins/i18n.js`               | Catches untranslated literal strings in JSX  |

Write your own oxlint JS plugins and reference them by path in `jsPlugins`.

### VSCode Integration

Set `vscode.enabled: true` and `vscode.autoGenerateSettings: true`. On each run, `vibe-check` writes `.vscode/settings.json` with oxlint, oxfmt, and TypeScript settings pre-configured.

## Migrating an Existing Setup

Copy this prompt into Claude Code, Cursor, or any agent with file access. It will audit your current tooling and migrate everything into `check.config.ts`.

```
I want to migrate this project to @next-vibe/checker. Please do the following:

1. Audit the current setup — read these files if they exist:
   - package.json (scripts, devDependencies)
   - .eslintrc / eslint.config.* / .eslintrc.json / .eslintrc.js
   - .prettierrc / prettier.config.* / prettier.config.js
   - biome.json
   - oxlint.json / .oxlintrc
   - tsconfig.json (strict flags, paths, include/exclude)
   - .vscode/settings.json

   Tell me what you found: which tools are configured, which rules/plugins are active,
   any custom rules I should know about, and what would be lost vs. preserved.

2. Install vibe-check and its peer deps:
   bun add -D @next-vibe/checker oxlint oxfmt @typescript/native-preview typescript \
     eslint eslint-plugin-react-compiler eslint-plugin-react-hooks \
     eslint-plugin-simple-import-sort typescript-eslint

   If the project has no ESLint usage, skip the eslint-* packages.

3. Run the interactive config wizard:
   bunx vibe-check config
   Answer based on what you found: React, Next.js, i18n, strict types, VSCode, etc.

4. Migrate existing rules into check.config.ts:
   - Custom ESLint rules → map to oxlint equivalents where possible, keep in ESLint config if not
   - Prettier options (singleQuote, trailingComma, printWidth, etc.) → prettier section
   - Biome formatter/linter settings → oxfmt + oxlint equivalents
   - Oxlint rules/plugins already configured → merge into oxlint section
   - tsconfig strict flags → typecheck section

5. Run a full check to see the current state:
   bunx vibe-check src/

6. Remove tools now fully replaced:
   - biome → bun remove @biomejs/biome && rm biome.json
   - standalone prettier → bun remove prettier && rm .prettierrc*
   - standalone eslint config files → rm .eslintrc* (vibe-check generates eslint.config.mjs)
   - standalone oxlint config → rm oxlint.json (now in check.config.ts)
   - tsc scripts → replace with bunx vibe-check in package.json

7. Update package.json scripts:
   Replace "lint", "format", "typecheck" scripts with:
   "check": "vibe-check src/"

8. Set up the MCP server so AI agents run checks correctly.
   Ask the user: "Which editor/agent do you use? (Claude Code / Cursor / Windsurf / Claude Desktop / Zed / other)"
   Then write the MCP entry to the right location for their answer — don't show all variants:
   - Claude Code, Cursor, Windsurf → .mcp.json in project root (vibe-check config does this automatically)
   - Claude Desktop macOS → ~/Library/Application Support/Claude/claude_desktop_config.json
   - Claude Desktop Windows → %APPDATA%\Claude\claude_desktop_config.json
   - Zed → .zed/settings.json in project root
   MCP entry (same for all):
   { "mcpServers": { "vibe-check": { "command": "bunx", "args": ["@next-vibe/checker@latest", "mcp"], "env": { "PROJECT_ROOT": "<absolute path>" } } } }

My project root: [INSERT ABSOLUTE PATH]
Package manager: [bun / npm / pnpm]
```

## Source

Built from the [next-vibe](https://github.com/techfreaque/next-vibe) open-source monorepo.

- [Source code](https://github.com/techfreaque/next-vibe/tree/main/src/app/api/%5Blocale%5D/system/check)
- [Issues](https://github.com/techfreaque/next-vibe/issues)

## License

MIT
