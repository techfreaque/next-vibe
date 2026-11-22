export const PROXY_TIMING_METRIC = "vibe-proxy";
export const EDGE_TIMING_METRIC = "vibe-edge";
export const EDGE_REQUEST_TIMING_METRIC = "vibe-edge-request";

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
  return readProxyTimingStage(
    readTimingDescription(header, PROXY_TIMING_METRIC),
  );
}

export function readEdgeTimingNode(
  value: string | undefined,
): "s1" | "s2" | null {
  return value === "s1" || value === "s2" ? value : null;
}

export function readEdgeTimingHeader(
  header: string | null,
): "s1" | "s2" | null {
  return readEdgeTimingNode(readTimingDescription(header, EDGE_TIMING_METRIC));
}

export function readEdgeRequestId(value: string | undefined): string | null {
  return value && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(value)
    ? value
    : null;
}

export function readEdgeRequestTimingHeader(
  header: string | null,
): string | null {
  return readEdgeRequestId(
    readTimingDescription(header, EDGE_REQUEST_TIMING_METRIC),
  );
}

function readTimingDescription(
  header: string | null,
  name: string,
): string | undefined {
  const metric = header
    ?.split(",")
    .find((part) => part.trimStart().startsWith(`${name};desc="`));
  return metric?.split('"')[1];
}
