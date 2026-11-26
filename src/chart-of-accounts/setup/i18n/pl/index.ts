import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (ÖKR)",
      DE: "Niemcy (SKR03)",
      XX: "Ogólny szablon MSSF",
      SK: "Słowacja (Rámcová účtová osnova)",
    },
  },
  post: {
    title: "Skonfiguruj plan kont",
    titleShort: "Skonfiguruj plan kont",
    description: "Uzupełnij konta firmy przy użyciu standardowego szablonu.",
    companyId: {
      label: "Firma",
      description: "Wybierz firmę, której plan kont chcesz ustawić.",
      placeholder: "Wybierz firmę",
    },
    country: {
      label: "Szablon planu kont",
      description: "Wybierz strukturę kont do dodania.",
      placeholder: "Wybierz szablon",
    },
    response: {
      created: "Utworzone konta",
      skipped: "Zachowane konta",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby skonfigurować plan kont",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź firmę i szablon planu kont.",
      },
      forbidden: {
        title: "Brak dostępu",
        description:
          "Tylko właściciele i administratorzy firmy mogą konfigurować konta",
      },
      server: {
        title: "Błąd serwera",
        description: "Spróbuj ponownie zastosować szablon.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Sprawdź ustawienia",
        description:
          "Odśwież listę kont firmy przed ponownym zastosowaniem szablonu.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Szablon nie znaleziony",
        description: "Nie znaleziono szablonu planu kont dla tego kraju",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Plan kont gotowy",
      description:
        "Szablon został zastosowany. Sprawdź nowe i zachowane konta.",
    },
    widget: {
      review: "Sprawdź ustawienia planu kont",
      previewLoading: "Sprawdzamy istniejące konta…",
      previewFailed: "Bieżąca liczba kont jest niedostępna.",
      existing: "Istniejące konta: {{count}}.",
      empty: "Ta firma nie ma jeszcze kont księgowych.",
      consequences:
        "System doda brakujące numery kont z szablonu i zachowa istniejące dane.",
      submit: "Dodaj konta z szablonu",
      back: "Wstecz",
      viewAccounts: "Otwórz plan kont",
      viewPeriods: "Zobacz okresy księgowe",
    },
  },
  title: "Konfiguracja planu kont",
  description: "Inicjalizacja kont firmowych z szablonu",
  category: "Plan kont",
  tag: "Konfiguracja",
};
