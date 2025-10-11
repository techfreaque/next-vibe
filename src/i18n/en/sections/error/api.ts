export const apiTranslations = {
  store: {
    errors: {
      validation_failed: "Validation failed for store operation",
      request_failed: "Store request failed: {{error}}",
      mutation_failed: "Store mutation failed: {{error}}",
      unexpected_failure: "Unexpected store failure: {{error}}",
      refetch_failed: "Failed to refresh store data: {{error}}",
    },
    status: {
      loading_data: "Loading data...",
      cached_data: "Showing cached data",
      success: "Ready",
      disabled: "Query disabled",
      mutation_pending: "Saving...",
      mutation_success: "Saved successfully",
    },
  },
  query: {
    errors: {
      refetch_failed: "Failed to refresh query data: {{error}}",
    },
  },
  mutation: {
    errors: {
      execution_failed: "Failed to execute mutation: {{error}}",
    },
  },
  form: {
    errors: {
      validation_failed: "Form validation failed: {{message}}",
      network_failure: "Network error while submitting form: {{error}}",
    },
  },
  errors: {
    too_many_requests: "Too many requests. Please try again later.",
    invalid_request_data: "Invalid request data: {{message}}",
    internal_server_error: "Internal server error: {{error}}",
    http_error: "HTTP error: {{error}}",
  },
};
