import type { sourcesTranslations as EnglishSourcesTranslations } from "../../../../../en/sections/leads/admin/stats/sources";

export const sourcesTranslations: typeof EnglishSourcesTranslations = {
  website: "Website",
  social_media: "Soziale Medien",
  email_campaign: "E-Mail-Kampagne",
  referral: "Empfehlung",
  csv_import: "CSV-Import",
  api: "API",
  unknown: "Unbekannt",
  legend: {
    title: "Quellen-Legende",
    visible: "sichtbar",
    leads: "{{count}} Lead_one ({{percentage}}%)",
    leads_one: "{{count}} Lead ({{percentage}}%)",
    leads_other: "{{count}} Leads ({{percentage}}%)",
    summary: "{{visible}} von {{total}} Quellen sichtbar ({{percentage}}%)",
  },
};
