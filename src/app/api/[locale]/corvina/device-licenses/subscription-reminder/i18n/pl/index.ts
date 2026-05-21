export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Subskrypcje urządzeń",
    reminder: "Przypomnienia o wygaśnięciu",
  },
  post: {
    title: "Wyślij przypomnienia o wygaśnięciu",
    description:
      "Skanuje wszystkie urządzenia wygasające w ciągu 30 dni i wysyła przypomnienie na zapisany adres e-mail. Każde urządzenie jest powiadamiane raz na cykl wygaśnięcia.",
    response: {
      checked: "Sprawdzone urządzenia",
      reminded: "Wysłane przypomnienia",
      errors: { item: "Błąd" },
    },
    widget: {
      title: "Wyślij przypomnienia o wygaśnięciu",
      back: "Wróć",
      description:
        "Sprawdza wszystkie aktywne subskrypcje urządzeń. Dla każdego urządzenia wygasającego w ciągu 30 dni wysyła e-mail na adres kontaktowy. Można uruchamiać wielokrotnie — każde urządzenie dostaje jedno powiadomienie na cykl.",
      run: "Uruchom teraz",
      runAgain: "Uruchom ponownie",
      loading: "Skanowanie urządzeń i wysyłanie przypomnień…",
      result: "Przebieg zakończony.",
      noErrors: "Brak błędów.",
      sections: {
        about: "Co robi to zadanie",
        results: "Wyniki",
      },
      scanNote: "Sprawdza wszystkie urządzenia wygasające w ciągu 30 dni",
      safeNote:
        "Można uruchamiać wielokrotnie — jeden e-mail na urządzenie na cykl",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Błędne żądanie.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagany dostęp administratora.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieznany błąd.",
      },
    },
    success: {
      title: "Gotowe",
      description: "Przebieg przypomnień zakończony.",
    },
  },
  email: {
    subject: "Twoja subskrypcja urządzenia wygasa za {days} dni",
    greeting: "Powiadomienie o wygaśnięciu subskrypcji",
    body: "Subskrypcja urządzenia {label} ({logicalId}) w organizacji {org} wygasa {date}.",
    cta: "Skontaktuj się z nami, aby odnowić",
    adminSubject: "[Admin] Wygasająca subskrypcja: {label}",
    adminBody:
      "Urządzenie {label} ({logicalId}) w org {org} wygasa {date}. E-mail klienta: {clientEmail}.",
  },
};
