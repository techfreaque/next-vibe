import type {
  AdminToolRole,
  EndpointMeta,
} from "../core/definition/endpoints-meta";
import type { CategoryDefinitionSerialized } from "./category-types";

const automationSegments = new Set([
  "backfill",
  "cleanup",
  "cron",
  "dispatch",
  "drain",
  "ingest",
  "process-queue",
  "prune",
  "purge",
  "reconcile-automatic",
  "retry-queue",
  "scheduler",
  "sync",
  "task-runner",
]);
const developerSegments = new Set([
  "data-sources",
  "data-source",
  "datasources",
  "evaluators",
  "indicators",
  "transformers",
  "debug",
  "generator",
  "generators",
  "tooling",
]);

/** Classify relative to the declared path, independent of display language and alias. */
export function getAdminToolRole(
  tool: Pick<EndpointMeta, "admin" | "path" | "method">,
): AdminToolRole {
  if (tool.admin?.role) {
    return tool.admin.role;
  }
  if (
    tool.path[0] === "v1" ||
    tool.path.some((part) => developerSegments.has(part))
  ) {
    return "developer";
  }
  const action = tool.path.at(-1) ?? "";
  if (
    tool.method !== "GET" &&
    tool.path.some((part) => automationSegments.has(part))
  ) {
    return "automation";
  }
  if (tool.path.some((part) => part.startsWith("["))) {
    return "record";
  }
  if (tool.method === "POST" && action === "create") {
    return "create";
  }
  return tool.method === "GET" ? "destination" : "record";
}

interface Placement {
  key: string;
  subCategory: string;
  path: string;
  exact: boolean;
}
const pathsFor = (
  key: string,
  subCategory: string,
  placement: Pick<
    CategoryDefinitionSerialized,
    "adminPaths" | "adminPathPrefixes"
  >,
): Placement[] => [
  ...(placement.adminPaths ?? []).map((path) => ({
    key,
    subCategory,
    path,
    exact: true,
  })),
  ...(placement.adminPathPrefixes ?? []).map((path) => ({
    key,
    subCategory,
    path,
    exact: false,
  })),
];

/** Assign web workspace sections without changing the definition's catalog on other platforms. */
export function classifyAdminCatalog(
  tools: readonly EndpointMeta[],
  categories: readonly CategoryDefinitionSerialized[],
): EndpointMeta[] {
  const placements = categories
    .flatMap((category) => [
      ...pathsFor(category.key, "", category),
      ...Object.entries(category.subcategories ?? {}).flatMap(
        ([subCategory, entry]) => pathsFor(category.key, subCategory, entry),
      ),
    ])
    .toSorted(
      (a, b) =>
        b.path.length - a.path.length || Number(b.exact) - Number(a.exact),
    );

  return tools.map((tool) => {
    const path = tool.path.join("/");
    const placement = placements.find(
      (candidate) =>
        path === candidate.path ||
        (!candidate.exact && path.startsWith(`${candidate.path}/`)),
    );
    if (
      !placement ||
      (placement.key === tool.category &&
        placement.subCategory === tool.subCategory)
    ) {
      return tool;
    }
    return {
      ...tool,
      category: placement.key,
      subCategory: placement.subCategory,
    };
  });
}
