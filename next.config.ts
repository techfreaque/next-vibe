import path from "node:path";

import type { NextConfig } from "next";
import type { Configuration } from "webpack";

import { useTurbopack } from "./src/config/constants";

// Configuration flags
const useTypedRoutes = true; // Set to true to enable typed routes
const useNextQueryPortalPackage = false;

// once react native is supported, we can use withExpo
// const nextConfig: NextConfig = withExpo({
const nextConfig: NextConfig = {
  typedRoutes: useTypedRoutes,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    turbopackFileSystemCacheForDev: true,
  },

  // Conditionally enable Turbopack
  turbopack: useTurbopack
    ? {
        resolveAlias: {
          "react-native": "react-native-web",
          "next-vibe": "./src/app/api/[locale]/v1/core",
          "next-vibe-ui": "./src/packages/next-vibe-ui/web",
          "@": "./src",
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
          "**/node_modules/**": {
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
      }
    : undefined,

  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack configuration - only when not using Turbopack
  webpack: useTurbopack
    ? undefined
    : (config: Configuration, { isServer }): Configuration => {
        if (!isServer) {
          config.module = config.module ?? {};
          config.module.rules = config.module.rules ?? [];
          config.module.rules.push({
            test: /\.native\.tsx$/,
            use: "ignore-loader",
          });
        }

        // Set up path aliases for the next-vibe package
        config.resolve = config.resolve ?? {};
        if (!config.resolve.alias || Array.isArray(config.resolve.alias)) {
          config.resolve.alias = {};
        }
        config.resolve.alias["react-native"] = "react-native-web";
        const sourcePath = path.resolve(__dirname, "./src");
        if (!useNextQueryPortalPackage) {
          // Use absolute paths for better compatibility with Vercel
          config.resolve.alias["next-vibe"] = path.resolve(
            sourcePath,
            "./app/api/[locale]/v1/core",
          );
        }
        // Use absolute paths for better compatibility with Vercel
        config.resolve.alias["next-vibe-ui"] = path.resolve(
          sourcePath,
          "./packages/next-vibe-ui/web",
        );
        // Use absolute paths for better compatibility with Vercel
        config.resolve.alias["@"] = sourcePath;

        return config;
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

  // Enable standalone output for Docker production builds
  // output: "standalone",
} as NextConfig;

export default nextConfig;
