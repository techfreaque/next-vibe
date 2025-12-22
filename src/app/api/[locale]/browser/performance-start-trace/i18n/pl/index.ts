import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Rozpocznij trace wydajności",
  description:
    "Rozpoczyna nagrywanie trace wydajności na wybranej stronie w celu analizy metryk wydajności i core web vitals",
  form: {
    label: "Rozpocznij trace wydajności",
    description:
      "Rozpocznij nagrywanie metryk wydajności dla strony przeglądarki",
    fields: {
      reload: {
        label: "Przeładuj stronę",
        description:
          "Określa, czy po rozpoczęciu śledzenia strona powinna zostać automatycznie przeładowana",
        placeholder: "true",
      },
      autoStop: {
        label: "Automatyczne zatrzymanie",
        description:
          "Określa, czy nagrywanie trace powinno zostać automatycznie zatrzymane",
        placeholder: "true",
      },
    },
  },
  response: {
    success: "Trace wydajności rozpoczęty pomyślnie",
    result: "Wynik rozpoczęcia trace wydajności",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas rozpoczynania trace wydajności",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do rozpoczynania trace wydajności",
    },
    forbidden: {
      title: "Zabronione",
      description: "Rozpoczynanie trace wydajności jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas rozpoczynania trace wydajności",
    },
    unknown: {
      title: "Nieznany błąd",
      description:
        "Wystąpił nieznany błąd podczas rozpoczynania trace wydajności",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas rozpoczynania trace wydajności",
    },
  },
  success: {
    title: "Trace wydajności rozpoczęty pomyślnie",
    description: "Trace wydajności został pomyślnie rozpoczęty",
  },
};
