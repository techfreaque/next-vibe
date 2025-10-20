import { translations as componentsTranslations } from "../../components/i18n/en";
import { translations as createTranslations } from "../../create/i18n/en";
import { translations as editTranslations } from "../../edit/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";

export const translations = {
  tag: "SMTP Client",
  category: "Email Services",
  components: componentsTranslations,
  create: createTranslations,
  edit: editTranslations,
  list: listTranslations,
  sending: {
    errors: {
      server: {
        title: "Server Error",
        description: "An error occurred on the SMTP server",
      },
      rejected: {
        title: "Email Rejected",
        defaultReason: "Email rejected by server",
      },
      no_recipients: {
        title: "No Recipients Accepted",
        defaultReason: "No recipients accepted",
      },
      rate_limit: {
        title: "Rate Limit Exceeded",
      },
      capacity: {
        title: "Capacity Error",
      },
      no_account: {
        title: "No SMTP Account Available",
      },
    },
  },
  emailMetadata: {
    errors: {
      server: {
        title: "Email Metadata Server Error",
        description: "Failed to store email metadata",
      },
    },
  },
  enums: {
    status: {
      active: "Active",
      inactive: "Inactive",
      error: "Error",
      testing: "Testing",
    },
    securityType: {
      none: "None",
      tls: "TLS",
      ssl: "SSL",
      starttls: "STARTTLS",
    },
    statusFilter: {
      all: "All Statuses",
    },
    healthStatus: {
      healthy: "Healthy",
      degraded: "Degraded",
      unhealthy: "Unhealthy",
      unknown: "Unknown",
    },
    healthStatusFilter: {
      all: "All Health Statuses",
    },
    sortField: {
      name: "Name",
      status: "Status",
      createdAt: "Created At",
      updatedAt: "Updated At",
      priority: "Priority",
      totalEmailsSent: "Total Emails Sent",
      lastUsedAt: "Last Used At",
    },
    campaignType: {
      leadCampaign: "Lead Campaign",
      newsletter: "Newsletter",
      transactional: "Transactional",
      notification: "Notification",
      system: "System",
    },
    campaignTypeFilter: {
      all: "All Campaign Types",
    },
    selectionRuleSortField: {
      name: "Name",
      priority: "Priority",
      campaignType: "Campaign Type",
      journeyVariant: "Journey Variant",
      campaignStage: "Campaign Stage",
      country: "Country",
      language: "Language",
      createdAt: "Created At",
      updatedAt: "Updated At",
      emailsSent: "Emails Sent",
      successRate: "Success Rate",
      lastUsedAt: "Last Used At",
    },
    selectionRuleStatusFilter: {
      all: "All",
      active: "Active",
      inactive: "Inactive",
      default: "Default",
      failover: "Failover",
    },
    loadBalancingStrategy: {
      roundRobin: "Round Robin",
      weighted: "Weighted",
      priority: "Priority",
      leastUsed: "Least Used",
    },
    testResult: {
      success: "Success",
      authFailed: "Authentication Failed",
      connectionFailed: "Connection Failed",
      timeout: "Timeout",
      unknownError: "Unknown Error",
    },
  },
};
