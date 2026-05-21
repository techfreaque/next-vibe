export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Licencje urządzeń",
    reminder: "Przypomnienie o subskrypcji",
  },
  post: {
    title: "Wyślij przypomnienia o subskrypcji",
    description:
      "Sprawdza wszystkie urządzenia wygasające w ciągu 30 dni i wysyła przypomnienie. Raz na cykl wygaśnięcia dla każdego urządzenia.",
    response: {
      checked: "Sprawdzone urządzenia",
      reminded: "Wysłane przypomnienia",
      errors: { item: "Błąd" },
    },
    widget: {
      title: "Przypomnienia o subskrypcji",
      run: "Uruchom teraz",
      runAgain: "Uruchom ponownie",
      loading: "Wysyłanie przypomnień…",
      result: "Przebieg przypomnień zakończony.",
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
      forbidden: { title: "Brak dostępu", description: "Niedozwolone." },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono." },
      conflict: { title: "Konflikt", description: "Konflikt." },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany.",
      },
      unknown: { title: "Nieznany błąd", description: "Nieznany błąd." },
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
