/**
 * Package Build Plugins
 *
 * Bun plugins automatically injected when a BuildConfig has a `manifest` field.
 * These handle the standard concerns of building a standalone next-vibe package:
 *
 *  - scopedGeneratedPlugin     - redirects generated imports to scoped files
 *  - scopedEndpointsMetaPlugin - stubs endpoints-meta to only the manifest tools
 *  - widgetStubPlugin          - replaces widget.tsx with CLI overrides or no-ops
 *  - nativeStubPlugin          - stubs native-binary modules (ssh2, playwright, …)
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { BunPlugin } from "bun";

import type { PackageManifest } from "../../packages/types";

// Absolute path to next-vibe-ui/cli - resolved relative to this file
const CLI_UI_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../../packages/next-vibe-ui/cli",
);

// ============================================================================
// next-vibe-ui CLI resolver
// ============================================================================

/**
 * Resolves next-vibe-ui/* imports through cli/ first, then falls back to
 * the normal module resolution (web/ via tsconfig). Mirrors the Vite
 * tanstack/ → web/ resolver pattern for Bun package builds.
 */
export const nextVibeUiCliResolverPlugin: BunPlugin = {
  // eslint-disable-next-line i18next/no-literal-string
  name: "next-vibe-ui-cli-resolver",
  setup(build) {
    build.onResolve({ filter: /^next-vibe-ui\// }, ({ path }) => {
      // eslint-disable-next-line i18next/no-literal-string
      const sub = path.slice("next-vibe-ui/".length);
      // eslint-disable-next-line i18next/no-literal-string
      for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
        const candidate = resolve(CLI_UI_DIR, sub + ext);
        if (existsSync(candidate)) {
          return { path: candidate };
        }
      }
      return null;
    });
  },
};

// ============================================================================
// Scoped generated redirect
// ============================================================================

/**
 * Redirects @/app/api/[locale]/system/generated/{endpoint,alias-map,route-handlers}
 * to the scoped files written by the preBuild step.
 */
export function createScopedGeneratedPlugin(generatedDir: string): BunPlugin {
  return {
    // eslint-disable-next-line i18next/no-literal-string
    name: "scoped-generated-redirect",
    setup(build) {
      build.onResolve(
        { filter: /\/system\/generated\/(endpoint|alias-map|route-handlers)$/ },
        (args) => {
          let file: string;
          if (args.path.endsWith("alias-map")) {
            file = "alias-map.ts";
          } else if (args.path.endsWith("route-handlers")) {
            file = "route-handlers.ts";
          } else {
            file = "endpoint.ts";
          }
          return { path: resolve(generatedDir, file) };
        },
      );
    },
  };
}

// ============================================================================
// Scoped endpoints-meta (stubs to only manifest tools)
// ============================================================================

function buildEndpointsMeta(manifest: PackageManifest): string {
  const entries = manifest.endpoints.map((toolName) => {
    // We can only emit a minimal stub here - the real fields come from the
    // generated endpoint registry. Keep enough for help to work.
    return `{ toolName: ${JSON.stringify(toolName)} }`;
  });
  // eslint-disable-next-line i18next/no-literal-string
  return `export const endpointsMeta = [${entries.join(", ")}];\n`;
}

/**
 * Stubs endpoints-meta to only the tools declared in the manifest,
 * so `vibe-check help` shows only the package's own tools.
 */
export function createScopedEndpointsMetaPlugin(
  manifest: PackageManifest,
  generatedDir: string,
): BunPlugin {
  // Read the real scoped endpoints-meta if it was generated, otherwise fall back to stub
  const metaFile = resolve(generatedDir, "endpoints-meta.ts");
  return {
    // eslint-disable-next-line i18next/no-literal-string
    name: "scoped-endpoints-meta",
    setup(build) {
      build.onResolve(
        { filter: /\/system\/generated\/endpoints-meta\/(en|de|pl)$/ },
        () => ({
          // eslint-disable-next-line i18next/no-literal-string
          path: existsSync(metaFile) ? metaFile : "stub:endpoints-meta",
          // eslint-disable-next-line i18next/no-literal-string
          namespace: existsSync(metaFile) ? undefined : "scoped-meta",
        }),
      );
      build.onLoad({ filter: /.*/, namespace: "scoped-meta" }, () => ({
        contents: buildEndpointsMeta(manifest),
        // eslint-disable-next-line i18next/no-literal-string
        loader: "js",
      }));
    },
  };
}

