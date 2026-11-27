import { describe, expect, it } from "bun:test";

import { crawlLinkRel } from "./crawl-link-rel";

describe("crawlLinkRel", () => {
  it("nofollows app, variant, prefill and auth entry links", () => {
    for (const href of [
      "/en-GLOBAL/threads/incognito/new?skill=thea",
      "/en-GLOBAL/skill/thea__brilliant",
      "/en-GLOBAL/create/image?model=flux",
      "/en-GLOBAL/user/signup?skillId=thea",
      "/de-DE/user/signup",
      "/de-DE/user/login?next=%2Fde-DE%2Fthreads",
    ]) {
      expect(crawlLinkRel(href), href).toBe("nofollow");
    }
    expect(crawlLinkRel("/en-GLOBAL/user/signup", "noopener")).toBe(
      "noopener nofollow",
    );
  });

  it("leaves indexable pages followed", () => {
    for (const href of [
      "/en-GLOBAL/story/uncensored-ai",
      "/en-GLOBAL/skill/thea",
      "/en-GLOBAL/create/image",
      "/en-GLOBAL/models/gpt-5",
      "/en-GLOBAL/user/referral",
      "/en-GLOBAL/user/signups-guide",
    ]) {
      expect(crawlLinkRel(href), href).toBeUndefined();
    }
  });
});
