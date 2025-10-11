import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ReleaseState, ReleaseTarget } from "../types/types.js";
import { logger, loggerError } from "./logger.js";

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
  initializeState(targets: ReleaseTarget[]): ReleaseState {
    const state: ReleaseState = {
      targets,
      completed: [],
      failed: [],
      skipped: [],
      currentIndex: 0,
      startTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    this.saveState(state);
    return state;
  }

  /**
   * Load existing state from file
   */
  loadState(): ReleaseState | null {
    if (!existsSync(this.stateFilePath)) {
      return null;
    }

    try {
      const stateData = readFileSync(this.stateFilePath, "utf-8");
      const state = JSON.parse(stateData) as ReleaseState;
      logger(`Loaded existing state from ${this.stateFilePath}`);
      return state;
    } catch (error) {
      loggerError("Failed to load state file:", error);
      return null;
    }
  }

  /**
   * Save current state to file
   */
  saveState(state: ReleaseState): void {
    try {
      state.lastUpdated = new Date().toISOString();
      writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2));
    } catch (error) {
      loggerError("Failed to save state file:", error);
    }
  }

  /**
   * Mark a target as completed
   */
  markCompleted(state: ReleaseState, directory: string): void {
    if (!state.completed.includes(directory)) {
      state.completed.push(directory);
    }
    // Remove from failed if it was there
    state.failed = state.failed.filter((dir) => dir !== directory);
    this.saveState(state);
  }

  /**
   * Mark a target as failed
   */
  markFailed(state: ReleaseState, directory: string): void {
    if (!state.failed.includes(directory)) {
      state.failed.push(directory);
    }
    this.saveState(state);
  }

  /**
   * Mark a target as skipped
   */
  markSkipped(state: ReleaseState, directory: string): void {
    if (!state.skipped.includes(directory)) {
      state.skipped.push(directory);
    }
    this.saveState(state);
  }

  /**
   * Update current index
   */
  updateCurrentIndex(state: ReleaseState, index: number): void {
    state.currentIndex = index;
    this.saveState(state);
  }

  /**
   * Clear state file
   */
  clearState(): void {
    if (existsSync(this.stateFilePath)) {
      try {
        unlinkSync(this.stateFilePath);
        logger("State file cleared");
      } catch (error) {
        loggerError("Failed to clear state file:", error);
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
  resetFailedTargets(state: ReleaseState): void {
    state.failed = [];
    this.saveState(state);
  }

  /**
   * Get state summary for display
   */
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
}