// ============================================================================
// Widget stub
// ============================================================================

function extractNamedExports(filePath: string): string[] {
  try {
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
  } catch {
    return [];
  }
}

/**
 * At Bun.build time, replaces widget.tsx files:
 *  - If a sibling widget.cli.tsx exists → re-export from it
 *  - Otherwise → no-op stub (prevents React deps from bundling into CLI binary)
 */
export const widgetStubPlugin: BunPlugin = {
  // eslint-disable-next-line i18next/no-literal-string
  name: "widget-stub",
  setup(build) {
    build.onLoad({ filter: /\/widget\.tsx$/ }, ({ path }) => {
      const dir = dirname(path);

      for (const ext of [".cli.ts", ".cli.tsx"]) {
        const candidate = resolve(dir, `widget${ext}`);
        if (existsSync(candidate)) {
          return {
            // eslint-disable-next-line i18next/no-literal-string
            contents: `export * from "${candidate}";`,
            // eslint-disable-next-line i18next/no-literal-string
            loader: "ts",
          };
        }
      }

      return {
        contents: [
          // eslint-disable-next-line i18next/no-literal-string
          "const noop = () => null;",
          // eslint-disable-next-line i18next/no-literal-string
          "const handler = { get: (_t, prop) => prop === 'cliWidget' ? false : noop };",
          // eslint-disable-next-line i18next/no-literal-string
          "const stub = new Proxy(noop, handler);",
          // eslint-disable-next-line i18next/no-literal-string
          "export default stub;",
          ...extractNamedExports(path).map(
            // eslint-disable-next-line i18next/no-literal-string
            (name) => `export const ${name} = stub;`,
          ),
        ].join("\n"),
        // eslint-disable-next-line i18next/no-literal-string
        loader: "ts",
      };
    });
  },
};

// ============================================================================
// Native-module stub
// ============================================================================

const NATIVE_STUBS = [
  "ssh2",
  "cpu-features",
  "playwright",
  "playwright-core",
  "chromium-bidi",
];

/**
 * Stubs modules with native binaries so they compile away safely.
 * The checker never executes SSH or browser code, but those modules are
 * imported transitively and would cause runtime failures if bundled.
 */
export const nativeStubPlugin: BunPlugin = {
  // eslint-disable-next-line i18next/no-literal-string
  name: "native-stub",
  setup(build) {
    for (const pkg of NATIVE_STUBS) {
      build.onResolve(
        { filter: new RegExp(`^${pkg.replace("/", "/")}($|/)`) },
        // eslint-disable-next-line i18next/no-literal-string
        () => ({ path: `stub:${pkg}`, namespace: "native-stub" }),
      );
    }
    build.onLoad({ filter: /.*/, namespace: "native-stub" }, () => ({
      // eslint-disable-next-line i18next/no-literal-string
      contents: "export default {}; export const Client = function(){};",
      // eslint-disable-next-line i18next/no-literal-string
      loader: "js",
    }));
  },
};

// ============================================================================
// Convenience factory
// ============================================================================

/**
 * Returns all standard package plugins for a given manifest + generated dir.
 * Pass these into a filesToCompile entry's bunOptions.plugins.
 */
export function createPackagePlugins(
  manifest: PackageManifest,
  generatedDir: string,
): BunPlugin[] {
  return [
    createScopedGeneratedPlugin(generatedDir),
    createScopedEndpointsMetaPlugin(manifest, generatedDir),
    widgetStubPlugin,
    nativeStubPlugin,
  ];
}
