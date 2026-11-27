import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      firstChat: "Zarejestrowany, bez czatu",
      outOfCredits: "Darmowe kredyty zużyte",
      whatsNew: "7 dni bez aktywności",
      winBack: "30 dni bez aktywności",
      customerCheckin: "Aktywna subskrypcja: pytania o feedback",
      lapsedWinback: "Płacił wcześniej, 14 dni ciszy",
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
      firstChatPrompts: "Pierwszy czat: trzy prompty",
      firstChatSkills: "Pierwszy czat: zaczyna umiejętność",
      outOfCredits: "Brak kredytów: plany",
      whatsNew: "Co nowego",
      winBack: "Powrót: ostatni mail",
      paymentFailed: "Płatność nieudana",
      customerLikes: "Klient: co działa",
      customerBuildNext: "Klient: co budować",
      lapsedWinback: "Były klient: dlaczego przestał",
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
    greetingNamed: "Cześć {{name}},",
    signoff: "Zespół unbottled.ai",
    senderName: "unbottled.ai",
    unsubscribeText: "Wypisz się:",
    ctaLine: "{{text}}: {{url}}",
    footerAccount: "Dostajesz tę wiadomość, bo masz konto w unbottled.ai.",
    footerAccountLink: "Nie wysyłajcie mi tych maili",
    footerBilling: "To powiadomienie o płatności za Twoją subskrypcję.",
    newModels: {
      one: "nowy model",
      few: "nowe modele",
      many: "nowych modeli",
      other: "nowego modelu",
    },
    tier: {
      mainstream: "Mainstream",
      open: "Open source",
      uncensored: "Bez cenzury",
    },
    firstChatPrompts: {
      subject: "Trzy pierwsze wiadomości. Skopiuj, wklej, wyślij.",
      preview:
        "Pytanie, przed którym filtrowane AI uciekają. Pojedynek modeli. Jeden obraz.",
      intro:
        "Twoje konto jest gotowe, a czat wciąż pusty. Weź jedną z tych wiadomości, wklej ją i wyślij.",
      uncensoredTitle: "1. Zapytaj o to, przed czym filtrowane AI uciekają",
      uncensoredPrompt:
        "„Stań w debacie po stronie, której normalnie byś odmówił. Pełną parą, bez zastrzeżeń.” Wybierz jeden z {{uncensoredCount}} modeli bez cenzury. Raz potwierdzasz, że masz ukończone 18 lat.",
      mainstreamTitle: "2. Niech giganci staną do pojedynku",
      mainstreamPrompt:
        "„Zaplanuj tani weekend w Lizbonie. Gdzie zjeść, co sobie odpuścić.” Zapytaj GPT. Potem w tym samym wątku przełącz na Claude albo Gemini i porównaj.",
      mediaTitle: "3. Stwórz obraz",
      mediaPrompt:
        "„Lis w czerwonym szaliku na zaśnieżonej ulicy Tokio nocą, zdjęcie analogowe.” Jeden prompt, jeden obraz.",
      body: "Darmowe kredyty już są na Twoim koncie. Bez karty.",
      cta: "Otwórz mój czat",
      ps: "P.S. Coś nie gra? Odpisz na tego maila. Odpowiadamy na każdą wiadomość.",
    },
    firstChatSkills: {
      subject: "Nie wiesz, co napisać? Wybierz umiejętność.",
      preview:
        "Postacie i specjaliści z własnym głosem, modelem i narzędziami.",
      intro:
        "Puste okno czatu to najtrudniejszy moment. Umiejętność daje czatowi zadanie, zanim napiszesz choć słowo.",
      characterTitle: "Postacie",
      characterBody:
        "Towarzysze, partnerzy do roleplayu, ostrzy krytycy. Każda postać ma własny głos i się go trzyma.",
      specialistTitle: "Specjaliści",
      specialistBody:
        "Programista, redaktor, analityk. Każdy ma własne instrukcje, model i narzędzia.",
      body: "Wybierz jedną i napisz „cześć”.",
      cta: "Wybierz umiejętność",
    },
    outOfCredits: {
      subject: "Darmowe kredyty prawie się skończyły. Wracają {{resetDate}}.",
      preview: "Nic nie przepada. Wątki i ustawienia zostają.",
      intro:
        "Darmowe kredyty na ten miesiąc prawie się skończyły. Odnowią się {{resetDate}}.",
      cta: "Zobacz moje kredyty",
      plansLink: "Zobacz plany",
    },
    paymentFailed: {
      subject: "Płatność za subskrypcję nie przeszła",
      preview:
        "Plan działa do {{graceDate}}. Zaktualizuj metodę płatności, żeby go zachować.",
      intro: "Nie udało się pobrać ostatniej płatności za Twoją subskrypcję.",
      body: "Twój plan działa do {{graceDate}}. Zaktualizuj wcześniej metodę płatności, żeby go zachować. Bank wstrzymał płatność do akceptacji (częste przy indyjskich kartach)? Zatwierdź ją na stronie konta. Możesz też dokupić jednorazowy pakiet kredytów albo zapłacić kryptowalutą.",
      cta: "Zaktualizuj metodę płatności",
      ps: "P.S. Już poprawione? To zignoruj tego maila.",
    },
    customerLikes: {
      subject: "Tydzień z nami. Co działa, a co nie?",
      preview:
        "Dwa pytania. Wystarczy jedna linijka. Przydatny feedback to {{feedbackCredits}} kredytów.",
      intro: "Od tygodnia masz u nas plan. Dziękujemy. Dwa pytania:",
      likeTitle: "Co Ci się podoba?",
      likeBody:
        "Model, funkcja, moment, w którym zaskoczyło. Powiedz, co mamy zostawić.",
      missingTitle: "Czego brakuje albo co nie działa?",
      missingBody: "Błąd, myląca opcja, cokolwiek, co Cię spowolniło.",
      body: "Odpowiedz na jedno z pytań w jednej linijce. Za przydatny feedback dostajesz {{feedbackCredits}} kredytów.",
      cta: "Wyślij feedback",
    },
    customerBuildNext: {
      subject: "Co mamy zbudować jako następne?",
      preview: "Masz wpływ na to, co zbudujemy dalej.",
      intro: "Wspierasz nas od ponad miesiąca. Dziękujemy.",
      body: "Jedno pytanie: gdybyśmy mogli zbudować dla Ciebie jedną rzecz, co by to było? Model, funkcja, poprawka. Odpisz w jednej linijce. Za przydatny feedback dostajesz {{feedbackCredits}} kredytów.",
      cta: "Wyślij pomysł",
    },
    lapsedWinback: {
      subject: "Co mogliśmy zrobić lepiej?",
      preview:
        "Wystarczy jedna linijka. Za przydatny feedback {{feedbackCredits}} kredytów.",
      intro:
        "Masz za sobą płatność w unbottled.ai, a od dłuższego czasu Cię nie było. Jeśli coś Cię zniechęciło, chcemy o tym usłyszeć.",
      body: "Odpisz w jednej linijce: cena, brakujący model, błąd, cokolwiek. Za przydatny feedback dostajesz {{feedbackCredits}} kredytów.",
      cta: "Wyślij feedback",
      newsPs:
        "P.S. Od Twojej ostatniej wizyty dodaliśmy {{newModelCount}} {{newModelsPhrase}}, w tym {{modelList}}.",
      newsPsAll: "P.S. Od Twojej ostatniej wizyty doszły: {{modelList}}.",
    },
    whatsNew: {
      subject:
        "{{newModelCount}} {{newModelsPhrase}} od Twojej ostatniej wizyty",
      subjectOne: "Nowość od Twojej ostatniej wizyty: {{newModelName}}",
      preview: "Doszły po Twojej ostatniej wizycie. Już są w wyborze modeli.",
      intro:
        "Od Twojej ostatniej wizyty dodaliśmy {{newModelCount}} {{newModelsPhrase}}. Najnowsze:",
      introOne: "Od Twojej ostatniej wizyty dodaliśmy jeden model:",
      body: "Otwórz dowolny wątek i zmień model. Historia zostaje.",
      bodyMore:
        "Do tego jeszcze {{moreCount}}. Otwórz dowolny wątek i zmień model w trakcie rozmowy.",
      cta: "Otwórz moje czaty",
      introAll:
        "Od Twojej ostatniej wizyty dodaliśmy {{newModelCount}} {{newModelsPhrase}}:",
    },
    whatsNewQuiet: {
      subject: "Zapytaj jeden model, potem drugi",
      preview: "Zmieniaj modele w jednym czacie i porównuj.",
      intro: "Spróbuj: zadaj dwóm modelom to samo pytanie.",
      compareTitle: "Zmiana modelu",
      compareBody:
        "Zapytaj jeden model, w tym samym wątku przełącz na inny i porównaj odpowiedzi.",
      body: "Twoje wątki są tam, gdzie były.",
      cta: "Otwórz moje czaty",
    },
    winBack: {
      subject: "Czego zabrakło?",
      preview: "Czego zabrakło? Wystarczy jedna linijka.",
      intro:
        "Twój ostatni czat był ponad miesiąc temu. Jedno pytanie: czego zabrakło? Odpisz, wystarczy jedna linijka. Czytamy każdą odpowiedź i poprawiamy, co się da.",
      body: "Twoje konto i wątki wciąż są na miejscu, a darmowe kredyty dalej odnawiają się co miesiąc.",
      cta: "Napisz, czego zabrakło",
      newsPs:
        "P.S. Od Twojej ostatniej wizyty dodaliśmy {{newModelCount}} {{newModelsPhrase}}, w tym {{modelList}}.",
      newsPsAll: "P.S. Od Twojej ostatniej wizyty doszły: {{modelList}}.",
    },
    inviteSignup: {
      subject: "Czytasz newsletter. Czas sprawdzić aplikację.",
      preview:
        "Darmowe konto, do {{freeCreditsMax}} kredytów miesięcznie. Bez karty.",
      intro:
        "Dostajesz nasz newsletter. Od aplikacji dzieli cię jeden krok: {{modelCount}} modeli, a filtr ustawiasz ty.",
      guestTitle: "Bez konta: {{freeCreditsGuest}} kredytów miesięcznie",
      guestBody: "Wystarczy, żeby przetestować kilka modeli.",
      accountTitle:
        "Darmowe konto: {{freeCreditsSignedIn}} kredytów miesięcznie",
      accountBody: "Twoje wątki zapisane, na każdym urządzeniu.",
      newsletterTitle:
        "Konto + newsletter: {{freeCreditsMax}} kredytów miesięcznie",
      newsletterBody: "Zostaw newsletter włączony na koncie i bonus jest twój.",
      body: "Bez karty. Darmowe kredyty włączają się po potwierdzeniu adresu e-mail.",
      cta: "Załóż darmowe konto",
    },
    inviteReminder: {
      subject: "Ostatnie przypomnienie: twoje darmowe konto",
      preview:
        "{{freeCreditsMax}} zamiast {{freeCreditsGuest}} kredytów miesięcznie. Bez karty.",
      intro:
        "Ostatnie przypomnienie. Darmowe konto z newsletterem dostaje {{freeCreditsMax}} kredytów co miesiąc. Bez konta: {{freeCreditsGuest}}.",
      body: "Zajmie ci minutę. Bez karty.",
      cta: "Załóż darmowe konto",
      ps: "P.S. Więcej przypomnień nie będzie. Newsletter przychodzi dalej jak zwykle.",
    },
  },
  emailTemplates: {
    category: "Journeys lifecycle",
    preview: {
      name: {
        label: "Imię",
        description: "Imię w powitaniu. Puste = ogólne powitanie.",
      },
    },
    firstChatPrompts: {
      name: "Lifecycle: pierwszy czat",
      description:
        "Serwis. 24 h po rejestracji, zweryfikowane konto, jeszcze bez czatu. Trzy gotowe pierwsze wiadomości.",
    },
    firstChatSkills: {
      name: "Lifecycle: pierwszy czat, umiejętności",
      description:
        "Serwis. Dzień 5, wciąż bez czatu. Umiejętności dają czatowi zadanie.",
    },
    outOfCredits: {
      name: "Lifecycle: brak kredytów",
      description:
        "Serwis. Darmowe kredyty na miesiąc zużyte, bez płatności. Data odnowienia i plany.",
    },
    paymentFailed: {
      name: "Lifecycle: płatność nieudana",
      description:
        "Transakcyjny. Subskrypcja zaległa: jeden mail na nieudaną płatność, plan aktywny do końca okresu karencji.",
    },
    customerLikes: {
      name: "Lifecycle: pytanie do klienta",
      description:
        "Serwis. Aktywna subskrypcja, 7 dni planu. Sama prośba o feedback, odpowiedź mailem, kredyty za feedback jak w stopce.",
    },
    customerBuildNext: {
      name: "Lifecycle: co budować dalej",
      description:
        "Serwis. Aktywna subskrypcja, około 5 tygodni. Pyta, co zbudować jako następne.",
    },
    lapsedWinback: {
      name: "Lifecycle: byli klienci",
      description:
        "Marketing. Płacił wcześniej, bez aktywnego planu, 14 dni ciszy. Pyta o powód, pokazuje nowe modele.",
    },
    whatsNew: {
      name: "Lifecycle: co nowego",
      description:
        "Marketing. 7 dni bez czatu. Modele dodane od ostatniego czatu.",
    },
    winBack: {
      name: "Lifecycle: powrót",
      description:
        "Marketing. 30 dni bez czatu. Ostatni mail ścieżki, pyta, czego zabrakło.",
    },
    inviteSignup: {
      name: "Lifecycle: zaproszenie z newslettera",
      description:
        "Potwierdzony subskrybent newslettera bez konta, 48 godz. po potwierdzeniu.",
    },
    inviteReminder: {
      name: "Lifecycle: przypomnienie o zaproszeniu",
      description: "Tydzień po zaproszeniu, nadal bez konta.",
    },
  },
  run: {
    post: {
      title: "Automatyczne kampanie e-mail",
      titleShort: "Uruchom lifecycle",
      description:
        "Dodaje kontakty spełniające warunki do kampanii i wysyła zaplanowane wiadomości. Wyłącznik awaryjny wstrzymuje oba działania.",
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
        autoEligible: "Zaplanowane uruchomienie by zapisało",
        heldSuppressed: "Wstrzymani: wypisani / bounce",
        heldPaid: "Wstrzymani: już płacący",
        heldNoConsent: "Wstrzymani: brak zgody marketingowej",
        heldUnverified: "Wstrzymani: niezweryfikowany e-mail",
        heldPendingNewsletter: "Wstrzymani: newsletter niepotwierdzony",
        heldInactiveAccount: "Wstrzymani: zablokowani / nieaktywni",
        heldNothingDue: "Wstrzymani: nic do wysłania (aktywni, mają kredyty)",
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
