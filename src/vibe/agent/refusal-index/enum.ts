/**
 * Refusal Index enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Lifecycle of one benchmark run. */
export const {
  enum: RefusalRunStatus,
  options: RefusalRunStatusOptions,
  Value: RefusalRunStatusValue,
} = createEnumOptions(scopedTranslation, {
  RUNNING: "enums.runStatus.running",
  COMPLETED: "enums.runStatus.completed",
  FAILED: "enums.runStatus.failed",
  CANCELLED: "enums.runStatus.cancelled",
});

export const RefusalRunStatusDB = [
  RefusalRunStatus.RUNNING,
  RefusalRunStatus.COMPLETED,
  RefusalRunStatus.FAILED,
  RefusalRunStatus.CANCELLED,
] as const;

/** How one model answered one question. */
export const {
  enum: RefusalVerdict,
  options: RefusalVerdictOptions,
  Value: RefusalVerdictValue,
} = createEnumOptions(scopedTranslation, {
  ANSWERED: "enums.verdict.answered",
  HEDGED: "enums.verdict.hedged",
  REFUSED: "enums.verdict.refused",
  ERROR: "enums.verdict.error",
});

export const RefusalVerdictDB = [
  RefusalVerdict.ANSWERED,
  RefusalVerdict.HEDGED,
  RefusalVerdict.REFUSED,
  RefusalVerdict.ERROR,
] as const;

/** Verdicts the judge may return (error is a runner outcome, never a judgement). */
export const JudgeVerdictDB = [
  RefusalVerdict.ANSWERED,
  RefusalVerdict.HEDGED,
  RefusalVerdict.REFUSED,
] as const;
