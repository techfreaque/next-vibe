import "server-only";

/**
 * Skills Virtual Mount
 *
 * Structure:
 *   /skills/                           → all own + favorited skills
 *   /skills/<slug>-<variantId>.md      → specific variant of a skill
 *   /skills/<slug>.md                  → skill with single/default variant
 *
 * Each skill variant is its own file. Filename = <skill-slug>-<variant-id>.md
 * Skills with no variants or a single default variant use <skill-slug>.md
 */
import { and, count as drizzleCount, eq, inArray, or } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  MountWriteContext,
  VirtualDeleteResult,
  VirtualListEntry,
  VirtualMoveResult,
  VirtualReadResult,
  VirtualWriteResult,
} from "./resolver";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Build the canonical filename for a skill variant */
function variantFileName(slug: string, variantId: string | null): string {
  if (!variantId || variantId === "default") {
    return `${slug}.md`;
  }
  return `${slug}-${variantId}.md`;
}

/**
 * Parse a cortex path segment back to { slug, variantId }
 * "/skills/vibe-coder-max.md" → { slug: "vibe-coder", variantId: "max" }  — resolved by DB lookup
 * We just return the raw segment and let the DB query resolve it.
 */
function parseSegment(segment: string): string {
  return segment.replace(/\.md$/, "");
}

/**
 * Render a skill variant as markdown
 */
async function renderSkillVariant(
  skill: {
    id: string;
    slug: string | null;
    name: string | null;
    systemPrompt: string | null;
    ownershipType: string | null;
    createdAt: Date;
    updatedAt: Date;
    variants: Array<{
      id: string;
      displayName?: string;
      isDefault?: boolean;
      modelSelection?: { manualModelId?: string; selectionType?: string };
    }> | null;
  },
  variant: {
    id: string;
    displayName?: string;
    isDefault?: boolean;
    modelSelection?: { manualModelId?: string; selectionType?: string };
  } | null,
  locale?: CountryLanguage,
): Promise<VirtualReadResult> {
  const slug = skill.slug ?? skill.id;
  const variantId = variant?.id ?? null;

  const fm = ["---", `skillId: "${skill.id}"`, `slug: "${slug}"`];

  const { scopedTranslation: skillsT } =
    await import("@/app/api/[locale]/agent/skills/i18n");
  const { t } = skillsT.scopedT(locale ?? "en-US");

  if (variant) {
    fm.push(`variantId: "${variant.id}"`);
    if (variant.displayName) {
      fm.push(`variantName: "${variant.displayName.replace(/"/g, '\\"')}"`);
    }
    if (variant.isDefault) {
      fm.push(`isDefault: true`);
    }
    if (variant.modelSelection) {
      const m = variant.modelSelection;
      if (m.manualModelId) {
        fm.push(`model: "${m.manualModelId}"`);
      } else if (m.selectionType) {
        fm.push(`model: "${t(m.selectionType as Parameters<typeof t>[0])}"`);
      } else {
        fm.push(`model: "filters"`);
      }
    }
  }

  if (skill.name) {
    fm.push(`name: "${skill.name.replace(/"/g, '\\"')}"`);
  }
  if (skill.ownershipType) {
    fm.push(
      `ownership: "${t(skill.ownershipType as Parameters<typeof t>[0])}"`,
    );
  }

  const allVariants = skill.variants ?? [];
  if (allVariants.length > 1) {
    const others = allVariants
      .filter((v) => v.id !== variantId)
      .map((v) => variantFileName(slug, v.id));
    if (others.length > 0) {
      fm.push(`otherVariants: [${others.map((o) => `"${o}"`).join(", ")}]`);
    }
  }

  fm.push(`created: "${skill.createdAt.toISOString()}"`, "---");

  const body = skill.systemPrompt ?? "";
  return {
    content: `${fm.join("\n")}\n\n${body}`,
    nodeType: "file",
    updatedAt: skill.updatedAt.toISOString(),
  };
}

/**
 * Read a skill variant as markdown.
 * Path: /skills/<slug>-<variantId>.md  or  /skills/<slug>.md  or  /skills/<uuid>.md
 */
