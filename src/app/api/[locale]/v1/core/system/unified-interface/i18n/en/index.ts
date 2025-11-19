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
      },
    },
  },
};
