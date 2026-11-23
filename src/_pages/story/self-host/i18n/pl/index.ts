import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Self-hosting {{appName}}: Twoja instancja, Twoje zasady",
    description:
      "Cały stos {{appName}} na Twoim komputerze. Cztery polecenia, potem kreator konfiguracji w przeglądarce. Połącz konto {{appName}} albo użyj własnych kluczy.",
    category: "Self-Host",
    imageAlt: "Self-hosting {{appName}}: szybki start",
    keywords:
      "self-host, self-hosting, next-vibe, {{appName}}, open source, prywatne AI, lokalne AI, OpenRouter",
  },
  hero: {
    badge: "Darmowe i open source",
    title: "Uruchom u siebie.",
    titleHighlight: "Miej wszystko.",
    subtitle:
      "Cały stos {{appName}} na Twoim komputerze. Połącz konto {{appName}} i masz wszystkie modele, albo użyj własnych kluczy. Cztery polecenia, resztę robi przeglądarka.",
    ctaQuickstart: "Start w czterech poleceniach",
    ctaGithub: "Zobacz na GitHubie",
  },
  quickstart: {
    eyebrow: "Szybki start",
    title: "Cztery polecenia. Potem przejmuje przeglądarka.",
    intro:
      "Żadnych plików konfiguracyjnych. Przy pierwszym logowaniu otwiera się kreator i prowadzi Cię przez resztę.",
  },
  paths: {
    eyebrow: "Wybierz AI",
    title: "Twój komputer. Twój wybór modeli.",
    intro:
      "Obie opcje znajdziesz w kroku Dostawca AI kreatora konfiguracji. Zmienisz je w każdej chwili.",
    account: {
      badge: "Polecane",
      title: "Połącz konto {{appName}}",
      body: "Zaloguj się raz w kreatorze. Twoja instancja prowadzi każdą rozmowę, modele działają na {{appName}} i rozliczają się z Twoich kredytów. Bez żonglowania kluczami.",
      points: {
        models:
          "Wszystkie modele ({{modelCount}}), od mainstreamu po bez cenzury, jedno logowanie.",
        local: "Czaty zostają w Twojej lokalnej bazie.",
        sync: "Wspomnienia, dokumenty, skille i ulubione synchronizują się domyślnie, wątki nie. Każdy ma swój przełącznik.",
        paid: "Wymaga płatnego planu albo pakietu kredytów. Do trzech instancji na konto.",
      },
      cta: "Załóż konto {{appName}}",
    },
    standalone: {
      badge: "Bez konta",
      title: "Samodzielnie, z własnymi kluczami",
      body: "Bez konta u nas. Wklej klucz dostawcy w tym samym kroku i płać bezpośrednio dostawcy.",
      points: {
        openrouter: "OpenRouter: setki modeli, jeden klucz.",
        claude:
          "Claude Code zalogowany na tym komputerze? Wykryty automatycznie. Klucz niepotrzebny.",
        more: "Kolejni dostawcy w każdej chwili pod Wyświetl wszystkie ustawienia.",
        billing:
          "Płacisz bezpośrednio dostawcy. Żadnego rachunku od {{appName}}.",
      },
      cta: "Zdobądź klucz OpenRouter",
    },
  },
  own: {
    eyebrow: "Twój serwer, Twoje zasady",
    title: "Twój stos. Twój filtr.",
    subtitle:
      "Twój Postgres, Twoje pliki, Twoje logi. Ty wybierasz modele i to, ile filtrowania stoi między Tobą a nimi.",
    cards: {
      data: {
        title: "Dane zostają u Ciebie",
        body: "Wątki, wspomnienia i pliki leżą w Twojej bazie i Twoim katalogu.",
      },
      filter: {
        title: "Twój poziom filtrowania",
        body: "Mainstream, otwarte albo bez cenzury. Decydujesz per skill i per wątek. Bez działu polityki treści pomiędzy.",
      },
      keys: {
        title: "Twój rachunek, Twój wybór",
        body: "Koszty modeli idą z Twoich kredytów {{appName}} albo prosto do Twojego dostawcy. Ty wybierasz.",
      },
    },
  },
  includes: {
    title: "Wszystko, co ma chmura.",
    intro: "Ten sam kod co {{appName}}. Nic nie schowaliśmy.",
    items: {
      models:
        "{{modelCount}} modeli czatu, do tego obraz, wideo, muzyka i mowa",
      memory: "Trwała pamięć i czaty incognito",
      search: "Wyszukiwanie w sieci i pobieranie stron",
      thea: "Thea, Twoja adminka AI: wykonuje zadania, buduje narzędzia na prośbę",
      admin: "Panel admina i zadania cron",
      tools: "SSH, automatyzacja przeglądarki, klient e-mail jako narzędzia AI",
    },
  },
  developers: {
    title: "Chcesz na tym budować?",
    body: "Każda funkcja to jeden plik definicji. Z niego powstaje strona, polecenie CLI, narzędzie MCP i narzędzie AI.",
    cta: "Zobacz, jak działa next-vibe",
  },
  help: {
    title: "Utknąłeś albo wdrażasz to dla zespołu?",
    description:
      "Pomoc przy konfiguracji, instalacje dla zespołów, integracje na miarę. Każdą wiadomość czyta człowiek.",
  },
};
