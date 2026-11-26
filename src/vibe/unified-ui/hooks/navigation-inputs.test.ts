import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  deserializeNavigationData,
  serializeNavigationData,
} from "./use-url-nav-stack";

describe("admin tool URL inputs", () => {
  it("round-trips nested action defaults in a tool URL", () => {
    const schema = z.object({
      details: z.object({
        terminalId: z.string(),
        openingFloat: z.number(),
      }),
    });
    const data = { details: { terminalId: "till", openingFloat: 0 } };
    const serialized = serializeNavigationData(data);
    expect(serialized).toEqual({
      "details.terminalId": "till",
      "details.openingFloat": "0",
    });
    expect(deserializeNavigationData(serialized, schema)).toEqual(data);
  });

  it("restores plain booleans and numbers only for matching schema fields", () => {
    const schema = z.object({
      dryRun: z.boolean().default(true),
      page: z.number().int().optional(),
      options: z.object({ flag: z.boolean().nullable() }).optional(),
      account: z.string(),
      search: z.string(),
    });
    expect(
      deserializeNavigationData(
        {
          dryRun: "false",
          page: "3",
          "options.flag": "true",
          account: "0003",
          search: "false",
        },
        schema,
      ),
    ).toEqual({
      dryRun: false,
      page: 3,
      options: { flag: true },
      account: "0003",
      search: "false",
    });
    expect(
      deserializeNavigationData({ dryRun: "mistyped", page: "" }, schema),
    ).toEqual({ dryRun: "mistyped", page: "" });
    expect(
      deserializeNavigationData(
        { "dryRun:bool": "true", "tags[]": '["001","false"]' },
        schema,
      ),
    ).toEqual({ dryRun: true, tags: ["001", "false"] });
  });

  it("preserves nested lead filters and the linked page size on pagination", () => {
    const schema = z.object({
      statusFilters: z
        .object({ search: z.string(), status: z.array(z.string()).optional() })
        .optional(),
      paginationInfo: z
        .object({
          page: z.coerce.number().default(1),
          limit: z.coerce.number().default(50),
        })
        .prefault({}),
    });
    const restored = deserializeNavigationData(
      {
        "statusFilters.search": "001",
        "statusFilters.status[]": '["new"]',
        "paginationInfo.limit": "1",
      },
      schema,
    );
    const initialPage = schema.parse(restored);
    expect(initialPage).toEqual({
      statusFilters: { search: "001", status: ["new"] },
      paginationInfo: { page: 1, limit: 1 },
    });
    expect(
      schema.parse({
        ...initialPage,
        paginationInfo: { ...initialPage.paginationInfo, page: 2 },
      }),
    ).toEqual({
      statusFilters: { search: "001", status: ["new"] },
      paginationInfo: { page: 2, limit: 1 },
    });
  });
});
