/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import { stripFrontmatter } from "../_shared/text-utils";
import {
  CORTEX_LIST_ALIAS,
  CORTEX_READ_ALIAS,
  CORTEX_SEARCH_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../constants";

// ─── Data Types ───────────────────────────────────────────────────────────────

/** A single file entry in the cortex tree */
export interface CortexFileEntry {
  kind: "file";
  /** Canonical path e.g. /memories/identity/name.md */
  path: string;
  /** Display name - basename without extension */
  displayName: string;
  /** Content to show inline below the filename (empty = filename only) */
  excerpt: string;
  /** Adjusted similarity score 0-1 (from vector search) */
  score?: number;
  /** From cortexNodes frontmatter pinned:true */
  pinned?: boolean;
  /** Skill is in chatFavorites for this user */
  favored?: boolean;
  /** Skill is user-authored (customSkills) */
  created?: boolean;
}

/** A directory entry in the cortex tree */
export interface CortexDirEntry {
  kind: "dir";
  /** Canonical path e.g. /memories or /documents/inbox */
  path: string;
  /** Display name shown as header e.g. "memories/" */
  displayName: string;
  /** Total file count in this mount/dir */
  totalCount: number;
  /** Files/subdirs to show (pinned + relevant + recent up to budget) */
  children: CortexEntry[];
  /** Items beyond budget not shown */
  hiddenCount: number;
  /** For threads: archived/background count note */
  countNote?: string;
}

export type CortexEntry = CortexFileEntry | CortexDirEntry;

export interface CortexData {
  /** Root-level dirs: memories, documents, threads, skills, tasks, favorites */
  tree: CortexEntry[];
  /** Thread counts by root folder id */
  threadCounts: Record<string, number>;
  /** Total thread count across all folders */
  totalThreads: number;
  /** Total upload count */
  uploadCount: number;
  /** Total web search count */
  searchCount: number;
  /** Total AI-generated media count */
  genCount: number;
  /** User-authored cron task count */
  taskCount: number;
  languageName?: string;
  localeRoots?: { memories: string; documents: string };
}

// ─── Fragment ─────────────────────────────────────────────────────────────────

export const cortexFragment: SystemPromptFragment<CortexData> = {
  id: "cortex",
  placement: "trailing",
  priority: 190,
  build: (data) => {
    const {
      tree,
      uploadCount,
      searchCount,
      totalThreads,
      languageName,
      localeRoots,
    } = data;

    const memoriesPath = localeRoots?.memories ?? "/memories";
    const documentsPath = localeRoots?.documents ?? "/documents";

    const memDir = tree.find(
      (e) => e.kind === "dir" && e.path === memoriesPath,
    ) as CortexDirEntry | undefined;
    const docDir = tree.find(
      (e) => e.kind === "dir" && e.path === documentsPath,
    ) as CortexDirEntry | undefined;
    const skillDir = tree.find(
      (e) => e.kind === "dir" && e.path === "/skills",
    ) as CortexDirEntry | undefined;
    const favDir = tree.find(
      (e) => e.kind === "dir" && e.path === "/favorites",
    ) as CortexDirEntry | undefined;

    const isEmptyWorkspace =
      (memDir?.totalCount ?? 0) === 0 &&
      (docDir?.totalCount ?? 0) === 0 &&
      totalThreads === 0 &&
      (skillDir?.totalCount ?? 0) === 0 &&
      (favDir?.totalCount ?? 0) === 0 &&
      uploadCount === 0 &&
      searchCount === 0;

    const langNote = languageName
      ? `**Language:** Write all content in ${languageName} - the user's language.\n`
      : "";

    const emptyNotice = isEmptyWorkspace
      ? `\n> Empty workspace - learn the user's name, role, goals. Write to ${memoriesPath}/identity/ right now.\n`
      : "";

    const treeStr = renderCortexTree(data);

    return `## Cortex (Your Persistent Brain)
Shared memory between you and the user. Persists across conversations. You read and write files directly.
${langNote}${emptyNotice}
${treeStr}

**Tools:** \`${CORTEX_WRITE_ALIAS}\` · \`${CORTEX_READ_ALIAS}\` · \`${CORTEX_SEARCH_ALIAS}\` · \`${CORTEX_LIST_ALIAS}\` (+ edit/move/delete/mkdir/tree - \`tool-help query="cortex"\`)
**Rules:** One idea per file. <200 words. Names: \`specific-kebab-case.md\`. Write proactively. Consolidate duplicates. Archive (\`archived: true\` frontmatter) over deleting. Pin critical files (\`pinned: true\`) - always shown, never trimmed.
**Writable:** ${memoriesPath}/ (knowledge) · ${documentsPath}/ (working files) · /skills/ (custom skills)
**Read-only:** /threads/ · /uploads/ · /searches/ · /gens/ · /favorites/ · /tasks/ - use \`${CORTEX_READ_ALIAS}\` or \`${CORTEX_LIST_ALIAS}\` only`;
  },
};

// ─── Shared Utilities ─────────────────────────────────────────────────────────

/** Clean an excerpt for inline display: strip heading, collapse newlines, trim */
export function cleanExcerpt(text: string): string {
  return stripFrontmatter(text)
    .replace(/^#+\s+[^\n]*\n?/, "") // strip leading heading
    .replace(/\n+/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Tree Renderer ────────────────────────────────────────────────────────────

const TREE_BRANCH = "├──";
const TREE_LAST = "└──";
const TREE_PIPE = "│   ";
const TREE_SPACE = "    ";

/**
 * Render the unified cortex folder tree.
 * Files with content show it on a second line below the filename:
 *   ├── name.md [📌]
 *   │   Full content excerpt here...
 * Files without content show just the filename:
 *   ├── name.md [80%]
 */
export function renderCortexTree(data: CortexData): string {
  const { tree, uploadCount, searchCount, genCount } = data;

  // Only show non-empty dirs
  const visibleDirs = tree.filter(
    (e): e is CortexDirEntry =>
      e.kind === "dir" && (e.totalCount > 0 || e.children.length > 0),
  );

  // Append uploads/searches/gens as leaf summary lines at root level
  const extraLeafs: string[] = [];
  if (uploadCount > 0) {
    extraLeafs.push(
      `/uploads/ (${uploadCount} - images, documents, audio, video)`,
    );
  }
  if (searchCount > 0) {
    extraLeafs.push(`/searches/ (${searchCount} - by month)`);
  }
  if (genCount > 0) {
    extraLeafs.push(`/gens/ (${genCount} - images, audio, video)`);
  }

  const lines: string[] = ["/ (cortex)"];

  for (let i = 0; i < visibleDirs.length; i++) {
    const dir = visibleDirs[i]!;
    const isLast = i === visibleDirs.length - 1 && extraLeafs.length === 0;
    const branch = isLast ? TREE_LAST : TREE_BRANCH;
    const childIndent = isLast ? TREE_SPACE : TREE_PIPE;

    // Dir header line: "├── memories/ (48 · 4 archived)"
    const countStr = dir.countNote ?? String(dir.totalCount);
    lines.push(`${branch} ${dir.displayName} (${countStr})`);

    // Children
    const children = dir.children;
    const hasHiddenAfter = dir.hiddenCount > 0;
    for (let j = 0; j < children.length; j++) {
      const child = children[j]!;
      const childIsLast = j === children.length - 1 && !hasHiddenAfter;
      const childBranch = childIsLast ? TREE_LAST : TREE_BRANCH;
      const contentIndent =
        childIndent + (childIsLast ? TREE_SPACE : TREE_PIPE);

      if (child.kind === "file") {
        const fileLines = renderFileEntryLines(child);
        lines.push(`${childIndent}${childBranch} ${fileLines[0]}`);
        for (let l = 1; l < fileLines.length; l++) {
          lines.push(`${contentIndent}${fileLines[l]}`);
        }
      } else {
        // Sub-directory (e.g. documents/inbox/, documents/templates/)
        const subHeader = renderSubDirHeader(child);
        lines.push(`${childIndent}${childBranch} ${subHeader}`);
        const subIndent = childIndent + (childIsLast ? TREE_SPACE : TREE_PIPE);
        const subHasHidden = child.hiddenCount > 0;
        for (let k = 0; k < child.children.length; k++) {
          const subChild = child.children[k]!;
          const subChildIsLast =
            k === child.children.length - 1 && !subHasHidden;
          const subChildBranch = subChildIsLast ? TREE_LAST : TREE_BRANCH;
          const subContentIndent =
            subIndent + (subChildIsLast ? TREE_SPACE : TREE_PIPE);
          if (subChild.kind === "file") {
            const subFileLines = renderFileEntryLines(subChild);
            lines.push(`${subIndent}${subChildBranch} ${subFileLines[0]}`);
            for (let l = 1; l < subFileLines.length; l++) {
              lines.push(`${subContentIndent}${subFileLines[l]}`);
            }
          }
        }
        if (subHasHidden) {
          lines.push(`${subIndent}${TREE_LAST} +${child.hiddenCount} more`);
        }
      }
    }

    // Hidden count
    if (hasHiddenAfter) {
      lines.push(`${childIndent}${TREE_LAST} +${dir.hiddenCount} more`);
    }
  }

  // Extra leaf entries at root level
  for (let i = 0; i < extraLeafs.length; i++) {
    const isLast = i === extraLeafs.length - 1;
    const branch = isLast ? TREE_LAST : TREE_BRANCH;
    lines.push(`${branch} ${extraLeafs[i]}`);
  }

  return lines.join("\n");
}

function renderSubDirHeader(dir: CortexDirEntry): string {
  return `${dir.displayName} (${dir.totalCount} files)`;
}

/**
 * Render a file entry as 1 or 2 lines.
 * Line 1: filename with badges/score
 * Line 2 (optional): inline content excerpt
 */
function renderFileEntryLines(entry: CortexFileEntry): string[] {
  const pinMark = entry.pinned ? "[📌] " : "";

  let scoreSuffix = "";
  if (entry.score !== undefined && !entry.pinned) {
    scoreSuffix = ` [${Math.round(entry.score * 100)}%]`;
  }

  let badge = "";
  if (entry.favored && entry.created) {
    badge = " (★ created)";
  } else if (entry.favored) {
    badge = " (★)";
  } else if (entry.created) {
    badge = " (created)";
  }

  const firstLine = `${pinMark}${entry.displayName}${scoreSuffix}${badge}`;

  if (!entry.excerpt) {
    return [firstLine];
  }

  return [firstLine, entry.excerpt];
}
