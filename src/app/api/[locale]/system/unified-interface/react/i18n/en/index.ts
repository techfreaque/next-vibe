import { translations as hooksTranslations } from "../../hooks/i18n/en";

export const translations = {
  hooks: hooksTranslations,
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
    filterPills: {
      requiresContext:
        "Filter pills widget requires form context and field name",
    },
    toolCall: {
      status: {
        error: "Error",
        executing: "Executing...",
        complete: "Complete",
        sentToBackground: "Sent to background",
        wakeUpBackground: "Background task — AI will wake up with result",
        waitingForRemote: "Waiting for remote...",
        deferred: "Async result",
        confirmed: "Confirmed by you",
        confirmedWakeUp: "Confirmed — running in background",
        waitingForConfirmation: "Waiting for confirmation",
        waitingForConfirmationWakeUp: "Confirm to run in background",
        pendingConfirmation: "Pending Confirmation",
        pendingCancellation: "Pending Cancellation",
        denied: "Denied",
        deniedWakeUp: "Denied — won't run in background",
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
          "Review and edit parameters, then confirm to run in background — result will wake up AI.",
      },
      actions: {
        confirm: "Confirm",
        cancel: "Cancel",
        deny: "Deny",
      },
    },
    codeQualityList: {
      noData: "No code quality issues found",
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
