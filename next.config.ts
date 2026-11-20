import path from "node:path";

import type { NextConfig } from "next";

import { MAX_REQUEST_BODY_BYTES } from "./src/vibe/core/route/body-limit";

const nextConfig: NextConfig = {
  typedRoutes: true,
  productionBrowserSourceMaps: false,
  // `next dev` auto-writes AGENTS.md/CLAUDE.md with its own agent-rules block
  // when it detects an AI coding agent (generate-agent-files.js). AGENTS.md
  // is ours — the repo's working rules — so the injection is disabled.
  agentRules: false,
  experimental: {
    // Each page-data worker loads the server graph; bound both the pool and
    // the number of pages a worker can prerender at once.
    cpus: 3,
    staticGenerationMaxConcurrency: 2,
    // Release each compiler's heap before starting the next compiler.
    webpackBuildWorker: true,
    // Bodies above this are truncated by the proxy. Clients and next-handler
    // check against the same constant (src/vibe/core/route/body-limit.ts).
    proxyClientMaxBodySize: MAX_REQUEST_BODY_BYTES,
    webpackMemoryOptimizations: true,
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "react-icons",
      "date-fns",
      "lodash",
      "refractor",
      "react-day-picker",
      "victory-core",
      "victory-chart",
      "d3-shape",
      "d3-scale",
      "d3-array",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
  },

  // Conditionally enable Turbopack
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
      // Absolute paths so they resolve correctly regardless of Turbopack's projectPath override.
      // next-vibe/ui/* must come before next-vibe/* (more-specific alias wins).
      "next-vibe/ui/renderers/mcp/McpResultFormatter": path.join(
        __dirname,
        "src/vibe/ui/renderers/mcp/McpResultFormatter.stub.ts",
      ),
      "next-vibe/ui/renderers/cli/CliEndpointRenderer": path.join(
        __dirname,
        "src/vibe/ui/renderers/cli/CliEndpointRenderer.stub.tsx",
      ),
      "next-vibe/ui/renderers/cli/CliEndpointPage": path.join(
        __dirname,
        "src/vibe/ui/renderers/cli/CliEndpointPage.stub.tsx",
      ),
      "next-vibe/ui": path.join(__dirname, "src/vibe/ui/web"),
      "next-vibe": path.join(__dirname, "src/vibe"),
      "@": path.join(__dirname, "src"),
    },
    rules: {
      "*.native.tsx": {
        loaders: ["ignore-loader"],
      },
      "*.native.ts": {
        loaders: ["ignore-loader"],
      },
      "*.cli.tsx": {
        loaders: ["ignore-loader"],
      },
      "*.cli.ts": {
        loaders: ["ignore-loader"],
      },
      "**/native/**": {
        loaders: ["ignore-loader"],
      },
      // Ignore standalone package source files and routes in API routes
      // These are CLI tools that use dynamic imports with process.cwd() which Turbopack can't resolve
      "src/vibe/**/builder/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/launchpad/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/release-tool/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/guard/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/check/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/translations/reorganize/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/electron/build/**": {
        loaders: ["ignore-loader"],
      },
      // Generators use dynamic import(variable) for definition scanning - not bundler-safe
      "src/vibe/**/generators/**": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/**/generator.ts": {
        loaders: ["ignore-loader"],
      },
      "src/vibe/platforms/web/rebuild/**": {
        loaders: ["ignore-loader"],
      },
      "src/**/seeds.ts": {
        loaders: ["ignore-loader"],
      },
      // CLI install uses process.cwd() + path.join() which causes full project trace
      "src/vibe/**/cli/setup/install/**": {
        loaders: ["ignore-loader"],
      },
      // TanStack route generator scans the filesystem - causes full project NFT trace
      "src/vibe/**/tanstack-start/generate/**": {
        loaders: ["ignore-loader"],
      },
      "src/generated/app-native/**": {
        loaders: ["ignore-loader"],
      },
      "src/generated/app-tanstack/**": {
        loaders: ["ignore-loader"],
      },
      // AI test fixtures (recorded HTTP/WS/claude-code exchanges + media) —
      // JSON/binary read via fs at runtime, never imported.
      "src/generated/ai-fixtures/**": {
        loaders: ["ignore-loader"],
      },
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config, { dev, isServer }) {
    if (!dev) {
      config.parallelism = 2;
    }

    // Webpack in Next.js 16 doesn't handle node: URI scheme.
    // Register node: builtins as externals so webpack skips bundling them.
    const existingExternals = config.externals ?? [];
    const externalsArray = Array.isArray(existingExternals)
      ? existingExternals
      : [existingExternals];
    config.externals = [
      ...externalsArray,
      (
        { request }: { request?: string },
        callback: (err?: Error | null, result?: string) => void,
      ): void => {
        if (request?.startsWith("node:")) {
          // Rewrite node: scheme to bare module name for Node.js runtime
          callback(null, `commonjs ${request.slice(5)}`);
          return;
        }
        callback();
      },
    ];

    // react-joyride uses removed React 16 APIs (unmountComponentAtNode).
    // Webpack errors on missing named exports from react-dom - downgrade to warning.
    config.module.parser = {
      ...config.module.parser,
      javascript: {
        ...(config.module.parser?.javascript ?? {}),
        exportsPresence: "warn",
      },
    };

    // Mirror the Turbopack ignore rules - CLI/native/generator code webpack should not compile.
    // Applied to both server and client bundles.
    config.module.rules.push(
      { test: /\.native\.(tsx?|jsx?)$/, loader: "null-loader" },
      { test: /\.cli\.(tsx?|jsx?)$/, loader: "null-loader" },
      // Any native/ directory (covers next-vibe-ui/native, app-native, etc.)
      { test: /[\\/]native[\\/]/, loader: "null-loader" },
      { test: /[\\/]src[\\/]app-native[\\/]/, loader: "null-loader" },
    );

    // Load non-English browser translations in per-scope async chunks.
    if (!isServer) {
      // The loader emits top-level await. Every browser Next.js supports has
      // async functions; without this flag webpack warns once per i18n scope.
      config.output.environment = {
        ...config.output.environment,
        asyncFunction: true,
      };
      // Locale modules imported by several scopes (e.g. models/i18n/fr) would
      // be copied into every per-scope async chunk; share them instead.
      const splitChunks = config.optimization?.splitChunks;
      if (splitChunks && typeof splitChunks === "object") {
        splitChunks.cacheGroups = {
          ...splitChunks.cacheGroups,
          i18nLocaleShared: {
            test: /[\\/](?:i18n|layout-i18n|i18n[\\/]shared)[\\/](de|pl|fr|it|es)[\\/]/,
            chunks: "async",
            minChunks: 2,
            minSize: 0,
            priority: 50,
            reuseExistingChunk: true,
          },
        };
      }
      config.module.rules.push({
        test: /[\\/](?:i18n|layout-i18n|i18n[\\/]shared)[\\/]index\.ts$/,
        enforce: "pre",
        loader: path.join(
          __dirname,
          "src/vibe/core/i18n/core/client-locale-loader.cjs",
        ),
      });
    }

    if (isServer) {
      config.module.rules.push(
        {
          test: /[\\/]src[\\/]app[\\/]api[\\/].*[\\/](builder|launchpad|release-tool|guard|check|generators|electron[\\/]build|translations[\\/]reorganize|cli[\\/]setup[\\/]install|tanstack-start[\\/]generate)[\\/]|[\\/]src[\\/]app[\\/]api[\\/].*[\\/](generator|seeds)\.ts$/,
          loader: "null-loader",
        },
        {
          test: /[\\/]src[\\/]vibe[\\/]tooling[\\/]generators[\\/]|[\\/]src[\\/]vibe[\\/]server[\\/]server[\\/]rebuild[\\/]/,
          loader: "null-loader",
        },
        // CLI/MCP renderers use React hooks - stub them out for server builds
        // (Turbopack handles these via resolveAlias stubs; webpack needs explicit rules)
        {
          test: /[\\/]unified-ui[\\/]renderers[\\/](cli|mcp)[\\/](?!.*\.stub\.)/,
          loader: "null-loader",
        },
      );
    }
    return config;
  },

  // External packages - excluded from Turbopack/webpack module graph.
  // Turbopack holds the entire module graph in RAM before writing to disk;
  // each of the 398 routes imports db → pg + drizzle-orm, making the graph huge.
  // Marking these as external means they're require()'d at runtime instead of traced.
  serverExternalPackages: [
    // Database - pulled in by every route via db/index.ts
    "pg",
    "pg-native",
    "drizzle-orm",
    // Vite and related packages for builder tool
    "vite",
    "rollup",
    "@vitejs/plugin-react",
    "vite-plugin-dts",
    "@vue/language-core",
    "mlly",
    "local-pkg",
    "esbuild",
    // Tailwind/CSS packages used by builder
    "lightningcss",
    "@tailwindcss/vite",
    "@tailwindcss/node",
    // Drizzle packages (needed for middleware module resolution with Zod v4)
    "drizzle-zod",
    "zod",
    // cli rendering
    "ink",
    "terminal-link",
    "chalk",
    "supports-hyperlinks",
    "module",
    // ssh2 uses native crypto bindings incompatible with ESM bundling
    "ssh2",
    // Node builtins used by SSH file operations - prevents NFT tracer from
    // tracing path.join/path.resolve/fs.readFile calls across the whole project
    "node:child_process",
    "node:crypto",
    "node:fs",
    "node:fs/promises",
    "node:os",
    "node:path",
    "node:util",
    // argon2 uses native .node binary - webpack minifier crashes on it
    "argon2",
    // pdf-parse bundles pdfjs-dist which tries to load pdf.worker.mjs via a relative
    // path that doesn't exist in the webpack chunk output. Keeping it external means
    // Node.js loads it from node_modules at runtime where the worker file is present.
    "pdf-parse",
    "pdfjs-dist",
    // chrome-devtools-mcp (pulled in via src/browser/*, server-only route code)
    // ships its own bundled DevTools frontend assets (legacy.js, sdk.js, ...)
    // referenced by absolute /bundled/... paths that only resolve inside its
    // own package directory at runtime - webpack can't trace/emit them.
    // puppeteer-core (its dependency) has the same class of runtime-only
    // asset resolution (bidi.js, wasmparser worker). Keep both external so
    // Node.js require()s them from node_modules instead of bundling.
    "chrome-devtools-mcp",
    "puppeteer-core",
  ],

  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "**",
      },
    ],
  },

  distDir: process.env["NEXT_DIST_DIR"] || ".next",
};

export default nextConfig;
