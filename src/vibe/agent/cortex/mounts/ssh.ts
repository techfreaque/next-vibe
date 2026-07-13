import "server-only";

/**
 * SSH Connections Virtual Mount
 *
 * Structure:
 *   /ssh/                                → lists all connections as directories
 *   /ssh/<label-slug>                    → connection summary (host, user, notes)
 *   /ssh/<label-slug>/                   → root filesystem listing (local fs or SFTP)
 *   /ssh/<label-slug>/etc/hosts          → reads file (local fs or SFTP)
 *   /ssh/<label-slug>/var/log/           → directory listing (local fs or SFTP)
 *
 * <label-slug> = label.toLowerCase().replace(/\s+/g, "-")
 * e.g. "Local Machine" → "local-machine"
 *
 * LOCAL connections (authType=LOCAL) use node:fs directly.
 * SSH connections use SFTP via ssh2.
 * Remote connections (reverse-WS) appear as readonly virtual entries.
 * Read-only. Manage connections via ssh_connections_* tools.
 */
import { and, asc, count as drizzleCount, desc, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { remoteConnections } from "next-vibe/remote-connection/db";
import { RemoteConnectionRepository } from "next-vibe/remote-connection/repository";

import type { ClientT } from "@/ssh/client";
import { sshConnectionMounts, sshConnections } from "@/ssh/db";
import { ClusterRole, SshAuthType } from "@/ssh/enum";
import { getSessionsForConnection } from "@/ssh/session/pool";

import type {
  VirtualDeleteResult,
  VirtualListEntry,
  VirtualMoveResult,
  VirtualReadResult,
  VirtualWriteResult,
} from "./resolver";

/** Minimal t() stub for client helpers — errors yield null returns */
const stubT: ClientT = (key) => key as ReturnType<ClientT>;

type SshRow = typeof sshConnections.$inferSelect;

type RemoteRow = typeof remoteConnections.$inferSelect;

/** Discriminated union for connection resolution */
type ResolvedMount =
  | { kind: "ssh"; row: SshRow }
  | { kind: "remote"; row: RemoteRow };

// ─── Mount helpers ────────────────────────────────────────────────────────────

type MountRow = typeof sshConnectionMounts.$inferSelect;

async function getMountsForConnection(
  connectionId: string,
  userId: string,
): Promise<MountRow[]> {
  return db
    .select()
    .from(sshConnectionMounts)
    .where(
      and(
        eq(sshConnectionMounts.connectionId, connectionId),
        eq(sshConnectionMounts.userId, userId),
      ),
    )
    .orderBy(
      desc(sshConnectionMounts.isDefault),
      asc(sshConnectionMounts.path),
    );
}

/**
 * If the first path segment after the connection slug matches a mount name,
 * return the real filesystem path with the remainder appended.
 * Otherwise return null (use raw path).
 */
function resolveMountPath(
  mounts: MountRow[],
  segments: string[], // segments after the connection slug
): string | null {
  if (segments.length === 0) {
    return null;
  }
  const mountName = segments[0]!;
  // Match by m.name first (what the listing displays), then by path's last segment
  const mount = mounts.find((m) => {
    const displayName =
      m.name ?? m.path.split("/").filter(Boolean).at(-1) ?? m.path;
    return displayName === mountName;
  });
  if (!mount) {
    return null;
  }
  const remainder = segments.slice(1);
  return remainder.length === 0
    ? mount.path
    : `${mount.path}/${remainder.join("/")}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function readSshPath(
  userId: string,
  path: string,
  isAdmin: boolean,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  await ensureLocalConnection(userId, isAdmin);
  const connectionId = segments[1]!;
  const resolved = await getConnection(userId, connectionId);
  if (!resolved) {
    return null;
  }

  // /ssh/<connectionId> → render connection summary
  if (segments.length === 2) {
    return resolved.kind === "ssh"
      ? renderConnectionSummary(resolved.row, userId)
      : renderRemoteConnectionSummary(resolved.row);
  }

  // Remote connections don't support filesystem browsing
  if (resolved.kind === "remote") {
    return null;
  }

  const conn = resolved.row;
  const mounts = await getMountsForConnection(conn.id, userId);
  const afterConn = segments.slice(2); // segments after /ssh/<slug>/

  // Try mount name resolution first; fall back to raw path
  const resolvedPath = resolveMountPath(mounts, afterConn);
  const remotePath = resolvedPath ?? `/${afterConn.join("/")}`;

  return conn.authType === SshAuthType.LOCAL
    ? readLocalFile(remotePath)
    : readRemoteFile(conn, userId, remotePath);
}

export async function listSshPath(
  userId: string,
  path: string,
  isAdmin: boolean,
): Promise<VirtualListEntry[]> {
  await ensureLocalConnection(userId, isAdmin);
  const segments = path.split("/").filter(Boolean);

  // /ssh → list all connections as directories
  if (segments.length <= 1) {
    return listConnections(userId);
  }

  const connectionId = segments[1]!;
  const resolved = await getConnection(userId, connectionId);
  if (!resolved) {
    return [];
  }

  // Remote connections don't support filesystem listing
  if (resolved.kind === "remote") {
    return [];
  }

  const conn = resolved.row;
  const mounts = await getMountsForConnection(conn.id, userId);
  const afterConn = segments.slice(2); // segments after /ssh/<slug>/

  // /ssh/<slug>/ — connection root:
  // If there's exactly one mount (or a default mount), browse its contents directly.
  // Only show the mount list when there are multiple non-default mounts to choose from.
  if (afterConn.length === 0) {
    const slug = labelToSlug(conn.label);
    const defaultMount = mounts.find((m) => m.isDefault) ?? mounts[0];
    if (defaultMount && mounts.length === 1) {
      // Single mount — jump straight into its contents.
      // Virtual path keeps the mount name as first segment so resolveMountPath
      // can resolve deeper navigation correctly.
      const mountName =
        defaultMount.name ??
        defaultMount.path.split("/").filter(Boolean).at(-1) ??
        defaultMount.path;
      const entries =
        conn.authType === SshAuthType.LOCAL
          ? await listLocalDir(conn, defaultMount.path)
          : await listRemoteDir(conn, userId, defaultMount.path);
      return entries.map((e) => ({
        ...e,
        path: `/ssh/${slug}/${mountName}/${e.name}`,
      }));
    }
    if (defaultMount) {
      // Multiple mounts — show mount list so user can pick entry point
      return mounts.map((m) => {
        const name =
          m.name ?? m.path.split("/").filter(Boolean).at(-1) ?? m.path;
        return {
          name,
          path: `/ssh/${slug}/${name}`,
          nodeType: "dir" as const,
          size: null,
          updatedAt: m.updatedAt.toISOString(),
        };
      });
    }
    // No mounts — list filesystem root directly
    const entries =
      conn.authType === SshAuthType.LOCAL
        ? await listLocalDir(conn, "/")
        : await listRemoteDir(conn, userId, "/");
    return entries.map((e) => ({ ...e, path: `/ssh/${slug}/${e.name}` }));
  }

  // /ssh/<slug>/<segment>/... — try mount resolution first
  const resolvedPath = resolveMountPath(mounts, afterConn);
  if (resolvedPath !== null) {
    const entries =
      conn.authType === SshAuthType.LOCAL
        ? await listLocalDir(conn, resolvedPath)
        : await listRemoteDir(conn, userId, resolvedPath);
    // Remap real FS paths back to cortex virtual paths
    return entries.map((e) => ({ ...e, path: `${path}/${e.name}` }));
  }

  // Raw filesystem path
  const remotePath = `/${afterConn.join("/")}`;
  return conn.authType === SshAuthType.LOCAL
    ? listLocalDir(conn, remotePath)
    : listRemoteDir(conn, userId, remotePath);
}

export async function getSshCount(
  userId: string,
  isAdmin: boolean,
): Promise<number> {
  await ensureLocalConnection(userId, isAdmin);
  const [sshRows, remoteRows] = await Promise.all([
    db
      .select({ count: drizzleCount() })
      .from(sshConnections)
      .where(eq(sshConnections.userId, userId)),
    db
      .select({ count: drizzleCount() })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
        ),
      ),
  ]);
  return (sshRows[0]?.count ?? 0) + (remoteRows[0]?.count ?? 0);
}

// ─── Local connection bootstrapping ──────────────────────────────────────────

export async function ensureLocalConnection(
  userId: string,
  isAdmin: boolean,
): Promise<void> {
  if (!isAdmin) {
    return;
  }

  const rows = await db
    .select({
      id: sshConnections.id,
      authType: sshConnections.authType,
      isDefault: sshConnections.isDefault,
    })
    .from(sshConnections)
    .where(eq(sshConnections.userId, userId));

  const localRow = rows.find((r) => r.authType === SshAuthType.LOCAL);
  if (localRow) {
    // Backfill default mount for existing local connections that have none
    const { ensureDefaultMount } =
      await import("@/ssh/connections/mounts-bootstrap");
    await ensureDefaultMount(localRow.id, userId);
    return;
  }

  const hasDefault = rows.some((r) => r.isDefault);
  const [newConn] = await db
    .insert(sshConnections)
    .values({
      userId,
      label: "Local Machine",
      host: "localhost",
      port: 0,
      username: process.env["USER"] ?? "local",
      authType: SshAuthType.LOCAL,
      encryptedSecret: "",
      isDefault: !hasDefault,
      notes: "Built-in local shell - no SSH credentials needed",
    })
    .returning({ id: sshConnections.id });

  if (newConn) {
    const { ensureDefaultMount } =
      await import("@/ssh/connections/mounts-bootstrap");
    await ensureDefaultMount(newConn.id, userId);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "Local Machine" → "local-machine" */
function labelToSlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-");
}

async function getConnection(
  userId: string,
  connectionId: string,
): Promise<ResolvedMount | null> {
  // Try SSH connections first
  const sshRows = await db
    .select()
    .from(sshConnections)
    .where(eq(sshConnections.userId, userId))
    .limit(50);
  const sshMatch = sshRows.find(
    (r) =>
      r.id === connectionId ||
      r.label === connectionId ||
      labelToSlug(r.label) === connectionId,
  );
  if (sshMatch) {
    return { kind: "ssh", row: sshMatch };
  }

  // Try remote connections by instanceId
  const remoteRows = await db
    .select()
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, userId),
        eq(remoteConnections.isActive, true),
      ),
    );
  const remoteMatch = remoteRows.find(
    (r) =>
      r.instanceId === connectionId ||
      r.instanceId.toLowerCase() === connectionId,
  );
  if (remoteMatch) {
    return { kind: "remote", row: remoteMatch };
  }

  return null;
}

async function listConnections(userId: string): Promise<VirtualListEntry[]> {
  const [sshRows, remoteRows] = await Promise.all([
    db
      .select({
        id: sshConnections.id,
        label: sshConnections.label,
        updatedAt: sshConnections.updatedAt,
      })
      .from(sshConnections)
      .where(eq(sshConnections.userId, userId))
      .orderBy(sshConnections.label),
    db
      .select({
        instanceId: remoteConnections.instanceId,
        updatedAt: remoteConnections.updatedAt,
        isActive: remoteConnections.isActive,
        lastSyncedAt: remoteConnections.lastSyncedAt,
      })
      .from(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.isActive, true),
        ),
      )
      .orderBy(remoteConnections.instanceId),
  ]);

  const entries: VirtualListEntry[] = [];

  for (const c of sshRows) {
    entries.push({
      name: labelToSlug(c.label),
      path: `/ssh/${labelToSlug(c.label)}`,
      nodeType: "dir" as const,
      size: null,
      updatedAt: c.updatedAt.toISOString(),
    });
  }

  for (const r of remoteRows) {
    const health = RemoteConnectionRepository.getConnectionHealth(r);
    const slug = r.instanceId.toLowerCase();
    entries.push({
      name: `${slug} [${health}]`,
      path: `/ssh/${slug}`,
      nodeType: "dir" as const,
      size: null,
      updatedAt: r.updatedAt.toISOString(),
    });
  }

  return entries;
}

async function renderConnectionSummary(
  conn: SshRow,
  userId: string,
): Promise<VirtualReadResult> {
  const slug = labelToSlug(conn.label);
  const terminals = getSessionsForConnection(slug);
  const mounts = await getMountsForConnection(conn.id, userId);

  const fm = [
    "---",
    `connectionId: "${conn.id}"`,
    `label: "${conn.label}"`,
    `host: "${conn.host}"`,
    `port: ${conn.port}`,
    `username: "${conn.username}"`,
    `authType: "${conn.authType}"`,
    `isDefault: ${conn.isDefault}`,
  ];
  if (conn.clusterRole && conn.clusterRole !== ClusterRole.NONE) {
    fm.push(`clusterRole: "${conn.clusterRole}"`);
  }
  if (conn.fingerprint) {
    fm.push(`fingerprint: "${conn.fingerprint}"`);
  }
  fm.push(
    `created: "${conn.createdAt.toISOString()}"`,
    `updated: "${conn.updatedAt.toISOString()}"`,
    "---",
  );

  const body = [
    `# ${conn.label}`,
    "",
    `**Host:** ${conn.host}${conn.port ? `:${conn.port}` : ""}  **User:** ${conn.username}  **Auth:** ${conn.authType}`,
    "",
    `Browse filesystem: \`cortex-list(path="/ssh/${slug}/")\``,
    `Run commands: \`cortex-exec(path="/ssh/${slug}", command="...")\``,
  ];

  if (mounts.length > 0) {
    body.push("", "## Mounts", "");
    for (const m of mounts) {
      const basename = m.path.split("/").filter(Boolean).at(-1) ?? m.path;
      body.push(
        `- **${basename}** → \`${m.path}\`${m.isDefault ? "  *(default cwd)*" : ""}`,
      );
    }
    body.push(
      "",
      `Use: \`cortex-list(path="/ssh/${slug}/<mount>/")\` to browse a mount.`,
    );
  }

  if (terminals.length > 0) {
    body.push("", "## Active Terminals", "");
    for (const t of terminals) {
      body.push(
        `- **${t.sessionId.slice(0, 8)}** cwd=\`${t.cwd}\` (${t.kind})`,
      );
    }
  }

  if (conn.notes) {
    body.push("", "## Notes", "", conn.notes);
  }

  return {
    content: [...fm, "", ...body].join("\n").trimEnd(),
    nodeType: "file",
    updatedAt: conn.updatedAt.toISOString(),
  };
}

