import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Przegląd subskrypcji",
    titleShort: "Dashboard",
    description: "Twoja subskrypcja w skrócie",
    errors: {
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby zobaczyć swoją subskrypcję",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do tej strony",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować danych subskrypcji",
        detail: "Nie udało się wczytać Twojej subskrypcji: {{error}}",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Coś poszło nie tak",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd połączenia",
        description: "Sprawdź swoje połączenie z internetem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono subskrypcji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Załadowano",
      description: "Dane subskrypcji załadowane",
    },
    response: {
      activeCount: "Aktywne",
      cancelingCount: "W trakcie anulowania",
      trialCount: "Okres próbny",
      totalCount: "Łącznie",
    },
  },
  widget: {
    actions: "Szybkie akcje",
    mySubscription: "Moja subskrypcja",
    manage: "Zarządzaj",
    refresh: "Odśwież",
    noData: "Brak danych subskrypcji",
  },
};
