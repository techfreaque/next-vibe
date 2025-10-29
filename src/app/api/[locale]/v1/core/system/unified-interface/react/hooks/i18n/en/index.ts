export const translations = {
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
};
