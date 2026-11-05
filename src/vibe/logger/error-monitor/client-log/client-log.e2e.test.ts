/**
 * E2E: client error reporting.
 *  - Real trigger: a client-side logger.error (here: the visit beacon failing)
 *    is shipped to the server.
 *  - The /tools form reports an error by hand.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { like } from "drizzle-orm";
import { describe, expect } from "vitest";

import trackingEndpoints from "@/leads/tracking/definition";

import { db } from "../../../database";
import { useE2E } from "../../../tooling/testing/e2e/harness";
import { errorLogs } from "../db";
import clientLogEndpoints from "./definition";

const endpoint = clientLogEndpoints.POST;

async function removeLogs(messagePrefix: string): Promise<void> {
  await db
    .delete(errorLogs)
    .where(like(errorLogs.message, `[client] ${messagePrefix}%`));
}

describe("E2E: client error reporting", () => {
  const e2e = useE2E("vibe/logger/error-monitor/client-log");

  e2e.it("reports an error entered in the form", async ({ open, cleanup }) => {
    const message = `e2e-client-log-${Date.now()}`;
    cleanup(() => removeLogs(message));

    const form = await open(endpoint);
    await form.fill({ level: "warn", message });
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
    if (!result.response.success) return;
    expect(result.response.data.ok).toBe(true);
  });

  e2e.it("blocks a report without a message", async ({ open }) => {
    const form = await open(endpoint);
    await form.fill({ level: "error" });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toContain("message");
  });

  e2e.it("a client-side logger error is shipped to the server", async ({ page, goto, capture, cleanup }) => {
    // Break the visit beacon so the page's own logger reports the failure
    const tracking = trackingEndpoints.POST.path.join("/");
    await page.route(
      (url) => url.pathname.endsWith(`/${tracking}`),
      (route) =>
        route.request().method() === "POST"
          ? route.abort()
          : route.fallback(),
    );

    const call = await capture(endpoint, () => goto("/story/newsletter"), 60_000);
    const body = call.requestBody;
    expect(body).toMatchObject({ level: "error" });
    const reported =
      typeof body === "object" && body !== null && !Array.isArray(body) && !(body instanceof Date)
        ? body["message"]
        : undefined;
    expect(typeof reported).toBe("string");
    if (typeof reported === "string") {
      cleanup(() => removeLogs(reported));
    }
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
  });
});
