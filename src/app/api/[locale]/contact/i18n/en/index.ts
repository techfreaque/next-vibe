/**
 * Contact API translations (English)
 */

import { translations as componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  _components: componentsTranslations,
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
        label: "Your Name",
        description: "Enter your name",
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
    submitButton: {
      label: "Send Message",
      loadingText: "Sending...",
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
    description: "Status updates for your contact submission",
    success: "Thank you for contacting us! We've received your message and will get back to you soon.",
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
    noContactReturned: "No contact record was returned after creation",
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
      phone: {
        missing: "No admin phone number configured for contact notifications",
      },
      send: {
        start: "Sending admin notification SMS for contact submission",
        error: "Error sending admin notification SMS for contact",
      },
    },
    confirmation: {
      message:
        "{name}, thank you for your message! We'll get back to you soon.",
      phone: {
        missing: "No user phone number available for contact confirmation SMS",
      },
      send: {
        start: "Sending confirmation SMS to contact form submitter",
        error: "Error sending confirmation SMS for contact",
      },
    },
  },

  repository: {
    create: {
      start: "Starting contact form submission",
      success: "Contact form submitted successfully",
      error: "Error creating contact form submission",
    },
    lead: {
      conversion: {
        start: "Starting lead conversion for contact",
        error: "Error during lead conversion for contact",
      },
      provided: "Lead ID provided for contact submission",
    },
    seed: {
      create: {
        start: "Starting contact seed creation",
        error: "Error creating contact seed",
      },
    },
  },

  route: {
    sms: {
      admin: {
        failed: "Admin notification SMS failed for contact submission",
      },
      confirmation: {
        failed: "Confirmation SMS failed for contact submission",
      },
    },
  },

  seeds: {
    dev: {
      start: "Starting contact seeds for development environment",
      submission: {
        created: "Contact submission created in development seeds",
        failed: "Failed to create contact submission in development seeds",
        error: "Error creating contact submission in development seeds",
      },
      complete: "Contact development seeds completed",
      error: "Error seeding contact development data",
    },
    test: {
      start: "Starting contact seeds for test environment",
      submission: {
        created: "Contact submission created in test seeds",
        failed: "Failed to create contact submission in test seeds",
      },
      error: "Error seeding contact test data",
    },
    prod: {
      start: "Starting contact seeds for production environment",
      ready: "Contact production environment ready",
      error: "Error seeding contact production data",
    },
  },

  success: {
    title: "Success",
    description: "Your contact form has been submitted successfully",
  },

  email: {
    // Legacy keys for existing email template compatibility
    partner: {
      greeting: "Hello",
      thankYou: "Thank you for contacting us!",
      message: "Message",
      additionalInfo: "We've received your inquiry and will respond soon.",
      subject: "Contact Form Submission",
    },
    company: {
      contactDetails: "Contact Details",
      name: "Name",
      email: "Email",
      company: "Company",
      contactSubject: "Subject",
      viewDetails: "View in Admin",
    },
    // User confirmation email
    user_confirmation: {
      title: "We've Received Your Message!",
      subject: "Thank You for Contacting {{appName}}",
      previewText: "We've received your message and will get back to you soon.",
      greeting: "Hi {{name}},",
      thankYou: "Thank you for reaching out to {{appName}}!",
      confirmation:
        "We've received your message and our team will review it shortly. We typically respond within 24 hours during business days.",
      yourMessage: "Your Message",
      subject_label: "Subject",
      message_label: "Message",
      whatHappensNext: "What Happens Next?",
      step1: "Our team reviews your inquiry",
      step2: "We'll respond within 24 hours",
      step3: "We'll work together to address your needs",
      needUrgentHelp: "Need Urgent Help?",
      urgentHelpInfo:
        "If your inquiry is urgent, you can also reach us via live chat on our website or check our help center for instant answers.",
      helpCenterButton: "Visit Help Center",
      signoff:
        "Thank you for choosing {{appName}},\nThe {{appName}} Support Team",
      footer: "This is an automated confirmation from {{appName}}",
    },
    // Admin notification email
    admin_notification: {
      title: "New Contact Form Submission",
      subject: "New Contact: {{name}} - {{subject}}",
      previewText: "New contact inquiry from {{name}} ({{email}})",
      message: "A new contact form submission has been received.",
      contactDetails: "Contact Details",
      name: "Name",
      email: "Email",
      company: "Company",
      subject_label: "Subject",
      priority: "Priority",
      message_label: "Message",
      submittedAt: "Submitted At",
      leadInfo: "Lead Information",
      leadId: "Lead ID",
      status: "Status",
      actionRequired: "Action Required",
      actionInfo: "Please review and respond to this inquiry within 24 hours.",
      viewInAdmin: "View in Admin Panel",
      replyToContact: "Reply to Contact",
      footer: "This is an automated notification from {{appName}}",
    },
  },

  error: {
    general: {
      internal_server_error: "Internal server error occurred",
    },
  },
};
