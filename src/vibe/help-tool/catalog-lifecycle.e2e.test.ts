import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rename } from "node:fs/promises";
import { resolve } from "node:path";

import type { EndpointMeta } from "next-vibe/core/definition/endpoints-meta";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import endpoint, { type HelpGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";
import {
  extendHelpPayload,
  fixtureCatalog,
  generatedSnapshot,
  installFixture,
  readAtlasHelp,
  retireFixture,
} from "./test-files/catalog-lifecycle/catalog";
import { proofAlias, proofCategory, proofTitle } from "./test-files/catalog-lifecycle/report";

const query = "saffron calibration lifecycle report";
const secondaryAlias = "catalog-lifecycle-secondary-saffron";
const responseSchema = z.object({ success: z.literal(true), data: endpoint.GET.responseSchema });

describe("E2E: dynamic help catalog definition lifecycle", () => {
  const e2e = useE2E("catalog-lifecycle");

  e2e.it("adds and removes an isolated real definition through generated metadata and Atlas search", async ({
    baseUrl, cleanup, gotoReady, loginAs, page,
  }) => {
    const project = process.cwd();
    const unlocked = !existsSync(resolve(project, "scratchpad/DEPLOY_RUNNING"));
    expect(unlocked).toBe(true);
    if (!unlocked) {
      return;
    }

    const atlas = new URL(baseUrl);
    const local = atlas.protocol === "http:" &&
      (atlas.hostname === "localhost" || atlas.hostname === "127.0.0.1");
    expect(local).toBe(true);
    if (!local) {
      return;
    }

    await mkdir(resolve(project, ".tmp"), { recursive: true });
    const cwd = await mkdtemp(resolve(project, ".tmp/catalog-lifecycle-"));
    cleanup(async () => {
      const archive = resolve(project, ".tmp/todelete");
      await mkdir(archive, { recursive: true });
      await rename(cwd, resolve(archive, `catalog-lifecycle-${randomUUID()}`));
    });

    const admin = await resolveTestAdminUser();
    await loginAs(admin);
    const { t } = scopedTranslation.scopedT(E2E_LOCALE);
    let definitions: EndpointMeta[] = [];
    let previewRole: typeof UserPermissionRole.CUSTOMER | undefined;
    let liveRequests = 0;
    let verifiedSharedLookupIsolated = true;

    const session = await createTestSessionToken(admin);
    expect(session.success).toBe(true);
    if (!session.success) {
      return;
    }
    const token = session.data;
    let browserData: HelpGetResponseOutput | undefined;

    // Only the synthetic search response is replayed in this browser, using a
    // fresh real authenticated Atlas result for each current role and stage.
    await page.route(/\/api\/[^/]+\/vibe\/help-tool(?:\?|$)/, async (route) => {
      const url = new URL(route.request().url());
      if (!browserData || url.origin !== atlas.origin ||
          url.searchParams.get("query")?.toLowerCase() !== query) {
        await route.continue();
        return;
      }
      await route.fulfill({ json: { success: true, data: browserData } });
    });

    const loadStage = async (): Promise<void> => {
      const url = new URL(`/api/${E2E_LOCALE}/vibe/help-tool`, atlas);
      url.searchParams.set("query", query);
      url.searchParams.set("statsFilter", "webPinned");
      if (previewRole) {
        url.searchParams.set("viewAsRole", previewRole);
      }
      const live = await readAtlasHelp(url, token);
      expect(live.status).toBe(200);
      const decoded = responseSchema.safeParse(JSON.parse(live.body));
      expect(decoded.success).toBe(true);
      if (!decoded.success) {
        return;
      }
      const base = decoded.data.data;
      expect(Boolean(base.adminCatalogDestinations)).toBe(true);
      liveRequests++;
      verifiedSharedLookupIsolated &&= !base.adminCatalogDestinations?.[proofAlias] &&
        !base.tools.some(({ name }) => name === proofAlias);
      browserData = extendHelpPayload(base, fixtureCatalog(definitions, admin, previewRole, query));
    };

    const search = page.getByRole("textbox", { name: String(t("catalog.searchLabel")), exact: true }).last();
    const result = page.getByText(proofTitle, { exact: true });
    const performSearch = async (): Promise<void> => {
      await loadStage();
      await gotoReady("/tools", () => page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor());
      await search.waitFor();
      await search.clear();
      const response = page.waitForResponse((reply) => {
        const request = new URL(reply.url());
        return reply.ok() && request.pathname.endsWith("/vibe/help-tool") &&
          request.searchParams.get("query")?.toLowerCase() === query;
      });
      await search.fill(query);
      await response;
      await page.getByRole("heading", { name: String(t("admin.results")), exact: true }).waitFor();
    };
    const noResults = page.getByText(String(t("aiTools.modal.searchNoResults")), { exact: true }).last();

    const before = await generatedSnapshot(project, cwd, "before");
    expect(before).toEqual([]);
    definitions = before ?? [];
    await performSearch();
    await noResults.waitFor();
    expect(await result.count()).toBe(0);

    await installFixture(cwd);
    const added = await generatedSnapshot(project, cwd, "added");
    expect(added).toHaveLength(1);
    definitions = added ?? [];
    const eligible = fixtureCatalog(definitions, admin, undefined, query);
    expect(eligible.tools.map(({ name, title }) => ({ name, title }))).toEqual([
      { name: proofAlias, title: proofTitle },
    ]);
    expect(eligible.destinations[secondaryAlias]?.category).toBe(proofCategory);
    expect(eligible.landings[proofCategory]?.overview?.alias).toBe(proofAlias);
    const denied = fixtureCatalog(definitions, admin, UserPermissionRole.CUSTOMER, query);
    expect(denied.tools).toEqual([]);
    expect(denied.destinations[proofAlias]).toBeUndefined();
    expect(denied.landings[proofCategory]).toBeUndefined();
    await performSearch();
    await result.waitFor();
    expect(await result.count()).toBe(1);

    // Keep the admin browser shell while asking real Atlas and the isolated
    // emitter to apply the same customer role preview to the search response.
    previewRole = UserPermissionRole.CUSTOMER;
    await performSearch();
    await noResults.waitFor();
    expect(await result.count()).toBe(0);
    previewRole = undefined;

    await retireFixture(cwd);
    const removed = await generatedSnapshot(project, cwd, "removed");
    expect(removed).toEqual([]);
    definitions = removed ?? [];
    const retired = fixtureCatalog(definitions, admin, undefined, query);
    expect(retired.destinations[proofAlias]).toBeUndefined();
    expect(retired.landings[proofCategory]).toBeUndefined();
    await performSearch();
    await noResults.waitFor();
    expect(await result.count()).toBe(0);
    expect(liveRequests).toBeGreaterThanOrEqual(4);
    expect(verifiedSharedLookupIsolated).toBe(true);
  });
});
