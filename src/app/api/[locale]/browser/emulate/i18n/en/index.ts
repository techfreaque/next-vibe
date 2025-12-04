export const translations = {
  title: "Emulate",
  description: "Emulate various features on the selected page",
  form: {
    label: "Emulate Device",
    description: "Emulate network conditions and CPU throttling",
    fields: {
      networkConditions: {
        label: "Network Conditions",
        description: "Throttle network (set to No emulation to disable)",
        placeholder: "Select network condition",
        options: {
          noEmulation: "No emulation",
          offline: "Offline",
          slow3g: "Slow 3G",
          fast3g: "Fast 3G",
          slow4g: "Slow 4G",
          fast4g: "Fast 4G",
        },
      },
      cpuThrottlingRate: {
        label: "CPU Throttling Rate",
        description: "CPU slowdown factor (1 to disable, 1-20)",
        placeholder: "Enter throttling rate",
      },
    },
  },
  response: {
    success: "Emulation operation successful",
    result: "Result of the emulation operation",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },
  errors: {
    validation: { title: "Validation Error", description: "Please check your input and try again" },
    network: { title: "Network Error", description: "A network error occurred during emulation" },
    unauthorized: { title: "Unauthorized", description: "You are not authorized to emulate device features" },
    forbidden: { title: "Forbidden", description: "Device emulation operation is forbidden" },
    notFound: { title: "Not Found", description: "The requested resource was not found" },
    serverError: { title: "Server Error", description: "An internal server error occurred during emulation" },
    unknown: { title: "Unknown Error", description: "An unknown error occurred during emulation" },
    unsavedChanges: { title: "Unsaved Changes", description: "You have unsaved changes that may be lost" },
    conflict: { title: "Conflict", description: "A conflict occurred during emulation" },
  },
  success: {
    title: "Emulation Successful",
    description: "Device features were emulated successfully",
  },
};
