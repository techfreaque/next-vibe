export const translations = {
  category: "System",
  tags: {
    remoteSync: "Remote Sync",
  },
  remoteEventBridge: {
    post: {
      title: "Remote Event Bridge",
      titleShort: "Event Bridge",
      description:
        "Receive and republish remote peer events (endpoint-event, live-message-event, sync-event). Called via HTTP by direct-http peers or dispatched via reverse-WS onRemoteEvent.",
      eventName: {
        label: "Event Name",
        description: "The wire event type to process",
      },
      leadId: {
        label: "Lead ID",
        description: "Cross-instance identity of the sending peer",
      },
      originInstanceId: {
        label: "Origin Instance",
        description: "Instance that emitted this event (for echo prevention)",
      },
      payload: {
        label: "Payload",
        description: "Raw event payload forwarded from the remote instance",
      },
      received: {
        label: "Received",
        description: "Whether the event was accepted and processed",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid event payload",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Processing Error",
          description: "An error occurred while processing the event",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to submit events",
        },
        notFound: {
          title: "Not Found",
          description: "Target not found",
        },
        network: {
          title: "Network Error",
          description: "Could not reach the event bridge endpoint",
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
          description: "Event conflict detected",
        },
      },
      success: {
        title: "Event Received",
        description: "Remote event processed successfully",
      },
    },
  },
};
