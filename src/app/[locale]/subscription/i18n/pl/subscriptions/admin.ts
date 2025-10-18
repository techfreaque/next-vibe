import type { translations as EnglishAdminTranslations } from "../../en/subscriptions/admin";

export const translations: typeof EnglishAdminTranslations = {
  title: "Zarządzanie subskrypcjami",
  description: "Zarządzaj subskrypcjami użytkowników, planami i rozliczeniami",
  overview: {
    title: "Przegląd subskrypcji",
    description:
      "Wyświetl statystyki subskrypcji i zarządzaj subskrypcjami użytkowników",
  },
  navigation: {
    overview: "Przegląd",
    list: "Wszystkie subskrypcje",
    add: "Dodaj subskrypcję",
    plans: "Plany",
    settings: "Ustawienia",
  },
  actions: {
    refresh: "Odśwież",
    export: "Eksportuj",
    exportCsv: "Eksportuj jako CSV",
    exportExcel: "Eksportuj jako Excel",
    addSubscription: "Dodaj subskrypcję",
    editSubscription: "Edytuj subskrypcję",
    cancelSubscription: "Anuluj subskrypcję",
    viewSubscription: "Wyświetl subskrypcję",
    activateSubscription: "Aktywuj subskrypcję",
    pauseSubscription: "Wstrzymaj subskrypcję",
    resumeSubscription: "Wznów subskrypcję",
  },
};
