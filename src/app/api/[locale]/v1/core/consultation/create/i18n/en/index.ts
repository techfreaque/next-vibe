/**
 * Consultation Create subdomain translations for English
 */

export const translations = {
  title: "Create Consultation",
  description: "Book a consultation with our experts",
  category: "Consultation",
  tag: "Consultation",

  // Enum translations for consultation types
  enums: {
    consultationType: {
      initial: "Initial Consultation",
      followUp: "Follow-up Session",
      technical: "Technical Support",
      sales: "Sales Discussion",
      support: "General Support",
      strategy: "Strategy Planning",
    },
  },
  container: {
    title: "Consultation Booking Form",
    description: "Fill out the form to schedule your consultation",
  },
  consultationTypes: {
    label: "Consultation Type",
    description: "Select one or more consultation types",
    placeholder: "Choose consultation types",
  },
  preferredDate: {
    label: "Preferred Date",
    description: "Select your preferred consultation date",
    placeholder: "Select date",
  },
  preferredTime: {
    label: "Preferred Time",
    description: "Select your preferred consultation time",
    placeholder: "Select time (HH:MM)",
  },
  message: {
    label: "Message",
    description: "Additional information or questions (optional)",
    placeholder: "Tell us more about what you'd like to discuss",
  },
  response: {
    title: "Consultation Created",
    description: "Your consultation has been successfully scheduled",
    consultationId: "Your consultation ID",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to create a consultation",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "Authentication is required to book a consultation",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while creating your consultation",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the server. Please try again",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred. Please try again",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "Please complete all required fields",
    },
    conflict: {
      title: "Booking Conflict",
      description: "The selected time slot is no longer available",
    },
    database: {
      title: "Database Error",
      description: "Failed to save consultation data",
    },
    userNotFound: {
      title: "User Not Found",
      description: "User account not found",
    },
    invalid_phone: {
      title: "Invalid Phone Number",
      description: "The provided phone number is invalid",
    },
    sms_send_failed: {
      title: "SMS Send Failed",
      description: "Failed to send consultation SMS",
    },
    user_not_found: {
      title: "User Not Found",
      description: "User account not found",
    },
    no_phone_number: {
      title: "No Phone Number",
      description: "Phone number is required for SMS notifications",
    },
    confirmation_sms_failed: {
      title: "Confirmation SMS Failed",
      description: "Failed to send confirmation SMS",
    },
    update_sms_failed: {
      title: "Update SMS Failed",
      description: "Failed to send update SMS",
    },
  },
  success: {
    title: "Consultation Booked",
    description: "Your consultation has been successfully scheduled",
    message: "Consultation created successfully",
  },

  // Debug translations for email rendering
  debug: {
    rendering_consultation_request_email:
      "Rendering consultation request email",
    rendering_consultation_update_email: "Rendering consultation update email",
    rendering_consultation_admin_notification_email:
      "Rendering consultation admin notification email",
  },
};
