import type { adminTranslations as EnglishAdminTranslations } from "../../../../en/sections/users/admin";
import { actionsTranslations } from "./actions";
import { filtersTranslations } from "./filters";
import { formattingTranslations } from "./formatting";
import { navigationTranslations } from "./navigation";
import { overviewTranslations } from "./overview";
import { quickActionsTranslations } from "./quickActions";
import { roleTranslations } from "./role";
import { statsTranslations } from "./stats";
import { statusTranslations } from "./status";
import { tableTranslations } from "./table";
import { tabsTranslations } from "./tabs";

export const adminTranslations: typeof EnglishAdminTranslations = {
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
