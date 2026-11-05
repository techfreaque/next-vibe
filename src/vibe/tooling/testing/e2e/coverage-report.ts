// Testing infrastructure - messages are for test debugging, not end users

/**
 * E2E coverage report — what "100%" means, measured.
 *
 *   bun src/vibe/tooling/testing/e2e/coverage-report.ts [--min=<percent>]
 *
 * Scope: every customer-facing endpoint (PUBLIC in allowedRoles) that renders
 * request form fields. An endpoint counts as covered when a suite drove it in
 * a real browser to a success AND — if it has any required request field, i.e.
 * a user can get it wrong — to at least one rejection (server or client).
 * Field types count as covered once any suite operated them through a driver.
 *
 * Reads the per-suite records in .tmp/e2e/coverage (written by useE2E), so run
 * the E2E suites first. Writes .tmp/e2e/coverage-report.json. With --min, exits
 * non-zero when endpoint coverage is below the threshold (CI gate).
 */

import "server-only";

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getEndpoint } from "@/generated/endpoints/endpoint";
import { pathToAliasMap } from "@/generated/endpoints/alias-map";

import { UserRole } from "../../../identity/roles/enum";
import { loadEnvironment } from "../../../platforms/cli/runtime/environment";
import { E2E_COVERAGE_DIR } from "./config";
import type { E2EOutcome, E2ESuiteCoverage } from "./coverage";
import { e2eEndpointId } from "./endpoint-form";
import type { E2EFieldMeta } from "./field-drivers";
import { getFieldDriver } from "./field-drivers";

interface ScopeEntry {
  endpointId: string;
  fieldTypes: Set<string>;
  /** Has a required request field — a rejection path must be tested too. */
  rejectable: boolean;
}

/** Collects request field types; returns true when any request field is required. */
function collectRequestFieldTypes(
  node: E2EFieldMeta,
  out: Set<string>,
): boolean {
  let required = false;
  for (const child of Object.values(node.children ?? {})) {
    const { usage, schema } = child as {
      usage?: { request?: string };
      schema?: { isOptional: () => boolean };
    };
    if (child.type === "form_field" && usage?.request && child.fieldType) {
      out.add(child.fieldType);
      required ||= schema ? !schema.isOptional() : false;
    }
    if (child.children) {
      required = collectRequestFieldTypes(child, out) || required;
    }
  }
  return required;
}

async function customerFacingScope(): Promise<ScopeEntry[]> {
  const canonicalIds = [...new Set(Object.values(pathToAliasMap))];
  const scope: ScopeEntry[] = [];
  for (const id of canonicalIds) {
    const endpoint = await getEndpoint(id);
    if (!endpoint) {
      continue;
    }
    const roles: readonly string[] = endpoint.allowedRoles;
    if (!roles.includes(UserRole.PUBLIC)) {
      continue;
    }
    const fieldTypes = new Set<string>();
    const rejectable = collectRequestFieldTypes(
      endpoint.fields as E2EFieldMeta,
      fieldTypes,
    );
    if (fieldTypes.size > 0) {
      scope.push({
        endpointId: e2eEndpointId(endpoint),
        fieldTypes,
        rejectable,
      });
    }
  }
  return scope.toSorted((a, b) => a.endpointId.localeCompare(b.endpointId));
}

function loadRecords(): Map<string, Set<E2EOutcome>> & {
  fieldTypes: Set<string>;
} {
  const outcomes = new Map<string, Set<E2EOutcome>>() as Map<
    string,
    Set<E2EOutcome>
  > & {
    fieldTypes: Set<string>;
  };
  outcomes.fieldTypes = new Set();
  if (!existsSync(E2E_COVERAGE_DIR)) {
    return outcomes;
  }
  for (const file of readdirSync(E2E_COVERAGE_DIR)) {
    if (!file.endsWith(".json")) {
      continue;
    }
    const suite = JSON.parse(
      readFileSync(join(E2E_COVERAGE_DIR, file), "utf-8"),
    ) as E2ESuiteCoverage;
    for (const rec of suite.endpoints) {
      const set = outcomes.get(rec.endpointId) ?? new Set<E2EOutcome>();
      for (const outcome of rec.outcomes) {
        set.add(outcome);
      }
      outcomes.set(rec.endpointId, set);
      for (const type of rec.fieldTypes) {
        outcomes.fieldTypes.add(type);
      }
    }
  }
  return outcomes;
}

