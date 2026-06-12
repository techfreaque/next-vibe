export const translations = {
  capture: {
    title: "Capture Interactive Frame",
    titleShort: "Capture Frame",
    description:
      "Read the current rendered frame from a running vibe interactive session",
    form: {
      fields: {
        pid: {
          label: "Session PID",
          description:
            "PID of the interactive session. Auto-detected when omitted.",
        },
      },
    },
    response: {
      fields: {
        content: "Frame Content",
        logs: "Error Logs",
        pid: "Session PID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      server: {
        title: "Server Error",
        description: "Internal server error",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "No Session",
        description: "No active interactive session found",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      conflict: {
        title: "Conflict",
        description: "Session conflict",
      },
    },
    success: {
      title: "Frame Captured",
      description: "Current frame retrieved successfully",
    },
  },
  sendKeys: {
    title: "Send Keys to Interactive Session",
    titleShort: "Send Keys",
    description:
      "Inject keystrokes into a running vibe interactive session and return the updated frame",
    form: {
      fields: {
        keys: {
          label: "Keys",
          description:
            "Key to send: Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space, or literal text",
        },
        pid: {
          label: "Session PID",
          description:
            "PID of the interactive session. Auto-detected when omitted.",
        },
        waitMs: {
          label: "Wait (ms)",
          description:
            "Milliseconds to wait after injecting keys before reading the frame. Default 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Frame Content",
        logs: "Error Logs",
        pid: "Session PID",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      server: {
        title: "Server Error",
        description: "Internal server error",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "No Session",
        description: "No active interactive session found",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      conflict: {
        title: "Conflict",
        description: "Session conflict",
      },
    },
    success: {
      title: "Keys Sent",
      description: "Keystrokes sent and frame updated",
    },
  },
};
