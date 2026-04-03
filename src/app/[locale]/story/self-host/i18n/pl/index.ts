import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Samodzielny hosting {{appName}} - Twoja instancja, Twoje zasady",
    description:
      "Uruchom pełny stos {{appName}} na własnym serwerze. Własne klucze API, Thea jako admin AI, pełna kontrola. Bezpłatnie na zawsze.",
    category: "Self-Host",
    imageAlt: "Samodzielny hosting {{appName}} - szybki start",
    keywords:
      "self-host, next-vibe, {{appName}}, open-source, AI, VPS, Docker, Kubernetes",
  },
  hero: {
    badge: "Bezpłatnie na zawsze - MIT + GPL v3",
    title: "Uruchom samodzielnie.",
    titleHighlight: "Miej wszystko.",
    subtitle:
      "Pełny stos {{appName}} na własnym serwerze. Każdy model, każde narzędzie, każda funkcja - plus Thea jako admin AI monitorująca i naprawiająca instancję 24/7.",
    ctaQuickstart: "Przejdź do szybkiego startu",
    ctaGithub: "Gwiazdka na GitHub",
  },
  includes: {
    title: "Wszystko co ma chmura. I więcej.",
    items: {
      models: "42+ modeli - własne klucze API, płać bezpośrednio providerom",
      memory: "Trwała pamięć, tryb incognito, 4 poziomy prywatności",
      search: "Wyszukiwanie na żywo + pobieranie całych stron",
      thea: "Thea: admin AI monitorująca, naprawiająca i budująca narzędzia na polecenie",
      admin: "Panel admina, DB Studio, panel cron, monitoring stanu",
      ssh: "SSH, automatyzacja przeglądarki, klient email - narzędzia Thei",
      sync: "Synchronizacja lokalnej instancji z chmurą {{appName}} (beta)",
      free: "Bezpłatnie na zawsze - MIT + GPL v3, bez vendor lock-in",
    },
  },
  quickstart: {
    title: "Szybki start",
    subtitle: "Trzy komendy. Gotowe w 5 minut.",
    step1: {
      title: "Sklonuj i zainstaluj",
      description: "Pobierz kod i zainstaluj zależności.",
    },
    step2: {
      title: "Uruchom serwer deweloperski",
      description:
        "Uruchamia PostgreSQL w Dockerze, migracje, seeduje dane i otwiera localhost:3000.",
    },
    step3: {
      title: "Zaloguj się i skonfiguruj",
      description:
        'Kliknij „Zaloguj jako admin" na stronie logowania - bez hasła w trybie dev. Kreator przeprowadzi przez konfigurację klucza API i hasła admina.',
    },
    step4: {
      title: "Wybierz dostawcę AI",
      optionA: {
        label: "Opcja A: Claude Code (zalecane)",
        description:
          "Bez klucza API. Korzysta z istniejącej subskrypcji Claude. Wybierz model claude-code-* w selektorze modeli.",
      },
      optionB: {
        label: "Opcja B: OpenRouter",
        description:
          "200+ modeli, płatność za użycie. Klucz na openrouter.ai/keys.",
      },
    },
  },
  vps: {
    title: "Wdrażasz na VPS?",
    description:
      "Działa na każdym Linux VPS. Skieruj nginx lub Caddy na port 3000 - gotowe.",
    docker: "Konfiguracja Docker",
    kubernetes: "Kubernetes",
    kubernetesDescription:
      "Zawiera szablony dla web, task workerów, Redis, ingress i namespace.",
  },
  localSync: {
    title: "Połącz lokalną maszynę (beta)",
    description:
      "Thea może kierować zadania do Claude Code na Twoim komputerze. Przejdź do Admin → Połączenia zdalne w panelu i dodaj URL lokalnej instancji. Pamięci i zadania synchronizują się co 60 sekund - bez przekierowywania portów, bez VPN.",
  },
  enterprise: {
    title: "Potrzebujesz pomocy przy konfiguracji?",
    description:
      "Pomagamy przy wdrożeniu, niestandardowych integracjach i bieżącym wsparciu deweloperskim.",
    cta: "Skontaktuj się",
  },
};
