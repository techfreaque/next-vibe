import { translations as builderTranslations } from "../../builder/i18n/pl";
import { translations as checkTranslations } from "../../check/i18n/pl";
import { translations as dbTranslations } from "../../db/i18n/pl";
import { translations as generatorsTranslations } from "../../generators/i18n/pl";
import { translations as guardTranslations } from "../../guard/i18n/pl";
import { translations as serverTranslations } from "../../server/i18n/pl";
import { translations as tasksTranslations } from "../../tasks/i18n/pl";
import { translations as translationsTranslations } from "../../translations/i18n/pl";
import { translations as unifiedUiTranslations } from "../../unified-ui/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  builder: builderTranslations,
  check: checkTranslations,
  cli: unifiedUiTranslations.cli, // Alias for CLI translations
  db: dbTranslations,
  generators: generatorsTranslations,
  guard: guardTranslations,
  server: serverTranslations,
  tasks: tasksTranslations,
  translations: translationsTranslations,
  unifiedUi: unifiedUiTranslations,
};
