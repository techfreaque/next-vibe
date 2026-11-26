import { mkdir } from "node:fs/promises";

import { DrizzleQueryError } from "drizzle-orm";
import { createEndpointLogger } from "next-vibe/logger/server";
import { NextRequest } from "next-vibe/ui/lib/request";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Response } from "playwright";
import { describe, expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { CATEGORY_REGISTRY } from "@/generated/categories/registry";

import { leadFailureResponse } from "../identity/middleware/lead-id";
import { scopedTranslation as leadMiddlewareTranslation } from "../identity/middleware/lead-id/i18n";
import { scopedTranslation } from "./i18n";

function navigationDetails(response: Response): {
  url: string;
  status: number;
  method: string;
  retryAfter: string | null;
  contentType: string | null;
  disposition: string | null;
  redirect: string | null;
  initiator: string | null;
} {
  const url = new URL(response.url());
  const headers = response.headers();
  const requested = response.request().redirectedFrom()?.url();
  const redirect = headers["location"];
  return {
    url: url.pathname + url.search,
    status: response.status(),
    method: response.request().method(),
    retryAfter: headers["retry-after"] ?? null,
    contentType: headers["content-type"] ?? null,
    disposition: headers["content-disposition"] ?? null,
    redirect: redirect ? new URL(redirect, url).pathname : null,
    initiator: requested ? new URL(requested).pathname : null,
  };
}

describe("AI administration landing navigation", () => {
  const e2e = useE2E("admin-ai-landing");

  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    e2e.it(
      `serves the AI landing as HTML at ${width}px without a download`,
      async (fixtures) => {
        const { page, baseUrl } = fixtures;
        const admin = await resolveTestAdminUser();
        await authAtlas(fixtures, admin);
        await fixtures.context.addCookies([
          {
            name: LEAD_ID_COOKIE_NAME,
            value: admin.leadId,
            url: baseUrl,
            httpOnly: true,
          },
        ]);
        await page.setViewportSize({ width, height });
        const requestedUrl = new URL("/en-US/tools?cat=ai", baseUrl).toString();
        const landing = CATEGORY_REGISTRY.find(({ key }) => key === "ai");
        expect(landing).toBeDefined();
        if (!landing) {
          return;
        }
        const proof = ".tmp/admin-platform-v2/ai-landing-proof";
        await mkdir(proof, { recursive: true });
        const downloads: string[] = [];
        const responses: ReturnType<typeof navigationDetails>[] = [];
        page.on("download", (download) => {
          downloads.push(new URL(download.url()).pathname);
        });
        page.on("response", (response) => {
          if (
            response.request().resourceType() === "document" ||
            response.headers()["content-disposition"]?.includes("attachment")
          ) {
            responses.push(navigationDetails(response));
          }
        });

        try {
          const locale = "en-US";
          const { t: fallbackT } = leadMiddlewareTranslation.scopedT(locale);
          // Reproduce DB pool exhaustion with the real middleware response,
          // without disrupting Atlas or relying on a timing race.
          await page.route(
            requestedUrl,
            async (route) => {
              const request = new NextRequest(route.request().url(), {
                headers: { accept: "text/html" },
              });
              const failure = leadFailureResponse(
                request,
                createEndpointLogger(false, locale),
                new DrizzleQueryError(
                  "insert fixture",
                  [],
                  new Error("Query read timeout"),
                ),
                performance.now(),
                locale,
                "create",
                "provision",
              );
              await route.fulfill({
                status: failure.status,
                headers: Object.fromEntries(failure.headers),
                body: await failure.text(),
              });
            },
            { times: 1 },
          );

          const unavailable = await page.goto(requestedUrl, {
            waitUntil: "load",
          });
          expect(unavailable && navigationDetails(unavailable)).toMatchObject({
            url: "/en-US/tools?cat=ai",
            status: 503,
            method: "GET",
            retryAfter: "5",
            contentType: expect.stringContaining("text/html"),
            disposition: null,
            redirect: null,
          });
          await page
            .getByRole("heading", { name: fallbackT("toolsUnavailable.title") })
            .waitFor();
          await page.screenshot({ path: `${proof}/unavailable-${width}.png` });
          const retry = page.getByRole("link", {
            name: fallbackT("toolsUnavailable.reload"),
          });
          const [response] = await Promise.all([
            page.waitForResponse(
              (res) =>
                res.url() === requestedUrl &&
                res.request().isNavigationRequest(),
            ),
            retry.click(),
          ]);
          expect(navigationDetails(response)).toMatchObject({
            url: "/en-US/tools?cat=ai",
            status: 200,
            contentType: expect.stringContaining("text/html"),
            disposition: null,
            redirect: null,
            initiator: null,
          });
          const { t } = scopedTranslation.scopedT("en-US");
          await page
            .getByRole("heading", {
              name: landing.label,
              exact: true,
            })
            .last()
            .waitFor();
          await page
            .getByText(t("admin.destinations"), { exact: true })
            .last()
            .waitFor();
          expect(page.url()).toBe(requestedUrl);
          expect(downloads).toEqual([]);
          await page.screenshot({ path: `${proof}/recovered-${width}.png` });
        } finally {
          console.log(JSON.stringify({ width, responses, downloads }));
        }
      },
    );
  }
});
