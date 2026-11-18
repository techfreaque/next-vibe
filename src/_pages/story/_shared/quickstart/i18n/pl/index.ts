import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  requirements: {
    label: "Potrzebujesz",
    os: "macOS, Linux lub Windows",
    git: "git",
    bun: "Bun 1.3+",
  },
  prereqs: {
    step: "Raz na komputer",
    title: "Zainstaluj git i Bun",
    platformLabel: "Twój system",
    gitXcode: "git (Xcode Command Line Tools)",
    gitBrew: "albo przez Homebrew",
    gitApt: "git + unzip, Debian / Ubuntu",
    gitDnf: "git + unzip, Fedora",
    gitPacman: "git + unzip, Arch",
    gitWinget: "git",
    bun: "Bun",
    bunWindows: "Bun (PowerShell)",
    check: "Sprawdź: 1.3 lub nowszy",
    newTerminal: "Potem otwórz nowy terminal, żeby git i bun były w PATH.",
  },
  terminal: {
    step: "Potem",
    title: "Uruchom",
    copyAll: "Kopiuj wszystko",
    copy: "Kopiuj",
    copied: "Skopiowano",
    clone: "Pobierz kod",
    cd: "Wejdź do folderu",
    install: "Zainstaluj. Przy okazji dodaje vibe do PATH.",
    dev: "Uruchom. Baza, migracje i dane startowe robią się same.",
    fallback:
      "Powłoka nie zna polecenia vibe? Otwórz nowy terminal albo uruchom bun run dev.",
    postgres:
      "Domyślnie: wbudowany Postgres (PGlite), bez Dockera. Wolisz pełnego Postgresa? Zmień DATABASE_URL w ustawieniach; vibe dev uruchomi go w Dockerze przy następnym starcie.",
  },
  browser: {
    step: "Na koniec",
    title: "Resztę robisz w przeglądarce",
    open: {
      title: "Otwórz localhost:3000",
      body: "Kliknij Zaloguj się w prawym górnym rogu.",
    },
    admin: {
      title: "Wybierz konto ADMIN",
      body: "W polu Szybkie logowanie (Dev). Otworzy się kreator konfiguracji.",
    },
    account: {
      title: "Ustaw swój login admina",
      body: "Twój e-mail, twoje hasło. Klucze bezpieczeństwa są już wygenerowane.",
    },
    provider: {
      title: "Wybierz AI",
      body: "Zaloguj się kontem unbottled.ai albo wklej własny klucz dostawcy. Zakończ. Pisz.",
    },
  },
};
