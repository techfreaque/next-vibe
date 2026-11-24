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
      description: "Preview the scheduled cleanup",
    },
    fields: {
      batchSize: {
        label: "Max deletions",
        description:
          "Upper limit of files deleted per run. The rest waits for the next run.",
      },
      dryRun: {
        label: "Dry run",
        description: "Count all eligible files and bytes without deleting them",
      },
    },
    response: {
      cutoff: "Cutoff",
      namespacesScanned: "Namespaces scanned",
      storedThreadNamespaces: "Saved threads skipped",
      filesScanned: "Files scanned",
      eligibleFiles: "Eligible files",
      eligibleBytes: "Eligible bytes",
      filesDeleted: "Files deleted",
      bytesDeleted: "Bytes deleted",
      skippedTooNew: "Kept: inside retention",
      skippedUserOwned: "Kept: account-owned",
      skippedUnowned: "Kept: no owner",
      skippedAccountLead: "Kept: lead linked to an account",
      deferred: "Deferred to next run",
      failed: "Failed",
      rowsDeleted: "Studio rows deleted",
      scanComplete: "Scan complete",
      executionTimeMs: "Execution time (ms)",
    },
    success: {
      title: "Cleanup done",
      description: "Guest media scan finished",
    },
  },
  errors: {
    scheduledOnly: "Only the production guest media cron can delete files.",
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
