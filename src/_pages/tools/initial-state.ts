/**
 * /tools URL state - shared by the SSR loader and the client page so both
 * render the same filtered view.
 */

import type { HelpGetRequestInput } from "next-vibe/help-tool/definition";
import { parseSidebarPathFromSearch } from "next-vibe/help-tool/sidebar-path";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

interface SearchParamsReader {
  get: (name: string) => string | null;
}

type StatsFilter = NonNullable<HelpGetRequestInput["statsFilter"]>;

const STATS_FILTERS: readonly StatsFilter[] = [
  "pinned",
  "allowed",
  "all",
  "web",
  "webPinned",
  "hidden",
  "cliAllowed",
  "mcpPinned",
  "mcpAllowed",
];

function isStatsFilter(value: string | null): value is StatsFilter {
  return STATS_FILTERS.some((filter) => filter === value);
}

function positiveInt(value: string | null): number | undefined {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1 ? n : undefined;
}

const FILTER_PARAM_KEYS = [
  "q",
  "sf",
  "prod",
  "view",
  "inst",
  "p",
  "ps",
  "cat",
  "sub",
  "catalog",
];

export function copyCatalogSearchParams(
  source: URLSearchParams,
): URLSearchParams {
  const filters = new URLSearchParams();
  for (const key of FILTER_PARAM_KEYS) {
    const value = source.get(key);
    if (value !== null) {
      filters.set(key, value);
    }
  }
  return filters;
}

export function readEndpointSearchParams(
  source: URLSearchParams,
): Record<string, string> {
  const args: Record<string, string> = {};
  source.forEach((value, key) => {
    if (key.startsWith("arg.")) {
      args[key.slice(4)] = value;
    } else if (!FILTER_PARAM_KEYS.includes(key) && !source.has(`arg.${key}`)) {
      // Accept links already shared with bare endpoint arguments.
      args[key] = value;
    }
  });
  return args;
}

export function parseToolsInitialState(
  searchParams: SearchParamsReader,
): Partial<HelpGetRequestInput> {
  const state: Partial<HelpGetRequestInput> = {
    statsFilter: "webPinned",
    catalogNavigation: true,
  };

  const q = searchParams.get("q");
  if (q) {
    state.query = q;
  }

  const sf = searchParams.get("sf");
  if (isStatsFilter(sf)) {
    state.statsFilter = sf;
  }

  if (searchParams.get("prod") === "1") {
    state.includeProdOnly = true;
  }

  const view = searchParams.get("view");
  if (
    view === UserPermissionRole.PUBLIC ||
    view === UserPermissionRole.CUSTOMER
  ) {
    state.viewAsRole = view;
  }

  const inst = searchParams.get("inst");
  if (inst) {
    state.instanceId = inst;
  }

  const [category, subCategory] = parseSidebarPathFromSearch(searchParams);
  if (category) {
    state.category = category;
    state.subCategory = subCategory;
  }
  if (!isStatsFilter(sf)) {
    state.statsFilter = inst
      ? "all"
      : category || q || searchParams.get("catalog") === "all"
        ? "web"
        : "webPinned";
  }

  const page = positiveInt(searchParams.get("p"));
  if (page) {
    state.page = page;
  }

  const pageSize = positiveInt(searchParams.get("ps"));
  if (pageSize && pageSize <= 1000) {
    state.pageSize = pageSize;
  }

  return state;
}
