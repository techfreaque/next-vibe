/**
 * Consultation Schedule subdomain translations for English
 */

export const translations = {
  // Main endpoint metadata
  title: "Schedule Consultation",
  description:
    "Schedule an available consultation with specific time and meeting details",
  category: "Consultation Management",
  tag: "consultation",

  // Flat field references (strings for labels)
  consultationId: "Consultation ID",
  selectTime: "Select Time",
  meetingLink: "Meeting Link",
  calendarEventId: "Calendar Event ID",
  icsAttachment: "ICS Attachment",

  // Field details with nested structure (avoiding duplicate keys)
  consultationIdDetails: {
    description: "The ID of the consultation to schedule",
    placeholder: "Enter consultation ID",
  },
  scheduledDate: {
    description: "Date and time when the consultation will take place",
    placeholder: "Select scheduled date and time",
  },
  scheduledTime: {
    description: "Optional specific time for the consultation",
    placeholder: "Enter time (HH:MM)",
  },
  meetingLinkDetails: {
    description: "Video call link for the consultation",
    placeholder: "Enter meeting link (e.g., Zoom, Teams)",
  },
  calendarEventIdDetails: {
    description: "External calendar event ID for tracking",
    placeholder: "Enter calendar event ID",
  },
  icsAttachmentDetails: {
    description: "Calendar file attachment for the meeting",
    placeholder: "Enter ICS calendar data",
  },

  // Response field descriptions
  response: {
    id: "Consultation ID",
    status: "Consultation Status",
    isNotified: "Email Notification Sent",
    updatedAt: "Last Updated",
  },

  // Success messages
  success: {
    title: "Consultation Scheduled",
    description: "The consultation has been successfully scheduled",
  },

  // Error messages organized by type
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
      consultationId: "Invalid consultation ID format",
      scheduledDate: "Invalid date or time format",
    },
    notFound: {
      title: "Consultation Not Found",
      description: "The consultation with the specified ID was not found",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to schedule this consultation",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "Authentication is required to schedule consultations",
    },
    conflict: {
      title: "Scheduling Conflict",
      description:
        "This consultation cannot be scheduled (already completed or cancelled)",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while scheduling the consultation",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the server. Please try again",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "Please complete all required fields",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred. Please try again",
    },
    email_send_failed: {
      title: "Email Send Failed",
      description: "Failed to send scheduling email",
    },
    user_not_found: {
      title: "User Not Found",
      description: "User account not found",
    },
    scheduled_email_failed: {
      title: "Scheduled Email Failed",
      description: "Failed to send scheduled consultation email",
    },
    rescheduled_email_failed: {
      title: "Rescheduled Email Failed",
      description: "Failed to send rescheduled consultation email",
    },
    admin_notification_failed: {
      title: "Admin Notification Failed",
      description: "Failed to send admin notification",
    },
    invalid_phone: {
      title: "Invalid Phone Number",
      description: "The provided phone number is invalid",
    },
    sms_send_failed: {
      title: "SMS Send Failed",
      description: "Failed to send scheduling SMS",
    },
    no_phone_number: {
      title: "No Phone Number",
      description: "Phone number is required for SMS notifications",
    },
    scheduled_sms_failed: {
      title: "Scheduled SMS Failed",
      description: "Failed to send scheduled consultation SMS",
    },
    rescheduled_sms_failed: {
      title: "Rescheduled SMS Failed",
      description: "Failed to send rescheduled consultation SMS",
    },
  },
};
