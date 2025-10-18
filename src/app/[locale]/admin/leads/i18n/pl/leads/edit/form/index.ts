import type { translations as enTranslations } from "../../../../en/leads/edit/form";
import { translations as actionsTranslations } from "./actions";
import { translations as additionalInfoTranslations } from "./additionalInfo";
import { translations as businessInfoTranslations } from "./businessInfo";
import { translations as contactInfoTranslations } from "./contactInfo";
import { translations as fieldsTranslations } from "./fields";
import { translations as locationStatusTranslations } from "./locationStatus";

export const translations: typeof enTranslations = {
  actions: actionsTranslations,
  additionalInfo: additionalInfoTranslations,
  businessInfo: businessInfoTranslations,
  contactInfo: contactInfoTranslations,
  fields: fieldsTranslations,
  locationStatus: locationStatusTranslations,
  title: "Informacje o Lead",
  description: "Zaktualizuj kontakt i informacje biznesowe lead",
  leadId: "ID",
};
