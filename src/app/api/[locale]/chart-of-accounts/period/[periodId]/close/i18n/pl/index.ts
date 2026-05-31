import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Zamknij okres",
    description:
      "Zamknij okres księgowy. Nie może być wpisów w stanie roboczym.",
    periodId: {
      label: "ID okresu",
      description: "Okres do zamknięcia",
      placeholder: "UUID okresu",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID okresu",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola księgowego",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zamknąć okresu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Robocze wpisy",
        description: "Wszystkie wpisy muszą być zaksięgowane przed zamknięciem",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Okres nie znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Okres zamknięty",
      description: "Okres księgowy został zamknięty",
    },
    widget: {
      closedLabel: "Zamknięty",
      failedLabel: "Nie powiodło się",
      confirmTitle: "Zamknąć okres księgowy?",
      confirmDescription:
        "Zamknięcie tego okresu jest nieodwracalne. Nie można dodawać nowych zapisów do zamkniętego okresu.",
      confirmButton: "Tak, zamknij okres",
      cancelButton: "Anuluj",
    },
  },
  title: "Zamknij okres",
  description: "Zamknij okres księgowy",
  category: "Plan kont",
  tag: "Okres",
};
