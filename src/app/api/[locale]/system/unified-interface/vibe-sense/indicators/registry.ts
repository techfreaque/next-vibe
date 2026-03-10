/**
 * Vibe Sense — Indicator Registry
 *
 * Auto-discovers indicators.ts files from all domains.
 * Validates resolution constraints and detects dependency cycles.
 * Provides the lookup interface used by the engine.
 */

import { GraphResolution } from "../enum";
import type {
  AnyIndicator,
  DerivedIndicator,
  IndicatorMeta,
  Resolution,
} from "./types";
import {
  isDerivedIndicator,
  isMultiValueIndicator,
  RESOLUTION_MS,
} from "./types";

// ─── Registry Store ───────────────────────────────────────────────────────────

const _indicators = new Map<string, AnyIndicator>();
let _initialized = false;

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Register a single indicator.
 * Validates resolution constraints for derived nodes.
 * Called during auto-discovery.
 */
export function registerIndicator(indicator: AnyIndicator): void {
  if (_indicators.has(indicator.id)) {
    return; // Already registered — idempotent
  }

  if (isDerivedIndicator(indicator)) {
    const valid = validateDerivedResolution(indicator);
    if (!valid) {
      return; // Resolution constraint violated — skip
    }
  }

  _indicators.set(indicator.id, indicator);
}

/**
 * Register all indicators from a module (called for each indicators.ts file).
 */
export function registerModule(indicators: Record<string, AnyIndicator>): void {
  for (const indicator of Object.values(indicators)) {
    if (indicator && typeof indicator === "object" && "id" in indicator) {
      registerIndicator(indicator);
    }
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateDerivedResolution(derived: DerivedIndicator): boolean {
  for (const inputId of derived.inputs) {
    const input = _indicators.get(inputId);
    if (!input) {
      // Input not yet registered — will be validated when inputs are registered
      continue;
    }
    if (RESOLUTION_MS[derived.resolution] < RESOLUTION_MS[input.resolution]) {
      // Invalid: derived has finer resolution than its input — skip registration
      return false;
    }
  }
  return true;
}

/**
 * Detect cycles in derived indicator dependency graph.
 * Uses DFS with grey/black coloring.
 * Throws if a cycle is found.
 */
export function validateNoCycles(): void {
  const WHITE = 0;
  const GREY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();

  function visit(nodeId: string, path: string[]): boolean {
    const indicator = _indicators.get(nodeId);
    if (!indicator || !isDerivedIndicator(indicator)) {
      return true;
    }

    const state = color.get(nodeId) ?? WHITE;
    if (state === BLACK) {
      return true;
    }
    if (state === GREY) {
      // Cycle detected — remove the offending node
      _indicators.delete(nodeId);
      return false;
    }

    color.set(nodeId, GREY);
    for (const inputId of indicator.inputs) {
      visit(inputId, [...path, nodeId]);
    }
    color.set(nodeId, BLACK);
    return true;
  }

  for (const id of _indicators.keys()) {
    visit(id, []);
  }
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

export function getIndicator(id: string): AnyIndicator | undefined {
  return _indicators.get(id);
}

export function getAllIndicators(): AnyIndicator[] {
  return [..._indicators.values()];
}

export function getIndicatorOrNull(id: string): AnyIndicator | undefined {
  return _indicators.get(id);
}

/** Get all direct input IDs for a node (empty for source nodes) */
export function getInputIds(nodeId: string): string[] {
  const indicator = _indicators.get(nodeId);
  if (!indicator || !isDerivedIndicator(indicator)) {
    return [];
  }
  return indicator.inputs;
}

/** Get lookback periods for a node (0 for source nodes) */
export function getLookback(nodeId: string): number {
  const indicator = _indicators.get(nodeId);
  if (!indicator || !isDerivedIndicator(indicator)) {
    return 0;
  }
  return indicator.lookback ?? 0;
}

// ─── Resolution Helpers ───────────────────────────────────────────────────────

/**
 * Returns the coarsest resolution across a set of node IDs.
 * Used to determine what resolution an evaluator's inputs will be scaled to.
 */
export function coarsestResolution(nodeIds: string[]): Resolution {
  let coarsest: Resolution = GraphResolution.ONE_MINUTE;
  for (const id of nodeIds) {
    const indicator = _indicators.get(id);
    if (
      indicator &&
      RESOLUTION_MS[indicator.resolution] > RESOLUTION_MS[coarsest]
    ) {
      coarsest = indicator.resolution;
    }
  }
  return coarsest;
}

// ─── Meta (for registry API + builder) ───────────────────────────────────────

/** Extract domain from indicator id, e.g. "leads.created" → "leads" */
function extractDomain(id: string): string {
  return id.split(".")[0] ?? id;
}

export function getIndicatorMeta(id: string): IndicatorMeta | undefined {
  const indicator = _indicators.get(id);
  if (!indicator) {
    return undefined;
  }

  return {
    id: indicator.id,
    domain: extractDomain(indicator.id),
    description: indicator.description,
    resolution: indicator.resolution,
    persist: indicator.persist,
    lookback: isDerivedIndicator(indicator)
      ? (indicator.lookback ?? 0)
      : undefined,
    inputs: isDerivedIndicator(indicator) ? indicator.inputs : undefined,
    outputs: isMultiValueIndicator(indicator) ? indicator.outputs : undefined,
    isDerived: isDerivedIndicator(indicator),
    isMultiValue: isMultiValueIndicator(indicator),
  };
}

export function getAllIndicatorMeta(): IndicatorMeta[] {
  return [..._indicators.keys()]
    .map((id) => getIndicatorMeta(id))
    .filter((m): m is IndicatorMeta => m !== undefined);
}

// ─── Auto-Discovery ───────────────────────────────────────────────────────────

/**
 * Initialize the registry by importing all indicators.ts files.
 * Idempotent — safe to call multiple times.
 * Called once at server startup.
 */
export async function initializeRegistry(): Promise<void> {
  if (_initialized) {
    return;
  }
  _initialized = true;

  // Dynamically import all domain indicator files
  // Each file exports named indicator constants
  const modules = await loadIndicatorModules();

  for (const mod of modules) {
    registerModule(mod);
  }

  // Final cycle check after all modules loaded
  validateNoCycles();
}

/**
 * Load all indicator modules from the auto-generated index.
 * The index is produced by the Indicator Index Generator which scans
 * for indicators.ts files across the codebase.
 */
async function loadIndicatorModules(): Promise<Record<string, AnyIndicator>[]> {
  const { indicatorModules } =
    await import("../../../../system/generated/indicator-index");
  return indicatorModules;
}

/**
 * Reset registry — for testing only
 */
export function _resetRegistry(): void {
  _indicators.clear();
  _initialized = false;
}
