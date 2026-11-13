/**
 * E2E: story subpages smoke — every public marketing / legal / blog page
 * renders its H1, throws no uncaught errors (the harness fails on any
 * pageerror), leaks no raw {{placeholders}}, and fits a 390px phone with no
 * horizontal scroll.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";

import { BLOG_POST_DATES } from "./blog/posts-meta";

const PHONE = { width: 390, height: 844 } as const;

const PAGES: readonly string[] = [
  "/story/about-us",
  "/story/blog",
  "/story/careers",
  "/story/framework",
  "/story/self-host",
  "/story/build-a-skill",
  "/story/earn",
  "/story/partners",
  "/story/refusal-index",
  "/story/invest",
  "/story/imprint",
  "/story/privacy-policy",
  "/story/terms-of-service",
  "/story/newsletter",
  "/story/newsletter/unsubscribe",
  ...Object.keys(BLOG_POST_DATES).map((slug) => `/story/blog/${slug}`),
];

describe("E2E: story subpages", () => {
  const e2e = useE2E("story/subpages");

  for (const path of PAGES) {
    e2e.it(`${path} renders on a phone without overflow`, async ({ page, gotoReady }) => {
      await page.setViewportSize(PHONE);
      const heading = page.locator("main h1, h1").first();
      await gotoReady(path, async () => {
        await heading.waitFor({ state: "visible" });
      });

      const title = (await heading.innerText()).trim();
      expect(title.length, `${path}: empty H1`).toBeGreaterThan(0);

      const bodyText = await page.locator("body").innerText();
      expect(bodyText, `${path}: unrendered translation placeholder`).not.toMatch(/\{\{\w+\}\}/);

      const [scrollWidth, clientWidth] = await page.evaluate<[number, number]>(
        "[document.documentElement.scrollWidth, document.documentElement.clientWidth]",
      );
      expect(scrollWidth, `${path}: horizontal overflow at ${PHONE.width}px`).toBeLessThanOrEqual(clientWidth);
    });
  }

  // Demo chats must store real tool aliases + schema-shaped payloads so the
  // real widget loads (an unresolved tool shows its raw alias as the title).
  e2e.it("/story/self-host demo tool cards load their real widgets", async ({ page, gotoReady }) => {
    await gotoReady("/story/self-host", async () => {
      await page.getByText("/memories/ops/email-smtp-playbook.md", { exact: true }).waitFor();
    });
    for (const alias of ["task-list", "cortex-search", "coding-agent", "cortex-exec"]) {
      expect(await page.getByText(alias, { exact: true }).count(), `${alias}: widget not loaded`).toBe(0);
    }
    // cortex-exec must not rewrite the host page URL when rendered pre-filled
    expect(new URL(page.url()).searchParams.has("path")).toBe(false);
  });
});
