import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Show HN: next-vibe — jeden endpoint, każda powierzchnia",
    description:
      "Post Show HN dla next-vibe i rozumowanie za nim. Supremacja TypeScript, zunifikowane powierzchnie i przypadkowy silnik grafu.",
    category: "Społeczność",
    imageAlt: "Show HN: next-vibe",
    keywords:
      "Hacker News, Show HN, next-vibe, TypeScript, MCP, zunifikowana powierzchnia, open source",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "Show HN",
    readTime: "5 min czytania",
    title: "Show HN: next-vibe — jeden endpoint, każda powierzchnia",
    subtitle: "Właściwy post — i rozumowanie za nim.",
  },
  post: {
    label: "Post",
    body: "Znudziło mi się pisanie tej samej logiki pięć razy.\n\nKażda funkcja potrzebowała formularza web, polecenia CLI, narzędzia MCP dla agentów AI, czasem ekranu mobilnego. Ta sama walidacja Zod, to samo i18n, ta sama obsługa błędów — tylko inaczej ubrana. Więc zbudowałem next-vibe: framework, w którym piszesz jeden plik definition.ts na funkcję i renderuje się jako wszystkie jednocześnie.\n\nReguła jest surowa: typy muszą być całkowicie zgodne. Żadnego any, żadnego unknown, żadnych asercji typów (as X), żadnych instrukcji throw. Jeśli twoje typy są błędne, twoja architektura jest błędna. Zbudowaliśmy vibe check do egzekwowania — Oxlint + ESLint + TypeScript równolegle, z niestandardowymi wtyczkami dla reguł specyficznych dla projektu.\n\nZasila też unbottled.ai (50+ modeli AI, kontrolowana przez użytkownika cenzura). Ta sama baza kodu działa jako aplikacja web Next.js, serwer dev TanStack/Vite, aplikacja mobilna React Native, CLI, serwer MCP, system cron i magistrala zdarzeń WebSocket. Jedna definicja endpointu. Bez duplikacji.\n\nNajdziwniejsza część: porzucony bot tradingowy, który napisałem lata temu, stał się najbardziej interesującą częścią. Vibe Sense to węzłowy silnik analityki — źródła danych, wskaźniki (EMA, SMA, Wstęgi Bollingera), ewaluatory emitujące sygnały. Bez wykonywania zleceń. Każdy węzeł to standardowy endpoint HTTP: można go curlovać, jest dostępny przez MCP, indywidualnie testowalny. Silnik grafu to harmonogramista, nie DSL.",
    note: "To jest post idący na Hacker News. Tytuł i pierwsze dwa zdania są wszystkim.",
  },
  behind: {
    label: "Za postem",
    subtitle:
      "Dlaczego ten kąt, co jeszcze rozważaliśmy i jakie były kompromisy.",
  },
  whyAngle: {
    title: "Dlaczego kąt zunifikowanej powierzchni",
    p1: "Ból, z którym można się utożsamić — pisanie tej samej rzeczy pięć razy — trafia do każdego developera, który zbudował prawdziwy produkt. To nie jest abstrakcja. Każdy inżynier, który utrzymywał endpoint REST, wrapper CLI i klienta mobilnego dla tej samej funkcji, zna to uczucie.",
    p2: "Reguły TypeScript są najbardziej kontrowersyjną częścią. Inżynierowie HN mają silne opinie na temat any i throw. Zaczynanie od zunifikowanej powierzchni daje szersze zaangażowanie; kąt TypeScript napędza komentarze.",
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
      "Vibe Sense zaczął jako bot tradingowy. Nigdy nie wykonywał zleceń — tylko obserwował ceny i wyzwalał sygnały. Kiedy go porzuciłem, architektura potoku przeżyła: źródła danych łączą się ze wskaźnikami, wskaźniki zasilają ewaluatory, ewaluatory wysyłają sygnały, sygnały wyzwalają akcje. Każdy węzeł to endpoint HTTP.",
    hookForComments:
      "Każdy węzeł w grafie to tylko endpoint HTTP — możesz zrobić curl do dowolnego kroku w potoku, testować go w izolacji lub wywoływać z agenta AI. Silnik grafu to harmonogramista, nie DSL.",
    whyItMatters:
      "Ponieważ każdy węzeł to standardowy endpoint, są one indywidualnie testowalne przez CLI, dostępne dla agentów AI przez MCP i buforowane z tą samą infrastrukturą co wszystko inne.",
  },
  alternatives: {
    title: "Alternatywne tytuły, które rozważaliśmy",
    items: {
      alt1: "Show HN: Zakazałem any, unknown, object i as X w naszej bazie kodu TypeScript — oto egzekutor",
      alt2: "Show HN: next-vibe — TypeScript tak rygorystyczny, że napisaliśmy własny linter zakazujący throw",
      alt3: "Show HN: next-vibe — jedna definicja endpointu, sześć powierzchni (web/CLI/MCP/native/cron/graph)",
      alt4: "Show HN: Zbudowaliśmy silnik grafu szeregów czasowych, gdzie każdy węzeł to tylko endpoint HTTP",
    },
  },
  cta: {
    github: "Zobacz na GitHubie",
    githubUrl: "github.com/techfreaque/next-vibe",
  },
};
