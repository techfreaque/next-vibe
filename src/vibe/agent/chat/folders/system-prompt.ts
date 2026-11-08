/* eslint-disable i18next/no-literal-string */
import "server-only";

import type { SystemPromptFragment } from "../../ai-stream/system-prompt/types";
import { CORTEX_READ_ALIAS, CORTEX_SEARCH_ALIAS } from "../../cortex/constants";

/** Inline budget for knowledge files in the prompt (chars). */
const FILE_INLINE_MAX = 6000;
const TOTAL_INLINE_MAX = 24000;

/**
 * Folder project fragment - custom instructions + knowledge files of the folder
 * the chat runs in (instructions inherit from ancestor folders, outermost
 * first). Sits right after the skill/persona (600). Private/shared folders
 * only; a folder without instructions or files contributes nothing.
 */
export const folderProjectFragment: SystemPromptFragment = {
  id: "folder-project",
  placement: "leading",
  priority: 605,
  build: async (params) => {
    const { subFolderId, user, isIncognito, isExposedFolder, logger } = params;
    if (!subFolderId || user.isPublic || isIncognito || isExposedFolder) {
      return null;
    }

    const { loadProjectContext } =
      await import("./subfolders/[subFolderId]/project/repository");
    const ctx = await loadProjectContext(subFolderId, logger);
    if (!ctx) {
      return null;
    }

    const parts: string[] = [];

    if (ctx.instructions.length > 0) {
      const blocks = ctx.instructions.map((i) =>
        ctx.instructions.length > 1 ? `### ${i.folderName}\n${i.text}` : i.text,
      );
      parts.push(
        `## Project Instructions\n\nThe user set these instructions for this folder. Follow them in every reply unless the user explicitly overrides them.\n\n${blocks.join("\n\n")}`,
      );
    }

    if (ctx.files.length > 0) {
      let budget = TOTAL_INLINE_MAX;
      const isOwner = ctx.ownerUserId === user.id;
      const rendered: string[] = [];
      const listedOnly: string[] = [];
      for (const f of ctx.files) {
        const room = Math.min(FILE_INLINE_MAX, budget);
        if (room < 200) {
          listedOnly.push(`- ${f.name} (${f.size} bytes)`);
          continue;
        }
        const truncated = f.content.length > room;
        const body = truncated ? `${f.content.slice(0, room)}…` : f.content;
        budget -= body.length;
        rendered.push(
          `### ${f.name}${truncated ? " (truncated)" : ""}\n${body}`,
        );
      }
      const access = isOwner
        ? ` For the full text or a search across them use \`${CORTEX_READ_ALIAS}\` or \`${CORTEX_SEARCH_ALIAS}\` with path \`${ctx.knowledgeDir}\`.`
        : "";
      parts.push(
        `## Project Knowledge\n\nReference documents attached to this folder. Use them as ground truth for questions about this project.${access}\n\n${rendered.join("\n\n")}${listedOnly.length > 0 ? `\n\nNot shown inline:\n${listedOnly.join("\n")}` : ""}`,
      );
    }

    return parts.join("\n\n");
  },
};
