/**
 * Remote Session
 *
 * Reads per-user remote connection config from `remote_connections` DB.
 * --remote uses the dev DB by default, or the preview DB when combined with --local.
 * The active db singleton is always correct when this is called.
 */

export interface RemoteSession {
  token: string;
  leadId: string;
  remoteUrl: string;
}

/**
 * Get the remote session for a user from the DB.
 * Returns null if not configured.
 */
export async function getRemoteSession(
  userId: string,
): Promise<RemoteSession | null> {
  const { getRemoteConnectionRecord } =
    await import("@/app/api/[locale]/user/remote-connection/repository");

  const record = await getRemoteConnectionRecord(userId);
  if (!record) {
    return null;
  }

  return {
    token: record.token,
    leadId: record.leadId,
    remoteUrl: record.remoteUrl,
  };
}
