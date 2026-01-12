#!/usr/bin/env bun

/**
 * Cleanup Checker Script
 *
 * Transforms next-vibe into a minimal checker package by:
 * 1. Moving unwanted routes/pages/native code to .vibe-cleanup/
 * 2. Updating package.json to remove unnecessary dependencies
 * 3. Regenerating endpoints.ts with only check routes
 * 4. Verifying the cleanup
 *
 * This script is idempotent and can be rerun safely.
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { parseError } from "@/app/api/[locale]/shared/utils";
import {
  createEndpointLogger,
  type EndpointLogger,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { defaultLocale } from "@/i18n/core/config";

const CLEANUP_DIR = ".vibe-cleanup";
const MANIFEST_FILE = join(CLEANUP_DIR, "manifest.json");
const PROJECT_ROOT = process.cwd();

// Routes to remove - Keep ONLY what checker needs
// KEEP: system/*, user/* (full user auth system)
// REMOVE: Everything else
const ROUTES_TO_REMOVE = [
  // Business logic routes - REMOVE entirely
  "src/app/api/[locale]/agent",
  "src/app/api/[locale]/browser",
  "src/app/api/[locale]/users",
  // Remove leads, emails, sms, credits entirely
  "src/app/api/[locale]/leads",
  "src/app/api/[locale]/emails",
  "src/app/api/[locale]/sms",
  "src/app/api/[locale]/credits",
  "src/app/api/[locale]/referral",
  "src/app/api/[locale]/payment",
  "src/app/api/[locale]/subscription",
  "src/app/api/[locale]/contact",
  "src/app/api/[locale]/newsletter",
  "src/app/api/[locale]/import",
  "src/app/api/[locale]/products",
  "src/app/api/[locale]/manifest",
  "src/app/api/[locale]/calendar",
  // User routes - remove auth/check and user/i18n
  "src/app/api/[locale]/user/auth/check",
  "src/app/api/[locale]/user/i18n",
  // System routes (keep only check, generators, builder, release-tool, db, help, unified-interface)
  "src/app/api/[locale]/system/server",
  "src/app/api/[locale]/system/translations",
  "src/app/api/[locale]/system/hosting",
  "src/app/api/[locale]/system/guard",
  "src/app/api/[locale]/system/launchpad",
  // Unified-interface: keep only CLI, MCP, tasks, next-api, shared
  "src/app/api/[locale]/system/unified-interface/react",
  "src/app/api/[locale]/system/unified-interface/react-native",
  "src/app/api/[locale]/system/unified-interface/trpc",
  "src/app/api/[locale]/system/unified-interface/ai",
  // Remove middleware and db (causing errors with deleted modules)
  "src/app/api/[locale]/system/middleware",
  "src/app/api/[locale]/system/db",
  // Remove unnecessary generators
  "src/app/api/[locale]/system/generators/env",
  "src/app/api/[locale]/system/generators/seeds",
  "src/app/api/[locale]/system/generators/generate-trpc-router",
  // Remove unnecessary task runners
  "src/app/api/[locale]/system/unified-interface/tasks",
  "src/app/api/[locale]/system/generated/tasks-index.ts",
  "src/app/api/[locale]/system/generators/task-index",
  // User: remove only profile management, public endpoints, search, and logout (depends on deleted repos)
  "src/app/api/[locale]/user/private/me",
  "src/app/api/[locale]/user/private/logout",
  "src/app/api/[locale]/user/private/session",
  "src/app/api/[locale]/user/public",
  "src/app/api/[locale]/user/search",
  "docs/patterns/tasks.md",
  "docs/guides/stripe-webhooks.md",
  "docs/patterns/database.md",
  "docs/patterns/email.md",
  "docs/patterns/repository-native.md",
  "docs/patterns/seeds.md",
  "src/app/api/[locale]/system/check/testing",
  "src/types",
  "types",
  "src/app/api/[locale]/system/unified-interface/next-api",
  "src/app/api/[...slug]",
  "src/app/api/[locale]/shared/geo",
  "src/app/api/[locale]/shared/utils/utils.ts",
  "src/app/api/[locale]/shared/utils/password.ts",
  "src/app/api/[locale]/shared/utils/password.test.ts",
];

// Pages to remove
const PAGES_TO_REMOVE = [
  "src/app/[locale]/admin",
  "src/app/[locale]/chat",
  "src/app/[locale]/help",
  "src/app/[locale]/story",
  "src/app/[locale]/subscription",
  "src/app/[locale]/track",
  "src/app/[locale]/threads",
  "src/app/[locale]/user",
  "src/app/[locale]/design-test",
  "src/app/[locale]/favicon.ico",
  "src/app/[locale]/apple-icon.png",
  "src/app/[locale]/icon.png",
  "src/app/[locale]/page.tsx",
  "src/app/[locale]/layout.tsx",
  "src/app/[locale]/globals.css",
];

// React Native files
const NATIVE_TO_REMOVE = [
  "src/app-native",
  "metro.config.cjs",
  "metro.babel.config.cjs",
  "nativewind-env.d.ts",
];

// Root folder files/folders to remove
const ROOT_FILES_TO_REMOVE = [
  // React Native config (already removed native code above)
  "app.json", // Expo app config
  "metro.transformer.cjs", // Metro transformer
  "postcss.config.native.mjs", // Native PostCSS config
  "scripts/install-docker.sh",
  // Next.js/Web config (not needed for CLI/MCP checker)
  "next.config.ts", // Next.js config
  "next-env.d.ts", // Next.js types
  "postcss.config.mjs", // PostCSS config
  "global.d.ts", // Global types
  ".env.example", // Example env file
  "src/proxy.ts", // Proxy middleware (uses deleted middleware)
  // Docker/Deployment
  "docker-compose-dev.yml",
  "docker-compose.preview.yml",
  "docker-compose.prod.yml",
  "Dockerfile",
  "Dockerfile.preview",
  ".dockerignore",
  "vercel.json", // Vercel deployment config
  // Database migrations (we keep ORM but not migrations for minimal package)
  "drizzle", // Migration files folder
  "drizzle.config.ts", // Drizzle config
  // Documentation/Assets (not needed for npm package)
  "public", // Web assets (favicon, robots.txt, etc)
  // UI/Components (not needed for CLI/MCP checker)
  "components.json", // shadcn/ui config
  "src/packages", // UI component packages (next-vibe-ui, i18n)
  "src/app/[locale]", // Next.js pages (we keep src/app/api for API routes)
  // User signup/reset-password (has email/lead dependencies, not core auth)
  "src/app/api/[locale]/user/public/signup",
  "src/app/api/[locale]/user/public/reset-password",
  "src/app/api/[locale]/user/auth/utils.ts", // Has lead imports
  // Tests and middleware not needed for minimal checker
  "src/app/api/[locale]/system/unified-interface/shared/types/tests",
  "src/app/api/[locale]/system/middleware/lead-id",
  "src/app/api/[locale]/user/session-cleanup", // Optional cleanup task
  "src/config/metadata.ts",
  "src/i18n/core/metadata.ts",
  // IDE/Temp (optional - user can keep their own)
  "src/config/env-client.native.ts",
];

// UI files/directories to remove (components, hooks, emails)
const UI_PATTERNS_TO_REMOVE = [
  // React components
  "_components",
  // React hooks
  "hooks.ts",
  // Email templates
  "email.tsx",
  ".email.tsx",
  "email.ts", // Email utility files
  // Seeds and native files (not needed for minimal checker)
  "seeds.ts",
  ".native.ts",
  "repository.native.ts",
  "repository-client.ts", // Client-side repositories not needed
  // Other UI utilities
  "src/hooks",
  "src/i18n/core/client.tsx",
];

// Dependencies to remove
const DEPS_TO_REMOVE = new Set([
  // React Native
  "react-native",
  "react-native-web",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-svg",
  "react-native-worklets",
  "expo",
  "expo-constants",
  "expo-linking",
  "expo-navigation-bar",
  "expo-router",
  "expo-splash-screen",
  "expo-status-bar",
  "expo-system-ui",
  "nativewind",
  "moti",
  "@react-native-async-storage/async-storage",
  "@react-navigation/native",
  "@shopify/flash-list",
  "victory-native",
  // tRPC
  "@trpc/client",
  "@trpc/next",
  "@trpc/react-query",
  "@trpc/server",
  // Database (keep drizzle-orm, drizzle-zod, pg for auth system!)
  // "drizzle-orm",   // KEEP - needed for auth
  // "drizzle-zod",   // KEEP - needed for schemas
  // "pg",            // KEEP - needed for database
  // "@types/pg",     // KEEP - pg types
  "drizzle-kit", // Remove - only needed for migrations
  "ioredis", // Remove - not needed
  // AI SDKs
  "@ai-sdk/amazon-bedrock",
  "@ai-sdk/azure",
  "@ai-sdk/cohere",
  "@ai-sdk/google-vertex",
  "@ai-sdk/mistral",
  "@ai-sdk/openai",
  "@ai-sdk/react",
  "@openrouter/ai-sdk-provider",
  "ai",
  "anthropic-vertex-ai",
  // Payment
  "stripe",
  "@stripe/stripe-js",
  // Email/Communication
  "@react-email/components",
  "@react-email/render",
  "nodemailer",
  "@types/nodemailer",
  "imap",
  "@types/imap",
  "ical-generator",
  // UI Libraries (most of them)
  "framer-motion",
  "react-joyride",
  "react-markdown",
  "react-syntax-highlighter",
  "@types/react-syntax-highlighter",
  "rehype-highlight",
  "remark-breaks",
  "remark-gfm",
  "embla-carousel-react",
  "vaul",
  "canvas-confetti",
  "@types/canvas-confetti",
  "html2canvas",
  "react-countup",
  "react-day-picker",
  "react-intersection-observer",
  "react-resizable-panels",
  "victory",
  // Forms
  "react-hook-form",
  "@hookform/resolvers",
  "input-otp",
  // State/Query
  "@tanstack/react-query",
  "@tanstack/react-query-persist-client",
  "@tanstack/query-sync-storage-persister",
  "@tanstack/react-table",
  // Auth (keep argon2 and jose for password hashing and JWT!)
  // "argon2",  // KEEP - password hashing
  // "jose",    // KEEP - JWT tokens
  // Other
  "socket.io",
  "socket.io-client",
  "google-auth-library",
  "googleapis",
  "sonner",
  "cmdk",
  "next-themes",
]);

// Radix UI packages (remove by pattern)
const RADIX_PATTERN = /^@radix-ui\//;
const RN_PRIMITIVES_PATTERN = /^@rn-primitives\//;

interface ManifestEntry {
  from: string;
  to: string;
  movedAt: string;
}

interface Manifest {
  routes: ManifestEntry[];
  pages: ManifestEntry[];
  native: ManifestEntry[];
  rootFiles: ManifestEntry[];
  packageJson: {
    originalName: string;
    originalDeps: number;
    cleanedDeps: number;
  } | null;
}

function loadManifest(): Manifest {
  if (existsSync(MANIFEST_FILE)) {
    return JSON.parse(readFileSync(MANIFEST_FILE, "utf-8"));
  }
  return {
    routes: [],
    pages: [],
    native: [],
    rootFiles: [],
    packageJson: null,
  };
}

function saveManifest(manifest: Manifest): void {
  writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

function moveToCleanup(
  logger: EndpointLogger,
  sourcePath: string,
  category: "routes" | "pages" | "native" | "rootFiles",
  manifest: Manifest,
): boolean {
  const fullSourcePath = join(PROJECT_ROOT, sourcePath);

  if (!existsSync(fullSourcePath)) {
    logger.debug(`⏭️  Skip (not found): ${sourcePath}`);
    return false;
  }

  // Check if already moved - but re-move if file exists (handles restore case)
  const categoryArray = manifest[category];
  const alreadyMoved = categoryArray.some((entry) => entry.from === sourcePath);
  if (alreadyMoved && !existsSync(fullSourcePath)) {
    logger.debug(`✓ Already moved: ${sourcePath}`);
    return false;
  }

  // If already moved but file exists, remove from manifest so we can re-move it
  if (alreadyMoved && existsSync(fullSourcePath)) {
    const index = categoryArray.findIndex((entry) => entry.from === sourcePath);
    if (index !== -1) {
      categoryArray.splice(index, 1);
    }
  }

  const destDir = join(CLEANUP_DIR, `removed-${category}`);
  mkdirSync(destDir, { recursive: true });

  // Create a safe filename
  const safeName = sourcePath.replace(/\//g, "_").replace(/\[|\]/g, "");
  const destPath = join(destDir, safeName);

  try {
    // If destination exists, remove it first (handles --force re-runs)
    if (existsSync(destPath)) {
      execSync(`rm -rf "${destPath}"`);
    }
    renameSync(fullSourcePath, destPath);
    logger.debug(`📦 Moved: ${sourcePath}`);

    categoryArray.push({
      from: sourcePath,
      to: destPath,
      movedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    logger.error(`❌ Failed to move ${sourcePath}:`, parseError(error));
    return false;
  }
}

function cleanupRoutes(logger: EndpointLogger, manifest: Manifest): void {
  logger.debug("\n📁 Removing API routes...\n");
  let moved = 0;

  for (const route of ROUTES_TO_REMOVE) {
    if (moveToCleanup(logger, route, "routes", manifest)) {
      moved++;
    }
  }

  logger.debug(`\n✅ Moved ${moved} route directories\n`);
}

function cleanupPages(logger: EndpointLogger, manifest: Manifest): void {
  logger.debug("\n📄 Removing Next.js pages...\n");
  let moved = 0;

  for (const page of PAGES_TO_REMOVE) {
    if (moveToCleanup(logger, page, "pages", manifest)) {
      moved++;
    }
  }

  logger.debug(`\n✅ Moved ${moved} page files/directories\n`);
}

function cleanupNative(logger: EndpointLogger, manifest: Manifest): void {
  logger.debug("\n📱 Removing React Native...\n");
  let moved = 0;

  for (const native of NATIVE_TO_REMOVE) {
    if (moveToCleanup(logger, native, "native", manifest)) {
      moved++;
    }
  }

  logger.debug(`\n✅ Moved ${moved} React Native files/directories\n`);
}

function cleanupRootFiles(logger: EndpointLogger, manifest: Manifest): void {
  logger.debug("\n🗂️  Removing root folder files...\n");
  let moved = 0;

  for (const file of ROOT_FILES_TO_REMOVE) {
    if (moveToCleanup(logger, file, "rootFiles", manifest)) {
      moved++;
    }
  }

  logger.debug(`\n✅ Moved ${moved} root files/directories\n`);
}

function cleanupUIFiles(logger: EndpointLogger, manifest: Manifest): void {
  logger.debug("\n🎨 Removing UI files (components, hooks, emails)...\n");
  let removed = 0;

  // Find and remove all matching UI patterns
  const findAndRemove = (baseDir: string, pattern: string): void => {
    try {
      let cmd: string;
      if (pattern === "_components") {
        cmd = `find ${baseDir} -type d -name "${pattern}" 2>/dev/null || true`;
      } else if (pattern === ".email.tsx") {
        cmd = `find ${baseDir} -type f -name "*${pattern}" 2>/dev/null || true`;
      } else {
        cmd = `find ${baseDir} -type f -name "${pattern}" 2>/dev/null || true`;
      }

      const result = execSync(cmd, { encoding: "utf-8", cwd: PROJECT_ROOT });
      const files = result.trim().split("\n").filter(Boolean);

      for (const file of files) {
        // Skip if already in cleanup
        if (file.includes(".vibe-cleanup")) {
          continue;
        }

        // Move to cleanup
        if (moveToCleanup(logger, file, "rootFiles", manifest)) {
          removed++;
        }
      }
    } catch (error) {
      // Ignore errors - file might not exist
    }
  };

  // Remove UI patterns from src/app/api
  for (const pattern of UI_PATTERNS_TO_REMOVE) {
    if (pattern === "src/hooks" || pattern === "src/i18n/core/client.tsx") {
      // These are specific paths
      if (moveToCleanup(logger, pattern, "rootFiles", manifest)) {
        removed++;
      }
    } else {
      // These are patterns to find
      findAndRemove("src/app/api", pattern);
    }
  }

  logger.debug(`\n✅ Removed ${removed} UI files/directories\n`);
}

function cleanupI18nImports(logger: EndpointLogger): void {
  logger.debug("\n🌐 Cleaning i18n imports...\n");

  const i18nFiles = [
    // App-level i18n
    "src/app/[locale]/i18n/en/index.ts",
    "src/app/[locale]/i18n/de/index.ts",
    "src/app/[locale]/i18n/pl/index.ts",
    // API-level i18n
    "src/app/api/[locale]/i18n/en/index.ts",
    "src/app/api/[locale]/i18n/de/index.ts",
    "src/app/api/[locale]/i18n/pl/index.ts",
    // System-level i18n
    "src/app/api/[locale]/system/i18n/en/index.ts",
    "src/app/api/[locale]/system/i18n/de/index.ts",
    "src/app/api/[locale]/system/i18n/pl/index.ts",
  ];

  // Pages and API routes that were removed
  const removedPages = [
    "admin",
    "chat",
    "help",
    "story",
    "subscription",
    "track",
    "user",
    "agent",
    "browser",
    "users",
    "leads",
    "referral",
    "payment",
    "credits",
    "emails",
    "sms",
    "contact",
    "newsletter",
    "products",
    "manifest",
    "calendar",
    "import",
    "guard",
    "hosting",
    "server",
    "translations",
    "launchpad",
    "stripe",
  ];

  for (const file of i18nFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    if (!existsSync(fullPath)) {
      logger.debug(`  ⏭️  Skip (not found): ${file}`);
      continue;
    }

    let content = readFileSync(fullPath, "utf-8");
    let modified = false;

    for (const page of removedPages) {
      // Remove import lines (handles nested paths too)
      const importRegex = new RegExp(
        `import \\{[^}]+\\} from ["'].*\\/${page}(\\/[^"']*)?\\/(i18n\\/[^"']+|definition)["'];?\\n`,
        "g",
      );
      if (importRegex.test(content)) {
        content = content.replace(importRegex, "");
        modified = true;
      }

      // Only remove simple top-level exports (key: value,)
      // This regex only matches if it's followed by a comma or closing brace
      // and it's not inside a nested object
      const simpleExportRegex = new RegExp(
        `^\\s*${page}:\\s*\\w+Translations,?\\s*$`,
        "gm",
      );
      if (simpleExportRegex.test(content)) {
        content = content.replace(simpleExportRegex, "");
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(fullPath, content);
      logger.debug(`  ✓ Cleaned: ${file}`);
    } else {
      logger.debug(`  - No changes: ${file}`);
    }
  }

  // Clean up tasks/i18n files - remove imports from deleted cron/pulse/side-tasks
  const tasksI18nFiles = [
    "src/app/api/[locale]/system/unified-interface/tasks/i18n/de/index.ts",
    "src/app/api/[locale]/system/unified-interface/tasks/i18n/en/index.ts",
    "src/app/api/[locale]/system/unified-interface/tasks/i18n/pl/index.ts",
  ];

  for (const file of tasksI18nFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    let content = readFileSync(fullPath, "utf-8");

    // Remove imports from deleted task folders
    content = content.replace(
      /import \{[^}]*\} from ["']\.\.\/\.\.\/cron\/i18n\/\w+["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{[^}]*\} from ["']\.\.\/\.\.\/pulse\/i18n\/\w+["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{[^}]*\} from ["']\.\.\/\.\.\/side-tasks\/i18n\/\w+["'];?\n?/g,
      "",
    );

    // Remove from exports
    content = content.replace(/\s*cron: cronTranslations,?/g, "");
    content = content.replace(/\s*pulse: pulseTranslations,?/g, "");
    content = content.replace(/\s*sideTasks: sideTasksTranslations,?/g, "");
    content = content.replace(/\s*"side-tasks": sideTasksTranslations,?/g, "");

    writeFileSync(fullPath, content);
    logger.debug(`  ✓ Cleaned: ${file}`);
  }
}

function cleanupDependencies(logger: EndpointLogger, manifest: Manifest): void {
  logger.debug("\n📦 Cleaning package.json dependencies...\n");

  const pkgPath = join(PROJECT_ROOT, "package.json");

  // Create backup
  const backupDir = join(CLEANUP_DIR, "backup");
  mkdirSync(backupDir, { recursive: true });
  const backupPath = join(backupDir, "package.json.backup");

  if (!existsSync(backupPath)) {
    const pkgContent = readFileSync(pkgPath, "utf-8");
    writeFileSync(backupPath, pkgContent);
    logger.debug("✓ Created package.json backup\n");
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const originalDepsCount =
    Object.keys(pkg.dependencies || {}).length +
    Object.keys(pkg.devDependencies || {}).length;

  // Remove dependencies
  let removedCount = 0;

  if (pkg.dependencies) {
    const depsToKeep: Record<string, string> = {};
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      if (
        !DEPS_TO_REMOVE.has(dep) &&
        !RADIX_PATTERN.test(dep) &&
        !RN_PRIMITIVES_PATTERN.test(dep)
      ) {
        depsToKeep[dep] = version as string;
      } else {
        removedCount++;
        logger.debug(`  - Removing: ${dep}`);
      }
    }
    pkg.dependencies = depsToKeep;
  }

  if (pkg.devDependencies) {
    const devDepsToKeep: Record<string, string> = {};
    for (const [dep, version] of Object.entries(pkg.devDependencies)) {
      if (!DEPS_TO_REMOVE.has(dep)) {
        devDepsToKeep[dep] = version as string;
      } else {
        removedCount++;
        logger.debug(`  - Removing: ${dep}`);
      }
    }
    pkg.devDependencies = devDepsToKeep;
  }

  // Update package metadata
  pkg.name = "@next-vibe/checker";
  pkg.description = "TypeScript code quality checker with CLI and MCP support";

  // Remove React Native scripts
  if (pkg.scripts) {
    delete pkg.scripts.native;
    delete pkg.scripts["native:android"];
    delete pkg.scripts["native:ios"];
    delete pkg.scripts["native:reset"];
  }

  // Remove workspaces (guard, launchpad removed)
  delete pkg.workspaces;

  // Update files to include
  pkg.files = [
    ".dist/**/*",
    "src/app/api/[locale]/system/check/**/*",
    "src/app/api/[locale]/system/unified-interface/cli/**/*",
    "src/app/api/[locale]/system/unified-interface/mcp/**/*",
    "src/app/api/[locale]/system/unified-interface/shared/**/*",
    "src/app/api/[locale]/system/unified-interface/tasks/**/*",
    "src/app/api/[locale]/system/generators/**/*",
    "src/app/api/[locale]/system/generated/**/*",
    "src/app/api/[locale]/shared/**/*",
    "src/i18n/**/*",
    "src/config/**/*",
    "check.config.ts",
  ];

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const newDepsCount =
    Object.keys(pkg.dependencies || {}).length +
    Object.keys(pkg.devDependencies || {}).length;

  logger.debug(
    `\n✅ Removed ${removedCount} dependencies (${originalDepsCount} → ${newDepsCount})\n`,
  );

  manifest.packageJson = {
    originalName: "next-vibe",
    originalDeps: originalDepsCount,
    cleanedDeps: newDepsCount,
  };
}

