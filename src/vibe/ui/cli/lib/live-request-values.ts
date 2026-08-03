import type { WidgetData } from "../../../core/utils/json";
import { useEffect, useSyncExternalStore } from "react";

/**
 * Live request-field values, published by the form and read by the page header.
 *
 * The interactive page shows a copy-pasteable `$ vibe …` command above the form.
 * That header is a SIBLING of the form, not a descendant, so it has no react-
 * hook-form context to watch. A module-level store bridges the two: the form
 * publishes on every change, the header subscribes.
 *
 * CLI-scoped on purpose — one interactive page runs at a time, so a single
 * module-level value is sufficient and needs no keying.
 */

/**
 * State lives on globalThis, not in module scope.
 *
 * The CLI form component is served to Bun under the WEB file's path with its
 * relative imports rewritten, so this module can be instantiated more than once
 * in a single process. Module-level state would then split: the form would
 * publish into one copy while the page header subscribed to another, and the
 * live command silently never updated. A global key is shared by construction.
 */
interface LiveRequestState {
  current: Record<string, WidgetData>;
  listeners: Set<() => void>;
  submitHandler: (() => void) | undefined;
  enterCaptureCount: number;
}

const STATE_KEY = "__vibeLiveRequestState";

function state(): LiveRequestState {
  const holder: Record<string, LiveRequestState | undefined> =
    globalThis as never;
  const existing = holder[STATE_KEY];
  if (existing) {
    return existing;
  }
  const created: LiveRequestState = {
    current: {},
    listeners: new Set(),
    submitHandler: undefined,
    enterCaptureCount: 0,
  };
  holder[STATE_KEY] = created;
  return created;
}

export function setLiveRequestValues(values: Record<string, WidgetData>): void {
  const st = state();
  st.current = values;
  for (const listener of st.listeners) {
    listener();
  }
}

// ─── Submit bridge ───────────────────────────────────────────────────────────
// Enter submits from ANY field, not just the submit button. The page-level key
// handler is outside the form, so the form publishes its submit here — the same
// sibling problem the values bridge solves.

export function setSubmitHandler(handler: (() => void) | undefined): void {
  state().submitHandler = handler;
}

/** Submit the interactive form. No-op when there is nothing to submit. */
export function triggerSubmit(): boolean {
  const handler = state().submitHandler;
  if (!handler) {
    return false;
  }
  handler();
  return true;
}

// ─── Enter capture ───────────────────────────────────────────────────────────
// Fields that use Enter for their own editing (a tags field commits a tag)
// claim it so the page does not also submit on the same keypress.

/** True while a focused field is consuming Enter for its own editing. */
export function isEnterCaptured(): boolean {
  return state().enterCaptureCount > 0;
}

/** Claim Enter for this field while `active`. Released on blur/unmount. */
export function useCaptureEnter(active: boolean): void {
  useEffect(() => {
    if (!active) {
      return;
    }
    const st = state();
    st.enterCaptureCount += 1;
    return (): void => {
      st.enterCaptureCount -= 1;
    };
  }, [active]);
}

function subscribe(listener: () => void): () => void {
  const st = state();
  st.listeners.add(listener);
  return (): void => {
    st.listeners.delete(listener);
  };
}

function getSnapshot(): Record<string, WidgetData> {
  return state().current;
}

/** The request values currently entered in the interactive form. */
export function useLiveRequestValues(): Record<string, WidgetData> {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
