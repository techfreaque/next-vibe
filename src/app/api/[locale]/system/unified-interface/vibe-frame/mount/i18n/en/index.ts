export const translations = {
  category: "System",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Embed",
    widget: "Widget",
    config: "Config",
  },
  post: {
    title: "Vibe Frame Config",
    description:
      "Returns iframe URLs for the requested integrations. Server reads real auth cookies (credentials: include) and mints short-lived exchange tokens so no secrets appear in URLs.",
    container: {
      title: "Vibe Frame Config",
      description: "Request iframe URLs for one or more integrations",
    },
    fields: {
      leadId: {
        label: "Lead ID",
        description:
          "Visitor lead ID from the host page (cross-origin - cannot be read from cookies)",
      },
      authToken: {
        label: "Auth Token",
        description:
          "JWT auth token from the host page session (for authenticated widgets)",
      },
      integrations: {
        label: "Integrations",
        description: "List of integrations to configure",
      },
      integration: {
        label: "Integration",
        description: "Single integration config",
      },
      id: {
        label: "Integration ID",
        description: "Unique identifier for this integration slot",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Endpoint",
        description: "Endpoint identifier override (defaults to id if not set)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Has Rendered",
        description:
          "Set to true if this integration is already mounted - server can skip it",
      },
      theme: {
        label: "Theme",
        description: "Color theme for the frame",
      },
      urlPathParams: {
        label: "URL Path Params",
        description: "JSON-encoded URL path parameters",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Data",
        description: "JSON-encoded pre-fill data",
        placeholder: "{}",
      },
      widgets: {
        label: "Widgets",
        description: "Map of integration ID to widget config",
      },
      widget: {
        label: "Widget",
        description: "Widget config for one integration",
      },
      frameId: {
        label: "Frame ID",
        description: "Unique frame ID for bridge communication",
      },
      widgetUrl: {
        label: "Widget URL",
        description: "Iframe src URL with exchange token",
      },
    },
    errors: {
      validation: {
        title: "Invalid parameters",
        description: "The provided parameters are invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Access forbidden",
        description: "You do not have permission",
      },
      notFound: {
        title: "Endpoint not found",
        description: "One or more endpoints do not exist",
      },
      internal: {
        title: "Config failed",
        description: "An error occurred while building the config response",
      },
      network: {
        title: "Network error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
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
      endpointNotFound: "Endpoint not found",
      configFailed: "Failed to build frame config",
      tokenMintFailed: "Failed to mint exchange token",
    },
    success: {
      configured: {
        title: "Config ready",
        description: "Iframe URLs generated successfully",
      },
    },
  },
};
