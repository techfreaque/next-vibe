import type { consultationErrorsTranslations as EnglishConsultationErrorsTranslations } from "../../../en/sections/consultationErrors";
import { availabilityTranslations } from "./availability";
import { createTranslations } from "./create";
import { listTranslations } from "./list";
import { scheduleTranslations } from "./schedule";
import { statusTranslations } from "./status";

export const translations: typeof EnglishConsultationErrorsTranslations = {
  availability: availabilityTranslations,
  create: createTranslations,
  list: listTranslations,
  schedule: scheduleTranslations,
  status: statusTranslations,
};
