import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wzrost",
  tags: {
    vibeSense: "vibe-sense",
    growth: "wzrost",
    campaigns: "kampanie",
    spend: "wydatki",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "Pierwsza wizyta",
      chat: "Pierwsza wiadomość na czacie",
      signup: "Rejestracja",
      newsletter: "Newsletter potwierdzony",
      paid: "Pierwsza płatność",
      retained: "Odnowienie w drugim miesiącu",
    },
    attributionTouch: {
      first: "Pierwszy kontakt",
      last: "Ostatni kontakt",
    },
    channelType: {
      all: "Wszystkie kanały",
      campaign: "Kampania (UTM)",
      referral: "Kod polecający",
      organic: "Odesłanie organiczne",
      direct: "Bezpośrednio",
    },
    paidKind: {
      subscription: "Subskrypcja",
      pack: "Pakiet kredytów",
    },
  },
  links: {
    get: {
      title: "Linki kampanii",
      titleShort: "Linki kampanii",
      description:
        "Oznaczone linki dla każdego kanału – z wizytami, rejestracjami i płacącymi użytkownikami, których przyprowadził każdy link.",
      response: {
        links: "Linki",
      },
      widget: {
        title: "Linki kampanii",
        subtitle: "Oznacz każdy test kanału. Liczy się to, kto płaci.",
        create: "Nowy link",
        refresh: "Odśwież",
        loading: "Ładowanie linków…",
        empty: {
          title: "Brak linków kampanii",
          hint: "Jeden link na każdy test kanału. Każda wizyta, rejestracja i płatność trafi tutaj.",
          cta: "Utwórz pierwszy link",
        },
        visits: "Wizyty",
        signups: "Rejestracje",
        paid: "Płacący",
        funnel:
          "{{visits}} wizyt → {{signups}} rejestracji → {{paid}} płacących",
        paidRate: "{{rate}} wizyt kończy się płatnością",
        refCode: "Ref {{code}}",
        landsOn: "Cel: {{path}}",
        copy: "Kopiuj link",
        copied: "Skopiowano",
        spend: "Wydatki na kanały",
      },
    },
    post: {
      title: "Utwórz link kampanii",
      titleShort: "Nowy link",
      description:
        "Zbuduj link z UTM dla jednego kanału – opcjonalnie powiązany z kodem polecającym.",
      fields: {
        name: {
          label: "Nazwa",
          description:
            "Nazwa wewnętrzna, np. 'Reddit r/LocalLLaMA post startowy'",
          placeholder: "Post startowy na Reddit",
        },
        channel: {
          label: "Źródło (utm_source)",
          description: "Skąd przychodzi ruch: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Medium (utm_medium)",
          description: "Rodzaj ruchu: social, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Kampania (utm_campaign)",
          description: "Test, do którego należy ten link",
          placeholder: "launch-nov",
        },
        content: {
          label: "Treść (utm_content)",
          description: "Opcjonalnie. Która kreacja lub miejsce",
          placeholder: "top-komentarz",
        },
        term: {
          label: "Fraza (utm_term)",
          description: "Opcjonalnie. Płatne słowo kluczowe",
          placeholder: "ai bez cenzury",
        },
        destinationPath: {
          label: "Ścieżka docelowa",
          description:
            "Ścieżka w tym serwisie, którą otwiera link, np. / lub /pl-PL/story",
          placeholder: "/",
        },
        refCode: {
          label: "Kod polecający",
          description:
            "Opcjonalnie. Prowadzi przez /track, żeby kod polecający też został zaliczony",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "ID linku",
        url: "URL kampanii",
      },
      widget: {
        back: "Wróć",
        hint: "Ten sam kanał – zawsze to samo źródło. Wydatki i koszt płacącego użytkownika grupują się po źródle.",
        created: "Link gotowy. Udostępnij dokładnie ten adres:",
        copy: "Kopiuj link",
        copied: "Skopiowano",
      },
    },
  },
  spend: {
    get: {
      title: "Wydatki na kanały",
      titleShort: "Wydatki na kanały",
      description:
        "Wydatki na kanał i okres – z rejestracjami, płacącymi użytkownikami i kosztem płacącego użytkownika.",
      response: {
        rows: "Wpisy wydatków",
      },
      widget: {
        title: "Wydatki na kanały",
        subtitle:
          "Ile kosztuje każdy kanał – i ile kosztuje cię jeden płacący użytkownik.",
        add: "Dodaj wydatek",
        refresh: "Odśwież",
        loading: "Ładowanie wydatków…",
        empty: {
          title: "Brak zapisanych wydatków",
          hint: "Wpisz, ile kosztował test kanału. Koszt płacącego użytkownika pojawi się, gdy ktoś zapłaci.",
          cta: "Zapisz pierwszy wydatek",
        },
        period: "{{from}} – {{to}}",
        signups: "Rejestracje",
        paid: "Płacący",
        costPerPaid: "Koszt / płacący",
        costPerSignup: "Koszt / rejestracja",
        none: "—",
        attribution:
          "Użytkownik liczy się do kanału, który przyprowadził go pierwszy (pierwszy kontakt), w danym okresie.",
      },
    },
    post: {
      title: "Zapisz wydatek na kanał",
      titleShort: "Zapisz wydatek",
      description:
        "Zapisz koszt kanału w okresie. Ten sam kanał i data początku nadpisują wpis.",
      fields: {
        channel: {
          label: "Kanał",
          description:
            "utm_source kanału albo ref:KOD dla partnera polecającego",
          placeholder: "reddit",
        },
        periodStart: {
          label: "Od",
          description: "Pierwszy dzień okresu",
        },
        periodEnd: {
          label: "Do",
          description: "Ostatni dzień okresu",
        },
        amount: {
          label: "Kwota",
          description: "Łączny wydatek w okresie",
        },
        currency: {
          label: "Waluta",
          description: "Waluta kwoty",
        },
        note: {
          label: "Notatka",
          description: "Opcjonalnie. Na co poszły pieniądze",
          placeholder: "2 promowane posty",
        },
      },
      response: {
        id: "ID wpisu",
      },
      widget: {
        back: "Wróć",
        hint: "Użyj dokładnie tej nazwy źródła co w linkach kampanii – inaczej wykres nie połączy wydatków z użytkownikami.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Rozdzielczość", description: "Rozmiar przedziału" },
      range: { label: "Zakres", description: "Zakres czasu zapytania" },
      lookback: {
        label: "Wstecz",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
      touch: {
        label: "Atrybucja",
        description: "Grupuj po pierwszym lub ostatnim kontakcie",
      },
      channelType: {
        label: "Typ kanału",
        description:
          "Kampania, polecenie, organiczny, bezpośredni – lub wszystkie",
      },
      channel: {
        label: "Kanał",
        description:
          "Dokładny klucz kanału: utm_source, ref:KOD, host odsyłający lub direct. Puste = dowolny",
      },
      currency: {
        label: "Waluta",
        description: "Sumowane są tylko wydatki w tej walucie",
      },
    },
    funnelStep: {
      post: {
        title: "Krok lejka",
        titleShort: "Krok lejka",
        description:
          "Ścieżki docierające do kroku lejka w przedziale – z filtrem kanału",
        fields: {
          step: {
            label: "Krok",
            description:
              "Krok lejka: wizyta, czat, rejestracja, newsletter, płatność, odnowienie",
          },
          result: { label: "Ścieżki", description: "Liczba w przedziale" },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Wydatki na kanał",
        titleShort: "Wydatki na kanał",
        description:
          "Zapisane wydatki marketingowe w przedziale, rozłożone równo na okres",
        fields: {
          result: { label: "Wydatki", description: "Wydatki w przedziale" },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź zaznaczone pola",
    },
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się jako admin",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Narzędzia wzrostu wymagają roli admina",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Taki wpis nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Wpis zmienił się w międzyczasie – odśwież i spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zakończyć żądania",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanego się nie powiodło",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    invalidRefCode: "Kod polecający {{code}} nie istnieje lub jest nieaktywny",
    invalidPeriod: "Koniec okresu musi być w dniu początku lub później",
    invalidDestination:
      "Ścieżka docelowa musi zaczynać się od / i pozostać w tym serwisie",
  },
  success: {
    title: "Gotowe",
    description: "Zapisano",
  },
};
