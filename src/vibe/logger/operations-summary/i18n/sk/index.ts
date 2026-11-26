import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "Stav k {{date}}",
  reviewErrors: "Skontrolujte chyby",
  reviewTasks: "Skontrolujte zlyhané úlohy",
  reviewConnections: "Skontrolujte pripojenia",
  title: "Prehľad prevádzky",
  description:
    "Skontrolujte otvorené chyby, neúspešné naplánované úlohy a stav pripojených inštancií.",
  errors: "Otvorené triedy chýb",
  tasks: "Neúspešné úlohy",
  connections: "Pripojenia s problémami",
  errorAlert: "Otvorené triedy chýb bez upozornení ({{count}})",
  taskAlert: "Neúspešné naplánované úlohy ({{count}})",
  connectionAlert: "Pripojenia, ktoré si vyžadujú pozornosť ({{count}})",
  attention: "Vyžaduje pozornosť",
  clear: "Tieto kontroly nezistili žiadne otvorené problémy.",
  unavailable: "Niektoré kontroly stavu nie sú dostupné.",
  recent: "Nedávna aktivita",
  loading: "Načítava sa stav systému",
  retry: "Skúste znova",
};