function renderRemoteConnectionSummary(conn: RemoteRow): VirtualReadResult {
  const health = RemoteConnectionRepository.getConnectionHealth(conn);
  const slug = conn.instanceId.toLowerCase();
  const terminals = getSessionsForConnection(slug);

  const fm = [
    "---",
    `type: "remote"`,
    `instanceId: "${conn.instanceId}"`,
    `remoteUrl: "${conn.remoteUrl}"`,
    `transportMode: "${conn.transportMode}"`,
    `health: "${health}"`,
    `isDefault: false`,
  ];
  if (conn.lastSyncedAt) {
    fm.push(`lastSyncedAt: "${conn.lastSyncedAt.toISOString()}"`);
  }
  if (conn.wsConnectedAt) {
    fm.push(`wsConnectedAt: "${conn.wsConnectedAt.toISOString()}"`);
  }
  if (conn.capabilitiesVersion) {
    fm.push(`capabilitiesVersion: "${conn.capabilitiesVersion}"`);
  }
  fm.push(
    `created: "${conn.createdAt.toISOString()}"`,
    `updated: "${conn.updatedAt.toISOString()}"`,
    "---",
  );

  const body = [
    `# ${conn.instanceId} (remote)`,
    "",
    `**URL:** ${conn.remoteUrl}  **Transport:** ${conn.transportMode}  **Health:** ${health}`,
    "",
    `Run commands: \`cortex-exec(path="/ssh/${slug}", command="...")\``,
    "",
    "Filesystem browsing is not available for remote connections.",
    "Use `cortex-exec` to run `ls`, `cat`, etc. on the remote machine.",
  ];

  if (terminals.length > 0) {
    body.push("", "## Active Terminals", "");
    for (const t of terminals) {
      body.push(
        `- **${t.sessionId.slice(0, 8)}** cwd=\`${t.cwd}\` (${t.kind})`,
      );
    }
  }

  return {
    content: [...fm, "", ...body].join("\n").trimEnd(),
    nodeType: "file",
    updatedAt: conn.updatedAt.toISOString(),
  };
}

