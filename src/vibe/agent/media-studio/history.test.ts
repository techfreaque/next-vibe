import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { expect, it } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import { createE2EFreeGuest } from "../ai-stream/testing/e2e-credit-user";
import { db } from "next-vibe/database";
import { sql } from "drizzle-orm";

import { studioGenerations } from "./db";
import {
  decodeHistoryCursor,
  recentStudioHistory,
  studioHistoryPage,
} from "./history";
import { MediaStudioRepository } from "./repository";

it("persists async progress for its owner and keeps other visitors and kinds isolated", async () => {
  const guest = await createE2EFreeGuest("studio-history");
  const other = await createE2EFreeGuest("studio-history-other");
  const publicUser = (leadId: string): JwtPayloadType => ({
    isPublic: true,
    leadId,
    roles: [UserPermissionRole.PUBLIC],
  });
  const user = publicUser(guest.leadId);
  try {
    const result = await MediaStudioRepository.run({
      save: true,
      user,
      kind: "video",
      model: "test",
      title: "Blue boat",
      settings: { prompt: "Blue boat" },
      locale: defaultLocale,
      logger: createEndpointLogger(false, defaultLocale),
      generate: async ({ progress }) => {
        // Nothing is listed before the run passes its checks.
        expect(await recentStudioHistory(user, "video")).toEqual([]);
        for (const status of ["running", "saving"] as const) {
          await progress?.(status);
          expect((await recentStudioHistory(user, "video"))[0]?.status).toBe(
            status,
          );
        }
        return success({ videoUrl: "/test/boat.mp4", creditCost: 2.6 });
      },
    });
    expect(result.success).toBe(true);
    expect(await recentStudioHistory(user)).toMatchObject([
      {
        title: "Blue boat",
        settings: { prompt: "Blue boat" },
        status: "completed",
        url: "/test/boat.mp4",
        credits: 2.6,
      },
    ]);
    const page = await studioHistoryPage(user, { page: 1, limit: 12 });
    expect(page.totalCount).toBe(1);
    expect(page.items[0]).toMatchObject({
      source: "studio",
      model: "test",
      settings: { prompt: "Blue boat" },
      threadId: null,
    });
    expect(
      (await studioHistoryPage(user, { page: 2, limit: 12 })).items,
    ).toEqual([]);
    expect(await recentStudioHistory(user, "image")).toEqual([]);
    expect(await recentStudioHistory(publicUser(other.leadId))).toEqual([]);
  } finally {
    await guest.remove();
    await other.remove();
  }
});

it("leaves no history card when a run is refused for missing credits", async () => {
  const { t } = creditsScopedTranslation.scopedT(defaultLocale);
  const guest = await createE2EFreeGuest("studio-history-refused");
  const user: JwtPayloadType = {
    isPublic: true,
    leadId: guest.leadId,
    roles: [UserPermissionRole.PUBLIC],
  };
  try {
    const result = await MediaStudioRepository.run({
      save: true,
      user,
      kind: "image",
      model: "test",
      title: "Too expensive",
      settings: { prompt: "Too expensive" },
      locale: defaultLocale,
      logger: createEndpointLogger(false, defaultLocale),
      generate: async () =>
        fail({
          message: t("errors.insufficientCredits", { cost: 1000 }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        }),
    });
    expect(result.success).toBe(false);
    expect(await recentStudioHistory(user)).toEqual([]);
  } finally {
    await guest.remove();
  }
});

it("walks the whole history with load-more cursors, also inside one millisecond", async () => {
  const guest = await createE2EFreeGuest("studio-history-cursor");
  const user: JwtPayloadType = {
    isPublic: true,
    leadId: guest.leadId,
    roles: [UserPermissionRole.PUBLIC],
  };
  try {
    // 25 rows, a second apart, plus 5 sharing one millisecond (different
    // microseconds): the cursor only carries milliseconds.
    await db.insert(studioGenerations).values(
      Array.from({ length: 25 }, (_, i) => ({
        leadId: guest.leadId,
        kind: "image" as const,
        model: "test",
        title: `Row ${i}`,
        status: "completed" as const,
        url: `/test/${i}.png`,
        createdAt: new Date(Date.UTC(2026, 0, 1, 12, 0, i)),
      })),
    );
    for (let i = 0; i < 5; i++) {
      await db.insert(studioGenerations).values({
        leadId: guest.leadId,
        kind: "image",
        model: "test",
        title: `Same ms ${i}`,
        status: "completed",
        url: `/test/ms-${i}.png`,
        createdAt: sql`'2026-01-01 11:00:00.123'::timestamp + ${`${i * 100} microseconds`}::interval`,
      });
    }
    const offsetPage = await studioHistoryPage(user, { page: 1, limit: 30 });
    expect(offsetPage.items).toHaveLength(30);
    expect(offsetPage.nextCursor).toBeNull();

    const seen: string[] = [];
    let cursor: string | undefined;
    for (let round = 0; round < 10; round++) {
      const page = await studioHistoryPage(user, {
        kind: "image",
        page: 1,
        limit: 7,
        cursor,
      });
      seen.push(...page.items.map((item) => item.id));
      expect(page.totalCount).toBe(30);
      if (!page.nextCursor) {
        break;
      }
      expect(decodeHistoryCursor(page.nextCursor)).toBeDefined();
      cursor = page.nextCursor;
    }
    expect(seen).toEqual(offsetPage.items.map((item) => item.id));
    expect(new Set(seen).size).toBe(30);
    expect(decodeHistoryCursor("not-a-cursor")).toBeUndefined();
  } finally {
    await guest.remove();
  }
});
