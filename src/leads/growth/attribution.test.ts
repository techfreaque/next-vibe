/**
 * Growth attribution - first/last-touch rules and touch extraction.
 * Pure: no DB, no network.
 */

import { describe, expect, it } from "vitest";

import {
  buildCampaignUrl,
  deriveChannel,
  extractTouch,
  hasCampaignSignal,
  isLikelyBot,
  normalizeChannelKey,
  normalizeDestinationPath,
  planTouch,
} from "./attribution";
import { ChannelType } from "./enum";

const APP = "https://unbottled.ai";
const OWN = ["unbottled.ai"];
const LINK_ID = "6f1c2b4e-8f0a-4c1d-9b2e-3a4f5d6e7f80";

function touchFor(url: string, referer?: string): ReturnType<typeof extractTouch> {
  return extractTouch(new URL(url, APP), referer, OWN);
}

describe("extractTouch", () => {
  it("reads UTMs, lowercases source/medium, keeps path without query", () => {
    const touch = touchFor(
      "/en-US/story?utm_source=Reddit&utm_medium=Social&utm_campaign=Launch-Nov&utm_content=top&utm_term=ai&secret=1",
    );
    expect(touch).toEqual({
      source: "reddit",
      medium: "social",
      campaign: "Launch-Nov",
      content: "top",
      term: "ai",
      referrerHost: null,
      landingPath: "/en-US/story",
      refCode: null,
      linkId: null,
    });
  });

  it("stores only the external referrer host, never the URL", () => {
    expect(
      touchFor("/", "https://www.reddit.com/r/LocalLLaMA/comments/abc?x=1")
        .referrerHost,
    ).toBe("reddit.com");
  });

  it("ignores internal referrers", () => {
    expect(touchFor("/", "https://unbottled.ai/en-US/threads").referrerHost).toBe(
      null,
    );
    expect(
      touchFor("/", "https://www.unbottled.ai/en-US").referrerHost,
    ).toBe(null);
  });

  it("accepts utm_id only when it is a UUID", () => {
    expect(touchFor(`/?utm_id=${LINK_ID}`).linkId).toBe(LINK_ID);
    expect(touchFor("/?utm_id=abc").linkId).toBe(null);
  });

  it("resolves /track to the destination path and merges both queries", () => {
    const touch = touchFor(
      `/en-US/track?ref=FRIEND2024&url=${encodeURIComponent("/story?utm_term=x")}&utm_source=partner&utm_id=${LINK_ID}`,
    );
    expect(touch.landingPath).toBe("/story");
    expect(touch.refCode).toBe("FRIEND2024");
    expect(touch.source).toBe("partner");
    expect(touch.term).toBe("x");
    expect(touch.linkId).toBe(LINK_ID);
  });

  it("never stores an off-site /track destination path", () => {
    const touch = touchFor(
      `/en-US/track?url=${encodeURIComponent("https://evil.example/phish")}`,
    );
    expect(touch.landingPath).toBe("/en-US/track");
  });

  it("strips control characters and caps lengths", () => {
    const long = "a".repeat(500);
    const touch = touchFor(`/?utm_campaign=${long}&utm_source=%00red%0Ddit`);
    expect(touch.campaign?.length).toBe(100);
    expect(touch.source).toBe("reddit");
  });
});

describe("deriveChannel", () => {
  it("prefers utm_source", () => {
    const t = deriveChannel(touchFor("/?utm_source=reddit&ref=CODE"));
    expect(t.channel).toBe("reddit");
    expect(t.channelType).toBe(ChannelType.CAMPAIGN);
  });

  it("falls back to the ref code", () => {
    const t = deriveChannel(touchFor("/?ref=CODE"));
    expect(t.channel).toBe("ref:CODE");
    expect(t.channelType).toBe(ChannelType.REFERRAL);
  });

  it("groups UTM traffic without a source under (none)", () => {
    const t = deriveChannel(touchFor("/?utm_campaign=x"));
    expect(t.channel).toBe("(none)");
    expect(t.channelType).toBe(ChannelType.CAMPAIGN);
  });

  it("uses the referrer host for organic traffic", () => {
    const t = deriveChannel(touchFor("/", "https://news.ycombinator.com/item"));
    expect(t.channel).toBe("news.ycombinator.com");
    expect(t.channelType).toBe(ChannelType.ORGANIC);
  });

  it("is direct otherwise", () => {
    const t = deriveChannel(touchFor("/"));
    expect(t.channel).toBe("direct");
    expect(t.channelType).toBe(ChannelType.DIRECT);
  });
});

