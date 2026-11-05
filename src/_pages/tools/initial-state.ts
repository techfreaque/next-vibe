/**
 * /tools URL state - shared by the SSR loader and the client page so both
 * render the same filtered view (?q, ?sf, ?cat, ?p, ?ps, ?inst, ?prod, ?view).
 */

import type { HelpGetRequestInput } from "next-vibe/help-tool/definition";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

interface SearchParamsReader {
  get: (name: string) => string | null;
}

type StatsFilter = NonNullable<HelpGetRequestInput["statsFilter"]>;

const STATS_FILTERS: readonly StatsFilter[] = [
  "pinned",
  "allowed",
  "all",
  "webPinned",
  "cliAllowed",
  "mcpPinned",
  "mcpAllowed",
];

function isStatsFilter(value: string | null): value is StatsFilter {
  return STATS_FILTERS.some((filter) => filter === value);
}

function positiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= 1 ? n : undefined;
}

export function parseToolsInitialState(
  searchParams: SearchParamsReader,
): Partial<HelpGetRequestInput> {
  const state: Partial<HelpGetRequestInput> = { statsFilter: "webPinned" };

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

  const cat = searchParams.get("cat");
  if (cat) {
    state.category = cat;
  }

  const page = positiveInt(searchParams.get("p"));
  if (page) {
    state.page = page;
  }

  const pageSize = positiveInt(searchParams.get("ps"));
  if (pageSize) {
    state.pageSize = pageSize;
  }

  return state;
}
