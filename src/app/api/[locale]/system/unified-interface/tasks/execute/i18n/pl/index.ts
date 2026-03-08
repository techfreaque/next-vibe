import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wykonanie zadania",
  tags: {
    execute: "Wykonaj",
  },
  errors: {
    executeTask: "Nie udało się wykonać zadania",
    forbidden: "Nie masz uprawnień do wykonania tego zadania",
    alreadyRunning: "Zadanie jest już uruchomione",
    notFound: "Zadanie nie zostało znalezione",
  },
  post: {
    title: "Wykonaj zadanie",
    description:
      "Wyzwól pojedyncze zadanie po ID i odbierz wynik synchronicznie",
    container: {
      title: "Wykonanie zadania",
      description: "Wykonaj określone zadanie i poczekaj na jego wynik",
    },
    fields: {
      taskId: {
        label: "ID zadania",
        description: "ID zadania do wykonania",
      },
      success: {
        title: "Sukces",
      },
      message: {
        title: "Wiadomość",
      },
    },
    response: {
      taskId: "ID zadania",
      taskName: "Nazwa zadania",
      executedAt: "Wykonano o",
      duration: "Czas trwania (ms)",
      status: "Status",
      output: "Wyjście",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wykonania tego zadania",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zadanie nie zostało znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Zadanie jest już uruchomione",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
    },
    submitButton: {
      label: "Uruchom zadanie",
      loadingText: "Uruchamianie...",
    },
    success: {
      title: "Sukces",
      description: "Zadanie wykonane pomyślnie",
    },
  },
};
