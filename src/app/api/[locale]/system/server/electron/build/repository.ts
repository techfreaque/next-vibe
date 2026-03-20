/**
 * Electron Build Repository
 *
 * 1. Optionally runs vibe build (Next.js + migrations)
 * 2. Compiles main.ts + preload.ts with `bun build --target=node --external=electron`
 * 3. Stages compiled files into dist/electron-stage/ with a clean package.json
 *    (no dependencies) to avoid electron-builder's bun workspace traversal bug,
 *    which walks up to the project root and chokes on dev-only packages.
 * 4. Runs electron-builder from the stage dir to produce the final binary.
 */


import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  ElectronBuildRequestOutput,
  ElectronBuildResponseOutput,
} from "./definition";
import type { ElectronBuildT } from "./i18n";

export class ElectronBuildRepository {
  private static readonly ELECTRON_DIR =
    "src/app/api/[locale]/system/unified-interface/electron";
  private static readonly STAGE_DIR = "dist/electron-stage";
  private static readonly PLATFORM_FLAG: Record<string, string> = {
    current: "",
    linux: "--linux",
    mac: "--mac",
    win: "--win",
    all: "--linux --mac --win",
  };
  static async electronBuildRepository(
    data: ElectronBuildRequestOutput,
    logger: EndpointLogger,
    t: ElectronBuildT,
  ): Promise<ResponseType<ElectronBuildResponseOutput>> {
    const startTime = Date.now();
    const output: string[] = [];

    try {
      output.push("⚡ Electron Build");
      output.push("━".repeat(72));

      // Step 1: vibe build (optional)
      if (data.viBuild) {
        output.push("");
        output.push("1️⃣  Running vibe build...");
        try {
          execSync("bun run vibe build", {
            encoding: "utf-8",
            cwd: process.cwd(),
            env: { ...process.env },
            stdio: ["ignore", "pipe", "pipe"],
          });
          output.push("   ✅ vibe build completed");
        } catch (err) {
          const msg = parseError(err).message;
          output.push(`   ❌ vibe build failed: ${msg}`);
          logger.error("vibe build failed", { error: msg });
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { error: msg },
          });
        }
      } else {
        output.push("");
        output.push("1️⃣  vibe build skipped (--vi-build=false)");
      }

      // Step 2: compile main.ts + preload.ts
      output.push("");
      output.push("2️⃣  Compiling Electron main + preload...");
      try {
        execSync(
          [
            `bun build ${ElectronBuildRepository.ELECTRON_DIR}/main.ts --outdir=dist/electron --target=node --external=electron`,
            `bun build ${ElectronBuildRepository.ELECTRON_DIR}/preload.ts --outdir=dist/electron --target=node --external=electron`,
          ].join(" && "),
          { encoding: "utf-8", cwd: process.cwd(), env: { ...process.env } },
        );
        output.push("   ✅ main.js + preload.js compiled to dist/electron/");
      } catch (err) {
        const msg = parseError(err).message;
        output.push(`   ❌ Compilation failed: ${msg}`);
        logger.error("Electron compilation failed", { error: msg });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: msg },
        });
      }

      // Step 3: prepare staging directory
      // electron-builder with bun workspaces walks up from the app dir to find
      // the workspace root, then traverses all node_modules — including dev deps
      // that are hoisted but not in their expected locations. By staging into a
      // clean dir with an empty dependencies object, we bypass that entirely.
      output.push("");
      output.push("3️⃣  Preparing staging directory...");
      const stageDir = path.join(process.cwd(), ElectronBuildRepository.STAGE_DIR);
      const stageElectronDir = path.join(stageDir, "dist", "electron");
      mkdirSync(stageElectronDir, { recursive: true });

      // Copy compiled Electron files and icon into stage
      const stageAssetsDir = path.join(stageDir, "assets");
      mkdirSync(stageAssetsDir, { recursive: true });
      execSync(
        `cp dist/electron/main.js dist/electron/preload.js ${stageElectronDir}/`,
        {
          cwd: process.cwd(),
        },
      );
      execSync(`cp ${ElectronBuildRepository.ELECTRON_DIR}/assets/icon.png ${stageAssetsDir}/`, {
        cwd: process.cwd(),
      });

      // Minimal package.json — no dependencies so electron-builder skips traversal.
      // type:module required because bun compiles main.ts as ESM.
      const pkg = {
        name: "unbottled",
        version: "1.0.0",
        description: "Unbottled AI desktop app",
        author: "Max Brandstätter",
        main: "dist/electron/main.js",
        type: "module",
        dependencies: {},
      };
      writeFileSync(
        path.join(stageDir, "package.json"),
        JSON.stringify(pkg, null, 2),
      );

      // Write electron-builder config into stage with absolute icon path so it
      // resolves correctly when electron-builder runs with --projectDir.
      const electronVersion = JSON.parse(
        readFileSync("node_modules/electron/package.json", "utf-8"),
      ).version as string;
      const platformFlags = ElectronBuildRepository.PLATFORM_FLAG[data.platform] ?? "";
      const builderConfig = {
        appId: "ai.unbottled.app",
        productName: "Unbottled",
        copyright: "Copyright © 2024 Max Brandstätter",
        electronVersion,
        directories: { output: path.resolve("dist/electron-release") },
        asar: true,
        npmRebuild: false,
        files: [
          "dist/electron/main.js",
          "dist/electron/preload.js",
          "assets/icon.png",
          "package.json",
        ],
        linux: {
          target: [{ target: "AppImage", arch: ["x64"] }],
          category: "Office",
          icon: "assets/icon.png",
        },
        mac: {
          category: "public.app-category.productivity",
          target: [{ target: "dmg", arch: ["x64", "arm64"] }],
          hardenedRuntime: true,
          gatekeeperAssess: false,
        },
        win: { target: [{ target: "nsis" }] },
        nsis: { oneClick: false, allowToChangeInstallationDirectory: true },
      };
      const configPath = path.join(stageDir, "electron-builder.json");
      writeFileSync(configPath, JSON.stringify(builderConfig, null, 2));
      output.push(`   ✅ Staged to ${ElectronBuildRepository.STAGE_DIR}/`);

      // Step 4: electron-builder
      output.push("");
      output.push(
        `4️⃣  Packaging with electron-builder (platform: ${data.platform})...`,
      );
      const builderCmd = [
        "bunx electron-builder",
        `--config ${configPath}`,
        `--projectDir ${stageDir}`,
        platformFlags,
      ]
        .filter(Boolean)
        .join(" ");

      try {
        execSync(builderCmd, {
          encoding: "utf-8",
          cwd: process.cwd(),
          env: { ...process.env },
        });
        output.push("   ✅ Electron app packaged → dist/electron-release/");
      } catch (err) {
        const msg = parseError(err).message;
        output.push(`   ❌ electron-builder failed: ${msg}`);
        logger.error("electron-builder failed", { error: msg });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: msg },
        });
      }

      const duration = Date.now() - startTime;
      output.push("");
      output.push("━".repeat(72));
      output.push(`🎉 Electron app built in ${(duration / 1000).toFixed(1)}s`);

      return success({
        success: true,
        output: output.join("\n"),
        duration,
      });
    } catch (err) {
      const msg = parseError(err).message;
      logger.error("Electron build failed unexpectedly", { error: msg });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }
  }
}
