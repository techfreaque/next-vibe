export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Subskrypcje urządzeń",
    purchaseInquiry: "Zapytanie o zakup",
  },
  post: {
    title: "Zapytaj o odnowienie subskrypcji",
    description:
      "Wyślij zapytanie o odnowienie dla urządzenia bez aktywnej subskrypcji. Skontaktujemy się w ciągu 1 dnia roboczego.",
    logicalId: {
      label: "ID urządzenia",
      description: "Unikalny identyfikator urządzenia.",
    },
    orgResourceId: {
      label: "Organizacja",
      description: "Organizacja, do której należy urządzenie.",
    },
    deviceLabel: {
      label: "Nazwa urządzenia",
      description: "Nazwa wyświetlana urządzenia.",
    },
    contactName: {
      label: "Imię i nazwisko",
      description: "Pełne imię i nazwisko osoby kontaktowej.",
    },
    contactEmail: {
      label: "Adres e-mail",
      description: "Adres e-mail do kontaktu.",
    },
    contactPhone: {
      label: "Numer telefonu",
      description: "Opcjonalny numer telefonu do kontaktu.",
    },
    inquiryMessage: {
      label: "Wiadomość",
      description: "Dodatkowe informacje lub wymagania.",
    },
    requestedMonths: {
      label: "Oczekiwany czas subskrypcji (miesiące)",
      description: "Na ile miesięcy jesteś zainteresowany/a?",
    },
    response: {
      inquiryId: "ID zapytania",
      confirmationMessage: "Potwierdzenie",
    },
    widget: {
      title: "Zapytaj o odnowienie subskrypcji",
      back: "Wstecz",
      description:
        "Podaj swoje dane kontaktowe, a my odezwiemy się w ciągu 1 dnia roboczego w sprawie opcji subskrypcji.",
      submit: "Wyślij zapytanie",
      submitAnother: "Wyślij kolejne zapytanie",
      submittedLabel: "Zapytanie wysłane",
      sections: {
        device: "Urządzenia",
        contact: "Dane kontaktowe",
      },
      selected: "wybrano",
      selectAll: "Zaznacz wszystkie",
      deselectAll: "Odznacz wszystkie",
      noSub: "Brak sub",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź pola formularza.",
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
      notFound: {
        title: "Nie znaleziono",
        description: "Urządzenie nie znalezione.",
      },
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
      title: "Zapytanie wysłane",
      description: "Skontaktujemy się z Tobą w ciągu 1 dnia roboczego.",
    },
  },
  email: {
    subject: "Nowe zapytanie o subskrypcję: {deviceId}",
    heading: "Nowe zapytanie o zakup",
    device: "Urządzenie",
    org: "Organizacja",
    contact: "Kontakt",
    email: "E-mail",
    phone: "Telefon",
    months: "Żądane miesiące",
    messageLabel: "Wiadomość",
    noPhone: "Nie podano",
    noMessage: "Brak wiadomości",
    noMonths: "Nie określono",
  },
};
