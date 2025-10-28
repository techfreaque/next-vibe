import { translations as builderTranslations } from "../../builder/i18n/en";
import { translations as checkTranslations } from "../../check/i18n/en";
import { translations as dbTranslations } from "../../db/i18n/en";
import { translations as generatorsTranslations } from "../../generators/i18n/en";
import { translations as guardTranslations } from "../../guard/i18n/en";
import { translations as helpTranslations } from "../../help/i18n/en";
import { translations as launchpadTranslations } from "../../launchpad/i18n/en";
import { translations as releaseToolTranslations } from "../../release-tool/i18n/en";
import { translations as serverTranslations } from "../../server/i18n/en";
import { translations as translationsTranslations } from "../../translations/i18n/en";
import { translations as unifiedBackendTranslations } from "../../unified-backend/i18n/en";
import { translations as unifiedUiTranslations } from "../../unified-ui/i18n/en";

export const translations = {
  builder: builderTranslations,
  check: checkTranslations,
  db: dbTranslations,
  dev: {
    category: "Development",
    typecheck: {
      title: "Skip Type Check",
      description: "Skip TypeScript type checking",
      success: {
        title: "Type Check Passed",
        description: "TypeScript type checking completed successfully",
      },
    },
    lint: {
      container: {
        title: "Generator Options",
      },
    },
  },
  generators: generatorsTranslations,
  help: helpTranslations,
  sideTasks: {
    category: "Side Tasks",
    generators: {
      generateTrpcRouter: {
        title: "Generate tRPC Router",
        description: "Generate tRPC router from API endpoints",
        tag: "tRPC",
        container: {
          title: "tRPC Router Generation",
          description: "Generate tRPC router configuration",
        },
        errors: {
          validation: {
            title: "Validation Error",
            description: "Invalid tRPC router generation parameters",
          },
          internal: {
            title: "Internal Error",
            description: "An error occurred during tRPC router generation",
          },
          unauthorized: {
            title: "Unauthorized",
            description: "You don't have permission to generate tRPC router",
          },
        },
        success: {
          title: "tRPC Router Generated",
          description: "tRPC router has been generated successfully",
        },
      },
    },
  },
  guard: guardTranslations,
  launchpad: launchpadTranslations,
  releaseTool: releaseToolTranslations,
  server: serverTranslations,
  translations: translationsTranslations,
  unifiedUi: unifiedUiTranslations,
  unifiedBackend: unifiedBackendTranslations,
};
