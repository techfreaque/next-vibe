import { describe, expect, it } from "bun:test";

import { metadataToHead, viewportToHead } from "./page-head";

describe("viewportToHead", () => {
  it("emits one mobile viewport tag alongside the theme color", () => {
    expect(
      viewportToHead({
        width: "device-width",
        initialScale: 1,
        themeColor: "#0EA5E9",
      }),
    ).toEqual([
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0EA5E9" },
    ]);
  });
});

describe("metadataToHead verification", () => {
  it("renders google and other verification tokens", () => {
    const { meta } = metadataToHead(
      {
        verification: {
          google: "g-token",
          other: { "msvalidate.01": "b-token" },
        },
      },
      null,
    );
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
