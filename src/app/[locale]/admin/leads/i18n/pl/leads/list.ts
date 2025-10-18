import type { translations as EnglishListTranslations } from "../../en/leads/list";

export const translations: typeof EnglishListTranslations = {
  title: "Lista Leadów",
  titleWithCount: "Lista Leadów ({{count}})",
  description:
    "Przeglądaj i zarządzaj wszystkimi leadami z zaawansowanymi opcjami filtrowania i sortowania",
  loading: "Ładowanie...",
  no_results: "Nie znaleziono leadów spełniających Twoje kryteria",
  noResults: "Nie znaleziono leadów spełniających Twoje kryteria",
  results: {
    showing: "Pokazuje {{start}}-{{end}} z {{total}} leadów",
  },
  table: {
    title: "Wszystkie Leady",
    campaign_stage: "Etap Kampanii",
    contact: "Kontakt",
  },
  filters: {
    title: "Filtry",
  },
};
