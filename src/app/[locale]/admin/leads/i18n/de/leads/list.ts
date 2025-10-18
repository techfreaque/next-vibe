import type { translations as EnglishListTranslations } from "../../en/leads/list";

export const translations: typeof EnglishListTranslations = {
  title: "Leads-Liste",
  titleWithCount: "Leads-Liste ({{count}})",
  description:
    "Durchsuchen und verwalten Sie alle Leads mit erweiterten Filter- und Sortieroptionen",
  loading: "Laden...",
  no_results: "Keine Leads gefunden, die Ihren Kriterien entsprechen",
  noResults: "Keine Leads gefunden, die Ihren Kriterien entsprechen",
  results: {
    showing: "Zeige {{start}}-{{end}} von {{total}} Leads",
  },
  table: {
    title: "Alle Leads",
    campaign_stage: "Kampagnen-Phase",
    contact: "Kontakt",
  },
  filters: {
    title: "Filter",
  },
};
