/**
 * E2E: public model pages + prefilled chat links.
 * - /models lists models by tier and filters by search
 * - /models/<slug> renders the fact sheet; its chat CTA carries ?q=
 * - /models/compare/<a>/<b> renders the side-by-side table
 * - /threads/<folder>/new?q=… pre-fills the composer once, then drops q
 * Every page fits a 390px phone without horizontal scroll.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import type { Locator, Page } from "playwright";
import { describe, expect } from "vitest";

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { TOUR_SKIPPED_KEY } from "next-vibe/agent/ai-stream/stream/widget/chat-ui/welcome-tour/tour-config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { until } from "next-vibe/agent/ai-stream/testing/e2e-chat";

import { getModelFacts, toModelSlug } from "./_shared/model-facts";
import { listMediaFacts } from "./_shared/model-media-facts";
import { scopedTranslation } from "./i18n";

const PHONE = { width: 390, height: 844 } as const;
const DESKTOP = { width: 1440, height: 900 } as const;

const MODEL = ChatModelId.CLAUDE_OPUS_5_5;
const OTHER = ChatModelId.GPT_6_ASTRA;
const LEGACY = ChatModelId.GPT_5;
/** Linked model for ?model= - unlikely to be anyone's default. */
const LINKED = ChatModelId.KIMI_K3_1_PRO;

function selectorTrigger(page: Page): Locator {
  return page.locator('button[data-tour][aria-haspopup="dialog"]').first();
}

const { t } = scopedTranslation.scopedT(defaultLocale);

async function expectNoOverflow(page: Page, label: string): Promise<void> {
  const [scrollWidth, clientWidth] = await page.evaluate<[number, number]>(
    "[document.documentElement.scrollWidth, document.documentElement.clientWidth]",
  );
  expect(scrollWidth, `${label}: horizontal overflow`).toBeLessThanOrEqual(
    clientWidth,
  );
}

async function expectNoPlaceholders(page: Page, label: string): Promise<void> {
  const bodyText = await page.locator("body").innerText();
  expect(bodyText, `${label}: raw {{placeholder}}`).not.toMatch(/\{\{\w+\}\}/);
}

