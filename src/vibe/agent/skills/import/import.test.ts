/**
 * Character link import: URL detection, page parsing and load strategy,
 * run against saved real pages (trimmed, no live network calls).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "bun:test";

import { SkillImportPlatform } from "./enum";
import type { FetchedPage, PageFetcher } from "./parsers";
import {
  buildSkillContent,
  detectCharacterLink,
  importSourceKey,
  isBlockedPage,
  loadCharacter,
  parseCharacterAiPage,
  parseTalkiePage,
} from "./parsers";

const fixture = (name: string): string =>
  readFileSync(join(import.meta.dir, "fixtures", name), "utf8");

const CAI_COPYABLE = fixture("character-ai-copyable.html");
const CAI_PRIVATE_DEF = fixture("character-ai-private-definition.html");
const TALKIE = fixture("talkie.html");
const CAI_BLOCK = fixture("character-ai-cloudflare-block.html");

describe("detectCharacterLink", () => {
  it("recognizes Character.AI link forms", () => {
    expect(
      detectCharacterLink("https://character.ai/character/GgU-v9j5/il-dottore"),
    ).toEqual({
      platform: SkillImportPlatform.CHARACTER_AI,
      fetchUrl: "https://character.ai/character/GgU-v9j5",
      sourceIdHint: null,
    });
    const externalId = "59U1aj5rpIZ7VBfNXpRD9omQLf8DiPQfh02Pop7akB0";
    for (const url of [
      `https://character.ai/chat/${externalId}`,
      `https://c.ai/c/${externalId}`,
      `https://beta.character.ai/chat?char=${externalId}`,
      `character.ai/chat/${externalId}?source=share`,
    ]) {
      expect(detectCharacterLink(url)).toEqual({
        platform: SkillImportPlatform.CHARACTER_AI,
        fetchUrl: `https://character.ai/chat/${externalId}`,
        sourceIdHint: externalId,
      });
    }
  });

  it("recognizes Talkie link forms, with and without locale", () => {
    for (const url of [
      "https://www.talkie-ai.com/chat/adrian-248871183229041",
      "https://talkie-ai.com/es/chat/adrian-248871183229041",
      "https://www.talkie-ai.com/chat/profile/adrian-248871183229041",
    ]) {
      expect(detectCharacterLink(url)).toEqual({
        platform: SkillImportPlatform.TALKIE,
        fetchUrl: "https://www.talkie-ai.com/chat/adrian-248871183229041",
        sourceIdHint: "248871183229041",
      });
    }
  });

  it("rejects unsupported and look-alike links", () => {
    for (const url of [
      "",
      "not a url",
      "https://example.com/character/abcdef12",
      "https://character.ai.evil.com/character/abcdef12",
      "https://character.ai/",
      "https://character.ai/search?q=x",
      "https://www.talkie-ai.com/discover",
      "https://www.talkie-ai.com/chat/no-id-here",
      "ftp://character.ai/character/abcdef12",
    ]) {
      expect(detectCharacterLink(url)).toBeNull();
    }
  });
});

describe("parseCharacterAiPage", () => {
  it("reads public data and the public definition", () => {
    const parsed = parseCharacterAiPage(CAI_COPYABLE);
    expect(parsed).not.toBeNull();
    expect(parsed?.platform).toBe(SkillImportPlatform.CHARACTER_AI);
    expect(parsed?.sourceId).toBe(
      "59U1aj5rpIZ7VBfNXpRD9omQLf8DiPQfh02Pop7akB0",
    );
    expect(parsed?.sourceUrl).toBe("https://character.ai/character/GgU-v9j5");
    expect(parsed?.name).toBe("Il Dottore");
    expect(parsed?.title).toContain("Harbinger");
    expect(parsed?.description).toContain("Fatui Harbingers");
    expect(parsed?.definition).toContain("Il Dottore");
    expect(parsed?.avatarSourceUrl).toBe(
      "https://characterai.io/i/400/static/avatars/uploaded/2023/5/16/7vVrS3bEalEevifRccUlf6Mgt-R2IvOBDWJ-FJNVjHs.webp",
    );
    expect(parsed?.creatorName).toBe("L41nn");
    expect(parsed?.creatorUrl).toBe("https://character.ai/profile/L41nn");
  });

  it("never imports a definition the creator kept private", () => {
    const parsed = parseCharacterAiPage(CAI_PRIVATE_DEF);
    expect(parsed?.name).toBe("TF 141");
    expect(parsed?.definition).toBeNull();
    expect(parsed?.creatorName).toBe("Taskmaster_Sodu");
  });

  it("returns null for pages without character data", () => {
    expect(parseCharacterAiPage(CAI_BLOCK)).toBeNull();
    expect(parseCharacterAiPage(TALKIE)).toBeNull();
    expect(parseCharacterAiPage("<html></html>")).toBeNull();
  });
});

describe("parseTalkiePage", () => {
  it("reads name, greeting, description, avatar and creator", () => {
    const parsed = parseTalkiePage(TALKIE);
    expect(parsed).not.toBeNull();
    expect(parsed?.platform).toBe(SkillImportPlatform.TALKIE);
    expect(parsed?.sourceId).toBe("248871183229041");
    expect(parsed?.sourceUrl).toBe(
      "https://www.talkie-ai.com/chat/adrian-248871183229041",
    );
    expect(parsed?.name).toBe("Adrian 💸");
    expect(parsed?.greeting).toContain("You’re late");
    expect(parsed?.description).toContain("Adrian is your boss");
    expect(parsed?.definition).toBeNull();
    expect(parsed?.avatarSourceUrl).toStartWith("https://");
    expect(parsed?.creatorName).toBe("•°Elenh°•");
    expect(parsed?.creatorUrl).toContain("talkie-ai.com/profile/");
  });

  it("returns null for other pages", () => {
    expect(parseTalkiePage(CAI_COPYABLE)).toBeNull();
    expect(parseTalkiePage(CAI_BLOCK)).toBeNull();
  });
});

describe("isBlockedPage", () => {
  it("detects anti-bot walls", () => {
    expect(isBlockedPage(200, CAI_BLOCK)).toBe(true);
    expect(isBlockedPage(403, "")).toBe(true);
    expect(isBlockedPage(200, CAI_COPYABLE)).toBe(false);
  });
});

describe("buildSkillContent", () => {
  it("builds a persona prompt with every public field", () => {
    const parsed = parseTalkiePage(TALKIE);
    expect(parsed).not.toBeNull();
    if (!parsed) {
      return;
    }
    const content = buildSkillContent(parsed, "Imported from Talkie");
    expect(content.name).toBe("Adrian 💸");
    expect(content.tagline.length).toBeGreaterThanOrEqual(2);
    expect(content.tagline.length).toBeLessThanOrEqual(500);
    expect(content.description.length).toBeGreaterThanOrEqual(10);
    expect(content.description.length).toBeLessThanOrEqual(500);
    expect(content.systemPrompt).toContain("You are Adrian 💸");
    expect(content.systemPrompt).toContain("## Opening message");
    expect(content.systemPrompt).toContain("You’re late");
    expect(content.importedFields).toEqual([
      "name",
      "avatar",
      "greeting",
      "description",
    ]);
  });

  it("fills {{char}} / {{user}} placeholders and falls back on empty data", () => {
    const content = buildSkillContent(
      {
        platform: SkillImportPlatform.CHARACTER_AI,
        sourceId: "abc",
        sourceUrl: "https://character.ai/chat/abc",
        name: "Mira",
        title: null,
        greeting: "Hi {{user}}, I am {{char}}.",
        description: null,
        definition: "{{char}}: hello\n{{user}}: hi",
        tags: ["Fantasy"],
        avatarSourceUrl: null,
        creatorName: null,
        creatorUrl: null,
      },
      "Imported from Character.AI",
    );
    expect(content.systemPrompt).toContain("Hi the user, I am Mira.");
    expect(content.systemPrompt).toContain("Mira: hello");
    expect(content.systemPrompt).not.toContain("{{");
    expect(content.tagline).toBe("Imported from Character.AI");
    expect(content.description).toBe("Hi the user, I am Mira.");
    expect(content.importedFields).toEqual([
      "name",
      "greeting",
      "definition",
      "tags",
    ]);
  });
});

describe("importSourceKey", () => {
  it("prefixes per platform", () => {
    expect(importSourceKey(SkillImportPlatform.CHARACTER_AI, "x")).toBe(
      "cai:x",
    );
    expect(importSourceKey(SkillImportPlatform.TALKIE, "1")).toBe("talkie:1");
  });
});

describe("loadCharacter", () => {
  const caiLink = {
    platform: SkillImportPlatform.CHARACTER_AI,
    fetchUrl: "https://character.ai/character/GgU-v9j5",
    sourceIdHint: null,
  };
  const talkieLink = {
    platform: SkillImportPlatform.TALKIE,
    fetchUrl: "https://www.talkie-ai.com/chat/adrian-248871183229041",
    sourceIdHint: "248871183229041",
  };
  const serve =
    (page: FetchedPage | null): PageFetcher =>
    async (): Promise<FetchedPage | null> =>
      page;
  const neverCalled: PageFetcher = async (): Promise<FetchedPage | null> => {
    expect.unreachable("anti-bot fetcher must not run");
    return null;
  };

  it("uses the direct page when it carries data", async () => {
    const result = await loadCharacter(
      caiLink,
      serve({ status: 200, html: CAI_COPYABLE }),
      neverCalled,
    );
    expect(result.ok && result.character.name).toBe("Il Dottore");
  });

  it("falls back to the anti-bot fetcher on a block", async () => {
    const result = await loadCharacter(
      talkieLink,
      serve({ status: 403, html: "<title>Access Denied</title>" }),
      serve({ status: 200, html: TALKIE }),
    );
    expect(result.ok && result.character.sourceId).toBe("248871183229041");
  });

  it("reports blocked / notConfigured / notFound clearly", async () => {
    const blocked = { status: 200, html: CAI_BLOCK };
    expect(await loadCharacter(caiLink, serve(blocked), serve(blocked))).toEqual(
      { ok: false, reason: "blocked" },
    );
    expect(await loadCharacter(caiLink, serve(blocked), null)).toEqual({
      ok: false,
      reason: "notConfigured",
    });
    expect(
      await loadCharacter(
        caiLink,
        serve({ status: 404, html: "<html>Not found</html>" }),
        neverCalled,
      ),
    ).toEqual({ ok: false, reason: "notFound" });
    expect(await loadCharacter(caiLink, serve(null), null)).toEqual({
      ok: false,
      reason: "network",
    });
  });
});
