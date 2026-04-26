/**
 * Cortex Seeds
 * Runs after memories migration (priority 50).
 *
 * Templates (memory scaffolds, document templates) and default folder scaffolds
 * are now fully virtual - resolved at request time from i18n translations per
 * locale. Nothing is written to DB for templates or scaffolds.
 *
 * This seed only materializes:
 *   - Virtual mount data (skills, threads, tasks) into cortex_nodes
 *   - Built-in skills with pre-computed embeddings
 */

import { eq } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/** Run after memories migration seed */
export const priority = 60;

// ─── Main Seed ────────────────────────────────────────────────────────────────

/**
 * Materialize virtual mount data into cortex_nodes and backfill embeddings.
 */
async function runCortexSeed(logger: EndpointLogger): Promise<void> {
  // Step 1: Ensure scaffold dirs (memories + documents) exist for all users
  await ensureScaffoldDirs(logger);

  // Step 2: Materialize virtual mounts (skills, threads, tasks) into cortex_nodes
  await materializeVirtualMounts(logger);

  // Step 3: Materialize built-in skills for all users using cached embeddings
  await materializeBuiltInSkills(logger);

  // NOTE: No synchronous backfill here. Virtual mount nodes (threads, skills,
  // tasks) that need embeddings use fire-and-forget queueEmbedding() which runs
  // post-startup without blocking. Built-in skills ship with pre-computed
  // embeddings (vibe gen). Manual recovery: POST /agent/cortex/embeddings/backfill
}

/**
 * Ensure scaffold directories exist in cortex_nodes for all users.
 * /memories/inbox, /memories/identity, /memories/expertise, /memories/context, /memories/life
 * /documents/inbox, /documents/projects, /documents/knowledge, /documents/journal, /documents/templates
 * Idempotent via onConflictDoNothing.
 */
async function ensureScaffoldDirs(logger: EndpointLogger): Promise<void> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");
  const { cortexNodes } = await import("./db");
  const { CortexNodeType } = await import("./enum");

  const SCAFFOLD_DIRS = [
    "/memories",
    "/memories/inbox",
    "/memories/identity",
    "/memories/expertise",
    "/memories/context",
    "/memories/life",
    "/documents",
    "/documents/inbox",
    "/documents/projects",
    "/documents/knowledge",
    "/documents/journal",
    "/documents/templates",
  ];

  const allUsers = await db.select({ id: users.id }).from(users);
  let created = 0;

  for (const user of allUsers) {
    for (const dirPath of SCAFFOLD_DIRS) {
      const result = await db
        .insert(cortexNodes)
        .values({
          userId: user.id,
          path: dirPath,
          nodeType: CortexNodeType.DIR,
          content: null,
          size: 0,
        })
        .onConflictDoNothing()
        .returning({ id: cortexNodes.id });
      if (result.length > 0) {
        created++;
      }
    }
  }

  logger.info(
    `Cortex seed: ensured scaffold dirs (${created} created) for ${allUsers.length} users`,
  );
}

/**
 * Materialize user-created skills, threads, and tasks as cortex_nodes FILE rows
 * so they get embeddings and become searchable via vector search.
 */
