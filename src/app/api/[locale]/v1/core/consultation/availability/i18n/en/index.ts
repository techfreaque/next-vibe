export const translations = {
  title: "Check Consultation Availability",
  description: "Get available time slots for consultation scheduling",
  category: "Consultation Availability",
  tag: "Availability",

  form: {
    title: "Availability Check Parameters",
    description:
      "Specify the date range and parameters to check for available consultation slots",
  },

  startDate: {
    label: "Start Date",
    description: "The start date for checking availability",
    placeholder: "Select start date",
  },

  endDate: {
    label: "End Date",
    description: "The end date for checking availability",
    placeholder: "Select end date",
  },

  slotDuration: {
    label: "Slot Duration (minutes)",
    description: "Duration of each consultation slot in minutes",
    placeholder: "60",
  },

  response: {
    slotsArray: "Available Time Slots",
    slots: {
      title: "Time Slot",
      description: "Available consultation time slot",
      start: "Start Time",
      end: "End Time",
      available: "Available",
    },
    timezone: "Timezone",
  },

  success: {
    title: "Availability Retrieved",
    description: "Successfully retrieved available consultation slots",
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "The provided parameters are invalid",
      message: "Please provide valid date and time parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to check consultation availability",
    },
    server: {
      title: "Server Error",
      description:
        "An internal server error occurred while checking availability",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    network: {
      title: "Network Error",
      description: "Failed to connect to the server",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to this resource is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred with the current state",
    },
  },
};
