export const translations = {
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
    // Detailed variants. The bare labels above and every `errorTypes.*` entry
    // double as generic, param-free banner text, so the cause gets its own key
    // rather than a placeholder bolted onto a shared label.
    invalidLocaleDetail: 'Invalid locale "{{locale}}"',
    invalidRequestDataDetail: "Invalid request data: {{error}}",
    invalidResponseDetail: "Invalid response data: {{error}}",
    invalidErrorResponseDetail: "Malformed error response: {{error}}",
    csrfFailedDetail: "Request blocked by CSRF protection: {{reason}}",
    csrfReasonUnknown: "CSRF token validation failed",
    internalDetail: "Internal error: {{error}}",
    authenticationFailed: "User authentication failed",
  },
  validation: {
    missingFields: "Missing required fields ({{count}}):",
    failedOne: "Validation failed (1 error):",
    failedMany: "Validation failed ({{count}} errors):",
    cliHints:
      "\n\nExample:\n  {{example}}\n\nOr run interactively:\n  {{interactive}}\n\nMore info:\n  {{help}}",
    /**
     * Assembly shell, deliberately word-free so it is identical in every
     * language: `fail()` takes a single already-translated message, so the
     * header/bullet/hint parts have to meet inside one final `t()` call.
     */
    report: "{{header}}{{fields}}{{hints}}",
    unexpected: "Validation failed unexpectedly: {{error}}",
  },
  shared: {
    permissions: {
      errors: {
        definitionError: "Endpoint definition error: {{reason}}",
        allowedRolesMissing:
          "Endpoint definition error: allowedRoles is missing or is not a list",
        /**
         * One key per denial cause from checkPlatformAccess. The cause code
         * selects the key; `platform` is the only parameter, and it is a raw
         * runtime value.
         */
        platformAccessDenied: {
          productionDisabled:
            "Access denied on {{platform}}: this endpoint is disabled in production",
          platformExcluded:
            "Access denied on {{platform}}: this endpoint is not exposed on this platform",
          cliPackageAuthRequired:
            "Access denied on {{platform}}: this endpoint needs authentication, which the CLI package cannot provide",
          mcpNotListed:
            "Access denied on {{platform}}: this endpoint is not listed on MCP",
        },
        /**
         * Four variants instead of one key with `{{userId}}`/`{{userRoles}}`
         * placeholders filled by translated nouns: "public" and "none" are
         * words, not values, so they belong inside the sentence.
         */
        insufficientRoles:
          "User {{userId}} lacks required roles: {{requiredRoles}} (has: {{userRoles}})",
        insufficientRolesNoRoles:
          "User {{userId}} lacks required roles: {{requiredRoles}} (has: none)",
        insufficientRolesPublic:
          "User public lacks required roles: {{requiredRoles}} (has: {{userRoles}})",
        insufficientRolesPublicNoRoles:
          "User public lacks required roles: {{requiredRoles}} (has: none)",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint not found: {{identifier}}",
            loadFailed: "Failed to load endpoint {{identifier}}: {{error}}",
            batchLoadFailed:
              "Failed to load {{failedCount}} of {{totalCount}} endpoints",
            batchLoadError:
              "Failed to load {{failedCount}} of {{totalCount}} endpoints: {{error}}",
          },
        },
      },
    },
  },
};
