import { existsSync } from "node:fs";
import { copyFile, mkdir, rename, writeFile } from "node:fs/promises";
import { get } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { isAdminToolConfigured } from "next-vibe/core/definition/admin-availability.server";
import type { EndpointMeta } from "next-vibe/core/definition/endpoints-meta";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Platform } from "next-vibe/platforms/platforms";

import {
  getAdminCategoryLandings,
  buildAdminCatalogDestinations,
} from "../../admin-catalog-model";
import { classifyAdminCatalog } from "../../admin-classification";
import type { CategoryDefinitionSerialized } from "../../category-types";
import type {
  HelpGetRequestOutput,
  HelpGetResponseOutput,
} from "../../definition";
import {
  buildCategories,
  filterMetaForUser,
  getMetaPlatforms,
  resolveEffectiveUser,
  searchCatalog,
} from "../../repository/meta-filter";
import { serializeMeta } from "../../repository/serialize";
import { proofAlias, proofCategory } from "./report";

const fixtureCategory: CategoryDefinitionSerialized = {
  key: proofCategory,
  label: "Catalog lifecycle fixture",
  labels: { "en-US": "Catalog lifecycle fixture" },
  group: "system",
  order: 1,
  icon: "file-text",
  adminPathPrefixes: ["vibe/help-tool-proof"],
  landing: {
    overview: { alias: proofAlias, scope: "platform" },
    destinations: [proofAlias],
  },
};

interface FixtureCatalog {
  tools: HelpGetResponseOutput["tools"];
  categories: NonNullable<HelpGetResponseOutput["webCategories"]>;
  destinations: NonNullable<HelpGetResponseOutput["adminCatalogDestinations"]>;
  landings: NonNullable<HelpGetResponseOutput["adminCategoryLandings"]>;
}

export async function installFixture(cwd: string): Promise<void> {
  const entry = resolve(cwd, "fixture");
  await mkdir(entry, { recursive: true });
  const source = pathToFileURL(resolve(import.meta.dir, "report.ts")).href;
  await writeFile(
    resolve(entry, "definition.ts"),
    `export { default } from ${JSON.stringify(source)};\n`,
  );
  // The metadata generator reads definitions and uses this paired file's presence.
  await writeFile(
    resolve(entry, "route.ts"),
    "export { default as endpoint } from './definition';\n",
  );
}

export async function retireFixture(cwd: string): Promise<void> {
  const entry = resolve(cwd, "fixture");
  await rename(
    resolve(entry, "definition.ts"),
    resolve(entry, "definition.detached.ts"),
  );
  await rename(resolve(entry, "route.ts"), resolve(entry, "route.detached.ts"));
}

export async function generatedSnapshot(
  project: string,
  cwd: string,
  revision: string,
): Promise<EndpointMeta[] | undefined> {
  if (existsSync(resolve(project, "scratchpad/DEPLOY_RUNNING"))) {
    return undefined;
  }
  const worker = Bun.spawn({
    cmd: [
      process.execPath,
      "--tsconfig-override",
      resolve(project, "tsconfig.json"),
      resolve(import.meta.dir, "generate.ts"),
      project,
    ],
    cwd,
    stdout: "ignore",
    stderr: "ignore",
  });
  if ((await worker.exited) !== 0) {
    return undefined;
  }
  const directory = resolve(cwd, "src/generated/endpoints/meta");
  const snapshot = resolve(directory, `en-${revision}.ts`);
  await copyFile(resolve(directory, "en.ts"), snapshot);
  const generated: { endpointsMeta: EndpointMeta[] } = await import(
    pathToFileURL(snapshot).href
  );
  return generated.endpointsMeta;
}

export function fixtureCatalog(
  definitions: EndpointMeta[],
  actor: JwtPayloadType,
  viewAsRole: HelpGetRequestOutput["viewAsRole"],
  term: string,
): FixtureCatalog {
  const eligible = definitions.filter(isAdminToolConfigured);
  const web = classifyAdminCatalog(
    filterMetaForUser(
      eligible,
      Platform.NEXT_PAGE,
      resolveEffectiveUser(actor, viewAsRole),
    ),
    [fixtureCategory],
  );
  const ranked = searchCatalog(web, term, ({ toolName }) => toolName);
  return {
    tools: ranked.map((tool) =>
      serializeMeta(
        tool,
        undefined,
        false,
        getMetaPlatforms(tool.allowedRoles),
      ),
    ),
    categories: buildCategories(web),
    destinations: buildAdminCatalogDestinations(web),
    landings: getAdminCategoryLandings([fixtureCategory], web),
  };
}

export function extendHelpPayload(
  real: HelpGetResponseOutput,
  fixture: FixtureCatalog,
): HelpGetResponseOutput {
  return {
    ...real,
    tools: [...fixture.tools, ...real.tools],
    totalCount:
      real.totalCount +
      fixture.categories.reduce((sum, { count }) => sum + count, 0),
    matchedCount: real.matchedCount + fixture.tools.length,
    webCategories: [...(real.webCategories ?? []), ...fixture.categories],
    adminCatalogDestinations: {
      ...real.adminCatalogDestinations,
      ...fixture.destinations,
    },
    adminCategoryLandings: {
      ...real.adminCategoryLandings,
      ...fixture.landings,
    },
  };
}

export function readAtlasHelp(
  url: URL,
  token: string,
): Promise<{ status: number; body: string }> {
  return new Promise((resolveRequest, reject) => {
    const request = get(
      url,
      { headers: { authorization: `Bearer ${token}` }, timeout: 10_000 },
      (response) => {
        const chunks: Buffer[] = [];
        let bytes = 0;
        response.on("data", (chunk: Buffer) => {
          bytes += chunk.length;
          if (bytes > 8 * 1024 * 1024) {
            response.destroy(
              new Error("Catalog fixture response exceeded its bound"),
            );
            return;
          }
          chunks.push(chunk);
        });
        response.once("end", () =>
          resolveRequest({
            status: response.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
        response.once("error", reject);
      },
    );
    request.once("timeout", () =>
      request.destroy(new Error("Atlas help request timed out")),
    );
    request.once("error", reject);
  });
}
