import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "AT — ÖKR",
      DE: "DE — SKR03",
      XX: "XX — MSSF Ogólny",
    },
  },
  post: {
    title: "Inicjalizacja planu kont",
    titleShort: "Konfiguracja",
    description:
      "Konfiguruje plan kont firmy na podstawie szablonu krajowego. Idempotentny — bezpieczne wielokrotne uruchamianie.",
    companyId: {
      label: "ID firmy",
      description: "Firma, dla której zostanie skonfigurowany plan kont",
      placeholder: "Podaj UUID firmy",
    },
    country: {
      label: "Kraj",
      description:
        "Standard planu kont (AT = ÖKR, DE = SKR03, XX = MSSF Ogólny)",
      placeholder: "Wybierz kraj",
    },
    response: {
      created: "Utworzone konta",
      skipped: "Pominięte konta (już istniały)",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby skonfigurować plan kont",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe dane — sprawdź ID firmy i kraj",
      },
      forbidden: {
        title: "Brak dostępu",
        description:
          "Tylko właściciele i administratorzy firmy mogą konfigurować konta",
      },
      server: {
        title: "Błąd serwera",
        description: "Konfiguracja nie powiodła się — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Już zainicjalizowany",
        description: "Ta firma ma już plan kont",
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
      description: "Wszystkie konta zostały utworzone dla firmy",
    },
    widget: {
      viewAccounts: "Pokaż listę kont",
    },
  },
  title: "Konfiguracja planu kont",
  description: "Inicjalizacja kont firmowych z szablonu",
  category: "Plan kont",
  tag: "Konfiguracja",
};
