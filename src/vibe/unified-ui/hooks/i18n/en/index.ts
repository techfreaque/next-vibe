export const translations = {
  widgets: {
    errorBoundary: {
      title: "Something went wrong",
      defaultMessage: "An unexpected error occurred",
      errorDetails: "Error details",
    },
    error: {
      title: "Error",
    },
    chart: {
      noDataAvailable: "No data available",
      noDataToDisplay: "No data to display",
    },
    codeQualityFiles: {
      affectedFiles: "Affected files",
      andMoreFiles: "... and {{count}} more file(s)",
    },
    codeQualityList: {
      noIssues: "No issues found",
    },
    codeQualitySummary: {
      errors: "Errors",
      files: "Files",
      issues: "Issues",
      of: "of",
      summary: "Summary",
    },
    container: {
      noContent: "No content",
    },
    endpointRenderer: {
      cancel: "Cancel",
      submit: "Submit",
      submitting: "Submitting...",
    },
    formField: {
      requiresContext: "This field requires context",
    },
    markdown: {
      noContent: "No content",
    },
    pagination: {
      itemsPerPage: "Items per page",
      page: "Page",
      showing: "Showing",
    },
    rangeSlider: {
      max: "Max",
      min: "Min",
    },
    toolCall: {
      creditsUsed_one: "{{count}} credit used",
      creditsUsed_other: "{{count}} credits used",
      actions: {
        confirm: "Confirm",
        deny: "Deny",
        runInBackground: "Run in background",
        resumeWhenDone: "Resume when done",
      },
      status: {
        complete: "Complete",
        confirmed: "Confirmed",
        confirmedWakeUp: "Confirmed (wake up)",
        deferred: "Deferred",
        denied: "Denied",
        deniedWakeUp: "Denied (wake up)",
        error: "Error",
        executing: "Executing",
        pendingCancellation: "Pending cancellation",
        pendingConfirmation: "Pending confirmation",
        sentToBackground: "Sent to background",
        waitingForConfirmation: "Waiting for confirmation",
        waitingForConfirmationWakeUp: "Waiting for confirmation (wake up)",
        waitingForRemote: "Waiting for remote",
        wakeUpBackground: "Wake up (background)",
      },
      messages: {
        confirmationRequired: "Confirmation required",
        confirmationRequiredWakeUp: "Confirmation required (wake up)",
        deferredResult: "Deferred result",
        errorLabel: "Error",
        executingTool: "Executing tool...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Enter phone number",
        required: "Required",
        selectDate: "Select date",
        unknownFieldType: "Unknown field type",
      },
      entityPicker: {
        change: "Change",
        loading: "Loading...",
        noItems: "No items found",
        required: "Required",
        select: "Select...",
        useToFind: "Use to find",
      },
      markdownTextarea: {
        edit: "Edit",
        preview: "Preview",
        toolbar: {
          blockquote: "Blockquote",
          bold: "Bold",
          bulletList: "Bullet list",
          code: "Code",
          heading1: "Heading 1",
          heading2: "Heading 2",
          heading3: "Heading 3",
          horizontalRule: "Horizontal rule",
          italic: "Italic",
          link: "Link",
          linkPrompt: "Enter URL",
          orderedList: "Ordered list",
          strike: "Strikethrough",
        },
      },
    },
  },
  localstorage: {
    noCallback: "No callback provided for localStorage operation",
  },
  apiUtils: {
    errors: {
      // Bare labels - kept placeholder-free for generic rendering.
      http_error: "HTTP Error",
      validation_error: "Validation Error",
      internal_error: "Internal Error",
      auth_required: "Authentication Required",
      missingUrlParam: 'Missing URL parameter "{{param}}" for {{path}}',
      httpStatus: "Request to {{url}} failed with status {{status}}",
      responseValidation: "Server response failed validation: {{error}}",
      malformedResponse: "Malformed response from {{url}}",
      requestFailed: "Request to {{path}} failed: {{error}}",
      /**
       * `reason` is the endpoint's own declared error-type description, already
       * translated in its scope - this frame only adds the where and the cause.
       */
      endpointFailed: "{{reason}} — {{path}}: {{error}}",
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
          detail: "Form validation failed: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Network failure in form {{formId}}: {{error}}",
      validation_failed: "Validation failed",
      validationFailedDetail: "Validation failed in form {{formId}}: {{error}}",
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
};
