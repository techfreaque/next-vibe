import { eq } from "drizzle-orm";
import { makeHeadlessContext } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import { runEndpointByName } from "next-vibe/execute-tool/repository/run-endpoint-by-name";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { userApiKeys } from "./db";
import definition from "./definition";
import { scopedTranslation } from "./i18n";

const locale = "en-US";
const apiPath = "/api/en-US/api-keys";
const browserExample = "local-test-placeholder";

describe("Account access keys in Atlas admin", () => {
  const e2e = useE2E("api-keys/admin");

  e2e.it("uses scoped access keys with empty, populated, retry and revoke flows", async (fixture) => {
    const { baseUrl, cleanup, page } = fixture;
    const { t } = scopedTranslation.scopedT(locale);
    const account = await createTestUser(fixture.uniqueEmail("keys-admin"));
    expect(account.success).toBe(true);
    if (!account.success) {
      return;
    }
    const user = {
      ...account.data.user,
      roles: [UserPermissionRole.ADMIN, ...account.data.user.roles],
    };
    cleanup(async () => {
      await db.delete(userApiKeys).where(eq(userApiKeys.userId, user.id));
      await deleteTestUser(user.id);
    });
    await db.insert(userRoles).values({ userId: user.id, role: UserPermissionRole.ADMIN });
    await db.insert(paymentTransactions).values({
      userId: user.id,
      status: PaymentStatus.SUCCEEDED,
      amount: "1.00",
      currency: "EUR",
    });
    const header = await authAtlas(fixture, user);
    const http = atlasRequest(header.authorization.slice("Bearer ".length), header.cookie);
    const origin = new URL(baseUrl).origin;
    const isKeyList = (target: URL): boolean =>
      target.origin === origin && target.pathname === apiPath;
    await page.route(isKeyList, async (route) => {
      if (route.request().method() !== "GET") {
        await route.fallback();
        return;
      }
      await route.continue({
        headers: {
          ...route.request().headers(),
          authorization: header.authorization,
        },
      });
    });
    const url = `${baseUrl}/${locale}/tools/api-keys`;
    const name = "Fixture browser integration";
    const nameField = page.getByRole("textbox", { name: t("widget.nameLabel"), exact: true });
    const empty = page.getByText(t("widget.empty"), { exact: true });
    const listSchema = z.object({
      success: z.literal(true),
      data: definition.GET.responseSchema,
    });
    const onlyIdentity = z.object({
      success: z.literal(true),
      data: z.object({ id: z.uuid(), keyPrefix: z.string() }),
    });

    const emptyHttp = await http.get(apiPath);
    expect(emptyHttp.ok).toBe(true);
    expect(listSchema.parse(await emptyHttp.json()).data.keys).toEqual([]);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await empty.waitFor({ timeout: 60_000 });
    if (process.env["ADMIN_API_KEY_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "accountSettings", "access-keys-empty-en");
    }

    let grants = 0;
    await page.route(isKeyList, async (route) => {
      if (route.request().method() !== "POST") {
        await route.fallback();
        return;
      }
      grants += 1;
      if (grants !== 1) {
        await route.fulfill({ status: 409, json: { success: false, message: "Fixture already created" } });
        return;
      }

      // Grant through authenticated Atlas HTTP outside the browser. The
      // browser and its Playwright trace only receive a fixed non-key example.
      const granted = await http.post(apiPath, { data: { name } }).catch(() => null);
      const identity = granted?.ok
        ? onlyIdentity.safeParse(await granted.json())
        : null;
      if (!identity?.success) {
        await route.fulfill({ status: 503, json: { success: false, message: "Fixture grant unavailable" } });
        return;
      }
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          data: { ...identity.data.data, key: browserExample },
        },
      });
    });

    await nameField.fill(name);
    await nameField.press("Enter");
    await page.getByText(browserExample, { exact: true }).waitFor();
    await page.getByRole("button", { name: t("widget.dismiss"), exact: true }).click();
    expect(await page.getByText(browserExample, { exact: true }).count()).toBe(0);
    await page.getByText(name, { exact: true }).waitFor();
    expect(grants).toBe(1);
    const list = listSchema.parse(await (await http.get(apiPath)).json());
    expect(list.data.keys).toHaveLength(1);
    const [key] = list.data.keys;
    expect(key?.name).toBe(name);
    if (!key) {
      return;
    }
    if (process.env["ADMIN_API_KEY_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "accountSettings", "access-keys-populated-en");
    }

    const revoke = page.getByRole("button", { name: t("widget.revokeNamed", { name }), exact: true });
    await revoke.focus();
    await revoke.press("Enter");
    const dialog = page.getByRole("alertdialog");
    await dialog.getByRole("button", { name: t("widget.cancel"), exact: true }).click();
    await dialog.waitFor({ state: "hidden" });
    expect((await db.select({ revokedAt: userApiKeys.revokedAt }).from(userApiKeys).where(eq(userApiKeys.id, key.id)))[0]?.revokedAt).toBeNull();
    await revoke.click();
    const deletion = page.waitForResponse((reply) => reply.request().method() === "DELETE" &&
      new URL(reply.url()).pathname === `${apiPath}/${key.id}`);
    await dialog.getByRole("button", { name: t("widget.revoke"), exact: true }).click();
    expect((await deletion).ok()).toBe(true);
    await empty.waitFor();
    expect((await db.select({ revokedAt: userApiKeys.revokedAt }).from(userApiKeys).where(eq(userApiKeys.id, key.id)))[0]?.revokedAt).toBeInstanceOf(Date);

    let failRead = true;
    await page.route(isKeyList, async (route) => {
      if (failRead && route.request().method() === "GET") {
        await route.fulfill({ status: 503, json: { success: false, message: "Fixture unavailable" } });
      } else {
        await route.fallback();
      }
    });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.getByText(t("widget.loadFailed"), { exact: true }).waitFor();
    if (process.env["ADMIN_API_KEY_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "accountSettings", "access-keys-error-en");
    }
    failRead = false;
    await page.getByRole("button", { name: t("widget.retry"), exact: true }).click();
    await empty.waitFor();

    const cli = {
      user,
      locale,
      logger: createEndpointLogger(false, locale),
      platform: Platform.CLI,
      toolExecutionContext: makeHeadlessContext(undefined, undefined, "UTC"),
    } satisfies Pick<
      Parameters<typeof runEndpointByName>[0],
      "user" | "locale" | "logger" | "platform" | "toolExecutionContext"
    >;
    const command = await runEndpointByName({
      ...cli,
      toolName: "api-keys_POST",
      input: { name: "Fixture CLI integration" },
    });
    const identity = z.object({ id: z.uuid() }).safeParse(command.success ? command.data : null);
    expect(identity.success).toBe(true);
    if (!identity.success) {
      return;
    }
    const disabled = await runEndpointByName({
      ...cli,
      toolName: "api-keys_id_DELETE",
      urlPathParams: { id: identity.data.id },
    });
    expect(disabled.success).toBe(true);
  });
});
