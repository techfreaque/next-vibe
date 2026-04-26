/**
 * Support API translations (English)
 */

export const translations = {
  endpointCategories: {
    support: "Support",
  },

  // ── sessions ────────────────────────────────────────────────────────────────
  sessions: {
    title: "Support Queue",
    description: "List of pending and active support sessions.",
    tags: {
      support: "Support",
      queue: "Queue",
    },
    success: {
      title: "Sessions loaded",
      description: "Support session list retrieved.",
    },
    errors: {
      fetchFailed: "Failed to load support sessions.",
      validation: {
        title: "Invalid request",
        description: "The request was invalid.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in.",
      },
      forbidden: { title: "Forbidden", description: "Admins only." },
      notFound: { title: "Not found", description: "No sessions found." },
      server: {
        title: "Server error",
        description: "An internal error occurred.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred.",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "You have unsaved changes.",
      },
      conflict: { title: "Conflict", description: "A conflict occurred." },
    },
    widget: {
      noSessions: "No active support sessions",
      pending: "Pending",
      active: "Active",
      join: "Join",
      close: "Close",
      ago: "ago",
      from: "from",
    },
  },

  // ── join ─────────────────────────────────────────────────────────────────────
  join: {
    title: "Join Session",
    description: "Join a pending support session as a supporter.",
    tags: {
      support: "Support",
      join: "Join",
    },
    fields: {
      sessionId: {
        label: "Session ID",
        description: "The support session to join.",
      },
      threadId: {
        label: "Thread ID",
        description: "The thread associated with this session.",
      },
      initiatorInstanceUrl: {
        label: "Initiator Instance URL",
        description: "URL of the instance that opened the session.",
      },
    },
    systemMessage: "A supporter has joined the session.",
    success: {
      title: "Joined",
      description: "You have joined the support session.",
    },
    errors: {
      sessionNotFound: "Support session not found.",
      alreadyJoined: "This session already has an active supporter.",
      callbackFailed: "Failed to notify the initiating instance.",
      validation: {
        title: "Invalid request",
        description: "The request was invalid.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in.",
      },
      forbidden: { title: "Forbidden", description: "Admins only." },
      notFound: { title: "Not found", description: "Session not found." },
      server: {
        title: "Server error",
        description: "An internal error occurred.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred.",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "You have unsaved changes.",
      },
      conflict: { title: "Conflict", description: "Session already active." },
    },
  },

  // ── session-joined ───────────────────────────────────────────────────────────
  sessionJoined: {
    title: "Session Joined Callback",
    description:
      "Internal callback — notifies initiating instance that a supporter joined.",
    tags: {
      support: "Support",
      callback: "Callback",
    },
    fields: {
      sessionId: {
        label: "Session ID",
        description: "The session that was joined.",
      },
      threadId: {
        label: "Thread ID",
        description: "The thread to post the join message into.",
      },
      joinedMessage: {
        label: "Join Message",
        description: "System message content to insert into the thread.",
      },
    },
    success: {
      title: "Acknowledged",
      description: "Join confirmed.",
    },
    errors: {
      failed: "Failed to process session-joined callback.",
      validation: {
        title: "Invalid request",
        description: "The request was invalid.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in.",
      },
      forbidden: { title: "Forbidden", description: "Admins only." },
      notFound: { title: "Not found", description: "Session not found." },
      server: {
        title: "Server error",
        description: "An internal error occurred.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred.",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "You have unsaved changes.",
      },
      conflict: { title: "Conflict", description: "A conflict occurred." },
    },
  },

  // ── close ─────────────────────────────────────────────────────────────────────
  close: {
    title: "Close Session",
    description: "Close an active support session.",
    tags: {
      support: "Support",
      close: "Close",
    },
    fields: {
      sessionId: {
        label: "Session ID",
        description: "The support session to close.",
      },
      closed: {
        label: "Closed",
        description: "Whether the session was closed.",
      },
    },
    systemMessage: "The support session has ended.",
    success: {
      title: "Closed",
      description: "The support session has been closed.",
    },
    errors: {
      sessionNotFound: "Support session not found.",
      alreadyClosed: "This session is already closed.",
      validation: {
        title: "Invalid request",
        description: "The request was invalid.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in.",
      },
      forbidden: { title: "Forbidden", description: "Admins only." },
      notFound: { title: "Not found", description: "Session not found." },
      server: {
        title: "Server error",
        description: "An internal error occurred.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred.",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "You have unsaved changes.",
      },
      conflict: { title: "Conflict", description: "Session already closed." },
    },
  },
} as const;

export type SupportTranslations = typeof translations;
