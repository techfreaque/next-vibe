import { translations as campaignStarterConfigTranslations } from "../../campaign-starter-config/i18n/en";

export const translations = {
  category: "Campaign Management",

  campaignStarterConfig: campaignStarterConfigTranslations,
  tag: "Campaign Starter",
  task: {
    description:
      "Start campaigns for new leads by transitioning them to PENDING status",
  },
  post: {
    title: "Campaign Starter",
    description: "Start campaigns for new leads",
    container: {
      title: "Campaign Starter Configuration",
      description: "Configure campaign starter parameters",
    },
    fields: {
      dryRun: {
        label: "Dry Run",
        description: "Run without making changes",
      },
    },
    response: {
      leadsProcessed: "Leads Processed",
      leadsStarted: "Leads Started",
      leadsSkipped: "Leads Skipped",
      executionTimeMs: "Execution Time (ms)",
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
      server: {
        title: "Server Error",
        description:
          "An error occurred while processing the campaign starter request",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
    },
    success: {
      title: "Campaign Starter Completed",
      description: "Campaign starter ran successfully",
    },
  },
  errors: {
    server: {
      title: "Server Error",
      description:
        "An error occurred while processing the campaign starter request",
    },
  },
};
