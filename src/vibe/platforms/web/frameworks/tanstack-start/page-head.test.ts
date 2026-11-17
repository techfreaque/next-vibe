import { describe, expect, it } from "bun:test";

import { metadataToHead } from "./page-head";

describe("metadataToHead verification", () => {
  it("renders google and other verification tokens", () => {
    const { meta } = metadataToHead({
      verification: {
        google: "g-token",
        other: { "msvalidate.01": "b-token" },
      },
    }, null);
    expect(meta).toContainEqual({
      name: "google-site-verification",
      content: "g-token",
    });
    expect(meta).toContainEqual({ name: "msvalidate.01", content: "b-token" });
  });

  it("renders no canonical when alternates is null", () => {
    const { links } = metadataToHead({ alternates: null }, null);
    expect(links.some((link) => link.rel === "canonical")).toBe(false);
  });
});
