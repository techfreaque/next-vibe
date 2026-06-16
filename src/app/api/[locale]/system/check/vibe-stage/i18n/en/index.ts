export const translations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Auto-stage boilerplate files (route.ts, i18n/*/index.ts) that pass pattern checks. Also stages import-only changes in any file, or partially stages only the import hunks from mixed-change files.",

  fields: {
    dryRun: {
      label: "Dry Run",
      description:
        "Preview which files would be staged without actually running git add",
    },
    paths: {
      label: "Limit to paths",
      description:
        "Only consider candidates under these paths. Leave empty to scan all unstaged changes.",
      placeholder: "e.g. src/app/api",
    },
  },

  response: {
    staged: "Staged",
    partiallyStaged: "Partially staged (imports only)",
    skipped: "Skipped (violations)",
    noChanges: "No stageable files found in working tree",
    dryRunNote: "Dry run - no files were actually staged",
  },

  errors: {
    validation: {
      title: "Invalid Parameters",
      description: "The vibe stage parameters are invalid",
    },
    internal: {
      title: "Internal Error",
      description: "An error occurred while running vibe stage",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in to run vibe stage",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to vibe stage is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "No git repository found",
    },
    server: {
      title: "Server Error",
      description: "A server error occurred during vibe stage",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during vibe stage",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "Unsaved changes detected",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during vibe stage",
    },
  },

  success: {
    title: "Stage Complete",
    description: "Boilerplate files staged successfully",
  },

  widget: {
    title: "Vibe Stage",
    subtitle: "Auto-stage boilerplate files that pass pattern checks",
    submit: "Run Stage",
    dryRun: "Dry Run",
    staged: "Staged",
    partiallyStaged: "Partially staged",
    skipped: "Skipped",
    stagedCount: "files staged",
    partiallyStaged_count: "files partially staged (imports only)",
    skippedCount: "files skipped (violations)",
    noChanges: "No stageable files found",
    noChangesHint:
      "Boilerplate files, import-only changes, or files with import hunks will appear here",
    dryRunBadge: "Dry Run",
    dryRunNote: "Preview only — no files were staged",
    cleanFile: "clean",
    partialFile: "imports only",
    violationsFile: "violations",
    loading: "Scanning working tree...",
  },
};
