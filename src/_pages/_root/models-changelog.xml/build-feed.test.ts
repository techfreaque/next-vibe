import { describe, expect, test } from "bun:test";

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { ModelChangelogEvent } from "next-vibe/agent/models/model-changelog/types";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { MODEL_CHANGELOG_EVENTS } from "@/generated/model-changelog";

import {
  buildChangelogPageView,
  buildModelHistoryView,
} from "../../models/_shared/model-changelog";
import { buildModelChangelogFeed } from "./build-feed";

/** Every provider key configured. */
const ALL: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: true,
  voice: true,
  braveSearch: true,
  kagiSearch: true,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  nanoGPT: true,
  scrappey: true,
  openAiImages: true,
  openAiStt: true,
  replicate: true,
  falAi: true,
  modelsLab: true,
  edenAiStt: true,
  deepgram: true,
  openAiTts: true,
  edenAiTts: true,
  elevenlabs: true,
  unbottledSystem: false,
  unbottledForce: false,
};

const EVENTS: ModelChangelogEvent[] = [
  {
    date: "2026-11-21",
    commit: "aaa",
    type: "legacy",
    modelId: "old-model",
    modelType: "text",
    name: "Old & Model",
    content: "mainstream",
    successorId: "new-model",
    successorName: "New Model",
  },
  {
    date: "2026-11-21",
    commit: "aaa",
    type: "added",
    modelId: "new-model",
    modelType: "text",
    name: "New Model",
    content: "uncensored",
  },
  {
    date: "2026-10-02",
    commit: "bbb",
    type: "repriced",
    modelId: "new-model",
    modelType: "text",
    name: "New Model",
    content: "uncensored",
    priceChanges: [{ metric: "input", from: 1, to: 0.5 }],
  },
];

describe("model changelog view", () => {
  test("groups by month newest first and counts stats", () => {
    const view = buildChangelogPageView("en-GLOBAL", ALL, EVENTS);
    expect(view.months.map((m) => m.key)).toEqual(["2026-11", "2026-10"]);
    expect(view.stats).toEqual({ added: 1, legacy: 1, repriced: 1 });
    expect(view.latestDate).toBe("2026-11-21");
    const repriced = view.months[1]?.entries[0];
    expect(repriced?.summary).toBe("Input price down 50%");
  });

  test("translates in every locale", () => {
    const locales: readonly CountryLanguage[] = [
      "de-DE",
      "pl-PL",
      "fr-FR",
      "it-IT",
      "es-ES",
    ];
    for (const locale of locales) {
      const view = buildChangelogPageView(locale, ALL, EVENTS);
      const added = view.months[0]?.entries[1];
      expect(added?.badge).not.toBe("New");
      expect(added?.summary.length).toBeGreaterThan(0);
      expect(added?.summary).not.toContain("{{");
    }
  });

  test("model history includes own events and the models it replaced", () => {
    const history = buildModelHistoryView(
      "en-GLOBAL",
      "text",
      "new-model",
      ALL,
      EVENTS,
    );
    expect(history.entries.map((e) => e.type)).toEqual([
      "replaces",
      "added",
      "repriced",
    ]);
    expect(history.entries[0]?.link?.name).toBe("Old & Model");
  });
});

describe("model changelog RSS feed", () => {
  test("is well-formed RSS 2.0 with escaped, dated items", () => {
    const xml = buildModelChangelogFeed(
      "en-GLOBAL",
      ALL,
      "https://example.test/",
      EVENTS,
    );
    expect(xml.startsWith(`<?xml version="1.0" encoding="UTF-8"?>`)).toBe(true);
    expect(xml).toContain(`<rss version="2.0"`);
    expect(xml).toContain(
      `<atom:link href="https://example.test/models-changelog.xml?locale=en-GLOBAL" rel="self" type="application/rss+xml"/>`,
    );
    expect(xml).toContain("<title>Moved to legacy: Old &amp; Model</title>");
    expect(xml).toContain("<pubDate>Sat, 21 Nov 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain(
      "https://example.test/en-GLOBAL/models/changelog#2026-11-21-legacy-old-model",
    );
    expect(xml.match(/<item>/g)).toHaveLength(3);
    expect(xml).not.toContain("—");
    expect(xml).not.toContain("/tools/");
  });

  test("the generated history is non-empty and newest first", () => {
    expect(MODEL_CHANGELOG_EVENTS.length).toBeGreaterThan(0);
    const dates = MODEL_CHANGELOG_EVENTS.map((e) => e.date);
    expect(dates).toEqual(dates.toSorted().toReversed());
  });
});
