/** First-run status for /setup and redirects into it. */
import "server-only";

import { identityEnv } from "../../identity/env";
import { getSetupPhase } from "../../identity/setup-state";
import { SystemSettingsRepository } from "./repository";

export interface SetupStatus {
  firstRun: boolean;
  pending: boolean;
  complete: boolean;
  writable: boolean;
}

export class SetupStatusRepository {
  static isPending(): boolean {
    const phase = getSetupPhase(identityEnv);
    return phase === "first-run" || phase === "in-progress";
  }

  static async getStatus(): Promise<SetupStatus> {
    const phase = getSetupPhase(identityEnv);
    const pending = SetupStatusRepository.isPending();
    return {
      firstRun: phase === "first-run",
      pending,
      complete: phase === "complete",
      writable: pending && (await SystemSettingsRepository.checkWritable()),
    };
  }

  static async shouldRedirectToSetup(isAdmin: boolean): Promise<boolean> {
    const phase = getSetupPhase(identityEnv);
    if (phase !== "first-run" && !(phase === "in-progress" && isAdmin)) {
      return false;
    }
    return SystemSettingsRepository.checkWritable();
  }
}
