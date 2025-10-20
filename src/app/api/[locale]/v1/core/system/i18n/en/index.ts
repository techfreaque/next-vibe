import { translations as builderTranslations } from "../../builder/i18n/en";
import { translations as checkTranslations } from "../../check/i18n/en";
import { translations as dbTranslations } from "../../db/i18n/en";
import { translations as generatorsTranslations } from "../../generators/i18n/en";
import { translations as guardTranslations } from "../../guard/i18n/en";
import { translations as launchpadTranslations } from "../../launchpad/i18n/en";
import { translations as serverTranslations } from "../../server/i18n/en";
import { translations as tasksTranslations } from "../../tasks/i18n/en";
import { translations as translationsTranslations } from "../../translations/i18n/en";
import { translations as unifiedUiTranslations } from "../../unified-ui/i18n/en";

export const translations = {
  builder: builderTranslations,
  check: checkTranslations,
  cli: unifiedUiTranslations.cli, // Alias for CLI translations
  db: dbTranslations,
  generators: generatorsTranslations,
  guard: guardTranslations,
  launchpad: launchpadTranslations,
  server: serverTranslations,
  tasks: tasksTranslations,
  translations: translationsTranslations,
  unifiedUi: unifiedUiTranslations,
};
