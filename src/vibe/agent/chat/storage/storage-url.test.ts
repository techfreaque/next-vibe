/**
 * Portable storage-URL normalization.
 *
 * The regression this guards: generated-media URLs were persisted absolute,
 * carrying whatever host the writing process resolved. A prod image that baked
 * `http://localhost:3000` (and the `/agent/...` → `/vibe/agent/...` route move)
 * left message content and tool results pointing at hosts/routes the serving
 * instance can't reach. Stored references are now host-free and every legacy
 * form normalizes to the same canonical path.
 */
import { describe, expect, it } from "bun:test";

import {
  buildStorageFilePath,
  isStorageUrl,
  mediaMarkdownLink,
  mediaUrlSchema,
  parseStorageFileRef,
  repairMangledStorageUrl,
  repairMangledStorageUrlsInText,
  rewriteStorageUrlsInText,
  STORAGE_FILES_ROUTE,
  toPortableStorageUrl,
  withMediaMarkdownLink,
} from "./storage-url";

const THREAD = "b992b758-ab44-4a39-9ae1-f81d4f6a69fb";
const FILE = "b5b53407-af3b-499b-a972-bd7c3e32105c.jpeg";
const PORTABLE = `/api/en-GLOBAL/vibe/agent/chat/threads/files/${THREAD}/${FILE}`;

describe("buildStorageFilePath", () => {
  it("builds a host-free path on the canonical route", () => {
    expect(buildStorageFilePath(THREAD, FILE)).toBe(PORTABLE);
    expect(PORTABLE.startsWith(STORAGE_FILES_ROUTE)).toBe(true);
  });
});

describe("toPortableStorageUrl", () => {
  it("strips a baked localhost host", () => {
    expect(toPortableStorageUrl(`http://localhost:3000${PORTABLE}`)).toBe(
      PORTABLE,
    );
  });

  it("strips the prod host", () => {
    expect(toPortableStorageUrl(`https://unbottled.ai${PORTABLE}`)).toBe(
      PORTABLE,
    );
  });

  it("strips a foreign dev-instance host with an odd port", () => {
    expect(toPortableStorageUrl(`http://127.0.0.1:3002${PORTABLE}`)).toBe(
      PORTABLE,
    );
  });

  it("moves the legacy /agent route onto /vibe/agent", () => {
    expect(
      toPortableStorageUrl(
        `https://unbottled.ai/api/en-GLOBAL/agent/chat/threads/files/${THREAD}/${FILE}`,
      ),
    ).toBe(PORTABLE);
  });

  it("canonicalizes the locale segment", () => {
    expect(
      toPortableStorageUrl(
        `/api/de-DE/vibe/agent/chat/threads/files/${THREAD}/${FILE}`,
      ),
    ).toBe(PORTABLE);
  });

  it("keeps a query string", () => {
    expect(
      toPortableStorageUrl(`http://localhost:3000${PORTABLE}?download=1`),
    ).toBe(`${PORTABLE}?download=1`);
  });

  it("is idempotent on the portable form", () => {
    expect(toPortableStorageUrl(PORTABLE)).toBe(PORTABLE);
  });

  it("leaves third-party URLs alone", () => {
    const external = "https://cdn.example.com/images/cat.png";
    expect(toPortableStorageUrl(external)).toBe(external);
  });

  it("leaves data URIs alone", () => {
    const data = "data:image/png;base64,AAAA";
    expect(toPortableStorageUrl(data)).toBe(data);
  });

  it("does not match a lookalike path with extra segments", () => {
    const lookalike = `https://evil.example/api/en-GLOBAL/vibe/agent/chat/threads/files/${THREAD}/${FILE}/x`;
    expect(toPortableStorageUrl(lookalike)).toBe(lookalike);
  });
});

describe("isStorageUrl", () => {
  it("recognizes every storage form", () => {
    expect(isStorageUrl(PORTABLE)).toBe(true);
    expect(isStorageUrl(`http://localhost:3000${PORTABLE}`)).toBe(true);
    expect(
      isStorageUrl(
        `/api/en-GLOBAL/agent/chat/threads/files/${THREAD}/${FILE}`,
      ),
    ).toBe(true);
  });

  it("rejects non-storage URLs", () => {
    expect(isStorageUrl("https://example.com/a.png")).toBe(false);
    expect(isStorageUrl("/images/logo.png")).toBe(false);
  });
});

