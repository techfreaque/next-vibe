export const translations = {
  title: "Take Desktop Screenshot",
  description: "Capture a screenshot of the desktop or a screen region",
  form: {
    label: "Take Desktop Screenshot",
    description:
      "Capture a screenshot of the full desktop or a specific region",
    fields: {
      outputPath: {
        label: "Output Path",
        description:
          "Absolute path to save the screenshot. Omit to return inline base64.",
        placeholder: "/tmp/screenshot.png",
      },
      screen: {
        label: "Screen Index",
        description:
          "Screen/monitor index (0 = primary). Prefer monitorName over this.",
        placeholder: "0",
      },
      monitorName: {
        label: "Monitor Name",
        description:
          "Monitor output name (e.g. DP-1, HDMI-1). Run list-monitors first to see available names.",
        placeholder: "DP-1",
      },
      maxWidth: {
        label: "Max Width",
        description:
          "Downscale to this width if the capture is wider. Useful for AI — 4-monitor captures are massive.",
        placeholder: "1920",
      },
    },
  },
  response: {
    success: "Screenshot captured successfully",
    imagePath: "Path where the screenshot was saved",
    imageData: "Base64-encoded PNG screenshot data",
    width: "Screenshot width in pixels",
    height: "Screenshot height in pixels",
    monitorName: "Monitor that was captured",
    originalWidth: "Original width before downscaling",
    originalHeight: "Original height before downscaling",
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
      description: "A network error occurred while capturing the screenshot",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to capture desktop screenshots",
    },
    forbidden: {
      title: "Forbidden",
      description: "Capturing desktop screenshots is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred while capturing the screenshot",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred while capturing the screenshot",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while capturing the screenshot",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This feature is not available on your operating system",
    },
  },
  success: {
    title: "Screenshot Captured",
    description: "The desktop screenshot was captured successfully",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop Automation",
    captureAutomation: "Capture Automation",
  },
};
