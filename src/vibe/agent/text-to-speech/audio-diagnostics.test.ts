import { describe, expect, it } from "bun:test";

import { classifyPlayRejection, isOwnTeardownAbort } from "./audio-diagnostics";

function domError(name: string, message: string): Error {
  const error = new Error(message);
  error.name = name;
  return error;
}

describe("isOwnTeardownAbort", () => {
  const abort = domError(
    "AbortError",
    "The play() request was interrupted by a call to pause().",
  );

  it("suppresses an AbortError caused by our own stop()", () => {
    expect(isOwnTeardownAbort(abort, true)).toBe(true);
  });

  it("keeps an AbortError we did not cause", () => {
    expect(isOwnTeardownAbort(abort, false)).toBe(false);
  });

  it("keeps non-abort rejections even after our stop()", () => {
    expect(
      isOwnTeardownAbort(domError("NotSupportedError", "no source"), true),
    ).toBe(false);
    expect(
      isOwnTeardownAbort(domError("NotAllowedError", "user gesture"), true),
    ).toBe(false);
  });

  it("keeps a missing error", () => {
    expect(isOwnTeardownAbort(null, true)).toBe(false);
  });
});

describe("classifyPlayRejection", () => {
  it("classifies AbortError as interrupted", () => {
    expect(classifyPlayRejection(domError("AbortError", "x"))).toBe(
      "interrupted",
    );
  });
});
