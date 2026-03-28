import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jedna baza kodu. 13 platform. Zero kompromisów.",
    category: "Architektura",
    description:
      "Jak zasada Unified Surface zamienia trzy pliki w aplikację webową, polecenie CLI, narzędzie MCP, ekran natywny i zadanie cron — automatycznie.",
    imageAlt: "Architektura Unified Surface next-vibe",
    keywords:
      "next-vibe, unified surface, wzorzec endpoint, MCP, CLI, TypeScript, framework SaaS, full-stack",
  },
  readingTime: "12 min czytania",
  category: "Architektura",
  publishedDate: "Marzec 2025",
  backToBlog: "Powrót do bloga",

  hero: {
    eyebrow: "Zasada Unified Surface",
    title: "Jedna baza kodu. 13 platform. Zero kompromisów.",
    subtitle:
      "Jak trzy pliki stają się formularzem webowym, poleceniem CLI, narzędziem MCP, ekranem natywnym i automatycznym zadaniem — jednocześnie.",
    fileBarLabel: "definition.ts → web · cli · mcp · native · cron · 10 więcej",
    theaCardTitle: "Kim jest Thea?",
    allowedRolesLabel: "allowedRoles: [...]",
    fileTreePath: "~/src/app/api/explain-to-my-boss/",
    codeBlockLabel: "allowedRoles: [",
    closingBracket: "]",
    vibeCliCommand:
      "vibe analytics/indicators/ema --source=leads_created --period=7",
  },

  intro: {
    hook: "5 802 pliki TypeScript. ~2,1 miliona linii. Zero `any`. Zero błędów typów w czasie wykonania. Jeden wzorzec. Powtórzony 374 razy.",
    para1:
      "To jest baza kodu stojąca za unbottled.ai — i framework, który ją napędza, next-vibe. Ta sama architektura obsługuje aplikację webową, mobilną, CLI, interfejs agenta AI, serwer MCP, system cron, magistralę zdarzeń WebSocket i silnik przepływu danych na żywo.",
    para2:
      "Wzorzec nazywa się Unified Surface. Oto czym jest, jak działa i dlaczego — gdy już go zobaczysz — trudno jest wrócić.",
  },

  fileTreeSection: {
    title: "Feature to folder",
    intro:
      "Każda funkcja w next-vibe żyje w folderze. Trzy pliki są wymagane. Wszystko inne jest opcjonalne.",
    fileTree: {
      line1: "explain-to-my-boss/",
      line2: "  definition.ts    ← co robi",
      line3: "  repository.ts    ← jak to robi",
      line4: "  route.ts         ← sprawia, że istnieje wszędzie",
      line5: "  widget.tsx       ← własny interfejs React (opcjonalnie)",
      line6: "  widget.cli.tsx   ← własny interfejs terminala (opcjonalnie)",
    },
    explanation:
      "To wszystko. Jeden folder. Trzy wymagane pliki. A z tych trzech plików funkcja istnieje na maksymalnie 13 platformach jednocześnie.",
  },

  platformsSection: {
    title: "13 platform z 3 plików",
    subtitle:
      "Gdy dodajesz funkcję do next-vibe, nie staje się ona tylko punktem końcowym API. Staje się wszystkim naraz.",
    platforms: {
      webApi: {
        label: "Web API",
        description:
          "Endpoint REST, automatycznie walidowany, w pełni typowany",
      },
      reactUi: {
        label: "React UI",
        description: "Auto-generowany z definicji — bez pisania JSX",
      },
      cli: {
        label: "CLI",
        description: "Każdy endpoint to polecenie z auto-generowanymi flagami",
      },
      aiTool: {
        label: "Schemat narzędzia AI",
        description: "Schemat function calling generowany automatycznie",
      },
      mcpServer: {
        label: "Serwer MCP",
        description:
          "Połącz z Claude Desktop, Cursor lub dowolnym klientem MCP",
      },
      reactNative: {
        label: "React Native",
        description: "Ekrany iOS i Android z tej samej definicji",
      },
      cron: {
        label: "Zadanie Cron",
        description:
          "Zaplanuj dowolny endpoint do uruchamiania według harmonogramu",
      },
      websocket: {
        label: "Zdarzenia WebSocket",
        description:
          "Wypychaj aktualizacje do podłączonych klientów po zakończeniu",
      },
      electron: {
        label: "Aplikacja Electron",
        description:
          "Natywna aplikacja desktopowa przez te same kontrakty endpoint",
      },
      adminPanel: {
        label: "Panel administracyjny",
        description: "Auto-generowany interfejs admina, bez dedykowanego kodu",
      },
      vibeFrame: {
        label: "Widget VibeFrame",
        description: "Osadzalny widget iframe dla dowolnej strony",
      },
      remoteSkill: {
        label: "Umiejętność agenta",
        description:
          "Wywoływalna przez agentów AI jako strukturalna umiejętność",
      },
      vibeBoard: {
        label: "Węzeł Vibe Sense",
        description:
          "Węzeł w grafie przepływu danych na żywo — ten sam endpoint",
      },
    },
  },

  deleteFolderQuote: "Usuń folder. Feature przestaje istnieć wszędzie naraz.",

  platformMarkersSection: {
    title: "Dostęp do platformy to jedna tablica enum",
    para1:
      "Nie piszesz oddzielnych warstw uprawnień dla każdej platformy. Dostęp do platformy jest deklarowany w samej definicji — jedna tablica enum, którą każda platforma odczytuje natywnie w czasie wykonania.",
    codeComment:
      "// Ta pojedyncza tablica kontroluje, gdzie pojawia się feature",
    cliOff: "  CLI_OFF,         // blokuje CLI",
    mcpVisible: "  MCP_VISIBLE,     // opt-in do listy narzędzi MCP",
    remoteSkill: "  REMOTE_SKILL,    // umieszcza w pliku umiejętności agenta",
    productionOff: "  PRODUCTION_OFF,  // wyłącza w produkcji",
    para2:
      "Ta sama definicja. To samo miejsce. Brak plików konfiguracyjnych do synchronizacji. Brak oddzielnych systemów uprawnień na platformę.",
  },

  noApiSplitQuote: "Nie ma API dla ludzi i API dla AI. Jest tylko narzędzie.",

  demoSection: {
    title: "Demo na żywo: Thea buduje endpoint",
    subtitle:
      "Zamiast abstrakcyjnie wyjaśniać wzorzec, pozwól mi pokazać, jak wygląda w praktyce.",
    theaIntro:
      "Thea to administrator AI tej platformy. Działa na produkcji 24/7, operując przez te same kontrakty endpoint co każdy użytkownik — ta sama walidacja, te same uprawnienia, bez tylnych drzwi. I może delegować pracę do lokalnej maszyny.",
    demoStory:
      "Poprosiłem Thea o zbudowanie nowego endpointu — explain-to-my-boss — używając Claude Code na moim PC. Podajesz techniczną decyzję. Zwraca nietech niczne uzasadnienie, w które twój menedżer naprawdę uwierzy. Każdy programista tego potrzebował.",

    flow: {
      step1: {
        actor: "Ty",
        label: "Zapytaj Thea",
        description:
          "Wpisz zadanie w czacie — dwa pola wejściowe, jedna odpowiedź generowana przez AI, wszystkie platformy, MCP_VISIBLE, własne widgety React i CLI.",
      },
      step2: {
        actor: "Thea",
        label: "Tworzy zadanie",
        description:
          'Thea myśli głośno, tworzy zadanie z targetInstance="hermes" (twoja lokalna maszyna) i przechodzi w stan uśpienia.',
      },
      step3: {
        actor: "Lokalny Hermes",
        label: "Odbiera zadanie",
        description:
          "Lokalna instancja synchronizuje się co 60 sekund. Brak otwartych portów. Twoja maszyna inicjuje połączenie.",
      },
      step4: {
        actor: "Claude Code",
        label: "Buduje endpoint",
        description:
          "Sesja interaktywna. Najpierw czyta istniejące wzorce, tworzy pięć plików, uruchamia vibe check. Zero błędów.",
      },
      step5: {
        actor: "Claude Code",
        label: "Raportuje ukończenie",
        description:
          "Wywołuje complete-task z ID zadania. Status: ukończono. Załączone podsumowanie.",
      },
      step6: {
        actor: "Thea",
        label: "Budzi się",
        description:
          "wakeUp uruchamia się. Thea wznawia rozmowę przez WebSocket, strumieniuje odpowiedź, TTS mówi.",
      },
      step7: {
        actor: "Wynik",
        label: "Istnieje wszędzie",
        description:
          "Formularz web. Polecenie CLI. Narzędzie MCP. Ekran React Native. Wszystko na żywo. Z pięciu plików.",
      },
    },

    proofTitle: "Dowód",
    proofPara:
      "Gdy Claude Code wywołał complete-task, trzy rzeczy istniały, których pięć minut wcześniej nie było:",
    proof1:
      "Własny widget React — dramatyczny nagłówek, animowany gradient na wyjściu AI, fałszywy wynik dopasowania korporacyjnego.",
    proof2:
      "Widget CLI — baner ASCII, spinner gdy AI myśli, uzasadnienie drukowane linia po linii na zielono.",
    proof3:
      "Narzędzie MCP — explain-to-my-boss_POST — ponieważ MCP_VISIBLE było w definicji. Claude Desktop może teraz wyjaśniać twoje decyzje twojemu szefowi.",
    proofClosing:
      "Jedna definicja. Łącznie pięć plików. Trzy zupełnie różne interfejsy. Kontrakt endpoint się nie zmienił. Tylko warstwa prezentacji.",
  },

  underTheHoodSection: {
    title: "Pod maską",
    definitionTitle: "definition.ts — żyjący kontrakt",
    definitionPara:
      "Definicja nie jest generatorem kodu. To żyjący kontrakt, który każda platforma odczytuje natywnie w czasie wykonania. Zmień ją — wszystko się aktualizuje. Usuń folder — nic nie psuje się w dół strumienia. Nie ma wygenerowanego kodu do posprzątania.",
    repositoryTitle: "repository.ts — nigdy throw",
    repositoryPara:
      "Funkcje repozytorium nigdy nie rzucają. Błędy propagują jako dane — typowane, explicite i możliwe do złapania przez wywołującego. AI może rozumować o ścieżkach błędów. Brak niespodziewanych wyjątków.",
    repositoryCodeComment: "// Zwraca ResponseType<T> — nigdy nie rzuca",
    routeTitle: "route.ts — cztery linie",
    routePara:
      "route.ts to cztery linie. endpointsHandler obsługuje walidację, uwierzytelnianie, logowanie i ekspozycję dla wszystkich 13 platform. To cały most.",
    statsTitle: "Liczby",
    statEndpoints: "374 endpointy",
    statEndpointsDetail: "Jeden wzorzec, zastosowany 374 razy",
    statAny: "Zero `any`",
    statAnyDetail: "Wymuszane w czasie budowania, nie konwencja",
    statLanguages: "Trzy języki",
    statLanguagesDetail:
      'Sprawdzane w czasie kompilacji — t("typo.here") to błąd kompilatora',
    statsClosing: "To nie jest konwencja. Jest wymuszane w czasie budowania.",
  },

  onePatternQuote: "Jeden wzorzec. Powtórzony 374 razy.",

  vibeSenseTeaser: {
    eyebrow: "Następnie w Video 2",
    title: "Vibe Sense: Potok jest platformą",
    description:
      "Każdy węzeł w grafie Vibe Sense to zwykły endpoint next-vibe. Ten sam createEndpoint(). Ta sama struktura 3 plików. Wskaźnik EMA to endpoint. Ewaluator progowy to endpoint. I ponieważ to endpoint — możesz go wywołać z CLI, z AI, skądkolwiek.",
    calloutLine: "Potok jest platformą.",
    teaser:
      "Vibe Sense to po prostu... więcej endpointów. To samo, zastosowane do danych szeregów czasowych. Lejki leadów. Ekonomia kredytów. Wzrost użytkowników. Twoja platforma obserwuje siebie.",
    cta: "Czytaj: Vibe Sense — Trzecia warstwa",
  },

  closing: {
    title: "Zdefiniuj raz. Istnieje wszędzie.",
    para: "WordPress dał każdemu moc publikowania. next-vibe daje ci moc budowania platform, które działają w sieci, na urządzeniach mobilnych, w CLI, agentach AI i automatyzacji — które obserwują siebie, rozumują o własnych danych i działają na podstawie tego, co znajdą.",
    cta: "Daj gwiazdkę next-vibe na GitHub",
    ctaLink: "https://github.com/techfreaque/next-vibe",
  },
};
