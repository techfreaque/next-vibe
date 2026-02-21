import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    turbopackFileSystemCacheForDev: true,
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
      "src/app-native/**": {
        loaders: ["ignore-loader"],
      },
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Support for WebSockets and build tools in server components
  serverExternalPackages: [
    "socket.io",
    "socket.io-client",
    // Vite and related packages for builder tool (uses dynamic imports incompatible with Next.js bundling)
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
  ],

  // Ensure WebSocket routes are properly handled

  rewrites() {
    return [
      {
        source: "/api/ws",
        destination: "/api/ws",
      },
    ];
  },
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

  distDir: ".next",
};

export default nextConfig;
