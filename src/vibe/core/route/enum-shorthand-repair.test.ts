import { describe, expect, it } from "bun:test";
import { z } from "zod";

import {
  matchEnumShorthand,
  repairEnumShorthands,
} from "./enum-shorthand-repair";

const providers = [
  "enums.provider.AUTO",
  "enums.provider.BRAVE",
  "enums.provider.KAGI",
] as const;

describe("matchEnumShorthand", () => {
  it("maps a last-segment shorthand case-insensitively", () => {
    expect(matchEnumShorthand("BRAVE", providers)).toBe("enums.provider.BRAVE");
    expect(matchEnumShorthand("kagi", providers)).toBe("enums.provider.KAGI");
  });

  it("returns null for unknown or ambiguous values", () => {
    expect(matchEnumShorthand("GOOGLE", providers)).toBeNull();
    expect(matchEnumShorthand("x", ["a.x", "b.x"])).toBeNull();
    expect(matchEnumShorthand("", providers)).toBeNull();
  });
});

describe("repairEnumShorthands", () => {
  const schema = z.object({
    query: z.string(),
    provider: z.enum(providers).optional(),
    nested: z.object({ modes: z.array(z.enum(providers)) }).optional(),
  });

  it("rewrites shorthands at top level and nested paths", () => {
    const result = repairEnumShorthands(
      {
        query: "q",
        provider: "BRAVE",
        nested: { modes: ["enums.provider.AUTO", "kagi"] },
      },
      schema,
    );
    expect(result.repaired).toEqual(["provider", "nested.modes.1"]);
    expect(schema.safeParse(result.data).success).toBe(true);
    expect(result.data).toEqual({
      query: "q",
      provider: "enums.provider.BRAVE",
      nested: { modes: ["enums.provider.AUTO", "enums.provider.KAGI"] },
    });
  });

  it("leaves valid data and unrepairable values untouched", () => {
    const valid = { query: "q", provider: "enums.provider.AUTO" };
    expect(repairEnumShorthands(valid, schema)).toEqual({
      data: valid,
      repaired: [],
    });
    const bad = { query: "q", provider: "GOOGLE" };
    expect(repairEnumShorthands(bad, schema)).toEqual({
      data: bad,
      repaired: [],
    });
  });
});
