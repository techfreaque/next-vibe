export const translations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Dependency analyzer for definition files. Maps import graphs at file and category level: who depends on what, unused exports, shared code candidates. Use --focus to drill into a module, --mode=categories for a high-level overview, --mode=unused to find dead code.",
  category: "Development Tools",
  tag: "analysis",

  mode: {
    files: "Files",
    categories: "Categories",
    unused: "Unused",
  },

  container: {
    title: "Dependency Analysis",
    description: "Configure the scope and mode of the dependency scan",
  },

  fields: {
    focus: {
      label: "Focus Path",
      description:
        "Narrow to a specific file or directory (e.g. 'agent/ai-stream' or 'user'). Leave empty to analyze the full codebase.",
      placeholder: "e.g., agent/ai-stream or user",
    },
    mode: {
      label: "Mode",
      description:
        "files: per-file import graph. categories: rolled up by top-level dir. unused: files with no importers.",
    },
    depth: {
      label: "Depth",
      description:
        "How many levels of transitive dependencies to include (default: 1, direct only). 0 = unlimited.",
    },
    limit: {
      label: "Limit",
      description: "Maximum number of entries to return (default: 100).",
    },
  },

  response: {
    success: "Dependency analysis complete",
    entries: {
      title: "Dependency Entries",
      emptyState: {
        description: "No files matched the given filter.",
      },
      importedBy: "imported by",
    },
    summary: {
      title: "Summary",
      totalFiles: "Total Files Scanned",
      totalEdges: "Total Import Edges",
      unusedCount: "Unused Exports",
    },
  },

  errors: {
    validation: {
      title: "Invalid Parameters",
      description: "The dependency analysis parameters are invalid",
    },
    internal: {
      title: "Internal Error",
      description: "An internal error occurred during dependency analysis",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to run dependency analysis",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to dependency analysis is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The specified focus path was not found",
    },
    server: {
      title: "Server Error",
      description: "Server error occurred during dependency analysis",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred during dependency analysis",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during dependency analysis",
    },
  },

  success: {
    title: "Analysis Complete",
    description: "Dependency analysis completed successfully",
  },
};
