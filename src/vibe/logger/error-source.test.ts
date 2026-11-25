/**
 * Source attribution for uncaught browser errors, with the exact messages
 * from the prod error log (2026-11-25 07:03-07:09 UTC).
 */

import { describe, expect, it } from "bun:test";

import {
  classifyErrorSource,
  errorSourceTag,
  isForeignErrorSource,
} from "./error-source";

const pageOrigin = "https://unbottled.ai";
const pageUrl = "https://unbottled.ai/en-US/threads/private";

function classify(
  message: string,
  extra: { filename?: string; lineno?: number; stack?: string } = {},
): ReturnType<typeof classifyErrorSource> {
  return classifyErrorSource({ message, pageOrigin, pageUrl, ...extra });
}

describe("classifyErrorSource", () => {
  it("tags iOS Firefox reader-mode scripts as injected-global", () => {
    for (const message of [
      "undefined is not an object (evaluating 'window.__firefox__.reader.checkReadability')",
      "Can't find variable: __firefox__",
      "undefined is not an object (evaluating 'window.__firefox__.refresh')",
    ]) {
      // iOS reports the page itself as the file of injected scripts
      const result = classify(message, { filename: pageUrl, lineno: 1 });
      expect(result.errorSource).toBe("injected-global");
      expect(result.injectedGlobal).toBe("__firefox__");
      expect(errorSourceTag(result)).toBe("[injected-global: __firefox__]");
    }
  });

  it("tags wallet and Dark Reader globals as injected-global", () => {
    const wallet = classify(
      "undefined is not an object (evaluating 'window.ethereum.selectedAddress')",
      { filename: pageUrl, lineno: 3 },
    );
    expect(wallet.errorSource).toBe("injected-global");
    expect(wallet.injectedGlobal).toBe("ethereum");

    const darkReader = classify("Can't find variable: DarkReader");
    expect(darkReader.errorSource).toBe("injected-global");
    expect(darkReader.injectedGlobal).toBe("DarkReader");
  });

  it("matches injected globals as whole identifiers only", () => {
    expect(classify("ethereumPrice is not defined").errorSource).not.toBe(
      "injected-global",
    );
  });

  it("tags an opaque Script error. as opaque-cross-origin", () => {
    const result = classify("Script error.", { filename: "", lineno: 0 });
    expect(result.errorSource).toBe("opaque-cross-origin");
    expect(errorSourceTag(result)).toBe("[opaque-cross-origin]");
  });

  it("tags extension frames as browser-extension", () => {
    const result = classify("x is undefined", {
      stack:
        "TypeError: x is undefined\n    at f (chrome-extension://abcdefgh/content.js:10:5)",
    });
    expect(result.errorSource).toBe("browser-extension");
    expect(result.extensionOrigin).toBe("chrome-extension://abcdefgh");
  });

  it("attributes our chunks to our-bundle and keeps their tag empty", () => {
    const chrome = classify("Cannot read properties of null", {
      filename: "https://unbottled.ai/_next/static/chunks/app-1234.js",
      lineno: 1,
      stack:
        "TypeError: Cannot read properties of null\n    at h (https://unbottled.ai/_next/static/chunks/app-1234.js:1:200)",
    });
    expect(chrome.errorSource).toBe("our-bundle");
    expect(errorSourceTag(chrome)).toBeNull();

    const safari = classify("null is not an object", {
      stack: "h@https://unbottled.ai/assets/index-abc.js:1:200",
    });
    expect(safari.errorSource).toBe("our-bundle");
  });

  it("separates third-party scripts and inline/unknown", () => {
    expect(
      classify("boom", {
        filename: "https://cdn.example.com/widget.js",
        lineno: 4,
      }).errorSource,
    ).toBe("third-party-script");
    expect(
      classify("boom", { filename: pageUrl, lineno: 4 }).errorSource,
    ).toBe("inline-or-unknown");
    expect(classify("boom").errorSource).toBe("inline-or-unknown");
  });

  it("recognises foreign classes from metadata values", () => {
    expect(isForeignErrorSource("injected-global")).toBe(true);
    expect(isForeignErrorSource("opaque-cross-origin")).toBe(true);
    expect(isForeignErrorSource("browser-extension")).toBe(true);
    expect(isForeignErrorSource("our-bundle")).toBe(false);
    expect(isForeignErrorSource("inline-or-unknown")).toBe(false);
    expect(isForeignErrorSource("made-up")).toBe(false);
    expect(isForeignErrorSource(undefined)).toBe(false);
  });
});
