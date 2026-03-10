/**
 * Vibe Sense — AND / OR Evaluators
 * Combines multiple signal streams with boolean logic.
 * All signals must be time-aligned.
 */

import type { SignalEvent } from "../store/signals";

/**
 * AND: fires only when ALL input signals fire at the same timestamp.
 */
export function andEvaluate(signalGroups: SignalEvent[][]): SignalEvent[] {
  if (signalGroups.length === 0) {
    return [];
  }

  // Build a map of timestamp → array of fired states for each group
  const tsMap = new Map<number, boolean[]>();

  for (const group of signalGroups) {
    for (const event of group) {
      const ts = event.timestamp.getTime();
      const existing = tsMap.get(ts) ?? [];
      existing.push(event.fired);
      tsMap.set(ts, existing);
    }
  }

  return [...tsMap.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([ts, firedStates]) => ({
      timestamp: new Date(ts),
      fired:
        firedStates.length === signalGroups.length &&
        firedStates.every(Boolean),
    }));
}

/**
 * OR: fires when ANY input signal fires at a timestamp.
 */
export function orEvaluate(signalGroups: SignalEvent[][]): SignalEvent[] {
  if (signalGroups.length === 0) {
    return [];
  }

  const tsMap = new Map<number, boolean>();

  for (const group of signalGroups) {
    for (const event of group) {
      const ts = event.timestamp.getTime();
      tsMap.set(ts, (tsMap.get(ts) ?? false) || event.fired);
    }
  }

  return [...tsMap.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([ts, fired]) => ({ timestamp: new Date(ts), fired }));
}

/**
 * NOT: inverts a signal stream.
 */
export function notEvaluate(signals: SignalEvent[]): SignalEvent[] {
  return signals.map((e) => ({ ...e, fired: !e.fired }));
}
