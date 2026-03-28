import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Show HN: next-vibe — Szkic — Blog next-vibe",
    description:
      "Post na Hacker News, który piszemy. Supremacja TypeScript, zunifikowane powierzchnie i bot tradingowy, który nie może handlować.",
    category: "Społeczność",
    imageAlt: "Show HN: next-vibe",
    keywords:
      "Hacker News, Show HN, next-vibe, TypeScript, MCP, zunifikowana powierzchnia, open source",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "Społeczność",
    readTime: "5 min czytania",
    title: "Show HN: next-vibe",
    subtitle:
      "Post na Hacker News, który piszemy. Dwa kąty. Jedna decyzja. Oto rozumowanie.",
    hnBadge: "Show HN",
    hnSubtext: "Szkic w trakcie",
  },
  intro: {
    title: "Piszemy post Show HN",
    paragraph1:
      "Każdy projekt techniczny w końcu pyta: jak przedstawić się Hacker News? Tytuł jest wszystkim. Pierwsze dwa zdania decydują, czy ktoś kliknie, czy przewinie.",
    paragraph2:
      "Mamy dwa kąty. Oba są prawdziwe. Oba są prawdziwymi częściami next-vibe. Pytanie brzmi, który mocniej ląduje na HN — i który rozpoczyna rozmowę, którą naprawdę chcemy przeprowadzić.",
  },
  optionA: {
    badge: "Opcja A",
    title: "Supremacja TypeScript",
    hnTitle:
      "Show HN: next-vibe – framework TypeScript-first, gdzie any, unknown, object, as X i throw są zakazane",
    body: "Większość projektów TypeScript traktuje system typów jako opcjonalne zabezpieczenia. My traktujemy go jako strukturę nośną. Reguła w next-vibe jest prosta: typy muszą być całkowicie zgodne — żadnego any, żadnego unknown, żadnego gołego object, żadnych asercji typów (as X), żadnych wyjątków. Jeśli twoje typy są błędne, architektura jest błędna.\n\nAby to wyegzekwować, zbudowaliśmy vibe check: narzędzie jakości kodu, które uruchamia Oxlint (Rust), ESLint i sprawdzanie typów TypeScript równolegle.",
    reasoning:
      "Hardkorowi użytkownicy TypeScript zaangażują się natychmiast. Zakazane wzorce są konkretne i kontrowersyjne. Inżynierowie HN mają opinie na temat any i throw. Ten kąt zaprasza do sprzeciwu — a na HN sprzeciw to zaangażowanie.",
  },
  optionB: {
    badge: "Opcja B",
    title: "Zunifikowana powierzchnia",
    hnTitle:
      "Show HN: next-vibe – jedna definicja endpointu staje się web UI, CLI, narzędziem MCP, natywną aplikacją, zadaniem cron i węzłem grafu",
    body: "Znudziło mi się pisanie tej samej logiki pięć razy. Każda funkcja potrzebowała formularza web, polecenia CLI, narzędzia MCP dla agentów AI, czasem ekranu mobilnego. Ta sama walidacja, to samo i18n, ta sama obsługa błędów — tylko inaczej ubrana.\n\nnext-vibe rozwiązuje to za pomocą jednego pliku definition.ts na funkcję. Opisujesz pola, schematy Zod, etykiety, typy błędów i przykłady raz.",
    reasoning:
      "Ból, z którym można się utożsamić: pisanie tej samej rzeczy pięć razy. Rozwiązanie jest konkretne i możliwe do demonstracji. Kąt węzła grafu jest nowatorski. Kąt MCP + agentów AI jest aktualny.",
  },
  bannedPatterns: {
    title: "Zakazane wzorce",
    subtitle: "To nie są preferencje stylistyczne. To reguły architektoniczne.",
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
        "Użyj ResponseType<T> z success(data) lub fail({message, errorType}). Błędy to dane, nie wyjątki.",
    },
    hardcodedStrings: {
      name: "brak zakodowanych na stałe stringów w JSX",
      description:
        "Checker wykrywa nie przetłumaczone literalne stringi. Każdy string potrzebuje klucza tłumaczenia.",
    },
  },
  vibeSense: {
    title: "Kąt bota tradingowego",
    subtitle: "Bot tradingowy, który nie może handlować",
    description:
      "Vibe Sense to węzłowy silnik analityki rynkowej. Źródła danych, wskaźniki (EMA, SMA, Wstęgi Bollingera), ewaluatory emitujące sygnały i węzły akcji reagujące na te sygnały. Bez wykonywania zleceń.",
    hookForComments:
      "Każdy węzeł w grafie to tylko endpoint HTTP — możesz zrobić curl do dowolnego kroku w potoku, testować go w izolacji lub wywoływać z agenta AI. Silnik grafu to harmonogramista, nie DSL.",
    whyItMatters:
      "Ponieważ każdy węzeł to standardowy endpoint, są one indywidualnie testowalne przez CLI, dostępne dla agentów AI przez MCP i buforowane z tą samą infrastrukturą co wszystko inne.",
  },
  angles: {
    title: "Kąty uszeregowane według prawdopodobnego traction na HN",
    intro:
      "Na podstawie rozpoznawania wzorców w stosunku do tego, co faktycznie działa na HN:",
    items: {
      typescript: {
        rank: "1",
        title: "Supremacja TypeScript + checker",
        reason:
          "Kontrowersyjny, techniczny, konkretny. Inżynierowie mają opinie.",
      },
      unifiedSurface: {
        rank: "2",
        title:
          "Zunifikowana powierzchnia — jedna definicja, wszystkie powierzchnie",
        reason:
          "Ból, z którym można się utożsamić. Każdy developer pisał ten sam formularz pięć razy.",
      },
      vibeSense: {
        rank: "3",
        title: "Silnik grafu Vibe Sense na endpointach",
        reason:
          "Nowatorska architektura. Endpoint HTTP jako węzeł grafu to ciekawa koncepcja.",
      },
      agentCoordination: {
        rank: "4",
        title: "Warstwa koordynacji agentów AI",
        reason:
          "Ciekawe, ale zakopane w treści. Lepiej jako haczyk w komentarzach.",
      },
      freeSpeech: {
        rank: "5",
        title: "Kąt wolności słowa unbottled.ai",
        reason:
          "Generuje dyskusję, ale ryzykuje wykolejenie rozmowy technicznej.",
      },
    },
  },
  titleAlternatives: {
    title: "Alternatywne opcje tytułu",
    items: {
      alt1: "Show HN: Zakazałem any, unknown, object i as X w naszej bazie kodu TypeScript — oto egzekutor",
      alt2: "Show HN: next-vibe – TypeScript tak rygorystyczny, że napisaliśmy własny linter zakazujący throw",
      alt3: "Show HN: next-vibe – jedna definicja endpointu, sześć powierzchni (web/CLI/MCP/native/cron/graph)",
      alt4: "Show HN: Zbudowaliśmy silnik grafu szeregów czasowych, gdzie każdy węzeł to tylko endpoint HTTP",
    },
  },
  decision: {
    title: "Rekomendacja",
    option: "Opcja A",
    reasoning:
      "Opcja A dla bardziej opiniotwórczego i technicznego haczyka. Hardkorowi użytkownicy TypeScript zaangażują się natychmiast. Opcja B jeśli chcesz pokazać pełną szerokość. Kąt zakazanych wzorców TypeScript jest najbardziej konkretny, najbardziej kontrowersyjny i najbardziej prawdopodobny do napędzania komentarzy.",
    cta: "Zobacz na GitHubie",
    github: "github.com/techfreaque/next-vibe",
  },
  ui: {
    hnSiteName: "Hacker News",
    hnNavFull:
      "Hacker News | nowe | poprzednie | komentarze | pytaj | pokaż | praca | dodaj",
    hnNavShort:
      "nowe | poprzednie | komentarze | pytaj | pokaż | praca | dodaj",
    hnPostMeta: "42 punkty od techfreaque 2 godziny temu | 18 komentarzy",
    hnRecommended: "polecany",
    hookForCommentsLabel: "Haczyk do komentarzy",
  },
};
