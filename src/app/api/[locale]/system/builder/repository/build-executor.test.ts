/**
 * Build Executor Tests
 * Tests for the build system orchestrator
 *
 * @vitest-environment node
 */

import { resolve } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the i18n module before importing build-executor
vi.mock("@/i18n/core/shared", () => ({
  simpleT: (): { t: (key: string) => string } => ({
    t: (key: string): string => key,
  }),
}));

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import {
  BuildProfileEnum,
  ViteBuildTypeEnum,
} from "../definition";
import { buildExecutor } from "./build-executor";

const TEST_PROJECT_PATH = resolve(
  __dirname,
  "../test-files/test-project",
);

// Create a properly typed mock logger that satisfies EndpointLogger interface
const createMockLogger = (): EndpointLogger => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  vibe: vi.fn(),
  isDebugEnabled: false,
});

describe("BuildExecutor", () => {
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    mockLogger = createMockLogger();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("execute", () => {
    it("should execute a dry run build successfully", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true,
            verbose: false,
            profile: BuildProfileEnum.DEVELOPMENT,
            foldersToClean: ["dist"],
            filesToCompile: [
              {
                input: `${TEST_PROJECT_PATH}/src/index.ts`,
                output: `${TEST_PROJECT_PATH}/dist/index.js`,
                type: ViteBuildTypeEnum.VANILLA,
              },
            ],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.success).toBe(true);
        expect(result.data.output).toContain("dryRunMode");
      }
    });

    it("should handle missing input file gracefully", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: false,
            verbose: false,
            profile: BuildProfileEnum.DEVELOPMENT,
            filesToCompile: [
              {
                input: `${TEST_PROJECT_PATH}/src/nonexistent.ts`,
                output: `${TEST_PROJECT_PATH}/dist/nonexistent.js`,
                type: ViteBuildTypeEnum.VANILLA,
              },
            ],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      expect(result.success).toBe(false);
    });

    it("should apply production profile settings", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true,
            verbose: true,
            profile: BuildProfileEnum.PRODUCTION,
            foldersToClean: ["dist"],
            filesToCompile: [],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.output).toContain("PRODUCTION");
      }
    });

    it("should report step timings", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true,
            profile: BuildProfileEnum.DEVELOPMENT,
            foldersToClean: ["dist"],
            filesToCompile: [],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.stepTimings).toBeDefined();
        expect(Array.isArray(result.data.stepTimings)).toBe(true);
      }
    });
  });

  describe("configuration validation", () => {
    it("should handle empty configuration", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true,
            filesToCompile: [],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      // Empty config fails validation (nothing to build)
      expect(result.success).toBe(false);
    });

    it("should handle invalid file paths in copy config (dry run)", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true, // Dry run doesn't actually check file existence
            filesToCompile: [],
            filesOrFoldersToCopy: [
              {
                input: "/nonexistent/path/file.txt",
                output: `${TEST_PROJECT_PATH}/dist/file.txt`,
              },
            ],
          },
        },
        "en-US",
        mockLogger,
      );

      // Dry run succeeds even with invalid paths
      expect(result.success).toBe(true);
    });
  });

  describe("caching", () => {
    it("should respect cache option", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true,
            cache: true,
            foldersToClean: ["dist"],
            filesToCompile: [],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      expect(result.success).toBe(true);
    });

    it("should work with cache disabled", async () => {
      const result = await buildExecutor.execute(
        {
          configPath: "",
          configObject: {
            dryRun: true,
            cache: false,
            foldersToClean: ["dist"],
            filesToCompile: [],
            filesOrFoldersToCopy: [],
          },
        },
        "en-US",
        mockLogger,
      );

      expect(result.success).toBe(true);
    });
  });
});
