import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} na własnym serwerze: twój serwer, każdy model",
    description:
      "Uruchom {{appName}} na swoim komputerze. git clone, bun i, vibe dev. Zaloguj się kontem {{appName}} i masz dostęp do wszystkich {{modelCount}} modeli. Bez kluczy dostawców.",
    category: "Self-Host",
    imageAlt: "{{appName}} na własnym komputerze",
    keywords:
      "self-host, własny serwer, czat AI na własnym serwerze, next-vibe, {{appName}}, open source, prywatna AI, lokalna AI, AI bez cenzury",
  },
  hero: {
    badge: "Darmowe i open source",
    title: "Twój serwer.",
    titleHighlight: "Każdy model.",
    subtitle:
      "Uruchom {{appName}} na swoim komputerze. Zaloguj się kontem {{appName}} i masz wszystkie {{modelCount}} modeli. Zero kluczy dostawców. Twoje czaty nie opuszczają twojej bazy.",
    ctaStart: "Uruchom to",
    ctaGithub: "Zobacz na GitHubie",
  },
  diagram: {
    link: "Jedno logowanie",
    instance: {
      label: "Działa u ciebie",
      title: "Twoja instancja",
      points: {
        chats: "Czaty, wspomnienia i dokumenty w twoim własnym Postgresie",
        files: "Pliki i wygenerowane media na twoim dysku",
        tools: "Thea, zadania cron i każde narzędzie AI",
        admin: "Twój login admina. Twoje zasady.",
      },
    },
    account: {
      label: "Działa na {{appName}}",
      title: "Twoje konto",
      points: {
        models: "{{modelCount}} modeli, od mainstreamu po bez cenzury",
        credits: "Rozliczenie z twoich kredytów {{appName}}",
        keys: "Zero kluczy dostawców do pilnowania",
        unlock: "Odblokowuje to dowolny plan lub pakiet kredytów",
      },
    },
  },
  start: {
    eyebrow: "Instalacja",
    title: "Sklonuj. Zainstaluj. Uruchom.",
    intro:
      "Trzy komendy w terminalu. Cała reszta dzieje się w przeglądarce. Żadnych plików konfiguracyjnych.",
    terminal: {
      eyebrow: "W terminalu",
      title: "Uruchom instancję",
      copyAll: "Kopiuj wszystko",
      copy: "Kopiuj",
      copied: "Skopiowano",
      rows: {
        clone: "Pobierz kod",
        cd: "Wejdź do katalogu",
        install: "Instalacja. Dodaje też vibe do PATH.",
        dev: "Start. Baza danych i dane startowe ustawiają się same.",
      },
      facts: {
        docker: "Bez Dockera",
        postgres: "Bez instalacji Postgresa",
        config: "Bez grzebania w .env",
      },
      troubleshoot: {
        notFound: {
          problem: "vibe: command not found?",
          fix: "Otwórz nowy terminal albo uruchom",
        },
        port: {
          problem: "Port 3000 zajęty?",
          fix: "Użyj innego portu:",
        },
      },
    },
    prereqs: {
      summary: "Nowy komputer? Najpierw zainstaluj git i Bun",
      body: "Raz na komputer. Potrzebujesz git i Bun w wersji 1.3 lub nowszej. Wybierz system.",
      newTerminal: "Potem otwórz nowy terminal, żeby git i bun były w PATH.",
    },
    browser: {
      eyebrow: "W przeglądarce",
      title: "Resztę zrobi kreator",
      recommended: "Polecane",
      steps: {
        open: {
          title: "Otwórz {{url}}",
          body: "Świeża instancja sama otwiera kreator konfiguracji. Kliknij „Zacznij konfigurację”.",
        },
        admin: {
          title: "Załóż login admina",
          body: "Twój e-mail, twoje hasło. Zastępuje wbudowany domyślny login. Klucze bezpieczeństwa są już wygenerowane.",
        },
        ai: {
          title: "Połącz konto {{appName}}",
          body: "Wpisz e-mail i hasło do {{appName}}. Z dowolnym planem lub pakietem kredytów odblokowujesz każdy model. Bez kluczy.",
        },
        extras: {
          title: "Dodatki, gdy będą potrzebne",
          body: "E-mail, płatności Stripe, magazyn S3. Wszystko opcjonalne. Pomiń i wróć później.",
        },
      },
      done: "Zakończ konfigurację. Pisz.",
    },
  },
  ai: {
    eyebrow: "Połącz AI",
    title: "Jedno logowanie. Każdy model.",
    intro: "Twoja instancja obsługuje aplikację. {{appName}} obsługuje modele.",
    account: {
      badge: "Polecane",
      title: "Twoje konto {{appName}}",
      body: "Zaloguj się raz w kreatorze. Każdy czat działa na twojej instancji, każde wywołanie modelu na {{appName}} i schodzi z twoich kredytów.",
      points: {
        models: {
          title: "{{modelCount}} modeli",
          body: "Mainstreamowe, otwarte i bez cenzury. Ten sam wybór co na {{appName}}.",
        },
        local: {
          title: "Czaty zostają u ciebie",
          body: "Wątki leżą w twojej bazie. Synchronizują się tylko, jeśli to włączysz.",
        },
        sync: {
          title: "Twoje ustawienia idą z tobą",
          body: "Wspomnienia, dokumenty, skille i ulubione synchronizują się domyślnie. Każde ma swój przełącznik.",
        },
        paid: {
          title: "Każdy zakup odblokowuje",
          body: "Subskrypcja albo dowolny pakiet kredytów. Do trzech instancji na konto.",
        },
      },
      cta: "Załóż konto {{appName}}",
      pricing: "Zobacz plany",
    },
    claude: {
      title: "Claude Code na tym komputerze",
      body: "Zalogowany w claude CLI? Kreator sam to wykryje. Modele Claude działają w ramach twojej subskrypcji Claude. Nic nie wpisujesz.",
    },
    keys: {
      title: "Własne klucze dostawców",
      body: "Bez konta {{appName}}. Wklej klucz w tym samym kroku i płać dostawcy bezpośrednio.",
      providers: {
        openrouter: "OpenRouter",
        venice: "Venice AI",
        nanogpt: "NanoGPT",
      },
      cta: "Zdobądź klucz OpenRouter",
    },
  },
  own: {
    eyebrow: "Twój serwer, twoje zasady",
    title: "Twój stack. Twój filtr.",
    subtitle:
      "Twój Postgres, twoje pliki, twoje logi. Ty wybierasz modele i to, ile filtrów stoi między tobą a nimi.",
    cards: {
      bill: {
        title: "Twój rachunek, twój wybór",
        body: "Koszty modeli idą z twoich kredytów {{appName}} albo prosto do twojego dostawcy. Ty decydujesz.",
      },
      filter: {
        title: "Twój poziom filtrowania",
        body: "Modele mainstreamowe, otwarte albo bez cenzury. Decydujesz dla każdego skilla i wątku. Żadnego działu polityki treści po drodze.",
      },
      code: {
        title: "Otwarty kod, zero uzależnienia",
        body: "Ten sam kod co {{appName}}, publicznie na GitHubie. Czytaj, zmieniaj, forkuj.",
      },
    },
  },
  includes: {
    title: "Wszystko, co ma chmura.",
    intro: "Ten sam kod co {{appName}}. Nic nie schowane.",
    items: {
      models: "{{modelCount}} modeli czatu, plus obraz, wideo, muzyka i mowa",
      memory: "Trwała pamięć i czaty incognito",
      search: "Wyszukiwanie w sieci i pobieranie stron",
      thea: "Thea, twoja adminka AI: wykonuje zadania, buduje narzędzia na prośbę",
      admin: "Panel admina i zadania cron",
      tools:
        "SSH, automatyzacja przeglądarki i klient poczty jako narzędzia AI",
    },
  },
  server: {
    eyebrow: "Na produkcję",
    title: "Wrzuć to na serwer.",
    intro:
      "To samo repo, te same trzy komendy. Potem build produkcyjny zamiast serwera deweloperskiego.",
    terminalTitle: "Na twoim serwerze",
    rows: {
      start: "Pierwszy start: build produkcyjny",
      update: "Po pobraniu zmian: aktualizacja bez przestoju",
    },
    points: {
      proxy: "Skieruj Caddy albo nginx na port 3000 dla HTTPS.",
      env: "Przy pierwszej wizycie ten sam kreator. Wolisz zmienne środowiskowe? Ustaw je we wdrożeniu i zrestartuj.",
      connect:
        "Konto {{appName}} łączysz na serwerze dokładnie tak jak na laptopie.",
    },
  },
  developers: {
    title: "Chcesz na tym budować?",
    body: "Każda funkcja to jeden plik definicji, który staje się stroną, komendą CLI, narzędziem MCP i narzędziem AI.",
    cta: "Zobacz, jak działa next-vibe",
  },
  help: {
    title: "Utknąłeś albo stawiasz to dla zespołu?",
    description:
      "Pomoc przy instalacji, wdrożenia dla zespołów, własne integracje. Każdą wiadomość czyta człowiek.",
  },
};
