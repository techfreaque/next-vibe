import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Obsłuż dialog",
  description: "Obsłuż dialog przeglądarki (alert, potwierdzenie, prompt)",

  form: {
    label: "Obsłuż dialog przeglądarki",
    description: "Zaakceptuj lub odrzuć dialog przeglądarki",
    fields: {
      action: {
        label: "Akcja",
        description: "Czy odrzucić czy zaakceptować dialog",
        placeholder: "Wybierz akcję",
        options: {
          accept: "Zaakceptuj",
          dismiss: "Odrzuć",
        },
      },
      promptText: {
        label: "Tekst promptu",
        description: "Opcjonalny tekst do wprowadzenia do dialogu",
        placeholder: "Wprowadź tekst promptu (opcjonalnie)",
      },
    },
  },

  response: {
    success: "Operacja obsługi dialogu pomyślna",
    result: "Wynik obsługi dialogu",
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
      description: "Wystąpił błąd sieci podczas obsługi dialogu",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania operacji obsługi dialogu",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja obsługi dialogu jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas obsługi dialogu",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas obsługi dialogu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas obsługi dialogu",
    },
  },

  success: {
    title: "Obsługa dialogu pomyślna",
    description: "Dialog przeglądarki został pomyślnie obsłużony",
  },
};
