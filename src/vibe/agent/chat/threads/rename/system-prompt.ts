/* eslint-disable i18next/no-literal-string */
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";

import type { SystemPromptFragment } from "../../../ai-stream/system-prompt/types";
import { FOLDER_DENIED_TOOL_IDS } from "../../config";
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
    if (params.toolsDisabled) {
      // Text-only run: there is no rename tool to call.
      return null;
    }
    if (!threadId && params.threadlessPreview) {
      // system-prompt-debug preview of a chat that does not exist yet: there
      // is no thread to rename, so the fragment has nothing to say.
      return null;
    }
    if (!threadId) {
      // Caller frames name WHICH prompt build ran without a thread (prod row
      // 11-16 07:44, incognito guest, said nothing about the path).
      params.logger.error(
        "Missing threadid in system prompt, wont show rename prompt fragment",
        {
          userId: params.user.isPublic ? null : params.user.id,
          leadId: params.user.leadId,
          isPublic: params.user.isPublic,
          isIncognito: params.isIncognito,
          rootFolderId: params.rootFolderId,
          subFolderId: params.subFolderId,
          callerStack: new Error("trace").stack
            ?.split("\n")
            .slice(2, 9)
            .map((line) => line.trim())
            .join(" | "),
        },
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
    const renameInput = {
      title: "Weekend plans",
      description:
        "The user is planning a weekend trip and comparing train routes.",
    };
    // Folders that deny execute-tool must call rename-thread
    // DIRECTLY - routing it through execute-tool there was always rejected
    // ("execute-tool denied by permission cascade"), so those threads never got
    // a title. A direct call has no callbackMode (that is an execute-tool arg).
    const executeToolDenied =
      FOLDER_DENIED_TOOL_IDS[params.rootFolderId]?.includes(
        EXECUTE_TOOL_ALIAS,
      ) ?? false;
    const callShape = executeToolDenied
      ? `${renameToolName} with arguments ${JSON.stringify(renameInput)}`
      : `execute-tool with arguments ${JSON.stringify({ toolName: renameToolName, input: renameInput, ...(params.user.isPublic ? {} : { callbackMode: "endLoop" }) })}`;
    const timing =
      "Finish the user's request first. Once all work is complete, write the visible answer and silently call the rename tool in the same response. If you already answered this turn, send only the rename. Never end the turn with work pending.";
    const fields = `Example: ${callShape}. Replace the example title and description with a title of up to eight words and a short summary of this conversation.`;

    if (isNew) {
      return `[MANDATORY THIS TURN, ALONGSIDE YOUR ANSWER] This thread still has a placeholder title. Give it a title even if the conversation is just starting. ${timing} ${fields}`;
    }

    return `[RENAME IF STALE] Current title "${row.title}"${desc}. Rename only if the topic has shifted or the summary no longer fits. ${timing} ${fields}`;
  },
};
