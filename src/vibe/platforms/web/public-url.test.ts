/**
 * `patchPublicUrlPort`: the one rule `vibe build` and `vibe start` share.
 */
import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { patchPublicUrlPort } from "./public-url";

const NAME = "NEXT_PUBLIC_APP_URL";
let saved: string | undefined;

beforeEach(() => {
  saved = process.env[NAME];
});

afterEach(() => {
  if (saved === undefined) {
    delete process.env[NAME];
  } else {
    process.env[NAME] = saved;
  }
});

describe("patchPublicUrlPort", () => {
  it("rewrites the port of a localhost URL", () => {
    process.env[NAME] = "http://localhost:4000";
    patchPublicUrlPort(4005, { setIfMissing: false });
    expect(process.env[NAME]).toBe("http://localhost:4005/");
  });

  it("rewrites 127.0.0.1 too and keeps the path", () => {
    process.env[NAME] = "http://127.0.0.1:4000/app";
    patchPublicUrlPort(4005, { setIfMissing: false });
    expect(process.env[NAME]).toBe("http://127.0.0.1:4005/app");
  });

  it("leaves a production URL untouched", () => {
    process.env[NAME] = "https://www.pcvisit.com";
    patchPublicUrlPort(4005, { setIfMissing: true });
    expect(process.env[NAME]).toBe("https://www.pcvisit.com");
  });

  it("leaves a non-URL value untouched", () => {
    process.env[NAME] = "not a url";
    patchPublicUrlPort(4005, { setIfMissing: true });
    expect(process.env[NAME]).toBe("not a url");
  });

  it("defaults an unset variable only when asked to", () => {
    delete process.env[NAME];
    patchPublicUrlPort(4005, { setIfMissing: false });
    expect(process.env[NAME]).toBeUndefined();
    patchPublicUrlPort(4005, { setIfMissing: true });
    expect(process.env[NAME]).toBe("http://localhost:4005");
  });
});
