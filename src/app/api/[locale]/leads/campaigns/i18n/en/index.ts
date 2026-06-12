export const translations = {
  category: "Campaign Management",
  tags: {
    campaigns: "Campaigns",
    management: "Management",
  },
  campaignStarter: {
    category: "Campaign Management",
    tag: "Campaign Starter",
    task: {
      description:
        "Start campaigns for new leads by transitioning them to PENDING status",
    },
    errors: {
      server: {
        title: "Server Error",
        description:
          "An error occurred while processing the campaign starter request",
      },
      invalidTransition: "Invalid status transition for campaign start",
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    post: {
      title: "Campaign Starter",
      description: "Start campaigns for new leads",
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access forbidden" },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "An error occurred while starting campaigns",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        notFound: { title: "Not Found", description: "Resource not found" },
        conflict: { title: "Conflict", description: "Data conflict occurred" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      fields: {
        timezone: {
          label: "Timezone",
          description: "Browser timezone for hour conversion",
        },
        dryRun: {
          label: "Dry Run",
          description: "Run without making changes",
        },
        force: {
          label: "Force",
          description: "Bypass day/hour schedule restrictions",
        },
      },
      response: {
        leadsProcessed: "Leads Processed",
        leadsStarted: "Leads Started",
        leadsSkipped: "Leads Skipped",
        executionTimeMs: "Execution Time (ms)",
        errors: "Errors",
        quotaDetails: "Quota Details",
      },
      success: {
        title: "Campaign Starter Completed",
        description: "Campaign starter ran successfully",
      },
    },
    get: {
      title: "Get Campaign Starter Config",
      description: "Retrieve campaign starter configuration",
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access forbidden" },
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
        notFound: { title: "Not Found", description: "Resource not found" },
        conflict: { title: "Conflict", description: "Data conflict occurred" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      fields: {
        timezone: {
          label: "Timezone",
          description: "Browser timezone for hour conversion",
        },
      },
      response: {
        dryRun: "Dry Run Mode",
        minAgeHours: "Minimum Age Hours",
        enabledDays: "Enabled Days",
        enabledHours: "Enabled Hours",
        localeConfig: "Locale Configuration",
        leadsPerWeek: "Leads Per Week",
        schedule: "Schedule",
        enabled: "Enabled",
        priority: "Priority",
        timeout: "Timeout",
        retries: "Retries",
        retryDelay: "Retry Delay",
      },
      success: {
        title: "Config Retrieved Successfully",
        description: "Campaign starter configuration retrieved successfully",
      },
    },
    put: {
      title: "Campaign Starter Config",
      description: "Update campaign starter configuration",
      dryRun: {
        label: "Dry Run Mode",
        description: "Enable dry run mode for testing",
      },
      minAgeHours: {
        label: "Minimum Age Hours",
        description: "Minimum age in hours before processing leads",
      },
      enabledDays: {
        label: "Enabled Days",
        description: "Days of the week when campaigns are enabled",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
      },
      enabledHours: {
        label: "Enabled Hours",
        description: "Hours of the day when campaigns are enabled",
        start: {
          label: "Start Hour",
          description: "Hour of the day when campaigns start (0-23)",
        },
        end: {
          label: "End Hour",
          description: "Hour of the day when campaigns end (0-23)",
        },
      },
      localeConfig: {
        label: "Locale Configuration",
        description:
          "Per-locale settings: leads per week, active days, and active hours",
      },
      leadsPerWeek: {
        label: "Leads Per Week",
        description: "Maximum number of leads to process per week",
      },
      schedule: {
        label: "Schedule",
        description: "Campaign execution schedule",
      },
      enabled: {
        label: "Enabled",
        description: "Enable or disable the campaign starter",
      },
      priority: {
        label: "Priority",
        description: "Priority level for campaign execution",
      },
      timeout: {
        label: "Timeout",
        description: "Timeout value in milliseconds",
      },
      retries: {
        label: "Retries",
        description: "Number of retry attempts",
      },
      retryDelay: {
        label: "Retry Delay",
        description: "Delay between retry attempts in milliseconds",
      },
      success: {
        title: "Config Saved",
        description: "Campaign starter configuration saved successfully",
      },
    },
    priority: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      background: "Background",
      filter: {
        all: "All Priorities",
        highAndAbove: "High and Above",
        mediumAndAbove: "Medium and Above",
      },
    },
    widget: {
      title: "Campaign Starter",
      titleSaved: "Configuration Saved",
      description:
        "Start campaigns for new leads that are ready to be contacted.",
      saving: "Saving...",
      save: "Save Settings",
      addLocale: "+ Add locale",
      guidanceTitle: "Configure the Campaign Starter",
      guidanceDescription:
        "Set the schedule, active days/hours, leads-per-week targets, and cron task settings.",
      runButton: "Start Campaigns",
      running: "Running...",
      done: "Done",
      perRunBudget:
        "~{{perRunBudget}} leads/run · {{totalRunsPerWeek}} runs/week",
      perRunBudgetFractional:
        "{{exactBudget}}/run · {{totalRunsPerWeek}} runs/week (fractional - accumulates across runs)",
      perRunBudgetZeroHint:
        "— increase leads/week or reduce schedule frequency",
      sections: {
        general: "General",
        generalDescription:
          "Master controls for enabling the campaign starter and dry run mode.",
        schedule: "Schedule",
        scheduleDescription:
          "When should campaigns run? Set the cron schedule, active days, and hours.",
        hoursTimezoneNote:
          "Hours in your browser timezone ({{offset}}). Stored as UTC on the server.",
        quotas: "Quotas",
        quotasDescription:
          "How many leads to process per week, broken down by locale.",
        advanced: "Advanced",
        advancedDescription:
          "Task execution settings like priority, timeouts, and retry behavior.",
      },
      days: {
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        sun: "Sun",
      },
    },
  },
  emailCampaigns: {
    category: "Campaign Management",
    tag: "Email Campaigns",
    task: {
      description:
        "Send automated email campaigns to leads based on their stage and timing",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
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
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    post: {
      title: "Email Campaigns",
      description: "Process email campaigns for leads",
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access forbidden" },
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
        notFound: { title: "Not Found", description: "Resource not found" },
        conflict: { title: "Conflict", description: "Data conflict occurred" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      fields: {
        batchSize: {
          label: "Batch Size",
          description: "Number of leads to process per batch",
        },
        maxEmailsPerRun: {
          label: "Max Emails Per Run",
          description: "Maximum number of emails to send per run",
        },
        dryRun: {
          label: "Dry Run",
          description: "Run without sending emails",
        },
      },
      response: {
        emailsScheduled: "Emails Scheduled",
        emailsSent: "Emails Sent",
        emailsFailed: "Emails Failed",
        leadsProcessed: "Leads Processed",
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
    get: {
      title: "Get Email Campaigns Config",
      description: "Retrieve email campaigns background task configuration",
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: { title: "Forbidden", description: "Access forbidden" },
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
        notFound: { title: "Not Found", description: "Resource not found" },
        conflict: { title: "Conflict", description: "Data conflict occurred" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      response: {
        enabled: "Enabled",
        dryRun: "Dry Run Mode",
        batchSize: "Batch Size",
        maxEmailsPerRun: "Max Emails Per Run",
        schedule: "Schedule",
        priority: "Priority",
        timeout: "Timeout",
        retries: "Retries",
        retryDelay: "Retry Delay",
      },
      success: {
        title: "Config Retrieved Successfully",
        description: "Email campaigns configuration retrieved successfully",
      },
    },
    put: {
      title: "Email Campaigns Config",
      description: "Update email campaigns background task configuration",
      enabled: {
        label: "Enabled",
        description: "Enable or disable the email campaigns background task",
      },
      dryRun: {
        label: "Dry Run Mode",
        description: "Process emails without actually sending them",
      },
      batchSize: {
        label: "Batch Size",
        description: "Number of leads to process per batch (1–100)",
      },
      maxEmailsPerRun: {
        label: "Max Emails Per Run",
        description:
          "Maximum number of emails to send per background run (1–1000)",
      },
      schedule: {
        label: "Schedule",
        description: "Cron expression for when to run email campaigns",
      },
      priority: {
        label: "Priority",
        description: "Priority level for task execution",
      },
      timeout: {
        label: "Timeout (ms)",
        description: "Maximum execution time in milliseconds",
      },
      retries: {
        label: "Retries",
        description: "Number of retry attempts on failure",
      },
      retryDelay: {
        label: "Retry Delay (ms)",
        description: "Delay between retry attempts in milliseconds",
      },
      success: {
        title: "Config Saved",
        description: "Email campaigns configuration saved successfully",
      },
    },
    priority: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      background: "Background",
    },
    widget: {
      title: "Email Campaigns Configuration",
      titleSaved: "Configuration Saved",
      saving: "Saving...",
      save: "Save Settings",
      guidanceTitle: "Configure Email Campaigns Background Task",
      guidanceDescription:
        "Enable or disable the email campaigns cron task and configure its schedule, batch size, and execution settings.",
      runButton: "Run Now",
      running: "Running...",
      done: "Done",
      sections: {
        general: "General",
        generalDescription:
          "Master controls for enabling the email campaigns task and dry run mode.",
        schedule: "Schedule",
        scheduleDescription: "Set the cron schedule for when emails are sent.",
        processing: "Processing",
        processingDescription:
          "Configure how many leads and emails to process per run.",
        advanced: "Advanced",
        advancedDescription:
          "Task execution settings like priority, timeouts, and retry behavior.",
      },
    },
  },
  emails: {
    common: {
      logoPart1: "Next",
      logoPart2: "Vibe",
    },
    email: {
      template: {
        tagline: "Build better products faster",
      },
    },
    emailJourneys: {
      components: {
        footer: {
          copyright: "© 2024 {{appName}}. All rights reserved.",
          helpText:
            "If you have any questions, please contact us at {{config.emails.support}}",
          unsubscribeText: "Don't want to receive these emails?",
          unsubscribeLink: "Unsubscribe",
        },
        socialProof: {
          quotePrefix: "201C",
          quoteSuffix: "201D",
          attribution: "— Customer Name, Company",
        },
      },
    },
    journeys: {
      emailJourneys: {
        components: {
          defaults: {
            signatureName: "A fellow unbottled.ai user",
            previewLeadId: "preview-lead-id",
            previewEmail: "preview@example.com",
            previewBusinessName: "Acme Corp",
            previewContactName: "Preview User",
            previewPhone: "+1234567890",
            previewCampaignId: "preview-campaign-id",
          },
          footer: {
            unsubscribeText: "You're receiving this because you opted in.",
            unsubscribeLink: "Unsubscribe",
          },
          journeyInfo: {
            uncensoredConvert: {
              name: "Uncensored Convert",
              description:
                "An enthusiast sharing their discovery of unbottled.ai",
              longDescription:
                "Enthusiast persona sharing a genuine discovery with affiliate transparency",
              characteristics: {
                tone: "Casual, conspiratorial tone",
                story: "Genuine personal story",
                transparency: "Affiliate transparency",
                angle: "Anti-censorship angle",
                energy: "Enthusiast energy",
              },
            },
            sideHustle: {
              name: "Side Hustle",
              description: "A transparent affiliate sharing real use cases",
              longDescription:
                "Transparent affiliate marketer sharing real weekly use cases",
              characteristics: {
                disclosure: "Full affiliate disclosure upfront",
                updates: "Weekly use-case updates",
                income: "Passive income story",
                proof: "Practical proof, not hype",
                energy: "Honest hustle energy",
              },
            },
            quietRecommendation: {
              name: "Quiet Recommendation",
              description: "A low-key professional passing along a tested tool",
              longDescription:
                "Low-key professional passing along a tool tested for weeks",
              characteristics: {
                signal: "Short, high signal-to-noise",
                specifics: "No hype, just specifics",
                testing: "3-week testing backstory",
                comparison: "Honest comparison to ChatGPT",
                affiliate: "Minimal affiliate mention",
              },
            },
            signupNurture: {
              name: "Signup Nurture",
              description: "Onboarding sequence for newly signed-up users",
              longDescription:
                "Welcome and onboarding emails helping new users get started with the platform",
            },
            retention: {
              name: "Retention",
              description: "Re-engagement for existing subscribers",
              longDescription:
                "Value-driven emails to keep active subscribers engaged and exploring features",
            },
            winback: {
              name: "Winback",
              description: "Win back inactive or churned users",
              longDescription:
                "Re-activation campaign targeting users who have gone quiet or cancelled",
            },
            newsletterMay2026: {
              name: "Newsletter May 2026",
              description:
                "One-off newsletter about Cortex, Dreamer, Autopilot, and media generation",
              longDescription:
                "May 2026 product update newsletter sent to all signed-up users with honest bug admission and feature highlights",
            },
          },
        },
      },
    },
    services: {
      scheduler: {
        cancelledBySystem: "Cancelled by system",
      },
      abTesting: {
        invalidWeights: "Total variant weights must equal 100%",
        negativeWeight: "Variant weight must be positive",
      },
      post: {
        title: "Services",
        description: "Services endpoint",
        form: {
          title: "Services Configuration",
          description: "Configure services parameters",
        },
        response: {
          title: "Response",
          description: "Services response data",
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
    testMail: {
      category: "Leads",
      tags: {
        campaigns: "Campaigns",
        leads: "Leads",
      },
      post: {
        title: "Test Mail",
        description: "Send test email with custom lead data",
        form: {
          title: "Test Mail Configuration",
          description: "Configure test mail parameters and lead data",
        },
        campaignType: {
          label: "Campaign Type",
          description: "Type of email campaign",
          placeholder: "Enter campaign type",
        },
        emailJourneyVariant: {
          label: "Email Journey Variant",
          description: "A/B test variant for email journey",
          placeholder: "Select journey variant",
        },
        emailCampaignStage: {
          label: "Email Campaign Stage",
          description: "Current stage in the email campaign",
          placeholder: "Select campaign stage",
        },
        testEmail: {
          label: "Test Email Address",
          description: "Email address to send test mail to",
          placeholder: "test@example.com",
        },
        leadData: {
          title: "Lead Data",
          description: "Lead information for template rendering",
          businessName: {
            label: "Business Name",
            description: "Name of the business",
            placeholder: "Acme Corporation",
          },
          contactName: {
            label: "Contact Name",
            description: "Name of the contact person",
            placeholder: "John Doe",
          },
          website: {
            label: "Website",
            description: "Company website URL",
            placeholder: "https://example.com",
          },
          country: {
            label: "Country",
            description: "Country code",
            placeholder: "GLOBAL",
          },
          language: {
            label: "Language",
            description: "Preferred language code",
            placeholder: "en",
          },
          status: {
            label: "Status",
            description: "Lead status",
            placeholder: "NEW",
          },
          source: {
            label: "Source",
            description: "Lead source",
            placeholder: "WEBSITE",
          },
          notes: {
            label: "Notes",
            description: "Additional notes about the lead",
            placeholder: "Enter any additional notes",
          },
        },
        response: {
          title: "Test Email Result",
          description: "Result of sending test email",
          success: {
            content: "Success",
          },
          messageId: {
            content: "Message ID",
          },
          testEmail: {
            content: "Test Email",
          },
          subject: {
            content: "Email Subject",
          },
          sentAt: {
            content: "Sent At",
          },
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
            description: "There are unsaved changes",
          },
          conflict: {
            title: "Conflict",
            description: "Data conflict occurred",
          },
          templateNotFound: {
            title: "Template Not Found",
            description: "Email template not found for specified parameters",
          },
          sendingFailed: {
            title: "Sending Failed",
            description: "Failed to send test email",
          },
        },
        success: {
          title: "Success",
          description: "Test email sent successfully",
        },
        selectionCriteria: "SMTP Selection Criteria",
        widget: {
          title: "Send Test Email",
          send: "Send Test Email",
          sending: "Sending...",
          successMessage: "Test email sent successfully",
          sentTo: "Sent to: ",
          subject: "Subject: ",
          sentAt: "Sent at: ",
          campaignConfig: "Campaign Config",
          sendAnother: "Send Another",
        },
      },
    },
  },
};
