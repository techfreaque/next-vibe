import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { scopedTranslation } from "../../../identity/middleware/lead-id/i18n";
import { handleHttpProxy } from "../../../realtime/server/http-proxy";

describe("Admin document failure recovery", () => {
  const e2e = useE2E("admin-document-recovery");
  e2e.it(
    "renders an upstream JSON failure in the requested language and reloads the original document",
    async (fixtures) => {
      let healthy = false;
      const upstream = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        fetch: () =>
          healthy
            ? new Response("<!doctype html><h1>Fixture workspace</h1>", {
                headers: { "Content-Type": "text/html" },
              })
            : Response.json(
                { message: "Private fixture diagnostic" },
                {
                  status: 500,
                  headers: {
                    "Retry-After": "5",
                    "Content-Disposition": "attachment",
                  },
                },
              ),
      });
      fixtures.cleanup(async () => {
        await upstream.stop(true);
      });
      const proxy = Bun.serve({
        hostname: "127.0.0.1",
        port: 0,
        fetch: (req) =>
          handleHttpProxy(req, {
            nextPort: upstream.port ?? 0,
            logger: createEndpointLogger(false, "en-US"),
            isShuttingDown: () => false,
          }),
      });
      fixtures.cleanup(async () => {
        await proxy.stop(true);
      });
      const { page } = fixtures;
      const downloads: string[] = [];
      page.on("download", (download) =>
        downloads.push(download.suggestedFilename()),
      );
      await page.setViewportSize({ width: 390, height: 844 });
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        healthy = false;
        const t = scopedTranslation.scopedT(locale).t;
        const marker = "private-fixture-query";
        const url = new URL(
          `/${locale}/tools?cat=tax&probe=${marker}`,
          proxy.url,
        ).href;
        const failure = await page.goto(url);
        expect(failure?.status()).toBe(500);
        expect(failure?.headers()["content-type"]).toContain("text/html");
        expect(failure?.headers()["content-disposition"]).toBeUndefined();
        expect(failure?.headers()["retry-after"]).toBe("5");
        expect(await page.locator("html").getAttribute("lang")).toBe(
          locale.slice(0, 2),
        );
        await page
          .getByRole("heading", { name: t("toolsUnavailable.title") })
          .waitFor();
        const html = await failure?.text();
        expect(html).not.toContain("Private fixture diagnostic");
        expect(html).not.toContain(marker);
        const reload = page.getByRole("link", {
          name: t("toolsUnavailable.reload"),
          exact: true,
        });
        expect(await reload.getAttribute("href")).toBe("");
        await page.keyboard.press("Tab");
        expect(
          await reload.evaluate(
            (element) => element === element.ownerDocument.activeElement,
          ),
        ).toBe(true);
        expect(
          await reload.evaluate(
            (element) => getComputedStyle(element).outlineStyle,
          ),
        ).toBe("solid");
        for (const [theme, background, action] of [
          ["light", "rgb(247, 248, 251)", "rgb(34, 81, 224)"],
          ["dark", "rgb(12, 15, 23)", "rgb(53, 101, 233)"],
        ] as const) {
          await page.emulateMedia({ colorScheme: theme });
          expect(
            await page
              .locator("body")
              .evaluate((element) => getComputedStyle(element).backgroundColor),
          ).toBe(background);
          expect(
            await reload.evaluate(
              (element) => getComputedStyle(element).backgroundColor,
            ),
          ).toBe(action);
          expect(
            await reload.evaluate(
              (element) => getComputedStyle(element).textDecorationLine,
            ),
          ).toBe("none");
          const bounds = await reload.boundingBox();
          expect(bounds?.height ?? 0).toBeGreaterThanOrEqual(44);
        }
        await reload.blur();
        if (process.env["ERP_DOCUMENT_VISUALS"] === "1") {
          await saveAdminViewMatrix(
            page,
            "workspace",
            `upstream-recovery-verified-${locale.slice(0, 2)}`,
          );
          await page.setViewportSize({ width: 390, height: 844 });
        }
        healthy = true;
        const [restored] = await Promise.all([
          page.waitForResponse(
            (reply) =>
              reply.request().isNavigationRequest() && reply.url() === url,
          ),
          reload.click(),
        ]);
        expect(restored.status()).toBe(200);
        await page
          .getByRole("heading", { name: "Fixture workspace" })
          .waitFor();
      }
      expect(downloads).toEqual([]);
    },
  );
});
