export const translations = {
  title: "Take Screenshot",
  description: "Take a screenshot of the page or a specific element",
  form: {
    label: "Take Screenshot",
    description: "Capture a screenshot of the browser page or element",
    fields: {
      uid: {
        label: "Element UID",
        description: "The uid of an element to screenshot (omit to screenshot the entire page)",
        placeholder: "Enter element uid",
      },
      fullPage: {
        label: "Full Page",
        description: "If set to true takes a screenshot of the full page instead of the currently visible viewport (incompatible with uid)",
        placeholder: "false",
      },
      format: {
        label: "Format",
        description: "Type of format to save the screenshot as (default: png)",
        placeholder: "png",
        options: {
          png: "PNG",
          jpeg: "JPEG",
          webp: "WebP",
        },
      },
      quality: {
        label: "Quality",
        description: "Compression quality for JPEG and WebP formats (0-100). Higher values mean better quality but larger file sizes. Ignored for PNG format.",
        placeholder: "80",
      },
      filePath: {
        label: "File Path",
        description: "The absolute path, or a path relative to the current working directory, to save the screenshot to instead of attaching it to the response",
        placeholder: "/path/to/screenshot.png",
      },
    },
  },
  response: {
    success: "Screenshot captured successfully",
    result: "Screenshot capture result",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: { title: "Validation Error", description: "Please check your input and try again" },
    network: { title: "Network Error", description: "A network error occurred while capturing the screenshot" },
    unauthorized: { title: "Unauthorized", description: "You are not authorized to capture screenshots" },
    forbidden: { title: "Forbidden", description: "Capturing screenshots is forbidden" },
    notFound: { title: "Not Found", description: "The requested resource was not found" },
    serverError: { title: "Server Error", description: "An internal server error occurred while capturing the screenshot" },
    unknown: { title: "Unknown Error", description: "An unknown error occurred while capturing the screenshot" },
    unsavedChanges: { title: "Unsaved Changes", description: "You have unsaved changes that may be lost" },
    conflict: { title: "Conflict", description: "A conflict occurred while capturing the screenshot" },
  },
  success: {
    title: "Screenshot Captured Successfully",
    description: "The screenshot was captured successfully",
  },
};
