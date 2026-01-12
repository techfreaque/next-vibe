/**
 * Polish translations for Email Service endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie E-mailami",
  tag: "Usługa E-mail",

  send: {
    title: "Wyślij E-mail",
    description: "Wysyłaj e-maile przez usługę e-mail z zaawansowanymi opcjami",

    container: {
      title: "Konfiguracja E-maila",
      description: "Skonfiguruj ustawienia i treść e-maila",
    },

    recipientInfo: {
      title: "Informacje o Odbiorcy",
      description: "Skonfiguruj, kto otrzyma e-mail",
    },

    emailContent: {
      title: "Treść E-maila",
      description: "Skonfiguruj temat i treść e-maila",
    },

    senderSettings: {
      title: "Ustawienia Nadawcy",
      description: "Skonfiguruj informacje o nadawcy e-maila",
    },

    campaignSettings: {
      title: "Ustawienia Kampanii",
      description: "Skonfiguruj ustawienia specyficzne dla kampanii",
    },

    advancedOptions: {
      title: "Zaawansowane Opcje",
      description: "Zaawansowane opcje konfiguracji",
    },

    // Form fields
    to: {
      label: "E-mail Odbiorcy",
      description: "Adres e-mail odbiorcy",
      placeholder: "odbiorca@przyklad.pl",
    },
    toName: {
      label: "Nazwa Odbiorcy",
      description: "Nazwa wyświetlana odbiorcy (opcjonalne)",
      placeholder: "Jan Kowalski",
    },
    subject: {
      label: "Temat E-maila",
      description: "Linia tematu e-maila",
      placeholder: "Wprowadź temat e-maila...",
    },
    html: {
      label: "Treść HTML",
      description: "Treść HTML e-maila",
      placeholder: "Wprowadź treść HTML...",
    },
    text: {
      label: "Treść Tekstowa",
      description: "Wersja tekstowa e-maila (opcjonalne)",
      placeholder: "Wprowadź treść tekstową...",
    },
    replyTo: {
      label: "Odpowiedz-na E-mail",
      description: "Adres e-mail do odpowiedzi (opcjonalne)",
      placeholder: "noreply@przyklad.pl",
    },
    unsubscribeUrl: {
      label: "URL Wypisania",
      description: "URL dla odbiorców do wypisania się (opcjonalne)",
      placeholder: "https://przyklad.pl/wypisz",
    },
    senderName: {
      label: "Nazwa Nadawcy",
      description: "Nazwa wyświetlana jako nadawca",
      placeholder: "Twoja Firma",
    },
    campaignType: {
      label: "Typ Kampanii",
      description: "Typ kampanii e-mailowej (opcjonalne)",
      placeholder: "newsletter, transakcyjny, itp.",
    },
    emailJourneyVariant: {
      label: "Wariant Podróży E-mailowej",
      description: "Wariant podróży e-mailowej (opcjonalne)",
      placeholder: "wariant-a, wariant-b, itp.",
    },
    emailCampaignStage: {
      label: "Etap Kampanii E-mailowej",
      description: "Etap kampanii e-mailowej (opcjonalne)",
      placeholder: "powitanie, następny, itp.",
    },
    skipRateLimitCheck: {
      label: "Pomiń Sprawdzanie Limitu",
      description:
        "Pomiń ograniczenie częstotliwości dla tego e-maila (tylko admin)",
    },
    leadId: {
      label: "ID Leada",
      description: "Powiązany identyfikator leada (opcjonalne)",
      placeholder: "lead-12345",
    },
    campaignId: {
      label: "ID Kampanii",
      description: "Powiązany identyfikator kampanii (opcjonalne)",
      placeholder: "kampania-12345",
    },

    // Response fields
    response: {
      accountInfo: {
        title: "Informacje o Koncie",
      },
      deliveryStatus: {
        title: "Status Dostawy",
        description: "Status dostawy e-maila do odbiorców",
      },
      result: {
        title: "Wynik E-maila",
        description: "Wynik operacji wysyłania e-maila",
        success: "Sukces",
        messageId: {
          title: "ID Wiadomości",
          label: "ID Wiadomości",
        },
        accountId: {
          title: "ID Konta",
          label: "ID Konta",
        },
        accountName: {
          title: "Nazwa Konta",
          label: "Nazwa Konta",
        },
        response: {
          title: "Odpowiedź Serwera",
          label: "Odpowiedź",
        },
        sentAt: "Wysłano o",
      },
      accepted: {
        title: "Zaakceptowani Odbiorcy",
        description: "Lista zaakceptowanych odbiorców e-maila",
        email: "Adres E-mail",
      },
      rejected: {
        title: "Odrzuceni Odbiorcy",
        description: "Lista odrzuconych odbiorców e-maila",
        email: "Adres E-mail",
      },
    },

    // Error messages
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Sprawdź swoje dane wejściowe i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wysyłania e-maili",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
      noData: {
        title: "Brak Danych",
        description: "Usługa SMTP zwróciła sukces, ale nie dostarczyła danych",
      },
      server: {
        title: "Błąd Serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas wysyłania e-maila",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas wysyłania e-maila",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
    },

    // Success messages
    success: {
      title: "E-mail Wysłany Pomyślnie",
      description: "Twój e-mail został wysłany pomyślnie",
    },
  },
};