export async function readSkillPath(
  userId: string,
  path: string,
  locale?: CountryLanguage,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const raw = parseSegment(segments[1]!);
  const { customSkills } = await import("@/app/api/[locale]/agent/skills/db");

  // Load all accessible skills (own + favorited)
  const { chatFavorites } =
    await import("@/app/api/[locale]/agent/skills/favorites/db");

  const favRows = await db
    .select({ skillId: chatFavorites.skillId })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

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

  const rows = await db.select().from(customSkills).where(whereClause);

  // Find matching skill + variant from the filename segment
  // Filename format: <slug>-<variantId>.md or <slug>.md or <uuid>.md
  for (const skill of rows) {
    const slug = skill.slug ?? skill.id;
    const variants = skill.variants ?? [];

    // Exact UUID match → return default variant
    if (UUID_RE.test(raw) && skill.id === raw) {
      const defaultVariant =
        variants.find((v) => v.isDefault) ?? variants[0] ?? null;
      return renderSkillVariant(skill, defaultVariant, locale);
    }

    // Exact slug match → return default variant
    if (raw === slug) {
      const defaultVariant =
        variants.find((v) => v.isDefault) ?? variants[0] ?? null;
      return renderSkillVariant(skill, defaultVariant, locale);
    }

    // Try <slug>-<variantId> match
    if (raw.startsWith(`${slug}-`)) {
      const variantId = raw.slice(slug.length + 1);
      const variant = variants.find((v) => v.id === variantId);
      if (variant) {
        return renderSkillVariant(skill, variant, locale);
      }
    }
  }

  return null;
}

/**
 * List skills - own + favorited, one entry per variant.
 * Single-variant skills → <slug>.md
 * Multi-variant skills → <slug>-<variantId>.md per variant
 */
export async function listSkillPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path !== "/skills") {
    return [];
  }

  const [{ customSkills }, { chatFavorites }] = await Promise.all([
    import("@/app/api/[locale]/agent/skills/db"),
    import("@/app/api/[locale]/agent/skills/favorites/db"),
  ]);

  const favRows = await db
    .select({ skillId: chatFavorites.skillId })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

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
    .select()
    .from(customSkills)
    .where(whereClause)
    .orderBy(customSkills.name);

  const entries: VirtualListEntry[] = [];

  for (const s of rows) {
    const slug = s.slug ?? s.id;
    const variants = s.variants ?? [];
    const promptSize = s.systemPrompt
      ? Buffer.byteLength(s.systemPrompt, "utf8")
      : 0;

    if (variants.length <= 1) {
      // Single variant or no variants → one file
      const variantId = variants[0]?.id ?? null;
      const fileName = variantFileName(slug, variantId);
      entries.push({
        name: fileName,
        path: `/skills/${fileName.replace(/\.md$/, "")}`,
        nodeType: "file" as const,
        size: promptSize,
        updatedAt: s.updatedAt.toISOString(),
      });
    } else {
      // Multiple variants → one file per variant
      for (const v of variants) {
        const fileName = variantFileName(slug, v.id);
        entries.push({
          name: fileName,
          path: `/skills/${fileName.replace(/\.md$/, "")}`,
          nodeType: "file" as const,
          size: promptSize,
          updatedAt: s.updatedAt.toISOString(),
        });
      }
    }
  }

  return entries;
}

/**
 * Get skill count - own + favorited (total variants)
 */
