/// <reference types="node" />
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";

import type { ReleaseState, ReleaseTarget } from "../types/types";

interface ParsedState {
  targets?: Array<ReleaseTarget>;
  completed?: Array<string>;
  failed?: Array<string>;
  skipped?: Array<string>;
  currentIndex?: number;
  startTime?: string;
  lastUpdated?: string;
}

/**
 * Type guard to validate if parsed JSON matches ReleaseState structure
 */
function isReleaseState(value: ParsedState | null): value is ReleaseState {
  if (value === null || typeof value !== "object") {
    return false;
  }

  return (
    Array.isArray(value.targets) &&
    Array.isArray(value.completed) &&
    Array.isArray(value.failed) &&
    Array.isArray(value.skipped) &&
    typeof value.currentIndex === "number" &&
    typeof value.startTime === "string" &&
    typeof value.lastUpdated === "string"
  );
}

export class StateManager {
  private stateFilePath: string;

  constructor(
    rootDir: string,
    stateFileName = ".launchpad-release-state.json",
  ) {
    this.stateFilePath = join(rootDir, stateFileName);
  }

  /**
   * Initialize a new release state
   */
  initializeState(
    targets: ReleaseTarget[],
    logger: EndpointLogger,
  ): ReleaseState {
    const state: ReleaseState = {
      targets,
      completed: [],
      failed: [],
      skipped: [],
      currentIndex: 0,
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.saveState(state, logger);
    return state;
  }

  /**
   * Load existing state from file
   */
  loadState(logger: EndpointLogger): ReleaseState | null {
    if (!existsSync(this.stateFilePath)) {
      return null;
    }

    try {
      const stateData = readFileSync(this.stateFilePath, "utf-8");
      const parsedData = JSON.parse(stateData) as ParsedState | null;

      if (!isReleaseState(parsedData)) {
        logger.error(
          "Invalid state file format - does not match expected structure",
        );
        return null;
      }

      logger.info(`Loaded existing state from ${this.stateFilePath}`);
      return parsedData;
    } catch (error) {
      logger.error("Failed to load state file", parseError(error));
      return null;
    }
  }

  /**
   * Save current state to file
   */
  saveState(state: ReleaseState, logger: EndpointLogger): void {
    try {
      state.lastUpdated = new Date().toISOString();
      writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));
    } catch (error) {
      if (logger) {
        logger.error("Failed to save state file", parseError(error));
      }
    }
  }

  /**
   * Mark a target as completed
   */
  markCompleted(
    state: ReleaseState,
    directory: string,
    logger: EndpointLogger,
  ): void {
    if (!state.completed.includes(directory)) {
      state.completed.push(directory);
    }
    // Remove from failed if it was there
    state.failed = state.failed.filter((dir) => dir !== directory);
    this.saveState(state, logger);
  }

  /**
   * Mark a target as failed
   */
  markFailed(
    state: ReleaseState,
    directory: string,
    logger: EndpointLogger,
  ): void {
    if (!state.failed.includes(directory)) {
      state.failed.push(directory);
    }
    this.saveState(state, logger);
  }

  /**
   * Mark a target as skipped
   */
  markSkipped(
    state: ReleaseState,
    directory: string,
    logger: EndpointLogger,
  ): void {
    if (!state.skipped.includes(directory)) {
      state.skipped.push(directory);
    }
    this.saveState(state, logger);
  }

  /**
   * Update current index
   */
  updateCurrentIndex(
    state: ReleaseState,
    index: number,
    logger: EndpointLogger,
  ): void {
    state.currentIndex = index;
    this.saveState(state, logger);
  }

  /**
   * Clear state file
   */
  clearState(logger: EndpointLogger): void {
    if (existsSync(this.stateFilePath)) {
      try {
        unlinkSync(this.stateFilePath);
        logger.info("State file cleared");
      } catch (error) {
        logger.error("Failed to clear state file", parseError(error));
      }
    }
  }

  /**
   * Get remaining targets to process
   */
  getRemainingTargets(state: ReleaseState): ReleaseTarget[] {
    const processedDirectories = new Set([
      ...state.completed,
      ...state.skipped,
    ]);

    return state.targets.filter(
      (target) => !processedDirectories.has(target.directory),
    );
  }

  /**
   * Get failed targets that can be retried
   */
  getFailedTargets(state: ReleaseState): ReleaseTarget[] {
    return state.targets.filter((target) =>
      state.failed.includes(target.directory),
    );
  }

  /**
   * Reset failed targets for retry
   */
  resetFailedTargets(state: ReleaseState, logger: EndpointLogger): void {
    state.failed = [];
    this.saveState(state, logger);
  }

  /**
   * Get state summary for display
   */
  /* eslint-disable i18next/no-literal-string */
  getStateSummary(state: ReleaseState): string {
    const total = state.targets.length;
    const completed = state.completed.length;
    const failed = state.failed.length;
    const skipped = state.skipped.length;
    const remaining = total - completed - failed - skipped;

    return `State Summary:
  Total targets: ${total}
  Completed: ${completed}
  Failed: ${failed}
  Skipped: ${skipped}
  Remaining: ${remaining}
  Started: ${state.startTime}
  Last updated: ${state.lastUpdated}`;
  }
  /* eslint-enable i18next/no-literal-string */
}
