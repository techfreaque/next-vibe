import "server-only";

/**
 * Favorites Virtual Mount
 *
 * Structure:
 *   /favorites/                          → all user favorites
 *   /favorites/<skillId>-<variantId>.md  → a saved skill+variant loadout
 *
 * Filename = slug (from DB), which follows <skillId>-<variantId> convention.
 * Built-in skills: thea-brilliant, vibe-coder-max, etc.
 * Custom skills: <slug>-<variantId> or just <slug> for single-variant.
 */
import { and, count as drizzleCount, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import type { ToolConfigItem } from "@/app/api/[locale]/agent/chat/settings/definition";
import type { FavoriteGetModelSelection } from "@/app/api/[locale]/agent/skills/favorites/[id]/definition";

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

  const fileKey = segments[1]!.replace(/\.md$/, "");

  const { chatFavorites } =
    await import("@/app/api/[locale]/agent/skills/favorites/db");

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  let fav: typeof chatFavorites.$inferSelect | undefined;

  if (UUID_RE.test(fileKey)) {
    const rows = await db
      .select()
      .from(chatFavorites)
      .where(
        and(eq(chatFavorites.userId, userId), eq(chatFavorites.id, fileKey)),
      )
      .limit(1);
    fav = rows[0];
  } else {
    // Match listFavoritePath's filename derivation: slug if present, else
    // <skillId>-<variantId> (or just <skillId> for the default variant). Try
    // slug first, then resolve the composite key by scanning the user's rows.
    const slugRows = await db
      .select()
      .from(chatFavorites)
      .where(
        and(eq(chatFavorites.userId, userId), eq(chatFavorites.slug, fileKey)),
      )
      .limit(1);
    fav = slugRows[0];
    if (!fav) {
      const all = await db
        .select()
        .from(chatFavorites)
        .where(eq(chatFavorites.userId, userId));
      fav = all.find((f) => {
        if (f.slug) {
          return f.slug === fileKey;
        }
        const composite =
          f.variantId && f.variantId !== "default"
            ? `${f.skillId}-${f.variantId}`
            : f.skillId;
        return composite === fileKey;
      });
    }
  }

  if (!fav) {
    return null;
  }

  const slug = fav.slug || fav.id;
  const fm = [
    "---",
    `favoriteId: "${fav.id}"`,
    `file: "${slug}.md"`,
    `skillId: "${fav.skillId}"`,
  ];

  if (fav.variantId) {
    fm.push(`variantId: "${fav.variantId}"`);
  }
  if (fav.customVariantName) {
    fm.push(`variantName: "${fav.customVariantName.replace(/"/g, '\\"')}"`);
  }

  if (fav.modelSelection) {
    const sel = fav.modelSelection as FavoriteGetModelSelection & {
      modelId?: string;
    };
    const modelId = "modelId" in sel && sel.modelId ? sel.modelId : "filters";
    fm.push(`model: "${modelId}"`);
  }

  fm.push(
    `position: ${fav.position}`,
    `created: "${fav.createdAt.toISOString()}"`,
    "---",
  );

  const bodyLines: string[] = [];

  if (fav.promptAppend) {
    bodyLines.push("## Prompt append", "", fav.promptAppend, "");
  }

  if (fav.color) {
    bodyLines.push(`color: ${fav.color}`);
  }

  if (
    fav.availableTools &&
    (fav.availableTools as ToolConfigItem[]).length > 0
  ) {
    const toolNames = (fav.availableTools as ToolConfigItem[])
      .map((t) => t.toolId)
      .join(", ");
    bodyLines.push(`tools: ${toolNames}`);
  }

  return {
    content: `${fm.join("\n")}\n\n${bodyLines.join("\n")}`.trimEnd(),
    nodeType: "file",
    updatedAt: fav.updatedAt.toISOString(),
  };
}

/**
 * List all favorites for a user.
 * Filename is always the slug (<skillId>-<variantId> convention).
 */
export async function listFavoritePath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path !== "/favorites") {
    return [];
  }

  const { chatFavorites } =
    await import("@/app/api/[locale]/agent/skills/favorites/db");

  const rows = await db
    .select({
      id: chatFavorites.id,
      slug: chatFavorites.slug,
      skillId: chatFavorites.skillId,
      variantId: chatFavorites.variantId,
      updatedAt: chatFavorites.updatedAt,
    })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId))
    .orderBy(chatFavorites.position, chatFavorites.slug);

  return rows.map((f) => {
    // Use slug if available, else fall back to <skillId>-<variantId> or just skillId
    let fileKey = f.slug || "";
    if (!fileKey) {
      fileKey =
        f.variantId && f.variantId !== "default"
          ? `${f.skillId}-${f.variantId}`
          : f.skillId;
    }
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
    await import("@/app/api/[locale]/agent/skills/favorites/db");

  const rows = await db
    .select({ count: drizzleCount() })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

  return rows[0]?.count ?? 0;
}
