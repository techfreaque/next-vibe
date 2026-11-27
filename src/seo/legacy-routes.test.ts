import { describe, expect, it } from "bun:test";

import { legacyRedirectPath, pathAfterLocale } from "./legacy-routes";

const guest = { storyHome: true };

describe("legacy route redirects", () => {
  it("sends bare locale roots to the canonical locale's story page", () => {
    expect(legacyRedirectPath("de-US", "", guest)).toBe("/de-DE/story");
    expect(legacyRedirectPath("en-US", "", guest)).toBe("/en-GLOBAL/story");
    expect(legacyRedirectPath("en-IN", "", guest)).toBe("/en-IN/story");
    expect(legacyRedirectPath("de-DE", "", guest)).toBe("/de-DE/story");
    expect(legacyRedirectPath("pl-GLOBAL", "", guest)).toBe("/pl-PL/story");
    // Signed-in users: the locale page sends them to chat.
    expect(legacyRedirectPath("de-US", "", { storyHome: false })).toBeNull();
  });

  it("maps pre-/story pages to the canonical locale", () => {
    expect(legacyRedirectPath("de-PL", "about-us", guest)).toBe(
      "/de-DE/story/about-us",
    );
    expect(legacyRedirectPath("en-GLOBAL", "terms-of-service", guest)).toBe(
      "/en-GLOBAL/story/terms-of-service",
    );
    expect(legacyRedirectPath("en-PL", "imprint", guest)).toBe(
      "/en-GLOBAL/story/imprint",
    );
    expect(legacyRedirectPath("de-DE", "privacy-policy", guest)).toBe(
      "/de-DE/story/privacy-policy",
    );
    expect(legacyRedirectPath("en-US", "contact", guest)).toBe(
      "/en-GLOBAL/help",
    );
    expect(legacyRedirectPath("en-DE", "story/referral", guest)).toBe(
      "/en-GLOBAL/story/earn",
    );
    expect(
      legacyRedirectPath("en-PL", "story/docs/patterns/database.md", guest),
    ).toBe("/en-GLOBAL/story/framework");
    expect(legacyRedirectPath("en-GLOBAL", "v1/media/x/y", guest)).toBe(
      "/en-GLOBAL/docs/api",
    );
    expect(legacyRedirectPath("de-US", "story/blog/i-got-fired", guest)).toBe(
      "/de-DE/story/blog",
    );
  });

  it("keeps the visitor's locale for app pages", () => {
    expect(legacyRedirectPath("de-US", "login", guest)).toBe(
      "/de-US/user/login",
    );
    expect(legacyRedirectPath("en-DE", "chat", guest)).toBe(
      "/en-DE/threads/incognito/new",
    );
    expect(legacyRedirectPath("en-DE", "reset-password", guest)).toBe(
      "/en-DE/user/reset-password",
    );
    expect(
      legacyRedirectPath("en-GLOBAL", "user/(account)/referral", guest),
    ).toBe("/en-GLOBAL/user/referral");
    expect(
      legacyRedirectPath("en-GLOBAL", "user/%28account%29/referral", guest),
    ).toBe("/en-GLOBAL/user/referral");
  });

  it("leaves current pages alone", () => {
    for (const rest of [
      "story",
      "story/about-us",
      "user/login",
      "user/referral",
      "not-found",
      "models/gpt-5",
      "story/blog/best-uncensored-llm",
      "threads/incognito/new",
    ]) {
      expect(legacyRedirectPath("en-GLOBAL", rest, guest)).toBeNull();
    }
  });

  it("strips the locale and slashes", () => {
    expect(pathAfterLocale("/de-DE/about-us/", "de-DE")).toBe("about-us");
    expect(pathAfterLocale("/de-DE", "de-DE")).toBe("");
    expect(pathAfterLocale("/de-DE/", "de-DE")).toBe("");
  });
});
