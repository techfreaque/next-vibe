export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
    purchaseInquiry: "Purchase Inquiry",
  },
  post: {
    title: "Request Device License",
    description:
      "Submit a purchase inquiry for a device that has no active subscription.",
    logicalId: {
      label: "Device ID",
      description: "The unique identifier of the device.",
    },
    orgResourceId: {
      label: "Organization",
      description: "The organization this device belongs to.",
    },
    deviceLabel: {
      label: "Device Name",
      description: "Display name of the device.",
    },
    contactName: {
      label: "Contact Name",
      description: "Full name of the contact person.",
    },
    contactEmail: {
      label: "Contact Email",
      description: "Email address for follow-up.",
    },
    contactPhone: {
      label: "Phone Number",
      description: "Optional phone number for follow-up.",
    },
    inquiryMessage: {
      label: "Message",
      description: "Any additional information or requirements.",
    },
    requestedMonths: {
      label: "Requested Subscription Length (months)",
      description: "How many months of subscription are you interested in?",
    },
    response: {
      inquiryId: "Inquiry ID",
      confirmationMessage: "Confirmation",
    },
    widget: {
      title: "Request Device License",
      back: "Back",
      description:
        "Fill in your contact details and we'll follow up within 1 business day to discuss licensing options.",
      submit: "Submit Inquiry",
      submitAnother: "Submit Another Inquiry",
      submittedLabel: "Inquiry submitted",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Please check the form fields.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required.",
      },
      forbidden: { title: "Forbidden", description: "Not allowed." },
      notFound: { title: "Not Found", description: "Device not found." },
      conflict: { title: "Conflict", description: "Conflict." },
      server: { title: "Server Error", description: "Internal server error." },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes.",
      },
      unknown: { title: "Unknown Error", description: "Unknown error." },
    },
    success: {
      title: "Inquiry Submitted",
      description: "We'll be in touch within 1 business day.",
    },
  },
  email: {
    subject: "New license inquiry: {deviceId}",
    heading: "New Purchase Inquiry",
    device: "Device",
    org: "Organization",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    months: "Requested Months",
    messageLabel: "Message",
    noPhone: "Not provided",
    noMessage: "No message",
    noMonths: "Not specified",
  },
};
