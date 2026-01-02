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
      insufficientPermissions: "Unzureichende Berechtigungen für den Zugriff auf diesen Endpunkt",
      errors: {
        platformAccessDenied: "Zugriff verweigert für {{platform}} Plattform: {{reason}}",
        insufficientRoles:
          "Unzureichende Rollen. Benutzer hat: {{userRoles}}. Erforderlich: {{requiredRoles}}",
        definitionError: "Endpunkt-Definitionsfehler: {{error}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Endpunkt '{{identifier}}' nicht gefunden",
            loadFailed: "Fehler beim Laden des Endpunkts '{{identifier}}': {{error}}",
            batchLoadFailed:
              "Batch-Laden fehlgeschlagen: {{failedCount}} von {{totalCount}} Endpunkten fehlgeschlagen",
          },
        },
      },
    },
  },
  widgets: {
    chart: {
      noDataAvailable: "Keine Daten verfügbar",
      noDataToDisplay: "Keine Daten zum Anzeigen",
    },
  },
};
