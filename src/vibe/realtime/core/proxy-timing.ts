export const PROXY_TIMING_METRIC = "vibe-proxy";
export const EDGE_TIMING_METRIC = "vibe-edge";
export const EDGE_REQUEST_TIMING_METRIC = "vibe-edge-request";
const LEAD_TIMING_METRIC = "vibe-lead";

type LeadFailurePhase = "lookup" | "crawler-policy" | "geo" | "provision";

export function leadFailureTimingHeader(phase: LeadFailurePhase): string {
  return `${LEAD_TIMING_METRIC};desc="${phase}"`;
}

export function readLeadFailureTimingHeader(
  header: string | null,
): LeadFailurePhase | null {
  const phase = readTimingDescription(header, LEAD_TIMING_METRIC);
  return phase === "lookup" ||
    phase === "crawler-policy" ||
    phase === "geo" ||
    phase === "provision"
    ? phase
    : null;
}

export type ProxyTimingStage =
  | "database-unavailable"
  | "upstream-response"
  | "upstream-timeout"
  | "upstream-unavailable";

export function proxyTimingHeader(stage: ProxyTimingStage): string {
  return `${PROXY_TIMING_METRIC};desc="${stage}"`;
}

export function readProxyTimingStage(
  value: string | undefined,
): ProxyTimingStage | null {
  return value === "database-unavailable" ||
    value === "upstream-response" ||
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
