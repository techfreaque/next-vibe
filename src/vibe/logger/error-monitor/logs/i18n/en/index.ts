import { translations as analyticsTranslations } from "next-vibe/unified-ui/analytics/i18n/en";

export const translations = {
  ...analyticsTranslations,
  category: "System",

  errors: {
    repositoryInternalError: "An internal error occurred",
    fetchErrorLogs: "Failed to fetch error logs: {{error}}",
    updateErrorLog: "Failed to update error log status: {{error}}",
    missingTarget: "Pass fingerprint or id.",
    idNotUnique:
      "Id prefix {{id}} matches {{count}} rows. Use the fingerprint or the full id.",
  },

  statusFilter: {
    all: "All",
    active: "Unresolved",
    resolved: "Resolved",
  },
  levelFilter: {
    all: "All levels",
    error: "Errors",
    warn: "Warnings",
  },
  sourceFilter: {
    all: "All sources",
    client: "Browser",
    server: "Server",
  },
  trendSplit: {
    newVsRecurring: "New vs recurring",
    level: "Level",
    source: "Source",
  },
  sort: {
    windowOccurrences: "Most hits in period",
    lastSeen: "Last seen",
    firstSeen: "Newest",
    totalOccurrences: "Most hits all time",
  },

  get: {
    title: "Error Logs",
    titleShort: "Error Logs",
    description:
      "Error classes with exact unresolved counts, occurrences over time, top offenders and affected users. Filter by period, status, level, source, endpoint or text; resolve in one click.",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      group: {
        label: "Group similar",
        description:
          "One row per message: variants on different routes count together",
      },
      status: {
        label: "Status",
        description: "Filter by resolved status",
      },
      search: {
        label: "Search errors",
        description: "Search messages, fingerprints, or log IDs",
        placeholder: "Search messages, fingerprints, or log IDs",
      },
      errorType: {
        label: "Error Type",
        description: "Filter by error type classification",
        placeholder: "e.g. INTERNAL_ERROR",
      },
      level: {
        label: "Level",
        description: "Errors or warnings",
      },
      source: {
        label: "Source",
        description: "Raised in the browser (client log) or on the server",
      },
      endpoint: {
        label: "Endpoint or route",
        description: "Endpoint path, alias or page route contains this text",
        placeholder: "e.g. payment/providers",
      },
      fingerprint: {
        label: "Fingerprint",
        description: "Show one error class only",
        placeholder: "Fingerprint",
      },
      split: {
        label: "Chart split",
        description: "How the occurrences chart stacks",
      },
      sort: {
        label: "Sort",
        description: "List order",
      },
      limit: {
        label: "Limit",
        description: "Number of results to return",
        placeholder: "50",
      },
      offset: {
        label: "Offset",
        description: "Number of results to skip",
        placeholder: "0",
      },
    },
    response: {
      logs: {
        title: "Error Log Entries",
      },
      totalCount: {
        title: "Total Count",
      },
      hasMore: {
        title: "Has More",
      },
      unresolvedCount: {
        title: "Unresolved Count",
      },
      window: {
        title: "Period",
      },
      kpis: {
        title: "Key numbers",
      },
      trend: {
        title: "Occurrences over time",
      },
      byEndpoint: {
        title: "By endpoint",
      },
      historySince: {
        title: "History since",
      },
    },
    success: {
      title: "Logs Retrieved",
      description: "Error logs fetched successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "No logs found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve error logs",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        titleChanges: "Unsaved Changes",
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
  },

  patch: {
    title: "Update Error Log",
    titleShort: "Update Log",
    description: "Resolve or reopen an error log by fingerprint",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      similarTo: {
        label: "Same message as",
        description:
          "Resolve or reopen every class with the same message as this fingerprint",
      },
      fingerprints: {
        label: "Fingerprints",
        description:
          "Several fingerprints at once (bulk resolve or reopen, max 200)",
      },
      fingerprint: {
        label: "Fingerprint",
        description:
          "The fingerprint of the error log (column `fingerprint` in the list). Pass this or id.",
        placeholder: "Enter fingerprint",
      },
      id: {
        label: "Log ID",
        description:
          "The row id from the list (full uuid or its first 8+ characters). Use instead of fingerprint.",
        placeholder: "e.g. c21bd4c7",
      },
      resolved: {
        label: "Resolved",
        description: "Set to true to resolve, false to reopen",
      },
    },
    response: {
      fingerprint: {
        title: "Fingerprint",
      },
      resolved: {
        title: "Resolved",
      },
      affectedRows: {
        title: "Affected Rows",
      },
    },
    success: {
      title: "Log Updated",
      description: "Error log status updated successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "Error log not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to update error log",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        titleChanges: "Unsaved Changes",
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
  },

  post: {
    title: "Run Error Monitor Scan",
    description: "Scan chat messages and backend logs for error patterns",
    tags: {
      monitoring: "Monitoring",
    },
    response: {
      errorsFound: "Errors Found",
      threadsScanned: "Threads Scanned",
      scanWindowFrom: "Scan Window From",
      scanWindowTo: "Scan Window To",
      patterns: "Error Patterns",
    },
    success: {
      title: "Scan Complete",
      description: "Error monitor scan completed successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to run error monitor scan",
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
        description: "Data conflict occurred",
      },
    },
  },

  errorMonitor: {
    name: "Error Monitor",
    description: "Scans for error patterns every 3 hours",
  },

  widget: {
    subtitle:
      "Every error and warning grouped by class. Resolve what is fixed; a recurrence reopens it.",
    kpi: {
      unresolvedInScope: "Unresolved in this view",
      unresolvedAllTimeLink:
        "All unresolved classes, errors and warnings, all time: {{count}}",
      unresolvedMessages: "{{messages}} messages · {{occurrences}} occurrences",
      unresolvedMatching: "{{count}} unresolved match filters",
      unresolved: "Unresolved classes (all time)",
      unresolvedHint: "{{occurrences}} hits, all time",
      unresolvedOutside: "{{count}} not seen in this period",
      occurrences: "Occurrences",
      newClasses: "New classes",
      activeClasses: "Classes hit",
      affectedUsers: "Users hit",
      affectedLeads: "Visitors hit",
    },
    chart: {
      noEndpoint: "No endpoint recorded",
      emptyFiltered: "No occurrences match these filters in this period.",
      trendTitle: "Occurrences",
      trendSubtitle: "Click a bar to narrow the period",
      endpointTitle: "Where it breaks",
      endpointSubtitle:
        "Endpoints and routes by occurrences. Click a row to filter.",
      endpoint: "Endpoint / route",
      occurrences: "Occurrences",
      classes: "Classes",
      unresolved: "Open",
      historyNote:
        "Daily history starts {{date}}. Earlier hits only count in the all-time totals.",
      historyNone:
        "No daily history recorded yet. Totals per class are still exact.",
    },
    series: {
      new: "New",
      recurring: "Recurring",
      error: "Errors",
      warn: "Warnings",
      client: "Browser",
      server: "Server",
    },
    list: {
      viewGroup: "View {{count}}",
      noSession: "No session context",
      cliAct:
        "act: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliStatus: "Status: {{status}}",
      groupSize: "{{count}} classes",
      resolveGroup: "Resolve all {{count}}",
      reopenGroup: "Reopen all {{count}}",
      groupHint: "Grouped by message",
      subtitleGrouped: "{{count}} messages seen in this period",
      bulkResolveOf: "Resolve {{shown}} of {{total}} matching",
      cliGroup:
        'Group of {{count}} classes. List: vibe error-logs --group=false --search="{{search}}" · Act on all: vibe update-error-log --similarTo={{fingerprint}} --resolved=true',
      allClear: "Nothing open matches these filters.",
      allClearHint: "Clear filters to see the rest.",
      similar: "+{{count}} similar",
      cliFilters:
        "Filters (values are the enum keys shown): --range=analytics.range.last7Days --status=statusFilter.all --level=levelFilter.error --source=sourceFilter.server --endpoint=<text> --search=<text>. Bulk: vibe update-error-log --fingerprints=<a>,<b> --resolved=true",
      more: "+{{count}} more",
      doneResolved: "Resolved: {{label}}",
      doneReopened: "Reopened: {{label}}",
      doneResolvedMany: "Resolved {{count}} classes",
      doneReopenedMany: "Reopened {{count}} classes",
      undo: "Undo",
      dismiss: "Dismiss",
      bulkResolve: "Resolve all {{count}} shown",
      bulkConfirm: "Confirm: resolve {{count}}",
      cliHits: "{{period}} in period / {{total}} total",
      resolveFailed: "Not saved. Try again.",
      cliResolve:
        "Act: vibe update-error-log --fingerprint={{fingerprint}} --resolved={{resolved}}",
      cliHint:
        "Resolve: vibe update-error-log --fingerprint=<fingerprint> --resolved=true. Detail: --fingerprint=<fingerprint>. Next page: --offset={{next}}",
      title: "Error classes",
      subtitle: "{{count}} seen in this period",
      hitsPeriod: "{{count}} in period",
      hitsTotal: "{{count}} total",
      users: "Users {{count}}",
      leads: "Visitors {{count}}",
      firstSeen: "first {{date}}",
      lastSeen: "last {{date}}",
      open: "Details",
      close: "Hide",
      focus: "Only this",
      affected: "Affected users",
      affectedLeads: "Affected visitors",
      resolving: "Saving...",
    },
    filter: {
      apply: "Apply filters",
      more: "Filters",
      moreCount: "Filters ({{count}})",
      moreDescription: "Filter by status, severity or origin.",
      fingerprint: "Class",
      endpoint: "Endpoint",
      search: "Search",
      errorType: "Type",
      status: "Status",
      level: "Level",
      source: "Source",
    },
    emptyFiltered:
      "No groups match these filters. Clear a filter and try again.",
    emptyActive:
      "There are no active error groups. Select All to review resolved errors.",
    severity: {
      error: "Error",
      warning: "Warning",
    },
    title: "Error Logs",
    loading: "Loading logs...",
    empty: "No error logs found",
    header: {
      refresh: "Refresh",
      runScan: "Run Scan",
      back: "Back",
      activeCount: "{{count}} open overall",
    },
    col: {
      message: "Message",
      errorType: "Error Type",
      occurrences: "Occurrences",
      firstSeen: "First Seen",
      createdAt: "Last Seen",
    },
    status: {
      active: "Unresolved",
      resolved: "Resolved",
    },
    action: {
      confirm: "Save status",
      clear: "Clear filters",
      resolve: "Resolve",
      reopen: "Reopen",
    },
    detail: {
      context: "Error context",
      stackTrace: "Stack Trace",
      metadata: "Metadata",
      collapse: "Collapse",
      resolved: "Resolved",
    },
    source: {
      client: "Browser",
      server: "Server",
    },
    pagination: {
      matches: "{{count}} matching groups",
      info: "Page {{page}} of {{totalPages}} ({{total}} total)",
      prev: "Previous",
      next: "Next",
    },
  },
};
