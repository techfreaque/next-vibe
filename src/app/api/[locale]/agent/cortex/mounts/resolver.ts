import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
/**
 * Virtual Mount Resolver
 * Routes Cortex paths to the appropriate data source and renders as markdown
 */
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ToolExecutionContext } from "../../chat/config";

export interface VirtualReadResult {
  content: string;
  nodeType: "file" | "dir";
  updatedAt: string;
}

export interface VirtualListEntry {
  name: string;
  path: string;
  nodeType: "file" | "dir";
  size: number | null;
  updatedAt: string;
}

/** Context passed to mount write handlers - carries user identity + locale for native repos */
export interface MountWriteContext {
  userId: string;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
  /** Fixture chain of the triggering execution — binds embedding-sync calls
   *  so they record/replay. Required explicit (undefined outside tests). */
  streamContext: ToolExecutionContext;
}

export interface VirtualWriteResult {
  path: string;
  created: boolean;
}

export interface VirtualDeleteResult {
  path: string;
  deleted: boolean;
}

export interface VirtualMoveResult {
  from: string;
  to: string;
}

/**
 * Resolve a virtual path read to markdown content
 */
export async function resolveVirtualRead(
  userId: string,
  path: string,
  mountPrefix: string,
  isAdmin: boolean,
  locale: CountryLanguage,
): Promise<VirtualReadResult | null> {
  switch (mountPrefix) {
    case "/threads": {
      const { readThreadPath } = await import("./threads");
      return readThreadPath(userId, path);
    }
    case "/skills": {
      const { readSkillPath } = await import("./skills");
      return readSkillPath(userId, path, locale);
    }
    case "/favorites": {
      const { readFavoritePath } = await import("./favorites");
      return readFavoritePath(userId, path);
    }
    case "/tasks": {
      const { readTaskPath } = await import("./tasks");
      return readTaskPath(userId, path);
    }
    case "/uploads": {
      const { readUploadPath } = await import("./uploads");
      return readUploadPath(userId, path);
    }
    case "/searches": {
      const { readSearchPath } = await import("./searches");
      return readSearchPath(userId, path);
    }
    case "/gens": {
      const { readGenPath } = await import("./gens");
      return readGenPath(userId, path);
    }
    case "/ssh": {
      const { readSshPath } = await import("./ssh");
      return readSshPath(userId, path, isAdmin);
    }
    default:
      return null;
  }
}

/**
 * Resolve a virtual path listing
 */
export async function resolveVirtualList(
  userId: string,
  path: string,
  mountPrefix: string,
  isAdmin: boolean,
): Promise<VirtualListEntry[]> {
  switch (mountPrefix) {
    case "/threads": {
      const { listThreadPath } = await import("./threads");
      return listThreadPath(userId, path);
    }
    case "/skills": {
      const { listSkillPath } = await import("./skills");
      return listSkillPath(userId, path);
    }
    case "/favorites": {
      const { listFavoritePath } = await import("./favorites");
      return listFavoritePath(userId, path);
    }
    case "/tasks": {
      const { listTaskPath } = await import("./tasks");
      return listTaskPath(userId, path);
    }
    case "/uploads": {
      const { listUploadPath } = await import("./uploads");
      return listUploadPath(userId, path);
    }
    case "/searches": {
      const { listSearchPath } = await import("./searches");
      return listSearchPath(userId, path);
    }
    case "/gens": {
      const { listGenPath } = await import("./gens");
      return listGenPath(userId, path);
    }
    case "/ssh": {
      const { listSshPath } = await import("./ssh");
      return listSshPath(userId, path, isAdmin);
    }
    default:
      return [];
  }
}

/**
 * Get counts for all virtual mounts (used by tree/system prompt)
 */
export async function getVirtualMountCounts(
  userId: string,
  isAdmin: boolean,
): Promise<{
  threads: { total: number; byRoot: Record<string, number> };
  memories: number;
  skills: number;
  favorites: number;
  tasks: number;
  documents: number;
  uploads: number;
  searches: number;
  gens: number;
  ssh: number;
}> {
  const [threadCounts, skillCount, favoriteCount, taskCount] =
    await Promise.all([
      import("./threads").then((m) => m.getThreadCounts(userId)),
      import("./skills").then((m) => m.getSkillCount(userId)),
      import("./favorites").then((m) => m.getFavoriteCount(userId)),
      import("./tasks").then((m) => m.getTaskCount(userId)),
    ]);

  // Count document + memory workspace files from cortex_nodes
  const { countDocuments } = await import("./documents");
  const { countMemories } = await import("./memories-count");
  const [
    docCount,
    memoryCount,
    uploadCounts,
    searchCounts,
    genCounts,
    sshCount,
  ] = await Promise.all([
    countDocuments(userId),
    countMemories(userId),
    import("./uploads").then((m) => m.getUploadCounts(userId)),
    import("./searches").then((m) => m.getSearchCounts(userId)),
    import("./gens").then((m) => m.getGenCounts(userId)),
    import("./ssh").then((m) => m.getSshCount(userId, isAdmin)),
  ]);

  return {
    threads: threadCounts,
    memories: memoryCount,
    skills: skillCount,
    favorites: favoriteCount,
    tasks: taskCount,
    documents: docCount,
    uploads: uploadCounts.total,
    searches: searchCounts.total,
    gens: genCounts.total,
    ssh: sshCount,
  };
}

/**
 * Resolve a virtual path write - delegates to mount-specific handler
 */
export async function resolveVirtualWrite(
  ctx: MountWriteContext,
  path: string,
  content: string,
  mountPrefix: string,
): Promise<VirtualWriteResult | null> {
  switch (mountPrefix) {
    case "/skills": {
      const { writeSkillPath } = await import("./skills");
      return writeSkillPath(ctx, path, content);
    }
    case "/ssh": {
      const { writeSshPath } = await import("./ssh");
      return writeSshPath(ctx.userId, path, content);
    }
    default:
      return null;
  }
}

/**
 * Resolve a virtual path delete - delegates to mount-specific handler
 */
export async function resolveVirtualDelete(
  ctx: MountWriteContext,
  path: string,
  mountPrefix: string,
): Promise<VirtualDeleteResult | null> {
  switch (mountPrefix) {
    case "/skills": {
      const { deleteSkillPath } = await import("./skills");
      return deleteSkillPath(ctx, path);
    }
    case "/ssh": {
      const { deleteSshPath } = await import("./ssh");
      return deleteSshPath(ctx.userId, path);
    }
    default:
      return null;
  }
}

/**
 * Resolve a virtual path move - delegates to mount-specific handler
 */
export async function resolveVirtualMove(
  ctx: MountWriteContext,
  fromPath: string,
  toPath: string,
  mountPrefix: string,
): Promise<VirtualMoveResult | null> {
  switch (mountPrefix) {
    case "/skills": {
      const { moveSkillPath } = await import("./skills");
      return moveSkillPath(ctx, fromPath, toPath);
    }
    case "/ssh": {
      const { moveSshPath } = await import("./ssh");
      return moveSshPath(ctx.userId, fromPath, toPath);
    }
    default:
      return null;
  }
}
