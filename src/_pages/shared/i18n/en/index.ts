export const translations = {
  error: {
    title: "Error",
    message: "An error occurred. Please try again.",
    general: {
      unknown_validation_error: "An unknown validation error occurred.",
    },
  },
  errorTypes: {
    auth_error: "Authentication error",
    bad_request: "Bad request",
    database_error: "Database error",
    email_error: "Email error",
    external_service_error: "External service error",
    forbidden: "Forbidden",
    http_error: "HTTP error",
    internal_error: "Internal error",
    invalid_credentials_error: "Invalid credentials",
    invalid_data_error: "Invalid data",
    invalid_format_error: "Invalid format",
    invalid_input_error: "Invalid input",
    invalid_method_error: "Invalid method",
    invalid_parameter_error: "Invalid parameter",
    invalid_path_error: "Invalid path",
    invalid_payload_error: "Invalid payload",
    invalid_query_error: "Invalid query",
    invalid_request_error: "Invalid request",
    invalid_response_error: "Invalid response",
    invalid_status_error: "Invalid status",
    invalid_token_error: "Invalid token",
    invalid_url_error: "Invalid URL",
    no_response_data: "No response data",
    not_found: "Not found",
    partial_failure: "Partial failure",
    payment_failed: "Payment failed",
    payment_required: "Payment required",
    permission_denied: "Permission denied",
    permission_error: "Permission error",
    sms_error: "SMS error",
    token_expired_error: "Token expired",
    two_factor_required: "Two-factor authentication required",
    unauthorized: "Unauthorized",
    unknown_error: "Unknown error",
    validation_error: "Validation error",
  },
  stats: {
    chartType: {
      area: "Area",
      bar: "Bar",
      donut: "Donut",
      line: "Line",
      pie: "Pie",
    },
    dateRange: {
      custom: "Custom",
      last30Days: "Last 30 days",
      last7Days: "Last 7 days",
      last90Days: "Last 90 days",
      lastMonth: "Last month",
      lastQuarter: "Last quarter",
      lastWeek: "Last week",
      lastYear: "Last year",
      thisMonth: "This month",
      thisQuarter: "This quarter",
      thisWeek: "This week",
      thisYear: "This year",
      today: "Today",
      yesterday: "Yesterday",
    },
    timePeriod: {
      day: "Day",
      month: "Month",
      quarter: "Quarter",
      week: "Week",
      year: "Year",
    },
  },
  errors: {
    invalid_request_data: "Invalid request data",
    serverError: {
      description: "A server error occurred. Please try again.",
    },
    validationFailed: {
      description: "Validation failed. Please check your input.",
    },
  },
  cli: {
    vibe: {
      errors: {
        routeNotFound: "Route not found for tool: {{toolName}}",
        executionFailed: "Execution failed",
        // Bare label - the CLI error formatter renders it param-free as its
        // last-resort fallback, so the cause gets its own key.
        unknownError: "An unknown error occurred",
        unknownErrorDetail: "An unknown error occurred: {{error}}",
      },
    },
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Endpoint definition error",
        platformAccessDenied: "Access denied on {{platform}}: {{reason}}",
        insufficientRoles:
          "User {{userId}} lacks required roles: {{requiredRoles}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint not found",
            loadFailed: "Failed to load endpoint",
            batchLoadFailed: "Failed to load endpoints",
          },
        },
      },
    },
  },
  utils: {
    parseJsonWithComments: {
      errors: {
        invalid_json: "Invalid JSON",
      },
    },
    time: {
      errors: {
        invalid_time_format: {
          title: "Invalid time format",
        },
        invalid_time_range: {
          title: "Invalid time range",
        },
      },
    },
  },
};
