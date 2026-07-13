export const translations = {
  post: {
    title: "Headless Client",
    titleShort: "headless",
    description: "Start the headless remote-connection client",
    form: {
      title: "Headless Client",
      description:
        "Starts reverse-WS connections and tool executor. No web server.",
    },
    fields: {
      computerName: {
        title: "Computer Name",
        description: "Identifier for this machine (defaults to OS hostname)",
      },
      remoteUrl: {
        title: "Remote URL",
        description: "Cloud instance URL to connect to",
      },
      leadId: {
        title: "Lead ID",
        description: "Your lead UUID on the remote instance",
      },
      token: { title: "Token", description: "Connection auth token" },
      output: { title: "Output" },
    },
    errors: {
      validation: { title: "Validation error", description: "Invalid input" },
      network: { title: "Network error", description: "Network error" },
      unauthorized: { title: "Unauthorized", description: "Unauthorized" },
      forbidden: { title: "Forbidden", description: "Forbidden" },
      notFound: { title: "Not found", description: "Not found" },
      server: { title: "Server error", description: "Server error" },
      unknown: { title: "Unknown error", description: "Unknown error" },
      conflict: { title: "Conflict", description: "Conflict" },
      migrationFailed: "Migration failed",
      migrationError: "Migration error",
    },
    success: {
      title: "Headless client started",
      description: "Reverse-WS connections open, waiting for tool requests",
    },
  },
};
