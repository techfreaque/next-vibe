import { translations as builderTranslations } from "../../builder/i18n/de";
import { translations as checkTranslations } from "../../check/i18n/de";
import { translations as generatorsTranslations } from "../../generators/i18n/de";
import { translations as helpTranslations } from "../../help/i18n/de";
import { translations as releaseToolTranslations } from "../../release-tool/i18n/de";
import { translations as unifiedInterfaceTranslations } from "../../unified-interface/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  builder: builderTranslations,
  check: checkTranslations,

  dev: {
    category: "Entwicklung",
    typecheck: {
      title: "Typprüfung überspringen",
      description: "TypeScript-Typprüfung überspringen",
      success: {
        title: "Typprüfung bestanden",
        description: "TypeScript-Typprüfung erfolgreich abgeschlossen",
      },
    },
    lint: {
      container: {
        title: "Generator-Optionen",
      },
    },
  },
  generators: generatorsTranslations,
  help: helpTranslations,
  sideTasks: {
    category: "Nebenaufgaben",
    generators: {
      generateTrpcRouter: {
        title: "tRPC-Router generieren",
        description: "tRPC-Router aus API-Endpunkten generieren",
        tag: "tRPC",
        container: {
          title: "tRPC-Router-Generierung",
          description: "tRPC-Router-Konfiguration generieren",
        },
        errors: {
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige tRPC-Router-Generierungsparameter",
          },
          internal: {
            title: "Interner Fehler",
            description: "Bei der tRPC-Router-Generierung ist ein Fehler aufgetreten",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Sie haben keine Berechtigung, tRPC-Router zu generieren",
          },
        },
        success: {
          title: "tRPC-Router generiert",
          description: "tRPC-Router wurde erfolgreich generiert",
        },
      },
    },
  },

  releaseTool: releaseToolTranslations,

  unifiedInterface: unifiedInterfaceTranslations,
};
