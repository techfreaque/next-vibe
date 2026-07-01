import "server-only";

/**
 * Mount Bootstrap Helper
 *
 * Auto-materializes a default mount for a connection if none exists yet.
 * Called after create/update of any SSH connection.
 *
 * Default mount paths:
 *   LOCAL  → process.cwd()  (admin only — the active project directory)
 *   SSH    → /home/<username>
 *   (remote connections are handled via cortex-exec, no FS mount needed)
 */
import { and, count as drizzleCount, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import { sshConnectionMounts, sshConnections } from "../db";
import { SshAuthType } from "../enum";

/**
 * Ensure a connection has at least one mount.
 * If no mounts exist yet, insert a sensible default.
 * No-ops silently on any error — mounting is best-effort.
 */
export async function ensureDefaultMount(
  connectionId: string,
  userId: string,
): Promise<void> {
  try {
    // Check if any mount exists
    const [row] = await db
      .select({ count: drizzleCount() })
      .from(sshConnectionMounts)
      .where(
        and(
          eq(sshConnectionMounts.connectionId, connectionId),
          eq(sshConnectionMounts.userId, userId),
        ),
      );

    if ((row?.count ?? 0) > 0) {
      return; // already has mounts
    }

    // Fetch the connection to determine mount path
    const [conn] = await db
      .select({
        authType: sshConnections.authType,
        username: sshConnections.username,
      })
      .from(sshConnections)
      .where(
        and(
          eq(sshConnections.id, connectionId),
          eq(sshConnections.userId, userId),
        ),
      )
      .limit(1);

    if (!conn) {
      return;
    }

    const mountPath =
      conn.authType === SshAuthType.LOCAL
        ? process.cwd()
        : `/home/${conn.username}`;
    const name = mountPath.split("/").filter(Boolean).at(-1) ?? "home";

    await db
      .insert(sshConnectionMounts)
      .values({
        userId,
        connectionId,
        name,
        path: mountPath,
        isDefault: true,
      })
      .onConflictDoNothing();
  } catch {
    // Best-effort — never throw
  }
}
