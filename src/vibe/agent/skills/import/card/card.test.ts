/**
 * Character card import/export: decoding (JSON V1/V2/V3, PNG chunks), mapping
 * onto the shared import shape, and an export → import round trip.
 */

import { crc32, deflateSync } from "node:zlib";

import { describe, expect, it } from "bun:test";

import { buildCharacterCard, cardFileName } from "../../[id]/export/card";
import { SkillImportPlatform } from "../enum";
import { buildSkillContent, importSourceKey } from "../parsers";
import {
  CARD_MAX_BASE64_CHARS,
  CARD_MAX_BYTES,
  CARD_MAX_JSON_BYTES,
} from "./limits";
import {
  cardSourceId,
  cardToCharacter,
  decodeCard,
  parseCardJson,
} from "./parser";
import { readCardPng, validatePngAvatar } from "./png";

const V2 = {
  spec: "chara_card_v2",
  spec_version: "2.0",
  data: {
    name: "Seraphina",
    description: "{{char}} guards the forest glade and heals {{user}}.",
    personality: "Kind, protective, quietly stubborn.",
    scenario: "{{user}} wakes up wounded in her glade.",
    first_mes: "*You wake up in a clearing.* Easy now, {{user}}.",
    mes_example: "<START>\n{{user}}: Who are you?\n{{char}}: A friend.",
    creator_notes: "Classic ST demo card.",
    system_prompt: "{{original}}\nWrite in third person.",
    post_history_instructions: "",
    alternate_greetings: ["Hello again."],
    tags: ["Fantasy", "fantasy", " Healer "],
    creator: "Tavern Community",
    character_version: "1.0",
    extensions: { talkativeness: "0.5" },
    character_book: { entries: [{ keys: ["glade"], content: "Hidden lore" }] },
  },
};

function chunk(type: string, body: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(body.length);
  const typeAndBody = Buffer.concat([Buffer.from(type, "latin1"), body]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(typeAndBody));
  return Buffer.concat([length, typeAndBody, checksum]);
}

