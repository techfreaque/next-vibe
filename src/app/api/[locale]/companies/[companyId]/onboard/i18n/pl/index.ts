import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { companies: "firmy", onboard: "konfiguracja", setup: "setup" },
  post: {
    title: "Skonfiguruj firmę",
    titleShort: "Konfiguracja",
    description:
      "Skonfiguruj nową firmę: plan kont, stawki VAT i domyślne konto bankowe",
    companyId: { label: "ID firmy", description: "Firma do skonfigurowania" },
    country: {
      label: "Kraj",
      description: "Kraj określa stawki VAT i szablon planu kont",
      placeholder: "DE",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wszystkie pola",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby skonfigurować firmę",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Administrator",
      },
      conflict: {
        title: "Już skonfigurowana",
        description: "Firma została już skonfigurowana",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można ukończyć konfiguracji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: { title: "Błąd sieci", description: "Sprawdź połączenie" },
      notFound: {
        title: "Firma nie znaleziona",
        description: "Ta firma nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Firma gotowa",
      description: "Firma skonfigurowana pomyślnie",
    },
    response: {
      accountsCreated: "Kont utworzonych",
      accountsSkipped: "Kont pominiętych",
      taxRatesCreated: "Stawek VAT utworzonych",
      cashAccountId: "ID kasy",
      bankAccountId: "ID konta bankowego",
      success: "Sukces",
    },
  },
};
