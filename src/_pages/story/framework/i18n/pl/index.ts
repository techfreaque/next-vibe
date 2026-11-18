import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Framework next-vibe i API unbottled.ai | Dla deweloperów",
    description:
      "Zobacz, jak jeden endpoint w TypeScripcie obsługuje web, CLI, MCP, aplikacje natywne i narzędzia AI. Uruchom next-vibe lokalnie lub podłącz API unbottled.ai do swojego SDK.",
    category: "Narzędzia deweloperskie",
    imageAlt: "next-vibe i unbottled.ai dla deweloperów",
    keywords:
      "next-vibe, framework TypeScript, MCP, API unbottled.ai, OpenAI, Anthropic",
  },
  hero: {
    title: "next-vibe dla deweloperów",
    subtitle:
      "W tym frameworku TypeScript jeden plik `definition.ts` definiuje interfejs webowy, polecenie CLI, narzędzie MCP, ekran natywny i narzędzie AI.",
    quickstart: "Uruchom next-vibe lokalnie",
  },
  example: {
    title: "Jeden endpoint w praktyce",
    intro:
      "Tak działa formularz kontaktowy unbottled.ai. W tym fragmencie `definition.ts` sprawdza wiadomość i wskazuje widżet. `route.ts` łączy kontrakt z repozytorium.",
    source: "Zobacz kod endpointu na GitHubie",
    form: "Otwórz formularz kontaktowy",
    web: {
      title: "Interfejs webowy",
      body: "Wspólny widżet na stronie `/help` wyświetla pole na wiadomość i potwierdzenie po wysłaniu.",
    },
    cli: {
      title: "Polecenie CLI",
      body: "`vibe contact-form` przyjmuje opcje takie jak `--name` i `--message` prosto z definicji pól wejściowych.",
    },
    mcp: {
      title: "Narzędzie MCP",
      body: "Klient MCP wywołuje `execute-tool` z `toolName: contact-form` i tymi samymi danymi wejściowymi.",
    },
    native: {
      title: "Ekran natywny",
      body: "Aplikacja zbudowana w Expo może wyświetlić ten sam widżet z natywnymi polami i przyciskiem wysyłania obsługiwanym dotykiem.",
    },
    ai: {
      title: "Narzędzie AI",
      body: "Agent może wywołać `contact-form` z tymi samymi polami `name` i `message`. Przed wysłaniem endpoint prosi użytkownika o potwierdzenie.",
    },
  },
  quickstart: {
    title: "Uruchom projekt lokalnie",
    intro:
      "Domyślna konfiguracja z PostgreSQL wymaga Linuksa oraz narzędzi Git, Bun, Node.js i Docker.",
    start:
      "`bun run dev` wywołuje `vibe dev`, uruchamia lokalną bazę, wykonuje migracje i wczytuje dane startowe. Otwórz adres z terminala, zaloguj się jako administrator w trybie deweloperskim i skonfiguruj dostawcę AI.",
    pglite:
      'Bez Dockera uruchom `bun run dev` z `DATABASE_URL="file:./data.db"`, aby użyć wbudowanej bazy PGlite.',
    github: "Zobacz repozytorium na GitHubie",
    selfHost: "Przeczytaj instrukcję samodzielnego hostingu",
  },
  api: {
    title: "Korzystaj z API unbottled.ai",
    intro:
      "Ustaw adres bazowy unbottled.ai i klucz API w swoim SDK OpenAI lub Anthropic. Hostowane API obsługuje Chat Completions i Responses od OpenAI oraz Messages od Anthropic.",
    models:
      "Utwórz klucz i ustaw `UNBOTTLED_API_KEY` w terminalu. Tą komendą sprawdzisz, jakie modele są dostępne na Twoim koncie.",
    request: "Pobierz listę modeli",
    docs: "Przeczytaj dokumentację API",
    keys: "Zarządzaj kluczami API",
  },
  architecture: {
    title: "Jak działa next-vibe",
    platform: {
      title: "Role i znaczniki platform",
      body: "Role określają, kto może wywołać endpoint. Znaczniki platform decydują, gdzie jest dostępny. `AI_TOOL_OFF` wyłącza użycie jako narzędzia AI. `MCP_VISIBLE` dodaje endpoint do listy narzędzi serwera MCP.",
    },
    data: {
      title: "Zod, Drizzle i PostgreSQL",
      body: "Zod sprawdza dane wejściowe i wyjściowe oraz dostarcza schematy narzędzi. Repozytoria zapisują dane przez Drizzle. Schematy tabel PostgreSQL i migracje są wersjonowane w repozytorium.",
    },
    realtime: {
      title: "Typowane zdarzenia w czasie rzeczywistym",
      body: "Endpointy definiują schematy zdarzeń i zakresy kanałów. Klienci przez WebSocket odbierają między innymi tokeny i postęp zadań. Pub/sub może działać w procesie aplikacji lub przez Redis.",
    },
    remote: {
      title: "Instancje zdalne",
      body: "Połączone instancje mogą uruchamiać narzędzia u siebie nawzajem i synchronizować wybrane obszary danych. Każda sprawdza własne uprawnienia. Połączenie działa bezpośrednio lub przez przekaźnik z połączeniem wychodzącym.",
    },
    maturity: {
      title: "Co jest już dostępne",
      body: "next-vibe jest dostępny na licencji GPL-3.0. W produkcji unbottled.ai działa na next-vibe i Next.js. Lokalnie domyślnie działają TanStack Start i Vite. React Native i wykrywanie umiejętności na zdalnych instancjach są w wersji beta.",
    },
  },
  code: {
    copy: "Kopiuj kod",
    copied: "Skopiowano",
    wrap: "Zawijaj wiersze",
    terminal: "Terminal",
  },
};
