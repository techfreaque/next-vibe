export const translations = {
  tag: "SMTP Client",
  category: "Email Services",
  components: {
    email: {
      tagline: "Free speech AI platform",
      footer: {
        needHelp: "Need help?",
        helpText: "Need help? Contact us at",
        unsubscribeText: "Don't want to receive these emails?",
        unsubscribeLink: "Unsubscribe",
        copyright: "© {{currentYear}} {{appName}}. All rights reserved.",
        visitWebsite: "Visit Website",
        allRightsReserved:
          "© {{currentYear}} {{appName}}. All rights reserved.",
        feedbackHook: "Got something to say? Reply - we actually read it.",
        feedbackBody:
          "Report a bug, request a feature, or tell us what's missing. Useful feedback earns you {{credits}} credits — a full month on us.",
        feedbackLink: "Reply with feedback →",
        footerSeparator: " · ",
      },
    },
    post: {
      title: "Components",
      description: "Components endpoint",
      form: {
        title: "Components Configuration",
        description: "Configure components parameters",
      },
      response: {
        title: "Response",
        description: "Components response data",
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
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  emailSending: {
    email: {
      defaultSenderName: "System",
      errors: {
        sending_failed: "Failed to send email to {{recipient}}",
      },
    },
  },
  emailHandling: {
    email: {
      errors: {
        rendering_failed: "Failed to render email template",
        send_failed: "Failed to send email",
        email_failed_subject: "Email Failed",
        unknown_recipient: "Unknown recipient",
        unknown_sender: "System",
        email_render_exception: "Email rendering exception occurred",
        batch_send_failed: "Batch email send failed",
      },
    },
  },
  sending: {
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for SMTP sending operations",
      },
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
      signupNurture: "Signup Nurture",
      retention: "Retention",
      winback: "Winback",
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
