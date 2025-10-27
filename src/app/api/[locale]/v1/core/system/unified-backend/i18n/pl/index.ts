import { translations as cliTranslations } from "../../cli/i18n/pl";
import { translations as tasksTranslations } from "../../tasks/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  cli: cliTranslations,
  tasks: tasksTranslations,
};
