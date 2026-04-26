import "server-only";

/**
 * Skills Virtual Mount
 * Renders custom skills as markdown files at /skills/<skillId>.md
 */

import { and, count as drizzleCount, eq, inArray, or } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import type {
  MountWriteContext,
  VirtualDeleteResult,
  VirtualListEntry,
  VirtualMoveResult,
  VirtualReadResult,
  VirtualWriteResult,
} from "./resolver";

/**
 * Read a skill as markdown
 * Path: /skills/<skillId>
 */
export async function readSkillPath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const skillIdSegment = segments[1];
  // Strip .md extension if present
  const skillId = skillIdSegment.replace(/\.md$/, "");

  // Dynamic import to avoid pulling in skills DB at module level
  const { customSkills } =
    await import("@/app/api/[locale]/agent/chat/skills/db");

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const whereClause = UUID_RE.test(skillId)
    ? or(eq(customSkills.id, skillId), eq(customSkills.slug, skillId))
    : eq(customSkills.slug, skillId);

  const rows = await db.select().from(customSkills).where(whereClause).limit(1);

  const skill = rows[0];
  if (!skill) {
    return null;
  }

  // Allow reading own skills or skills referenced by user's favorites
  if (skill.userId !== userId) {
    const { chatFavorites } =
      await import("@/app/api/[locale]/agent/chat/favorites/db");
    const [fav] = await db
      .select({ id: chatFavorites.id })
      .from(chatFavorites)
      .where(
        and(
          eq(chatFavorites.userId, userId),
          eq(chatFavorites.skillId, skill.id),
        ),
      )
      .limit(1);
    if (!fav) {
      return null;
    }
  }

  const frontmatterLines = [
    "---",
    `skillId: "${skill.id}"`,
    `name: "${(skill.name ?? "Unnamed").replace(/"/g, '\\"')}"`,
  ];

  if (skill.modelSelection) {
    const modelId =
      "modelId" in skill.modelSelection
        ? String(skill.modelSelection.modelId)
        : "custom";
    frontmatterLines.push(`model: "${modelId}"`);
  }
  if (skill.ownershipType) {
    frontmatterLines.push(`ownership: "${skill.ownershipType}"`);
  }

  frontmatterLines.push(`created: "${skill.createdAt.toISOString()}"`, "---");

  const body = skill.systemPrompt ?? "";
  const content = `${frontmatterLines.join("\n")}\n\n${body}`;

  return {
    content,
    nodeType: "file",
    updatedAt: skill.updatedAt.toISOString(),
  };
}

/**
 * List skills — own skills + skills referenced by user's favorites (deduped)
 */
export async function listSkillPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path !== "/skills") {
    return [];
  }

  const [{ customSkills }, { chatFavorites }] = await Promise.all([
    import("@/app/api/[locale]/agent/chat/skills/db"),
    import("@/app/api/[locale]/agent/chat/favorites/db"),
  ]);

  // Get skillIds referenced by user's favorites
  const favRows = await db
    .select({ skillId: chatFavorites.skillId })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

  const UUID_RE_LIST =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const favSkillIds = [
    ...new Set(
      favRows.map((r) => r.skillId).filter((id) => UUID_RE_LIST.test(id)),
    ),
  ];

  // Fetch own skills + favorited skills in one query
  const whereClause =
    favSkillIds.length > 0
      ? or(
          eq(customSkills.userId, userId),
          inArray(customSkills.id, favSkillIds),
        )
      : eq(customSkills.userId, userId);

  const rows = await db
    .select()
    .from(customSkills)
    .where(whereClause)
    .orderBy(customSkills.name);

  return rows.map((s) => {
    const fileKey = s.slug || s.id;
    return {
      name: `${fileKey}.md`,
      path: `/skills/${fileKey}`,
      nodeType: "file" as const,
      size: s.systemPrompt ? Buffer.byteLength(s.systemPrompt, "utf8") : 0,
      updatedAt: s.updatedAt.toISOString(),
    };
  });
}

