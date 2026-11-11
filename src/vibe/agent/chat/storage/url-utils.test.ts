/**
 * `makeAbsoluteStorageUrl`: server-side storage-URL construction.
 *
 * The regression this guards: on PROD the client env (`coreClientEnv`) bakes
 * NEXT_PUBLIC_APP_URL to the `http://localhost:3000` schema default at Docker
 * build time (no sentinel is injected for a key absent from the build env, so
 * the runtime patch never fixes it), which made generated-media URLs come back
 * as localhost links. The fix reads the SERVER env (`coreEnv`), which resolves
 * NEXT_PUBLIC_APP_URL from `process.env` at runtime. These tests stub `coreEnv`
 * to prove the prefix is taken from it, for both the prod-https and dev-localhost
 * cases.
 */
import { afterEach, beforeAll, describe, expect, it, mock } from "bun:test";

const fakeEnv = { NEXT_PUBLIC_APP_URL: "https://unbottled.ai" };

function setAppUrl(value: string): void {
  fakeEnv.NEXT_PUBLIC_APP_URL = value;
}

// Registered at collection time, before beforeAll runs — so the SUT, imported
// inside beforeAll, resolves `coreEnv` to this stub instead of the server-only
// env singleton. A top-level `await import` is disallowed by the tsconfig.
void mock.module("next-vibe/core/env", () => ({ coreEnv: fakeEnv }));

let makeAbsoluteStorageUrl: (relativeUrl: string) => string;

beforeAll(async () => {
  ({ makeAbsoluteStorageUrl } = await import("./url-utils"));
});

afterEach(() => {
  setAppUrl("https://unbottled.ai");
});

describe("makeAbsoluteStorageUrl", () => {
  it("prefixes a relative URL with the runtime prod app URL", () => {
    setAppUrl("https://unbottled.ai");
    expect(makeAbsoluteStorageUrl("/api/en-GLOBAL/file/abc.png")).toBe(
      "https://unbottled.ai/api/en-GLOBAL/file/abc.png",
    );
  });

  it("still works in dev with a localhost app URL", () => {
    setAppUrl("http://localhost:3000");
    expect(makeAbsoluteStorageUrl("/api/en-GLOBAL/file/abc.png")).toBe(
      "http://localhost:3000/api/en-GLOBAL/file/abc.png",
    );
  });

  it("strips a trailing slash from the base before joining", () => {
    setAppUrl("https://unbottled.ai/");
    expect(makeAbsoluteStorageUrl("/x.png")).toBe("https://unbottled.ai/x.png");
  });

  it("leaves an already-absolute http URL untouched", () => {
    setAppUrl("https://unbottled.ai");
    expect(makeAbsoluteStorageUrl("http://example.com/x.png")).toBe(
      "http://example.com/x.png",
    );
  });

  it("leaves an already-absolute https URL untouched", () => {
    setAppUrl("https://unbottled.ai");
    expect(makeAbsoluteStorageUrl("https://cdn.example.com/x.png")).toBe(
      "https://cdn.example.com/x.png",
    );
  });
});
