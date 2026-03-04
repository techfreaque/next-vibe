/**
 * Electron Start Repository
 *
 * 1. Compiles main.ts + preload.ts with `bun build --target=node`
 * 2. Launches `electron dist/electron/main.js` (detached)
 *
 * The electron process is detached — this call returns once Electron opens.
 * Electron main.ts handles spawning vibe start internally.
 */

/* eslint-disable i18next/no-literal-string */

import { execSync, spawn } from "node:child_process";
import path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  ElectronStartRequestOutput,
  ElectronStartResponseOutput,
} from "./definition";
import type { ElectronStartT } from "./i18n";

const ELECTRON_DIR = "src/app/api/[locale]/system/unified-interface/electron";

export async function electronStartRepository(
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
          `bun build ${ELECTRON_DIR}/main.ts --outdir=dist/electron --target=node --external=electron`,
          `bun build ${ELECTRON_DIR}/preload.ts --outdir=dist/electron --target=node --external=electron`,
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
      errors.push(`Compilation failed: ${msg}`);
      output.push(`   ❌ Compilation failed: ${msg}`);
      logger.error("Electron compilation failed", { error: msg });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }

    // Step 2: launch electron (detached — keeps running after this call returns)
    output.push("");
    output.push("2️⃣  Launching Electron window...");

    const mainJs = path.resolve("dist/electron/main.js");
    const electronEnv: NodeJS.ProcessEnv = {
      ...process.env,
      ELECTRON_SPAWN_VIBE_START: data.vibeStart ? "true" : "false",
    };

    const electronProcess = spawn("bunx", ["electron", mainJs], {
      detached: true,
      stdio: "ignore",
      env: electronEnv,
      cwd: process.cwd(),
    });
    electronProcess.unref();

    output.push(`   ✅ Electron launched (pid ${electronProcess.pid})`);
    output.push(`   🌐 Will open at the URL configured in NEXT_PUBLIC_APP_URL`);

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
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: msg },
    });
  }
}
