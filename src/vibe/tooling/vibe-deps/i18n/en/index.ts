export const translations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "All-in-one dependency analyzer. Maps the import graph across the whole codebase and enforces package boundaries. --mode=files / categories / unused for the import graph and dead code. --mode=boundaries shows every import a package makes into app code (the moves to fix before extraction). --mode=layers flags illegal cross-package direction. --mode=shared-candidates ranks app primitives the packages already depend on. --mode=importers --focus=X breaks one file's importers down by package.",
  category: "Development Tools",
  tag: "analysis",

  mode: {
    report: "Report",
    files: "Files",
    categories: "Categories",
    unused: "Unused",
    boundaries: "Boundaries",
    layers: "Layers",
    sharedCandidates: "Shared Candidates",
    importers: "Importers",
    needsMove: "Needs Move",
    unusedSymbols: "Unused Symbols",
    crossDomain: "Cross-Domain",
    pageViolations: "Page Violations",
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
        "files: per-file import graph. categories: rolled up by top-level dir. unused: files with no importers. boundaries: package imports into app code. layers: illegal cross-package direction. shared-candidates: app primitives the packages depend on. importers: one file's importers by package (needs --focus).",
    },
    package: {
      label: "Package",
      description:
        "Narrow boundaries/layers to a single declared package (e.g. vibe-ui, vibe-unified-ui). Leave empty for all packages.",
      placeholder: "e.g., vibe-unified-ui",
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
    boundaries: {
      title: "Package Boundaries",
      cleanState: "No boundary violations. Packages are self-contained.",
      legendTitle: "Legend",
      legendOut: "out-of-package (package reaches into app code)",
      legendCross: "cross-package (illegal dependency)",
      legendReverse: "reverse-direction (lower layer imports higher)",
      legendHot: "hot target (10+ importers — strongest pull into core)",
      colTarget: "target",
      colCount: "uses",
      colKind: "kind",
      packageHeader: "package",
      violationsAcross: "violations across",
      packagesWord: "packages",
    },
    layers: {
      title: "Layer Direction",
      cleanState: "Direction is clean. No illegal cross-package imports.",
      edge: "imports",
    },
    sharedCandidates: {
      title: "Shared Candidates",
      description:
        "App-code files imported by packages, ranked by package-importer count. High = pull into vibe-core.",
      colCount: "pkg uses",
      colPath: "path",
      emptyState: "No app files are imported by package code.",
    },
    importers: {
      title: "Importers by Package",
      colCount: "uses",
      colGroup: "package / category",
    },
    needsMove: {
      title: "Move List",
      description:
        "Files not yet in their final position, grouped by destination area. Whitelisted files (already placed) are silent. Read top to bottom — that's the move order.",
      colTarget: "→ area",
      colPath: "file",
      emptyState: "Everything in scope is placed. Nothing to move.",
      relocate: "relocate",
      reorganize: "reorg",
    },
    unusedSymbols: {
      title: "Unused Public Surface",
      description:
        "Dead exports, unused static methods, and files with no importers. Regex-based signals to review — conservative (may miss dynamic uses).",
      colKind: "kind",
      colSymbol: "symbol",
      colPath: "file",
      emptyState: "No unused public surface found in scope.",
      wholeFile: "(whole file — no importers)",
    },
    pageViolations: {
      title: "Page Architecture Violations",
      description:
        "page.tsx files importing more than repository/definition/i18n/page-client. Pages must be thin SSR shells — business logic, UI, enums, and db access belong in repository.ts or page-client.tsx.",
      colCount: "violations",
      colPath: "page",
      emptyState: "All page.tsx files respect the architecture boundary.",
    },
    crossDomain: {
      title: "Cross-Domain Candidates",
      description:
        "Imports that cross a domain boundary and are NOT an allowed framework primitive. Each is a candidate to promote into vibe (engine/core) or decouple. Most-reached first. Allowed primitive edges are tallied separately, not hidden.",
      colCount: "uses",
      colTarget: "reached-for target",
      emptyState:
        "No unreviewed cross-domain edges. Everything crossing is allowed.",
      allowedTally: "allowed primitive edges (not listed)",
    },
    violations: {
      title: "Violations",
      outOfPackage: "Out of Package",
      crossPackage: "Cross Package",
      reverseDirection: "Reverse Direction",
      total: "Total",
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