describe("rewriteStorageUrlsInText", () => {
  it("rewrites the markdown image from the broken prod thread", () => {
    const content = `Ready:\n\n![A red circle](http://localhost:3000${PORTABLE})\n\nMore?`;
    expect(rewriteStorageUrlsInText(content)).toBe(
      `Ready:\n\n![A red circle](${PORTABLE})\n\nMore?`,
    );
  });

  it("rewrites every occurrence, mixed hosts and routes", () => {
    const other = `/api/en-GLOBAL/vibe/agent/chat/threads/files/${THREAD}/aaaaaaaa-0000-0000-0000-000000000000.png`;
    const text = `a http://localhost:3000${PORTABLE} b https://unbottled.ai/api/en-GLOBAL/agent/chat/threads/files/${THREAD}/aaaaaaaa-0000-0000-0000-000000000000.png c`;
    expect(rewriteStorageUrlsInText(text)).toBe(`a ${PORTABLE} b ${other} c`);
  });

  it("is idempotent", () => {
    const text = `x ![i](${PORTABLE}) y`;
    expect(rewriteStorageUrlsInText(text)).toBe(text);
  });

  it("does not touch prose mentioning localhost", () => {
    const prose = "npm start, then open http://localhost:3000 in a browser";
    expect(rewriteStorageUrlsInText(prose)).toBe(prose);
  });

  it("stops at a JSON string delimiter", () => {
    const json = JSON.stringify({ imageUrl: `http://localhost:3000${PORTABLE}` });
    expect(rewriteStorageUrlsInText(json)).toBe(
      JSON.stringify({ imageUrl: PORTABLE }),
    );
  });
});

describe("mediaUrlSchema", () => {
  it("accepts a portable storage path (what tool results now return)", () => {
    expect(mediaUrlSchema.safeParse(PORTABLE).success).toBe(true);
  });

  it("accepts an absolute third-party URL", () => {
    expect(
      mediaUrlSchema.safeParse("https://cdn.example.com/x.png").success,
    ).toBe(true);
  });

  it("rejects a bare non-storage relative path", () => {
    expect(mediaUrlSchema.safeParse("/etc/passwd").success).toBe(false);
  });

  it("rejects garbage", () => {
    expect(mediaUrlSchema.safeParse("not a url").success).toBe(false);
  });
});

/**
 * Models mangled media links by dropping `/files`
 * (`/threads/{threadId}/{fileId}.mp3`): users got broken links.
 */
describe("mangled storage URLs (/files dropped)", () => {
  const AUDIO = "5f0c2a8e-1b7d-4c3e-9a6f-2d8b1e4c7a90.mp3";
  const MANGLED = `/api/de-DE/vibe/agent/chat/threads/${THREAD}/${AUDIO}`;
  const CANONICAL = `/api/en-GLOBAL/vibe/agent/chat/threads/files/${THREAD}/${AUDIO}`;

  it("maps the mangled path to the canonical file route", () => {
    expect(repairMangledStorageUrl(MANGLED)).toBe(CANONICAL);
    expect(repairMangledStorageUrl(`https://unbottled.ai${MANGLED}?x=1`)).toBe(
      `${CANONICAL}?x=1`,
    );
    expect(toPortableStorageUrl(MANGLED)).toBe(CANONICAL);
    expect(isStorageUrl(MANGLED)).toBe(true);
    expect(parseStorageFileRef(MANGLED)).toEqual({
      threadId: THREAD,
      filename: AUDIO,
    });
  });

  it("never matches real thread routes or non-media files", () => {
    for (const path of [
      CANONICAL,
      `/api/en-US/vibe/agent/chat/threads/${THREAD}/messages`,
      `/api/en-US/vibe/agent/chat/threads/${THREAD}/permissions`,
      `/api/en-US/vibe/agent/chat/threads/${THREAD}/notes.txt`,
      `/api/en-US/vibe/agent/chat/threads/${THREAD}/not-a-uuid.mp3`,
      `/api/en-US/vibe/agent/chat/threads/${THREAD}/${AUDIO}x`,
      `/api/en-US/vibe/agent/chat/threads/${THREAD}/${AUDIO}/more`,
    ]) {
      expect(repairMangledStorageUrl(path)).toBeNull();
    }
  });

  it("repairs only mangled links inside answer text", () => {
    const text = `Listen: [song](${MANGLED}) or ${CANONICAL} and /api/en-US/vibe/agent/chat/threads/${THREAD}/messages`;
    expect(repairMangledStorageUrlsInText(text)).toBe(
      `Listen: [song](${CANONICAL}) or ${CANONICAL} and /api/en-US/vibe/agent/chat/threads/${THREAD}/messages`,
    );
  });
});

describe("withMediaMarkdownLink", () => {
  it("adds a paste-ready link next to an own media URL", () => {
    const direct: Record<string, string | number> = withMediaMarkdownLink({
      audioUrl: PORTABLE,
      creditCost: 1,
    });
    expect(direct).toEqual({
      audioUrl: PORTABLE,
      creditCost: 1,
      markdownLink: `[audio](${PORTABLE})`,
    });
    const wrapped: { result: Record<string, string> } = withMediaMarkdownLink({
      result: { imageUrl: PORTABLE },
    });
    expect(wrapped).toEqual({
      result: { imageUrl: PORTABLE, markdownLink: `[image](${PORTABLE})` },
    });
  });

  it("leaves third-party URLs and other results alone", () => {
    const external = { imageUrl: "https://example.com/a.png" };
    expect(withMediaMarkdownLink(external)).toBe(external);
    expect(withMediaMarkdownLink("text")).toBe("text");
    expect(mediaMarkdownLink("data:image/png;base64,xx", "image")).toBeNull();
  });
});
