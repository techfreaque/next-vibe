import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{appName}} na własnym serwerze: AI, księgowość i CRM",
    description:
      "{{appName}} na twoim komputerze. git clone, bun i, vibe dev. Wszystkie {{modelCount}} modele AI przez konto {{appName}}, do tego księgowość, CRM i newslettery. Twoje dane zostają w twojej bazie.",
    category: "Self-Host",
    imageAlt: "{{appName}} na własnym komputerze",
    keywords:
      "self-host, własny serwer, czat AI na własnym serwerze, next-vibe, {{appName}}, open source, prywatna AI, lokalna AI, AI bez cenzury, księgowość na własnym serwerze, ERP open source, CRM na własnym serwerze",
  },
  hero: {
    badge: "Darmowe i open source",
    title: "Twój serwer.",
    titleHighlight: "Twoje AI. Twoje księgi.",
    subtitle:
      "Uruchom {{appName}} na swoim komputerze. Zaloguj się kontem {{appName}} i działają wszystkie {{modelCount}} modele. Bez kluczy dostawców. Księgowość, CRM, newslettery i agenci są w tej samej aplikacji.",
    ctaStart: "Uruchom to",
    ctaGithub: "Zobacz na GitHubie",
  },
  diagram: {
    link: "Jedno logowanie",
    instance: {
      label: "Działa u ciebie",
      title: "Twoja instancja",
      points: {
        chats: "Czaty, księgi i klienci w twoim własnym Postgresie",
        files: "Pliki i wygenerowane media na twoim dysku",
        tools: "Thea, zadania cron i każde narzędzie AI",
        admin: "Twój panel, twoje zasady.",
      },
    },
    account: {
      label: "Działa na {{appName}}",
      title: "Twoje konto",
      points: {
        models: "{{modelCount}} modeli, rozliczane z twoich kredytów",
        keys: "Zero kluczy dostawców",
      },
    },
  },
  suite: {
    eyebrow: "Co instalujesz",
    title: "Dużo więcej niż czat.",
    intro:
      "Jeden kod. Jedna baza danych. Jeden panel. Każdy moduł jest w tej samej instalacji.",
    link: "Zobacz cały pakiet dla firm",
    cards: {
      ai: {
        title: "Czat AI",
        body: "{{modelCount}} modeli, pamięć, wyszukiwanie w sieci i czaty incognito. Do tego obrazy, wideo, muzyka i mowa.",
      },
      agents: {
        title: "Agent, który pracuje",
        body: "Thea, wbudowany agent, wykonuje zadania według harmonogramu i używa SSH, przeglądarki i twojej poczty jako narzędzi.",
      },
      books: {
        title: "Księgowość i ERP",
        body: "Księga główna z podwójnym zapisem, faktury sprzedaży i zakupu, zamówienia, magazyn i kasa.",
      },
      customers: {
        title: "Klienci",
        body: "CRM z importem CSV, newslettery z podwójną zgodą, jedna skrzynka na e-mail, SMS, Telegram i WhatsApp.",
      },
      payments: {
        title: "Płatności",
        body: "Płatności przez Stripe i kryptowaluty za plany subskrypcyjne, z webhookami i zwrotami.",
      },
      build: {
        title: "Własne funkcje",
        body: "Jeden plik definicji staje się stroną, poleceniem CLI, narzędziem MCP i narzędziem AI.",
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
          body: "Wpisz e-mail i hasło do {{appName}}. Gotowe.",
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
          title: "Historia zostaje u ciebie",
          body: "Wątki są zapisane w twojej bazie. Przez {{appName}} idą tylko wywołania modeli. Synchronizacja jest wyłączona, dopóki jej nie włączysz.",
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
      api: {
        title: "Twoje API w gratisie",
        body: "Każdy moduł to polecenie CLI i narzędzie MCP na twojej instancji. Napisz skrypt albo podepnij swojego agenta.",
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
  server: {
    eyebrow: "Na produkcję",
    title: "Wrzuć to na serwer.",
    intro:
      "To samo klonowanie i instalacja. Potem build produkcyjny zamiast serwera deweloperskiego.",
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
      db: "Domyślnie wbudowany Postgres (PGlite). Na produkcji ustaw DATABASE_URL na własnego Postgresa.",
    },
  },
  developers: {
    title: "Chcesz na tym budować?",
    body: "Każdy moduł to zwykły TypeScript w repozytorium. Zrób fork, rozbuduj go albo napisz własny.",
    cta: "Zobacz, jak działa next-vibe",
  },
  help: {
    title: "Utknąłeś albo stawiasz to dla zespołu?",
    description:
      "Pomoc przy instalacji, wdrożenia dla zespołów, własne integracje. Każdą wiadomość czyta człowiek.",
  },
};
