import { translations as builderTranslations } from "../../builder/i18n/pl";
import { translations as checkTranslations } from "../../check/i18n/pl";
import { translations as dbTranslations } from "../../db/i18n/pl";
import { translations as generatorsTranslations } from "../../generators/i18n/pl";
import { translations as guardTranslations } from "../../guard/i18n/pl";
import { translations as helpTranslations } from "../../help/i18n/pl";
import { translations as launchpadTranslations } from "../../launchpad/i18n/pl";
import { translations as releaseToolTranslations } from "../../release-tool/i18n/pl";
import { translations as serverTranslations } from "../../server/i18n/pl";
import { translations as translationsTranslations } from "../../translations/i18n/pl";
import { translations as unifiedBackendTranslations } from "../../unified-backend/i18n/pl";
import { translations as unifiedUiTranslations } from "../../unified-ui/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  builder: builderTranslations,
  check: checkTranslations,
  db: dbTranslations,
  dev: {
    category: "Rozwój",
    typecheck: {
      title: "Pomiń sprawdzanie typów",
      description: "Pomiń sprawdzanie typów TypeScript",
      success: {
        title: "Sprawdzanie typów zakończone sukcesem",
        description: "Sprawdzanie typów TypeScript zakończone pomyślnie",
      },
    },
    lint: {
      container: {
        title: "Opcje generatora",
      },
    },
  },
  generators: generatorsTranslations,
  help: helpTranslations,
  sideTasks: {
    category: "Zadania poboczne",
    generators: {
      generateTrpcRouter: {
        title: "Generuj router tRPC",
        description: "Generuj router tRPC z punktów końcowych API",
        tag: "tRPC",
        container: {
          title: "Generowanie routera tRPC",
          description: "Generuj konfigurację routera tRPC",
        },
        errors: {
          validation: {
            title: "Błąd walidacji",
            description: "Nieprawidłowe parametry generowania routera tRPC",
          },
          internal: {
            title: "Błąd wewnętrzny",
            description: "Wystąpił błąd podczas generowania routera tRPC",
          },
          unauthorized: {
            title: "Brak autoryzacji",
            description: "Nie masz uprawnień do generowania routera tRPC",
          },
        },
        success: {
          title: "Router tRPC wygenerowany",
          description: "Router tRPC został pomyślnie wygenerowany",
        },
      },
    },
  },
  guard: guardTranslations,
  launchpad: launchpadTranslations,
  releaseTool: releaseToolTranslations,
  server: serverTranslations,
  translations: translationsTranslations,
  unifiedBackend: unifiedBackendTranslations,
  unifiedUi: unifiedUiTranslations,
};