function pngWithText(
  chunks: Array<{ keyword: string; text: string }>,
  {
    width = 1,
    height = 1,
    raster = Buffer.alloc(4),
    extra = [],
  }: {
    width?: number;
    height?: number;
    raster?: Buffer;
    extra?: Buffer[];
  } = {},
): Buffer {
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const texts = chunks.map(({ keyword, text }) =>
    chunk("tEXt", Buffer.from(`${keyword}\0${text}`, "latin1")),
  );
  return Buffer.concat([
    signature,
    chunk("IHDR", header),
    ...texts,
    ...extra,
    chunk("IDAT", deflateSync(raster)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const b64 = (text: string): string =>
  Buffer.from(text, "utf8").toString("base64");

describe("parseCardJson", () => {
  it("reads V2 cards from the data wrapper", () => {
    const data = parseCardJson(JSON.stringify(V2));
    expect(data?.name).toBe("Seraphina");
    expect(data?.personality).toBe("Kind, protective, quietly stubborn.");
  });

  it("reads flat V1 cards", () => {
    const data = parseCardJson(
      JSON.stringify({
        name: "Old Card",
        description: "V1 body",
        first_mes: "Hi",
      }),
    );
    expect(data?.name).toBe("Old Card");
    expect(data?.first_mes).toBe("Hi");
  });

  it("reads V3 cards and tolerates wrong field types", () => {
    const data = parseCardJson(
      JSON.stringify({
        spec: "chara_card_v3",
        spec_version: "3.0",
        data: { name: "Nova", description: 42, tags: "not-an-array" },
      }),
    );
    expect(data?.name).toBe("Nova");
    expect(data?.description).toBeNull();
    expect(data?.tags).toBeNull();
  });

  it("strips a UTF-8 BOM", () => {
    expect(parseCardJson(`﻿${JSON.stringify(V2)}`)?.name).toBe("Seraphina");
  });

  it("rejects JSON that is not a card", () => {
    expect(parseCardJson('{"hello":"world"}')).toBeNull();
    expect(parseCardJson("[1,2,3]")).toBeNull();
    expect(parseCardJson("not json")).toBeNull();
  });

  it("never copies prototype keys from card JSON", () => {
    const data = parseCardJson(
      '{"name":"Quiet","__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}',
    );
    expect(data && Object.hasOwn(data, "__proto__")).not.toBe(true);
    expect(data && Object.hasOwn(data, "constructor")).not.toBe(true);
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
  });

  it("ignores executable extensions, lorebooks and avatar URLs", () => {
    const data = parseCardJson(
      JSON.stringify({
        spec: "chara_card_v3",
        data: {
          name: "Quiet",
          extensions: { script: "ignored" },
          assets: [{ uri: "https://example.invalid/avatar.png" }],
          character_book: { entries: [{ content: "hidden" }] },
        },
      }),
    );
    expect(data?.name).toBe("Quiet");
    for (const key of [
      "__proto__",
      "constructor",
      "extensions",
      "assets",
      "character_book",
    ]) {
      expect(data && Object.hasOwn(data, key)).toBe(false);
    }
    expect(data && cardToCharacter(data)?.avatarSourceUrl).toBeNull();
  });
});

describe("decodeCard", () => {
  it("accepts pasted JSON text", () => {
    const result = decodeCard(JSON.stringify(V2));
    expect(result.ok && result.card.format).toBe("json");
  });

  it("accepts a base64 JSON upload", () => {
    const result = decodeCard(b64(JSON.stringify(V2)));
    expect(result.ok && result.card.data.name).toBe("Seraphina");
    expect(result.ok && result.card.image).toBeNull();
  });

  it("reads the card but keeps only raster chunks for the avatar", async () => {
    const png = pngWithText([
      { keyword: "chara", text: b64(JSON.stringify(V2)) },
    ]);
    expect(readCardPng(png)?.cards.has("chara")).toBe(true);
    const result = decodeCard(png.toString("base64"));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.card.format).toBe("png");
      expect(result.card.data.name).toBe("Seraphina");
      const avatar = result.card.image
        ? await validatePngAvatar(result.card.image)
        : null;
      expect(avatar?.equals(pngWithText([]))).toBe(true);
    }
  });

  it("prefers ccv3 and falls back to chara when ccv3 is broken", () => {
    const v3 = { spec: "chara_card_v3", data: { name: "Seraphina V3" } };
    const both = pngWithText([
      { keyword: "chara", text: b64(JSON.stringify(V2)) },
      { keyword: "ccv3", text: b64(JSON.stringify(v3)) },
    ]);
    const preferred = decodeCard(both.toString("base64"));
    expect(preferred.ok && preferred.card.data.name).toBe("Seraphina V3");

    const broken = pngWithText([
      { keyword: "chara", text: b64(JSON.stringify(V2)) },
      { keyword: "ccv3", text: "@@@" },
    ]);
    const fallback = decodeCard(broken.toString("base64"));
    expect(fallback.ok && fallback.card.data.name).toBe("Seraphina");
  });

  it("accepts a data URL prefix", () => {
    const png = pngWithText([
      { keyword: "chara", text: b64(JSON.stringify(V2)) },
    ]);
    const result = decodeCard(
      `data:image/png;base64,${png.toString("base64")}`,
    );
    expect(result.ok).toBe(true);
  });

  it("reports a PNG without card data", () => {
    const png = pngWithText([{ keyword: "Comment", text: "just art" }]);
    expect(decodeCard(png.toString("base64"))).toEqual({
      ok: false,
      reason: "noCard",
    });
  });

  it("reports garbage as invalid", () => {
    expect(decodeCard(b64("hello there"))).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("caps upload size and decoded JSON size independently", () => {
    const text = JSON.stringify({
      name: "Card",
      description: "a".repeat(CARD_MAX_JSON_BYTES),
    });
    expect(decodeCard(text)).toEqual({ ok: false, reason: "tooLarge" });
    expect(decodeCard(b64(text))).toEqual({ ok: false, reason: "tooLarge" });
    expect(decodeCard("A".repeat(CARD_MAX_BASE64_CHARS + 1))).toEqual({
      ok: false,
      reason: "tooLarge",
    });
    expect(
      decodeCard(Buffer.alloc(CARD_MAX_BYTES + 1).toString("base64")),
    ).toEqual({ ok: false, reason: "tooLarge" });
  });

  it("limits PNG chunks and pixel count and rejects truncated PNGs", () => {
    const cards = [{ keyword: "chara", text: b64(JSON.stringify(V2)) }];
    const extra = Array.from({ length: 2048 }, () =>
      chunk("tEXt", Buffer.alloc(0)),
    );
    const valid = pngWithText(cards);
    for (const png of [
      pngWithText(cards, { extra }),
      pngWithText(cards, { width: 4096, height: 4096 }),
      valid.subarray(0, -1),
    ]) {
      expect(decodeCard(png.toString("base64"))).toEqual({
        ok: false,
        reason: "invalid",
      });
    }
  });

  it("ignores compressed metadata and accepts uncompressed international text", () => {
    const text = b64(JSON.stringify(V2));
    const compressed = chunk(
      "iTXt",
      Buffer.concat([
        Buffer.from([99, 104, 97, 114, 97, 0, 1, 0, 0, 0]),
        deflateSync(Buffer.from(text)),
      ]),
    );
    const plain = chunk("iTXt", Buffer.from(`chara\0\0\0\0\0${text}`));
    expect(
      decodeCard(pngWithText([], { extra: [compressed] }).toString("base64")),
    ).toEqual({ ok: false, reason: "noCard" });
    const decoded = decodeCard(
      pngWithText([], { extra: [plain] }).toString("base64"),
    );
    expect(decoded.ok && decoded.card.data.name).toBe("Seraphina");
  });

  it("discards artwork whose raster exceeds the image budget", async () => {
    const png = pngWithText(
      [{ keyword: "chara", text: b64(JSON.stringify(V2)) }],
      { raster: Buffer.alloc(128) },
    );
    const decoded = readCardPng(png);
    expect(decoded).not.toBeNull();
    if (decoded) {
      expect(await validatePngAvatar(decoded.avatar)).toBeNull();
    }
  });
});

describe("cardToCharacter", () => {
  it("maps card fields onto the import shape", () => {
    const data = parseCardJson(JSON.stringify(V2));
    const character = data ? cardToCharacter(data) : null;
    expect(character).not.toBeNull();
    if (!character) {
      return;
    }
    expect(character.platform).toBe(SkillImportPlatform.CHARACTER_CARD);
    expect(character.sourceUrl).toBe("");
    expect(character.creatorName).toBe("Tavern Community");
    expect(character.greeting).toBe(
      "*You wake up in a clearing.* Easy now, {{user}}.",
    );
    expect(character.tags).toEqual(["Fantasy", "Healer"]);
    expect(character.definition).toContain("Personality:\nKind");
    expect(character.definition).toContain("Scenario:");
    expect(character.definition).toContain("Example dialogue");
    expect(character.definition).toContain(
      "Card instructions:\nWrite in third person.",
    );
    expect(character.definition).not.toContain("{{original}}");
    expect(character.definition).not.toContain("Hidden lore");

    const content = buildSkillContent(
      character,
      "Imported from a character card",
    );
    expect(content.systemPrompt).toContain("You are Seraphina.");
    expect(content.systemPrompt).toContain("heals the user");
    expect(content.systemPrompt).toContain("## Opening message");
    expect(content.importedFields).toEqual([
      "name",
      "greeting",
      "description",
      "definition",
      "tags",
    ]);
  });

  it("gives the same card the same dedupe key", () => {
    const a = parseCardJson(JSON.stringify(V2));
    const b = parseCardJson(
      JSON.stringify({ ...V2, data: { ...V2.data, tags: ["other"] } }),
    );
    expect(a && b && cardSourceId(a) === cardSourceId(b)).toBe(true);
    const changed = parseCardJson(
      JSON.stringify({ ...V2, data: { ...V2.data, personality: "Cold." } }),
    );
    expect(a && changed && cardSourceId(a) !== cardSourceId(changed)).toBe(
      true,
    );
    expect(importSourceKey(SkillImportPlatform.CHARACTER_CARD, "abc")).toBe(
      "card:abc",
    );
  });
});

describe("export card", () => {
  const source = {
    name: "Seraphina",
    tagline: "Forest guardian",
    description: "Heals travellers.",
    systemPrompt: "You are Seraphina. Stay in character.",
    categoryLabel: "Roleplay",
    creatorName: "Tavern Community",
    skillUrl: "https://unbottled.ai/en-GLOBAL/skill/seraphina",
  };

  it("builds a V2 card that our importer reads back", () => {
    const card = buildCharacterCard(source, `Skill page: ${source.skillUrl}`);
    expect(card.spec).toBe("chara_card_v2");
    expect(card.data.description).toBe(source.systemPrompt);
    expect(card.data.creator_notes).toBe(
      `Forest guardian\n\nHeals travellers.\n\nSkill page: ${source.skillUrl}`,
    );
    expect(card.data.extensions.unbottled.skillUrl).toBe(source.skillUrl);

    const decoded = decodeCard(JSON.stringify(card));
    expect(decoded.ok && decoded.card.data.name).toBe("Seraphina");
    expect(decoded.ok && decoded.card.data.description).toBe(
      source.systemPrompt,
    );
  });

  it("falls back to unbottled.ai as creator and skips the page link when private", () => {
    const card = buildCharacterCard(
      { ...source, creatorName: null, skillUrl: null, tagline: null },
      null,
    );
    expect(card.data.creator).toBe("unbottled.ai");
    expect(card.data.creator_notes).toBe("Heals travellers.");
    expect(card.data.extensions.unbottled.skillUrl).toBeNull();
  });

  it("makes safe file names", () => {
    expect(cardFileName("Señorita Ñandú!", "x")).toBe(
      "senorita-nandu.card.json",
    );
    expect(cardFileName("🔥🔥", "Il-Dottore_2")).toBe("il-dottore-2.card.json");
  });
});
