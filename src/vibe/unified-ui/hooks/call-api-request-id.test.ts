/**
 * Request-id propagation: callApi mints one id per call, sends it as
 * x-request-id, and stamps it on its own failure report; the Next handler
 * adopts a well-formed client id (else mints one); the server logger stamps it
 * on every persisted row without splitting the error_logs fingerprint.
 */

import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";

import ledgerDefinition from "@/chart-of-accounts/ledger/[accountId]/definition";
import { REQUEST_ID_HEADER_NAME } from "@/env/constants";

import type { EndpointLogger, LoggerMetadata } from "../../logger/types";

interface LogRow {
  level: "error" | "warn" | "info" | "debug" | "vibe";
  message: string;
  metadata: LoggerMetadata[];
}

function recordingLogger(rows: LogRow[]): EndpointLogger {
  return {
    info: (message, ...metadata): void => {
      rows.push({ level: "info", message, metadata });
    },
    warn: (message, ...metadata): void => {
      rows.push({ level: "warn", message, metadata });
    },
    error: (message, error, ...metadata): void => {
      rows.push({ level: "error", message, metadata: [error, ...metadata] });
    },
    vibe: (message, ...metadata): void => {
      rows.push({ level: "vibe", message, metadata });
    },
    debug: (message, ...metadata): void => {
      rows.push({ level: "debug", message, metadata });
    },
    isDebugEnabled: false,
  };
}

/** Every `requestId` value found in a row's metadata records. */
function requestIdsOf(row: LogRow): string[] {
  const ids: string[] = [];
  for (const m of row.metadata) {
    if (
      m !== null &&
      typeof m === "object" &&
      !Array.isArray(m) &&
      !(m instanceof Date) &&
      !(m instanceof Error) &&
      "requestId" in m &&
      typeof m["requestId"] === "string"
    ) {
      ids.push(m["requestId"]);
    }
  }
  return ids;
}

interface PersistCall {
  extraMeta: LoggerMetadata[];
  ignoreKeys: ReadonlySet<string> | undefined;
}
const persisted: PersistCall[] = [];

type PersistArgs = [
  level: string,
  message: string,
  error: LoggerMetadata,
  extraMeta: LoggerMetadata[],
  locale: string,
  options?: { fingerprintIgnoreKeys?: ReadonlySet<string> },
];

void mock.module("../../logger/db-persist", () => ({
  persistErrorLog: (...args: PersistArgs): void => {
    persisted.push({
      extraMeta: args[3],
      ignoreKeys: args[5]?.fingerprintIgnoreKeys,
    });
  },
}));

const originalFetch = globalThis.fetch;
const sentHeaders: Array<Record<string, string>> = [];

describe("request id propagation", () => {
  beforeAll(() => {
    globalThis.fetch = Object.assign(
      (
        ...args: [input: string | URL | Request, init?: RequestInit]
      ): Promise<Response> => {
        const headers = args[1]?.headers;
        sentHeaders.push(
          headers && !Array.isArray(headers) && !(headers instanceof Headers)
            ? { ...headers }
            : {},
        );
        return Promise.resolve(
          new Response(
            JSON.stringify({
              success: false,
              message: "boom",
              errorType: {
                errorKey: "errorTypes.internal_error",
                errorCode: 500,
              },
            }),
            { status: 500, headers: { "content-type": "application/json" } },
          ),
        );
      },
      { preconnect: originalFetch.preconnect },
    );
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it("client sends x-request-id and reports the failure with the same id", async () => {
    const { callApi } = await import("./call-api");
    const rows: LogRow[] = [];
    const result = await callApi(
      ledgerDefinition.GET,
      recordingLogger(rows),
      {
        isPublic: false,
        id: "00000000-0000-4000-8000-000000000001",
        leadId: "00000000-0000-4000-8000-000000000002",
        roles: [],
      },
      "en-GLOBAL",
      { page: 1, pageSize: 20 },
      { accountId: "00000000-0000-4000-8000-0000000000aa" },
    );
    expect(result.success).toBe(false);

    const sent = sentHeaders.at(-1)?.[REQUEST_ID_HEADER_NAME];
    expect(typeof sent).toBe("string");

    const failure = rows.find((r) =>
      r.message.startsWith("Endpoint call failed"),
    );
    expect(failure).toBeDefined();
    expect(failure ? requestIdsOf(failure) : []).toContain(sent ?? "");
  });

  it("each call gets its own id", async () => {
    const { callApi } = await import("./call-api");
    const user = {
      isPublic: false as const,
      id: "00000000-0000-4000-8000-000000000001",
      leadId: "00000000-0000-4000-8000-000000000002",
      roles: [],
    };
    await callApi(
      ledgerDefinition.GET,
      recordingLogger([]),
      user,
      "en-GLOBAL",
      { page: 1, pageSize: 20 },
      { accountId: "00000000-0000-4000-8000-0000000000aa" },
    );
    await callApi(
      ledgerDefinition.GET,
      recordingLogger([]),
      user,
      "en-GLOBAL",
      { page: 1, pageSize: 20 },
      { accountId: "00000000-0000-4000-8000-0000000000aa" },
    );
    const [a, b] = sentHeaders.slice(-2).map((h) => h[REQUEST_ID_HEADER_NAME]);
    expect(a).toBeDefined();
    expect(a).not.toBe(b);
  });

  it("server adopts a well-formed client id and mints one otherwise", async () => {
    const { resolveRequestId } = await import("../../core/route/next-handler");
    const { NextRequest } = await import("next-vibe/ui/lib/request");
    const id = "4b0c1d7e-8f1a-4c2b-9d3e-5f6a7b8c9d0e";
    const withId = new NextRequest("http://localhost/api/en-GLOBAL/x", {
      headers: { [REQUEST_ID_HEADER_NAME]: id },
    });
    expect(resolveRequestId(withId)).toBe(id);

    const hostile = new NextRequest("http://localhost/api/en-GLOBAL/x", {
      headers: { [REQUEST_ID_HEADER_NAME]: "<script>alert(1)</script>" },
    });
    const minted = resolveRequestId(hostile);
    expect(minted).not.toContain("<");
    expect(minted.length).toBeGreaterThanOrEqual(8);
  });

  it("server logger stamps requestId on persisted rows, outside the fingerprint", async () => {
    const previous = process.env["VIBE_LOG_TARGET"];
    process.env["VIBE_LOG_TARGET"] = "db";
    try {
      const { createEndpointLogger } = await import("../../logger/server");
      const logger = createEndpointLogger(false, "en-GLOBAL", {
        requestId: "req-abc12345",
      });
      logger.error("server failure", { endpoint: "x/GET" });
      logger.warn("server warning");
    } finally {
      process.env["VIBE_LOG_TARGET"] = previous;
    }
    const last = persisted.slice(-2);
    expect(last).toHaveLength(2);
    for (const call of last) {
      expect(call.extraMeta).toContainEqual({ requestId: "req-abc12345" });
      expect(call.ignoreKeys?.has("requestId")).toBe(true);
    }
  });
});
