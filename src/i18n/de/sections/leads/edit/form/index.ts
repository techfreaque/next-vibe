import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/leads/edit/form";
import { actionsTranslations } from "./actions";
import { additionalInfoTranslations } from "./additionalInfo";
import { businessInfoTranslations } from "./businessInfo";
import { contactInfoTranslations } from "./contactInfo";
import { fieldsTranslations } from "./fields";
import { locationStatusTranslations } from "./locationStatus";

export const formTranslations: typeof EnglishFormTranslations = {
  actions: actionsTranslations,
  additionalInfo: additionalInfoTranslations,
  businessInfo: businessInfoTranslations,
  contactInfo: contactInfoTranslations,
  fields: fieldsTranslations,
  locationStatus: locationStatusTranslations,
  title: "Lead-Informationen",
  description: "Kontakt- und Geschäftsinformationen des Leads aktualisieren",
  leadId: "ID",
};
