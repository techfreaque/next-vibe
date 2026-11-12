/**
 * Render-time media URL resolution: every storage URL (portable, legacy route,
 * minted on another host) resolves onto the serving instance.
 */
import { beforeAll, describe, expect, it, mock } from "bun:test";

const fakeEnv = { NEXT_PUBLIC_APP_URL: "https://unbottled.ai/" };
const fakePlatform = { isServer: false, isReactNative: false, isBrowser: true };

// Registered at collection time so the SUT (imported in beforeAll) resolves
// the stubbed client env instead of the real build-time one.
void mock.module("next-vibe/core/env-client", () => ({
  coreClientEnv: fakeEnv,
  platform: fakePlatform,
}));

let resolveMediaSrc: (url: string, options?: { absolute?: boolean }) => string;

beforeAll(async () => {
  ({ resolveMediaSrc } = await import("./media-src"));
});

const PATH =
  "/api/en-GLOBAL/vibe/agent/chat/threads/files/b992b758-ab44-4a39-9ae1-f81d4f6a69fb/b5b53407-af3b-499b-a972-bd7c3e32105c.jpeg";

describe("resolveMediaSrc", () => {
  it("serves a baked localhost URL same-origin in the browser", () => {
    expect(resolveMediaSrc(`http://localhost:3000${PATH}`)).toBe(PATH);
  });

  it("keeps a portable path same-origin in the browser", () => {
    expect(resolveMediaSrc(PATH)).toBe(PATH);
  });

  it("qualifies against this instance when absolute is required (CLI/MCP)", () => {
    expect(
      resolveMediaSrc(`http://localhost:3000${PATH}`, { absolute: true }),
    ).toBe(`https://unbottled.ai${PATH}`);
  });

  it("leaves third-party media untouched", () => {
    expect(
      resolveMediaSrc("https://cdn.example.com/x.png", { absolute: true }),
    ).toBe("https://cdn.example.com/x.png");
  });
});
