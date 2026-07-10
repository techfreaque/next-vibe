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
    // endLoop only when rename is the last call — it runs the rename and ends the
    // turn, sparing the empty follow-up turn (see the Tool Execution fragment).
    const endLoopRule = `Set \`callbackMode:"endLoop"\` only if the rename is the last call of the turn; otherwise fire it in parallel with your other calls.`;

    if (isNew) {
      // Urgent + unconditional: fire the rename IN THIS SAME response, not "later"
      // or "after the task". Framed as a standing duty so a task-focused persona
      // (e.g. quality-tester) does not drop it as narration.
      return `[MANDATORY THIS TURN] This thread still has no title ("${row.title}" is a placeholder). In THIS SAME response — regardless of what else the user asked — you MUST call ${callShape} to name it from the conversation so far. Required every turn until the thread is titled; not optional: do it silently (never mention it), never skip it. No clear topic yet → still pick a sensible short title + description. ${endLoopRule}`;
    }

    return `[RENAME IF STALE] Current title "${row.title}"${desc}. If the topic has shifted or the description no longer fits, silently call ${callShape} this response (never announce it). Otherwise leave it. ${endLoopRule}`;
  },
};
