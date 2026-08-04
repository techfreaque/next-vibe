/**
 * TanStack Start dev server — the tanstack half of the framework seam.
 *
 * Starts the Nitro SSR dev server in-process via viteCompiler
 * (@tanstack/react-start plugin + nitro on Vite). Everything
 * tanstack-specific about `vibe dev` lives here; the orchestrator
 * (../../dev/repository.ts) only decides ports and proxy ordering.
 * A fork that wants only TanStack ships this directory and drops
 * ../next-app (web/frameworks/next-app) with no change to the orchestration contract.
 */

import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { GENERATED_DIR } from "@/env/paths";

import type { EndpointLogger } from "../../../../logger/types";

export interface TanstackDevHandle {
  /** Close the current Vite server (tracks restarts via the internal ref). */
  close: () => Promise<void>;
}

/**
 * Start the TanStack/Vite dev server on `internalPort`.
 *
 * `hmrPublicPort` is the public (proxy) port the browser's HMR client should
 * dial; pass undefined in direct mode (VIBE_DISABLE_PROXY) so Vite serves HMR
 * on its own port. Exits the process on unrecoverable startup failure, same
 * as the previous inline implementation.
 */
export async function startTanstackDev({
  internalPort,
  hmrPublicPort,
  logger,
}: {
  internalPort: number;
  hmrPublicPort: number | undefined;
  logger: EndpointLogger;
}): Promise<TanstackDevHandle> {
  const { viteCompiler } =
    await import("../../../../tooling/builder/repository/vite-compiler");
  const { ViteBuildTypeEnum } =
    await import("../../../../tooling/builder/enum");
  const { configLoader } =
    await import("../../../../tooling/builder/repository/config-loader");
  const { scopedTranslation: builderScopedTranslation } =
    await import("../../../../tooling/builder/i18n");
  const { defaultLocale } = await import("../../../../core/i18n/core/config");
  const { t: builderT } = builderScopedTranslation.scopedT(defaultLocale);
  const configResult = await configLoader.load(
    "build.config.ts",
    undefined,
    [],
    logger,
    builderT,
  );
  if (!configResult.success) {
    logger.error("Failed to load build.config.ts for TanStack Start");
    process.exit(1);
  }
  const tanstackEntry = configResult.data.filesToCompile?.find(
    (f) => f.type === ViteBuildTypeEnum.TANSTACK_START,
  );
  if (!tanstackEntry) {
    logger.error("No tanstack-start entry found in build.config.ts");
    process.exit(1);
  }
  // Ensure the routes directory exists before the TanStack router-generator
  // plugin scans it - it will throw ENOENT if the folder is missing.
  const routesDir = join(process.cwd(), `${GENERATED_DIR}/app-tanstack/routes`);
  if (!existsSync(routesDir)) {
    mkdirSync(routesDir, { recursive: true });
  }

  // Mutable ref so the restart plugin can update the close fn after each
  // restart. The caller's shutdown handler always closes the CURRENT server.
  const viteCloseRef: { fn: (() => Promise<void>) | undefined } = {
    fn: undefined,
  };
  const devResult = await viteCompiler.startTanstackDevServer(
    tanstackEntry,
    internalPort,
    hmrPublicPort,
    viteCloseRef,
  );
  if (!devResult.success) {
    logger.error(devResult.message ?? "TanStack Start dev server failed");
    process.exit(1);
  }

  return {
    close: (): Promise<void> => viteCloseRef.fn?.() ?? Promise.resolve(),
  };
}
