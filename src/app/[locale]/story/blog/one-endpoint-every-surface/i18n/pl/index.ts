import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jeden endpoint. Każda powierzchnia. - next-vibe",
    description:
      "Napisz jeden plik definition.ts na funkcję. Renderuje się jako formularz web, polecenie CLI, narzędzie MCP, ekran natywny, zadanie cron - jednocześnie. Bez duplikacji. Typy wymuszone.",
    category: "Architektura",
    imageAlt:
      "Architektura zunifikowanych powierzchni next-vibe - jeden endpoint, każda platforma",
    keywords:
      "next-vibe, TypeScript, zunifikowana powierzchnia, MCP, CLI, definition.ts, open source, framework SaaS",
  },
  hero: {
    backToBlog: "Powrót do bloga",
    category: "Architektura",
    readTime: "5 min czytania",
    title: "Jeden endpoint. Każda powierzchnia.",
    subtitle:
      "Jedna definicja na funkcję. Formularz web, polecenie CLI, narzędzie MCP, ekran natywny, zadanie cron - wszystko naraz. Bez duplikacji.",
  },
  intro: {
    paragraph1:
      "Każda funkcja potrzebowała formularza web, polecenia CLI, narzędzia MCP dla agentów AI, czasem ekranu mobilnego. Ta sama walidacja Zod, to samo i18n, ta sama obsługa błędów - tylko inaczej ubrana. Więc zbudowałem next-vibe: framework, w którym piszesz jeden plik definition.ts na funkcję i renderuje się jako wszystkie jednocześnie.",
    paragraph2:
      "Zasila też {{appName}} - 50+ modeli AI, kontrolowana przez użytkownika cenzura. Ta sama baza kodu działa jako aplikacja web Next.js, serwer dev TanStack/Vite, aplikacja mobilna React Native, CLI, serwer MCP, system cron i magistrala zdarzeń WebSocket. Jedna definicja endpointu. Bez duplikacji.",
  },
  typeRules: {
    title: "Typy muszą się zgadzać. Bez wyjątków.",
    subtitle:
      "To nie są preferencje stylistyczne. To reguły architektoniczne wbudowane we framework.",
    intro:
      "Reguła jest surowa: typy muszą być całkowicie zgodne. Jeśli twoje typy są błędne, twoja architektura jest błędna. Zbudowaliśmy vibe check do egzekwowania - Oxlint + ESLint + TypeScript równolegle, z niestandardowymi wtyczkami dla reguł specyficznych dla projektu.",
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
        "Checker wykrywa nieprzetłumaczone literalne stringi. Każdy string potrzebuje klucza tłumaczenia.",
    },
  },
  vibeSense: {
    title: "Przypadkowy silnik grafu",
    subtitle: "Bot tradingowy, który nie może handlować",
    description:
      "Vibe Sense zaczął jako bot tradingowy. Nigdy nie wykonywał zleceń - tylko obserwował ceny i wyzwalał sygnały. Kiedy go porzuciłem, architektura potoku przeżyła: źródła danych łączą się ze wskaźnikami, wskaźniki zasilają ewaluatory, ewaluatory wysyłają sygnały, sygnały wyzwalają akcje. Każdy węzeł to endpoint HTTP.",
    quote:
      "Każdy węzeł w grafie to tylko endpoint HTTP - możesz zrobić curl do dowolnego kroku w potoku, testować go w izolacji lub wywoływać z agenta AI. Silnik grafu to harmonogramista, nie DSL.",
    whyItMatters:
      "Ponieważ każdy węzeł to standardowy endpoint, są indywidualnie testowalne przez CLI, dostępne dla agentów AI przez MCP i buforowane z tą samą infrastrukturą co wszystko inne. Silnik grafu nie wymyśla własnego języka. Harmonogramuje endpointy.",
  },
  cta: {
    github: "Zobacz na GitHubie",
    clone: "git clone https://github.com/techfreaque/next-vibe",
  },
};
