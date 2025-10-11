import type { dashboardTranslations as EnglishDashboardTranslations } from "../../../../en/sections/admin/dashboard";
import { cronTranslations } from "./cron";
import { emailAnalyticsTranslations } from "./emailAnalytics";
import { leadsTranslations } from "./leads";
import { navigationTranslations } from "./navigation";
import { quickActionsTranslations } from "./quickActions";
import { recentActivityTranslations } from "./recentActivity";
import { smtpTranslations } from "./smtp";
import { statsTranslations } from "./stats";
import { systemPerformanceTranslations } from "./systemPerformance";

export const dashboardTranslations: typeof EnglishDashboardTranslations = {
  cron: cronTranslations,
  emailAnalytics: emailAnalyticsTranslations,
  leads: leadsTranslations,
  navigation: navigationTranslations,
  quickActions: quickActionsTranslations,
  recentActivity: recentActivityTranslations,
  smtp: smtpTranslations,
  stats: statsTranslations,
  systemPerformance: systemPerformanceTranslations,
  title: "Witaj w Panelu Administratora",
  subtitle: "Zarządzaj generowaniem leadów i kampaniami e-mail stąd.",
};
