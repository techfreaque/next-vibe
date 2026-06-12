export const translations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Auto-stage boilerplate files (route.ts, i18n/*/index.ts) that pass the boilerplate pattern check. Runs the boilerplate oxlint plugin on all unstaged candidates and git-adds only files with zero violations.",

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
    skipped: "Skipped (violations)",
    noChanges: "No stageable boilerplate files found in working tree",
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
    skipped: "Skipped",
    stagedCount: "files staged",
    skippedCount: "files skipped (violations)",
    noChanges: "No stageable boilerplate files found",
    noChangesHint:
      "Modified route.ts and i18n/*/index.ts files that pass the boilerplate pattern check will appear here",
    dryRunBadge: "Dry Run",
    dryRunNote: "Preview only — no files were staged",
    cleanFile: "clean",
    violationsFile: "violations",
    loading: "Scanning working tree...",
  },
};