/**
 * Get skill count — own + favorited (deduped)
 */
export async function getSkillCount(userId: string): Promise<number> {
  const [{ customSkills }, { chatFavorites }] = await Promise.all([
    import("@/app/api/[locale]/agent/chat/skills/db"),
    import("@/app/api/[locale]/agent/chat/favorites/db"),
  ]);

  const favRows = await db
    .select({ skillId: chatFavorites.skillId })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const favSkillIds = [
    ...new Set(favRows.map((r) => r.skillId).filter((id) => UUID_RE.test(id))),
  ];

  const whereClause =
    favSkillIds.length > 0
      ? or(
          eq(customSkills.userId, userId),
          inArray(customSkills.id, favSkillIds),
        )
      : eq(customSkills.userId, userId);

  const rows = await db
    .select({ count: drizzleCount() })
    .from(customSkills)
    .where(whereClause);

  return rows[0]?.count ?? 0;
}

// ---------------------------------------------------------------------------
// Write handlers
// ---------------------------------------------------------------------------

/**
 * Parse skill markdown: extract frontmatter fields + body text (systemPrompt).
 */
function parseSkillMarkdown(content: string): {
  body: string;
  name?: string;
  description?: string;
  tagline?: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { body: content.trim() };
  }

  const yamlBlock = match[1];
  const body = (match[2] ?? "").trim();
  const result: ReturnType<typeof parseSkillMarkdown> = { body };

  for (const line of yamlBlock.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    const rawValue = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");

    switch (key) {
      case "name":
        result.name = rawValue;
        break;
      case "description":
        result.description = rawValue;
        break;
      case "tagline":
        result.tagline = rawValue;
        break;
    }
  }

  return result;
}

/**
 * Write a skill via Cortex path.
 * - /skills/<uuid>.md → update existing skill
 */
