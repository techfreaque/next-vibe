import { translations as createTranslations } from "../../create/i18n/en";
import { translations as listTranslations } from "../../list/i18n/en";
import { translations as statsTranslations } from "../../stats/i18n/en";
import { translations as userTranslations } from "../../user/i18n/en";
import { translations as viewTranslations } from "../../view/i18n/en";

export const translations = {
  category: "Users",
  tags: {
    create: "Create",
    admin: "Admin",
    user: "User",
    view: "View",
    stats: "Statistics",
  },
  create: createTranslations,
  list: listTranslations,
  stats: statsTranslations,
  user: userTranslations,
  view: viewTranslations,
};
