import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";

export function getScreenWidth(_logger: EndpointLogger): number {
  void _logger;
  return 0; // use useWindowDimensions() hook instead
}

export function getScreenHeight(_logger: EndpointLogger): number {
  void _logger;
  return 0; // use useWindowDimensions() hook instead
}
