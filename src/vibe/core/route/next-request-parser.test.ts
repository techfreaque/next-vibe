/**
 * Query-string parsing for GET requests: dot notation, array brackets and
 * qs-style object brackets must all land on the same nested shape.
 */

import { describe, expect, it } from "bun:test";
import { z } from "zod";

import { parseSearchParams } from "./next-request-parser";

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
