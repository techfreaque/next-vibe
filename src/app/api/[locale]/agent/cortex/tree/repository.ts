import "server-only";

/**
 * Cortex Tree Repository
 * Builds a compact directory tree representation
 */
import { and, asc, eq, like } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import {
  basename,
  DOCUMENTS_PREFIX,
  isValidPath,
  MEMORIES_PREFIX,
  normalizePath,
  normalizeToCanonicalPath,
  pathDepth,
} from "../repository";
import type { CortexTreeT } from "./i18n";

export class CortexTreeRepository {
  static async getTree({
    userId,
    user,
    locale,
    path: rawPath,
    maxDepth,
    logger,
    t,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
    path: string;
    maxDepth: number;
    logger: EndpointLogger;
    t: CortexTreeT;
  }): Promise<
    ResponseType<{ tree: string; totalFiles: number; totalDirs: number }>
  > {
    const path = normalizeToCanonicalPath(normalizePath(rawPath), locale);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      // Build tree for documents
      const docNodes = await db
        .select({
          path: cortexNodes.path,
          nodeType: cortexNodes.nodeType,
          size: cortexNodes.size,
        })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, userId),
            eq(cortexNodes.isDeleted, false),
            path === "/" || path === DOCUMENTS_PREFIX
              ? like(cortexNodes.path, `${DOCUMENTS_PREFIX}%`)
              : like(cortexNodes.path, `${path}%`),
          ),
        )
        .orderBy(cortexNodes.path);

      // Filter by depth
      const baseDepth = pathDepth(path);
      const filteredNodes = docNodes.filter(
        (n) => pathDepth(n.path) - baseDepth <= maxDepth,
      );

      let totalFiles = 0;
      let totalDirs = 0;

      // Build tree string
      const lines: string[] = [];

      if (path === "/") {
        lines.push("/");

        // Add virtual mounts as summaries
        const { getVirtualMountCounts } = await import("../mounts/resolver");
        const isAdmin =
          !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
        const counts = await getVirtualMountCounts(userId, isAdmin);

        // Documents tree
        if (filteredNodes.length > 0) {
          lines.push("├── documents/");
          const docTree = CortexTreeRepository.buildSubtree(
            filteredNodes,
            DOCUMENTS_PREFIX,
            "│   ",
            maxDepth - 1,
          );
          lines.push(...docTree.lines);
          totalFiles += docTree.files;
          totalDirs += docTree.dirs + 1;
        } else {
          lines.push("├── documents/ (empty)");
          totalDirs++;
        }

        // Virtual mounts — expand if depth allows, else show count hint
        const { listSshPath } = await import("../mounts/ssh");

        const virtualMounts = [
          { name: "threads", prefix: "/threads" },
          { name: "memories", prefix: "/memories" },
          { name: "skills", prefix: "/skills" },
          { name: "favorites", prefix: "/favorites" },
          { name: "tasks", prefix: "/tasks" },
        ];

        const hasSsh = counts.ssh > 0;
        const allMountNames = [
          ...virtualMounts.map((m) => m.name),
          ...(hasSsh ? ["ssh"] : []),
        ];
        const lastMountName = allMountNames[allMountNames.length - 1];

        for (const vm of virtualMounts) {
          const isLast = !hasSsh && vm.name === lastMountName;
          const connector = isLast ? "└── " : "├── ";
          const childIndent = isLast ? "    " : "│   ";
          lines.push(`${connector}${vm.name}/`);
          totalDirs++;
          if (maxDepth > 1) {
            const sub = await CortexTreeRepository.buildVirtualSubtree(
              userId,
              vm.prefix,
              vm.prefix,
              childIndent,
              maxDepth - 1,
              isAdmin,
            );
            lines.push(...sub.lines);
            totalFiles += sub.files;
            totalDirs += sub.dirs;
          } else {
            lines.push(
              `${childIndent}└── (… run cortex-tree(path="${vm.prefix}") for contents)`,
            );
          }
        }

        if (hasSsh) {
          lines.push(`└── ssh/`);
          totalDirs++;
          // Show mounts per connection, recurse FS with remaining depth
          const sshConnEntries = await listSshPath(userId, "/ssh", isAdmin);
          const {
            sshConnectionMounts: mountsTable,
            sshConnections: connsTable,
          } = await import("@/app/api/[locale]/ssh/db");
          const allMounts = await db
            .select({
              connectionId: mountsTable.connectionId,
              path: mountsTable.path,
              isDefault: mountsTable.isDefault,
            })
            .from(mountsTable)
            .where(eq(mountsTable.userId, userId))
            .orderBy(asc(mountsTable.path));
          const connRows = await db
            .select({ id: connsTable.id, label: connsTable.label })
            .from(connsTable)
            .where(eq(connsTable.userId, userId));
          const labelSlugMap = new Map(
            connRows.map((r) => [
              r.id,
              r.label.toLowerCase().replace(/\s+/g, "-"),
            ]),
          );
          const mountsByConn = new Map<string, typeof allMounts>();
          for (const m of allMounts) {
            const list = mountsByConn.get(m.connectionId) ?? [];
            list.push(m);
            mountsByConn.set(m.connectionId, list);
          }
          const lastConnIdx = sshConnEntries.length - 1;
          for (let ci = 0; ci <= lastConnIdx; ci++) {
            const connEntry = sshConnEntries[ci];
            if (!connEntry) {
              continue;
            }
            const isLastConn = ci === lastConnIdx;
            const connConnector = isLastConn ? "    └── " : "    ├── ";
            const connIndent = isLastConn ? "        " : "    │   ";
            lines.push(`${connConnector}${connEntry.name}/`);
            totalDirs++;
            const connRow = connRows.find(
              (r) => labelSlugMap.get(r.id) === connEntry.name,
            );
            const mounts = connRow ? (mountsByConn.get(connRow.id) ?? []) : [];
            if (mounts.length === 0) {
              lines.push(`${connIndent}└── (no mounts)`);
              continue;
            }
            const lastMountIdx = mounts.length - 1;
            for (let mi = 0; mi <= lastMountIdx; mi++) {
              const m = mounts[mi];
              if (!m) {
                continue;
              }
              const isLastMount = mi === lastMountIdx;
              const mountConnector = isLastMount ? "└── " : "├── ";
              const mountIndent = isLastMount ? "    " : "│   ";
              const mountBasename =
                m.path.split("/").filter(Boolean).at(-1) ?? m.path;
              const defaultMark = m.isDefault ? "  *(default)*" : "";
              const mountCortexPath = `/ssh/${connEntry.name}/${mountBasename}`;
              lines.push(
                `${connIndent}${mountConnector}${mountBasename}/  → ${m.path}${defaultMark}`,
              );
              totalDirs++;
              lines.push(
                `${connIndent}${mountIndent}└── (… run cortex-tree(path="${mountCortexPath}") for contents)`,
              );
            }
          }
        }
      } else if (path === "/ssh" || path.startsWith("/ssh/")) {
        if (path.startsWith("/ssh/")) {
          const sshSegments = path.split("/").filter(Boolean); // ["ssh","slug",...]
          const slug = sshSegments[1]!;
          const {
            sshConnectionMounts: mountsTable,
            sshConnections: connsTable,
          } = await import("@/app/api/[locale]/ssh/db");
          const isAdmin =
            !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

          if (sshSegments.length === 2) {
            // /ssh/<slug> — show that connection's mounts tree
            const { ensureLocalConnection } = await import("../mounts/ssh");
            await ensureLocalConnection(userId, isAdmin);
            const connRows = await db
              .select({ id: connsTable.id, label: connsTable.label })
              .from(connsTable)
              .where(eq(connsTable.userId, userId));
            const connRow = connRows.find(
              (r) => r.label.toLowerCase().replace(/\s+/g, "-") === slug,
            );
            lines.push(`${slug}/`);
            if (connRow) {
              const mounts = await db
                .select({
                  path: mountsTable.path,
                  isDefault: mountsTable.isDefault,
                })
                .from(mountsTable)
                .where(
                  and(
                    eq(mountsTable.connectionId, connRow.id),
                    eq(mountsTable.userId, userId),
                  ),
                )
                .orderBy(asc(mountsTable.path));

              if (mounts.length > 0) {
                const lastIdx = mounts.length - 1;
                for (let mi = 0; mi <= lastIdx; mi++) {
                  const m = mounts[mi];
                  if (!m) {
                    continue;
                  }
                  const isLast = mi === lastIdx;
                  const connector = isLast ? "└── " : "├── ";
                  const childIndent = isLast ? "    " : "│   ";
                  const mountBasename =
                    m.path.split("/").filter(Boolean).at(-1) ?? m.path;
                  const defaultMark = m.isDefault ? "  *(default)*" : "";
                  const mountCortexPath = `/ssh/${slug}/${mountBasename}`;
                  lines.push(
                    `${connector}${mountBasename}/  → ${m.path}${defaultMark}`,
                  );
                  totalDirs++;
                  lines.push(
                    `${childIndent}└── (… run cortex-tree(path="${mountCortexPath}") for contents)`,
                  );
                }
              } else {
                lines.push(
                  `└── (no mounts — add via ssh-mount-create or cortex-exec to run commands)`,
                );
              }
            } else {
              lines.push(`└── (machine "${slug}" not found)`);
            }
          } else {
            // /ssh/<slug>/<mountname>/... — recursive FS tree respecting maxDepth
            const pathBasename = basename(path);
            lines.push(`${pathBasename}/`);
            const sshResult = await CortexTreeRepository.buildSshSubtree(
              userId,
              path,
              isAdmin,
              "",
              maxDepth,
            );
            lines.push(...sshResult.lines);
            totalDirs += sshResult.dirs;
            totalFiles += sshResult.files;
          }
        } else {
          // /ssh — list machines with their named mounts
          const { listSshPath } = await import("../mounts/ssh");
          const {
            sshConnectionMounts: mountsTable,
            sshConnections: connsTable,
          } = await import("@/app/api/[locale]/ssh/db");
          const isAdmin =
            !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
          const sshConnEntries = await listSshPath(userId, "/ssh", isAdmin);
          const allMounts = await db
            .select({
              connectionId: mountsTable.connectionId,
              path: mountsTable.path,
              isDefault: mountsTable.isDefault,
            })
            .from(mountsTable)
            .where(eq(mountsTable.userId, userId))
            .orderBy(asc(mountsTable.path));
          const connRows = await db
            .select({ id: connsTable.id, label: connsTable.label })
            .from(connsTable)
            .where(eq(connsTable.userId, userId));
          const labelSlugMap = new Map(
            connRows.map((r) => [
              r.id,
              r.label.toLowerCase().replace(/\s+/g, "-"),
            ]),
          );
          const mountsByConn = new Map<string, typeof allMounts>();
          for (const m of allMounts) {
            const list = mountsByConn.get(m.connectionId) ?? [];
            list.push(m);
            mountsByConn.set(m.connectionId, list);
          }

          lines.push("ssh/");
          const lastConnIdx = sshConnEntries.length - 1;
          for (let ci = 0; ci <= lastConnIdx; ci++) {
            const connEntry = sshConnEntries[ci];
            if (!connEntry) {
              continue;
            }
            const isLastConn = ci === lastConnIdx;
            const connConnector = isLastConn ? "└── " : "├── ";
            const connIndent = isLastConn ? "    " : "│   ";
            lines.push(`${connConnector}${connEntry.name}/`);
            totalDirs++;

            // Find the connection's mounts by matching slug
            const connRow = connRows.find(
              (r) => labelSlugMap.get(r.id) === connEntry.name,
            );
            const mounts = connRow ? (mountsByConn.get(connRow.id) ?? []) : [];

            if (mounts.length > 0) {
              const lastMountIdx = mounts.length - 1;
              for (let mi = 0; mi <= lastMountIdx; mi++) {
                const m = mounts[mi];
                if (!m) {
                  continue;
                }
                const isLastMount = mi === lastMountIdx;
                const mountConnector = isLastMount ? "└── " : "├── ";
                const mountIndent = isLastMount ? "    " : "│   ";
                const mountBasename =
                  m.path.split("/").filter(Boolean).at(-1) ?? m.path;
                const defaultMark = m.isDefault ? "  *(default)*" : "";
                const mountCortexPath = `/ssh/${connEntry.name}/${mountBasename}`;
                lines.push(
                  `${connIndent}${mountConnector}${mountBasename}/  → ${m.path}${defaultMark}`,
                );
                totalDirs++;
                lines.push(
                  `${connIndent}${mountIndent}└── (… run cortex-tree(path="${mountCortexPath}") for contents)`,
                );
              }
            } else {
              lines.push(
                `${connIndent}└── (no mounts — cortex-list(path="${connEntry.path}/") for filesystem)`,
              );
            }
          }
          if (sshConnEntries.length === 0) {
            lines.push("└── (no machines configured)");
          }
        }
      } else {
        // Check if path is a virtual mount (skills, threads, tasks - NOT memories/documents which are native DB)
        const virtualMountPrefixes = [
          "/skills",
          "/favorites",
          "/threads",
          "/tasks",
        ];
        const isVirtualMount = virtualMountPrefixes.some(
          (prefix) => path === prefix || path.startsWith(`${prefix}/`),
        );

        if (isVirtualMount) {
          // Enumerate virtual mount entries and build tree from them
          const { resolveVirtualList } = await import("../mounts/resolver");
          // mountPrefix is the root virtual mount path (e.g. "/skills", "/threads")
          const mountPrefix = `/${path.split("/").filter(Boolean)[0]}`;
          const isAdmin =
            !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
          const entries = await resolveVirtualList(
            userId,
            path,
            mountPrefix,
            isAdmin,
          );
          lines.push(`${basename(path)}/`);
          const lastIdx = entries.length - 1;
          for (let i = 0; i <= lastIdx; i++) {
            const entry = entries[i];
            if (!entry) {
              continue;
            }
            const connector = i === lastIdx ? "└── " : "├── ";
            if (entry.nodeType === "dir") {
              lines.push(`${connector}${entry.name}/`);
              totalDirs++;
            } else {
              lines.push(`${connector}${entry.name}`);
              totalFiles++;
            }
          }
        } else {
          // Subtree for a specific documents/memories path
          // Overlay virtual templates for /memories paths (path is already canonical)
          let allNodes = filteredNodes;
          if (path.startsWith(MEMORIES_PREFIX)) {
            const { getMemoryTemplates } = await import("../seeds/templates");
            const templates = getMemoryTemplates(locale);
            const existingPaths = new Set(filteredNodes.map((n) => n.path));
            const templateNodes: typeof filteredNodes = [];
            for (const item of templates) {
              if (!item.path.startsWith(`${path}/`)) {
                continue;
              }
              if (existingPaths.has(item.path)) {
                continue;
              }
              if (pathDepth(item.path) - baseDepth > maxDepth) {
                continue;
              }
              templateNodes.push({
                path: item.path,
                nodeType: CortexNodeType.FILE,
                size: Buffer.byteLength(item.content, "utf8"),
              });
            }
            if (templateNodes.length > 0) {
              allNodes = [...filteredNodes, ...templateNodes].toSorted((a, b) =>
                a.path.localeCompare(b.path),
              );
            }
          }
          lines.push(`${basename(path)}/`);
          const tree = CortexTreeRepository.buildSubtree(
            allNodes,
            path,
            "",
            maxDepth,
          );
          lines.push(...tree.lines);
          totalFiles = tree.files;
          totalDirs = tree.dirs;
        }
      }

      return success({
        tree: lines.join("\n"),
        totalFiles,
        totalDirs,
      });
    } catch (error) {
      logger.error("Cortex tree failed", parseError(error), { path });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Build recursive tree for virtual mounts (threads, skills, tasks, etc.)
   */
  private static async buildVirtualSubtree(
    userId: string,
    path: string,
    mountPrefix: string,
    indent: string,
    depthRemaining: number,
    isAdmin: boolean,
  ): Promise<{ lines: string[]; files: number; dirs: number }> {
    const { resolveVirtualList } = await import("../mounts/resolver");
    const lines: string[] = [];
    let files = 0;
    let dirs = 0;

    const entries = await resolveVirtualList(
      userId,
      path,
      mountPrefix,
      isAdmin,
    );

    if (entries.length === 0) {
      lines.push(`${indent}└── (empty)`);
      return { lines, files, dirs };
    }

    const lastIdx = entries.length - 1;
    for (let i = 0; i <= lastIdx; i++) {
      const e = entries[i];
      if (!e) {
        continue;
      }
      const isLast = i === lastIdx;
      const connector = isLast ? "└── " : "├── ";
      const childIndent = indent + (isLast ? "    " : "│   ");
      if (e.nodeType === "dir") {
        dirs++;
        lines.push(`${indent}${connector}${e.name}/`);
        if (depthRemaining > 1) {
          const sub = await CortexTreeRepository.buildVirtualSubtree(
            userId,
            e.path,
            mountPrefix,
            childIndent,
            depthRemaining - 1,
            isAdmin,
          );
          lines.push(...sub.lines);
          files += sub.files;
          dirs += sub.dirs;
        } else {
          lines.push(
            `${childIndent}└── (… run cortex-tree(path="${e.path}") for contents)`,
          );
        }
      } else {
        files++;
        lines.push(`${indent}${connector}${e.name}`);
      }
    }

    return { lines, files, dirs };
  }

  /**
   * Build recursive FS tree for an SSH path, respecting maxDepth.
   * Each directory listing is a call to listSshPath.
   */
  private static async buildSshSubtree(
    userId: string,
    path: string,
    isAdmin: boolean,
    indent: string,
    depthRemaining: number,
  ): Promise<{ lines: string[]; files: number; dirs: number }> {
    const { listSshPath } = await import("../mounts/ssh");
    const lines: string[] = [];
    let files = 0;
    let dirs = 0;

    const entries = await listSshPath(userId, path, isAdmin);

    if (entries.length === 0) {
      lines.push(
        `${indent}└── (empty or inaccessible — run cortex-exec(path="${path}", command="ls") to check)`,
      );
      return { lines, files, dirs };
    }

    const MAX_ENTRIES = 200;
    const limited = entries.slice(0, MAX_ENTRIES);
    const lastIdx = limited.length - 1;

    for (let i = 0; i <= lastIdx; i++) {
      const e = limited[i];
      if (!e) {
        continue;
      }
      const isLast = i === lastIdx && entries.length <= MAX_ENTRIES;
      const connector = isLast ? "└── " : "├── ";
      const childIndent = indent + (isLast ? "    " : "│   ");

      if (e.nodeType === "dir") {
        dirs++;
        lines.push(`${indent}${connector}${e.name}/`);
        if (depthRemaining > 1) {
          const sub = await CortexTreeRepository.buildSshSubtree(
            userId,
            e.path,
            isAdmin,
            childIndent,
            depthRemaining - 1,
          );
          lines.push(...sub.lines);
          files += sub.files;
          dirs += sub.dirs;
        } else {
          // At depth limit — add hint
          lines.push(
            `${childIndent}└── (… run cortex-tree(path="${e.path}") for contents)`,
          );
        }
      } else {
        files++;
        const sizeStr =
          e.size !== null && e.size > 0
            ? ` ${e.size >= 1024 ? `${(e.size / 1024).toFixed(1)} KB` : `${e.size} B`}`
            : "";
        lines.push(`${indent}${connector}${e.name}${sizeStr}`);
      }
    }

    if (entries.length > MAX_ENTRIES) {
      lines.push(
        `${indent}  … (${entries.length - MAX_ENTRIES} more — run cortex-list(path="${path}") to see all)`,
      );
    }

    return { lines, files, dirs };
  }

  /**
   * Build tree lines for a set of nodes under a prefix
   */
  private static buildSubtree(
    nodes: Array<{ path: string; nodeType: string; size: number }>,
    prefix: string,
    indent: string,
    maxDepth: number,
  ): { lines: string[]; files: number; dirs: number } {
    const lines: string[] = [];
    let files = 0;
    let dirs = 0;

    // Get direct children
    const baseDepth = pathDepth(prefix);
    const children = nodes.filter(
      (n) =>
        n.path.startsWith(`${prefix}/`) && pathDepth(n.path) === baseDepth + 1,
    );

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const isLast = i === children.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childIndent = indent + (isLast ? "    " : "│   ");
      const name = basename(child.path);

      if (child.nodeType === CortexNodeType.DIR) {
        dirs++;
        lines.push(`${indent}${connector}${name}/`);
        if (maxDepth > 1) {
          const sub = CortexTreeRepository.buildSubtree(
            nodes,
            child.path,
            childIndent,
            maxDepth - 1,
          );
          lines.push(...sub.lines);
          files += sub.files;
          dirs += sub.dirs;
        }
      } else {
        files++;
        const sizeStr =
          child.size > 0
            ? ` ${child.size >= 1024 ? `${(child.size / 1024).toFixed(1)} KB` : `${child.size} B`}`
            : "";
        lines.push(`${indent}${connector}${name}${sizeStr}`);
      }
    }

    return { lines, files, dirs };
  }
}
