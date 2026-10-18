/**
 * Emulate Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import emulateEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

type EmulateData = (typeof emulateEndpoints.POST)["types"]["RequestOutput"];

/**
 * chrome-devtools-mcp's emulate takes flat strings, not objects: viewport is
 * `<w>x<h>x<dpr>[,mobile][,touch][,landscape]`, geolocation `<lat>,<lon>`,
 * an empty userAgent clears the override and omitting a field leaves it
 * untouched / clears it. Convert from the structured definition shape.
 */
function toMcpEmulateArgs(
  data: EmulateData,
): Record<string, string | number | undefined> {
  const { viewport, geolocation } = data;
  const viewportFlags = viewport
    ? [
        viewport.isMobile ? "mobile" : null,
        viewport.hasTouch ? "touch" : null,
        viewport.isLandscape ? "landscape" : null,
      ].filter((flag): flag is string => flag !== null)
    : [];
  return {
    networkConditions:
      data.networkConditions === "No emulation"
        ? undefined
        : data.networkConditions,
    cpuThrottlingRate: data.cpuThrottlingRate,
    geolocation: geolocation
      ? `${geolocation.latitude},${geolocation.longitude}`
      : undefined,
    userAgent: data.userAgent === null ? "" : data.userAgent,
    colorScheme: data.colorScheme,
    viewport: viewport
      ? [
          `${viewport.width}x${viewport.height}x${viewport.deviceScaleFactor ?? 1}`,
          ...viewportFlags,
        ].join(",")
      : undefined,
  };
}

export const { POST, tools } = endpointsHandler({
  endpoint: emulateEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executeEmulate(
        {
          toolName: BrowserTool.EMULATE,
          args: BrowserSharedRepository.filterUndefinedArgs(
            toMcpEmulateArgs(data),
          ),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        toolExecutionContext.threadId,
      ),
  },
});