function pct(part: number, total: number): string {
  return total === 0 ? "100.0" : ((part / total) * 100).toFixed(1);
}

async function main(): Promise<void> {
  loadEnvironment();
  const minArg = process.argv.find((a) => a.startsWith("--min="));
  const min = minArg ? Number(minArg.slice("--min=".length)) : null;

  const scope = await customerFacingScope();
  const records = loadRecords();

  const rows = scope.map((entry) => {
    const outcomes = records.get(entry.endpointId) ?? new Set<E2EOutcome>();
    const hasSuccess = outcomes.has("success");
    const hasRejection =
      outcomes.has("serverRejected") || outcomes.has("clientValidation");
    const status =
      hasSuccess && (hasRejection || !entry.rejectable)
        ? "covered"
        : outcomes.size > 0
          ? "partial"
          : "uncovered";
    const missing = [
      ...(hasSuccess ? [] : ["success"]),
      ...(hasRejection || !entry.rejectable ? [] : ["rejection"]),
    ];
    return {
      endpointId: entry.endpointId,
      status,
      outcomes: [...outcomes],
      missing,
    };
  });

  const allTypes = new Set(scope.flatMap((e) => [...e.fieldTypes]));
  const typeRows = [...allTypes].toSorted().map((type) => ({
    type,
    driver: getFieldDriver(type) !== null,
    exercised: records.fieldTypes.has(type),
  }));

  const covered = rows.filter((r) => r.status === "covered").length;
  const partial = rows.filter((r) => r.status === "partial").length;
  const typesExercised = typeRows.filter((r) => r.exercised).length;
  const typesDriven = typeRows.filter((r) => r.driver).length;

  const icon = { covered: "✓", partial: "◐", uncovered: "·" } as const;
  const lines = [
    "",
    "E2E coverage — customer-facing endpoints (PUBLIC, with form fields)",
    "",
    ...rows.map(
      (r) =>
        `  ${icon[r.status as keyof typeof icon]} ${r.endpointId}${r.outcomes.length ? `  [${r.outcomes.join(", ")}]` : ""}${r.missing.length ? `  missing: ${r.missing.join(" + ")}` : ""}`,
    ),
    "",
    "Field types in scope",
    "",
    ...typeRows.map(
      (r) =>
        `  ${r.exercised ? "✓" : r.driver ? "◐" : "·"} ${r.type}${r.driver ? "" : "  (no driver)"}`,
    ),
    "",
    `Endpoints: ${covered}/${rows.length} covered (${pct(covered, rows.length)}%), ${partial} partial`,
    `Field types: ${typesExercised}/${typeRows.length} exercised (${pct(typesExercised, typeRows.length)}%), ${typesDriven} have drivers`,
    "",
  ];
  process.stdout.write(lines.join("\n"));

  writeFileSync(
    join(E2E_COVERAGE_DIR, "..", "coverage-report.json"),
    `${JSON.stringify({ endpoints: rows, fieldTypes: typeRows }, null, 2)}\n`,
  );

  const endpointPct = rows.length === 0 ? 100 : (covered / rows.length) * 100;
  if (min !== null && endpointPct < min) {
    process.stdout.write(
      `\nFAIL: endpoint coverage ${endpointPct.toFixed(1)}% < --min=${min}%\n`,
    );
    process.exitCode = 1;
  }
  // Definition imports keep handles (DB pool, timers) open
  process.exit();
}

void main();
