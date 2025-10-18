import type { translations as enTranslations } from "../../../en/users/admin";
import { translations as actionsTranslations } from "./actions";
import { translations as filtersTranslations } from "./filters";
import { translations as formattingTranslations } from "./formatting";
import { translations as navigationTranslations } from "./navigation";
import { translations as overviewTranslations } from "./overview";
import { translations as quickActionsTranslations } from "./quickActions";
import { translations as roleTranslations } from "./role";
import { translations as statsTranslations } from "./stats";
import { translations as statusTranslations } from "./status";
import { translations as tableTranslations } from "./table";
import { translations as tabsTranslations } from "./tabs";

export const translations: typeof enTranslations = {
  actions: actionsTranslations,
  filters: filtersTranslations,
  formatting: formattingTranslations,
  navigation: navigationTranslations,
  overview: overviewTranslations,
  quickActions: quickActionsTranslations,
  role: roleTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  table: tableTranslations,
  tabs: tabsTranslations,
  title: "Zarządzanie użytkownikami",
  description: "Zarządzaj użytkownikami, rolami i ustawieniami kont",
};
