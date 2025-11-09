/**
 * Generate Expo Indexes Repository
 * Business logic for generating Expo Router index files from Next.js pages
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { findFilesByName } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/filesystem/scanner";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type {
  GenerateRequestOutput,
  GenerateResponseOutput,
} from "./definition";

interface GenerationResult {
  created: string[];
  skipped: string[];
  errors: Array<{ file: string; error: string }>;
}

/**
 * Generate Expo Indexes Repository Interface
 */
export interface GenerateExpoIndexesRepository {
  generate(
    data: GenerateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<GenerateResponseOutput>>;
}

/**
 * Generate Expo Indexes Repository Implementation
 */
class GenerateExpoIndexesRepositoryImpl
  implements GenerateExpoIndexesRepository {
  private readonly PROJECT_ROOT: string;
  private readonly SOURCE_DIR: string;
  private readonly TARGET_DIR: string;

  constructor() {
    // Calculate paths relative to project root
    this.PROJECT_ROOT = process.cwd();
    this.SOURCE_DIR = join(this.PROJECT_ROOT, "src/app/[locale]");
    this.TARGET_DIR = join(this.PROJECT_ROOT, "src/app-native/[locale]");
  }

  async generate(
    data: GenerateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<GenerateResponseOutput>> {
    const { t } = simpleT(locale);

    // Use data parameter to avoid unused variable warning
    void data;

    // Validate user permissions
    if (!user?.id) {
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.unauthorized.title",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: {
          error: t(
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.unauthorized.description",
          ),
        },
      });
    }

