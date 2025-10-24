import { translations as batchTranslations } from "../../batch/i18n/en";
import { translations as campaignsTranslations } from "../../campaigns/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";
import { translations as exportTranslations } from "../../export/i18n/en";
import { translations as importTranslations } from "../../import/i18n/en";
import { translations as leadTranslations } from "../../lead/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";
import { translations as searchTranslations } from "../../search/i18n/en";
import { translations as statsTranslations } from "../../stats/i18n/en";
import { translations as trackingTranslations } from "../../tracking/i18n/en";

export const translations = {
  category: "Lead Management",
  tags: {
    leads: "Leads",
    batch: "Batch",
    campaigns: "Campaigns",
    management: "Management",
    create: "Create",
    search: "Search",
    export: "Export",
    import: "Import",
    csv: "CSV",
    jobs: "Jobs",
    list: "List",
  },
  auth: {
    public: {
      validCookie: "Valid cookie lead found",
      invalidCookie: "Invalid cookie lead",
      created: "Anonymous lead created",
      error: "Error in public lead auth",
    },
    authenticated: {
      primaryFound: "Primary lead found for user",
      noPrimary: "No primary lead found for user",
      error: "Error in authenticated lead auth",
    },
    link: {
      alreadyExists: "Lead link already exists",
      created: "Lead link created",
      error: "Error linking leads",
    },
    validate: {
      error: "Error validating lead",
    },
    getOrCreate: {
      invalid: "Invalid lead ID",
      error: "Error getting or creating lead",
    },
    create: {
      existingFound: "Existing anonymous lead found",
      success: "Lead created successfully",
      error: "Error creating lead",
    },
    createForUser: {
      success: "Lead created for user",
      error: "Error creating lead for user",
    },
    cookie: {
      set: "Lead cookie set",
      error: "Error setting lead cookie",
    },
    getUserLeads: {
      error: "Error getting user leads",
    },
    linkLeads: {
      sameId: "Cannot link lead to itself",
      alreadyExists: "Lead link already exists",
      created: "Leads linked successfully",
      error: "Error linking leads",
    },
    getLinkedLeads: {
      error: "Error getting linked leads",
    },
    getAllLinkedLeads: {
      error: "Error getting all linked leads",
    },
  },
  batch: batchTranslations,
  campaigns: campaignsTranslations,
  create: createTranslations,
  export: exportTranslations,
  import: importTranslations,
  lead: leadTranslations,
  list: listTranslations,
  search: searchTranslations,
  stats: statsTranslations,
  tracking: trackingTranslations,
  enums: {
    engagementTypes: {
      emailOpen: "Email Opened",
      emailClick: "Email Clicked",
      websiteVisit: "Website Visit",
      formSubmit: "Form Submission",
    },
    leadStatus: {
      new: "New",
      pending: "Pending",
      campaignRunning: "Campaign Running",
      websiteUser: "Website User",
      newsletterSubscriber: "Newsletter Subscriber",
      inContact: "In Contact",
      signedUp: "Signed Up",
      consultationBooked: "Consultation Booked",
      subscriptionConfirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
    emailCampaignStage: {
      notStarted: "Not Started",
      initial: "Initial Contact",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
    emailStatus: {
      pending: "Pending",
      sent: "Sent",
      delivered: "Delivered",
      opened: "Opened",
      clicked: "Clicked",
      bounced: "Bounced",
      failed: "Failed",
      unsubscribed: "Unsubscribed",
    },
    emailJourneyVariant: {
      personalApproach: "Personal Approach",
      resultsFocused: "Results Focused",
      personalResults: "Personal Results",
    },
    emailJourneyVariantFilter: {
      all: "All",
      personalApproach: "Personal Approach",
      resultsFocused: "Results Focused",
      personalResults: "Personal Results",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    leadSortField: {
      email: "Email",
      businessName: "Business Name",
      createdAt: "Created Date",
      updatedAt: "Updated Date",
      lastEngagementAt: "Last Engagement",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Lead Created",
      leadUpdated: "Lead Updated",
      emailSent: "Email Sent",
      emailOpened: "Email Opened",
      emailClicked: "Email Clicked",
      leadConverted: "Lead Converted",
      leadUnsubscribed: "Lead Unsubscribed",
    },
    userAssociation: {
      withUser: "With User",
      withLead: "With Lead",
      standalone: "Standalone",
      withBoth: "With Both",
    },
    leadSource: {
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
      api: "API",
    },
    leadStatusFilter: {
      all: "All",
      new: "New",
      pending: "Pending",
      campaignRunning: "Campaign Running",
      websiteUser: "Website User",
      newsletterSubscriber: "Newsletter Subscriber",
      inContact: "In Contact",
      signedUp: "Signed Up",
      consultationBooked: "Consultation Booked",
      subscriptionConfirmed: "Subscription Confirmed",
      unsubscribed: "Unsubscribed",
      bounced: "Bounced",
      invalid: "Invalid",
    },
    emailCampaignStageFilter: {
      all: "All",
      notStarted: "Not Started",
      initial: "Initial Contact",
      followup1: "Follow-up 1",
      followup2: "Follow-up 2",
      followup3: "Follow-up 3",
      nurture: "Nurture",
      reactivation: "Reactivation",
    },
    leadSourceFilter: {
      all: "All",
      website: "Website",
      socialMedia: "Social Media",
      emailCampaign: "Email Campaign",
      referral: "Referral",
      csvImport: "CSV Import",
      api: "API",
    },
    batchOperationScope: {
      currentPage: "Current Page",
      allPages: "All Pages",
    },
    country: {
      de: "Germany",
      pl: "Poland",
      global: "Global",
    },
    language: {
      de: "German",
      pl: "Polish",
      en: "English",
    },
  },
  error: {
    general: {
      internal_server_error: "Internal server error",
      not_found: "Not found",
      unauthorized: "Unauthorized",
      forbidden: "Forbidden",
      bad_request: "Bad request",
      validation_error: "Validation error",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Invalid batch update request",
          },
          server: {
            title: "Server error updating leads in batch",
          },
          default: "Error updating leads in batch",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Server error retrieving leads",
          },
          not_found: {
            title: "Leads not found",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Lead with this email already exists",
          },
          server: {
            title: "Server error creating lead",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Lead not found",
          },
          server: {
            title: "Server error updating lead",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        error: {
          validation: {
            title: "Invalid unsubscribe request",
          },
          server: {
            title: "Server error processing unsubscribe",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Invalid engagement data",
          },
          server: {
            title: "Server error recording engagement",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Server error exporting leads",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Server error processing campaign",
          },
        },
      },
    },
  },
};