export async function writeSkillPath(
  ctx: MountWriteContext,
  path: string,
  content: string,
): Promise<VirtualWriteResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const skillIdSegment = segments[1];
  const skillId = skillIdSegment.replace(/\.md$/, "");
  const parsed = parseSkillMarkdown(content);

  const { customSkills } =
    await import("@/app/api/[locale]/agent/chat/skills/db");

  // Check if skill exists and belongs to user (by id or slug)
  const [existing] = await db
    .select({ id: customSkills.id })
    .from(customSkills)
    .where(
      and(
        or(eq(customSkills.id, skillId), eq(customSkills.slug, skillId)),
        eq(customSkills.userId, ctx.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  // Update systemPrompt + optional name/description/tagline
  await db
    .update(customSkills)
    .set({
      systemPrompt: parsed.body,
      updatedAt: new Date(),
      ...(parsed.name !== undefined ? { name: parsed.name } : {}),
      ...(parsed.description !== undefined
        ? { description: parsed.description }
        : {}),
      ...(parsed.tagline !== undefined ? { tagline: parsed.tagline } : {}),
    })
    .where(eq(customSkills.id, existing.id));

  // Disk write-through
  try {
    const { syncToDisk } = await import("../fs-provider/fs-sync");
    await syncToDisk(`/skills/${skillId}.md`, content);
  } catch {
    // Best-effort
  }

  // Fire-and-forget: sync embedding for vector search
  void (async (): Promise<void> => {
    const { syncVirtualNodeToEmbedding } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    await syncVirtualNodeToEmbedding(
      ctx.userId,
      `/skills/${skillId}.md`,
      content,
    );
  })().catch(() => {
    // Best-effort embedding sync
  });

  return { path, created: false };
}

/**
 * Delete a skill via Cortex path.
 * Path: /skills/<uuid>.md
 */
export async function deleteSkillPath(
  ctx: MountWriteContext,
  path: string,
): Promise<VirtualDeleteResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const skillIdSegment = segments[1];
  const skillId = skillIdSegment.replace(/\.md$/, "");

  const { customSkills } =
    await import("@/app/api/[locale]/agent/chat/skills/db");

  const [existing] = await db
    .select({ id: customSkills.id, userId: customSkills.userId })
    .from(customSkills)
    .where(or(eq(customSkills.id, skillId), eq(customSkills.slug, skillId)))
    .limit(1);

  if (!existing || existing.userId !== ctx.userId) {
    return null;
  }

  await db.delete(customSkills).where(eq(customSkills.id, existing.id));

  // Disk write-through — delete from disk
  try {
    const { deleteFromDisk } = await import("../fs-provider/fs-sync");
    await deleteFromDisk(`/skills/${skillId}.md`);
  } catch {
    // Best-effort
  }

  // Fire-and-forget: remove embedding for vector search
  void (async (): Promise<void> => {
    const { removeVirtualNode } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    await removeVirtualNode(ctx.userId, `/skills/${skillId}.md`);
  })().catch(() => {
    // Best-effort embedding removal
  });

  return { path, deleted: true };
}

/**
 * Move/rename a skill via Cortex path.
 * Only supports same-mount moves: /skills/<oldId>.md → /skills/<newSlug>.md
 * Updates the skill's slug to the new filename.
 */
export async function moveSkillPath(
  ctx: MountWriteContext,
  fromPath: string,
  toPath: string,
): Promise<VirtualMoveResult | null> {
  const fromSegments = fromPath.split("/").filter(Boolean);
  const toSegments = toPath.split("/").filter(Boolean);
  if (fromSegments.length < 2 || toSegments.length < 2) {
    return null;
  }

  const sourceId = fromSegments[1].replace(/\.md$/, "");
  const newSlug = toSegments[1].replace(/\.md$/, "");

  if (!sourceId || !newSlug) {
    return null;
  }

  const { customSkills } =
    await import("@/app/api/[locale]/agent/chat/skills/db");

  // Verify source exists and belongs to user (by id or slug)
  const [existing] = await db
    .select({
      id: customSkills.id,
      userId: customSkills.userId,
      slug: customSkills.slug,
    })
    .from(customSkills)
    .where(or(eq(customSkills.id, sourceId), eq(customSkills.slug, sourceId)))
    .limit(1);

  if (!existing || existing.userId !== ctx.userId) {
    return null;
  }

  // Check slug isn't already taken by another skill
  const [conflict] = await db
    .select({ id: customSkills.id })
    .from(customSkills)
    .where(
      and(eq(customSkills.slug, newSlug), eq(customSkills.userId, ctx.userId)),
    )
    .limit(1);

  if (conflict && conflict.id !== existing.id) {
    return null;
  }

  await db
    .update(customSkills)
    .set({ slug: newSlug, updatedAt: new Date() })
    .where(eq(customSkills.id, sourceId));

  // Disk write-through: rename on disk
  try {
    const { deleteFromDisk } = await import("../fs-provider/fs-sync");
    await deleteFromDisk(`/skills/${sourceId}.md`);
    // Re-read and sync to new path
    const readResult = await readSkillPath(ctx.userId, `/skills/${sourceId}`);
    if (readResult) {
      const { syncToDisk } = await import("../fs-provider/fs-sync");
      await syncToDisk(`/skills/${sourceId}.md`, readResult.content);
    }
  } catch {
    // Best-effort
  }

  // Fire-and-forget: update embedding
  void (async (): Promise<void> => {
    const { removeVirtualNode, syncVirtualNodeToEmbedding } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    await removeVirtualNode(ctx.userId, fromPath);
    const readResult = await readSkillPath(ctx.userId, `/skills/${sourceId}`);
    if (readResult) {
      await syncVirtualNodeToEmbedding(ctx.userId, toPath, readResult.content);
    }
  })().catch(() => {
    // Best-effort embedding sync
  });

  return { from: fromPath, to: toPath };
}
