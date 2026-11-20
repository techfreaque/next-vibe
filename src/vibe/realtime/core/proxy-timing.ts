export const PROXY_TIMING_METRIC = "vibe-proxy";

export type ProxyTimingStage =
  | "upstream-response"
  | "upstream-timeout"
  | "upstream-unavailable";

export function proxyTimingHeader(stage: ProxyTimingStage): string {
  return `${PROXY_TIMING_METRIC};desc="${stage}"`;
}

export function readProxyTimingStage(
  value: string | undefined,
): ProxyTimingStage | null {
  return value === "upstream-response" ||
    value === "upstream-timeout" ||
    value === "upstream-unavailable"
    ? value
    : null;
}

export function readProxyTimingHeader(
  header: string | null,
): ProxyTimingStage | null {
  const metric = header
    ?.split(",")
    .find((part) =>
      part.trimStart().startsWith(`${PROXY_TIMING_METRIC};desc="`),
    );
  return readProxyTimingStage(metric?.split('"')[1]);
}
