import type { filterTranslations as EnglishFilterTranslations } from "../../../en/sections/leads/filter";

export const filterTranslations: typeof EnglishFilterTranslations = {
  status: "Nach Status filtern",
  campaign_stage: "Nach Kampagnen-Phase filtern",
  country: "Nach Land filtern",
  language: "Nach Sprache filtern",
  source: "Nach Quelle filtern",
  all_statuses: "Alle Status",
  all_countries: "Alle Länder",
  all_languages: "Alle Sprachen",
  all_sources: "Alle Quellen",
  sort: "Sortieren nach",
  page_size: "Seitengröße",
  countries: {
    global: "Global",
    de: "Deutschland",
    pl: "Polen",
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
  },
  sources: {
    website: "Website",
    social_media: "Social Media",
    email_campaign: "E-Mail-Kampagne",
    referral: "Empfehlung",
    csv_import: "CSV-Import",
    api: "API",
  },
  quick_filters: "Schnellfilter",
  quick: {
    new_leads: "Neue Leads",
    campaign_running: "Kampagne läuft",
    not_started: "Nicht Gestartet",
    imported: "Importiert",
  },
};
