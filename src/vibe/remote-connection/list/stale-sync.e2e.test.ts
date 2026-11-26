import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import {
  authAtlas,
  getAtlasFixture,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { remoteConnections } from "../db";
import { scopedTranslation } from "./i18n";

describe("Last successful connection sync", () => {
  const e2e = useE2E("instances/connection-sync-status");
  e2e.it(
    "opens a fixture connection and shows the localized sync instant",
    async (fixtures) => {
      const { page, baseUrl, cleanup, uniqueEmail } = fixtures;
      const connectionId = randomUUID();
      const userIds: string[] = [];
      cleanup(async () => {
        await db
          .delete(remoteConnections)
          .where(eq(remoteConnections.id, connectionId));
        for (const id of userIds) await deleteTestUser(id);
      });
      const owner = await createTestUser(uniqueEmail("offline-peer"));
      expect(owner.success).toBe(true);
      if (!owner.success) return;
      userIds.push(owner.data.user.id);
      const identifier = "offline-fixture";
      const lastSyncedAt = new Date("2025-02-03T10:45:00Z");
      await db.insert(remoteConnections).values({
        id: connectionId,
        userId: owner.data.user.id,
        instanceId: identifier,
        remoteUrl: "http://127.0.0.1:1",
        token: "offline-test-fixture",
        leadId: owner.data.user.leadId,
        isReverseEntry: true,
        lastSyncedAt,
        syncScope: {
          memories: false,
          documents: false,
          skills: false,
          favorites: false,
          threads: false,
        },
      });
      const auth = await authAtlas(fixtures, owner.data.user);
      const response = await getAtlasFixture(
        baseUrl + "/api/en-US/vibe/remote-connection/list",
        {},
        auth,
      );
      expect(response.status).toBe(200);
      const data: {
        data: {
          connections: Array<{ instanceId: string; lastSyncedAt: string }>;
        };
      } = await response.json();
      expect(
        data.data.connections.find((row) => row.instanceId === identifier)
          ?.lastSyncedAt,
      ).toBe(lastSyncedAt.toISOString());
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        await fixtures.goto("/tools/remote-connections", locale);
        const at = await page.evaluate(
          ({ tag, iso }) =>
            new Date(iso).toLocaleString(tag, { timeZoneName: "short" }),
          { tag: locale, iso: lastSyncedAt.toISOString() },
        );
        const { t } = scopedTranslation.scopedT(locale);
        await page
          .getByText(t("widget.health.overdue"), { exact: true })
          .first()
          .waitFor();
        const timestamp = page
          .getByText(at, { exact: true })
          .filter({ visible: true });
        expect(await timestamp.count()).toBe(1);
        const guide = page.getByRole("button", {
          name: t("widget.cloud.connectAnother"),
        });
        expect(await guide.getAttribute("aria-expanded")).toBe("false");
        await page.setViewportSize({ width: 390, height: 844 });
        const location = await page
          .getByText(identifier, { exact: true })
          .filter({ visible: true })
          .first()
          .boundingBox();
        expect(
          location && location.y >= 0 && location.y + location.height < 844,
        ).toBe(true);
        await saveAdminViewMatrix(
          page,
          "instances",
          "connection-sync-verified-" + locale.split("-")[0],
        );
        await guide.click();
        expect(await guide.getAttribute("aria-expanded")).toBe("true");
        await page
          .getByText(t("widget.cloud.paidTitle"), { exact: true })
          .first()
          .waitFor();
        await guide.click();
        await page
          .getByRole("button", {
            name: t("widget.viewConnection", { instance: identifier }),
            exact: true,
          })
          .click();
        await page.waitForURL(
          (url) =>
            url.pathname.includes("remote-status") ||
            url.pathname.includes("connection-status") ||
            (url.pathname.endsWith("/GET") && !url.pathname.includes("/list/")),
        );
      }
    },
  );
});
