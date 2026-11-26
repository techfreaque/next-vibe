/**
 * Query-string parsing for GET requests: dot notation, array brackets and
 * qs-style object brackets must all land on the same nested shape.
 */

import { describe, expect, it } from "bun:test";
import { NextRequest } from "next-vibe/ui/lib/request";
import { z } from "zod";

import type { EndpointLogger, LoggerMetadata } from "../../logger/types";
import { parseRequestBody, parseSearchParams } from "./next-request-parser";

describe("parseSearchParams", () => {
  it("keeps string fields literal while decoding structured fields and numbers", () => {
    const schema = z.object({
      query: z.string(),
      limit: z.number(),
      filter: z.object({ status: z.string() }),
    });
    for (const query of ['{"kind":"message"}', '["message"]', "false", "001"]) {
      const params = new URLSearchParams({
        query,
        limit: "10",
        filter: '{"status":"open"}',
      });
      expect(schema.parse(parseSearchParams(params, schema))).toEqual({
        query,
        limit: 10,
        filter: { status: "open" },
      });
    }
  });

  it("parses dot notation into nested objects", () => {
    expect(
      parseSearchParams(
        new URLSearchParams("paginationInfo.page=2&paginationInfo.limit=100"),
      ),
    ).toEqual({ paginationInfo: { page: 2, limit: 100 } });
  });

  it("parses object bracket notation like dot notation", () => {
    expect(
      parseSearchParams(
        new URLSearchParams("paginationInfo[page]=1&paginationInfo[limit]=100"),
      ),
    ).toEqual({ paginationInfo: { page: 1, limit: 100 } });
  });

  it("keeps numeric brackets as array indexes", () => {
    expect(
      parseSearchParams(new URLSearchParams("status[0]=a&status[1]=b")),
    ).toEqual({ status: ["a", "b"] });
    expect(
      parseSearchParams(
        new URLSearchParams("filter[types][0]=x&filter[types][1]=y"),
      ),
    ).toEqual({ filter: { types: ["x", "y"] } });
  });
});

describe("parseRequestBody diagnostic privacy", () => {
  const url =
    "https://example.test/api/en-US/finance/bank/import?private=query-secret";

  function captureDiagnostics(): {
    logs: LoggerMetadata[];
    logger: EndpointLogger;
  } {
    const logs: LoggerMetadata[] = [];
    const capture = (message: string, ...metadata: LoggerMetadata[]): void => {
      logs.push(message, ...metadata);
    };
    return {
      logs,
      logger: {
        isDebugEnabled: true,
        debug: capture,
        error: capture,
        info: capture,
        warn: capture,
        vibe: capture,
      },
    };
  }

  it("logs only safe metadata for malformed JSON and multipart JSON", async () => {
    const badJson = '{unquoted-private-narration: "synthetic-secret"}';
    const multipart = new FormData();
    multipart.set("data", badJson);
    multipart.set("private-payee-name", "synthetic row");
    const { logs, logger } = captureDiagnostics();
    for (const req of [
      new NextRequest(url, {
        method: "POST",
        headers: {
          "content-type": "application/json; diagnostic=secret-parameter",
        },
        body: badJson,
      }),
      new NextRequest(url, { method: "POST", body: multipart }),
    ]) {
      expect(await parseRequestBody(req, logger)).toEqual({});
    }
    expect(logs).toContainEqual(
      expect.objectContaining({
        contentTypeFamily: "json",
        bodyStage: "decode-json",
      }),
    );
    expect(logs).toContainEqual(
      expect.objectContaining({
        contentTypeFamily: "multipart",
        bodyStage: "decode-multipart-json",
      }),
    );
    const diagnostics = JSON.stringify(logs);
    for (const value of [
      "unquoted-private-narration",
      "synthetic-secret",
      "private-payee-name",
      "secret-parameter",
      "query-secret",
    ]) {
      expect(diagnostics).not.toContain(value);
    }
  });

  it("keeps multipart content in the parsed request and emits only counts", async () => {
    const multipart = new FormData();
    multipart.set(
      "data",
      JSON.stringify({ "private-draft-name": "synthetic row" }),
    );
    multipart.set(
      "fileUpload.files[]",
      new File(["fixture"], "sensitive-statement.csv"),
    );
    const { logs, logger } = captureDiagnostics();
    const req = new NextRequest(url, { method: "POST", body: multipart });
    expect(await parseRequestBody(req, logger)).toMatchObject({
      "private-draft-name": "synthetic row",
      fileUpload: {
        files: [expect.objectContaining({ name: "sensitive-statement.csv" })],
      },
    });
    expect(logs).toContainEqual({
      jsonFieldCount: 1,
      multipartFieldCount: 1,
      mergedFieldCount: 2,
    });
    expect(JSON.stringify(logs)).not.toContain("private-draft-name");
    expect(JSON.stringify(logs)).not.toContain("sensitive-statement.csv");
  });
});