    try {
      // Check if source directory exists
      if (!existsSync(this.SOURCE_DIR)) {
        return fail({
          message:
            "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t(
              "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.notFound.description",
            ),
          },
        });
      }

      // Ensure target directory exists
      this.ensureDir(this.TARGET_DIR);

      // Generate indexes
      const result = this.generateIndexes();

      // Prepare success message
      const message = t(
        "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.success.description",
        {
          created: result.created.length,
          skipped: result.skipped.length,
          errors: result.errors.length,
        },
      );

      return success({
        success: result.errors.length === 0,
        created: result.created,
        skipped: result.skipped,
        errors: result.errors,
        message,
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.reactNative.generate.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Check if a file has the "use custom" directive at the top
   * The directive must be on its own line, not part of other text
   */
  private hasCustomIndexDirective(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }

    try {
      const content = readFileSync(filePath, "utf-8");
      // Check first 10 lines for the directive as a standalone marker
      const lines = content.split("\n").slice(0, 10);
      return lines.some((line) => {
        const trimmed = line.trim();
        // Match "use custom" as a standalone directive (with or without comment markers)
        return (
          trimmed === '"use custom"' ||
          trimmed === "'use custom'"
        );
      });
    } catch {
      return false;
    }
  }

  /**
   * Generate the content for a page index.tsx file
   */
  private generatePageIndex(
    relativePath: string,
    componentType: "page" | "layout",
  ): string {
    // Use absolute @/ import path
    const importPath = `@/app/[locale]${relativePath ? `/${relativePath}` : ""}/${componentType}`;

    // For pages, use dynamic import wrapper to catch server-only errors
    if (componentType === "page") {
      return `/**
 * Expo Router compatibility wrapper for Next.js ${componentType}.tsx
 *
 * This file is auto-generated by the generate-expo-indexes endpoint
 * Do not edit manually unless you add a "use custom" directive at the top.
 *
 * This wrapper handles:
 * - Dynamic import with server-only error handling
 * - Async component loading (Next.js ${componentType}s can be async Server Components)
 * - URL params conversion (Next.js uses async params, Expo Router uses hooks)
 * - Loading states with ActivityIndicator
 * - Error handling with graceful fallbacks
 * - Type-safe params forwarding
 */

import { createPageWrapperWithImport } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/nextjs-compat-wrapper";

/**
 * Wrapper component that dynamically imports and converts Expo Router's synchronous params
 * to Next.js 15's async params format
 */
export default createPageWrapperWithImport(() => import("${importPath}"));
`;
    }

    // For layouts, also use dynamic import to handle async layouts
    return `/**
 * Expo Router compatibility wrapper for Next.js ${componentType}.tsx
 *
 * This file is auto-generated by the generate-expo-indexes endpoint
 * Do not edit manually unless you add a "use custom" directive at the top.
 *
 * This wrapper handles:
 * - Dynamic import with server-only error handling
 * - Async component loading (Next.js ${componentType}s can be async Server Components)
 * - URL params conversion (Next.js uses async params, Expo Router uses hooks)
 * - Only renders Slot (layouts must only contain Screen children)
 * - Error handling with graceful fallbacks
 * - Type-safe params forwarding
 */

import { createLayoutWrapperWithImport } from "@/app/api/[locale]/v1/core/system/unified-interface/react-native/nextjs-compat-wrapper";

/**
 * Wrapper component that dynamically imports and converts Expo Router's synchronous params
 * to Next.js 15's async params format
 */
export default createLayoutWrapperWithImport(() => import("${importPath}"));
`;
  }

  /**
   * Ensure directory exists, creating it if necessary
   */
  private ensureDir(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Recursively find all files matching a pattern
   */
  private findFiles(dir: string, pattern: string, basePath = ""): string[] {
    // Use consolidated directory scanner
    const results = findFilesByName(dir, pattern);

    // Convert to relative paths from basePath and exclude i18n directories
    return results
      .map((r) => {
        const rel = relative(dir, r.fullPath);
        return basePath ? join(basePath, rel) : rel;
      })
      .filter((path) => {
        // Exclude i18n translation files - they're not routes
        return !path.includes("/i18n/");
      });
  }

  /**
   * Generate index files for all pages and layouts
   */
  private generateIndexes(): GenerationResult {
    const result: GenerationResult = {
      created: [],
      skipped: [],
      errors: [],
    };

    // Find all page.tsx and layout.tsx files
    const pageFiles = this.findFiles(this.SOURCE_DIR, "page.tsx");
    const layoutFiles = this.findFiles(this.SOURCE_DIR, "layout.tsx");

    // Process pages
    for (const pageFile of pageFiles) {
      const relativePath = dirname(pageFile);
      const targetPath = join(this.TARGET_DIR, relativePath, "index.tsx");

      try {
        // Check for custom-index directive
        if (this.hasCustomIndexDirective(targetPath)) {
          result.skipped.push(relativePath);
          continue;
        }

        // Ensure directory exists
        this.ensureDir(dirname(targetPath));

        // Generate content
        const content = this.generatePageIndex(
          relativePath === "." ? "" : relativePath,
          "page",
        );

        // Write file
        writeFileSync(targetPath, content, "utf-8");

        result.created.push(relativePath);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        result.errors.push({ file: relativePath, error: errorMessage });
      }
    }

    // Process layouts - always generate _layout.tsx
    for (const layoutFile of layoutFiles) {
      const relativePath = dirname(layoutFile);
      const layoutTargetPath = join(
        this.TARGET_DIR,
        relativePath,
        "_layout.tsx",
      );

      try {
        // Check for custom directive in _layout.tsx file
        if (this.hasCustomIndexDirective(layoutTargetPath)) {
          result.skipped.push(relativePath);
          continue;
        }

        // Ensure directory exists
        this.ensureDir(dirname(layoutTargetPath));

        // Generate content for layout
        const content = this.generatePageIndex(
          relativePath === "." ? "" : relativePath,
          "layout",
        );

        // Write _layout.tsx file
        writeFileSync(layoutTargetPath, content, "utf-8");

        result.created.push(relativePath);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        result.errors.push({ file: relativePath, error: errorMessage });
      }
    }

    return result;
  }
}

/**
 * Default repository instance
 */
export const generateExpoIndexesRepository =
  new GenerateExpoIndexesRepositoryImpl();
