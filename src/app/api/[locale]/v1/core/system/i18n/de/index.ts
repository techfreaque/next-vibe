import { translations as builderTranslations } from "../../builder/i18n/de";
import { translations as checkTranslations } from "../../check/i18n/de";
import { translations as dbTranslations } from "../../db/i18n/de";
import { translations as generatorsTranslations } from "../../generators/i18n/de";
import { translations as guardTranslations } from "../../guard/i18n/de";
import { translations as launchpadTranslations } from "../../launchpad/i18n/de";
import { translations as releaseToolTranslations } from "../../release-tool/i18n/de";
import { translations as serverTranslations } from "../../server/i18n/de";
import { translations as tasksTranslations } from "../../tasks/i18n/de";
import { translations as translationsTranslations } from "../../translations/i18n/de";
import { translations as unifiedUiTranslations } from "../../unified-ui/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  builder: builderTranslations,
  check: checkTranslations,
  cli: unifiedUiTranslations.cli, // Alias for CLI translations
  db: dbTranslations,
  generators: generatorsTranslations,
  guard: guardTranslations,
  launchpad: launchpadTranslations,
  releaseTool: releaseToolTranslations,
  server: serverTranslations,
  tasks: tasksTranslations,
  translations: translationsTranslations,
  unifiedUi: unifiedUiTranslations,
};
