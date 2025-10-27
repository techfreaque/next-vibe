import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import { DEFAULT_CONFIG_PATH } from "../utils/release-config.js";
import { ciRelease } from "./ci-release.js";
import { localRelease } from "./local-release.js";

/**
 * Runs the release process for packages defined in the config.
 * Delegates to either CI or local release based on the mode.
 */
export async function release(
  configPath: string = DEFAULT_CONFIG_PATH,
  ciMode = false,
  forceUpdate = false,
): Promise<void> {
  const logger = createEndpointLogger(true, Date.now(), "en-GLOBAL");

  if (ciMode) {
    await ciRelease(configPath, logger);
  } else {
    await localRelease(configPath, forceUpdate, logger);
  }
}
