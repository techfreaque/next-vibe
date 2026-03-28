import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Mój martwy bot tradingowy stał się silnikiem monitorowania platformy - next-vibe",
    description:
      "Lata temu porzuciłem bota tradingowego. Potem zdałem sobie sprawę, że jego architektura - DataSource, Indicator, Evaluator, Action - ma zastosowanie w każdym biznesie. Więc przebudowałem go wewnątrz next-vibe.",
    category: "Vibe Sense",
    imageAlt: "Pipeline monitorowania Vibe Sense - next-vibe",
    keywords:
      "vibe sense, monitoring, bot tradingowy, endpointy, EMA, pipeline, next-vibe, TypeScript",
    ogTitle:
      "Mój martwy bot tradingowy stał się silnikiem monitorowania platformy",
    ogDescription:
      "Bot tradingowy miał tę architekturę właściwą. Pomyliłem się tylko co do miejsca jego budowy.",
    twitterTitle: "Martwy bot tradingowy → żywy silnik monitorowania",
    twitterDescription:
      "Każdy węzeł jest endpointem. Pipeline to tylko endpointy wywołujące endpointy.",
  },
  backToBlog: "Powrót do bloga",
  hero: {
    eyebrow: "Vibe Sense",
    title: "To twoja platforma obserwująca samą siebie.",
    subtitle:
      "Lata temu porzuciłem bota tradingowego. Jego architektura stała się najciekawszą częścią next-vibe. Każdy węzeł w grafie jest endpointem - wywoływalnym z CLI, wykrywalnym przez AI, wbudowanym w twoją platformę.",
    readTime: "14 min czytania",
    date: "Architektura",
  },
  origin: {
    title: "Bot tradingowy, który porzuciłem",
    paragraph1:
      "Kilka lat temu sforkałem OctoBot i zbudowałem coś, co nazwałem Octane. Backend Python, frontend React. Można było przeciągać wskaźniki techniczne na płótno, łączyć ewaluatory, konfigurować reguły wykonania, ustawiać alerty, wystawiać zlecenia. Miał pełny wizualny kreator strategii. Nadal używam go do własnego portfela.",
    paragraph2:
      "Porzuciłem go jako bazę kodu. Python był rozrośnięty, architektura nagromadziła wystarczająco dużo długu technicznego, że każda zmiana była kosztowna.",
    paragraph3:
      "Ale wciąż o tym myślałem. Konkretnie o tym, co sprawiało, że działał jako system.",
    quoteText:
      "Bot tradingowy miał tę architekturę właściwą. To, co zrobiłem źle, to zbudowanie go w izolacji.",
    timeline: {
      octane: {
        label: "Octane (fork OctoBot)",
        description:
          "Wizualny kreator strategii, wskaźniki drag-and-drop, backend Python. Porzucony jako baza kodu.",
      },
      insight: {
        label: "Odkrycie",
        description:
          "Ta struktura nie opisuje tradingu. Opisuje każdy proces biznesowy z danymi w czasie.",
      },
      rebuilt: {
        label: "Przebudowany w next-vibe",
        description:
          "Właściwie typowany. Każdy węzeł to standardowy endpoint. Dostępny wszędzie, gdzie jest platforma.",
      },
    },
  },
  insight: {
    title: "Każdy biznes jest szeregiem czasowym",
    intro:
      "W bocie tradingowym części są proste. Źródło danych: dane cenowe, wolumen, cokolwiek czytasz. Wskaźnik: średnia krocząca, RSI, MACD - przyjmuje surowe dane, produkuje pochodny sygnał. Ewaluator: czy szybka MA jest ponad wolną MA? Warunek logiczny. Akcja: kiedy ewaluator strzela, zrób coś.",
    realization:
      "Ta struktura nie opisuje tradingu. Opisuje każdy proces biznesowy, w którym masz dane w czasie, warunki które cię interesują, i akcje, które chcesz podjąć, gdy te warunki są spełnione.",
    examples: {
      userGrowth: {
        label: "Wzrost użytkowników",
        description:
          "To szereg czasowy. Czy spada? To jest ewaluator. Wyślij kampanię win-back. To jest akcja.",
      },
      emailHealth: {
        label: "Zdrowie kampanii e-mail",
        description:
          "Wskaźniki otwarć, wskaźniki odrzuceń, wskaźniki wypisów. Wszystko to szeregi czasowe. Wszystkie warunki do ewaluacji. Wszystkie wyzwalalne.",
      },
      creditEconomy: {
        label: "Ekonomia kredytów",
        description:
          "Prędkość wydatków. Wskaźnik spalania vs. wskaźnik zakupów. Wszystko.",
      },
      revenueAnomaly: {
        label: "Anomalie przychodów",
        description:
          "Wskaźnik zwrotów przekracza 20% w ciągu dnia - Thea jest powiadamiana przed zobaczeniem tego w dashboardzie.",
      },
    },
  },
  architecture: {
    title: "Cztery typy węzłów",
    subtitle:
      "Trzy typy węzłów, które trzeba zrozumieć, aby czytać dowolny graf. Plus czwarty, który zamyka krąg.",
    dataSource: {
      label: "DataSource",
      description:
        "Endpoint należący do domeny, który odpytuje bazę danych i zwraca { timestamp, value }[] dla danego zakresu czasu i rozdzielczości. Żyje ze swoją domeną. Zna własny schemat.",
    },
    indicator: {
      label: "Indicator",
      description:
        "Czysty, wielokrotnego użytku endpoint obliczeniowy - EMA, RSI, MACD, Wstęgi Bollingera, clamp, delta, średnia okienna. Brak SQL. Brak wiedzy domenowej. Działa na dowolnym źródle danych.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Próg lub warunek. Przyjmuje serię i zadaje pytanie. Czy ta wartość jest poniżej 0,7? Czy ten stosunek przekroczył 20%? Zwraca sygnał - wystrzelony lub nie.",
    },
    action: {
      label: "Action",
      description:
        "Gdy poprzedzający ewaluator strzeli, wywoływany jest konkretny endpoint. In-process. Brak HTTP. Taka sama walidacja, taka sama autoryzacja, taki sam typ odpowiedzi jak każde inne wywołanie w systemie.",
    },
    connector: "zasila",
  },
  unified: {
    title: "Każdy węzeł jest endpointem",
    intro:
      "To jest najważniejsza rzecz, którą chcę teraz wyjaśnić, zanim pójdziemy dalej.",
    oldApproach: {
      label: "Stare podejście (Octane)",
      description:
        "EMA istnieje tylko jako węzeł w grafie. Nie można go wywołać z CLI. Nie pojawia się jako narzędzie AI. Jest prywatnym szczegółem implementacyjnym.",
    },
    newApproach: {
      label: "Podejście next-vibe",
      description:
        "Każdy węzeł Vibe Sense to standardowy endpoint, zdefiniowany za pomocą createEndpoint(), zarejestrowany w tym samym rejestrze endpointów co wszystko inne na platformie.",
    },
    cliCaption:
      "Ten sam endpoint EMA, który działał jako węzeł w grafie lejka leadów - ta sama definicja, ta sama walidacja, ta sama autoryzacja - wywoływalny samodzielnie z CLI.",
    insight:
      "TEN SAM endpoint, który jest węzłem w grafie lejka leadów, jest też samodzielnym narzędziem na 13 platformach.",
    keyLine: "Pipeline to tylko endpointy wywołujące endpointy.",
  },
  actionCallout: {
    title: "Ale akcje to nie są transakcje",
    body: "Gdy sygnał strzeli, silnik wywołuje dowolny endpoint. In-process. Bez rundy HTTP. Alert. Wyzwalacz kampanii. Eskalacja AI z wypełnionym wstępnie kontekstem. Thea jest powiadamiana. Sekwencja win-back startuje. Cokolwiek jest podłączone do tego ewaluatora.",
    noWebhook: "Brak webhooka.",
    noAlerting: "Brak własnego serwisu alertowania.",
    noZapier: "Brak Zapiera.",
    punchline: "Platforma wywołuje samą siebie.",
    examples: {
      alert: {
        label: "Alert",
        description: "Wywołaj complete-task - Thea odbiera to natychmiast.",
      },
      campaign: {
        label: "Kampania",
        description:
          "Wyzwól sekwencję konwersji, gdy prędkość leadów przekroczy próg.",
      },
      ai: {
        label: "Eskalacja AI",
        description:
          "Uruchom przetwarzanie AI z wypełnionym wstępnie kontekstem o tym, który sygnał je wyzwolił.",
      },
    },
  },
  funnel: {
    title: "Przechodzenie przez graf lejka leadów",
    subtitle:
      "To jest Lead Acquisition Funnel. Działa co sześć godzin. Prześledźmy go od góry do dołu.",
    column1: {
      label: "Kolumna 1: Źródła danych",
      description:
        "Prawdziwe endpointy. Każdy żyje pod leads/data-sources/. Przyjmują zakres czasu i rozdzielczość, wykonują zapytanie SQL i zwracają { timestamp, value }[].",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Zapytanie o leady według created_at. Sparse - godziny bez nowych leadów nie produkują punktu danych.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Pogrupowane według converted_at, zlicza leady, które osiągnęły status SIGNED_UP.",
        },
        bounced: {
          name: "leads.bounced",
          description: "Leady z odrzuconym e-mailem na przedział czasowy.",
        },
        active: {
          name: "leads.active",
          description:
            "Wskaźnik migawkowy przy rozdzielczości ONE_DAY. Zlicza wszystkie leady nie będące w stanach końcowych.",
        },
      },
    },
    column2: {
      label: "Kolumna 2: Wskaźniki",
      description:
        'Czyste obliczenia. Endpoint EMA żyje pod analytics/indicators/ema. Jego konfiguracja w grafie to tylko { type: "indicator", indicatorId: "ema", params: { period: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "Wskaźnik EMA, period=7. Automatycznie rozszerza zakres pobierania danych upstream dla rozgrzewki.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Transformer: dzieli leads.converted przez leads.created dla każdego przedziału czasowego. Ograniczony do 0–1.",
        },
      },
    },
    column3: {
      label: "Kolumna 3: Ewaluatory",
      description:
        "Warunki progowe. Każdy zwraca sygnał - wystrzelony lub nie.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA(7) < 0,7 przy rozdzielczości ONE_WEEK. Prędkość tworzenia leadów, wygładzona przez 7 okresów, spada poniżej 70%.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "leads.created < 1/dzień. Cały dzień mija bez żadnych nowych leadów.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5%/tydzień. Konwersja lejka spada poniżej 5%.",
        },
      },
    },
  },
  domainOwned: {
    title: "Źródła danych należące do domeny",
    subtitle:
      "Jedna z decyzji architektonicznych, z których jestem najbardziej zadowolony: źródła danych żyją ze swoją domeną, nie w jakimś centralnym katalogu vibe-sense/.",
    leadsLabel: "Domena leadów",
    creditsLabel: "Domena kredytów",
    explanation:
      "leads/data-sources/leads-created zna tabelę leads. Importuje z leads/db. Używa LeadStatus z leads/enum. Jeśli usuniesz moduł leads, źródła danych idą razem z nim. Nic nie pozostaje osierocone.",
    indicators: {
      label: "Wskaźniki pod analytics/indicators/",
      description:
        "Czyste obliczenia - EMA, RSI, MACD, Wstęgi Bollingera, clamp, delta, średnia okienna. Brak wiedzy domenowej. Działa na dowolnym źródle danych.",
    },
    registration:
      "Przy starcie rejestr wskaźników automatycznie odkrywa oba. Endpointy źródeł danych rejestrują się jako definicje węzłów. Dodajesz nową domenę, dodajesz endpointy data-sources/, eksportujesz graphSeeds. Pojawiają się.",
    keyLine: "Domena posiada własną obserwowalność.",
  },
  safety: {
    title: "Wersjonowanie, backtest, trwałość",
    subtitle:
      "Trzy rzeczy, które sprawiają, że Vibe Sense jest bezpieczny do uruchomienia na produkcji.",
    versioning: {
      label: "Wersjonowanie",
      description:
        "Grafy są wersjonowane. Gdy edytujesz graf, tworzysz nową wersję - nigdy nie mutuj aktywnej. Nowa wersja jest wersją roboczą. Promujesz ją jawnie. Rollback jest trywialny.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Przed promowaniem możesz przetestować wstecznie na historycznym zakresie czasu. Warunki są ewaluowane. Sygnały są rejestrowane. Endpointy nigdy nie strzelają. Brama zamknięta.",
    },
    persist: {
      label: "Tryby trwałości",
      always: {
        label: "always",
        description:
          "Każdy obliczony punkt danych jest zapisywany do magazynu punktów danych. Dla wskaźników opartych na zdarzeniach: utworzone leady na minutę, wydane kredyty na minutę.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Obliczane na żądanie, buforowane, ale nie zapisywane do głównej tabeli. Dzienne sumy, skumulowane zliczenia.",
      },
      never: {
        label: "never",
        description:
          "Zawsze obliczane na żywo z danych wejściowych. Wyjścia EMA, wskaźniki - brak kosztów przechowywania. Lookback automatycznie rozszerzone dla rozgrzewki.",
      },
    },
  },
  ships: {
    title: "Co jest dziś dostępne vs. co nadchodzi",
    prodReady: {
      label: "Dziś gotowe na produkcję",
      items: {
        engine:
          "Pełny silnik: endpointy źródeł danych, endpointy wskaźników (EMA, RSI, MACD, Bollinger, clamp, delta, okno), ewaluatory progowe, węzły transformer, węzły akcji endpoint.",
        execution:
          "Topologiczne wykonanie przez graph walker. Obsługa wielu rozdzielczości z automatycznym skalowaniem. Rozszerzenie zakresu uwzględniające lookback.",
        versioning:
          "Wersjonowanie, tryb backtest z pełną historią uruchomień, trwałość sygnałów jako ślad audytu.",
        cli: "Dostęp CLI - vibe ema, vibe rsi, dowolny endpoint wskaźnika, wywoływalny samodzielnie.",
        mcp: "Rejestracja MCP - endpointy wskaźników pojawiają się na liście narzędzi. Thea może bezpośrednio wywoływać wskaźniki.",
        seeds:
          "Grafy seed: 4 grafy domeny leadów, 4 grafy domeny kredytów, plus grafy wzrostu użytkowników. Wszystkie działają od razu na vibe dev.",
      },
    },
    coming: {
      label: "Co nadchodzi",
      items: {
        builder:
          "Wizualny kreator grafów drag-and-drop. Silnik jest w pełni zbudowany. Edytor kanwy to następny rozdział.",
        trading:
          "Endpointy tradingowe. Endpointy źródeł danych cenowych, endpointy API giełd, wykonywanie zleceń jako węzły endpoint. Graf tradingowy to po prostu kolejny graf.",
        marketplace:
          "Rynek strategii. Gdy można budować grafy wizualnie, można je udostępniać. Zaimportuj gotową strategię monitorowania leadów. Sforkuj ją, zmodyfikuj.",
      },
    },
  },
  vision: {
    title: "Czym to naprawdę jest",
    paragraph1:
      "Każdy proces biznesowy, który można opisać jako: mając te dane, gdy te warunki są spełnione, zrób to - to jest graf Vibe Sense. Monitoring, tak. Alertowanie, tak. Ale też: automatyczna kwalifikacja leadów, wykrywanie anomalii przychodów, równoważenie ekonomii kredytów, automatyzacja marketingu.",
    paragraph2:
      "Bot tradingowy miał tę architekturę właściwą. Wskaźniki, ewaluatory, akcje, tryb backtest. To, co zrobiłem źle, to zbudowanie go w izolacji. W Octane EMA było zamknięte w pipeline. W next-vibe EMA jest endpointem pierwszej klasy.",
    keyLine:
      "Nie budujesz systemu monitorowania. Budujesz swoją platformę. System monitorowania jest już tam.",
    closeTagline:
      "Zdefiniuj raz. Istnieje wszędzie. Pipeline to tylko endpointy wywołujące endpointy.",
    cta: {
      primary: "Zobacz na GitHub",
      secondary: "Powrót do bloga",
    },
    quickstart: {
      label: "Quick start",
      description:
        "vibe dev uruchamia PostgreSQL w Dockerze, wykonuje migracje, seeduje dane, seeduje grafy Vibe Sense, uzupełnia 365 dni danych historycznych i uruchamia serwer deweloperski. Otwórz localhost:3000. Grafy działają.",
    },
  },
  ui: {
    checkMark: "✓",
    crossMark: "✗",
    arrowMark: "→",
    emaFunctionLabel: "computeEma()",
  },
};
