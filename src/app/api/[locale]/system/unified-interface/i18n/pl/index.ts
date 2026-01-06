import { translations as cliTranslations } from "../../cli/i18n/pl";
import { translations as mcpTranslations } from "../../mcp/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  cli: cliTranslations,
  mcp: mcpTranslations,
  shared: {
    permissions: {
      publicUsersCannotAccess:
        "Użytkownicy publiczni nie mogą uzyskać dostępu do tego uwierzytelnionego punktu końcowego",
      insufficientPermissions: "Niewystarczające uprawnienia do dostępu do tego punktu końcowego",
      errors: {
        platformAccessDenied: "Odmowa dostępu dla platformy {{platform}}: {{reason}}",
        insufficientRoles:
          "Niewystarczające role. Użytkownik ma: {{userRoles}}. Wymagane: {{requiredRoles}}",
        definitionError: "Błąd definicji punktu końcowego: {{error}}",
      },
    },
    endpoints: {
      definition: {
        loader: {
          errors: {
            endpointNotFound: "Punkt końcowy '{{identifier}}' nie został znaleziony",
            loadFailed: "Nie udało się załadować punktu końcowego '{{identifier}}': {{error}}",
            batchLoadFailed:
              "Ładowanie wsadowe nie powiodło się: {{failedCount}} z {{totalCount}} punktów końcowych nie powiodło się",
          },
        },
      },
    },
  },
  widgets: {
    chart: {
      noDataAvailable: "Brak dostępnych danych",
      noDataToDisplay: "Brak danych do wyświetlenia",
    },
  },
};
