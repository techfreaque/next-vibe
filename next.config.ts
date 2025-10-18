import type { NextConfig } from "next";
import path from "path";
import type { Configuration } from "webpack";

// Configuration flags
const useTurbopack = true; // Set to true to use Turbopack, false for Webpack
const useTypedRoutes = false; // Set to true to enable typed routes
const useNextQueryPortalPackage = false;

// once react native is supported, we can use withExpo
// const nextConfig: NextConfig = withExpo({
const nextConfig: NextConfig = {
  typedRoutes: useTypedRoutes,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  // Conditionally enable Turbopack
  turbopack: useTurbopack
    ? {
        resolveAlias: {
          "react-native": "react-native-web",
          "next-vibe": "./src/packages/next-vibe",
          "next-vibe-ui": "./src/packages/next-vibe-ui/web",
          "@": "./src",
        },
        rules: {
          "*.native.tsx": {
            loaders: ["ignore-loader"],
          },
          // Ignore standalone package source files and routes in API routes
          // These are tools/packages that happen to be in the API directory but aren't API routes
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
        },
      }
    : undefined,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack configuration - only when not using Turbopack
  webpack: !useTurbopack
    ? (config: Configuration, { isServer }): Configuration => {
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
            "./packages/next-vibe",
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
      }
    : undefined,

  // Support for WebSockets in server components (moved from experimental)
  serverExternalPackages: ["socket.io", "socket.io-client"],

  // Ensure WebSocket routes are properly handled
  // eslint-disable-next-line @typescript-eslint/require-await
  async rewrites() {
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
  output: "standalone",
} as NextConfig;

export default nextConfig;
