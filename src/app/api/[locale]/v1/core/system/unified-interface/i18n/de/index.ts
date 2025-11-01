import { translations as aiTranslations } from "../../ai/i18n/de";
import { translations as cliTranslations } from "../../cli/i18n/de";
import { translations as mcpTranslations } from "../../mcp/i18n/de";
import { translations as reactTranslations } from "../../react/i18n/de";
import { translations as reactNativeTranslations } from "../../react-native/i18n/de";
import { translations as tasksTranslations } from "../../tasks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  ai: aiTranslations,
  cli: cliTranslations,
  mcp: mcpTranslations,
  react: reactTranslations,
  reactNative: reactNativeTranslations,
  tasks: tasksTranslations,
  shared: {
    permissions: {
      publicUsersCannotAccess:
        "Öffentliche Benutzer können nicht auf diesen authentifizierten Endpunkt zugreifen",
      insufficientPermissions:
        "Unzureichende Berechtigungen für den Zugriff auf diesen Endpunkt",
    },
  },
};
