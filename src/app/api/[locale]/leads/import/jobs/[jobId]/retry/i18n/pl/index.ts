import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Ponów zadanie importu",
    description: "Ponów nieudane zadanie importu",
    jobId: {
      label: "ID zadania",
      description: "Unikalny identyfikator zadania importu do ponowienia",
    },
    form: {
      title: "Ponów zadanie importu",
      description: "Ponów nieudane zadanie importu",
    },
    response: {
      title: "Wynik ponowienia",
      description: "Wynik operacji ponowienia",
      success: {
        content: "Status sukcesu",
      },
      message: {
        content: "Wiadomość o ponowieniu",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID zadania jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do ponowienia zadań",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do ponowienia tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Nie znaleziono zadania importu o podanym ID",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas ponowienia zadania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt ponowienia",
        description: "Nie można ponowić zadania, które jest obecnie przetwarzane",
      },
    },
    success: {
      title: "Sukces",
      description: "Zadanie importu zostało pomyślnie ponowione",
    },
  },
};