export async function getSkillCount(userId: string): Promise<number> {
  const [{ customSkills }, { chatFavorites }] = await Promise.all([
    import("@/app/api/[locale]/agent/skills/db"),
    import("@/app/api/[locale]/agent/skills/favorites/db"),
  ]);

  const favRows = await db
    .select({ skillId: chatFavorites.skillId })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));

  const UUID_RE_LOCAL =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const favSkillIds = [
    ...new Set(
      favRows.map((r) => r.skillId).filter((id) => UUID_RE_LOCAL.test(id)),
    ),
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

export async function writeSkillPath(
  ctx: MountWriteContext,
  path: string,
  content: string,
): Promise<VirtualWriteResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const raw = parseSegment(segments[1]!);
  const parsed = parseSkillMarkdown(content);

  const { customSkills } = await import("@/app/api/[locale]/agent/skills/db");

  // Find the skill: try UUID first, then slug, then slug-variantId prefix
  const rows = await db
    .select({
      id: customSkills.id,
      slug: customSkills.slug,
      userId: customSkills.userId,
    })
    .from(customSkills)
    .where(eq(customSkills.userId, ctx.user.id));

  let targetId: string | null = null;
  for (const s of rows) {
    const slug = s.slug ?? s.id;
    if (UUID_RE.test(raw) && s.id === raw) {
      targetId = s.id;
      break;
    }
    if (raw === slug || raw.startsWith(`${slug}-`)) {
      targetId = s.id;
      break;
    }
  }

  if (!targetId) {
    return null;
  }

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
    .where(eq(customSkills.id, targetId));

  void (async (): Promise<void> => {
    const { syncVirtualNodeToEmbedding } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    await syncVirtualNodeToEmbedding(ctx.userId, path, content);
  })().catch(() => {
    // Best-effort embedding sync
  });

  return { path, created: false };
}

export async function deleteSkillPath(
  ctx: MountWriteContext,
  path: string,
): Promise<VirtualDeleteResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const raw = parseSegment(segments[1]!);
  const { customSkills } = await import("@/app/api/[locale]/agent/skills/db");

  const rows = await db
    .select({
      id: customSkills.id,
      slug: customSkills.slug,
      userId: customSkills.userId,
    })
    .from(customSkills)
    .where(eq(customSkills.userId, ctx.userId));

  let targetId: string | null = null;
  for (const s of rows) {
    const slug = s.slug ?? s.id;
    if (UUID_RE.test(raw) && s.id === raw) {
      targetId = s.id;
      break;
    }
    if (raw === slug || raw.startsWith(`${slug}-`)) {
      targetId = s.id;
      break;
    }
  }

  if (!targetId) {
    return null;
  }

  await db.delete(customSkills).where(eq(customSkills.id, targetId));

  void (async (): Promise<void> => {
    const { removeVirtualNode } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    await removeVirtualNode(ctx.userId, path);
  })().catch(() => {
    // Best-effort embedding sync
  });

  return { path, deleted: true };
}

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

  const sourceRaw = parseSegment(fromSegments[1]!);
  const newSlug = parseSegment(toSegments[1]!);

  if (!sourceRaw || !newSlug) {
    return null;
  }

  const { customSkills } = await import("@/app/api/[locale]/agent/skills/db");

  const rows = await db
    .select({
      id: customSkills.id,
      slug: customSkills.slug,
      userId: customSkills.userId,
    })
    .from(customSkills)
    .where(eq(customSkills.userId, ctx.userId));

  let targetId: string | null = null;
  for (const s of rows) {
    const slug = s.slug ?? s.id;
    if (UUID_RE.test(sourceRaw) && s.id === sourceRaw) {
      targetId = s.id;
      break;
    }
    if (sourceRaw === slug || sourceRaw.startsWith(`${slug}-`)) {
      targetId = s.id;
      break;
    }
  }

  if (!targetId) {
    return null;
  }

  // Use base slug (strip variant suffix) as new slug
  const baseNewSlug = newSlug.includes("-")
    ? newSlug.split("-").slice(0, -1).join("-") || newSlug
    : newSlug;

  const [conflict] = await db
    .select({ id: customSkills.id })
    .from(customSkills)
    .where(
      and(
        eq(customSkills.slug, baseNewSlug),
        eq(customSkills.userId, ctx.userId),
      ),
    )
    .limit(1);

  if (conflict && conflict.id !== targetId) {
    return null;
  }

  await db
    .update(customSkills)
    .set({ slug: baseNewSlug, updatedAt: new Date() })
    .where(eq(customSkills.id, targetId));

  void (async (): Promise<void> => {
    const { removeVirtualNode, syncVirtualNodeToEmbedding } =
      await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
    await removeVirtualNode(ctx.userId, fromPath);
    const readResult = await readSkillPath(ctx.userId, toPath);
    if (readResult) {
      await syncVirtualNodeToEmbedding(ctx.userId, toPath, readResult.content);
    }
  })().catch(() => {
    // Best-effort embedding sync
  });

  return { from: fromPath, to: toPath };
}
