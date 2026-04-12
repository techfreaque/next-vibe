import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dashboard: {
    title: "Panel administracyjny",
    subtitle: "Zarządzaj swoją aplikacją stąd",
  },
  vibeFrame: {
    selectEndpoint: "Wybierz endpoint...",
    searchEndpoints: "Szukaj endpointów...",
    value: "{{value}}",
  },
  common: {
    active: "Aktywny",
    filter: "Filtruj",
    refresh: "Odśwież",
    loading: "Ładowanie...",
    weekday: {
      monday: "Poniedziałek",
      tuesday: "Wtorek",
      wednesday: "Środa",
      thursday: "Czwartek",
      friday: "Piątek",
      saturday: "Sobota",
      sunday: "Niedziela",
    },
    actions: {
      back: "Wstecz",
      save: "Zapisz",
      saving: "Zapisywanie...",
      cancel: "Anuluj",
      delete: "Usuń",
      edit: "Edytuj",
      create: "Utwórz",
      update: "Aktualizuj",
      view: "Zobacz",
      search: "Szukaj",
      filter: "Filtruj",
      reset: "Resetuj",
      submit: "Wyślij",
      close: "Zamknij",
      previous: "Poprzedni",
      next: "Następny",
    },
  },
};
