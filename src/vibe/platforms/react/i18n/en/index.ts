export const translations = {
  hooks: {
    localstorage: {
      noCallback: "No callback provided for localStorage operation",
    },
    apiUtils: {
      errors: {
        http_error: "HTTP Error",
        validation_error: "Validation Error",
        internal_error: "Internal Error",
        auth_required: "Authentication Required",
      },
    },
    mutationForm: {
      post: {
        errors: {
          mutation_failed: {
            title: "Mutation Failed",
          },
          validation_error: {
            title: "Validation Error",
          },
        },
      },
    },
    queryForm: {
      errors: {
        network_failure: "Network failure",
        validation_failed: "Validation failed",
      },
    },
    store: {
      errors: {
        validation_failed: "Validation failed",
        request_failed: "Request failed",
        mutation_failed: "Mutation failed",
        unexpected_failure: "Unexpected failure",
        refetch_failed: "Refetch failed",
      },
      status: {
        loading_data: "Loading data...",
        cached_data: "Using cached data",
        success: "Success",
        mutation_pending: "Mutation pending...",
        mutation_success: "Mutation successful",
      },
    },
  },
  widgets: {
    endpointRenderer: {
      submit: "Submit",
      submitting: "Submitting...",
      cancel: "Cancel",
    },
    container: {
      noContent: "No content",
    },
    dataTable: {
      showingResults: "Showing {{count}} of {{total}} results",
      noData: "No data available",
    },
    dataList: {
      noData: "No data available",
      showMore: "Show {{count}} more",
      showLess: "Show less",
      viewList: "List View",
      viewGrid: "Grid View",
    },
    groupedList: {
      showMore: "Show {{count}} more",
    },
    linkList: {
      noResults: "No results found",
    },
    link: {
      invalidData: "Invalid link data",
    },
    markdown: {
      noContent: "No content",
    },
    errorBoundary: {
      title: "Widget Error",
      errorDetails: "Error Details",
      defaultMessage: "An error occurred while rendering this widget",
    },
    formField: {
      requiresContext:
        "Form field requires form context and field configuration",
    },
    formFields: {
      common: {
        required: "Required",
        enterPhoneNumber: "Enter phone number",
        selectDate: "Select date",
        unknownFieldType: "Unknown field type",
      },
      entityPicker: {
        select: "Select",
        change: "Change",
        required: "Required",
        loading: "Loading...",
        noItems: "No items found",
        useToFind: "Use {{alias}} to find items",
      },
      markdownTextarea: {
        edit: "Edit",
        preview: "Preview",
        toolbar: {
          bold: "Bold",
          italic: "Italic",
          strike: "Strikethrough",
          code: "Code",
          link: "Link",
          linkPrompt: "Enter URL",
          heading1: "Heading 1",
          heading2: "Heading 2",
          heading3: "Heading 3",
          bulletList: "Bullet list",
          orderedList: "Numbered list",
          blockquote: "Quote",
          horizontalRule: "Horizontal rule",
        },
      },
    },
    codeQualityFiles: {
      affectedFiles: "Affected files",
      andMoreFiles: "… and {{count}} more files",
    },
    codeQualitySummary: {
      summary: "Summary",
      files: "Files",
      issues: "Issues",
      errors: "Errors",
      of: "of",
    },
    rangeSlider: {
      min: "Min",
      max: "Max",
    },
    error: {
      title: "Error",
    },
    filterPills: {
      requiresContext:
        "Filter pills widget requires form context and field name",
    },
    toolCall: {
      status: {
        error: "Error",
        executing: "Executing...",
        complete: "Complete",
        waitingForTask: "Waiting for task...",
        completeWaitForTask: "Complete (waited)",
        sentToBackground: "Sent to background",
        wakeUpBackground: "Background task - AI will wake up with result",
        waitingForRemote: "Waiting for remote...",
        deferred: "Async result",
        confirmed: "Confirmed by you",
        confirmedWakeUp: "Confirmed - running in background",
        waitingForConfirmation: "Waiting for confirmation",
        waitingForConfirmationWakeUp: "Confirm to run in background",
        pendingConfirmation: "Pending Confirmation",
        pendingCancellation: "Pending Cancellation",
        denied: "Denied",
        deniedWakeUp: "Denied - won't run in background",
        notRun: "Not run",
      },
      sections: {
        request: "Request",
        response: "Response",
      },
      messages: {
        executingTool: "Executing tool...",
        deferredResult:
          "This result arrived asynchronously after the original stream ended.",
        taskId: "Task ID:",
        errorLabel: "Error:",
        noArguments: "No arguments",
        noResult: "No result",
        metadataNotAvailable:
          "Widget metadata not available. Showing raw result.",
        confirmationRequired:
          "Review and edit parameters, then confirm to execute.",
        confirmationRequiredWakeUp:
          "Review and edit parameters, then confirm to run in background - result will wake up AI.",
      },
      actions: {
        confirm: "Confirm",
        cancel: "Cancel",
        deny: "Deny",
        runInBackground: "Run in background",
        resumeWhenDone: "Resume when done",
      },
      creditsUsed_one: "{{cost}} credit",
      creditsUsed_other: "{{cost}} credits",
    },
    codeQualityList: {
      noData: "No code quality issues found",
      noIssues: "No issues found",
      rule: "Rule: {{rule}}",
    },
    section: {
      noData: "No section data available",
    },
    title: {
      noData: "No title data available",
    },
    chart: {
      noDataAvailable: "No data available",
      noDataToDisplay: "No data to display",
      total: "Total",
    },
    creditTransactionList: {
      invalidConfig: "Invalid credit transaction list configuration",
      noTransactions: "No transactions found",
    },
    pagination: {
      showing: "Showing {{start}}-{{end}} of {{total}} items",
      itemsPerPage: "Items per page",
      page: "Page {{current}} of {{total}}",
    },
  },
};
