export const translations = {
  category: "System",
  tags: {
    remoteSync: "Remote Sync",
  },
  taskSync: {
    post: {
      title: "Remote Sync",
      titleShort: "Sync",
      description:
        "Cursor-based bidirectional sync between instances. Sends local cursors, receives only newer records.",
      instanceId: {
        label: "Instance ID",
        description: "The calling instance's identifier",
      },
      syncCursors: {
        label: "Sync Cursors",
        description: "Per-domain cursors indicating the last synced position",
      },
      capabilitiesVersion: {
        label: "Capabilities Version",
        description:
          "Version of the receiving instance's capability snapshot the caller holds",
      },
      senderCapabilitiesVersion: {
        label: "Sender Capabilities Version",
        description:
          "Version of the calling instance's own capability snapshot",
      },
      capabilitiesJson: {
        label: "Capabilities JSON",
        description: "Tool manifest snapshot to register on this instance",
      },
      pushPayloads: {
        label: "Push Payloads",
        description:
          "Caller's records newer than its push cursors — applied here before the response is serialized (bidirectional push-pull)",
      },
      syncPayloads: {
        label: "Sync Payloads",
        description: "Records newer than the provided cursors, per domain",
      },
      syncCounts: {
        label: "Sync Counts",
        description: "Number of records returned per domain",
      },
      remoteCursors: {
        label: "Remote Cursors",
        description:
          "This instance's current cursors — advance local cursors to these",
      },
      remoteCapabilitiesVersion: {
        label: "Remote Capabilities Version",
        description: "This instance's current capabilities version",
      },
      capabilities: {
        label: "Capabilities",
        description: "Tool manifest snapshot from this instance",
      },
      serverTime: {
        label: "Server Time",
        description: "Current server timestamp",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid sync request",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Sync Error",
          description: "An error occurred during sync",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to sync",
        },
        notFound: {
          title: "Not Found",
          description: "Sync target not found",
        },
        network: {
          title: "Network Error",
          description: "Could not reach the sync endpoint",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "Sync conflict detected",
        },
      },
      success: {
        title: "Synced",
        description: "Sync completed successfully",
      },
    },
  },
};
