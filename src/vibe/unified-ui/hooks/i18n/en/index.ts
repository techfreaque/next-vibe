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
      showResults: "Show results",
      saveChanges: "Save changes",
      saving: "Saving...",
      result: "Result",
      fixFields: "Check the highlighted fields and try again.",
      hiddenInvalid:
        "“{{field}}” is missing or invalid. Reload the page and try again.",
    },
    toolUnavailable: {
      permissionTitle: "You do not have access to this tool",
      permissionMessage:
        "Your role cannot open it. Ask an owner of this workspace for access.",
      instanceTitle: "This tool is not on this instance",
      instanceMessage:
        "It runs on another connected instance. Switch the instance in the sidebar to open it.",
      setupTitle: "This tool needs setup first",
      setupMessage:
        "A required setting is missing. Finish the setup, then open the tool again.",
      unknownTitle: "This link does not lead to a tool",
      unknownMessage: "The link may be out of date or mistyped.",
    },
    recordState: {
      loading: "Loading",
      notFoundMessage: "It may have been deleted, or the link is out of date.",
      loadFailed: "Could not load {{title}}",
      serverError: "Something went wrong on our side. Try again in a moment.",
      technicalDetails: "Technical details",
      moreActions: "More actions",
      more: "More",
      confirmCancel: "Cancel",
      details: "Details",
      emptyTitle: "Nothing here yet",
      copy: "Copy",
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
        openCalendar: "Open calendar",
        time: "Time",
        startDate: "Start date",
        endDate: "End date",
        decreaseValue: "Decrease value",
        increaseValue: "Increase value",
        unknownFieldType: "Unknown field type",
      },
      entityPicker: {
        change: "Change",
        loading: "Loading...",
        noItems: "No items found",
        required: "Required",
        select: "Select...",
        selectLabel: "Select {{label}}",
        useToFind: "Find it with {{alias}}",
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
  formErrors: {
    required: "Enter a value",
    invalid: "This value is not valid",
    minLength: "Use at least {{min}} characters",
    maxLength: "Use at most {{max}} characters",
    minNumber: "Enter {{min}} or more",
    maxNumber: "Enter {{max}} or less",
    minItems: "Add at least {{min}}",
    email: "Enter a valid email address",
    url: "Enter a full link, like https://example.com",
    choose: "Choose one of the options",
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
      recordTimeout: "This record took too long to load. Try again.",
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
