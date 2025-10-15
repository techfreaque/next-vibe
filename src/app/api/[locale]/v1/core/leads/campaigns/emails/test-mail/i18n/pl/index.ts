import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Test Mail",
    description: "Wyślij testowy e-mail z niestandardowymi danymi leadu",
    form: {
      title: "Konfiguracja Test Mail",
      description: "Skonfiguruj parametry test mail i dane leadu",
    },
    campaignType: {
      label: "Typ kampanii",
      description: "Typ kampanii e-mailowej",
      placeholder: "Wprowadź typ kampanii",
    },
    emailJourneyVariant: {
      label: "Wariant podróży e-mail",
      description: "Wariant testowy A/B dla podróży e-mail",
      placeholder: "Wybierz wariant podróży",
    },
    emailCampaignStage: {
      label: "Etap kampanii e-mail",
      description: "Aktualny etap kampanii e-mail",
      placeholder: "Wybierz etap kampanii",
    },
    testEmail: {
      label: "Adres testowy e-mail",
      description: "Adres e-mail, na który zostanie wysłany test mail",
      placeholder: "test@example.com",
    },
    leadData: {
      title: "Dane leadu",
      description: "Informacje o leadzie dla renderowania szablonu",
      businessName: {
        label: "Nazwa firmy",
        description: "Nazwa firmy",
        placeholder: "Acme Corporation",
      },
      contactName: {
        label: "Nazwa kontaktu",
        description: "Nazwa osoby kontaktowej",
        placeholder: "Jan Kowalski",
      },
      website: {
        label: "Strona internetowa",
        description: "URL strony internetowej firmy",
        placeholder: "https://example.com",
      },
      country: {
        label: "Kraj",
        description: "Kod kraju",
        placeholder: "GLOBAL",
      },
      language: {
        label: "Język",
        description: "Preferowany kod języka",
        placeholder: "pl",
      },
      status: {
        label: "Status",
        description: "Status leadu",
        placeholder: "NEW",
      },
      source: {
        label: "Źródło",
        description: "Źródło leadu",
        placeholder: "WEBSITE",
      },
      notes: {
        label: "Notatki",
        description: "Dodatkowe notatki o leadzie",
        placeholder: "Wprowadź dodatkowe notatki",
      },
    },
    response: {
      title: "Wynik testowego e-maila",
      description: "Wynik wysłania testowego e-maila",
      success: {
        content: "Sukces",
      },
      messageId: {
        content: "ID wiadomości",
      },
      testEmail: {
        content: "Testowy e-mail",
      },
      subject: {
        content: "Temat e-maila",
      },
      sentAt: {
        content: "Wysłano o",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
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
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Testowy e-mail wysłany pomyślnie",
    },
  },
};
