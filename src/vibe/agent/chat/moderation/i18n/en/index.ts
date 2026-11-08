export const translations = {
  category: "Chat",
  tags: {
    moderation: "Moderation",
  },
  get: {
    title: "Reported Content",
    titleShort: "Moderation Queue",
    description:
      "Reported and hidden public-feed posts and shared threads, most urgent first",
    fields: {
      minReports: {
        label: "Min Reports",
        description: "Minimum open reports to include (default: 1)",
      },
      limit: {
        label: "Limit",
        description: "Maximum number of threads to return",
      },
      offset: {
        label: "Offset",
        description: "Number of threads to skip for pagination",
      },
    },
    response: {
      threads: {
        id: { content: "Thread ID" },
        title: { content: "Title" },
        rootFolderId: { content: "Folder" },
        authorId: { content: "Author ID" },
        authorName: { content: "Author" },
        authorBanned: { content: "Author banned" },
        moderationStatus: { content: "Status" },
        reportCount: { content: "Reports" },
        reasons: { content: "Reasons" },
        latestNote: { content: "Latest note" },
        updatedAt: { content: "Updated At" },
      },
      totalCount: { content: "Total" },
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Connection failed" },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      notFound: { title: "Not Found", description: "Thread not found" },
      server: {
        title: "Server Error",
        description: "Failed to load the moderation queue",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
    },
    success: {
      title: "Queue Loaded",
      description: "Reported content retrieved successfully",
    },
    note: "“{{note}}”",
    empty: "Nothing reported. The community looks healthy.",
    status: {
      visible: "Visible",
      underReview: "Under review",
      removed: "Removed",
      authorBanned: "Author banned",
    },
    reasons: {
      spam: "Spam",
      illegal: "Illegal",
      abuse: "Abuse",
      csamFlag: "Child safety",
      other: "Other",
    },
    action: {
      dismiss: "Dismiss",
      remove: "Remove",
      banAuthor: "Remove + ban author",
    },
    backButton: {
      label: "Back",
    },
  },
  patch: {
    title: "Moderate Content",
    titleShort: "Moderate",
    description:
      "Dismiss reports and restore a thread, remove it, or remove it and ban its author",
    fields: {
      id: {
        label: "Thread ID",
        description: "ID of the thread to moderate",
      },
      action: {
        label: "Action",
        description:
          "dismiss = restore and clear reports, remove = hide permanently, ban = remove and ban the author",
      },
    },
    actions: {
      dismiss: "Dismiss reports (restore)",
      remove: "Remove content",
      banAuthor: "Remove and ban author",
    },
    response: {
      patchId: { content: "Thread ID" },
      patchStatus: { content: "New Status" },
      patchReportCount: { content: "Report Count" },
      authorBanned: { content: "Author banned" },
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Connection failed" },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      notFound: { title: "Not Found", description: "Thread not found" },
      server: {
        title: "Server Error",
        description: "Failed to moderate the thread",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
      noAuthor: {
        title: "No registered author",
        description:
          "This thread was posted by a guest, so there is no account to ban",
      },
    },
    success: {
      title: "Content Moderated",
      description: "Action applied successfully",
    },
  },
};
