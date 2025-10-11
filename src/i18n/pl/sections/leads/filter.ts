import type { filterTranslations as EnglishFilterTranslations } from "../../../en/sections/leads/filter";

export const filterTranslations: typeof EnglishFilterTranslations = {
  status: "Filtruj według statusu",
  campaign_stage: "Filtruj według etapu kampanii",
  country: "Filtruj według kraju",
  language: "Filtruj według języka",
  source: "Filtruj według źródła",
  all_statuses: "Wszystkie statusy",
  all_countries: "Wszystkie kraje",
  all_languages: "Wszystkie języki",
  all_sources: "Wszystkie źródła",
  sort: "Sortuj według",
  page_size: "Rozmiar strony",
  countries: {
    global: "Globalny",
    de: "Niemcy",
    pl: "Polska",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
  },
  sources: {
    website: "Strona internetowa",
    social_media: "Media społecznościowe",
    email_campaign: "Kampania e-mailowa",
    referral: "Polecenie",
    csv_import: "Import CSV",
    api: "API",
  },
  quick_filters: "Szybkie Filtry",
  quick: {
    new_leads: "Nowe Leady",
    campaign_running: "Kampania w toku",
    not_started: "Nie Rozpoczęte",
    imported: "Importowane",
  },
};
