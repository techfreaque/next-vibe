export const fieldsTranslations = {
  id: {
    label: "ID",
    description: "Unique identifier for the lead",
  },
  businessName: {
    label: "Business Name",
    placeholder: "Enter business name",
  },
  contactName: {
    label: "Contact Name",
    placeholder: "Enter contact person name",
  },
  email: {
    label: "Email Address",
    placeholder: "Enter email address",
  },
  phone: {
    label: "Phone Number",
    placeholder: "Enter phone number",
  },
  website: {
    label: "Website",
    placeholder: "Enter website URL",
  },
  country: {
    label: "Country",
    placeholder: "Select country",
  },
  language: {
    label: "Language",
    placeholder: "Select language",
  },
  status: {
    label: "Status",
    description: "Current status of the lead",
    placeholder: "Select status",
    options: {
      new: "New",
      pending: "Pending",
      campaign_running: "Campaign Running",
      website_user: "Website User",
      newsletter_subscriber: "Newsletter Subscriber",
      in_contact: "In Contact",
      signed_up: "Signed Up",
      consultation_booked: "Consultation Booked",
      subscription_confirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
  },
  currentCampaignStage: {
    label: "Campaign Stage",
    description: "Current stage in the email campaign",
    placeholder: "Select campaign stage",
    options: {
      not_started: "Not Started",
      initial: "Initial",
      followup_1: "Follow-up 1",
      followup_2: "Follow-up 2",
      followup_3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
  },
  source: {
    label: "Source",
    placeholder: "Enter lead source",
  },
  notes: {
    label: "Notes",
    description: "Additional notes about the lead",
    placeholder: "Enter notes",
  },
  metadata: {
    label: "Metadata",
    description: "Additional metadata as JSON",
    placeholder: "Enter metadata as JSON",
  },
  convertedUserId: {
    label: "Converted User",
    placeholder: "Select a user this lead converted to...",
    searchPlaceholder: "Search users...",
    searchHint: "Type at least 2 characters to search",
    noResults: "No users found",
    selectedUser: "{{firstName}} {{lastName}} ({{email}})",
  },
};
