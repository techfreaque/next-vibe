import type { adminTranslations as EnglishAdminTranslations } from "../../../../en/sections/emails/admin";
import { actionsTranslations } from "./actions";
import { detailsTranslations } from "./details";
import { errorsTranslations } from "./errors";
import { filtersTranslations } from "./filters";
import { journeyVariantsTranslations } from "./journeyVariants";
import { messagesTranslations } from "./messages";
import { sortTranslations } from "./sort";
import { stagesTranslations } from "./stages";
import { statsTranslations } from "./stats";
import { statusTranslations } from "./status";
import { tableTranslations } from "./table";
import { typeTranslations } from "./type";

export const adminTranslations: typeof EnglishAdminTranslations = {
  actions: actionsTranslations,
  details: detailsTranslations,
  errors: errorsTranslations,
  filters: filtersTranslations,
  journeyVariants: journeyVariantsTranslations,
  messages: messagesTranslations,
  sort: sortTranslations,
  stages: stagesTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  table: tableTranslations,
  type: typeTranslations,
  title: "Zarządzanie E-mailami",
  description:
    "Monitoruj kampanie e-mailowe, śledź wydajność i analizuj zaangażowanie",
};
