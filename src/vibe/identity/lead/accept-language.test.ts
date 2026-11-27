import { describe, expect, it } from "bun:test";

import { primaryAcceptLanguage } from "./accept-language";

describe("primaryAcceptLanguage", () => {
  it("returns the primary subtag of the most preferred language", () => {
    expect(primaryAcceptLanguage("hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("hi");
    expect(primaryAcceptLanguage("en-US,en;q=0.9")).toBe("en");
    expect(primaryAcceptLanguage("en;q=0.5, de-AT;q=0.9")).toBe("de");
    expect(primaryAcceptLanguage("FIL-ph")).toBe("fil");
    expect(primaryAcceptLanguage("pt_BR")).toBe("pt");
  });

  it("keeps browser order on equal weights", () => {
    expect(primaryAcceptLanguage("sk, cs")).toBe("sk");
  });

  it("ignores wildcards, zero weights and junk", () => {
    expect(primaryAcceptLanguage(null)).toBeNull();
    expect(primaryAcceptLanguage("")).toBeNull();
    expect(primaryAcceptLanguage("*")).toBeNull();
    expect(primaryAcceptLanguage("*;q=1, fr;q=0.2")).toBe("fr");
    expect(primaryAcceptLanguage("hi;q=0, en;q=0.1")).toBe("en");
    expect(primaryAcceptLanguage("<script>,x1")).toBeNull();
  });
});
