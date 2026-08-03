/**
 * Electron Start Repository
 *
 * 1. Compiles main.ts + preload.ts with `bun build --target=node`
 * 2. Launches `electron dist/electron/main.js` (detached)
 *
 * The electron process is detached - this call returns once Electron opens.
 * Electron main.ts handles spawning vibe start internally.
 */

import { execSync, spawn } from "node:child_process";
import path from "node:path";

import { buildPackageRunnerCommand, coreEnv } from "../../../core/env";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import type { ElectronStartT } from "./i18n";

import type {
  ElectronStartRequestOutput,
  ElectronStartResponseOutput,
} from "./definition";

export class ElectronStartRepository {
  private static readonly ELECTRON_DIR = "src/vibe/platforms/electron";
  static async electronStartRepository(
    data: ElectronStartRequestOutput,
    logger: EndpointLogger,
    t: ElectronStartT,
  ): Promise<ResponseType<ElectronStartResponseOutput>> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push("⚡ Electron Start (dev)");
      output.push("━".repeat(72));

      // Step 1: compile main.ts + preload.ts
      output.push("");
      output.push("1️⃣  Compiling Electron main + preload...");
      try {
        execSync(
          [
            `bun build ${ElectronStartRepository.ELECTRON_DIR}/main.ts --outdir=dist/electron --target=node --external=electron`,
            `bun build ${ElectronStartRepository.ELECTRON_DIR}/preload.ts --outdir=dist/electron --target=node --external=electron`,
          ].join(" && "),
          {
            encoding: "utf-8",
            cwd: process.cwd(),
            env: { ...process.env },
          },
        );
        output.push("   ✅ main.js + preload.js compiled to dist/electron/");
      } catch (err) {
        const msg = parseError(err).message;
        // `post.errors.server.title` is the definition's declared SERVER_ERROR
        // label and renders param-free there, so the cause gets its own key.
        const failure = t("post.errors.server.compileFailed", { error: msg });
        errors.push(failure);
        output.push(`   ❌ ${failure}`);
        logger.error("Electron compilation failed", { error: msg });
        return fail({
          message: failure,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Step 2: launch electron (detached - keeps running after this call returns)
      output.push("");
      output.push("2️⃣  Launching Electron window...");

      const mainJs = path.resolve("dist/electron/main.js");
      const electronEnv: NodeJS.ProcessEnv = {
        ...process.env,
        ELECTRON_SPAWN_VIBE_START: data.vibeStart ? "true" : "false",
      };

      const runner = buildPackageRunnerCommand(
        coreEnv.PACKAGE_MANAGER,
        "electron",
        [mainJs],
      );
      const electronProcess = spawn(runner.command, runner.args, {
        detached: true,
        stdio: "ignore",
        env: electronEnv,
        cwd: process.cwd(),
        shell: runner.shell,
      });
      electronProcess.unref();

      output.push(`   ✅ Electron launched (pid ${electronProcess.pid})`);
      output.push(
        `   🌐 Will open at the URL configured in NEXT_PUBLIC_APP_URL`,
      );

      const duration = Date.now() - startTime;
      output.push("");
      output.push("━".repeat(72));
      output.push(
        `🎉 Electron window opened in ${(duration / 1000).toFixed(1)}s`,
      );
      output.push("💡 Close the window to quit. Ctrl+C here is safe.");

      return success({
        success: true,
        output: output.join("\n"),
        duration,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (err) {
      const msg = parseError(err).message;
      logger.error("Electron start failed unexpectedly", { error: msg });
      return fail({
        message: t("post.errors.server.startFailed", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
