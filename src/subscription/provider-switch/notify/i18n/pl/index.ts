import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Płatności",
  tag: "Powiadomienie o przeniesieniu planu",

  post: {
    title: "Powiadomienie o przeniesieniu planu",
    titleShort: "Przeniesienie planu",
    description:
      "Jednorazowy mail do każdego subskrybenta płacącego kartą: przenieś plan do nowego operatora płatności. Próbny przebieg wypisuje odbiorców i renderuje podgląd. Prawdziwy przebieg wysyła do każdego użytkownika tylko raz i odmawia, dopóki nowy operator nie działa.",
    container: {
      title: "Powiadomienie o przeniesieniu planu",
      description:
        "Subskrybenci kartowi (aktywni, w okresie próbnym, zaległi, kończący z końcem okresu), do których jeszcze nie wysłano maila",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Wypisz odbiorców i wyrenderuj podgląd. Nic nie wysyła.",
      },
      batchSize: {
        label: "Rozmiar partii",
        description:
          "Maksymalna liczba maili w tym przebiegu (ograniczona też limitem godzinowym)",
      },
      hourlyCap: {
        label: "Limit godzinowy",
        description:
          "Maksymalna liczba maili platformy na godzinę, licząc wszystkie maile (limit skrzynki to 500)",
      },
      previewLocale: {
        label: "Język podglądu",
        description: "Wyrenderuj mail w tym języku",
      },
      testRecipient: {
        label: "Odbiorca testowy",
        description:
          "Wysyła prawdziwego maila tylko na ten adres. Bez sprawdzania, czy dostawca działa, nikt nie zostaje oznaczony jako powiadomiony.",
      },
    },
    response: {
      providerLive: "Nowy operator działa",
      targetProvider: "Nowy operator",
      totalRecipients: "Subskrybenci kartowi",
      alreadyNotified: "Już powiadomieni",
      pending: "Do wysłania",
      planNotSupported: "Plan niedostępny u nowego dostawcy (pominięto)",
      hourlyBudget: "Pozostały limit godzinowy",
      sent: "Wysłane",
      failed: "Nieudane",
      byLocale: "Według języka",
      locale: "Język",
      count: "Liczba",
      recipients: "Odbiorcy w tym przebiegu",
      userId: "Użytkownik",
      email: "E-mail",
      status: "Status",
      deadline: "Termin",
      testSentTo: "Test wysłany do",
      previewSubject: "Podgląd tematu",
      previewHtml: "Podgląd HTML",
    },
    widget: {
      dryRunBadge: "Próbny przebieg",
      liveBadge: "Prawdziwy przebieg",
      notLive:
        "Nowy operator jeszcze nie działa. Prawdziwy przebieg zostanie odrzucony.",
      run: "Uruchom",
      noRecipients: "Nie ma już do kogo wysłać.",
    },
    errors: {
      notLive: {
        title: "Nowy operator nie działa",
        description:
          "Ustaw SUBSCRIPTION_SWITCH_PROVIDER i SUBSCRIPTION_SWITCH_ENABLED=true i przed wysyłką upewnij się, że operator przyjmuje płatności.",
      },
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Sprawdź pola i spróbuj ponownie.",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Tylko dla adminów.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Tylko dla adminów.",
      },
      server: {
        title: "Przebieg nieudany",
        description: "Przebieg powiadomień się nie udał. Sprawdź logi.",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Stało się coś nieoczekiwanego.",
      },
    },
    success: {
      title: "Przebieg zakończony",
      description: "Liczby znajdziesz poniżej.",
    },
  },

  emailTemplate: {
    name: "Powiadomienie o przeniesieniu planu",
    description:
      "Jednorazowy mail z prośbą do subskrybentów kartowych o przeniesienie planu do nowego operatora płatności",
    category: "Subskrypcje",
    preview: {
      privateName: {
        label: "Imię",
        description: "Imię subskrybenta",
      },
      planName: {
        label: "Plan",
        description: "Nazwa planu",
      },
      deadline: {
        label: "Termin",
        description: "Ostatni dzień opłaconego okresu",
      },
    },
  },

  email: {
    subject:
      "Za dużo wolności dla operatora kart. Przenieś plan do {{deadline}}",
    subjectPastDue: "Za dużo wolności dla operatora kart. Przenieś plan teraz",
    subjectNoDate:
      "Za dużo wolności dla operatora kart. Przenieś plan i zachowaj go",
    previewText:
      "Jedno kliknięcie i plan zostaje. Ta sama cena, kredyty bezpieczne.",
    headline: "Za dużo wolności na ich zasady. W sam raz dla Ciebie.",
    greeting: "Cześć {{privateName}},",
    intro:
      "Nasz operator płatności kartą uznał, że AI, która odpowiada swobodnie, nie pasuje do jego zasad, więc płatności kartą za Twój plan {{planName}} zostały wstrzymane. Jednym kliknięciem przeniesiesz go do nowego systemu płatności przed {{deadline}}, inaczej plan wygaśnie {{deadline}}, ale Twoje kredyty zostaną.",
    introPastDue:
      "Nasz operator płatności kartą uznał, że AI, która odpowiada swobodnie, nie pasuje do jego zasad, więc ostatnie odnowienie Twojego planu {{planName}} nie przeszło. Jednym kliknięciem przeniesiesz plan do nowego systemu płatności od razu, a Twoje kredyty zostają w każdym przypadku.",
    introNoDate:
      "Nasz operator płatności kartą uznał, że AI, która odpowiada swobodnie, nie pasuje do jego zasad, więc płatności kartą za Twój plan {{planName}} zostały wstrzymane. Jednym kliknięciem przeniesiesz go do nowego systemu płatności, inaczej plan wygaśnie po zakończeniu opłaconego okresu, ale Twoje kredyty zostaną.",
    cta: "Przenieś mój plan",
    reassurance:
      "Ten sam plan, ta sama cena, opłacone dni przechodzą z Tobą. Nigdy nie zapłacisz dwa razy. Każdy kredyt zostaje Twój.",
    stance:
      "Prędzej zmienimy operatora płatności, niż ocenzurujemy choć jedną odpowiedź.",
    crypto: "Wolisz zapłacić krypto? To też działa.",
    cryptoCta: "Zapłać krypto",
    help: "Masz pytania? Po prostu odpisz na tego maila. Każdą wiadomość czyta człowiek.",
    signoff: "Dzięki, że jesteś z nami,\nZespół {{appName}}",
  },
};
