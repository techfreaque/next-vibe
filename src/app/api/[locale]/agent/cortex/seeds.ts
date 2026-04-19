/**
 * Cortex Seeds
 * Runs after memories migration (priority 50). Ensures all cortex_nodes
 * have embeddings and materializes virtual mount data for semantic search.
 *
 * Also scaffolds default folder structure for every user:
 *   /documents/inbox, /projects, /knowledge, /journal, /templates
 *   /memories/identity, /expertise, /context (with atomic starter files)
 *
 * Short, specific filenames → AI knows what each file contains at a glance.
 * Atomic files (< 200 words each) → AI can read entire file in one call.
 */

import { and, eq, inArray } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { CortexNodeType, CortexViewType } from "./enum";

/** Run after memories migration seed */
export const priority = 60;

// ─── Default Folder Scaffold ──────────────────────────────────────────────────

/**
 * Default /documents/ subdirectories.
 * purpose label appears inline in the AI workspace tree.
 */
const DEFAULT_DOCUMENT_DIRS = [
  {
    path: "/documents/inbox",
    purpose:
      "Raw captures: drop here fast, process and file when context is clear",
    icon: "inbox",
    viewType: CortexViewType.LIST,
  },
  {
    path: "/documents/projects",
    purpose: "Active work: one subfolder per project",
    icon: "folder-open",
    viewType: CortexViewType.LIST,
  },
  {
    path: "/documents/knowledge",
    purpose: "Permanent reference: things worth keeping forever",
    icon: "book-open",
    viewType: CortexViewType.WIKI,
  },
  {
    path: "/documents/journal",
    purpose: "Dated entries: ideas, reflections, observations",
    icon: "pen-line",
    viewType: CortexViewType.LIST,
  },
  {
    path: "/documents/templates",
    purpose: "Reusable structures for recurring tasks",
    icon: "layout-template",
    viewType: CortexViewType.LIST,
  },
];

/**
 * Default /memories/ subdirectories + atomic starter files.
 * One file per concept, < 200 words each.
 * Specific names → AI knows exactly what to write without reading the file.
 */
const DEFAULT_MEMORY_GROUPS = [
  {
    dirPath: "/memories/identity",
    purpose: "Who the user is: name, role, goals, communication style",
    files: [
      { name: "name.md", tags: ["identity"], priority: 100 },
      { name: "role.md", tags: ["identity", "work"], priority: 100 },
      { name: "goals.md", tags: ["identity", "goals"], priority: 90 },
      { name: "communication.md", tags: ["identity", "style"], priority: 85 },
    ],
  },
  {
    dirPath: "/memories/expertise",
    purpose: "What the user knows: skills, tools, background",
    files: [
      { name: "skills.md", tags: ["expertise"], priority: 80 },
      { name: "tools.md", tags: ["expertise", "tech"], priority: 75 },
      { name: "background.md", tags: ["expertise"], priority: 70 },
    ],
  },
  {
    dirPath: "/memories/context",
    purpose: "Current situation: active projects, preferences, constraints",
    files: [
      { name: "projects.md", tags: ["context", "projects"], priority: 80 },
      { name: "preferences.md", tags: ["context"], priority: 70 },
      { name: "constraints.md", tags: ["context"], priority: 65 },
    ],
  },
] as const;

/** All default paths we'll ensure exist */
function getAllDefaultPaths(): string[] {
  const paths = ["/documents", "/memories"];
  for (const dir of DEFAULT_DOCUMENT_DIRS) {
    paths.push(dir.path);
  }
  for (const group of DEFAULT_MEMORY_GROUPS) {
    paths.push(group.dirPath);
    for (const file of group.files) {
      paths.push(`${group.dirPath}/${file.name}`);
    }
  }
  return paths;
}

/**
 * Scaffold default folder structure for a single user.
 * Only creates nodes that don't already exist — safe to re-run.
 */
async function scaffoldUser(userId: string): Promise<{ created: number }> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("./db");

  const allDefaultPaths = getAllDefaultPaths();

  const existing = await db
    .select({ path: cortexNodes.path })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        inArray(cortexNodes.path, allDefaultPaths),
      ),
    );

  const existingPaths = new Set(existing.map((r) => r.path));
  const toInsert: (typeof cortexNodes.$inferInsert)[] = [];

  // Root dirs
  for (const rootPath of ["/documents", "/memories"] as const) {
    if (!existingPaths.has(rootPath)) {
      toInsert.push({
        userId,
        path: rootPath,
        nodeType: CortexNodeType.DIR,
        content: null,
        size: 0,
      });
    }
  }

  // /documents/ subdirs
  for (const dir of DEFAULT_DOCUMENT_DIRS) {
    if (!existingPaths.has(dir.path)) {
      toInsert.push({
        userId,
        path: dir.path,
        nodeType: CortexNodeType.DIR,
        content: null,
        size: 0,
        icon: dir.icon,
        viewType: dir.viewType,
        frontmatter: { purpose: dir.purpose },
      });
    }
  }

  // /memories/ subdirs + starter files
  for (const group of DEFAULT_MEMORY_GROUPS) {
    if (!existingPaths.has(group.dirPath)) {
      toInsert.push({
        userId,
        path: group.dirPath,
        nodeType: CortexNodeType.DIR,
        content: null,
        size: 0,
        frontmatter: { purpose: group.purpose },
      });
    }

    for (const file of group.files) {
      const filePath = `${group.dirPath}/${file.name}`;
      if (!existingPaths.has(filePath)) {
        // Minimal frontmatter only — body empty, AI fills in on first exchange
        const content = `---\npriority: ${file.priority}\ntags: [${file.tags.join(", ")}]\n---\n`;
        toInsert.push({
          userId,
          path: filePath,
          nodeType: CortexNodeType.FILE,
          content,
          size: Buffer.byteLength(content, "utf8"),
          frontmatter: { priority: file.priority },
          tags: [...file.tags],
        });
      }
    }
  }

  if (toInsert.length === 0) {
    return { created: 0 };
  }

  // Insert in batches
  const BATCH_SIZE = 50;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    await db.insert(cortexNodes).values(toInsert.slice(i, i + BATCH_SIZE));
  }

  return { created: toInsert.length };
}

