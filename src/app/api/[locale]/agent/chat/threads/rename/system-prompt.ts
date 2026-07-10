/* eslint-disable i18next/no-literal-string */
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";

import { THREAD_RENAME_ALIAS } from "./constants";

// ─── Fragment ──────────────────────────────────────────────────────────────────
//
// Per-turn thread titling: the model silently calls `rename-thread` (via
// execute-tool) in the SAME turn as its real answer, naming the thread from the
// conversation so far. Required on a still-default thread; never announced.
// endLoop is used only when the rename is the turn's last call — it runs the
// rename and stops the loop, sparing the empty follow-up turn the SDK would
// otherwise spend acknowledging a housekeeping result nobody reads.
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

    const [row] = await db
      .select({
        title: chatThreads.title,
        description: chatThreads.description,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (!row?.title) {
      return null;
    }

    const isNew = !row.description;
    const desc = row.description ? ` / "${row.description}"` : "";
    const callShape = `execute-tool toolName="${THREAD_RENAME_ALIAS}" (title ≤8 words no quotes; description one concrete sentence, not a restatement)`;
    // Housekeeping — NEVER pre-empts the user's actual work and NEVER ends the turn.
    // It rides in the SAME parallel batch as the real tool calls. Deliberately no
    // endLoop: granting endLoop here makes the model treat rename as the whole turn
    // and stop before doing the user's request (observed: T1 rename+endLoop hijack).
    const rideRule = `Do the user's actual request FIRST and in FULL; the rename is a silent side-action fired in the SAME batch as your real tool calls (or right after). NEVER skip, delay, or replace the user's work with it, never make it your only action, and never use it to end the turn early — keep working until the user's request is fully done.`;

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
