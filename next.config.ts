import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: false,
    // Cap page-data collection workers. Next.js default is min(cpuCount, freemem/1GB)
    // which hits 23 workers locally - each worker loads the full module graph causing
    // 14+ GB peak. 4 workers keeps peak under control with acceptable build time.
    cpus: 1,
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
    // Soft memory hint for Turbopack's Rust engine (NapiTurboEngineOptions.memoryLimit).
    // Does NOT cap peak RSS - Turbopack still peaks at ~12 GB while building the module graph.
    // May reduce memory after compilation phase. Unit: bytes.
    turbopackMemoryLimit: 8 * 1024 * 1024 * 1024, // 8 GB
    // parallelServerBuildTraces: true,
    // parallelServerCompiles: true,
    // turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "react-icons",
      "date-fns",
      "lodash",
      "react-syntax-highlighter",
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
      "next-vibe": "./src/app/api/[locale]/v1/core",
      "next-vibe-ui": "./src/packages/next-vibe-ui/web",
      "@": "./src",
      "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/mcp/McpResultFormatter":
        "./src/app/api/[locale]/system/unified-interface/unified-ui/renderers/mcp/McpResultFormatter.stub.ts",
      "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliEndpointRenderer":
        "./src/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliEndpointRenderer.stub.tsx",
      "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliEndpointPage":
        "./src/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliEndpointPage.stub.tsx",
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
      "src/app/api/**/builder/**": {
        loaders: ["ignore-loader"],
      },
      "src/app/api/**/launchpad/**": {
        loaders: ["ignore-loader"],
      },
      "src/app/api/**/release-tool/**": {
        loaders: ["ignore-loader"],
      },
      "src/app/api/**/guard/**": {
        loaders: ["ignore-loader"],
      },
      "src/app/api/**/check/**": {
        loaders: ["ignore-loader"],
      },
      "src/app/api/**/translations/reorganize/**": {
        loaders: ["ignore-loader"],
      },
      "src/app/api/**/electron/build/**": {
        loaders: ["ignore-loader"],
      },
      // Generators use dynamic import(variable) for definition scanning - not bundler-safe
      "src/app/api/**/generators/**": {
        loaders: ["ignore-loader"],
      },
      "src/app-native/**": {
        loaders: ["ignore-loader"],
      },
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack(config, { isServer }) {
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

    if (isServer) {
      config.module.rules.push(
        {
          test: /[\\/]src[\\/]app[\\/]api[\\/].*[\\/](builder|launchpad|release-tool|guard|check|generators|electron[\\/]build|translations[\\/]reorganize)[\\/]/,
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
    // argon2 uses native .node binary - webpack minifier crashes on it
    "argon2",
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