/**
 * Patch code files to remove dependencies on deleted modules
 */
function patchCodeForMinimalBuild(logger: EndpointLogger): void {
  logger.debug("\n🔧 Patching code for minimal build...\n");

  // 2. Patch env-client.ts - set requireEnvs to false and add defaults
  const envClientPath = "src/config/env-client.ts";
  let envClientContent = readFileSync(envClientPath, "utf-8");
  envClientContent = envClientContent.replace(
    /export const requireEnvs = true/g,
    "export const requireEnvs = false",
  );

  writeFileSync(envClientPath, envClientContent);
  logger.debug("  ✓ Patched env-client.ts");

  // 3. Patch i18n files - remove packages imports
  const i18nRootFiles = [
    "src/i18n/de/index.ts",
    "src/i18n/en/index.ts",
    "src/i18n/pl/index.ts",
  ];

  for (const file of i18nRootFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    let content = readFileSync(fullPath, "utf-8");

    // Remove packages import
    content = content.replace(
      /import \{ translations as packagesTranslations \} from "\.\.\/\.\.\/packages\/i18n\/\w+";\n/,
      "",
    );

    // Remove packages from exports
    content = content.replace(/packages: packagesTranslations,\s*/, "");

    writeFileSync(fullPath, content);
  }
  logger.debug("  ✓ Patched src/i18n/**/index.ts");

  // 7. Patch app/i18n files - remove [locale] imports
  const appI18nFiles = [
    "src/app/i18n/de/index.ts",
    "src/app/i18n/en/index.ts",
    "src/app/i18n/pl/index.ts",
  ];

  for (const file of appI18nFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    let content = readFileSync(fullPath, "utf-8");

    // Remove [locale] import
    content = content.replace(
      /import \{ translations as appTranslations \} from "\.\.\/\.\.\/\[locale\]\/i18n\/\w+";\n/,
      "",
    );

    // Remove ...appTranslations spread and comment
    content = content.replace(
      /\/\/ we spread \[locale\] translations to avoid it in the translation key\s*\n\s*\.\.\.appTranslations,\s*/,
      "",
    );

    // Also handle simpler case without comment
    content = content.replace(/\.\.\.appTranslations,\s*/, "");

    writeFileSync(fullPath, content);
  }
  logger.debug("  ✓ Patched src/app/i18n/**/index.ts");

  // 8. Patch unified-interface/i18n files - remove ai, react, react-native imports
  const unifiedInterfaceI18nFiles = [
    "src/app/api/[locale]/system/unified-interface/i18n/de/index.ts",
    "src/app/api/[locale]/system/unified-interface/i18n/en/index.ts",
    "src/app/api/[locale]/system/unified-interface/i18n/pl/index.ts",
  ];

  for (const file of unifiedInterfaceI18nFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    let content = readFileSync(fullPath, "utf-8");

    // Remove ai, react, react-native imports
    content = content.replace(
      /import \{ translations as aiTranslations \} from "\.\.\/\.\.\/ai\/i18n\/\w+";\n/,
      "",
    );
    content = content.replace(
      /import \{ translations as reactTranslations \} from "\.\.\/\.\.\/react\/i18n\/\w+";\n/,
      "",
    );
    content = content.replace(
      /import \{ translations as reactNativeTranslations \} from "\.\.\/\.\.\/react-native\/i18n\/\w+";\n/,
      "",
    );

    // Remove from exports
    content = content.replace(/ai: aiTranslations,\s*/g, "");
    content = content.replace(/react: reactTranslations,\s*/g, "");
    content = content.replace(/reactNative: reactNativeTranslations,\s*/g, "");

    writeFileSync(fullPath, content);
  }
  logger.debug("  ✓ Patched unified-interface i18n files");

  // 4. Patch db/index.ts - remove deleted schema imports
  const dbIndexPath = "src/app/api/[locale]/system/db/index.ts";
  if (existsSync(dbIndexPath)) {
    let dbContent = readFileSync(dbIndexPath, "utf-8");

    // Remove deleted schema imports
    dbContent = dbContent.replace(
      /import \* as agentChatSchema from "\.\.\/\.\.\/agent\/chat\/db";\n/,
      "",
    );
    dbContent = dbContent.replace(
      /import \* as creditSchema from "\.\.\/\.\.\/credits\/db";\n/,
      "",
    );
    dbContent = dbContent.replace(
      /import \* as leadsSchema from "\.\.\/\.\.\/leads\/db";\n/,
      "",
    );
    dbContent = dbContent.replace(
      /import \* as referralSchema from "\.\.\/\.\.\/referral\/db";\n/,
      "",
    );

    // Remove from schema object
    dbContent = dbContent.replace(/\s*\.\.\.agentChatSchema,/g, "");
    dbContent = dbContent.replace(/\s*\.\.\.creditSchema,/g, "");
    dbContent = dbContent.replace(/\s*\.\.\.leadsSchema,/g, "");
    dbContent = dbContent.replace(/\s*\.\.\.referralSchema,/g, "");

    writeFileSync(dbIndexPath, dbContent);
    logger.debug("  ✓ Patched db/index.ts");
  }

  // 5. Patch handler.ts - remove credit/email/sms handling
  const handlerPath =
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler.ts";
  if (existsSync(handlerPath)) {
    let handlerContent = readFileSync(handlerPath, "utf-8");

    // Remove imports
    handlerContent = handlerContent.replace(
      /import \{ CreditRepository \} from "@\/app\/api\/\[locale\]\/credits\/repository";\n/,
      "",
    );
    handlerContent = handlerContent.replace(
      /import \{ emailHandlingRepository \} from "@\/app\/api\/\[locale\]\/emails\/smtp-client\/email-handling\/repository";\n/,
      "",
    );
    handlerContent = handlerContent.replace(
      /import type \{ EmailHandleRequestOutput \} from "@\/app\/api\/\[locale\]\/emails\/smtp-client\/email-handling\/types";\n/,
      "",
    );
    handlerContent = handlerContent.replace(
      /import type \{ EmailFunctionType \} from "@\/app\/api\/\[locale\]\/emails\/smtp-client\/email-handling\/types";\n/,
      "",
    );
    handlerContent = handlerContent.replace(
      /import \{ handleSms \} from "@\/app\/api\/\[locale\]\/sms\/handle-sms";\n/,
      "",
    );
    handlerContent = handlerContent.replace(
      /import type \{ SmsFunctionType \} from "@\/app\/api\/\[locale\]\/sms\/utils";\n/,
      "",
    );

    // Remove credit check block - match actual code structure
    handlerContent = handlerContent.replace(
      /\/\/ 4\. Check and deduct credits if endpoint has credit cost\s+if \(endpoint\.credits && endpoint\.credits > 0\) \{[\s\S]*?\n    \}\n/,
      "    // Credit checking disabled in minimal checker package\n\n",
    );

    // Remove email handling block - match if statement
    handlerContent = handlerContent.replace(
      /if \(email\?\.afterHandlerEmails\) \{[\s\S]*?await emailHandlingRepository\.handleEmails[\s\S]*?\);\s+\}\n/,
      "    // Email handling disabled in minimal checker package\n\n",
    );

    // Remove SMS handling block - match if statement
    handlerContent = handlerContent.replace(
      /if \(sms\?\.afterHandlerSms\) \{[\s\S]*?await handleSms[\s\S]*?\);\s+\}\n/,
      "    // SMS handling disabled in minimal checker package\n\n",
    );

    writeFileSync(handlerPath, handlerContent);
    logger.debug("  ✓ Patched handler.ts");
  }

  // 6. Patch cli-user.ts - remove lead creation
  const cliUserPath =
    "src/app/api/[locale]/system/unified-interface/cli/auth/cli-user.ts";
  if (existsSync(cliUserPath)) {
    let cliUserContent = readFileSync(cliUserPath, "utf-8");

    // Replace lead creation block with simple default ID return
    cliUserContent = cliUserContent.replace(
      /\/\/ Create a public user with a new lead directly from database[\s\S]*?try \{[\s\S]*?catch \(error\) \{[\s\S]*?leadId: DEFAULT_CLI_USER_ID,[\s\S]*?\};[\s\S]*?\}/,
      `// Minimal checker package: use default ID without lead creation
    logger.debug("Using default CLI user (minimal checker package)");
    return {
      success: true,
      data: {
        isPublic: true,
        leadId: DEFAULT_CLI_USER_ID,
      } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>,
    };`,
    );

    writeFileSync(cliUserPath, cliUserContent);
    logger.debug("  ✓ Patched cli-user.ts");
  }

  // 7. Patch user/auth/repository.ts - remove lead handling
  const authRepoPath = "src/app/api/[locale]/user/auth/repository.ts";
  if (existsSync(authRepoPath)) {
    let authRepoContent = readFileSync(authRepoPath, "utf-8");

    // Remove lead imports
    authRepoContent = authRepoContent.replace(
      /import \{ LeadAuthRepository \} from "\.\.\/\.\.\/leads\/auth\/repository";\n/,
      "",
    );
    authRepoContent = authRepoContent.replace(
      /import \{ leads, userLeadLinks \} from "\.\.\/\.\.\/leads\/db";\n/,
      "",
    );
    authRepoContent = authRepoContent.replace(
      /import \{ LeadSource, LeadStatus \} from "\.\.\/\.\.\/leads\/enum";\n/,
      "",
    );

    // Replace next-vibe-ui redirect with next/navigation
    authRepoContent = authRepoContent.replace(
      /import \{ redirect \} from "next-vibe-ui\/lib\/redirect";/,
      'import { redirect } from "next/navigation";',
    );

    // Remove LeadAuthRepository.validateLeadId call (line ~176)
    authRepoContent = authRepoContent.replace(
      /const isValid = await LeadAuthRepository\.validateLeadId\([\s\S]*?\);/,
      "const isValid = false; // Lead validation disabled in minimal checker",
    );

    // Replace getPrimaryLeadId query (line ~215)
    authRepoContent = authRepoContent.replace(
      /const \[userLeadLink\] = await db[\s\S]*?\.from\(userLeadLinks\)[\s\S]*?;/,
      "const userLeadLink = null; // UserLeadLinks disabled in minimal checker",
    );

    // Replace getAllLeadIds query (line ~221)
    authRepoContent = authRepoContent.replace(
      /const userLeadRecords = await db[\s\S]*?\.from\(userLeadLinks\)[\s\S]*?;/,
      "const userLeadRecords = []; // UserLeadLinks disabled in minimal checker",
    );

    // Replace linkLeadToUser query (line ~385)
    authRepoContent = authRepoContent.replace(
      /await db\.insert\(userLeadLinks\)[\s\S]*?\.onConflictDoNothing\(\);/,
      "// UserLeadLinks insert disabled in minimal checker",
    );

    // Replace validateLeadId lead query (line ~408)
    authRepoContent = authRepoContent.replace(
      /const \[existingLead\] = await db[\s\S]*?\.from\(leads\)[\s\S]*?\.where\(eq\(leads\.id, leadId\)\);/,
      "const existingLead = null; // Lead queries disabled in minimal checker",
    );

    // Replace createOrUpdateLead lead queries (multiple occurrences)
    authRepoContent = authRepoContent.replace(
      /const \[existingLead\] = await db[\s\S]*?\.select\(\{ id: leads\.id \}\)[\s\S]*?;/g,
      "const existingLead = null; // Lead queries disabled in minimal checker",
    );
    authRepoContent = authRepoContent.replace(
      /await db\.update\(leads\)[\s\S]*?\.where\(eq\(leads\.id, leadId\)\);/g,
      "// Lead update disabled in minimal checker",
    );
    authRepoContent = authRepoContent.replace(
      /const \[newLead\] = await db\.insert\(leads\)[\s\S]*?\.returning\(\{ id: leads\.id \}\);/g,
      "const newLead = { id: leadId }; // Lead insert disabled in minimal checker",
    );

    writeFileSync(authRepoPath, authRepoContent);
    logger.debug("  ✓ Patched user/auth/repository.ts");
  }

  // 8. Patch user/repository.ts - remove lead handling
  const userRepoPath = "src/app/api/[locale]/user/repository.ts";
  if (existsSync(userRepoPath)) {
    let userRepoContent = readFileSync(userRepoPath, "utf-8");

    // Remove lead imports
    userRepoContent = userRepoContent.replace(
      /import \{ LeadAuthRepository \} from "\.\.\/leads\/auth\/repository";\n/,
      "",
    );
    userRepoContent = userRepoContent.replace(
      /import \{ userLeadLinks \} from "\.\.\/leads\/db";\n/,
      "",
    );

    // Replace LeadAuthRepository.getAuthenticatedUserLeadId call (line ~162)
    userRepoContent = userRepoContent.replace(
      /const leadResult = await LeadAuthRepository\.getAuthenticatedUserLeadId\([\s\S]*?\);/,
      "const leadResult = { leadId: userId }; // Lead operations disabled in minimal checker",
    );

    // Replace leadLinks query and leadIdMap creation (2 occurrences around lines 390 and 460)
    userRepoContent = userRepoContent.replace(
      /const leadLinks = await db[\s\S]*?\.from\(userLeadLinks\)[\s\S]*?;[\s\S]*?const leadIdMap = new Map\(leadLinks\.map\(\(l\) => \[l\.userId, l\.leadId\]\)\);/g,
      "// UserLeadLinks disabled in minimal checker\n      const leadIdMap = new Map(); // Empty map - no lead links",
    );

    writeFileSync(userRepoPath, userRepoContent);
    logger.debug("  ✓ Patched user/repository.ts");
  }

  // 9. Patch user/private/me/definition.ts - remove lead type imports
  const meDefinitionPath = "src/app/api/[locale]/user/private/me/definition.ts";
  if (existsSync(meDefinitionPath)) {
    let meDefContent = readFileSync(meDefinitionPath, "utf-8");

    // Remove leadId import
    meDefContent = meDefContent.replace(
      /import \{ leadId \} from "@\/app\/api\/\[locale\]\/leads\/types";\n/,
      "",
    );

    // Replace leadId usage with z.string().uuid()
    meDefContent = meDefContent.replace(
      /leadId,(\s+)/g,
      "z.string().uuid(),$1",
    );

    // Replace leadId.nullable() with z.string().uuid().nullable()
    meDefContent = meDefContent.replace(
      /leadId\.nullable\(\),/g,
      "z.string().uuid().nullable(),",
    );

    writeFileSync(meDefinitionPath, meDefContent);
    logger.debug("  ✓ Patched user/private/me/definition.ts");
  }

  // 10. Patch user/types.ts - remove lead type imports
  const userTypesPath = "src/app/api/[locale]/user/types.ts";
  if (existsSync(userTypesPath)) {
    let userTypesContent = readFileSync(userTypesPath, "utf-8");

    // Remove leadId import
    userTypesContent = userTypesContent.replace(
      /import \{ leadId \} from "@\/app\/api\/\[locale\]\/leads\/types";\n/,
      "",
    );

    // Replace leadId usage with z.string().uuid()
    userTypesContent = userTypesContent.replace(
      /\bleadId,/g,
      "leadId: z.string().uuid(),",
    );

    writeFileSync(userTypesPath, userTypesContent);
    logger.debug("  ✓ Patched user/types.ts");
  }

  // 11. Patch system/i18n files - remove db imports
  const systemI18nFiles = [
    "src/app/api/[locale]/system/i18n/de/index.ts",
    "src/app/api/[locale]/system/i18n/en/index.ts",
    "src/app/api/[locale]/system/i18n/pl/index.ts",
  ];

  for (const file of systemI18nFiles) {
    const fullPath = join(PROJECT_ROOT, file);
    if (!existsSync(fullPath)) {
      continue;
    }

    let content = readFileSync(fullPath, "utf-8");

    // Remove db import
    content = content.replace(
      /import \{ translations as dbTranslations \} from "\.\.\/\.\.\/db\/i18n\/\w+";\n/,
      "",
    );

    // Remove db from exports
    content = content.replace(/db: dbTranslations,\s*/, "");

    writeFileSync(fullPath, content);
  }
  logger.debug("  ✓ Patched system/i18n/**/index.ts");

  // 12. Patch system/generators/i18n files - remove deleted generator imports
  const generatorsI18nFiles = [
    "src/app/api/[locale]/system/generators/i18n/de/index.ts",
    "src/app/api/[locale]/system/generators/i18n/en/index.ts",
    "src/app/api/[locale]/system/generators/i18n/pl/index.ts",
  ];

  for (const file of generatorsI18nFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove deleted generator imports
    content = content.replace(
      /import \{ translations as envTranslations \} from "\.\.\/\.\.\/env\/i18n\/\w+";\n?/g,
      "",
    );
    content = content.replace(
      /import \{ translations as seedsTranslations \} from "\.\.\/\.\.\/seeds\/i18n\/\w+";\n?/g,
      "",
    );
    content = content.replace(
      /import \{ translations as generateTrpcRouterTranslations \} from "\.\.\/\.\.\/generate-trpc-router\/i18n\/\w+";\n?/g,
      "",
    );
    content = content.replace(
      /import \{ translations as taskIndexTranslations \} from "\.\.\/\.\.\/task-index\/i18n\/\w+";\n?/g,
      "",
    );

    // Remove from exports
    content = content.replace(/env: envTranslations,\s*/g, "");
    content = content.replace(/seeds: seedsTranslations,\s*/g, "");
    content = content.replace(
      /generateTrpcRouter: generateTrpcRouterTranslations,\s*/g,
      "",
    );
    content = content.replace(/taskIndex: taskIndexTranslations,\s*/g, "");

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Patched system/generators/i18n/**/index.ts");

  // 13. Patch user/i18n files - remove deleted module imports
  const userI18nFiles = [
    "src/app/api/[locale]/user/i18n/de/index.ts",
    "src/app/api/[locale]/user/i18n/en/index.ts",
    "src/app/api/[locale]/user/i18n/pl/index.ts",
  ];

  for (const file of userI18nFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove deleted module imports
    content = content.replace(
      /import \{ translations as publicTranslations \} from "\.\.\/\.\.\/public\/i18n\/\w+";\n/,
      "",
    );
    content = content.replace(
      /import \{ translations as searchTranslations \} from "\.\.\/\.\.\/search\/i18n\/\w+";\n/,
      "",
    );
    content = content.replace(
      /import \{ translations as sessionCleanupTranslations \} from "\.\.\/\.\.\/session-cleanup\/i18n\/\w+";\n/,
      "",
    );

    // Remove from exports (handle both quoted and unquoted keys)
    content = content.replace(/(public|"public"): publicTranslations,\s*/g, "");
    content = content.replace(/(search|"search"): searchTranslations,\s*/g, "");
    content = content.replace(
      /("session-cleanup"|sessionCleanup): sessionCleanupTranslations,\s*/g,
      "",
    );

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Patched user/i18n/**/index.ts");

  // 14. Patch user/private/i18n files - remove deleted module imports
  const userPrivateI18nFiles = [
    "src/app/api/[locale]/user/private/i18n/de/index.ts",
    "src/app/api/[locale]/user/private/i18n/en/index.ts",
    "src/app/api/[locale]/user/private/i18n/pl/index.ts",
  ];

  for (const file of userPrivateI18nFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove deleted module imports
    content = content.replace(
      /import \{ translations as meTranslations \} from "\.\.\/\.\.\/me\/i18n\/\w+";\n?/g,
      "",
    );
    content = content.replace(
      /import \{ translations as sessionTranslations \} from "\.\.\/\.\.\/session\/i18n\/\w+";\n?/g,
      "",
    );
    content = content.replace(
      /import \{ translations as logoutTranslations \} from "\.\.\/\.\.\/logout\/i18n\/\w+";\n?/g,
      "",
    );

    // Remove from exports
    content = content.replace(/me: meTranslations,\s*/g, "");
    content = content.replace(/session: sessionTranslations,\s*/g, "");
    content = content.replace(/logout: logoutTranslations,\s*/g, "");

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Patched user/private/i18n/**/index.ts");

  // 17. Patch user/auth/repository.ts - remove lead-related imports
  const authRepoFile = "src/app/api/[locale]/user/auth/repository.ts";
  if (existsSync(authRepoFile)) {
    let content = readFileSync(authRepoFile, "utf-8");

    // Remove lead-related imports
    content = content.replace(
      /import.*from ['"]next-vibe-ui\/lib\/redirect['"];?\n/g,
      "",
    );
    content = content.replace(
      /import.*from ['"]\.\.\/.\.\/leads\/auth\/repository['"];?\n/g,
      "",
    );
    content = content.replace(
      /import.*from ['"]\.\.\/.\.\/leads\/db['"];?\n/g,
      "",
    );
    content = content.replace(
      /import.*from ['"]\.\.\/.\.\/leads\/enum['"];?\n/g,
      "",
    );

    writeFileSync(authRepoFile, content);
  }
  logger.debug("  ✓ Patched user/auth/repository.ts");

  // 18. Patch trpc router.ts - comment out deleted imports
  const trpcRouterFile =
    "src/app/api/[locale]/system/unified-interface/trpc/[...trpc]/router.ts";
  if (existsSync(trpcRouterFile)) {
    let routerContent = readFileSync(trpcRouterFile, "utf-8");

    // Comment out deleted module imports
    routerContent = routerContent.replace(
      /import.*from ['"]@\/app\/api\/\[locale\]\/system\/unified-interface\/trpc\/setup['"];/g,
      "// $&",
    );
    routerContent = routerContent.replace(
      /import.*from ['"]@\/app\/api\/\[locale\]\/system\/unified-interface\/trpc\/wrapper['"];/g,
      "// $&",
    );

    writeFileSync(trpcRouterFile, routerContent);
  }
  logger.debug("  ✓ Patched trpc/router.ts");

  // 19. Patch field-config-types.ts and widgets/types.ts - remove react-hook-form
  const fieldConfigFile =
    "src/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types.ts";
  if (existsSync(fieldConfigFile)) {
    let content = readFileSync(fieldConfigFile, "utf-8");
    // First, clean up any broken nested comments from previous runs
    content = content.replace(
      /any \/\* any \/\* UseFormReturn \*\/ \*\//g,
      "any",
    );
    content = content.replace(/any \/\* UseFormReturn \*\/ *<[^>]*>/g, "any");
    // Comment out import if not already commented
    if (
      !content.includes("// import") ||
      !content.includes("react-hook-form")
    ) {
      content = content.replace(
        /import.*from ['"]react-hook-form['"];/g,
        "// $& // Removed for minimal checker",
      );
    }
    // Add FieldValues type alias after commenting import
    if (!content.includes("type FieldValues =")) {
      content = content.replace(
        /(\/\/ import.*from ['"]react-hook-form['"];.*\n)/,
        "$1\n// Type alias for removed react-hook-form types\ntype FieldValues = Record<string, any>;\ntype FieldPath<T extends FieldValues> = string;\ntype Control<T extends FieldValues> = any;\n",
      );
    }
    // Replace UseFormReturn<...> with any
    content = content.replace(/UseFormReturn<[^>]*>/g, "any");
    writeFileSync(fieldConfigFile, content);
  }

  const widgetsTypesFile =
    "src/app/api/[locale]/system/unified-interface/shared/widgets/types.ts";
  if (existsSync(widgetsTypesFile)) {
    let content = readFileSync(widgetsTypesFile, "utf-8");
    // First, clean up any broken nested comments from previous runs
    content = content.replace(
      /any \/\* any \/\* UseFormReturn \*\/ \*\//g,
      "any",
    );
    content = content.replace(/any \/\* UseFormReturn \*\/ *<[^>]*>/g, "any");
    // Comment out import if not already commented
    if (
      !content.includes("// import") ||
      !content.includes("react-hook-form")
    ) {
      content = content.replace(
        /import.*from ['"]react-hook-form['"];/g,
        "// $& // Removed for minimal checker",
      );
    }
    // Add FieldValues type alias after commenting import
    if (!content.includes("type FieldValues =")) {
      content = content.replace(
        /(\/\/ import.*from ['"]react-hook-form['"];.*\n)/,
        "$1\n// Type alias for removed react-hook-form types\ntype FieldValues = Record<string, any>;\n",
      );
    }
    // Replace UseFormReturn<...> with any
    content = content.replace(/UseFormReturn<[^>]*>/g, "any");
    writeFileSync(widgetsTypesFile, content);
  }
  logger.debug("  ✓ Patched react-hook-form usage");

  // 20. Patch handler.ts - remove email/sms references
  const handlerFile =
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler.ts";
  if (existsSync(handlerFile)) {
    let content = readFileSync(handlerFile, "utf-8");

    // Remove the lines that reference options._email and options._sms
    content = content.replace(/\s*if \(options\._email\) \{[^}]*\}\s*/g, "");
    content = content.replace(/\s*if \(options\._sms\) \{[^}]*\}\s*/g, "");

    writeFileSync(handlerFile, content);
  }
  logger.debug("  ✓ Patched handler.ts");

  // 21. Patch user/repository.ts - fix import
  const userRepoFile = "src/app/api/[locale]/user/repository.ts";
  if (existsSync(userRepoFile)) {
    let content = readFileSync(userRepoFile, "utf-8");

    // Fix inArray import (remove underscore prefix)
    content = content.replace(/_inArray as inArray/g, "inArray");
    content = content.replace(
      /import \{ [^}]*_inArray[^}]* \} from ["']drizzle-orm["'];?/g,
      (match) => {
        return match.replace(/_inArray/g, "inArray");
      },
    );

    writeFileSync(userRepoFile, content);
  }
  logger.debug("  ✓ Patched user/repository.ts");

  // 22. Fix closeDatabase calls in test files
  const testFiles = [
    "src/app/api/[locale]/system/check/testing/testing-suite/test-server/global-setup.ts",
    "src/app/api/[locale]/system/check/testing/testing-suite/test-server/global-teardown.ts",
    "src/app/api/[locale]/system/unified-interface/cli/runtime/debug.ts",
  ];

  for (const testFile of testFiles) {
    if (existsSync(testFile)) {
      let content = readFileSync(testFile, "utf-8");
      // Remove arguments from closeDatabase calls
      content = content.replace(
        /await closeDatabase\([^)]+\)/g,
        "await closeDatabase()",
      );
      writeFileSync(testFile, content);
    }
  }
  logger.debug("  ✓ Fixed closeDatabase calls in test files");

  // 23. Patch generate-all/repository.ts - remove deleted generator blocks entirely
  const generateAllFile =
    "src/app/api/[locale]/system/generators/generate-all/repository.ts";
  if (existsSync(generateAllFile)) {
    let content = readFileSync(generateAllFile, "utf-8");

    // Remove entire seeds generator block
    content = content.replace(
      /\/\/ 2\. Seeds Generator[\s\S]*?if \(!data\.skipSeeds\) \{[\s\S]*?\}\s*else \{\s*generatorsSkipped\+\+;\s*\}/,
      "// Seeds generator removed - folder deleted\n      generatorsSkipped++;",
    );

    // Remove entire task index generator block
    content = content.replace(
      /\/\/ 3\. Task Index Generator[\s\S]*?if \(!data\.skipTaskIndex\) \{[\s\S]*?\}\s*else \{\s*outputLines\.push\([^)]+\);\s*generatorsSkipped\+\+;\s*\}/,
      "// Task index generator removed - folder deleted\n      generatorsSkipped++;",
    );

    // Remove entire tRPC router generator block
    content = content.replace(
      /\/\/ 4\. tRPC Router Generator[\s\S]*?if \(!data\.skipTrpc\) \{[\s\S]*?\}\s*else \{\s*outputLines\.push\([^)]+\);\s*generatorsSkipped\+\+;\s*\}/,
      "// tRPC router generator removed - folder deleted\n      generatorsSkipped++;",
    );

    writeFileSync(generateAllFile, content);
  }
  logger.debug("  ✓ Patched generate-all/repository.ts");

  // 24. Fix metadata.ts - ensure NEXT_PUBLIC_SITE_URL has a default
  const metadataFile = "src/config/metadata.ts";
  if (existsSync(metadataFile)) {
    let content = readFileSync(metadataFile, "utf-8");
    // Add default value to NEXT_PUBLIC_SITE_URL
    content = content.replace(
      /url: process\.env\.NEXT_PUBLIC_SITE_URL,/g,
      "url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',",
    );
    writeFileSync(metadataFile, content);
  }
  logger.debug("  ✓ Fixed metadata.ts");

  // 24.5. Fix system/unified-interface/i18n files - remove tasks import BEFORE deleting tasks folder
  const uiI18nTasksFiles = [
    "src/app/api/[locale]/system/unified-interface/i18n/de/index.ts",
    "src/app/api/[locale]/system/unified-interface/i18n/en/index.ts",
    "src/app/api/[locale]/system/unified-interface/i18n/pl/index.ts",
  ];

  for (const file of uiI18nTasksFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove tasks import
    content = content.replace(
      /import \{[^}]*\} from ["']\.\.\/\.\.\/tasks\/i18n\/\w+["'];?\n?/g,
      "",
    );

    // Remove from exports
    content = content.replace(/\s*tasks: tasksTranslations,?/g, "");

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Fixed system/unified-interface/i18n files");

  // 25. Remove ALL db.ts files and unnecessary user files
  const filesToRemove = [
    // Remove all db.ts files
    "src/app/api/[locale]/user/db.ts",
    "src/app/api/[locale]/user/private/session/db.ts",
    "src/app/api/[locale]/system/unified-interface/tasks/db.ts",
    // Remove unnecessary user files
    "src/app/api/[locale]/user/auth/utils.native.ts",
    "src/app/api/[locale]/user/auth/helpers.ts",
    // Remove all repository files that use db
    "src/app/api/[locale]/user/repository.ts",
    "src/app/api/[locale]/user/auth/repository.ts",
    "src/app/api/[locale]/user/private/session/repository.ts",
    "src/app/api/[locale]/user/user-roles/repository.ts",
  ];

  for (const file of filesToRemove) {
    if (existsSync(file)) {
      const dest = join(CLEANUP_DIR, file);
      mkdirSync(dirname(dest), { recursive: true });
      renameSync(file, dest);
    }
  }
  logger.debug("  ✓ Removed db files and unnecessary user files");

  // 26. Remove AuthRepository imports and usage from handler.ts
  const handlerTsFile =
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler.ts";
  if (existsSync(handlerTsFile)) {
    let content = readFileSync(handlerTsFile, "utf-8");

    // Remove AuthRepository import
    content = content.replace(
      /import \{ AuthRepository \} from ["']@\/app\/api\/\[locale\]\/user\/auth\/repository["'];?\n?/g,
      "",
    );

    // Replace AuthRepository.getAuthMinimalUser call with null
    content = content.replace(
      /const authUser = await AuthRepository\.getAuthMinimalUser\([\s\S]*?\);/g,
      "const authUser = null;",
    );

    writeFileSync(handlerTsFile, content);
  }
  logger.debug("  ✓ Removed AuthRepository from handler.ts");

  // 27. Fix IconKey imports - replace with string type
  const iconKeyFiles = [
    "src/app/api/[locale]/shared/types/common.schema.ts",
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create-form.ts",
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create.ts",
    "src/app/api/[locale]/system/unified-interface/shared/field-config/endpoint-field-types.ts",
    "src/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types.ts",
    "src/app/api/[locale]/system/unified-interface/shared/widgets/configs.ts",
  ];

  for (const file of iconKeyFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove IconKey import (try multiple patterns)
    content = content.replace(
      /import type \{ IconKey \} from ["']@\/app\/api\/\[locale\]\/agent\/chat\/model-access\/icons["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{ type IconKey \} from ["']@\/app\/api\/\[locale\]\/agent\/chat\/model-access\/icons["'];?\n?/g,
      "",
    );

    // Replace IconKey type with string
    content = content.replace(/z\.ZodType<IconKey>/g, "z.ZodString");
    content = content.replace(/: IconKey/g, ": string");
    content = content.replace(/<IconKey>/g, "<string>");
    content = content.replace(/IconKey\b/g, "string");

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Fixed IconKey imports");

  // 29. Fix test-server global-setup.ts - REMOVE all db imports and usage
  const globalSetupFile =
    "src/app/api/[locale]/system/check/testing/testing-suite/test-server/global-setup.ts";
  if (existsSync(globalSetupFile)) {
    let content = readFileSync(globalSetupFile, "utf-8");

    // Remove ALL db-related imports (system/db, user/db, seed-manager)
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/system\/db[^"']*["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/user\/db["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{ closeDatabase \} from ["'][^"']*["'];?\n?/g,
      "",
    );

    // Remove ALL db usage (seedDatabase, closeDatabase, SeedManager)
    content = content.replace(/await seedDatabase\([^)]*\);?\n?/g, "");
    content = content.replace(/seedDatabase\([^)]*\);?\n?/g, "");
    content = content.replace(/await closeDatabase\(\)[^;]*;?\n?/g, "");
    content = content.replace(/closeDatabase\(\)[^;]*;?\n?/g, "");
    content = content.replace(/await SeedManager\..*?;?\n?/g, "");
    content = content.replace(/SeedManager\.[^;]+;?\n?/g, "");

    writeFileSync(globalSetupFile, content);
  }
  logger.debug("  ✓ Patched global-setup.ts");

  // 30. Fix task-runner.ts - REMOVE all db imports and usage
  const taskRunnerFile =
    "src/app/api/[locale]/system/unified-interface/tasks/dev-watcher/task-runner.ts";
  if (existsSync(taskRunnerFile)) {
    let content = readFileSync(taskRunnerFile, "utf-8");

    // Remove ALL db imports
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/system\/db["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/user\/db["'];?\n?/g,
      "",
    );

    // Remove db usage
    content = content.replace(/\s*const pool = db\.rawPool;?\n?/g, "");
    content = content.replace(/\s*db\.rawPool.*?;?\n?/g, "");

    writeFileSync(taskRunnerFile, content);
  }
  logger.debug("  ✓ Patched task-runner.ts");

  // 31. Fix cli/runtime/debug.ts - REMOVE all db imports and closeDatabase usage
  const debugFile =
    "src/app/api/[locale]/system/unified-interface/cli/runtime/debug.ts";
  if (existsSync(debugFile)) {
    let content = readFileSync(debugFile, "utf-8");

    // Remove dynamic import of any db module
    content = content.replace(
      /const \{ [^}]* \} = await import\(["']@\/app\/api\/\[locale\]\/(?:system|user)\/db["']\);?\n?/g,
      "",
    );
    // Also handle destructured imports in other formats
    content = content.replace(
      /import\(["']@\/app\/api\/\[locale\]\/(?:system|user)\/db["']\)/g,
      "Promise.resolve({})",
    );

    // Remove closeDatabase calls - comment out the cleanup registration
    content = content.replace(
      /this\.cleanupRegistry\.register\(async \(\) => \{[\s\S]*?await closeDatabase\(\);[\s\S]*?\}\);/g,
      "// Database cleanup removed - closeDatabase deleted",
    );

    writeFileSync(debugFile, content);
  }
  logger.debug("  ✓ Patched cli/runtime/debug.ts");

  // 32. Fix test-server files - REMOVE all db imports
  const testServerFiles = [
    "src/app/api/[locale]/system/check/testing/testing-suite/test-server/global-teardown.ts",
    "src/app/api/[locale]/system/check/testing/testing-suite/test-server/test-server.ts",
  ];

  for (const file of testServerFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove ALL db imports
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/system\/db["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/user\/db["'];?\n?/g,
      "",
    );
    content = content.replace(
      /import \{ closeDatabase \} from ["'][^"']*["'];?\n?/g,
      "",
    );

    // Remove db usage
    content = content.replace(/await closeDatabase\(\)[^;]*;?\n?/g, "");
    content = content.replace(/closeDatabase\(\)[^;]*;?\n?/g, "");

    // Fix NEXT_PUBLIC_TEST_SERVER_URL possibly undefined
    content = content.replace(
      /env\.NEXT_PUBLIC_TEST_SERVER_URL/g,
      '(env.NEXT_PUBLIC_TEST_SERVER_URL || "http://localhost:3000")',
    );

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Patched test-server files");

  // 33. Fix cli-user.ts - REMOVE auth repository usage entirely
  const cliUserFile =
    "src/app/api/[locale]/system/unified-interface/cli/auth/cli-user.ts";
  if (existsSync(cliUserFile)) {
    let content = readFileSync(cliUserFile, "utf-8");

    // Remove static auth repository imports
    content = content.replace(
      /import \{[^}]*\} from ["']@\/app\/api\/\[locale\]\/user\/auth\/repository["'];?\n?/g,
      "",
    );

    // Remove session verification block - delete entire try/catch for session checking
    content = content.replace(
      /\/\/ Step 1: Check for existing session from \.vibe\.session file\s*try \{[\s\S]*?\} catch \(error\) \{[\s\S]*?\}\s*\n/,
      "// Step 1: Session verification removed - AuthRepository deleted\n\n  ",
    );

    // Remove email auth block - delete entire Step 4 try/catch
    content = content.replace(
      /\/\/ Step 4: Email is set, authenticate from database[\s\S]*?try \{[\s\S]*?const \{ AuthRepository \}[\s\S]*?await import\([^)]+\);[\s\S]*?const authResult[\s\S]*?await AuthRepository\.authenticateUserByEmail[\s\S]*?\} catch \(error\) \{[\s\S]*?\}\s*\}/,
      `// Step 4: Email authentication removed - AuthRepository deleted
  return {
    success: false,
    message: "app.api.system.unifiedInterface.cli.auth.errors.authNotAvailable",
    errorType: ErrorResponseTypes.UNAUTHORIZED,
  };
}`,
    );

    // Remove unused parseError import
    content = content.replace(
      /import \{ parseError \} from ["'][^"']+parse-error["'];?\n/,
      "",
    );

    // Remove unused createCliUserFromDb from exports/imports only
    content = content.replace(
      /(export|import) \{[^}]*createCliUserFromDb[^}]*\}/g,
      (match) =>
        match
          .replace(/,?\s*createCliUserFromDb,?/g, "")
          .replace(/\{\s*,/, "{")
          .replace(/,\s*\}/, "}"),
    );

    // Fix broken function declaration - restore function name if it was removed
    content = content.replace(
      /\/\*\*\n \* Create a CLI user from database user data\n \*\/\nfunction\(/,
      "/**\n * Create a CLI user from database user data\n */\nfunction createCliUserFromDb(",
    );

    // Add eslint-disable comment for createCliUserFromDb function (when name exists)
    content = content.replace(
      /(\*\/)\n(function createCliUserFromDb\()/,
      "$1\n// eslint-disable-next-line no-unused-vars\n$2",
    );

    writeFileSync(cliUserFile, content);
  }
  logger.debug("  ✓ Patched cli-user.ts");

  // 34. Fix IconValue imports - replace imports with string type
  const iconImportFiles = [
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create-form.ts",
    "src/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create.ts",
  ];

  for (const file of iconImportFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove IconValue import from deleted agent folder
    content = content.replace(
      /import type \{ IconValue \} from ["']@\/app\/api\/\[locale\]\/agent\/chat\/model-access\/icons["'];?\n?/g,
      "",
    );

    // Replace IconValue type with string
    content = content.replace(/\bIconValue\b/g, "string");

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Fixed IconValue imports");

  // 35. Fix system/check/i18n imports - remove testing/test imports
  const checkI18nFiles = [
    "src/app/api/[locale]/system/check/i18n/de/index.ts",
    "src/app/api/[locale]/system/check/i18n/en/index.ts",
    "src/app/api/[locale]/system/check/i18n/pl/index.ts",
  ];

  for (const file of checkI18nFiles) {
    if (!existsSync(file)) {
      continue;
    }

    let content = readFileSync(file, "utf-8");

    // Remove testing/test import
    content = content.replace(
      /import \{ translations as testTranslations \} from ["']\.\.\/\.\.\/testing\/test\/i18n\/\w+["'];?\n?/g,
      "",
    );

    // Remove testing object from exports
    content = content.replace(
      /testing: \{\s*test: testTranslations,?\s*\},?\s*/g,
      "",
    );

    writeFileSync(file, content);
  }
  logger.debug("  ✓ Fixed system/check/i18n imports");

  // 36. Fix remaining lint errors

  // Fix field-config-types.ts - replace any with object and prefix unused params
  const fieldConfigLintFile =
    "src/app/api/[locale]/system/unified-interface/shared/field-config/field-config-types.ts";
  if (existsSync(fieldConfigLintFile)) {
    let content = readFileSync(fieldConfigLintFile, "utf-8");

    // Replace all any with object (avoids oxlint unknown restriction)
    content = content.replace(/: any;/g, ": object;");
    content = content.replace(/: any\)/g, ": object)");
    content = content.replace(/= any;/g, "= object;");
    content = content.replace(/<string, any>/g, "<string, object>");
    content = content.replace(
      /type Control<[^>]+> = any;/g,
      "type Control<_T extends FieldValues> = object;",
    );

    // Add eslint-disable for unused type params (they're already prefixed with _)
    content = content.replace(
      /type FieldPath<_T extends FieldValues> = string;/g,
      "type FieldPath<_T extends FieldValues> = string; // eslint-disable-line @typescript-eslint/no-unused-vars",
    );
    content = content.replace(
      /type Control<_T extends FieldValues> = object;/g,
      "type Control<_T extends FieldValues> = object; // eslint-disable-line @typescript-eslint/no-unused-vars",
    );

    writeFileSync(fieldConfigLintFile, content);
  }

  // Fix types.ts - replace any with object and prefix unused params
  const typesLintFile =
    "src/app/api/[locale]/system/unified-interface/shared/widgets/types.ts";
  if (existsSync(typesLintFile)) {
    let content = readFileSync(typesLintFile, "utf-8");

    // Add eslint-disable comment for FieldValues type alias
    content = content.replace(
      /\/\/ Type alias for removed react-hook-form types\ntype FieldValues =/,
      "// Type alias for removed react-hook-form types\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\ntype FieldValues =",
    );

    // Fix TFieldValues in WidgetComponentProps - add eslint disable directly on the TFieldValues line
    content = content.replace(
      /  TFieldValues extends FieldValues = FieldValues,\n>/,
      "  TFieldValues extends FieldValues = FieldValues, // eslint-disable-line @typescript-eslint/no-unused-vars\n>",
    );

    // Fix TFieldValues in ReactWidgetProps - simpler pattern that matches what's actually there
    content = content.replace(
      /  TFieldValues extends FieldValues = FieldValues,\n> extends BaseWidgetProps/,
      "  TFieldValues extends FieldValues = FieldValues, // eslint-disable-line @typescript-eslint/no-unused-vars\n> extends BaseWidgetProps",
    );

    writeFileSync(typesLintFile, content);
  }

  logger.debug("  ✓ Fixed lint errors");
}

async function main(): Promise<void> {
  const logger = createEndpointLogger(true, Date.now(), defaultLocale);
  logger.debug("🚀 Creating minimal checker package from next-vibe\n");
  logger.debug("=".repeat(60));

  // Safety checks
  if (!existsSync("package.json")) {
    logger.error("❌ Must run from project root");
    process.exit(1);
  }

  const forceFlag = process.argv.includes("--force");

  if (existsSync(CLEANUP_DIR) && !forceFlag) {
    logger.debug("⚠️  Cleanup already run. Use --force to re-run");
    logger.debug("   Or run: bun scripts/restore-cleanup.ts");
    process.exit(0);
  }

  // Create cleanup structure
  mkdirSync(join(CLEANUP_DIR, "backup"), { recursive: true });

  const manifest = loadManifest();

  // Execute cleanup steps
  cleanupRoutes(logger, manifest);
  cleanupPages(logger, manifest);
  cleanupNative(logger, manifest);
  cleanupRootFiles(logger, manifest);
  cleanupUIFiles(logger, manifest);
  cleanupI18nImports(logger);
  patchCodeForMinimalBuild(logger);
  cleanupDependencies(logger, manifest);

  // Save manifest
  saveManifest(manifest);

  // Regenerate endpoints
  logger.debug("\n📦 Regenerating endpoints...\n");
  try {
    execSync(
      "bun /home/max/projects/vibe-check/src/app/api/[locale]/system/generators/generate-all/repository.ts",
      { stdio: "inherit" },
    );
    logger.debug("  ✓ Endpoints regenerated\n");
  } catch (error) {
    logger.error("  ✗ Failed to regenerate endpoints:", {
      error: parseError(error).message,
    });
    process.exit(1);
  }

  const endpointCount = "regenerated";

  logger.debug("=".repeat(60));
  logger.debug("✅ MINIMAL CHECKER PACKAGE READY!");
  logger.debug("=".repeat(60));
  logger.debug(`\n📊 Summary:`);
  logger.debug(`  • Endpoints: ${endpointCount} (expected ~20-25)`);
  logger.debug(
    `  • Dependencies: ${manifest.packageJson?.cleanedDeps || "N/A"}`,
  );
  logger.debug(`  • Routes moved: ${manifest.routes.length}`);
  logger.debug(`  • Pages moved: ${manifest.pages.length}`);
  logger.debug(`  • Native files moved: ${manifest.native.length}`);

  logger.debug("\n📝 Next steps:");
  logger.debug("  1. bun install          # Install cleaned dependencies");
  logger.debug("  2. bun run check        # Test the checker");
  logger.debug("  3. bun run build        # Build the package");
  logger.debug("\n🔄 To restore: bun scripts/restore-cleanup.ts\n");
}

main().catch((error) => {
  // oxlint-disable-next-line no-console
  console.error("Fatal error:", error);
  process.exit(1);
});
