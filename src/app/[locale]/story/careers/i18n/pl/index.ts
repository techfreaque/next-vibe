import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Buduj z next-vibe - {{appName}}",
    category: "Deweloperzy",
    description:
      "next-vibe zamienia każdy endpoint jednocześnie w formularz web, polecenie CLI, narzędzie MCP, ekran natywny i skill wywoływany przez AI. Zautomatyzuj wszystko, co człowiek może zrobić na komputerze.",
    imageAlt: "Platforma deweloperska next-vibe - {{appName}}",
    keywords:
      "next-vibe, automatyzacja AI, platforma deweloperska, automatyzacja biznesu, integracja ERP, automatyzacja produkcji, {{appName}}",
    ogTitle: "Buduj z next-vibe - {{appName}}",
    ogDescription:
      "Jedna baza kodu. Każda powierzchnia. Automatyzuj linie produkcyjne, systemy ERP, przepływy pracy na pulpicie - wszystko, co człowiek robi na komputerze.",
    twitterTitle: "Buduj z next-vibe - {{appName}}",
    twitterDescription:
      "Jedna baza kodu. Każda powierzchnia. Automatyzuj linie produkcyjne, systemy ERP, przepływy pracy na pulpicie - wszystko, co człowiek robi na komputerze.",
  },

  hero: {
    eyebrow: "Platforma deweloperska next-vibe",
    title:
      "Jeśli człowiek może to zrobić na komputerze, next-vibe może to zautomatyzować.",
    subtitle:
      "Jedna definicja endpointu staje się formularzem web, poleceniem CLI, narzędziem MCP, ekranem natywnym i skillem AI - jednocześnie. Od małych skryptów po pełną automatyzację linii produkcyjnej.",
    ctaPrimary: "Zacznij budować",
    ctaSecondary: "Przeczytaj dokumentację",
  },

  audience: {
    title: "Kto buduje z next-vibe",
    items: {
      freelancers: {
        title: "Freelancerzy i agencje",
        description:
          "Dostarczaj klientom narzędzia oparte na AI bez budowania osobnych backendów, CLI i interfejsów. Jedna baza kodu, każda powierzchnia.",
      },
      businessDevs: {
        title: "Deweloperzy biznesowi",
        description:
          "Połącz ERP, CRM lub dowolny system wewnętrzny z przepływami AI. Dane wchodzą, decyzje wychodzą - bez kodu kleju.",
      },
      industrialDevs: {
        title: "Przemysłowi i embedded",
        description:
          "Automatyzuj konfigurację urządzeń na liniach produkcyjnych. Wyzwalaj skille AI gdy czujniki reagują. Mierz Vibe Sense, działaj Autopilotem.",
      },
      enterpriseDevs: {
        title: "Zespoły enterprise",
        description:
          "Zastąp pofragmentowane narzędzia jedną ujednoliconą platformą. Web UI, CLI, MCP, aplikacja natywna - ten sam endpoint, zero duplikacji.",
      },
    },
  },

  useCases: {
    title: "Co możesz zbudować",
    items: {
      erpIntegration: {
        title: "Integracja ERP i systemów biznesowych",
        description:
          "Przekazuj dane produkcyjne do skilla AI, który klasyfikuje defekty, aktualizuje stan magazynu lub uruchamia przepływy zamówień. Twój endpoint to most.",
      },
      desktopAutomation: {
        title: "Pełna automatyzacja pulpitu",
        description:
          "next-vibe może przejąć cały pulpit włącznie z przeglądarką. Wypełnianie formularzy, scraping, nawigacja, operacje na plikach - raz zaskryptowane, działa wszędzie.",
      },
      productionLine: {
        title: "Automatyzacja linii produkcyjnej",
        description:
          "Konfiguruj urządzenia zdalnie przez endpoint. Wyzwalaj kontrole jakości przez Vibe Sense. Gdy pomiar przekroczy próg, skill AI odpowiada.",
      },
      autopilotScheduling: {
        title: "Zaplanowane akcje AI",
        description:
          "Autopilot uruchamia skille według harmonogramu. Co godzinę odpytuje źródło danych, nocą podsumowuje logi, wysyła alerty gdy pojawiają się anomalie.",
      },
      vibeSenseMonitoring: {
        title: "Mierz → Decyduj → Działaj",
        description:
          "Vibe Sense mierzy wszystko: wydajność maszyn, stan API, głębokość kolejki. Wynik trafia do skilla. Skill decyduje. Endpoint działa.",
      },
      skillEconomy: {
        title: "Zarabiaj na tym, co budujesz",
        description:
          "Zapakuj automatyzację jako skill. Udostępnij link. 15% prowizji cyklicznej od każdej rejestracji przez Twój URL.",
      },
    },
  },

  architecture: {
    title: "Jedna definicja. Każda powierzchnia.",
    subtitle: "Napisz jedną definition.ts na funkcję. Reszta jest generowana.",
    surfaces: {
      web: "Formularz web",
      cli: "Polecenie CLI",
      mcp: "Narzędzie MCP",
      native: "Ekran natywny",
      cron: "Zadanie cron",
      ai: "Skill wywoływany przez AI",
    },
    description:
      "Platforma jest wykrywana w czasie wykonania. Ten sam endpoint, który renderuje interfejs web dla człowieka, staje się narzędziem wywoływanym maszynowo dla agenta AI - bez dodatkowego kodu.",
  },

  referral: {
    title: "Buduj. Udostępniaj. Zarabiaj.",
    description:
      "Każdy opublikowany skill niesie Twój link polecający. 10% bezpośrednio, 15% przez skill, 20% łącznie. Cyklicznie na zawsze od każdego użytkownika, który przyszedł przez Ciebie.",
    cta: "Jak działa ekonomia skilli",
  },

  cta: {
    title: "Zacznij od jednego endpointu.",
    subtitle:
      "Dodaj next-vibe do istniejącego projektu w kilka minut. Albo zacznij od szablonu i wdróż dziś pełne narzędzie na wielu powierzchniach.",
    primary: "Zacznij",
    secondary: "Przeglądaj posty",
  },

  post: {
    title: "Buduj z next-vibe",
    description: "Endpoint platformy deweloperskiej",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
