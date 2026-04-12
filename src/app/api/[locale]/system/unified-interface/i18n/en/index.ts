import { translations as aiTranslations } from "../../ai/i18n/en";
import { translations as cliTranslations } from "../../cli/i18n/en";
import { translations as mcpTranslations } from "../../mcp/i18n/en";
import { translations as reactTranslations } from "../../react/i18n/en";
import { translations as reactNativeTranslations } from "../../react-native/i18n/en";
import { translations as tasksTranslations } from "../../tasks/i18n/en";

export const translations = {
  ai: aiTranslations,
  cli: cliTranslations,
  mcp: mcpTranslations,
  react: reactTranslations,
  reactNative: reactNativeTranslations,
  tasks: tasksTranslations,
  endpointCategories: {
    ai: "AI",
    analytics: "Analytics",
    analyticsDataSources: "Analytics: Data Sources",
    analyticsEvaluators: "Analytics: Evaluators",
    analyticsIndicators: "Analytics: Indicators",
    analyticsTransformers: "Analytics: Transformers",
    browser: "Browser",
    browserDevTools: "Browser: DevTools",
    chatSkills: "Chat: Skills",
    chatFavorites: "Chat: Favorites",
    chatMemories: "Chat: Memories",
    chatMessages: "Chat: Messages",
    chatSettings: "Chat: Settings",
    chatThreads: "Chat: Threads",
    credits: "Credits",
    leads: "Leads",
    leadsCampaigns: "Leads: Campaigns",
    leadsImport: "Leads: Import",
    messenger: "Messenger",
    payments: "Payments",
    referral: "Referral",
    ssh: "SSH",
    system: "System",
    systemDatabase: "System: Database",
    systemDevTools: "System: Dev Tools",
    systemTasks: "System: Tasks",
    userAuth: "User Authentication",
    userManagement: "User Management",
  },
  shared: {
    permissions: {
      publicUsersCannotAccess:
        "Public users cannot access this authenticated endpoint",
      insufficientPermissions:
        "Insufficient permissions to access this endpoint",
      errors: {
        platformAccessDenied:
          "Access denied for {{platform}} platform: {{reason}}",
        insufficientRoles:
          "Insufficient roles. User has: {{userRoles}}. Required: {{requiredRoles}}",
        definitionError: "Endpoint definition error: {{error}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpoint '{{identifier}}' not found",
            loadFailed: "Failed to load endpoint '{{identifier}}': {{error}}",
            batchLoadFailed:
              "Batch load failed: {{failedCount}} of {{totalCount}} endpoints failed",
          },
        },
      },
    },
  },
  widgets: {
    chart: {
      noDataAvailable: "No data available",
      noDataToDisplay: "No data to display",
      total: "Total",
    },
    codeQualityList: {
      noIssues: "No issues found",
    },
    codeQualitySummary: {
      summary: "Summary",
      files: "Files",
      issues: "Issues",
      errors: "Errors",
      of: "of",
    },
    codeQualityFiles: {
      affectedFiles: "Affected Files",
    },
    formFields: {
      common: {
        required: "Required",
        enterPhoneNumber: "Enter phone number",
        selectDate: "Select date",
        unknownFieldType: "Unknown field type",
      },
      markdownTextarea: {
        edit: "Edit",
        preview: "Preview",
        toolbar: {
          bold: "Bold",
          italic: "Italic",
          strike: "Strikethrough",
          link: "Link",
          linkPrompt: "Enter URL:",
          heading1: "Heading 1",
          heading2: "Heading 2",
          heading3: "Heading 3",
          bulletList: "Bullet list",
          orderedList: "Numbered list",
          blockquote: "Quote",
          code: "Inline code",
          horizontalRule: "Divider",
        },
      },
    },
    rangeSlider: {
      min: "Min",
      max: "Max",
    },
  },
};
