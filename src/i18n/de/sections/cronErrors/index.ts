import type { cronErrorsTranslations as EnglishCronErrorsTranslations } from "../../../en/sections/cronErrors";
import { adminTranslations } from "./admin";
import { createTranslations } from "./create";
import { errorsTranslations } from "./errors";
import { historyTranslations } from "./history";
import { listTranslations } from "./list";
import { pulseTranslations } from "./pulse";
import { statsTranslations } from "./stats";
import { statusTranslations } from "./status";
import { taskTranslations } from "./task";

export const translations: typeof EnglishCronErrorsTranslations = {
  admin: adminTranslations,
  create: createTranslations,
  errors: errorsTranslations,
  history: historyTranslations,
  list: listTranslations,
  pulse: pulseTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  task: taskTranslations,
};
