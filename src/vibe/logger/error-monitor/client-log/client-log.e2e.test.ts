/**
 * E2E: client error reporting.
 *  - Real trigger: a client-side logger.error (here: the visit beacon failing)
 *    is shipped to the server.
 *  - The /tools form reports an error by hand.
 *  - A failed endpoint call is persisted to error_logs carrying the page
 *    route and the x-request-id the browser sent (joins client + server rows).
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { and, eq, like, sql } from "drizzle-orm";
import { describe, expect } from "vitest";
import { z } from "zod";

import { REQUEST_ID_HEADER_NAME as REQUEST_ID_HEADER } from "@/env/constants";
import trackingEndpoints from "@/leads/tracking/definition";

import { db } from "../../../database";
import { useE2E } from "../../../tooling/testing/e2e/harness";
import type { LoggerMetadata } from "../../types";
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

  e2e.it("a failed endpoint call lands in error_logs with its route and the request id the browser sent", async ({ page, goto, cleanup }) => {
    // Break the visit beacon and remember the correlation id it carried
    const tracking = trackingEndpoints.POST.path.join("/");
    const sentRequestIds: string[] = [];
    await page.route(
      (url) => url.pathname.endsWith(`/${tracking}`),
      (route) => {
        if (route.request().method() !== "POST") {
          return route.fallback();
        }
        const requestId = route.request().headers()[REQUEST_ID_HEADER];
        if (requestId) {
          sentRequestIds.push(requestId);
        }
        return route.abort();
      },
    );

    await goto(STORY_PAGE);

    // The report is fire-and-forget: poll the table until a row carries one
    // of the ids the browser actually put on the wire.
    let found: ErrorLogMatch | undefined;
    const deadline = Date.now() + 60_000;
    while (!found && Date.now() < deadline) {
      found = await findLogByRequestIds(sentRequestIds);
      if (!found) {
        await page.waitForTimeout(500);
      }
    }
    expect(sentRequestIds.length, "beacon never fired").toBeGreaterThan(0);
    expect(found, `no error_logs row for ${sentRequestIds.join(",")}`).toBeDefined();
    if (!found) return;
    const row = found;
    cleanup(async () => {
      await db.delete(errorLogs).where(eq(errorLogs.id, row.id));
    });

    // A client report, naming the endpoint that failed
    expect(row.message.startsWith("[client] ")).toBe(true);
    expect(row.message).toContain(tracking);
    // Route: sanitized pathname of the page the customer was on
    expect(metaField(row.metadata, "route")?.endsWith(STORY_PAGE)).toBe(true);
    expect(metaField(row.metadata, "platform")).toBe("web");
    // Request id: matches the x-request-id header -> joins to server rows
    expect(sentRequestIds).toContain(metaField(row.metadata, "requestId"));
    // Who hit it: stamped server-side from the session, never from the client
    expect(metaField(row.metadata, "isPublic")).toBe(true);
  });
});

const STORY_PAGE = "/story/newsletter";

interface ErrorLogMatch {
  id: string;
  message: string;
  metadata: LoggerMetadata[] | null;
}

async function findLogByRequestIds(
  requestIds: string[],
): Promise<ErrorLogMatch | undefined> {
  for (const requestId of requestIds) {
    const [row] = await db
      .select({
        id: errorLogs.id,
        message: errorLogs.message,
        metadata: errorLogs.metadata,
      })
      .from(errorLogs)
      .where(
        and(
          like(errorLogs.message, "[client] %"),
          sql`${errorLogs.metadata}::text like ${`%${requestId}%`}`,
        ),
      )
      .limit(1);
    if (row) {
      return row;
    }
  }
  return undefined;
}

/** The context fields this suite reads off a client report's metadata records. */
const reportContextSchema = z.object({
  route: z.string().nullable().optional(),
  platform: z.string().optional(),
  requestId: z.string().optional(),
  isPublic: z.boolean().optional(),
});
type ReportContext = z.infer<typeof reportContextSchema>;

/** First record in the row's metadata that carries `key`. */
function metaField<TKey extends keyof ReportContext>(
  metadata: LoggerMetadata[] | null,
  key: TKey,
): ReportContext[TKey] | undefined {
  for (const m of metadata ?? []) {
    const parsed = reportContextSchema.safeParse(m);
    if (parsed.success && parsed.data[key] !== undefined) {
      return parsed.data[key];
    }
  }
  return undefined;
}
