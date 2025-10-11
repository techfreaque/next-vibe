import type { translations as enTranslations } from "../en";

/**
 * Business Data Audience API tłumaczenia dla języka polskiego
 */

export const translations: typeof enTranslations = {
  category: "Dane Biznesowe",
  tags: {
    audience: "Grupa Docelowa",
    businessData: "Dane Biznesowe",
    get: "Pobierz",
    update: "Aktualizuj",
  },

  // Completion status field translations
  isComplete: "Publiczność kompletna",
  completedFields: "Wypełnione pola",
  totalFields: "Wszystkie pola",
  completionPercentage: "Procent ukończenia",
  missingRequiredFields: "Brakujące pola wymagane",

  // Tłumaczenia endpointu GET
  get: {
    title: "Pobierz Dane Grupy Docelowej",
    description: "Pobierz informacje o grupie docelowej dla firmy",
    form: {
      title: "Pobieranie Danych Grupy Docelowej",
      description: "Wyświetl bieżącą konfigurację grupy docelowej",
    },
    response: {
      title: "Dane Grupy Docelowej",
      description: "Informacje o grupie docelowej i demografia",
      targetAudience: { title: "Opis grupy docelowej" },
      ageRange: { title: "Demografia przedziału wiekowego" },
      gender: { title: "Demografia płci" },
      location: { title: "Lokalizacja geograficzna" },
      income: { title: "Poziom dochodów" },
      interests: { title: "Zainteresowania i hobby" },
      values: { title: "Wartości i przekonania" },
      lifestyle: { title: "Charakterystyka stylu życia" },
      onlineBehavior: { title: "Wzorce zachowania online" },
      purchaseBehavior: { title: "Wzorce zachowania zakupowego" },
      preferredChannels: { title: "Preferowane kanały komunikacji" },
      painPoints: { title: "Problemy i wyzwania" },
      motivations: { title: "Motywacje i bodźce" },
      additionalNotes: { title: "Dodatkowe uwagi" },
      completionStatus: { title: "Status ukończenia sekcji" },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe Żądanie",
        description:
          "Żądanie danych grupy docelowej nie mogło zostać zwalidowane",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się z usługą danych grupy docelowej",
      },
      unauthorized: {
        title: "Nieautoryzowany Dostęp",
        description: "Nie masz uprawnień do dostępu do danych grupy docelowej",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description:
          "Nie możesz uzyskać dostępu do tych danych grupy docelowej",
      },
      notFound: {
        title: "Nie Znaleziono Danych",
        description: "Nie można znaleźć żądanych danych grupy docelowej",
      },
      server: {
        title: "Błąd Serwera",
        description: "Wystąpił błąd podczas pobierania danych grupy docelowej",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w danych grupy docelowej",
      },
      conflict: {
        title: "Konflikt Danych",
        description:
          "Dane grupy docelowej są w konflikcie z istniejącymi informacjami",
      },
    },
    success: {
      title: "Dane Grupy Docelowej Pobrane",
      description: "Dane grupy docelowej zostały pomyślnie pobrane",
    },
  },

  // Tłumaczenia endpointu PUT
  put: {
    title: "Aktualizuj Dane Grupy Docelowej",
    description: "Aktualizuj informacje o grupie docelowej dla firmy",
    form: {
      title: "Konfiguracja Grupy Docelowej",
      description:
        "Zdefiniuj i zaktualizuj charakterystykę swojej grupy docelowej",
    },
    response: {
      title: "Wyniki Aktualizacji",
      description:
        "Wyniki aktualizacji danych grupy docelowej i status ukończenia",
      message: {
        title: "Komunikat Aktualizacji",
        description: "Komunikat statusu dla aktualizacji",
      },
      targetAudience: "Grupa docelowa zaktualizowana",
      ageRange: "Przedział wiekowy zaktualizowany",
      gender: "Demografia płci zaktualizowana",
      location: "Lokalizacja geograficzna zaktualizowana",
      income: "Poziom dochodów zaktualizowany",
      interests: "Zainteresowania zaktualizowane",
      values: "Wartości zaktualizowane",
      lifestyle: "Styl życia zaktualizowany",
      onlineBehavior: "Zachowanie online zaktualizowane",
      purchaseBehavior: "Zachowanie zakupowe zaktualizowane",
      preferredChannels: "Preferowane kanały zaktualizowane",
      painPoints: "Problemy zaktualizowane",
      motivations: "Motywacje zaktualizowane",
      additionalNotes: "Dodatkowe uwagi zaktualizowane",
      completionStatus: {
        title: "Status ukończenia zaktualizowany",
        description: "Status ukończenia publiczności został zaktualizowany",
      },
    },

    // Etykiety i opisy pól
    targetAudience: {
      label: "Opis Grupy Docelowej",
      description: "Podaj szczegółowy opis swojej głównej grupy docelowej",
      placeholder:
        "np. Młodzi profesjonaliści w wieku 25-35 lat w obszarach miejskich...",
    },
    ageRange: {
      label: "Przedział Wiekowy",
      description:
        "Wybierz przedziały wiekowe, które najlepiej reprezentują twoją grupę docelową",
      placeholder: "Wybierz przedziały wiekowe...",
    },
    gender: {
      label: "Płeć",
      description: "Wybierz demografię płci swojej grupy docelowej",
      placeholder: "Wybierz demografię płci...",
    },
    location: {
      label: "Lokalizacja Geograficzna",
      description:
        "Opisz lokalizację geograficzną lub regiony swojej grupy docelowej",
      placeholder: "np. Obszary miejskie w Ameryce Północnej, Europie...",
    },
    income: {
      label: "Poziom Dochodów",
      description:
        "Wybierz poziomy dochodów reprezentujące twoją grupę docelową",
      placeholder: "Wybierz poziomy dochodów...",
    },
    interests: {
      label: "Zainteresowania i Hobby",
      description: "Opisz zainteresowania i hobby swojej grupy docelowej",
      placeholder: "np. Technologia, fitness, podróże, gotowanie...",
    },
    values: {
      label: "Wartości i Przekonania",
      description:
        "Opisz podstawowe wartości i przekonania swojej grupy docelowej",
      placeholder: "np. Równowaga praca-życie, zrównoważony rozwój, rodzina...",
    },
    lifestyle: {
      label: "Charakterystyka Stylu Życia",
      description: "Opisz wzorce i charakterystykę stylu życia",
      placeholder: "np. Aktywny, obeznany z technologią, dbający o zdrowie...",
    },
    onlineBehavior: {
      label: "Zachowanie Online",
      description: "Opisz, jak twoja grupa docelowa zachowuje się online",
      placeholder:
        "np. Aktywna w mediach społecznościowych, mobile-first, sprawdza przed zakupem...",
    },
    purchaseBehavior: {
      label: "Zachowanie Zakupowe",
      description: "Opisz wzorce zakupowe i proces podejmowania decyzji",
      placeholder:
        "np. Świadoma cen, lojalna wobec marki, kupuje impulsywnie...",
    },
    preferredChannels: {
      label: "Preferowane Kanały Komunikacji",
      description:
        "Wybierz kanały komunikacji preferowane przez twoją grupę docelową",
      placeholder: "Wybierz preferowane kanały...",
    },
    painPoints: {
      label: "Problemy i Wyzwania",
      description:
        "Opisz główne problemy i wyzwania, z którymi mierzy się twoja grupa docelowa",
      placeholder:
        "np. Zarządzanie czasem, ograniczenia budżetowe, brak informacji...",
    },
    motivations: {
      label: "Motywacje i Bodźce",
      description: "Opisz, co motywuje i napędza twoją grupę docelową",
      placeholder:
        "np. Rozwój kariery, rozwój osobisty, bezpieczeństwo rodziny...",
    },
    additionalNotes: {
      label: "Dodatkowe Uwagi",
      description:
        "Dodatkowe spostrzeżenia lub obserwacje dotyczące twojej grupy docelowej",
      placeholder:
        "Dodaj inne istotne szczegóły dotyczące twojej grupy docelowej...",
    },

    errors: {
      validation: {
        title: "Walidacja Nieudana",
        description:
          "Sprawdź podane informacje o grupie docelowej i spróbuj ponownie",
      },
      network: {
        title: "Błąd Sieci",
        description: "Nie można połączyć się z usługą danych grupy docelowej",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description:
          "Nie masz uprawnień do aktualizacji danych grupy docelowej",
      },
      forbidden: {
        title: "Dostęp Zabroniony",
        description: "Nie możesz modyfikować danych grupy docelowej",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Rekord danych grupy docelowej nie został znaleziony",
      },
      server: {
        title: "Błąd Serwera",
        description: "Nie udało się zaktualizować danych grupy docelowej",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas aktualizacji",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Masz niezapisane zmiany w danych grupy docelowej",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Aktualizacja grupy docelowej jest w konflikcie z istniejącymi danymi",
      },
    },
    success: {
      title: "Grupa Docelowa Zaktualizowana",
      description:
        "Twoje dane grupy docelowej zostały pomyślnie zaktualizowane",
      message: "Dane grupy docelowej pomyślnie zaktualizowane",
    },
  },

  // Tłumaczenia sukcesu (dla GET i PUT)
  success: {
    title: "Sukces Danych Grupy Docelowej",
    description: "Twoje dane grupy docelowej zostały pomyślnie przetworzone",
  },

  // Tłumaczenia błędów (wspólne)
  errors: {
    validation: {
      title: "Nieprawidłowe Dane Grupy Docelowej",
      description:
        "Sprawdź podane informacje o grupie docelowej i spróbuj ponownie",
    },
    network: {
      title: "Błąd Sieci",
      description: "Nie można połączyć się z usługą danych grupy docelowej",
    },
    unauthorized: {
      title: "Nieautoryzowany Dostęp",
      description: "Nie masz uprawnień do dostępu do danych grupy docelowej",
    },
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Nie możesz uzyskać dostępu do tych danych grupy docelowej",
    },
    notFound: {
      title: "Nie Znaleziono Danych Grupy Docelowej",
      description: "Nie można znaleźć żądanych danych grupy docelowej",
    },
    server: {
      title: "Błąd Serwera",
      description:
        "Wystąpił błąd podczas przetwarzania żądania danych grupy docelowej",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd z danymi grupy docelowej",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany w danych grupy docelowej",
    },
    conflict: {
      title: "Konflikt Danych",
      description:
        "Dane grupy docelowej są w konflikcie z istniejącymi informacjami",
    },
  },

  // Tłumaczenia enums
  enums: {
    gender: {
      all: "Wszystkie Płcie",
      male: "Mężczyzna",
      female: "Kobieta",
      nonBinary: "Niebinarne",
      other: "Inne",
    },
    ageRange: {
      teens: "Nastolatki (13-19)",
      youngAdults: "Młodzi Dorośli (20-24)",
      millennials: "Milenialsi (25-40)",
      genX: "Generacja X (41-56)",
      middleAged: "W Średnim Wieku (57-65)",
      babyBoomers: "Wyż Demograficzny (66-75)",
      seniors: "Seniorzy (76+)",
      allAges: "Wszystkie Grupy Wiekowe",
    },
    incomeLevel: {
      low: "Niski Dochód",
      lowerMiddle: "Niższa Klasa Średnia",
      middle: "Klasa Średnia",
      upperMiddle: "Wyższa Klasa Średnia",
      high: "Wysoki Dochód",
      luxury: "Dochód Luksusowy",
      allLevels: "Wszystkie Poziomy Dochodów",
    },
    communicationChannel: {
      email: "E-mail",
      socialMedia: "Media Społecznościowe",
      phone: "Telefon",
      sms: "SMS/Wiadomość tekstowa",
      inPerson: "Osobiście",
      website: "Strona Internetowa",
      mobileApp: "Aplikacja Mobilna",
      directMail: "Poczta Bezpośrednia",
      advertising: "Reklama",
      wordOfMouth: "Poczta Pantoflowa",
    },
  },
};
