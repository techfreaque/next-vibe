import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "next-vibe Framework",
  description:
    "Framework open-source SaaS napędzający {{appName}}. Zdefiniuj raz, istnieje wszędzie.",
  meta: {
    title: "next-vibe Framework",
    description:
      "Framework SaaS open-source natywny dla AI. Jedna definicja endpointu, trzynaście platform.",
    category: "Framework",
    imageAlt: "Dokumentacja next-vibe Framework",
    keywords:
      "next-vibe, framework, SaaS, open-source, AI, full-stack, TypeScript",
  },
  hero: {
    eyebrow: "Open Source · MIT + GPL v3",
    title: "Jedna definicja.",
    titleAccent: "Trzynaście platform.",
    subtitle:
      "next-vibe zamienia pojedynczą definicję TypeScript w trzynaście platform naraz - formularz web, polecenie CLI, narzędzie MCP, ekran mobilny, cron job, WebSocket, panel admina i więcej. Pełne bezpieczeństwo typów, zero dryfu, zero powtórzeń.",
    ctaGithub: "Daj gwiazdkę na GitHub",
    ctaDocs: "Czytaj dokumentację wzorców",
    stat1Label: "typed endpoints",
    stat2Value: "0",
    stat2Label: "runtime type errors",
    stat3Label: "platforms per endpoint",
    stat4Value: "2",
    stat4Label: "files required",
  },
  problem: {
    eyebrow: "Problem",
    title: "Budowałeś to samo trzynaście razy.",
    subtitle:
      "Każdy feature potrzebuje formularza web, polecenia CLI, narzędzia MCP, ekranu mobilnego, cron joba, handlera WebSocket, panelu admina i więcej. Ta sama walidacja, ten sam i18n, ta sama obsługa błędów - tylko inaczej ubrana. Za każdym razem.",
    callout: "next-vibe buduje wszystkie trzynaście z jednego pliku.",
  },
  pattern: {
    eyebrow: "Wzorzec",
    title: "Dwa pliki wymagane. Każda platforma.",
    subtitle:
      "Każdy feature żyje w folderze. Tylko definition.ts i route.ts są wymagane - wszystko inne jest opcjonalne.",
    definitionTitle: "definition.ts - kontrakt",
    definitionBody:
      "Zadeklaruj pola, schematy Zod, etykiety, typy błędów i przykłady raz. Ten plik jest jedynym źródłem prawdy - framework odczytuje go w czasie wykonania na każdej platformie.",
    routeTitle: "repository.ts - logika",
    routeBody:
      "Logika biznesowa żyje tu - zapytania DB, sprawdzanie uprawnień, obsługa błędów z success()/fail(). Plik route.ts to tylko cienki delegator; walidacja, logowanie i rejestracja platform działają automatycznie.",
    widgetTitle: "widget.tsx - UI (opcjonalny)",
    widgetBody:
      "Bez widgetu framework automatycznie renderuje pola na każdej platformie. Dodaj widget.tsx, żeby w pełni kontrolować wygląd na web i native - ten sam komponent renderuje w panelach admina, osadzonych widgetach i ekranach mobilnych.",
    deleteLine: "Usuń folder. Feature znika z każdej platformy naraz.",
  },
  surfaces: {
    eyebrow: "Every Platform",
    title: "Jedna definicja. Trzynaście platform.",
    subtitle:
      "Gdy dodajesz feature do next-vibe, nie staje się tylko endpointem API. Działa wszędzie naraz.",
    items: {
      webApi: {
        label: "Web API",
        description: "Endpoint REST, w pełni walidowany i typowany",
      },
      reactUi: {
        label: "React UI",
        description: "Automatycznie generowany formularz - bez JSX",
      },
      cli: {
        label: "CLI",
        description:
          "Każdy endpoint to polecenie z automatycznie generowanymi flagami",
      },
      aiTool: {
        label: "Narzędzie AI",
        description: "Schemat function calling generowany automatycznie",
      },
      mcpServer: {
        label: "Serwer MCP",
        description: "Połącz Claude Desktop, Cursor, dowolny klient MCP",
      },
      reactNative: {
        label: "React Native",
        description: "Ekrany iOS i Android z tej samej definicji",
      },
      cron: {
        label: "Cron Job",
        description: "Zaplanuj dowolny endpoint na wyrażeniu cron",
      },
      websocket: {
        label: "WebSocket",
        description:
          "Wypchnij aktualizacje do podłączonych klientów po zakończeniu",
      },
      electron: {
        label: "Electron",
        description:
          "Natywna aplikacja desktopowa przez te same kontrakty endpoint",
      },
      adminPanel: {
        label: "Panel administracyjny",
        description:
          "Automatycznie generowany panel admina - bez dedykowanego kodu",
      },
      vibeFrame: {
        label: "Widget VibeFrame",
        description: "Osadzalny widget iframe dla dowolnej strony",
      },
      remoteSkill: {
        label: "Skill agenta",
        description: "Wywoływalny przez agentów AI jako strukturalny skill",
      },
      vibeBoard: {
        label: "Węzeł Vibe Sense",
        description:
          "Węzeł w grafie przepływu danych na żywo - ten sam endpoint",
      },
    },
  },
  typescript: {
    eyebrow: "Supremacja TypeScript",
    title: "Żadnego any. Żadnego unknown. Żadnego throw.",
    subtitle:
      "Typy muszą być całkowicie zgodne - bez wyjątków. To nie jest preferencja stylistyczna. To reguła strukturalna wymuszana w czasie budowania przez vibe check.",
    patterns: {
      any: {
        name: "brak any",
        description:
          "Zastąp prawdziwym typowanym interfejsem. Jeśli sięgasz po any, twoja architektura ma dziurę.",
      },
      unknown: {
        name: "brak unknown",
        description:
          "Ta sama reguła. unknown to tylko any z dodatkowymi krokami. Zdefiniuj typ.",
      },
      object: {
        name: "brak gołego object",
        description:
          "Gołe object jest bez znaczenia. Napisz kształt, którego naprawdę oczekujesz.",
      },
      asX: {
        name: "brak as X",
        description:
          "Asercje typów to kłamstwa dla kompilatora. Napraw architekturę zamiast tego.",
      },
      throwStatements: {
        name: "brak throw",
        description:
          "Użyj ResponseType<T> z success(data) lub fail({message, errorType}). Błędy to dane.",
      },
      hardcodedStrings: {
        name: "brak zakodowanych stringów",
        description:
          "Każdy string potrzebuje klucza tłumaczenia. Checker wykrywa nie przetłumaczone literały.",
      },
    },
    vibeCheck:
      "vibe check uruchamia Oxlint (Rust), ESLint i sprawdzanie typów TypeScript równolegle. Zero błędów wymagane przed wysyłką.",
  },
  quickstart: {
    eyebrow: "Zacznij",
    title: "Sforkuj, zapytaj, wdróż.",
    subtitle: "Od pierwszego dnia na poziomie {{appName}}.",
    step1: {
      label: "Forkuj i klonuj",
      description: "Sforkuj na GitHub, potem sklonuj swój fork lokalnie.",
    },
    step2: {
      label: "Uruchom serwer",
      description:
        "Do lokalnego dewelopmentu vibe dev uruchamia PostgreSQL w Dockerze, migracje, seeduje dane i daje hot reload. Na produkcji vibe build && vibe start robi pierwszy deploy. Potem używasz vibe rebuild, żeby aktualizować produkcję bez przestojów.",
    },
    step3: {
      label: "Zaloguj jako admin",
      description:
        'Otwórz aplikację i kliknij "Zaloguj jako admin" - kreator konfiguracji przeprowadzi przez klucze API i hasło admina.',
    },
    step4: {
      label: "Zapytaj AI",
      description:
        "Otwórz czat {{appName}} lub Claude Code i opisz feature, który chcesz. AI napisze wszystkie pliki - definicję, route, widget, i18n - i automatycznie uruchomi vibe check.",
    },
    step5: {
      label: "Wdróż",
      description:
        "vibe rebuild aktualizuje produkcję bez przestojów. Sprawdza, przebudowuje i hot-restartuje - bez ręcznego edytowania plików, bez przestojów.",
    },
    docsLink: "Dokumentacja wzorców",
    githubLink: "github.com/techfreaque/next-vibe",
  },
  enterprise: {
    eyebrow: "Enterprise",
    title: "Budujesz coś dużego?",
    description:
      "Pomagamy zespołom przy konfiguracji, niestandardowych integracjach, przeglądzie architektury i bieżącym wsparciu deweloperskim. Ta sama baza kodu, twój deployment.",
    cta: "Skontaktuj się",
  },
};
