/**
 * Filesystem Search — greps files on disk for content matches
 */

import "server-only";

import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { DATA_ROOT, cortexPathToDisk, diskPathToCortex, hasErrCode } from ".";
import type { FsTranslate } from ".";
import { normalizePath } from "../repository";

interface FsSearchResult {
  resultPath: string;
  excerpt: string;
  score: number;
  updatedAt: string;
}

interface FsSearchResponse {
  responseQuery: string;
  results: FsSearchResult[];
  total: number;
  searchMode: "hybrid" | "keyword";
}

/**
 * Recursively collect all file paths under a directory
 */
async function collectFiles(dirPath: string): Promise<string[]> {
  const files: string[] = [];
  let dirents;
  try {
    dirents = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const dirent of dirents) {
    if (dirent.name.startsWith(".")) {
      continue;
    }
    const fullPath = join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      const sub = await collectFiles(fullPath);
      files.push(...sub);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract a context excerpt around the first match
 */
function extractExcerpt(
  content: string,
  query: string,
  contextChars = 120,
): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) {
    return "";
  }

  const start = Math.max(0, idx - Math.floor(contextChars / 2));
  const end = Math.min(
    content.length,
    idx + query.length + Math.floor(contextChars / 2),
  );
  let excerpt = content.slice(start, end).replace(/\n/g, " ");

  if (start > 0) {
    excerpt = `...${excerpt}`;
  }
  if (end < content.length) {
    excerpt = `${excerpt}...`;
  }

  return excerpt;
}

export async function fsSearch(
  rawPath: string,
  query: string,
  maxResults: number,
  { t }: FsTranslate,
): Promise<ResponseType<FsSearchResponse>> {
  const cortexPath = normalizePath(rawPath);
  const diskPath =
    cortexPath === "/" ? DATA_ROOT : cortexPathToDisk(cortexPath);

  try {
    const allFiles = await collectFiles(diskPath);
    const results: FsSearchResult[] = [];
    const queryLower = query.toLowerCase();

    for (const filePath of allFiles) {
      if (results.length >= maxResults) {
        break;
      }

      // Check filename match
      const cortex = diskPathToCortex(filePath);
      const nameMatch = cortex.toLowerCase().includes(queryLower);

      // Check content match
      let content = "";
      try {
        content = await readFile(filePath, "utf8");
      } catch {
        continue;
      }

      const contentMatch = content.toLowerCase().includes(queryLower);

      if (nameMatch || contentMatch) {
        let updatedAt = new Date().toISOString();
        try {
          const st = await stat(filePath);
          updatedAt = st.mtime.toISOString();
        } catch {
          // use default
        }

        results.push({
          resultPath: cortex,
          excerpt: contentMatch ? extractExcerpt(content, query) : cortex,
          score: nameMatch && contentMatch ? 1.0 : 0.5,
          updatedAt,
        });
      }
    }

    return success({
      responseQuery: query,
      results,
      total: results.length,
      searchMode: "keyword" as const,
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
