import { describe, expect, it } from "bun:test";

import {
  readEdgeRequestTimingHeader,
  readEdgeTimingHeader,
  readProxyTimingHeader,
} from "../realtime/core/proxy-timing";
import { identifyBrowserAutomation } from "./client-context";
import {
  classifyResourceFailure,
  describeResourceResponse,
  resourceTiming,
} from "./resource-diagnostics";

describe("browser failure attribution", () => {
  it("keeps Meta crawlers and safety scanners distinct from ordinary browsers", () => {
    expect(identifyBrowserAutomation("Mozilla/5.0 meta-externalagent/1.1")).toBe(
      "meta-crawler",
    );
    expect(identifyBrowserAutomation("facebookexternalhit/1.1")).toBe(
      "meta-crawler",
    );
    expect(identifyBrowserAutomation("Google-Safety")).toBe(
      "google-safety-scanner",
    );
    expect(
      identifyBrowserAutomation("Mozilla/5.0 Chrome/143.0 Safari/537.36"),
    ).toBeNull();
  });

  it("preserves HTTP failure evidence even when the response delivered a body", () => {
    expect(classifyResourceFailure(429, 100)).toBe("http-rate-limited");
    expect(classifyResourceFailure(504, 100)).toBe("http-server-error");
    expect(classifyResourceFailure(404, 100)).toBe("http-client-error");
    expect(classifyResourceFailure(200, 100)).toBe("body-received");
  });

  it("distinguishes an opaque timing entry from unavailable timing", () => {
    expect(classifyResourceFailure(0, 0)).toBe("opaque-or-no-response");
    expect(classifyResourceFailure(null, 0)).toBe("status-unavailable");
    expect(resourceTiming(null).resourceFailureKind).toBe("no-resource-timing");
    expect(resourceTiming(null).resourceTimingPhase).toBe("unavailable");
  });

  it("separates waiting for headers from reading a response body", () => {
    expect(
      describeResourceResponse({
        requestStart: 100,
        responseStart: 140,
        responseEnd: 77_351,
        decodedBodySize: 0,
      }),
    ).toEqual({ decodedBodySize: 0, responseWaitMs: 40, responseReadMs: 77_211 });
  });

  it("leaves masked phases unavailable", () => {
    expect(
      describeResourceResponse({
        requestStart: 0,
        responseStart: 0,
        responseEnd: 300,
        decodedBodySize: 0,
      }),
    ).toEqual({ decodedBodySize: 0, responseWaitMs: null, responseReadMs: null });
  });

  it("reads independent edge and app markers from one response", () => {
    const edgeRequestId = "eb3a8c4c-de39-4d30-baad-fa32f10d555e";
    const header = `vibe-edge;desc="s2", vibe-edge-request;desc="${edgeRequestId}", vibe-proxy;desc="upstream-timeout"`;
    expect(readEdgeTimingHeader(header)).toBe("s2");
    expect(readEdgeRequestTimingHeader(header)).toBe(edgeRequestId);
    expect(readEdgeRequestTimingHeader('vibe-edge-request;desc="unexpected"')).toBeNull();
    expect(readProxyTimingHeader(header)).toBe("upstream-timeout");
    expect(readEdgeTimingHeader('vibe-edge;desc="unknown"')).toBeNull();
    expect(readEdgeTimingHeader(null)).toBeNull();
  });
});
