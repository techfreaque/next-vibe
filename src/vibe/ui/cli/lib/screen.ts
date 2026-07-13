import type { EndpointLogger } from "next-vibe/logger/types";

export function getScreenWidth(_logger: EndpointLogger): number {
  void _logger;
  return process.stdout.columns ?? 80;
}

export function getScreenHeight(_logger: EndpointLogger): number {
  void _logger;
  return process.stdout.rows ?? 24;
}
