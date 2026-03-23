/**
 * Bun plugin: CLI widget overrides
 *
 * When a file named "widget.tsx" is loaded, this plugin checks if a sibling
 * "widget.cli.tsx" or "widget.cli.ts" exists and re-exports it instead.
 * Only active in the CLI Bun process - the Next.js child process spawned by
 * `vibe dev` is unaffected (separate process).
 *
 * For widget.tsx files WITHOUT a CLI override, a no-op stub is returned so
 * React widget imports (which can't resolve in CLI context) don't crash.
 *
 * Note: `export * from "widget.cli.tsx"` can trigger non-deterministic
 * "Cannot access 'default' before initialization" warnings during vibe gen.
 * This is a Bun limitation - synthetic onLoad modules with `export *` create
 * a dependency chain that races with the importing definition's initialization.
 * Bun ignores the `loader` field in onLoad (always uses original extension),
 * so inlining .tsx content fails. And onResolve doesn't fire for relative
 * imports Bun resolves internally, so path redirection isn't possible either.
 * The endpoint generator handles these gracefully - definitions still register
 * and work correctly at runtime.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { plugin } from "bun";

// Import JSX runtimes before NODE_ENV can be set to "production" by environment.ts.
// Bun always uses jsxDEV for .tsx transpilation. React's jsx-dev-runtime.js gates
// its exports on NODE_ENV - importing here caches the dev version in Bun's module
// registry before loadEnvironment() runs and changes NODE_ENV.
// This file is the first static import in vibe-runtime.ts, so it evaluates before
// run-cli.ts (which calls loadEnvironment() at module level).
import "react/jsx-dev-runtime";
import "react/jsx-runtime";

/**
 * Extract named export identifiers from a .tsx/.ts file using simple regex.
 */
function extractNamedExports(filePath: string): string[] {
  const src = readFileSync(filePath, "utf-8");
  const names: string[] = [];

  for (const m of src.matchAll(
    /export\s+(?:const|let|var|function|class)\s+(\w+)/g,
  )) {
    if (m[1] && m[1] !== "default") {
      names.push(m[1]);
    }
  }

  for (const m of src.matchAll(/export\s*\{([^}]+)\}/g)) {
    if (m[1]) {
      for (const part of m[1].split(",")) {
        const token = part
          .trim()
          .split(/\s+as\s+/)
          .pop()
          ?.trim();
        if (token && token !== "default") {
          names.push(token);
        }
      }
    }
  }

  return [...new Set(names)];
}

plugin({
  name: "cli-widget-override", // eslint-disable-line i18next/no-literal-string
  target: "bun", // eslint-disable-line i18next/no-literal-string
  setup(build) {
    build.onLoad({ filter: /\/widget\.tsx$/ }, ({ path }) => {
      const dir = dirname(path);

      // Check for CLI override
      for (const ext of [".cli.ts", ".cli.tsx"]) {
        const candidate = resolve(dir, `widget${ext}`);
        if (existsSync(candidate)) {
          return {
            contents: `export * from "${candidate}";`, // eslint-disable-line i18next/no-literal-string
            loader: "ts", // eslint-disable-line i18next/no-literal-string
          };
        }
      }

      // No CLI override - stub out React widget with no-op exports
      return {
        contents: [
          "const noop = () => null;", // eslint-disable-line i18next/no-literal-string
          "const handler = { get: (_t, prop) => prop === 'cliWidget' ? false : noop };", // eslint-disable-line i18next/no-literal-string
          "const stub = new Proxy(noop, handler);", // eslint-disable-line i18next/no-literal-string
          "export default stub;", // eslint-disable-line i18next/no-literal-string
          ...extractNamedExports(path).map(
            (name) => `export const ${name} = stub;`, // eslint-disable-line i18next/no-literal-string
          ),
        ].join("\n"),
        loader: "ts", // eslint-disable-line i18next/no-literal-string
      };
    });
  },
});
