/**
 * Contact API translations (English)
 */

export const translations = {
  title: "Contact Form Submission",
  description: "Submit contact form and handle email notifications",
  category: "Core API",
  summary: "Process contact form submissions with lead tracking",
  tags: {
    contactForm: "Contact Form",
    contactUs: "Contact Us",
    contactSubmission: "Contact Submission",
    helpSupport: "Help & Support",
  },

  form: {
    label: "Contact Form",
    description: "Fill out the form to get in touch with our team",
    fields: {
      name: {
        label: "Full Name",
        description: "Enter your full name",
        placeholder: "John Doe",
      },
      email: {
        label: "Email Address",
        description: "Enter your email address",
        placeholder: "john.doe@example.com",
      },
      company: {
        label: "Company",
        description: "Enter your company name (optional)",
        placeholder: "Acme Corp",
      },
      subject: {
        label: "Subject",
        description: "Brief description of your inquiry",
        placeholder: "General inquiry about services",
      },
      message: {
        label: "Message",
        description: "Detailed description of your inquiry",
        placeholder: "Please provide more details about your needs...",
      },
      priority: {
        label: "Priority",
        description: "Select the urgency level of your inquiry",
        placeholder: "Select priority level",
      },
      leadId: {
        label: "Lead ID",
        description: "Internal lead tracking ID (auto-filled)",
        placeholder: "lead_123",
      },
    },
  },

  subject: {
    helpSupport: "Help & Support",
    generalInquiry: "General Inquiry",
    technicalSupport: "Technical Support",
    accountQuestion: "Account Question",
    billingQuestion: "Billing Question",
    salesInquiry: "Sales Inquiry",
    featureRequest: "Feature Request",
    bugReport: "Bug Report",
    feedback: "Feedback",
    complaint: "Complaint",
    partnership: "Partnership",
    other: "Other",
  },

  priority: {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  },

  status: {
    new: "New",
    inProgress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  },

  response: {
    label: "Contact Submission Response",
    description: "Result of contact form submission",
    success: "Contact form submitted successfully",
    messageId: "Message ID for tracking",
    status: "Current status of the contact",
  },

  examples: {
    requests: {
      general: {
        title: "General Contact Inquiry",
        description: "Example of a general contact form submission",
      },
    },
    responses: {
      success: {
        title: "Successful Submission",
        description: "Example of successful contact form response",
      },
    },
  },

  errors: {
    createFailed: {
      title: "Contact submission failed",
      description:
        "Unable to process your contact form at this time. Please try again later.",
    },
    repositoryCreateFailed: "Failed to create contact request",
    repositoryCreateDetails:
      "Unable to process your contact form at this time. Please try again later.",
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
      nameMinLength: "Name must be at least 2 characters long",
      emailInvalid: "Please enter a valid email address",
      subjectRequired: "Subject is required",
      messageMinLength: "Message must be at least 10 characters long",
      priorityInvalid: "Please select a valid priority level",
      statusInvalid: "Invalid status value",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred while processing your request",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You are not authorized to perform this action",
    },
    forbidden: {
      title: "Forbidden",
      description: "This action is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while processing your request",
    },
  },

  sms: {
    admin: {
      notification: "New contact inquiry: {name} ({email}) - {subject}",
    },
    confirmation: {
      message:
        "{name}, thank you for your message! We'll get back to you soon.",
    },
  },

  success: {
    title: "Success",
    description: "Your contact form has been submitted successfully",
  },
};
