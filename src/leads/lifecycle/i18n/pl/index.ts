import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lifecycle",
  enums: {
    journey: {
      firstChat: "Zarejestrowany, bez czatu",
      outOfCredits: "Darmowe kredyty zużyte",
      whatsNew: "7 dni bez aktywności",
      winBack: "30 dni bez aktywności",
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
      outOfCredits: "Brak kredytów: plany",
      whatsNew: "Co nowego",
      winBack: "Powrót: ostatni mail",
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
    signoff: "Max",
    signature: "unbottled.ai",
    senderName: "Max z unbottled.ai",
    unsubscribeText: "Wypisz się:",
    firstChatPrompts: {
      subject: "Trzy pierwsze wiadomości do skopiowania",
      preview:
        "Jedna bez cenzury, jedna mainstream, jeden obraz. Wybierz i wyślij.",
      intro:
        "Konto masz gotowe, a czat wciąż stoi pusty. Oto trzy wiadomości na start. Skopiuj jedną, wklej, wyślij.",
      uncensoredTitle: "Pytaj bez pouczania",
      uncensoredPrompt:
        "„Napisz mroczne opowiadanie kryminalne, w którym wygrywa zły. Bez happy endu, bez morału.” Wybierz jeden z {{uncensoredCount}} modeli bez cenzury. Raz potwierdzasz, że masz skończone 18 lat.",
      mainstreamTitle: "Porównaj największych",
      mainstreamPrompt:
        "„Zaplanuj tani weekend w Lizbonie. Gdzie zjeść, co sobie odpuścić?” Zapytaj najpierw GPT. Potem w tym samym wątku przełącz na Claude albo Gemini i porównaj.",
      mediaTitle: "Zrób obraz, wideo albo utwór",
      mediaPrompt:
        "„Lis w czerwonym szaliku na zaśnieżonej ulicy Tokio nocą, zdjęcie analogowe.” Jeden prompt i masz obraz. Krótkie wideo i muzyka działają tak samo.",
      body: "Darmowe konto dostaje {{freeCreditsSignedIn}} kredytów co miesiąc, z newsletterem {{freeCreditsMax}}. Bez karty.",
      cta: "Wyślij pierwszą wiadomość",
      ps: "P.S. Nie wiesz, od czego zacząć? Odpisz na tego maila. Czytamy odpowiedzi.",
    },
    outOfCredits: {
      subject: "Darmowe kredyty na ten miesiąc się skończyły",
      preview:
        "Wrócą 1. dnia miesiąca. Albo działaj dalej już teraz, plany od {{subscriptionPrice}} miesięcznie.",
      intro:
        "Darmowe kredyty na ten miesiąc się skończyły. Wrócą 1. dnia miesiąca. Nie chcesz czekać? Wybierz plan. Ceny bez gwiazdek.",
      starterTitle: "Starter: {{subscriptionPrice}}/mies.",
      starterBody:
        "{{subscriptionCredits}} kredytów co miesiąc, rezygnujesz, kiedy chcesz. Dobre, jeśli czatujesz prawie codziennie.",
      moreTitle: "Potrzebujesz więcej? Trzy większe plany",
      moreBody:
        "Plus: {{plusCredits}} kredytów za {{plusPrice}}. Pro: {{proCredits}} za {{proPrice}}. Ultra: {{ultraCredits}} za {{ultraPrice}}. Do każdego planu dokupisz pakiety kredytów, które nigdy nie wygasają.",
      body: "Płacisz kartą, PayPalem albo kryptowalutą. Te same modele, te same ustawienia filtra.",
      cta: "{{subscriptionCredits}} kredytów za {{subscriptionPrice}}",
      ps: "P.S. Poczekać do 1. też jest w porządku. Twoje wątki zostają na miejscu.",
    },
    whatsNew: {
      subject: "Co się zmieniło, kiedy cię nie było",
      preview:
        "{{modelCount}} modeli, wideo i muzyka w czacie, do tego francuski.",
      intro: "Od twojego ostatniego czatu minął ponad tydzień. Oto co nowego.",
      modelsTitle: "{{modelCount}} modeli czatu",
      modelsBody:
        "{{mainstreamCount}} mainstreamowych, {{openCount}} otwartych, {{uncensoredCount}} bez cenzury. Przełączasz się między nimi w środku wątku.",
      mediaTitle: "Obrazy, wideo i muzyka",
      mediaBody:
        "Wpisujesz prompt w czacie, dostajesz obraz, krótki klip albo utwór.",
      languagesTitle: "Teraz także po francusku",
      languagesBody:
        "Cała aplikacja działa po polsku, angielsku, niemiecku i francusku.",
      body: "Twoje wątki są dokładnie tam, gdzie były.",
      cta: "Zobacz wszystkie modele",
      ps: "P.S. Znasz kogoś, komu by się przydało? Z twojego linku polecającego dostajesz {{referralPercent}}% wszystkiego, co ta osoba wyda, co miesiąc.",
    },
    winBack: {
      subject: "Ostatnia wiadomość od nas",
      preview: "Konto, wątki i darmowe kredyty wciąż na ciebie czekają.",
      intro:
        "Od twojego ostatniego czatu minął ponad miesiąc. To nasze ostatnie przypomnienie.",
      body: "Konto, wątki i comiesięczne darmowe kredyty wciąż są na miejscu. Modeli jest więcej niż ostatnio, a filtr nadal ustawiasz ty.",
      cta: "Wróć do swoich czatów",
      ps: "P.S. Co cię zniechęciło? Odpisz i powiedz wprost. Czytamy każdą odpowiedź.",
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
        "48 godz. po rejestracji, zweryfikowane konto, brak czatu. Trzy konkretne prompty.",
    },
    outOfCredits: {
      name: "Lifecycle: brak kredytów",
      description:
        "Darmowe kredyty na miesiąc zużyte, nigdy nie płacił. Ceny planów.",
    },
    whatsNew: {
      name: "Lifecycle: co nowego",
      description: "7 dni bez czatu. Modele, media, języki.",
    },
    winBack: {
      name: "Lifecycle: powrót",
      description: "30 dni bez czatu. Ostatni mail journey.",
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
