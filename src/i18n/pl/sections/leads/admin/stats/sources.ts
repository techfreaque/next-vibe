import type { sourcesTranslations as EnglishSourcesTranslations } from "../../../../../en/sections/leads/admin/stats/sources";

export const sourcesTranslations: typeof EnglishSourcesTranslations = {
  website: "Strona internetowa",
  social_media: "Media społecznościowe",
  email_campaign: "Kampania e-mailowa",
  referral: "Polecenie",
  csv_import: "Import CSV",
  api: "API",
  unknown: "Nieznane",
  legend: {
    title: "Legenda źródeł",
    visible: "widoczne",
    leads: "{{count}} lead_one ({{percentage}}%)",
    leads_one: "{{count}} lead ({{percentage}}%)",
    leads_other: "{{count}} leadów ({{percentage}}%)",
    summary: "{{visible}} z {{total}} źródeł widocznych ({{percentage}}%)",
  },
};