// ─── LOCAL filesystem ─────────────────────────────────────────────────────────

async function readLocalFile(
  filePath: string,
): Promise<VirtualReadResult | null> {
  const { readFile, stat } = await import(
    /* turbopackIgnore: true */ "node:fs/promises"
  );
  try {
    const st = await stat(filePath);
    const updatedAt = st.mtime.toISOString();
    const raw = await readFile(filePath);
    const content = raw.slice(0, 65536).toString("utf8");
    return { content, nodeType: "file", updatedAt };
  } catch {
    return null;
  }
}

async function listLocalDir(
  conn: SshRow,
  dirPath: string,
): Promise<VirtualListEntry[]> {
  const { readdir, stat } = await import(
    /* turbopackIgnore: true */ "node:fs/promises"
  );
  const base = dirPath === "/" ? "" : dirPath;
  try {
    const names = await readdir(dirPath);
    const entries: VirtualListEntry[] = [];
    const SKIP = new Set([
      "node_modules",
      ".git",
      ".next",
      "dist",
      ".turbo",
      ".cache",
    ]);
    for (const name of names) {
      if (name.startsWith(".") || SKIP.has(name)) {
        continue;
      }
      const fullPath = `${base}/${name}`;
      try {
        const st = await stat(fullPath);
        entries.push({
          name,
          path: `/ssh/${labelToSlug(conn.label)}${fullPath}`,
          nodeType: st.isDirectory() ? "dir" : "file",
          size: st.isDirectory() ? null : st.size,
          updatedAt: st.mtime.toISOString(),
        });
      } catch {
        // skip unreadable entries
      }
    }
    entries.sort((a, b) => {
      if (a.nodeType === "dir" && b.nodeType !== "dir") {
        return -1;
      }
      if (b.nodeType === "dir" && a.nodeType !== "dir") {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
    return entries;
  } catch {
    return [];
  }
}

// ─── Remote SFTP ─────────────────────────────────────────────────────────────

async function readRemoteFile(
  conn: SshRow,
  userId: string,
  remotePath: string,
): Promise<VirtualReadResult | null> {
  const { getConnectionCredentials, openSshClient, sftpReadFile } =
    await import("@/ssh/client");

  const credsResult = await getConnectionCredentials(conn.id, userId, stubT);
  if (!credsResult.success) {
    return null;
  }

  const clientResult = await openSshClient(credsResult.data, stubT);
  if (!clientResult.success) {
    return null;
  }

  const { client } = clientResult.data;
  try {
    const result = await sftpReadFile(client, remotePath, 0, 65536);
    return {
      content: result.content,
      nodeType: "file",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    client.end();
  }
}

// ─── Mkdir ────────────────────────────────────────────────────────────────────

export async function mkdirSshPath(
  userId: string,
  path: string,
): Promise<boolean> {
  const r = await resolveRealPath(userId, path);
  if (!r) {
    return false;
  }
  const { conn, realPath } = r;
  if (conn.authType === SshAuthType.LOCAL) {
    const { mkdir } = await import(
      /* turbopackIgnore: true */ "node:fs/promises"
    );
    await mkdir(realPath, { recursive: true });
    return true;
  }
  const { getConnectionCredentials, openSshClient } =
    await import("@/ssh/client");
  const credsResult = await getConnectionCredentials(conn.id, userId, stubT);
  if (!credsResult.success) {
    return false;
  }
  const clientResult = await openSshClient(credsResult.data, stubT);
  if (!clientResult.success) {
    return false;
  }
  const { client } = clientResult.data;
  try {
    await new Promise<void>((resolve, reject) => {
      client.exec(`mkdir -p "${realPath}"`, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        stream.on("close", resolve);
        stream.resume();
      });
    });
    return true;
  } finally {
    client.end();
  }
}

// ─── Write / Delete / Move ────────────────────────────────────────────────────

/** Resolve real filesystem path for a write/delete/move operation */
async function resolveRealPath(
  userId: string,
  path: string,
): Promise<{ conn: SshRow; realPath: string } | null> {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 3) {
    return null; // /ssh or /ssh/<slug> — not a file path
  }
  const connectionId = segments[1]!;
  const resolved = await getConnection(userId, connectionId);
  if (!resolved || resolved.kind === "remote") {
    return null;
  }
  const conn = resolved.row;
  const mounts = await getMountsForConnection(conn.id, userId);
  const afterConn = segments.slice(2);
  const resolvedPath = resolveMountPath(mounts, afterConn);
  const realPath = resolvedPath ?? `/${afterConn.join("/")}`;
  return { conn, realPath };
}

export async function writeSshPath(
  userId: string,
  path: string,
  content: string,
): Promise<VirtualWriteResult | null> {
  const r = await resolveRealPath(userId, path);
  if (!r) {
    return null;
  }
  const { conn, realPath } = r;
  if (conn.authType === SshAuthType.LOCAL) {
    const fsP = await import(/* turbopackIgnore: true */ "node:fs/promises");
    const parentDir = realPath.split("/").slice(0, -1).join("/") || "/";
    await fsP.mkdir(parentDir, { recursive: true });
    const existed = await fsP
      .stat(realPath)
      .then(() => true)
      .catch(() => false);
    await fsP.writeFile(realPath, content, "utf8");
    return { path, created: !existed };
  }
  const { getConnectionCredentials, openSshClient, sftpWriteFile } =
    await import("@/ssh/client");
  const credsResult = await getConnectionCredentials(conn.id, userId, stubT);
  if (!credsResult.success) {
    return null;
  }
  const clientResult = await openSshClient(credsResult.data, stubT);
  if (!clientResult.success) {
    return null;
  }
  const { client } = clientResult.data;
  try {
    await sftpWriteFile(client, realPath, content, true);
    return { path, created: true };
  } catch {
    return null;
  } finally {
    client.end();
  }
}

export async function deleteSshPath(
  userId: string,
  path: string,
): Promise<VirtualDeleteResult | null> {
  const r = await resolveRealPath(userId, path);
  if (!r) {
    return null;
  }
  const { conn, realPath } = r;
  if (conn.authType === SshAuthType.LOCAL) {
    const { unlink } = await import(
      /* turbopackIgnore: true */ "node:fs/promises"
    );
    try {
      await unlink(realPath);
      return { path, deleted: true };
    } catch {
      return null;
    }
  }
  const { getConnectionCredentials, openSshClient, sftpDeleteFile } =
    await import("@/ssh/client");
  const credsResult = await getConnectionCredentials(conn.id, userId, stubT);
  if (!credsResult.success) {
    return null;
  }
  const clientResult = await openSshClient(credsResult.data, stubT);
  if (!clientResult.success) {
    return null;
  }
  const { client } = clientResult.data;
  try {
    await sftpDeleteFile(client, realPath);
    return { path, deleted: true };
  } catch {
    return null;
  } finally {
    client.end();
  }
}

export async function moveSshPath(
  userId: string,
  fromPath: string,
  toPath: string,
): Promise<VirtualMoveResult | null> {
  const fromR = await resolveRealPath(userId, fromPath);
  const toR = await resolveRealPath(userId, toPath);
  if (!fromR || !toR || fromR.conn.id !== toR.conn.id) {
    return null; // cross-machine moves not supported
  }
  const { conn, realPath: realFrom } = fromR;
  const { realPath: realTo } = toR;
  if (conn.authType === SshAuthType.LOCAL) {
    const { rename } = await import(
      /* turbopackIgnore: true */ "node:fs/promises"
    );
    try {
      await rename(realFrom, realTo);
      return { from: fromPath, to: toPath };
    } catch {
      return null;
    }
  }
  const { getConnectionCredentials, openSshClient, sftpRenameFile } =
    await import("@/ssh/client");
  const credsResult = await getConnectionCredentials(conn.id, userId, stubT);
  if (!credsResult.success) {
    return null;
  }
  const clientResult = await openSshClient(credsResult.data, stubT);
  if (!clientResult.success) {
    return null;
  }
  const { client } = clientResult.data;
  try {
    await sftpRenameFile(client, realFrom, realTo);
    return { from: fromPath, to: toPath };
  } catch {
    return null;
  } finally {
    client.end();
  }
}

async function listRemoteDir(
  conn: SshRow,
  userId: string,
  remotePath: string,
): Promise<VirtualListEntry[]> {
  const { getConnectionCredentials, openSshClient, sftpListDir } =
    await import("@/ssh/client");

  const credsResult = await getConnectionCredentials(conn.id, userId, stubT);
  if (!credsResult.success) {
    return [];
  }

  const clientResult = await openSshClient(credsResult.data, stubT);
  if (!clientResult.success) {
    return [];
  }

  const { client } = clientResult.data;
  try {
    const entries = await sftpListDir(client, remotePath);
    const base = remotePath === "/" ? "" : remotePath;
    return entries.map((e) => ({
      name: e.name,
      path: `/ssh/${labelToSlug(conn.label)}${base}/${e.name}`,
      nodeType: (e.type === "dir" ? "dir" : "file") as "dir" | "file",
      size: e.size ?? null,
      updatedAt: e.modifiedAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  } finally {
    client.end();
  }
}
