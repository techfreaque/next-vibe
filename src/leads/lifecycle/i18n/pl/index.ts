import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      inactiveUser: "Zarejestrowany, bez czatu",
      engagedFree: "Czatował, bez płatności",
      newsletterInvite: "Newsletter, bez konta",
    },
    enrollmentStatus: {
      active: "Aktywny",
      completed: "Ukończony",
      exited: "Zakończony",
    },
    exitReason: {
      goalMet: "Cel osiągnięty",
      unsubscribed: "Wypisany",
      suppressed: "Zablokowany",
      ineligible: "Już niekwalifikujący się",
      sendFailed: "Wysyłka nieudana",
    },
    sendStatus: {
      pending: "Oczekuje",
      sent: "Wysłano",
    },
    template: {
      inactiveNudge: "Impuls: zacznij czat",
      inactiveModels: "Wybór modelu",
      inactiveUpgrade: "Wzmianka o kredytach",
      engagedValue: "Wartość: wyciśnij więcej",
      engagedUpgrade: "Upgrade: nie czekaj na reset",
      engagedLast: "Ostatnia wiadomość o kredytach",
      inviteSignup: "Zaproszenie: załóż konto",
      inviteReminder: "Zaproszenie: przypomnienie",
    },
  },
  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany dostęp administratora",
    },
    forbidden: { title: "Zabronione", description: "Brak uprawnień" },
    server: {
      title: "Błąd serwera",
      description: "Operacja lifecycle nie powiodła się",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź wartości i spróbuj ponownie",
    },
    notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
    conflict: { title: "Konflikt", description: "Konflikt" },
    network: { title: "Błąd sieci", description: "Błąd sieci" },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Niezapisane zmiany",
    },
  },
  emails: {
    greeting: "Cześć,",
    signature: "unbottled.ai",
    unsubscribeText: "Wypisz się:",
    inactiveNudge: {
      subject: "Konto masz. Pytania jeszcze nie.",
      preview: "Darmowe kredyty czekają.",
      body1:
        "Twoje konto działa, a darmowe kredyty odnawiają się co miesiąc. Żadnego filtra narzuconego z góry.",
      body2:
        "Zadaj pytanie, którego nigdzie indziej nie mogłeś zadać. Wystarczy jedna wiadomość.",
      cta: "Zacznij czat",
    },
    inactiveModels: {
      subject: "{{modelCount}} modeli. To ty decydujesz, co jest filtrowane.",
      preview: "Mainstream, otwarte albo bez cenzury. Wybór należy do ciebie.",
      body1:
        "Większość AI sama decyduje, o co wolno ci pytać. Tutaj wybierasz ty: modele mainstreamowe, otwarte lub bez cenzury, obok siebie.",
      body2:
        "Wybierz model, ustaw własny poziom filtra, wyślij jeden prompt. To cała konfiguracja.",
      cta: "Wybierz model",
    },
    inactiveUpgrade: {
      subject: "Darmowe kredyty na start. Kredyty na więcej.",
      preview: "Większe modele, dłuższe rozmowy.",
      body1:
        "Darmowe kredyty wystarczą na wiele. Gdy chcesz większych modeli i dłuższych rozmów, doładuj i jedź dalej.",
      body2:
        "Płacisz za to, co uruchamiasz. Kredyty kupujesz, kiedy ich potrzebujesz.",
      cta: "Zobacz opcje kredytów",
    },
    engagedValue: {
      subject: "Już czatujesz. Oto jak wycisnąć z tego więcej.",
      preview: "Ten sam prompt na drugim modelu.",
      body1:
        "Każdy model odpowiada inaczej. Wyślij ten sam prompt do drugiego i porównaj.",
      body2:
        "Darmowe kredyty odnawiają się co miesiąc. Gdy dobijesz do limitu, nie musisz czekać.",
      cta: "Czatuj dalej",
    },
    engagedUpgrade: {
      subject: "Skończyły się darmowe kredyty? Nie czekaj na reset.",
      preview: "Doładowanie zajmuje minutę.",
      body1:
        "Darmowe kredyty odnawiają się co miesiąc. Płatne nie każą czekać: wybierz pakiet lub subskrypcję i nie przerywaj wątku.",
      body2: "Płacisz za użycie. Nic więcej.",
      cta: "Weź więcej kredytów",
    },
    engagedLast: {
      subject: "Ostatnia wiadomość o kredytach",
      preview: "Potem dajemy ci spokój.",
      body1:
        "To ostatni mail z tej serii. Jeśli darmowe kredyty ci wystarczają, zostań na darmowym. Jeśli chcesz więcej luzu, kredyty są o jedno kliknięcie stąd.",
      body2: "Możesz się wypisać w stopce tego maila w dowolnej chwili.",
      cta: "Sprawdź opcje kredytów",
    },
    inviteSignup: {
      subject: "Jesteś na liście. Teraz czas na konto.",
      preview: "Darmowe konto. Do {{freeCreditsMax}} kredytów miesięcznie.",
      body1:
        "Darmowe konto daje {{freeCreditsSignedIn}} kredytów miesięcznie i dostęp do {{modelCount}} modeli, z filtrem ustawianym przez ciebie.",
      body2:
        "Bez konta: {{freeCreditsGuest}} miesięcznie. Darmowe konto: {{freeCreditsSignedIn}}. Konto z newsletterem: {{freeCreditsMax}}.",
      cta: "Załóż darmowe konto",
    },
    inviteReminder: {
      subject: "Wciąż bez konta? To minuta.",
      preview: "Start jest darmowy.",
      body1:
        "Czytasz nas w mailu. Możesz korzystać z nas bezpośrednio: wybierz model, pytaj o wszystko, sam decyduj o filtrze.",
      body2:
        "Darmowe konta dostają {{freeCreditsSignedIn}} kredytów miesięcznie. Z newsletterem na koncie masz {{freeCreditsMax}}.",
      cta: "Załóż darmowe konto",
    },
  },
  run: {
    post: {
      title: "Uruchom journeys lifecycle",
      titleShort: "Uruchom lifecycle",
      description:
        "Zapisz nowo kwalifikujące się kontakty i wyślij zaległe maile journey. Nic nie robi, gdy wyłącznik awaryjny jest włączony.",
      container: {
        title: "Uruchom lifecycle",
        description:
          "Zapis i wysyłka. Obowiązuje wyłącznik awaryjny i limit częstotliwości.",
      },
      fields: {
        dryRun: {
          label: "Próba",
          description: "Nic nie rób, tylko raportuj",
        },
      },
      response: {
        paused: "Wstrzymane",
        enrolled: "Zapisani",
        sent: "Wysłane",
        exited: "Zakończone",
        deferred: "Odroczone",
        failed: "Nieudane",
      },
      success: {
        title: "Uruchomienie lifecycle zakończone",
        description: "Zaległe kroki journey zostały przetworzone",
      },
    },
  },
  settings: {
    post: {
      title: "Ustawienia lifecycle",
      titleShort: "Ustawienia lifecycle",
      description:
        "Wyłącznik awaryjny, limit częstotliwości, ograniczenie wysyłki i tryb zgód dla maili lifecycle.",
      container: {
        title: "Ustawienia lifecycle",
        description: "Puste pole zachowuje bieżącą wartość.",
      },
      fields: {
        paused: {
          label: "Wstrzymaj całą wysyłkę lifecycle",
          description: "Włączone = nic nie jest zapisywane ani wysyłane",
        },
        minHoursBetweenEmails: {
          label: "Min. godzin między mailami",
          description: "Limit na kontakt, łącznie z kampaniami",
        },
        maxSendsPerRun: {
          label: "Maks. maili na uruchomienie",
          description: "Ograniczenie dla każdego zaplanowanego uruchomienia",
        },
        autoEnrollWindowDays: {
          label: "Okno auto-zapisu (dni)",
          description:
            "Zaplanowane uruchomienie zapisuje tylko kontakty ze świeżym wyzwalaczem. Starsze idą przez backfill.",
        },
        requireUserMarketingConsent: {
          label: "Wymagaj zgody marketingowej od użytkowników",
          description:
            "Włączone = zarejestrowani użytkownicy potrzebują zgody marketingowej lub potwierdzonego zapisu do newslettera",
        },
      },
      response: {
        paused: "Wstrzymane",
        minHoursBetweenEmails: "Min. godzin między mailami",
        maxSendsPerRun: "Maks. maili na uruchomienie",
        autoEnrollWindowDays: "Okno auto-zapisu (dni)",
        requireUserMarketingConsent: "Zgoda marketingowa wymagana",
      },
      success: {
        title: "Ustawienia zapisane",
        description: "Ustawienia lifecycle obowiązują",
      },
    },
  },
  backfill: {
    post: {
      title: "Backfill lifecycle",
      titleShort: "Backfill",
      description:
        "Podgląd, potem zapis istniejących kwalifikujących się kontaktów do właściwego journey. Start od kroku 0, rozłożony w oknie wysyłki.",
      container: {
        title: "Zapisz istniejące kontakty",
        description: "Domyślnie próba. Gdy wstrzymane, nic nie jest wysyłane.",
      },
      fields: {
        dryRun: {
          label: "Próba",
          description: "Tylko liczy. Wyłącz, aby zapisać.",
        },
        spreadHours: {
          label: "Rozłóż na (godziny)",
          description: "Okno, na które rozkładamy pierwsze maile",
        },
      },
      response: {
        dryRunResult: "Próba",
        segments: "Segmenty",
        journey: "Journey",
        eligible: "Kwalifikujący się",
        alreadyEnrolled: "Już zapisani",
        enrolled: "Zapisani",
        heldSuppressed: "Wstrzymani: wypisani / bounce",
        heldPaid: "Wstrzymani: już płacący",
        heldNoConsent: "Wstrzymani: brak zgody marketingowej",
        heldUnverified: "Wstrzymani: niezweryfikowany e-mail",
        heldPendingNewsletter: "Wstrzymani: newsletter niepotwierdzony",
        heldInactiveAccount: "Wstrzymani: zablokowani / nieaktywni",
      },
      success: {
        title: "Backfill zakończony",
        description: "Liczby segmentów są w odpowiedzi",
      },
    },
  },
  overview: {
    get: {
      title: "Journeys lifecycle",
      titleShort: "Lifecycle",
      description:
        "Journeys, zapisy, wysyłki i konwersje. Wyłącznik awaryjny i backfill.",
      response: {
        paused: "Wstrzymane",
        minHoursBetweenEmails: "Min. godzin między mailami",
        maxSendsPerRun: "Maks. maili na uruchomienie",
        autoEnrollWindowDays: "Okno auto-zapisu (dni)",
        requireUserMarketingConsent: "Zgoda marketingowa wymagana",
        journeys: "Journeys",
        steps: "Kroki",
        enrolled: "Zapisani",
        active: "Aktywni",
        completed: "Ukończeni",
        exited: "Zakończeni",
        converted: "Skonwertowani",
        unsubscribed: "Wypisani",
        sent: "Wysłane",
        sent24h: "Wysłane (24h)",
        attributedPaid: "Płacący po zapisie",
      },
      success: {
        title: "Lifecycle wczytany",
        description: "Liczby journey wczytane",
      },
    },
  },
  widget: {
    title: "Journeys lifecycle",
    refresh: "Odśwież",
    pausedTitle: "Wstrzymane",
    pausedBody: "Nic nie jest zapisywane ani wysyłane.",
    liveTitle: "Aktywne",
    liveBody: "Zaległe maile wychodzą przy każdym uruchomieniu.",
    pause: "Wstrzymaj wszystko",
    resume: "Wznów wysyłkę",
    settings: "Ustawienia",
    backfill: "Backfill",
    capLine: "Limit: 1 mail na {{hours}} godz. Maks. {{max}} na uruchomienie.",
    consentOn: "Użytkownicy potrzebują zgody marketingowej.",
    consentOff: "Użytkownicy nie potrzebują zgody marketingowej.",
    noJourneys: "Brak journeys.",
    stepsLine: "{{steps}} kroków",
    enrolled: "Zapisani",
    active: "Aktywni",
    sent: "Wysłane",
    sent24h: "Wysłane (24h)",
    converted: "Skonwertowani",
    paid: "Płacący po",
    unsubscribed: "Wypisani",
  },
};
