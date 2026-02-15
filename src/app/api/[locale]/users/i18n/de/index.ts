import { translations as createTranslations } from "../../create/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import { translations as viewTranslations } from "../../view/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  tags: {
    create: "Erstellen",
    admin: "Administrator",
    user: "Benutzer",
    view: "Anzeigen",
    stats: "Statistiken",
  },
  create: createTranslations,
  list: listTranslations,
  stats: statsTranslations,
  user: userTranslations,
  view: viewTranslations,
};