/**
 * Scaffold all users who are missing default folder structure.
 */
async function scaffoldDefaultFolders(logger: EndpointLogger): Promise<void> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");

  const allUsers = await db.select({ id: users.id }).from(users);

  if (allUsers.length === 0) {
    logger.info("Cortex scaffold: no users found");
    return;
  }

  let totalCreated = 0;
  let errored = 0;

  for (const user of allUsers) {
    try {
      const result = await scaffoldUser(user.id);
      totalCreated += result.created;
    } catch (err) {
      errored++;
      logger.warn(`Cortex scaffold: failed for user ${user.id}`, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  logger.info(
    `Cortex scaffold: ${allUsers.length} users, ${totalCreated} nodes created, ${errored} errors`,
  );
}

// ─── Main Seed ────────────────────────────────────────────────────────────────

/**
 * Materialize virtual mount data into cortex_nodes and backfill embeddings.
 */
async function runCortexSeed(logger: EndpointLogger): Promise<void> {
  // Step 0: Scaffold default folder structure for all users
  await scaffoldDefaultFolders(logger);

  // Step 1: Materialize virtual mounts (skills, threads, tasks) into cortex_nodes
  await materializeVirtualMounts(logger);

  // Step 2: Materialize built-in skills for all users using cached embeddings
  await materializeBuiltInSkills(logger);

  // Step 3: Backfill embeddings for all nodes with NULL embedding
  const { backfillEmbeddings } = await import("./embeddings/backfill");
  const result = await backfillEmbeddings();

  logger.info(
    `Cortex seed: embeddings backfill complete — ${result.processed} embedded, ${result.failed} failed, ${result.skipped} skipped`,
  );
}

/**
 * Materialize user-created skills, threads, and tasks as cortex_nodes FILE rows
 * so they get embeddings and become searchable via vector search.
 */
async function materializeVirtualMounts(logger: EndpointLogger): Promise<void> {
  const { syncVirtualNodeToEmbedding } =
    await import("./embeddings/sync-virtual");
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

    await syncVirtualNodeToEmbedding(
      skill.userId,
      `/skills/${skill.id}.md`,
      content,
    );
    skillCount++;
  }
  logger.info(`Cortex seed: materialized ${skillCount} user-created skills`);

  // --- Tasks ---
  const { cronTasks } =
    await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
  const allTasks = await db
    .select({
      id: cronTasks.id,
      userId: cronTasks.userId,
      displayName: cronTasks.displayName,
      description: cronTasks.description,
      schedule: cronTasks.schedule,
    })
    .from(cronTasks);

  let taskCount = 0;
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

    await syncVirtualNodeToEmbedding(
      task.userId,
      `/tasks/${task.id}.md`,
      content,
    );
    taskCount++;
  }
  logger.info(`Cortex seed: materialized ${taskCount} tasks`);

  // --- Threads ---
  // Only materialize threads with recent activity (last 100 threads per user)
  // to avoid embedding thousands of old conversations
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const { chatMessages } = await import("@/app/api/[locale]/agent/chat/db");
  const { desc, sql } = await import("drizzle-orm");

  // Per-user limit via window function — each user gets their most recent 100 threads
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

    await syncVirtualNodeToEmbedding(
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
 * No API calls — the file is the source of truth.
 */
async function materializeBuiltInSkills(logger: EndpointLogger): Promise<void> {
  const { syncVirtualNodeWithCachedEmbedding } =
    await import("./embeddings/sync-virtual");
  const { db } = await import("@/app/api/[locale]/system/db");
  const { users } = await import("@/app/api/[locale]/user/db");

  const { DEFAULT_SKILLS } =
    await import("@/app/api/[locale]/system/generated/skills-index");

  // Only process skills that have inline embeddings
  const skillsWithEmbeddings = DEFAULT_SKILLS.filter(
    (s) => s.embedding && s.embeddingHash && s.embedding.length > 0,
  );

  if (skillsWithEmbeddings.length === 0) {
    logger.info(
      "Cortex seed: no built-in skills have embeddings — run vibe gen first",
    );
    return;
  }

  const allUsers = await db.select({ id: users.id }).from(users);

  let totalCount = 0;
  for (const user of allUsers) {
    for (const skill of skillsWithEmbeddings) {
      const path = `/skills/default/${skill.id}.md`;
      const content = [`# ${skill.id}`, "", skill.systemPrompt].join("\n");

      await syncVirtualNodeWithCachedEmbedding(
        user.id,
        path,
        content,
        skill.embeddingHash!,
        skill.embedding!,
      );
      totalCount++;
    }
  }

  logger.info(
    `Cortex seed: materialized ${skillsWithEmbeddings.length} built-in skills × ${allUsers.length} users = ${totalCount} nodes`,
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
