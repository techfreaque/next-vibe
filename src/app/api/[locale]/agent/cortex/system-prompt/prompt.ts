/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import { stripFrontmatter as stripMemoryFrontmatter } from "../_shared/text-utils";
import {
  CORTEX_DELETE_ALIAS,
  CORTEX_EDIT_ALIAS,
  CORTEX_LIST_ALIAS,
  CORTEX_MKDIR_ALIAS,
  CORTEX_MOVE_ALIAS,
  CORTEX_READ_ALIAS,
  CORTEX_SEARCH_ALIAS,
  CORTEX_TREE_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../constants";

export interface CortexMemory {
  /** Path in cortex filesystem, e.g. /memories/identity/name.md */
  path: string;
  /** Memory content */
  content: string;
  /** Priority (higher = more important, default 0) */
  priority: number;
  /** Tags for categorization */
  tags: string[];
  /** Creation timestamp ISO string */
  createdAt: string;
}

/** A cortex node matched by vector search for context injection */
export interface CortexRelevantNode {
  /** File path in cortex */
  path: string;
  /** Content excerpt */
  excerpt: string;
  /** Similarity score 0-1 */
  score: number;
}

/**
 * One top-level /documents/ subdirectory with even-spread file trimming.
 * Prevents context explosion for heavy users.
 */
export interface TrimmedDirNode {
  /** Path of the directory, e.g. /documents/inbox */
  path: string;
  /** Total file count under this dir (any depth) */
  fileCount: number;
  /** Most-recently-updated files up to the per-dir slot limit */
  shownFiles: string[];
  /** Files beyond the slot limit, not shown */
  hiddenCount: number;
  /** Purpose label from frontmatter, if set */
  purpose?: string;
}

export interface CortexData {
  /** Compact tree string showing document files (legacy, used as fallback) */
  compactTree: string;
  /** Number of document workspace files */
  documentCount: number;
  /** Thread counts by root folder */
  threadCounts: Record<string, number>;
  /** Total thread count */
  totalThreads: number;
  /** Active memory count */
  activeMemories: number;
  /** Archived memory count */
  archivedMemories: number;
  /** Skill count */
  skillCount: number;
  /** Task count */
  taskCount: number;
  /** Total chat upload count */
  uploadCount: number;
  /** Total web search result count */
  searchCount: number;
  /** User memories loaded from /memories/ */
  memories: CortexMemory[];
  /** Whether memory usage is near the token limit */
  nearLimit?: boolean;
  /** Current total token usage for memories */
  totalTokens?: number;
  /** Vector-matched relevant nodes for context injection */
  relevantContext?: CortexRelevantNode[];
  /** Even-spread trimmed document tree */
  trimmedDirs: TrimmedDirNode[];
  /** Top 6 user skill names for inline display */
  skillNames: string[];
  /** Map of /documents/ subdir path → purpose label */
  dirPurposes: Record<string, string>;
}

/** Default total char budget for memories (~2000 tokens — more room now that files are atomic) */
const DEFAULT_MEMORY_BUDGET_TOKENS = 2000;
const CHARS_PER_TOKEN = 4;

export const cortexFragment: SystemPromptFragment<CortexData> = {
  id: "cortex",
  placement: "trailing",
  priority: 190,
  build: (data) => {
    const {
      documentCount,
      totalThreads,
      threadCounts,
      activeMemories,
      archivedMemories,
      skillCount,
      skillNames,
      taskCount,
      memories,
      nearLimit,
      totalTokens,
      relevantContext,
      trimmedDirs,
      compactTree,
    } = data;

    const isEmptyWorkspace =
      documentCount === 0 &&
      activeMemories === 0 &&
      totalThreads === 0 &&
      skillCount === 0 &&
      data.uploadCount === 0 &&
      data.searchCount === 0;

    // Build filesystem overview
    const tree = buildWorkspaceTree({
      trimmedDirs,
      compactTree,
      documentCount,
      totalThreads,
      threadCounts,
      activeMemories,
      archivedMemories,
      skillCount,
      skillNames,
      taskCount,
      uploadCount: data.uploadCount,
      searchCount: data.searchCount,
    });

    // Build memory section
    const memorySection = buildMemorySection(memories, nearLimit, totalTokens);

    // Build relevant context section (vector-matched nodes)
    const contextSection = buildRelevantContextSection(relevantContext);

    const emptyNotice = isEmptyWorkspace
      ? `\n🌱 Empty workspace — scaffold is ready.\nFirst task: learn the user's name, role, and what they're working on. Write atomic files to /memories/identity/ immediately.\n`
      : "";

    return `## Your Memory System (Cortex)
Persistent brain shared between you and the user. Grows with every conversation.
Everything important — identity, projects, knowledge, preferences — lives here as files you read and write directly.
Treat it like a second brain: capture fast, organize always, never let it go stale.
${emptyNotice}
${tree}

**Tools:**
- \`${CORTEX_WRITE_ALIAS}\` — create/overwrite a file
- \`${CORTEX_EDIT_ALIAS}\` — find/replace or line-range edit
- \`${CORTEX_READ_ALIAS}\` — read a file
- \`${CORTEX_LIST_ALIAS}\` / \`${CORTEX_TREE_ALIAS}\` — browse directories
- \`${CORTEX_SEARCH_ALIAS}\` — find by name, content, or meaning
- \`${CORTEX_MOVE_ALIAS}\` — rename or relocate
- \`${CORTEX_DELETE_ALIAS}\` — remove files or folders
- \`${CORTEX_MKDIR_ALIAS}\` — create a directory

**How to use this brain:**
- Capture now, organize immediately — never defer
- One file per atomic idea. Short files (< 200 words). Split when growing.
- Naming: specific-kebab-case.md (not "notes.md" → "react-query-caching-issue.md")
- New user info → /memories/<topic>/<specific>.md — one concept per file
- Active work → /documents/projects/<project-name>/
- Things to look up again → /documents/knowledge/
- Memory priority: 100=identity/critical, 50=useful context, 0=low signal
- Memory file > 200 words? Split into subfolder with atomic files
- Consolidate duplicates proactively. Archive (\`archived: true\` in frontmatter) — never delete unless truly junk.

${memorySection}
${contextSection}`;
  },
};

// ─── Workspace Tree ───────────────────────────────────────────────────────────

interface WorkspaceTreeParams {
  trimmedDirs: TrimmedDirNode[];
  compactTree: string;
  documentCount: number;
  totalThreads: number;
  threadCounts: Record<string, number>;
  activeMemories: number;
  archivedMemories: number;
  skillCount: number;
  skillNames: string[];
  taskCount: number;
  uploadCount: number;
  searchCount: number;
}

function buildWorkspaceTree(params: WorkspaceTreeParams): string {
  const {
    trimmedDirs,
    compactTree,
    documentCount,
    totalThreads,
    threadCounts,
    activeMemories,
    archivedMemories,
    skillCount,
    skillNames,
    taskCount,
    uploadCount,
    searchCount,
  } = params;

  const lines: string[] = [];

  // /documents/ — trimmed tree with per-dir purpose labels
  if (documentCount > 0 || trimmedDirs.length > 0) {
    if (trimmedDirs.length > 0) {
      lines.push(`/documents/ (${documentCount} files)`);
      for (const dir of trimmedDirs) {
        const dirName = dir.path.replace("/documents/", "");
        const purposeNote = dir.purpose
          ? ` ← ${dir.purpose.split(":")[0]}`
          : "";
        const countNote =
          dir.fileCount === 0
            ? " (empty)"
            : dir.hiddenCount > 0
              ? ` (${dir.fileCount} files)`
              : dir.fileCount > 0
                ? ` (${dir.fileCount} files)`
                : "";
        lines.push(`  ${dirName}/${purposeNote}${countNote}`);
        for (const filePath of dir.shownFiles) {
          const fileName = filePath.replace(`${dir.path}/`, "");
          lines.push(`    ${fileName}`);
        }
        if (dir.hiddenCount > 0) {
          lines.push(`    (+${dir.hiddenCount} more)`);
        }
      }
    } else if (compactTree) {
      // Fallback: compact tree (no subdirs in DB yet)
      const truncNote =
        documentCount > 20 ? `, ${documentCount - 20} more` : "";
      lines.push(
        `/documents/ (${documentCount} files${truncNote})\n${compactTree}`,
      );
    } else {
      lines.push(`/documents/ (${documentCount} files)`);
    }
  } else {
    lines.push(
      "/documents/  (empty — /inbox, /projects, /knowledge, /journal, /templates ready)",
    );
  }

  // /memories/
  if (activeMemories > 0 || archivedMemories > 0) {
    const archive =
      archivedMemories > 0 ? `, ${archivedMemories} archived` : "";
    lines.push(`/memories/ (${activeMemories} active${archive})`);
  } else {
    lines.push(
      "/memories/  (empty — /identity, /expertise, /context scaffold ready)",
    );
  }

  // /threads/
  if (totalThreads > 0) {
    const parts = Object.entries(threadCounts)
      .filter(([, c]) => c > 0)
      .map(([root, c]) => `${root}: ${c}`);
    lines.push(
      `/threads/ (${totalThreads}${parts.length > 0 ? ` — ${parts.join(", ")}` : ""})`,
    );
  }

  // /skills/
  if (skillCount > 0) {
    const nameStr = skillNames.length > 0 ? ` — ${skillNames.join(" · ")}` : "";
    lines.push(`/skills/ (${skillCount}${nameStr})`);
  }

  // /tasks/
  if (taskCount > 0) {
    lines.push(`/tasks/ (${taskCount})`);
  }

  // /uploads/
  if (uploadCount > 0) {
    lines.push(
      `/uploads/ (${uploadCount} — images, documents, audio, video, other)`,
    );
  }

  // /searches/
  if (searchCount > 0) {
    lines.push(`/searches/ (${searchCount} — by month)`);
  }

  return lines.join("\n");
}

// ─── Memory Section ───────────────────────────────────────────────────────────

/**
 * Build the memories subsection grouped by subfolder.
 * Short atomic files = full content fits in budget.
 * Groups by the first path segment under /memories/.
 */
function buildMemorySection(
  memories: CortexMemory[],
  nearLimit?: boolean,
  totalTokens?: number,
): string {
  const nearLimitNotice =
    nearLimit && totalTokens !== undefined
      ? `\n⚠️ **Memory near limit** (~${totalTokens.toLocaleString()} tokens). Consolidate or archive before adding more.\n`
      : "";

  const management = `**Memory management:** \`${CORTEX_WRITE_ALIAS} --path="/memories/identity/name.md"\` · \`${CORTEX_EDIT_ALIAS}\` · \`${CORTEX_READ_ALIAS}\`
**Store proactively:** don't wait to be asked — write immediately when you learn something important.`;

  if (memories.length === 0) {
    return `## Memories (0)
No memories yet. Start writing atomic files to /memories/identity/ — name, role, goals, communication style.

${management}`;
  }

  // Sort: priority desc, then newest first
  const sorted = [...memories].toSorted((a, b) => {
    const pDiff = b.priority - a.priority;
    if (pDiff !== 0) {
      return pDiff;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Token budget — shared across all memories
  const totalBudgetChars = DEFAULT_MEMORY_BUDGET_TOKENS * CHARS_PER_TOKEN;

  // Group by subfolder (first segment under /memories/)
  const groups = new Map<string, CortexMemory[]>();
  for (const m of sorted) {
    const relPath = m.path.replace("/memories/", "");
    const parts = relPath.split("/");
    // If there's a subfolder (e.g. identity/name.md), group by it; else "."
    const groupKey = parts.length > 1 ? (parts[0] ?? ".") : ".";
    const g = groups.get(groupKey);
    if (g) {
      g.push(m);
    } else {
      groups.set(groupKey, [m]);
    }
  }

  const totalCount = memories.length;
  const perMemoryBudget = Math.floor(
    totalBudgetChars / Math.max(1, totalCount),
  );

  const sections: string[] = [];

  for (const [groupKey, groupMemories] of groups) {
    const groupHeader =
      groupKey === "."
        ? `/memories/ (${groupMemories.length} files)`
        : `/memories/${groupKey}/ (${groupMemories.length} files)`;

    const lines = groupMemories.map((m) => {
      const fileName = m.path.split("/").pop() ?? m.path;
      const tagStr = m.tags.length > 0 ? ` [${m.tags.join(",")}]` : "";
      const prefix = `  [${fileName}|P:${m.priority}] `;
      const suffix = tagStr;
      const contentBudget = perMemoryBudget - prefix.length - suffix.length - 1;
      const stripped = stripMemoryFrontmatter(m.content);
      const content =
        contentBudget > 0 && stripped.length > contentBudget
          ? `${stripped.slice(0, contentBudget - 1)}…`
          : stripped;
      return `${prefix}${content}${suffix}`;
    });

    sections.push(`${groupHeader}\n${lines.join("\n")}`);
  }

  const tokenInfo =
    totalTokens !== undefined
      ? `, ~${totalTokens.toLocaleString()} tokens`
      : "";

  return `## Memories (${memories.length} active${tokenInfo})
${nearLimitNotice}${sections.join("\n\n")}

${management}`;
}

// ─── Relevant Context ─────────────────────────────────────────────────────────

/** Mount type labels for grouped display */
const MOUNT_LABELS: Record<string, string> = {
  memories: "Memories",
  documents: "Documents",
  skills: "Skills",
  threads: "Threads",
  tasks: "Tasks",
  uploads: "Uploads",
  searches: "Searches",
};

function buildRelevantContextSection(nodes?: CortexRelevantNode[]): string {
  if (!nodes || nodes.length === 0) {
    return "";
  }

  // Group nodes by mount type for scanability
  const groups = new Map<string, CortexRelevantNode[]>();
  for (const node of nodes) {
    const mount = node.path.replace(/^\//, "").split("/")[0] ?? "other";
    const group = groups.get(mount);
    if (group) {
      group.push(node);
    } else {
      groups.set(mount, [node]);
    }
  }

  const sections: string[] = [];
  for (const [mount, groupNodes] of groups) {
    const label = MOUNT_LABELS[mount] ?? mount;
    const lines = groupNodes.map((n) => {
      const pathShort = n.path.replace(/^\//, "");
      const maxExcerpt = 200;
      const excerpt =
        n.excerpt.length > maxExcerpt
          ? `${n.excerpt.slice(0, maxExcerpt - 1)}…`
          : n.excerpt;
      return `- **${pathShort}** (${Math.round(n.score * 100)}%): ${excerpt}`;
    });
    sections.push(`**${label}:**\n${lines.join("\n")}`);
  }

  return `
## Relevant Context
Semantically related to current message. Use to inform your response — read full file with \`${CORTEX_READ_ALIAS}\` if needed.
${sections.join("\n\n")}
`;
}
