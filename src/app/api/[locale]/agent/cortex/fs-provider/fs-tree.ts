/**
 * Filesystem Tree — builds ASCII tree combining disk files + virtual mounts + templates
 */

import "server-only";

import { readdir, stat } from "node:fs/promises";
import { join, basename as pathBasename } from "node:path";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import {
  basename,
  DOCUMENTS_PREFIX,
  MEMORIES_PREFIX,
  normalizePath,
  VIRTUAL_MOUNTS,
} from "../repository";
import { DATA_ROOT, cortexPathToDisk, hasErrCode } from ".";
import type { FsTranslate } from ".";

interface FsTreeResult {
  tree: string;
  totalFiles: number;
  totalDirs: number;
}

interface TreeCounts {
  files: number;
  dirs: number;
}

interface TreeEntry {
  name: string;
  isDir: boolean;
  size: number;
  diskPath?: string;
  children?: TreeEntry[];
}

type VirtualMount = (typeof VIRTUAL_MOUNTS)[number];

function isVirtualMountStr(s: string): s is VirtualMount {
  return (VIRTUAL_MOUNTS as readonly string[]).includes(s);
}

async function readDiskDir(dirPath: string): Promise<TreeEntry[]> {
  let dirents;
  try {
    dirents = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
  const visible = dirents.filter((d) => !d.name.startsWith("."));
  visible.sort((a, b) => {
    const aDir = a.isDirectory();
    const bDir = b.isDirectory();
    if (aDir !== bDir) {
      return aDir ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const entries: TreeEntry[] = [];
  for (const d of visible) {
    const full = join(dirPath, d.name);
    let size = 0;
    try {
      const st = await stat(full);
      size = st.size;
    } catch {
      /* skip */
    }
    entries.push({
      name: d.name,
      isDir: d.isDirectory(),
      size,
      diskPath: full,
    });
  }
  return entries;
}

function renderLines(
  entries: TreeEntry[],
  indent: string,
  maxDepth: number,
  counts: TreeCounts,
): string[] {
  const lines: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const isLast = i === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childIndent = indent + (isLast ? "    " : "│   ");

    if (entry.isDir) {
      counts.dirs++;
      lines.push(`${indent}${connector}${entry.name}/`);
      if (maxDepth > 1 && entry.children && entry.children.length > 0) {
        lines.push(
          ...renderLines(entry.children, childIndent, maxDepth - 1, counts),
        );
      }
    } else {
      counts.files++;
      const sizeStr =
        entry.size >= 1024
          ? ` ${(entry.size / 1024).toFixed(1)} KB`
          : entry.size > 0
            ? ` ${entry.size} B`
            : "";
      lines.push(`${indent}${connector}${entry.name}${sizeStr}`);
    }
  }
  return lines;
}

/**
 * Build tree for a memories or documents path — merges disk + template overlay
 */
async function buildNativeDirTree(
  cortexPath: string,
  maxDepth: number,
  locale: CountryLanguage,
): Promise<{ entries: TreeEntry[]; counts: TreeCounts }> {
  const diskPath = cortexPathToDisk(cortexPath);
  const diskEntries = await readDiskDir(diskPath);

  const entryMap = new Map<string, TreeEntry>();
  for (const e of diskEntries) {
    entryMap.set(e.name, e);
  }

  const counts: TreeCounts = { files: 0, dirs: 0 };

  // Overlay memory templates
  if (cortexPath.startsWith(MEMORIES_PREFIX)) {
    const { getMemoryTemplates } = await import("../seeds/templates");
    const templates = getMemoryTemplates(locale);
    const normalizedDir = cortexPath.endsWith("/")
      ? cortexPath.slice(0, -1)
      : cortexPath;

    for (const item of templates) {
      if (!item.path.startsWith(`${normalizedDir}/`)) {
        continue;
      }
      const relative = item.path.slice(normalizedDir.length + 1);
      const firstSegment = relative.split("/")[0]!;

      if (relative.includes("/")) {
        if (!entryMap.has(firstSegment)) {
          entryMap.set(firstSegment, {
            name: firstSegment,
            isDir: true,
            size: 0,
          });
        }
      } else if (!entryMap.has(firstSegment)) {
        entryMap.set(firstSegment, {
          name: firstSegment,
          isDir: false,
          size: Buffer.byteLength(item.content, "utf8"),
        });
      }
    }
  }

  // Overlay document default subdirs
  if (cortexPath === DOCUMENTS_PREFIX) {
    const { getDefaultDocumentDirs } = await import("../seeds/templates");
    const defaultDirs = getDefaultDocumentDirs(locale);
    for (const dir of defaultDirs) {
      const name = basename(dir.path);
      if (!entryMap.has(name)) {
        entryMap.set(name, { name, isDir: true, size: 0 });
      }
    }
  }

  // Overlay document template files
  if (cortexPath === `${DOCUMENTS_PREFIX}/templates`) {
    const { getDocumentTemplates } = await import("../seeds/templates");
    const docTemplates = getDocumentTemplates(locale);
    for (const item of docTemplates) {
      const name = basename(item.path);
      if (!entryMap.has(name)) {
        entryMap.set(name, {
          name,
          isDir: false,
          size: Buffer.byteLength(item.content, "utf8"),
        });
      }
    }
  }

  const entries = [...entryMap.values()].toSorted((a, b) => {
    if (a.isDir !== b.isDir) {
      return a.isDir ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  if (maxDepth > 1) {
    for (const entry of entries) {
      if (entry.isDir) {
        const childPath = `${cortexPath}/${entry.name}`;
        const sub = await buildNativeDirTree(childPath, maxDepth - 1, locale);
        entry.children = sub.entries;
      }
    }
  }

  return { entries, counts };
}

/**
 * Build tree for a virtual mount path (threads, skills, tasks, uploads, searches, gens)
 */
async function buildVirtualMountTree(
  userId: string,
  cortexPath: string,
  mountPrefix: VirtualMount,
  maxDepth: number,
): Promise<TreeEntry[]> {
  const { resolveVirtualList } = await import("../mounts/resolver");
  const rawEntries = await resolveVirtualList(userId, cortexPath, mountPrefix);

  const entries: TreeEntry[] = [];
  for (const e of rawEntries) {
    const entry: TreeEntry = {
      name: e.name,
      isDir: e.nodeType === "dir",
      size: e.size ?? 0,
    };
    if (entry.isDir && maxDepth > 1) {
      entry.children = await buildVirtualMountTree(
        userId,
        e.path,
        mountPrefix,
        maxDepth - 1,
      );
    }
    entries.push(entry);
  }
  return entries;
}

export async function fsGetTree(
  rawPath: string,
  maxDepth: number,
  { t }: FsTranslate,
  userId?: string,
  locale?: CountryLanguage,
): Promise<ResponseType<FsTreeResult>> {
  const cortexPath = normalizePath(rawPath);

  try {
    const counts: TreeCounts = { files: 0, dirs: 0 };

    if (cortexPath === "/") {
      const diskEntries = await readDiskDir(DATA_ROOT);
      const diskNames = new Set(diskEntries.map((e) => e.name));
      const lines: string[] = ["/"];

      const nativeMounts = [
        { name: "documents", cortexPath: DOCUMENTS_PREFIX },
        { name: "memories", cortexPath: MEMORIES_PREFIX },
      ];
      const virtualMountNames = VIRTUAL_MOUNTS.map((m) => m.slice(1));
      const allMountNames: string[] = [
        ...nativeMounts.map((n) => n.name),
        ...virtualMountNames,
      ];

      for (const de of diskEntries) {
        if (de.isDir && !allMountNames.includes(de.name)) {
          allMountNames.push(de.name);
        }
      }

      // Deduplicate
      const seen = new Set<string>();
      const ordered: string[] = [];
      for (const n of allMountNames) {
        if (!seen.has(n)) {
          seen.add(n);
          ordered.push(n);
        }
      }

      for (let i = 0; i < ordered.length; i++) {
        const name = ordered[i]!;
        const isLast = i === ordered.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const childIndent = isLast ? "    " : "│   ";

        lines.push(`${connector}${name}/`);
        counts.dirs++;

        if (maxDepth <= 1 || !locale) {
          continue;
        }

        const nativeMount = nativeMounts.find((n) => n.name === name);
        const mountKey = `/${name}`;

        if (nativeMount) {
          const sub = await buildNativeDirTree(
            nativeMount.cortexPath,
            maxDepth - 1,
            locale,
          );
          lines.push(
            ...renderLines(sub.entries, childIndent, maxDepth - 1, counts),
          );
        } else if (userId && isVirtualMountStr(mountKey)) {
          const children = await buildVirtualMountTree(
            userId,
            mountKey,
            mountKey,
            maxDepth - 1,
          );
          lines.push(
            ...renderLines(children, childIndent, maxDepth - 1, counts),
          );
        } else if (diskNames.has(name)) {
          const diskEntry = diskEntries.find((e) => e.name === name);
          if (diskEntry?.diskPath) {
            const sub = await buildTreeLines(
              diskEntry.diskPath,
              childIndent,
              maxDepth - 1,
            );
            lines.push(...sub.lines);
            counts.files += sub.counts.files;
            counts.dirs += sub.counts.dirs;
          }
        }
      }

      return success({
        tree: lines.join("\n"),
        totalFiles: counts.files,
        totalDirs: counts.dirs,
      });
    }

    // Non-root virtual mount
    const virtualMountPrefix = VIRTUAL_MOUNTS.find(
      (m) => cortexPath === m || cortexPath.startsWith(`${m}/`),
    );

    if (virtualMountPrefix && userId) {
      const children = await buildVirtualMountTree(
        userId,
        cortexPath,
        virtualMountPrefix,
        maxDepth,
      );
      const rootName = `${pathBasename(cortexPath)}/`;
      const lines: string[] = [rootName];
      lines.push(...renderLines(children, "", maxDepth, counts));
      return success({
        tree: lines.join("\n"),
        totalFiles: counts.files,
        totalDirs: counts.dirs,
      });
    }

    // Native path (memories or documents) with locale
    if (locale) {
      const sub = await buildNativeDirTree(cortexPath, maxDepth, locale);
      const rootName = `${pathBasename(cortexPathToDisk(cortexPath))}/`;
      const lines: string[] = [rootName];
      lines.push(...renderLines(sub.entries, "", maxDepth, counts));
      return success({
        tree: lines.join("\n"),
        totalFiles: counts.files,
        totalDirs: counts.dirs,
      });
    }

    // Fallback: pure disk read
    const diskPath = cortexPathToDisk(cortexPath);
    const rootName = `${pathBasename(diskPath)}/`;
    const { lines, counts: diskCounts } = await buildTreeLines(
      diskPath,
      "",
      maxDepth,
    );
    return success({
      tree: [rootName, ...lines].join("\n"),
      totalFiles: diskCounts.files,
      totalDirs: diskCounts.dirs,
    });
  } catch (error) {
    if (error instanceof Error && hasErrCode(error, "ENOENT")) {
      return fail({
        message: t("get.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (error instanceof Error && hasErrCode(error, "EACCES")) {
      return fail({
        message: t("get.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return fail({
      message: t("get.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

// Legacy pure-disk helper used in fallback path
async function buildTreeLines(
  dirPath: string,
  indent: string,
  maxDepth: number,
): Promise<{ lines: string[]; counts: TreeCounts }> {
  const lines: string[] = [];
  const counts: TreeCounts = { files: 0, dirs: 0 };

  if (maxDepth <= 0) {
    return { lines, counts };
  }

  let dirents;
  try {
    dirents = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return { lines, counts };
  }

  const visible = dirents.filter((d) => !d.name.startsWith("."));
  visible.sort((a, b) => {
    const aDir = a.isDirectory();
    const bDir = b.isDirectory();
    if (aDir !== bDir) {
      return aDir ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  for (let i = 0; i < visible.length; i++) {
    const entry = visible[i]!;
    const isLast = i === visible.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childIndent = indent + (isLast ? "    " : "│   ");

    if (entry.isDirectory()) {
      counts.dirs++;
      lines.push(`${indent}${connector}${entry.name}/`);
      const sub = await buildTreeLines(
        join(dirPath, entry.name),
        childIndent,
        maxDepth - 1,
      );
      lines.push(...sub.lines);
      counts.files += sub.counts.files;
      counts.dirs += sub.counts.dirs;
    } else {
      counts.files++;
      let sizeStr = "";
      try {
        const st = await stat(join(dirPath, entry.name));
        sizeStr =
          st.size >= 1024
            ? ` ${(st.size / 1024).toFixed(1)} KB`
            : ` ${st.size} B`;
      } catch {
        /* skip */
      }
      lines.push(`${indent}${connector}${entry.name}${sizeStr}`);
    }
  }

  return { lines, counts };
}
