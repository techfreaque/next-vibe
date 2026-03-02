export const translations = {
  category: "System",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Embed",
    widget: "Widget",
    iframe: "Iframe",
  },
  get: {
    title: "Mount Vibe Frame",
    description:
      "Mount a next-vibe endpoint inside an isolated iframe for embedding on any website or native WebView",
    container: {
      title: "Vibe Frame Mount",
      description: "Configure and mount an endpoint frame",
    },
    fields: {
      endpoint: {
        label: "Endpoint",
        description:
          "Endpoint identifier (e.g. contact_POST, agent_chat_threads_GET)",
        placeholder: "Enter endpoint identifier...",
      },
      frameId: {
        label: "Frame ID",
        description: "Unique frame identifier for bridge communication",
        placeholder: "Auto-generated",
      },
      urlPathParams: {
        label: "URL Path Params",
        description: "JSON-encoded URL path parameters",
        placeholder: '{"id": "123"}',
      },
      data: {
        label: "Data",
        description: "JSON-encoded pre-fill data for the form",
        placeholder: "{}",
      },
      theme: {
        label: "Theme",
        description: "Color theme for the mounted frame",
      },
      authToken: {
        label: "Auth Token",
        description: "Authentication token for cross-origin embedding",
        placeholder: "Bearer token...",
      },
    },
    response: {
      html: {
        title: "Rendered HTML",
        description: "The complete HTML document for the iframe",
      },
    },
    errors: {
      validation: {
        title: "Invalid mount parameters",
        description: "The provided mount parameters are invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for this endpoint",
      },
      forbidden: {
        title: "Access forbidden",
        description: "You do not have permission to mount this endpoint",
      },
      notFound: {
        title: "Endpoint not found",
        description: "The specified endpoint does not exist",
      },
      internal: {
        title: "Mount failed",
        description: "An error occurred while rendering the endpoint frame",
      },
      network: {
        title: "Network error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred while mounting the frame",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    repository: {
      invalidUrlPathParams: "Invalid URL path parameters format",
      invalidData: "Invalid data format",
      endpointNotFound: "The requested endpoint was not found",
      mountFailed: "Failed to mount the vibe frame endpoint",
    },
    success: {
      mounted: {
        title: "Frame mounted",
        description: "The endpoint has been mounted successfully",
      },
    },
  },
};
