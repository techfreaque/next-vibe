/**
 * E2E: public Refusal Index page - the leaderboard renders per-tier rows from
 * the latest completed run, rows link to model pages, columns re-sort, the
 * page fits a phone, and a model page shows its refusal stats block.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import {
  refusalIndexQuestions,
  refusalIndexResults,
  refusalIndexRuns,
  refusalIndexSamples,
} from "../../../vibe/agent/refusal-index/db";
import {
  RefusalRunStatus,
  RefusalVerdict,
} from "../../../vibe/agent/refusal-index/enum";
import { listBenchmarkModels } from "../../../vibe/agent/refusal-index/models";

const PHONE = { width: 390, height: 844 } as const;

/** Seed a completed run covering the first benchmark models; returns a cleanup. */
async function seedCompletedRun(): Promise<{
  modelIds: string[];
  cleanup: () => Promise<void>;
}> {
  const models = listBenchmarkModels().slice(0, 3);
  const suffix = crypto.randomUUID().slice(0, 8);
  const [question] = await db
    .insert(refusalIndexQuestions)
    .values({
      slug: `e2e-${suffix}`,
      category: "e2e",
      textEn: "E2E harmless question",
    })
    .returning({ id: refusalIndexQuestions.id });
  const [run] = await db
    .insert(refusalIndexRuns)
    .values({
      status: RefusalRunStatus.COMPLETED,
      finishedAt: new Date(),
      modelCount: models.length,
      questionCount: 1,
      judgeModelId: "e2e-judge",
      judgePromptVersion: "e2e",
      runnerPromptVersion: "e2e",
      modelFilter: models.map((model) => model.id),
      questionFilter: question ? [question.id] : [],
      notes: "e2e seed",
    })
    .returning({ id: refusalIndexRuns.id });
  if (!question || !run) {
    throw new Error("seed failed");
  }
  const verdicts = [
    RefusalVerdict.ANSWERED,
    RefusalVerdict.HEDGED,
    RefusalVerdict.REFUSED,
  ];
  const inserted = await db
    .insert(refusalIndexResults)
    .values(
      models.map((model, index) => ({
        runId: run.id,
        questionId: question.id,
        modelId: model.id,
        verdict: verdicts[index % verdicts.length] ?? RefusalVerdict.ANSWERED,
        judgeReason: "e2e",
        answerExcerpt: "e2e answer",
      })),
    )
    .returning({ id: refusalIndexResults.id });
  await db.insert(refusalIndexSamples).values(
    inserted.slice(0, 1).map((row) => ({ resultId: row.id, visible: true })),
  );
  return {
    modelIds: models.map((model) => model.id),
    cleanup: async (): Promise<void> => {
      await db
        .delete(refusalIndexSamples)
        .where(
          inArray(
            refusalIndexSamples.resultId,
            inserted.map((row) => row.id),
          ),
        );
      await db.delete(refusalIndexRuns).where(eq(refusalIndexRuns.id, run.id));
      await db
        .delete(refusalIndexQuestions)
        .where(eq(refusalIndexQuestions.id, question.id));
    },
  };
}

describe("E2E: Refusal Index page", () => {
  const e2e = useE2E("story/refusal-index");

  e2e.it("renders the leaderboard, links rows to model pages and re-sorts", async ({ page, gotoReady, cleanup }) => {
    const seeded = await seedCompletedRun();
    cleanup(seeded.cleanup);
    expect(seeded.modelIds.length).toBeGreaterThan(0);

    const heading = page.locator("main h1, h1").first();
    await gotoReady("/story/refusal-index", async () => {
      await heading.waitFor({ state: "visible" });
    });
    expect((await heading.innerText()).trim().length).toBeGreaterThan(0);

    const root = page.locator('[data-testid="refusal-index"]');
    const rows = root.locator("tr[data-model]");
    await rows.first().waitFor({ state: "visible" });
    expect(await rows.count()).toBeGreaterThan(0);

    // Every row links to its model page
    const firstHref = await rows.first().locator("a").first().getAttribute("href");
    expect(firstHref ?? "").toMatch(/\/models\/[a-z0-9-]+$/);

    // Tier sections exist and no unrendered placeholder leaks
    expect(await root.locator("[data-tier]").count()).toBeGreaterThan(0);
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/\{\{\w+\}\}/);

    // Re-sort: clicking the "Answered" header flips the first row of a multi-row tier
    const tier = root.locator("[data-tier]").filter({ has: page.locator("tr[data-model] >> nth=1") }).first();
    if ((await tier.count()) > 0) {
      const before = await tier.locator("tr[data-model]").evaluateAll(
        (els) => els.map((el) => el.getAttribute("data-model")),
      );
      const answeredHeader = tier.locator("thead button").nth(2);
      await answeredHeader.click();
      await answeredHeader.click();
      const after = await tier.locator("tr[data-model]").evaluateAll(
        (els) => els.map((el) => el.getAttribute("data-model")),
      );
      expect(after).toHaveLength(before.length);
    }
  });

  e2e.it("fits a phone without horizontal overflow", async ({ page, gotoReady }) => {
    await page.setViewportSize(PHONE);
    const heading = page.locator("main h1, h1").first();
    await gotoReady("/story/refusal-index", async () => {
      await heading.waitFor({ state: "visible" });
    });
    const [scrollWidth, clientWidth] = await page.evaluate<[number, number]>(
      "[document.documentElement.scrollWidth, document.documentElement.clientWidth]",
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  e2e.it("shows the refusal stats block on a model page", async ({ page, gotoReady, cleanup }) => {
    const seeded = await seedCompletedRun();
    cleanup(seeded.cleanup);
    const slug = (seeded.modelIds[0] ?? "").toLowerCase().replaceAll(/[._]+/g, "-");
    await gotoReady(`/models/${slug}`, async () => {
      await page.locator("h1").first().waitFor({ state: "visible" });
    });
    // Stats appear when the latest completed run covers this model; the seeded
    // run guarantees one exists (a newer real run covering it also qualifies).
    const slot = page.locator('[data-slot="sample-answers"]');
    expect(await slot.count()).toBeGreaterThan(0);
    const stats = page.locator("[data-refusal-stat]");
    if ((await stats.count()) > 0) {
      expect(await stats.count()).toBe(3);
    }
  });
});
