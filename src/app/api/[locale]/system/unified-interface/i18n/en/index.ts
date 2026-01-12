import { translations as cliTranslations } from "../../cli/i18n/en";
import { translations as mcpTranslations } from "../../mcp/i18n/en";

export const translations = {
  cli: cliTranslations,
  mcp: mcpTranslations,
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
    },
  },
};