describe("E2E: model pages", () => {
  const e2e = useE2E("models/pages");

  for (const viewport of [PHONE, DESKTOP]) {
    e2e.it(
      `model page renders the fact sheet at ${viewport.width}px`,
      async ({ page, gotoReady }) => {
        const facts = getModelFacts(MODEL);
        expect(facts).not.toBeNull();
        if (facts === null) {
          return;
        }
        await page.setViewportSize(viewport);
        const heading = page.locator("h1").first();
        await gotoReady(`/models/${toModelSlug(MODEL)}`, async () => {
          await heading.waitFor({ state: "visible" });
        });
        expect((await heading.innerText()).trim()).toBe(facts.name);

        const sheet = page.locator('[data-testid="model-facts"]');
        for (const key of ["lab", "tier", "price", "context", "providers"]) {
          await until(
            `fact row ${key}`,
            async () => (await sheet.locator(`[data-fact="${key}"]`).count()) === 1,
          );
        }
        expect(await sheet.locator('[data-fact="lab"]').innerText()).toContain(
          facts.labName,
        );

        const cta = page
          .getByRole("link", { name: t("model.chatCta", { model: facts.name }) })
          .first();
        const href = await cta.getAttribute("href");
        expect(href).not.toBeNull();
        const url = new URL(href ?? "", "http://x");
        expect(url.pathname).toMatch(/\/threads\/private\/new$/);
        expect(url.searchParams.get("q")).toBe(t("chatPrompt"));
        expect(url.searchParams.get("model")).toBe(MODEL);

        await expectNoPlaceholders(page, facts.slug);
        await expectNoOverflow(page, `${facts.slug} @${viewport.width}`);
      },
    );

    e2e.it(
      `compare page renders both models at ${viewport.width}px`,
      async ({ page, gotoReady }) => {
        const left = getModelFacts(MODEL);
        const right = getModelFacts(OTHER);
        expect(left !== null && right !== null).toBe(true);
        if (left === null || right === null) {
          return;
        }
        await page.setViewportSize(viewport);
        const table = page.locator('[data-testid="compare-table"]');
        await gotoReady(
          `/models/compare/${left.slug}/${right.slug}`,
          async () => {
            await table.waitFor({ state: "visible" });
          },
        );
        expect((await page.locator("h1").first().innerText()).trim()).toBe(
          t("compare.title", { a: left.name, b: right.name }),
        );
        const tableText = await table.innerText();
        expect(tableText).toContain(left.name);
        expect(tableText).toContain(right.name);
        expect(
          await table.locator('[data-fact="price"]').count(),
        ).toBe(1);

        await expectNoPlaceholders(page, "compare");
        await expectNoOverflow(page, `compare @${viewport.width}`);
      },
    );
  }

  e2e.it("index groups by tier and search filters", async ({ page, gotoReady }) => {
    await page.setViewportSize(PHONE);
    const search = page.locator("#models-search");
    await gotoReady("/models", async () => {
      await page.locator("[data-tier]").first().waitFor({ state: "visible" });
    });
    expect(await page.locator("[data-tier]").count()).toBeGreaterThanOrEqual(2);
    await expectNoOverflow(page, "index");

    const facts = getModelFacts(OTHER);
    expect(facts).not.toBeNull();
    if (facts === null) {
      return;
    }
    // Typing before hydration is wiped - retry until the filter applies.
    // Clear first: refilling an identical value fires no React onChange.
    await until("search filters to the model", async () => {
      await search.fill("");
      await search.fill(facts.name);
      const tiers = await page.locator("[data-tier]").count();
      const hit = await page
        .locator(`a[href$="/models/${facts.slug}"]`)
        .count();
      return hit > 0 && tiers === 1;
    });
    await search.fill("zz-no-such-model-zz");
    await until(
      "empty search hides every tier",
      async () => (await page.locator("[data-tier]").count()) === 0,
    );
    await expectNoOverflow(page, "index (filtered)");
  });

  e2e.it("legacy model page links its successor", async ({ page, gotoReady }) => {
    const facts = getModelFacts(LEGACY);
    expect(facts?.successor).toBeTruthy();
    if (facts === null || facts.successor === null) {
      return;
    }
    await gotoReady(`/models/${facts.slug}`, async () => {
      await page.locator("h1").first().waitFor({ state: "visible" });
    });
    const link = page.getByRole("link", {
      name: t("model.legacyCta", { successor: facts.successor.name }),
    });
    expect(await link.getAttribute("href")).toMatch(
      new RegExp(`/models/${facts.successor.slug}$`),
    );
  });

  e2e.it("media model page renders facts and a Generate CTA", async ({
    page,
    gotoReady,
  }) => {
    const media = listMediaFacts().find((facts) => facts.type === "image");
    expect(media).toBeTruthy();
    if (media === undefined) {
      return;
    }
    await gotoReady(`/models/${media.slug}`, async () => {
      await page.locator("h1").first().waitFor({ state: "visible" });
    });
    expect(await page.locator('[data-fact="price"]').count()).toBe(1);
    const cta = page.getByRole("link", {
      name: t("media.generateCta", { model: media.name }),
    });
    expect(await cta.first().getAttribute("href")).toMatch(
      new RegExp(
        `/tools/${media.toolAlias}\\?(model|modelId|voiceId)=${media.modelId}$`,
      ),
    );
    await expectNoOverflow(page, "media model page");
  });

  e2e.it("unknown model is a 404", async ({ page, baseUrl }) => {
    const response = await page.goto(
      `${baseUrl}/${defaultLocale}/models/not-a-real-model`,
    );
    expect(response?.status()).toBe(404);
  });

  e2e.it(
    "?q= pre-fills the composer once and leaves the URL",
    async ({ page, context, gotoReady }) => {
      await context.addInitScript((key: string) => {
        localStorage.setItem(key, "true");
      }, TOUR_SKIPPED_KEY);
      const prompt = `prefill check ${Date.now()}`;
      const composer = page.locator('[data-hydrated] textarea[name="prompt"]');
      await gotoReady(
        `/threads/incognito/new?q=${encodeURIComponent(prompt)}`,
        async () => {
          await composer.waitFor({ state: "visible", timeout: 30_000 });
        },
      );
      await until(
        "composer pre-filled",
        async () => (await composer.inputValue()) === prompt,
      );
      await until(
        "q stripped from the URL",
        async () => !new URL(page.url()).searchParams.has("q"),
      );
      expect(new URL(page.url()).pathname).toMatch(/\/threads\/incognito\/new$/);
    },
    120_000,
  );

  e2e.it(
    "?model= selects the model in the composer, then leaves the URL",
    async ({ page, context, gotoReady }) => {
      await context.addInitScript((key: string) => {
        localStorage.setItem(key, "true");
      }, TOUR_SKIPPED_KEY);
      const facts = getModelFacts(LINKED);
      expect(facts).not.toBeNull();
      if (facts === null) {
        return;
      }
      const trigger = selectorTrigger(page);
      await gotoReady(`/threads/incognito/new?model=${LINKED}`, async () => {
        await trigger.locator("span.truncate + span").first().waitFor();
      });
      await until(
        "trigger shows the linked model",
        async () => (await trigger.innerText()).includes(facts.name),
      );
      await until(
        "model stripped from the URL",
        async () => !new URL(page.url()).searchParams.has("model"),
      );
    },
    120_000,
  );

  e2e.it(
    "?model= with an unknown id keeps the current model",
    async ({ page, context, gotoReady }) => {
      await context.addInitScript((key: string) => {
        localStorage.setItem(key, "true");
      }, TOUR_SKIPPED_KEY);
      const trigger = selectorTrigger(page);
      const label = trigger.locator("span.truncate + span").first();
      await gotoReady("/threads/incognito/new", async () => {
        await label.waitFor();
      });
      const before = (await label.innerText()).trim();
      await gotoReady("/threads/incognito/new?model=not-a-model", async () => {
        await label.waitFor();
      });
      await until(
        "model stripped from the URL",
        async () => !new URL(page.url()).searchParams.has("model"),
      );
      expect((await label.innerText()).trim()).toBe(before);
    },
    120_000,
  );

  e2e.it("sitemap.xml is valid and lists model pages", async ({ page, baseUrl }) => {
    const response = await page.request.get(`${baseUrl}/sitemap.xml`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    const xml = await response.text();
    expect(xml).toContain(
      `/${defaultLocale}/models/${toModelSlug(MODEL)}</loc>`,
    );
    expect(xml).toContain('hreflang="x-default"');
    expect(xml).not.toContain("/threads/");
    await page.goto(`${baseUrl}/${defaultLocale}/models`);
    const parseError = await page.evaluate(
      (source: string) =>
        new DOMParser()
          .parseFromString(source, "application/xml")
          .getElementsByTagName("parsererror").length,
      xml,
    );
    expect(parseError).toBe(0);
  });
});
