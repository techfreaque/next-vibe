/** Pre-resolved relay context for a user session (e.g. an AI stream).
 *  Resolve once with RemoteEventBridgeRepository.resolveRemoteEventContext()
 *  and pass into every emitter's resolvedRelayContext option — eliminates
 *  per-event DB queries for originInstanceId + activeConnections. */
export interface ResolvedRelayContext {
  readonly originInstanceId: string;
  readonly connections: ReadonlyArray<{
    instanceId: string;
    tokenLeadId: string;
    remoteUserId: string | null;
    isReverseEntry: boolean;
    /** How WE reach the peer (our event send leg). */
    transportMode: string | null;
    /** How the PEER reaches us (mirror of the peer's transportMode). */
    remoteTransportMode: string | null;
    syncScope: Record<string, boolean> | null;
  }>;
}
