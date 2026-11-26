import { describe, expect, it } from "bun:test";

import {
  attachmentDisposition,
  mediaDownloadHref,
  mediaDownloadName,
  sanitizeDownloadName,
} from "./download-name";

const URL_MP4 =
  "/api/en-GLOBAL/vibe/agent/chat/threads/files/8d467523-3ad0-48c2-91d5-69828d5578a8/84f20ea7-1088-4cae-813c-d9663cc50427.mp4";

describe("media download names", () => {
  it("names a generated video after model and date with the stored extension", () => {
    expect(
      mediaDownloadName({
        url: URL_MP4,
        kind: "video",
        model: "kling-v2-5-turbo-i2v",
        createdAt: "2026-11-26T13:33:19.105Z",
      }),
    ).toBe("unbottled-kling-v2-5-turbo-i2v-2026-11-26.mp4");
  });

  it("falls back to the kind when no model is known", () => {
    expect(
      mediaDownloadName({ url: URL_MP4, kind: "video", createdAt: "2026-01-02T00:00:00Z" }),
    ).toBe("unbottled-video-2026-01-02.mp4");
  });

  it("forces the stored extension and strips unsafe characters", () => {
    expect(sanitizeDownloadName('../evil"name.exe', "abc.mp4")).toBe(
      "evil-name.mp4",
    );
    expect(sanitizeDownloadName("x", "no-extension")).toBeNull();
    expect(sanitizeDownloadName("///", "a.png")).toBeNull();
  });

  it("adds the download query only to own storage files", () => {
    expect(mediaDownloadHref(URL_MP4, "a.mp4")).toBe(`${URL_MP4}?download=a.mp4`);
    expect(mediaDownloadHref("https://cdn.example.com/v.mp4", "a.mp4")).toBe(
      "https://cdn.example.com/v.mp4",
    );
    expect(mediaDownloadHref(URL_MP4, null)).toBe(URL_MP4);
  });

  it("builds an attachment header", () => {
    expect(attachmentDisposition("a.mp4")).toBe(
      "attachment; filename=\"a.mp4\"; filename*=UTF-8''a.mp4",
    );
  });
});
