/* eslint-disable i18next/no-literal-string */
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { SystemPromptFragment } from "../../../ai-stream/system-prompt/types";
import { chatThreads } from "../../db";
import { THREAD_RENAME_ALIAS } from "./constants";
import { getIncognitoRename } from "./incognito-title-cache";

// ─── Fragment ──────────────────────────────────────────────────────────────────
//
// Per-turn thread titling: the model silently calls `rename-thread` (via
// execute-tool) in the SAME turn as its real answer, naming the thread from the
// conversation so far. Required on a still-default thread; never announced.
// callbackMode:"endLoop" is always used — rename is a final side-action, so the
// loop stops cleanly instead of spawning an empty follow-up acknowledgement turn.
export const threadRenameFragment: SystemPromptFragment = {
  id: "thread-rename",
  // TRAILING on purpose: it carries the LIVE thread title (changes per turn) so it
  // must stay OUT of the cached leading prefix. It's the last thing the model reads
  // before the user message (recency). The urgency has to come from the WORDING,
  // not the placement — see the [MANDATORY THIS TURN] framing below.
  placement: "trailing",
  priority: 10,
  build: async (params) => {
    const { threadId } = params;
    if (!threadId) {
      params.logger.error(
        "Missing threadid in system prompt, wont show rename prompt fragment",
        params.user,
        params.subFolderId,
        params.rootFolderId,
      );
      return null;
    }

    let row: { title: string; description: string | null } | undefined;
    if (params.isIncognito) {
      // Incognito threads have no DB row. Prefer a rename recorded in this
      // process THIS turn (so the mid-loop prompt refresh sees the new title
      // instead of re-demanding a rename), else the client-sent localStorage
      // title/description carried on the stream request.
      row =
        getIncognitoRename(threadId) ??
        (params.incognitoThreadTitle
          ? {
              title: params.incognitoThreadTitle,
              description: params.incognitoThreadDescription ?? null,
            }
          : undefined);
    } else {
      [row] = await db
        .select({
          title: chatThreads.title,
          description: chatThreads.description,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
    }

    if (!row?.title) {
      return null;
    }

    const isNew = !row.description;
    const desc = row.description ? ` / "${row.description}"` : "";
    // Relay RECEIVER: this thread is OWNED by the caller — the rename must
    // round-trip to it (`<caller>__rename-thread`), else the executor renames its
    // OWN local copy and the owner's title never updates (mirror titles diverge).
    const renameToolName = params.relayCallerInstanceId
      ? `${params.relayCallerInstanceId}__${THREAD_RENAME_ALIAS}`
      : THREAD_RENAME_ALIAS;
    const callShape = `execute-tool(toolName="${renameToolName}", input={ title: "≤8 words covering the whole conversation, no quotes", description: "2-6 sentences summarizing the full thread — what was discussed, decided, or built" }, callbackMode: "endLoop")`;
    // Housekeeping — NEVER pre-empts the user's actual work and NEVER ends the turn
    // BEFORE the work is done. It rides in the SAME parallel batch as real tool calls.
    // callbackMode:"endLoop" is correct HERE because rename is always a final side-action
    // — the user's answer was already written before this tool fires. endLoop stops the
    // loop cleanly instead of spawning an empty follow-up turn to acknowledge a result
    // nobody reads. GUARD: the rideRule below makes clear it must not fire before the
    // user's request is fully done — that blocks the T1 rename+endLoop hijack pattern
    // where the model uses rename to short-circuit real work.
    const rideRule = `Do the user's actual request FIRST and in FULL; the rename is a silent side-action fired in the SAME batch as your real tool calls (or right after, once your answer is complete). NEVER skip, delay, or replace the user's work with it, never make it your only action, and never fire it while other work is still pending — only fire it once the user's request is fully done, then let endLoop close the turn.`;

    if (isNew) {
      // Urgent + unconditional, but SUBORDINATE to the user's task: fire the rename
      // in this same response — as a side-action, not by hijacking the turn. Framed
      // as a standing duty so a task-focused persona (e.g. quality-tester) does not
      // drop it as narration, yet cannot use it to short-circuit the real work.
      return `[MANDATORY THIS TURN, ALONGSIDE YOUR ANSWER] This thread still has no title ("${row.title}" is a placeholder). While answering whatever the user asked — not instead of it — you MUST also call ${callShape} to name it from the conversation so far. Required every turn until titled; do it silently (never mention it), never skip it, never let it displace the user's request. No clear topic yet → still pick a sensible short title + description. ${rideRule}`;
    }

    return `[RENAME IF STALE] Current title "${row.title}"${desc}. If the topic has shifted or the description no longer fits, silently call ${callShape} this response (never announce it) — as a side-action, not instead of the user's request. Otherwise leave it. ${rideRule}`;
  },
};
