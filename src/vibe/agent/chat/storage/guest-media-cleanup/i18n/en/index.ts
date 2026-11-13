export const translations = {
  tags: {
    maintenance: "Maintenance",
  },
  post: {
    title: "Guest Media Cleanup",
    titleShort: "Guest Media Cleanup",
    description:
      "Delete media that guests generated in incognito chats and standalone tool runs once it passes the retention window. Only guests who never signed up or logged in. Saved threads and account files are never touched.",
    container: {
      title: "Guest Media Cleanup",
      description: "Run or preview the cleanup",
    },
    fields: {
      retentionDays: {
        label: "Retention (days)",
        description: "Delete guest media older than this many days",
      },
      batchSize: {
        label: "Max deletions",
        description:
          "Upper limit of files deleted per run. The rest waits for the next run.",
      },
      dryRun: {
        label: "Dry run",
        description: "Count and log what would be deleted, delete nothing",
      },
    },
    response: {
      cutoff: "Cutoff",
      namespacesScanned: "Namespaces scanned",
      storedThreadNamespaces: "Saved threads skipped",
      filesScanned: "Files scanned",
      filesDeleted: "Files deleted",
      bytesDeleted: "Bytes deleted",
      skippedTooNew: "Kept: inside retention",
      skippedUserOwned: "Kept: account-owned",
      skippedUnowned: "Kept: no owner",
      skippedAccountLead: "Kept: lead linked to an account",
      deferred: "Deferred to next run",
      failed: "Failed",
      executionTimeMs: "Execution time (ms)",
    },
    success: {
      title: "Cleanup done",
      description: "Expired guest media removed",
    },
  },
  errors: {
    failed: "Guest media cleanup failed: {{error}}",
    server: {
      title: "Cleanup error",
      description: "Guest media cleanup failed",
    },
  },
  task: {
    name: "Guest Media Cleanup",
    description:
      "Daily removal of expired guest media from incognito chats and standalone tool runs",
  },
};
