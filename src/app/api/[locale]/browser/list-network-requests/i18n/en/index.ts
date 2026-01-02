export const translations = {
  title: "List Network Requests",
  description: "List all requests for the currently selected page since the last navigation",
  form: {
    label: "List Network Requests",
    description: "Get all network requests from the browser page",
    fields: {
      includePreservedRequests: {
        label: "Include Preserved Requests",
        description: "Set to true to return the preserved requests over the last 3 navigations",
        placeholder: "false",
      },
      pageIdx: {
        label: "Page Index",
        description: "Page number to return (0-based, omit for first page)",
        placeholder: "Enter page index",
      },
      pageSize: {
        label: "Page Size",
        description: "Maximum number of requests to return (omit to return all requests)",
        placeholder: "Enter page size",
      },
      resourceTypes: {
        label: "Resource Types",
        description:
          "Filter requests to only return requests of the specified resource types (omit to return all)",
        placeholder: "Select resource types",
        options: {
          document: "Document",
          stylesheet: "Stylesheet",
          image: "Image",
          media: "Media",
          font: "Font",
          script: "Script",
          texttrack: "Text Track",
          xhr: "XHR",
          fetch: "Fetch",
          prefetch: "Prefetch",
          eventsource: "Event Source",
          websocket: "WebSocket",
          manifest: "Manifest",
          signedexchange: "Signed Exchange",
          ping: "Ping",
          cspviolationreport: "CSP Violation Report",
          preflight: "Preflight",
          fedcm: "FedCM",
          other: "Other",
        },
      },
    },
  },
  response: {
    success: "Network requests retrieved successfully",
    result: {
      title: "Result",
      description: "Network requests list result",
      requests: {
        reqid: "Request ID",
        url: "URL",
        method: "Method",
        status: "Status",
        type: "Type",
      },
      totalCount: "Total Count",
    },
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while listing network requests",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to list network requests",
    },
    forbidden: {
      title: "Forbidden",
      description: "Listing network requests is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred while listing network requests",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while listing network requests",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while listing network requests",
    },
  },
  success: {
    title: "Network Requests Retrieved Successfully",
    description: "The network requests were retrieved successfully",
  },
};