async function materializeVirtualMounts(logger: EndpointLogger): Promise<void> {
  const { upsertVirtualNode } = await import("./embeddings/sync-virtual");
  const { db } = await import("@/app/api/[locale]/system/db");

  // --- User-created Skills ---
  const { customSkills } =
    await import("@/app/api/[locale]/agent/chat/skills/db");
  const allSkills = await db
    .select({
      id: customSkills.id,
      userId: customSkills.userId,
      name: customSkills.name,
      description: customSkills.description,
      tagline: customSkills.tagline,
      systemPrompt: customSkills.systemPrompt,
    })
    .from(customSkills);

  let skillCount = 0;
  for (const skill of allSkills) {
    const content = [
      `# ${skill.name}`,
      skill.tagline ? `> ${skill.tagline}` : "",
      skill.description ?? "",
      "",
      skill.systemPrompt ?? "",
    ]
      .filter(Boolean)
      .join("\n");

    await upsertVirtualNode(skill.userId, `/skills/${skill.id}.md`, content);
    skillCount++;
  }
  logger.info(`Cortex seed: materialized ${skillCount} user-created skills`);

  // --- Tasks ---
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
  const {
    eq: eqHidden,
    and: andTask,
    or: orTask,
  } = await import("drizzle-orm");
  // Exclude: hidden tasks, and run-once tasks that have been disabled (already ran)
  const allTasks = await db
    .select({
      id: cronTasks.id,
      userId: cronTasks.userId,
      displayName: cronTasks.displayName,
      description: cronTasks.description,
      schedule: cronTasks.schedule,
    })
    .from(cronTasks)
    .where(
      andTask(
        eqHidden(cronTasks.hidden, false),
        orTask(
          eqHidden(cronTasks.runOnce, false),
          eqHidden(cronTasks.enabled, true),
        ),
      ),
    );

  let taskCount = 0;
  const activePaths = new Set<string>();
  for (const task of allTasks) {
    if (!task.userId) {
      continue;
    }
    const content = [
      `# ${task.displayName ?? task.id}`,
      task.schedule ? `Schedule: ${task.schedule}` : "",
      "",
      task.description ?? "",
    ]
      .filter(Boolean)
      .join("\n");

    await upsertVirtualNode(task.userId, `/tasks/${task.id}.md`, content);
    activePaths.add(`/tasks/${task.id}.md`);
    taskCount++;
  }
  logger.info(`Cortex seed: materialized ${taskCount} tasks`);

  // Clean up stale task cortex nodes (hidden/disabled run-once tasks)
  const { like: likeTask } = await import("drizzle-orm");
  const { cortexNodes: cortexNodesForClean } = await import("./db");
  const staleTaskNodes = await db
    .select({ id: cortexNodesForClean.id, path: cortexNodesForClean.path })
    .from(cortexNodesForClean)
    .where(likeTask(cortexNodesForClean.path, "/tasks/%"));

  const toDelete = staleTaskNodes.filter((n) => !activePaths.has(n.path));
  if (toDelete.length > 0) {
    const { inArray: inArrayDel } = await import("drizzle-orm");
    await db.delete(cortexNodesForClean).where(
      inArrayDel(
        cortexNodesForClean.id,
        toDelete.map((n) => n.id),
      ),
    );
    logger.info(`Cortex seed: deleted ${toDelete.length} stale task nodes`);
  }

  // --- Threads ---
  // Only materialize threads with recent activity (last 100 threads per user)
  // to avoid embedding thousands of old conversations
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
  const { desc, sql } = await import("drizzle-orm");

  // Per-user limit via window function - each user gets their most recent 100 threads
  const recentThreads = await db
    .select({
      id: chatThreads.id,
      userId: chatThreads.userId,
      title: chatThreads.title,
      rootFolderId: chatThreads.rootFolderId,
    })
    .from(chatThreads)
    .where(
      sql`${chatThreads.id} IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) AS rn
          FROM chat_threads
        ) ranked WHERE rn <= 100
      )`,
    )
    .orderBy(desc(chatThreads.updatedAt));

  let threadCount = 0;
  for (const thread of recentThreads) {
    if (!thread.userId) {
      continue;
    }
    // Get last 20 messages for embedding context
    const messages = await db
      .select({
        role: chatMessages.role,
        content: chatMessages.content,
      })
      .from(chatMessages)
      .where(eq(chatMessages.threadId, thread.id))
      .orderBy(desc(chatMessages.createdAt))
      .limit(20);

    if (messages.length === 0) {
      continue;
    }

    const messageLines = messages
      .toReversed()
      .map((m) => `${m.role}: ${(m.content ?? "").slice(0, 500)}`)
      .join("\n");

    const content = [
      `# ${thread.title ?? "Untitled"}`,
      `Folder: ${thread.rootFolderId}`,
      "",
      messageLines,
    ].join("\n");

    const slug = (thread.title ?? "thread")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .slice(0, 50);

    await upsertVirtualNode(
      thread.userId,
      `/threads/${thread.rootFolderId}/${slug}-${thread.id}.md`,
      content,
    );
    threadCount++;
  }
  logger.info(`Cortex seed: materialized ${threadCount} threads`);
}

/**
 * Materialize built-in skills into cortex_nodes for all users.
 * Reads pre-computed embeddings directly from skill.ts files (written by `vibe gen`).
 * No API calls - the file is the source of truth.
 */
async function materializeBuiltInSkills(logger: EndpointLogger): Promise<void> {
  const { syncVirtualNodeWithCachedEmbedding, upsertVirtualNode } =
    await import("./embeddings/sync-virtual");
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");

  const { DEFAULT_SKILLS, DEFAULT_SKILL_EMBEDDINGS } =
    await import("@/app/api/[locale]/system/generated/skills-index");

  // Build skillId → embedding map
  const embedMap = new Map(
    (DEFAULT_SKILL_EMBEDDINGS ?? [])
      .filter(
        (e): e is NonNullable<typeof e> =>
          e !== null &&
          e !== undefined &&
          Boolean(e.embeddingHash) &&
          e.embedding.length > 0,
      )
      .map((e) => [e.skillId, e]),
  );

  const embeddedCount = embedMap.size;
  const allUsers = await db.select({ id: users.id }).from(users);

  let totalCount = 0;
  for (const user of allUsers) {
    for (const skill of DEFAULT_SKILLS) {
      const path = `/skills/default/${skill.id}.md`;
      const content = [`# ${skill.id}`, "", skill.systemPrompt].join("\n");
      const emb = embedMap.get(skill.id);

      if (emb) {
        await syncVirtualNodeWithCachedEmbedding(
          user.id,
          path,
          content,
          emb.embeddingHash,
          emb.embedding,
        );
      } else {
        await upsertVirtualNode(user.id, path, content);
      }
      totalCount++;
    }
  }

  logger.info(
    `Cortex seed: materialized ${DEFAULT_SKILLS.length} built-in skills (${embeddedCount} with embeddings) × ${allUsers.length} users = ${totalCount} nodes`,
  );
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await runCortexSeed(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await runCortexSeed(logger);
}

export async function test(): Promise<void> {
  // No-op in test
}
