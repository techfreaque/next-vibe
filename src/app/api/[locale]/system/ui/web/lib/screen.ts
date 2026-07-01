import type { EndpointLogger } from "next-vibe/logger/types";

export function getScreenWidth(logger: EndpointLogger): number {
  if (typeof window !== "undefined" && window.screen) {
    return window.innerWidth;
  }
  logger.warn("getScreenWidth should not be called outside the browser");
  return 1000;
}

export function getScreenHeight(logger: EndpointLogger): number {
  if (typeof window !== "undefined" && window.screen) {
    return window.innerHeight;
  }
  logger.warn("getScreenHeight should not be called outside the browser");
  return 1000;
}
