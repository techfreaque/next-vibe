/**
 * Filesystem Tree — builds ASCII tree from disk
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

import { DATA_ROOT, cortexPathToDisk, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsTreeResult {
  tree: string;
  totalFiles: number;
  totalDirs: number;
}

interface TreeCounts {
  files: number;
  dirs: number;
}

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

  // Filter hidden files, sort dirs first then alpha
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
    const entry = visible[i];
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
        // skip size
      }
      lines.push(`${indent}${connector}${entry.name}${sizeStr}`);
    }
  }

  return { lines, counts };
}

export async function fsGetTree(
  rawPath: string,
  maxDepth: number,
  { t }: FsTranslate,
): Promise<ResponseType<FsTreeResult>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath =
    cortexPath === "/" ? DATA_ROOT : cortexPathToDisk(cortexPath);

  try {
    const rootName = cortexPath === "/" ? "/" : `${pathBasename(diskPath)}/`;
    const { lines, counts } = await buildTreeLines(diskPath, "", maxDepth);

    return success({
      tree: [rootName, ...lines].join("\n"),
      totalFiles: counts.files,
      totalDirs: counts.dirs,
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
