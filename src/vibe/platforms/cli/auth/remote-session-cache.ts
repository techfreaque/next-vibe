/**
 * Remote Session
 *
 * Reads per-user remote connection config from `remote_connections` DB.
 * --thea uses the dev DB by default, or the preview DB when combined with --hermes.
 * The active db singleton is always correct when this is called.
 */

interface RemoteSession {
  token: string;
  leadId: string;
  remoteUrl: string;
  instanceId: string;
}

/**
 * Get the remote session for a user from the DB.
 * Returns null if not configured.
 */
export async function getRemoteSession(
  userId: string,
): Promise<RemoteSession | null> {
  const { RemoteConnectionRepository } =
    await import("next-vibe/remote-connection/repository");

  const record =
    await RemoteConnectionRepository.getRemoteConnectionRecord(userId);
  if (!record) {
    return null;
  }

  return {
    token: record.token,
    leadId: record.leadId,
    remoteUrl: record.remoteUrl,
    instanceId: record.instanceId,
  };
}
