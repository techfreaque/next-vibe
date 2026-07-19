import "server-only";

import { sql } from "drizzle-orm";
import type { DefaultFolderId } from "next-vibe/agent/chat/config";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

/**
 * Bumps updatedAt on a folder and ALL of its ancestors in one recursive CTE,
 * then emits a `folder-updated` event for EACH affected folder on the
 * folder-contents channel of the view it lives in (its parent's channel, or
 * the root view for top-level folders) so open sidebars re-sort live.
 */
export async function bubbleFolderActivity(
  folderId: string,
  now: Date,
  logger: EndpointLogger,
  user: JwtPayloadType,
): Promise<void> {
  const result = await db.execute<{
    id: string;
    name: string;
    icon: IconKey | null;
    color: string | null;
    sort_order: number;
    parent_id: string | null;
    root_folder_id: DefaultFolderId;
  }>(sql`
    WITH RECURSIVE ancestors AS (
      SELECT id, parent_id FROM chat_folders WHERE id = ${folderId}
      UNION ALL
      SELECT f.id, f.parent_id
      FROM chat_folders f
      JOIN ancestors a ON f.id = a.parent_id
    )
    UPDATE chat_folders SET updated_at = ${now}
    WHERE id IN (SELECT id FROM ancestors)
    RETURNING id, name, icon, color, sort_order, parent_id, root_folder_id
  `);

  if (result.rows.length === 0) {
    return;
  }
  const { createFolderContentsEmitter } =
    await import("next-vibe/agent/chat/folder-contents/[rootFolderId]/emitter");
  for (const folder of result.rows) {
    // Each folder is rendered in exactly one view: its parent's channel
    // (parent_id null → the root view). Emit there so that open list re-sorts.
    createFolderContentsEmitter(logger, user, folder.root_folder_id, {
      subFolderId: folder.parent_id,
    })("folder-updated", {
      responseData: {
        items: [
          {
            id: folder.id,
            name: folder.name,
            icon: folder.icon,
            color: folder.color,
            sortOrder: folder.sort_order,
            rootFolderId: folder.root_folder_id,
            updatedAt: now,
          },
        ],
      },
    });
  }
}
