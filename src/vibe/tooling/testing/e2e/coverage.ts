// Testing infrastructure - messages are for test debugging, not end users

/**
 * E2E coverage recorder.
 *
 * The form driver records what each suite actually exercised in a real
 * browser: which endpoints, through which pages, operating which widget
 * types, ending in which outcome. Each suite writes one JSON file on
 * teardown (re-running a suite replaces its record); coverage-report.ts
 * merges them against the full endpoint registry.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { E2E_COVERAGE_DIR } from "./config";

/**
 * - success:          request sent, server returned success
 * - serverRejected:   request sent, server returned a failure (auth, conflict, validation)
 * - clientValidation: UI blocked the submit and showed field errors — no request sent
 */
export type E2EOutcome = "success" | "serverRejected" | "clientValidation";

export interface E2EEndpointCoverage {
  endpointId: string;
  pages: string[];
  fields: string[];
  fieldTypes: string[];
  outcomes: E2EOutcome[];
}

export interface E2ESuiteCoverage {
  suite: string;
  recordedAt: string;
  endpoints: E2EEndpointCoverage[];
}

interface MutableCoverage {
  pages: Set<string>;
  fields: Set<string>;
  fieldTypes: Set<string>;
  outcomes: Set<E2EOutcome>;
}

const records = new Map<string, MutableCoverage>();

function entry(endpointId: string): MutableCoverage {
  let rec = records.get(endpointId);
  if (!rec) {
    rec = {
      pages: new Set(),
      fields: new Set(),
      fieldTypes: new Set(),
      outcomes: new Set(),
    };
    records.set(endpointId, rec);
  }
  return rec;
}

export function recordPage(endpointId: string, page: string): void {
  entry(endpointId).pages.add(page);
}

export function recordField(
  endpointId: string,
  path: string,
  fieldType: string,
): void {
  const rec = entry(endpointId);
  rec.fields.add(path);
  rec.fieldTypes.add(fieldType);
}

export function recordOutcome(endpointId: string, outcome: E2EOutcome): void {
  entry(endpointId).outcomes.add(outcome);
}

function slug(value: string): string {
  return value.replaceAll(/[^a-zA-Z0-9-]+/g, "_").slice(0, 120);
}

/** Write this suite's record and reset the in-memory store. */
export function flushCoverage(suite: string): void {
  const data: E2ESuiteCoverage = {
    suite,
    recordedAt: new Date().toISOString(),
    endpoints: [...records.entries()].map(([endpointId, rec]) => ({
      endpointId,
      pages: [...rec.pages].toSorted(),
      fields: [...rec.fields].toSorted(),
      fieldTypes: [...rec.fieldTypes].toSorted(),
      outcomes: [...rec.outcomes].toSorted(),
    })),
  };
  mkdirSync(E2E_COVERAGE_DIR, { recursive: true });
  writeFileSync(
    join(E2E_COVERAGE_DIR, `${slug(suite)}.json`),
    `${JSON.stringify(data, null, 2)}\n`,
  );
  records.clear();
}
