/**
 * Outreach pipeline rules - pure, no DB, no IO. Client+server safe.
 *
 * Status merge: SENT → REPLIED → INTERESTED → DEAL only moves forward.
 * Exits (DECLINED / OPT_OUT / BOUNCED) always apply. OPT_OUT is sticky.
 * A later reply revives a BOUNCED contact; real interest revives a DECLINED one.
 */

import type {
  OutreachAngleGroupValue,
  OutreachContactStatusValue,
} from "./enum";
import { OutreachAngleGroup, OutreachContactStatus } from "./enum";

type Status = typeof OutreachContactStatusValue;

const PROGRESS_RANK: Partial<Record<Status, number>> = {
  [OutreachContactStatus.SENT]: 1,
  [OutreachContactStatus.REPLIED]: 2,
  [OutreachContactStatus.INTERESTED]: 3,
  [OutreachContactStatus.DEAL]: 4,
};

/** Statuses that count as "they answered" for reply rates. */
export const ANSWERED_STATUSES: readonly Status[] = [
  OutreachContactStatus.REPLIED,
  OutreachContactStatus.INTERESTED,
  OutreachContactStatus.DEAL,
  OutreachContactStatus.DECLINED,
  OutreachContactStatus.OPT_OUT,
];

export function mergeStatus(
  current: Status | null,
  incoming: Status,
  force = false,
): Status {
  if (current === null || force) {
    return incoming;
  }
  if (current === OutreachContactStatus.OPT_OUT) {
    return current;
  }
  const incomingRank = PROGRESS_RANK[incoming];
  if (incomingRank === undefined) {
    // Exit status
    return incoming;
  }
  const currentRank = PROGRESS_RANK[current];
  if (currentRank !== undefined) {
    return incomingRank > currentRank ? incoming : current;
  }
  if (current === OutreachContactStatus.BOUNCED) {
    return incomingRank >= 2 ? incoming : current;
  }
  // DECLINED
  return incomingRank >= 3 ? incoming : current;
}

/** Lowercased, trimmed email, or null when it does not look like one. */
export function normalizeEmail(input: string): string | null {
  const match = /[^\s<>()`'",;:|]+@[^\s<>()`'",;:|]+\.[a-z]{2,}/i.exec(input);
  return match ? match[0].toLowerCase().replace(/\.$/, "") : null;
}

/** Legend of the numeric angles in the first sent-log.md batches. */
const NUMERIC_ANGLES: Record<string, string> = {
  "1": "A-affiliate",
  "2": "B-audience-fit",
  "3": "C-free-speech",
  "4": "D-try-it",
};

/** Expand numeric angles to their named form, trim, drop empty / dash. */
export function normalizeAngle(
  input: string | null | undefined,
): string | null {
  if (!input) {
    return null;
  }
  const trimmed = input.trim();
  if (trimmed.length === 0 || /^[-–—]+$/.test(trimmed)) {
    return null;
  }
  return NUMERIC_ANGLES[trimmed] ?? trimmed.slice(0, 120);
}

/** Family of a raw pitch angle. */
export function angleGroup(
  angle: string | null | undefined,
): typeof OutreachAngleGroupValue {
  const value = (normalizeAngle(angle) ?? "").toUpperCase();
  if (value.length === 0) {
    return OutreachAngleGroup.OTHER;
  }
  if (value.startsWith("VIDEO")) {
    return OutreachAngleGroup.VIDEO;
  }
  if (/^(NEGOTIATE|DEAL|PAID)/.test(value)) {
    return OutreachAngleGroup.NEGOTIATION;
  }
  if (value.startsWith("INFO")) {
    return OutreachAngleGroup.INFO_FIRST;
  }
  const letter = /^([A-D])(?:[-+ (]|$)/.exec(value)?.[1];
  switch (letter) {
    case "A":
      return OutreachAngleGroup.AFFILIATE;
    case "B":
      return OutreachAngleGroup.AUDIENCE_FIT;
    case "C":
      return OutreachAngleGroup.MISSION;
    case "D":
      return OutreachAngleGroup.TRY_IT;
    default:
      break;
  }
  if (value.includes("AFFILIATE")) {
    return OutreachAngleGroup.AFFILIATE;
  }
  if (value.includes("AUDIENCE")) {
    return OutreachAngleGroup.AUDIENCE_FIT;
  }
  if (/FREE-SPEECH|PRIVACY|MISSION/.test(value)) {
    return OutreachAngleGroup.MISSION;
  }
  if (/TRY-IT|LISTED/.test(value)) {
    return OutreachAngleGroup.TRY_IT;
  }
  return OutreachAngleGroup.OTHER;
}