describe("planTouch - first/last-touch rules", () => {
  const plain = touchFor("/", "https://google.com/");
  const tagged = touchFor("/?utm_source=youtube");
  const linked = touchFor(`/?utm_id=${LINK_ID}`);

  it("first visit inserts: the touch is both first and last", () => {
    expect(planTouch(false, plain)).toEqual({
      insert: true,
      updateLast: false,
      countLinkVisit: false,
    });
    expect(planTouch(false, tagged).insert).toBe(true);
  });

  it("later plain or organic visit changes nothing (first touch immutable)", () => {
    expect(planTouch(true, plain)).toEqual({
      insert: false,
      updateLast: false,
      countLinkVisit: false,
    });
  });

  it("later visit with UTMs moves only the last touch", () => {
    expect(planTouch(true, tagged)).toEqual({
      insert: false,
      updateLast: true,
      countLinkVisit: false,
    });
  });

  it("a link visit always counts", () => {
    expect(planTouch(true, linked).countLinkVisit).toBe(true);
    expect(planTouch(false, linked).countLinkVisit).toBe(true);
  });

  it("organic referrers are not campaign signals", () => {
    expect(hasCampaignSignal(plain)).toBe(false);
    expect(hasCampaignSignal(touchFor("/?ref=X"))).toBe(true);
  });
});

describe("link builder helpers", () => {
  const link = {
    id: LINK_ID,
    source: "reddit",
    medium: "social",
    campaign: "launch",
    content: null,
    term: null,
    destinationPath: "/story",
    refCode: null,
  };

  it("builds a direct UTM link carrying utm_id", () => {
    expect(buildCampaignUrl(`${APP}/some/path`, link)).toBe(
      `${APP}/story?utm_source=reddit&utm_medium=social&utm_campaign=launch&utm_id=${LINK_ID}`,
    );
  });

  it("routes referral-bound links through /track and round-trips", () => {
    const url = buildCampaignUrl(APP, { ...link, refCode: "FRIEND2024" });
    expect(url.startsWith(`${APP}/track?ref=FRIEND2024&url=%2Fstory&`)).toBe(
      true,
    );
    const touch = extractTouch(new URL(url), undefined, OWN);
    expect(touch.landingPath).toBe("/story");
    expect(touch.refCode).toBe("FRIEND2024");
    expect(touch.source).toBe("reddit");
    expect(touch.linkId).toBe(LINK_ID);
  });

  it("only accepts same-site landing paths", () => {
    expect(normalizeDestinationPath("")).toBe("/");
    expect(normalizeDestinationPath("/en-US/story?x=1#y")).toBe("/en-US/story");
    expect(normalizeDestinationPath("//evil.com")).toBe(null);
    expect(normalizeDestinationPath("https://evil.com")).toBe(null);
    expect(normalizeDestinationPath("story")).toBe(null);
  });

  it("normalizes channel keys like touch extraction does", () => {
    expect(normalizeChannelKey(" Reddit ")).toBe("reddit");
    expect(normalizeChannelKey("ref:FRIEND2024")).toBe("ref:FRIEND2024");
  });

  it("flags crawlers and missing user agents as bots", () => {
    expect(isLikelyBot("Googlebot/2.1")).toBe(true);
    expect(isLikelyBot(undefined)).toBe(true);
    expect(
      isLikelyBot(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/131.0 Safari/537.36",
      ),
    ).toBe(false);
  });
});
