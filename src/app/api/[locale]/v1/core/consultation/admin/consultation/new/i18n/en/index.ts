export const translations = {
  category: "Consultation Management",
  tag: "consultation",

  // Form enum translations for the enum.ts file
  form: {
    selectionType: {
      new: "Create New Lead",
      user: "Existing User",
      lead: "Existing Lead",
    },
    priority: {
      options: {
        low: "Low",
        normal: "Normal",
        high: "High",
      },
    },
  },

  post: {
    title: "Create New Consultation",
    description: "Create a new consultation from the admin panel",
    category: "Consultation Management",
    tag: "consultation",

    container: {
      title: "Create New Consultation",
      description:
        "Create a new consultation booking with all required details",
    },

    selectionType: {
      label: "Selection Type",
      description: "Choose how to select the consultation participant",
      placeholder: "Choose selection type",
    },

    userId: {
      label: "User ID",
      description: "ID of existing user to associate with consultation",
      placeholder: "Enter user ID",
    },

    leadId: {
      label: "Lead ID",
      description: "ID of existing lead to associate with consultation",
      placeholder: "Enter lead ID",
    },

    name: {
      label: "Full Name",
      description: "Full name of the consultation participant",
      placeholder: "Enter full name",
    },

    email: {
      label: "Email Address",
      description: "Email address of the consultation participant",
      placeholder: "Enter email address",
    },

    phone: {
      label: "Phone Number",
      description: "Phone number for consultation contact",
      placeholder: "Enter phone number",
    },

    businessType: {
      label: "Business Type",
      description: "Type of business the participant operates",
      placeholder: "Enter business type",
    },

    businessName: {
      label: "Business Name",
      description: "Name of the participant's business",
      placeholder: "Enter business name",
    },

    website: {
      label: "Website URL",
      description: "Business website URL",
      placeholder: "https://example.com",
    },

    country: {
      label: "Country",
      description: "Country where the business is located",
      placeholder: "Select country",
      options: {
        global: "Global",
        de: "Germany",
        pl: "Poland",
      },
    },

    language: {
      label: "Language",
      description: "Preferred consultation language",
      placeholder: "Select language",
      options: {
        en: "English",
        de: "German",
        pl: "Polish",
      },
    },

    city: {
      label: "City",
      description: "City where the business is located",
      placeholder: "Enter city",
    },

    currentChallenges: {
      label: "Current Challenges",
      description: "Current business challenges to address",
      placeholder: "Describe current business challenges",
    },

    goals: {
      label: "Goals",
      description: "Business goals and objectives",
      placeholder: "Describe business goals",
    },

    targetAudience: {
      label: "Target Audience",
      description: "Description of target audience",
      placeholder: "Describe target audience",
    },

    existingAccounts: {
      label: "Existing Social Media Accounts",
      description: "List of existing social media accounts",
      placeholder: "List existing social media accounts",
    },

    competitors: {
      label: "Competitors",
      description: "Main business competitors",
      placeholder: "List main competitors",
    },

    preferredDate: {
      label: "Preferred Date",
      description: "Participant's preferred consultation date",
      placeholder: "Select preferred date",
    },

    preferredTime: {
      label: "Preferred Time",
      description: "Participant's preferred consultation time",
      placeholder: "Select preferred time",
    },

    message: {
      label: "Additional Message",
      description: "Additional information or special requests",
      placeholder: "Enter any additional information",
    },

    status: {
      label: "Status",
      description: "Current consultation status",
      placeholder: "Select consultation status",
    },

    priority: {
      label: "Priority",
      description: "Consultation priority level",
      placeholder: "Select priority level",
    },

    internalNotes: {
      label: "Internal Notes",
      description: "Internal admin notes (not visible to client)",
      placeholder: "Internal admin notes (not visible to client)",
    },

    // Response fields
    id: {
      label: "Consultation ID",
      description: "Unique identifier for the created consultation",
    },

    createdAt: {
      label: "Created At",
      description: "Date and time when consultation was created",
    },

    updatedAt: {
      label: "Updated At",
      description: "Date and time when consultation was last updated",
    },

    userEmail: {
      label: "User Email",
      description: "Email address of the consultation participant",
    },

    userName: {
      label: "User Name",
      description: "Name of the consultation participant",
    },

    userBusinessType: {
      label: "User Business Type",
      description: "Type of business the user operates",
    },

    userContactPhone: {
      label: "User Contact Phone",
      description: "Phone number for consultation contact",
    },

    isNotified: {
      label: "Notification Sent",
      description: "Whether notification has been sent to participant",
    },

    scheduledDate: {
      label: "Scheduled Date",
      description: "Actual scheduled consultation date",
    },

    scheduledTime: {
      label: "Scheduled Time",
      description: "Actual scheduled consultation time",
    },

    calendarEventId: {
      label: "Calendar Event ID",
      description: "Calendar system event identifier",
    },

    meetingLink: {
      label: "Meeting Link",
      description: "Online meeting URL for the consultation",
    },

    icsAttachment: {
      label: "ICS Attachment",
      description: "Calendar file attachment data",
    },

    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
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
        title: "Not Found",
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that will be lost",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      email_send_failed: {
        title: "Email Send Failed",
        description: "Failed to send consultation email",
      },
      missing_contact_info: {
        title: "Missing Contact Information",
        description: "Required contact information is missing",
      },
      partner_notification_failed: {
        title: "Partner Notification Failed",
        description: "Failed to send partner notification",
      },
      internal_notification_failed: {
        title: "Internal Notification Failed",
        description: "Failed to send internal notification",
      },
      invalid_phone: {
        title: "Invalid Phone Number",
        description: "The provided phone number is invalid",
      },
      sms_send_failed: {
        title: "SMS Send Failed",
        description: "Failed to send consultation SMS",
      },
      no_phone_number: {
        title: "No Phone Number",
        description: "Phone number is required for SMS notifications",
      },
      partner_confirmation_failed: {
        title: "Partner Confirmation Failed",
        description: "Failed to send partner confirmation SMS",
      },
      status_update_failed: {
        title: "Status Update Failed",
        description: "Failed to update consultation status",
      },
    },
    success: {
      title: "Success",
      description: "Consultation created successfully",
    },

    // Email templates
    emailTemplates: {
      partner: {
        subject: "Your Consultation Request - {{businessName}}",
        title: "Thank you for your consultation request, {{name}}!",
        preview:
          "We've received your consultation request for {{businessName}}",
        greeting: "Hello {{name}},",
        message:
          "Thank you for requesting a consultation with our team. We're excited to help you grow your business!",
        details: "Consultation Details:",
        preferredDate: "Preferred Date",
        additionalMessage: "Your Message",
        nextSteps:
          "We'll be in touch soon to confirm your consultation time and provide next steps.",
      },
      internal: {
        subject: "New Consultation Request - {{businessName}}",
        title: "New Consultation Request Received",
        preview: "New consultation request from {{businessName}}",
        greeting: "Hello Team,",
        message:
          "A new consultation request has been submitted and requires attention.",
        details: "Contact Details:",
        contactName: "Contact Name",
        contactEmail: "Email Address",
        contactPhone: "Phone Number",
        businessName: "Business Name",
        businessType: "Business Type",
        preferredDate: "Preferred Date",
        priority: "Priority Level",
        messageContent: "Client Message",
        internalNotes: "Internal Notes",
        closing: "Please review and schedule the consultation accordingly.",
        viewConsultation: "View Full Consultation Details",
      },
    },
  },
};
