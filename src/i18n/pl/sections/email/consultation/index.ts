import type { consultationTranslations as EnglishConsultationTranslations } from "../../../../en/sections/email/consultation";
import { adminTranslations } from "./admin";
import { cancelledTranslations } from "./cancelled";
import { confirmationTranslations } from "./confirmation";
import { scheduledTranslations } from "./scheduled";
import { updatedTranslations } from "./updated";

export const consultationTranslations: typeof EnglishConsultationTranslations =
  {
    admin: adminTranslations,
    cancelled: cancelledTranslations,
    confirmation: confirmationTranslations,
    scheduled: scheduledTranslations,
    updated: updatedTranslations,
  };
