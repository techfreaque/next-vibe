/**
 * Lifecycle copy - every user-journey email renders fully in every locale:
 * no unresolved {{params}}, no em/en dashes, no /tools links, honest dynamic
 * facts (refill date, models added since the last chat).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { describe, expect, it } from "vitest";

import {
  formatFreeCreditResetDate,
  getLifecycleCopy,
  type LifecycleCopy,
  newChatModelsSince,
} from "./emails";
import { LifecycleTemplate } from "./enum";

const LOCALES: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "es-ES",
  "fr-FR",
  "it-IT",
];
const USER_TEMPLATES = [
  LifecycleTemplate.FIRST_CHAT_PROMPTS,
  LifecycleTemplate.FIRST_CHAT_SKILLS,
  LifecycleTemplate.OUT_OF_CREDITS,
  LifecycleTemplate.WHATS_NEW,
  LifecycleTemplate.WIN_BACK,
  LifecycleTemplate.PAYMENT_FAILED,
  LifecycleTemplate.CUSTOMER_LIKES,
  LifecycleTemplate.CUSTOMER_BUILD_NEXT,
  LifecycleTemplate.LAPSED_WINBACK,
] as const;
const counts = {
  modelCount: 90,
  mainstreamCount: 50,
  openCount: 25,
  uncensoredCount: 15,
};
const NOW = new Date("2026-11-25T12:00:00Z");

function allText(copy: LifecycleCopy): string {
  return [
    copy.subject,
    copy.preview,
    copy.intro,
    ...copy.items.flatMap((i) => [i.title, i.body]),
    copy.body,
    copy.cta.text,
    copy.cta.path,
    copy.secondaryCta?.text ?? "",
    copy.secondaryCta?.path ?? "",
    copy.ps ?? "",
  ].join("\n");
}

describe("lifecycle user-journey copy", () => {
  const contexts = {
    none: {
      newModels: [],
      resetDate: "1 December",
      marketingOk: false,
      graceDate: "2 December",
    },
    newsletter: {
      newModels: [],
      resetDate: "1 December",
      marketingOk: true,
      graceDate: "2 December",
    },
    one: {
      newModels: [{ name: "Model A", content: "uncensored" as const }],
      resetDate: "1 December",
      marketingOk: false,
      graceDate: "2 December",
    },
    many: {
      newModels: ["A", "B", "C", "D", "E"].map((n) => ({
        name: `Model ${n}`,
        content: "mainstream" as const,
      })),
      resetDate: "1 December",
      marketingOk: true,
      graceDate: "2 December",
    },
  };

  for (const locale of LOCALES) {
    for (const template of USER_TEMPLATES) {
      for (const [label, ctx] of Object.entries(contexts)) {
        it(`${locale} ${template} (${label})`, () => {
          const copy = getLifecycleCopy(template, locale, counts, ctx);
          const text = allText(copy);
          expect(text).not.toContain("{{");
          expect(text).not.toMatch(/[–—]/);
          expect(text).not.toContain("/tools");
          expect(copy.subject.length).toBeGreaterThan(5);
          expect(copy.cta.text.length).toBeGreaterThan(2);
        });
      }
    }
  }

  it("what's new lists the newest models and counts the rest", () => {
    const copy = getLifecycleCopy(
      LifecycleTemplate.WHATS_NEW,
      "en-US",
      counts,
      contexts.many,
    );
    expect(copy.subject).toBe("5 new models since your last visit");
    expect(copy.items.map((i) => i.title)).toEqual([
      "Model A",
      "Model B",
      "Model C",
    ]);
    expect(copy.body).toContain("2 more");
  });

  it("plural forms: Polish few/many, English one/other", () => {
    const four = getLifecycleCopy(
      LifecycleTemplate.WHATS_NEW,
      "pl-PL",
      counts,
      {
        ...contexts.many,
        newModels: contexts.many.newModels.slice(0, 4),
      },
    );
    expect(four.subject).toBe("4 nowe modele od Twojej ostatniej wizyty");
    const five = getLifecycleCopy(
      LifecycleTemplate.WHATS_NEW,
      "pl-PL",
      counts,
      contexts.many,
    );
    expect(five.subject).toBe("5 nowych modeli od Twojej ostatniej wizyty");
  });

  it("out of credits is informational: credits page, plans link only with consent", () => {
    const off = getLifecycleCopy(
      LifecycleTemplate.OUT_OF_CREDITS,
      "en-US",
      counts,
      contexts.none,
    );
    expect(off.cta.path).toBe("/subscription/overview");
    expect(off.secondaryCta).toBeNull();
    expect(allText(off)).not.toMatch(/newsletter|\$\d/i);
    const on = getLifecycleCopy(
      LifecycleTemplate.OUT_OF_CREDITS,
      "en-US",
      counts,
      contexts.newsletter,
    );
    expect(on.secondaryCta?.path).toBe("/subscription/buy");
  });

  it("customer feedback asks reply to support and promise exactly the footer reward", () => {
    for (const template of [
      LifecycleTemplate.CUSTOMER_LIKES,
      LifecycleTemplate.CUSTOMER_BUILD_NEXT,
      LifecycleTemplate.LAPSED_WINBACK,
    ]) {
      const copy = getLifecycleCopy(template, "en-US", counts, contexts.many);
      expect(copy.cta.path.startsWith("mailto:")).toBe(true);
      expect(allText(copy)).toContain("800 credits");
      expect(allText(copy)).not.toMatch(/\/subscription\/buy|plan from|\$\d/i);
    }
  });

  it("refill date is the 1st of next month in the reader's language", () => {
    expect(formatFreeCreditResetDate(NOW, "en-US")).toBe("December 1");
    expect(formatFreeCreditResetDate(NOW, "de-DE")).toBe("1. Dezember");
    expect(formatFreeCreditResetDate(NOW, "fr-FR")).toBe("1er décembre");
    expect(formatFreeCreditResetDate(NOW, "it-IT")).toBe("1° dicembre");
    expect(
      formatFreeCreditResetDate(new Date("2026-12-31T23:00:00Z"), "en-GLOBAL"),
    ).toBe("January 1");
  });

  it("new models since a date are unique, text-only, filtered by availability", () => {
    const all = newChatModelsSince(new Date("2026-07-01T00:00:00Z"), null);
    expect(new Set(all.map((m) => m.name)).size).toBe(all.length);
    expect(newChatModelsSince(new Date("2100-01-01T00:00:00Z"), null)).toEqual(
      [],
    );
    expect(
      newChatModelsSince(new Date("2026-07-01T00:00:00Z"), new Set()),
    ).toEqual([]);
  });
});
