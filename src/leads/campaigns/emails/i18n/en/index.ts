export const translations = {
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
};
