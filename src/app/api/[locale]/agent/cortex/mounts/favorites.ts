import "server-only";

/**
 * Favorites Virtual Mount
 * Renders user favorites (skill + model/tool loadouts) as markdown files at /favorites/<slug>.md
 */

import { and, count as drizzleCount, eq, or } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";

import type { VirtualListEntry, VirtualReadResult } from "./resolver";

/**
 * Read a favorite as markdown
 * Path: /favorites/<slug> or /favorites/<uuid>
 */
export async function readFavoritePath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const slugOrId = segments[1].replace(/\.md$/, "");

  const { chatFavorites } =
    await import("@/app/api/[locale]/agent/chat/favorites/db");

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const idClause = UUID_RE.test(slugOrId)
    ? or(eq(chatFavorites.slug, slugOrId), eq(chatFavorites.id, slugOrId))
    : eq(chatFavorites.slug, slugOrId);

  const rows = await db
    .select()
    .from(chatFavorites)
    .where(and(eq(chatFavorites.userId, userId), idClause))
    .limit(1);

  const fav = rows[0];
  if (!fav) {
    return null;
  }

  const frontmatterLines = [
    "---",
    `favoriteId: "${fav.id}"`,
    `slug: "${fav.slug}"`,
    `skillId: "${fav.skillId}"`,
  ];

  if (fav.customVariantName) {
    frontmatterLines.push(
      `variantName: "${fav.customVariantName.replace(/"/g, '\\"')}"`,
    );
  } else if (fav.variantId) {
    frontmatterLines.push(`variantId: "${fav.variantId}"`);
  }

  if (fav.modelSelection) {
    const sel = fav.modelSelection as FavoriteGetModelSelection & {
      modelId?: string;
    };
    const modelId = "modelId" in sel && sel.modelId ? sel.modelId : "filters";
    frontmatterLines.push(`model: "${modelId}"`);
  }

  frontmatterLines.push(
    `position: ${fav.position}`,
    `created: "${fav.createdAt.toISOString()}"`,
    "---",
  );

  const bodyLines: string[] = [];

  if (fav.color) {
    bodyLines.push(`color: ${fav.color}`);
  }
  if (fav.promptAppend) {
    bodyLines.push("", "## Prompt append", "", fav.promptAppend);
  }
  if (
    fav.availableTools &&
    (fav.availableTools as ToolConfigItem[]).length > 0
  ) {
    const toolNames = (fav.availableTools as ToolConfigItem[])
      .map((t) => t.toolId)
      .join(", ");
    bodyLines.push("", `tools: ${toolNames}`);
  }

  return {
    content:
      `${frontmatterLines.join("\n")}\n\n${bodyLines.join("\n")}`.trimEnd(),
    nodeType: "file",
    updatedAt: fav.updatedAt.toISOString(),
  };
}

/**
 * List all favorites for a user
 */
export async function listFavoritePath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path !== "/favorites") {
    return [];
  }

  const { chatFavorites } =
    await import("@/app/api/[locale]/agent/chat/favorites/db");

  const rows = await db
    .select({
      id: chatFavorites.id,
      slug: chatFavorites.slug,
      updatedAt: chatFavorites.updatedAt,
    })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId))
    .orderBy(chatFavorites.position, chatFavorites.slug);

  return rows.map((f) => {
    const fileKey = f.slug || f.id;
    return {
      name: `${fileKey}.md`,
      path: `/favorites/${fileKey}`,
      nodeType: "file" as const,
      size: null,
      updatedAt: f.updatedAt.toISOString(),
    };
  });
}

/**
 * Get favorites count
 */
export async function getFavoriteCount(userId: string): Promise<number> {
  const { chatFavorites } =
    await import("@/app/api/[locale]/agent/chat/favorites/db");

  const rows = await db
    .select({ count: drizzleCount() })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

  return rows[0]?.count ?? 0;
}
