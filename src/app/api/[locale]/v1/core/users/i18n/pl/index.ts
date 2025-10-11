import { translations as createTranslations } from "../../create/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import { translations as userTranslations } from "../../user/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Użytkownicy",
  tags: {
    create: "Utwórz",
    admin: "Administrator",
  },
  create: createTranslations,
  list: listTranslations,
  stats: statsTranslations,
  user: userTranslations,
};
