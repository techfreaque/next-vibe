export const translations = {
  category: "Notifications",

  tags: {
    notifications: "notifications",
    list: "list",
    unread: "unread",
    read: "read",
  },

  enums: {
    type: {
      taskComplete: "Task finished",
      taskFailed: "Task failed",
      earning: "Earning",
      dreamerResult: "Dreamer result",
      creditLow: "Credits low",
      system: "System",
    },
  },

  // Copy per type. Rendered in the recipient's own locale when the
  // notification is created. {{params}} come from the event source.
  templates: {
    taskComplete: {
      title: "{{name}} finished",
      body: "Your background task is done. Open the result.",
    },
    taskFailed: {
      title: "{{name}} failed",
      body: "Your background task hit an error. Open it to see why.",
    },
    earning: {
      title: "You earned {{amount}} credits",
      body: "A referral earning cleared its hold period and is now spendable.",
    },
    dreamerResult: {
      title: "{{name}} has a result",
      body: "Your Dreamer run finished.",
    },
    creditLow: {
      title: "Credits running low",
      body: "{{amount}} credits left. Top up before your next run stalls.",
    },
    system: {
      title: "{{name}}",
      body: "",
    },
    fallbackTaskName: "Background task",
  },

  list: {
    get: {
      title: "Notifications",
      titleShort: "Notifications",
      description:
        "Everything that finished while you were away. Unread first.",
      emptyTitle: "Nothing new",
      emptyHint: "Finished tasks and earnings show up here.",
      markAllRead: "Mark all read",
      unread: "Unread",
      response: {
        notifications: {
          id: "ID",
          type: "Type",
          title: "Title",
          body: "Message",
          link: "Link",
          read: "Read",
          createdAt: "Received",
        },
        unreadCount: "Unread",
      },
      paginationInfo: {
        label: "Pagination",
      },
    },
  },

  unreadCount: {
    get: {
      title: "Unread notification count",
      titleShort: "Unread count",
      description: "How many notifications you have not opened yet.",
      response: {
        unreadCount: "Unread notifications",
      },
    },
  },

  read: {
    post: {
      title: "Mark notifications read",
      titleShort: "Mark read",
      description:
        "Mark one notification, or all of them, as read. Send an id or all=true.",
      id: {
        label: "Notification ID",
        description: "The notification to mark read",
      },
      all: {
        label: "Mark everything read",
        description: "Clear the whole unread list",
      },
      response: {
        updatedCount: "Marked read",
      },
      submit: {
        label: "Mark read",
        loading: "Updating...",
      },
    },
  },

  bell: {
    label: "Notifications",
    empty: "You are all caught up.",
    markAllRead: "Mark all read",
    viewAll: "View all",
    loading: "Loading...",
    unreadBadge: "{{count}} unread notifications",
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Send a notification id, or all=true",
    },
    network: {
      title: "Network Error",
      description: "Network connection error",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Sign in to see your notifications",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "Notification not found",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    serverError: {
      title: "Server Error",
      description: "Internal server error occurred",
      detail: "Something broke on our end: {{error}}",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "Notification state conflict",
    },
    idOrAllRequired: "Send a notification id, or all=true.",
  },

  success: {
    title: "Success",
    description: "Operation completed successfully",
  },
};
