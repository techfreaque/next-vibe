import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nieocenzurowane API LLM: modele abliterowane | {{appName}}",
    description:
      "Modele abliterowane i bez cenzury przez jedno API zgodne z OpenAI i Anthropic. ID modeli, kontekst, cena za model, przykład w curl i Pythonie, limity.",
    category: "Przewodnik dla deweloperów",
    imageAlt: "Nieocenzurowane API LLM z endpointami zgodnymi z OpenAI",
    keywords:
      "nieocenzurowane API LLM, API AI bez cenzury, API modeli abliterowanych, abliterowany LLM API, API zgodne z OpenAI bez cenzury, NSFW LLM API, API bez filtra treści, hostowane modele abliterowane, alternatywa dla Venice API, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla deweloperów",
    readTime: "8 min czytania",
    title: "Nieocenzurowane API LLM. Twoje SDK. Bez odruchu odmowy.",
    subtitle:
      "{{count}} nieocenzurowanych modeli pod jednym kluczem zgodnym z OpenAI i Anthropic. Identyfikatory, kontekst i ceny prosto z naszego rejestru.",
  },
  intro: {
    lead: "Twoja aplikacja potrzebuje modelu, który odpowiada. Nie takiego, który poucza, i nie takiego, który odrzuca połowę testowych promptów. API z głównego nurtu filtrują z założenia, a własne abliterowane wagi to wynajem GPU.",
    p2: "{{appName}} udostępnia {{count}} nieocenzurowanych modeli przez te same endpointy /v1 co każdy model z głównego nurtu. Zmień base URL, zostań przy SDK OpenAI albo Anthropic, wybierz nieocenzurowany model. Poniżej lista, kod, limity i uczciwy haczyk.",
    access:
      "Na wstępie: API wymaga płatnego konta. Odblokowuje je każdy plan, od {{subPrice}} miesięcznie. Darmowe i bonusowe kredyty nie.",
    accessLink: "Odblokuj API",
  },
  models: {
    title: "{{count}} nieocenzurowanych modeli w API",
    intro:
      "Każdy aktualny nieocenzurowany model tekstowy, od najtańszego. Wpisz identyfikator dokładnie tak, jak w tabeli, w pole model.",
    colModel: "Model",
    colId: "Identyfikator",
    colContext: "Kontekst",
    colTools: "Narzędzia",
    colPrice: "Za wiadomość",
    yes: "Tak",
    no: "Nie",
    footnote:
      "Za wiadomość to jedna referencyjna wymiana na najtańszej trasie. API rozlicza tokeny, a każda odpowiedź podaje dokładny koszt w usage.credits_charged. GET /v1/models zwraca tę samą listę z cenami za token.",
  },
  code: {
    title: "Jedno zapytanie",
    intro:
      "Najtańszy nieocenzurowany model to teraz {{example}}. Podmień na dowolny identyfikator z tabeli.",
    prompt:
      "Podaj najmocniejsze argumenty za energią jądrową i przeciw niej. Bez zastrzeżeń.",
    curl: "curl",
    python: "OpenAI Python SDK",
    anthropic:
      "Wolisz SDK Anthropic albo Claude Code? Ustaw ten sam base URL bez /v1, a wywołają /v1/messages z tymi samymi modelami i tym samym kluczem.",
  },
  consent: {
    title: "Jeden krok 18+",
    intro:
      "Nieocenzurowane modele są tylko dla dorosłych. API sprawdza to raz.",
    where: "Raz potwierdź na stronie kluczy API, że masz ukończone 18 lat.",
    link: "Otwórz klucze API",
    error:
      "Bez tego zapytanie do nieocenzurowanego modelu zwraca 403 uncensored_consent_required i nic nie jest naliczane.",
    once: "Potem twoje klucze mogą wywoływać nieocenzurowane modele.",
  },
  kinds: {
    title: "Który nieocenzurowany model do jakiej pracy",
    intro: "W tabeli są trzy rodzaje. Zachowują się różnie.",
    abliterated:
      "Abliterowany: model z głównego nurtu albo otwarty, z wyciętym z wag odruchem odmowy. Ten sam trening, ta sama wiedza, ten sam światopogląd. Po prostu odpowiada. Domyślny wybór dla większości aplikacji.",
    fineTuned:
      "Dostrojony: otwarty model douczony na niefiltrowanych danych. Często luźniejszy w tonie, popularny w fikcji i roleplayu.",
    own: "{{ownModel}}: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi. Wybierz go, gdy chcesz stanowisk, których mainstream nie poda.",
    link: "Abliterowany, dostrojony czy z własnym światopoglądem: pełne wyjaśnienie",
  },
  limits: {
    title: "Limity, które warto znać",
    intro: "Twarde krawędzie, zanim wypuścisz produkt.",
    stateless:
      "Bezstanowo. Nie przechowujemy rozmowy. Za każdym razem wysyłaj pełną historię.",
    maxTokens: "Odpowiedź ma limit {{maxTokens}} tokenów na zapytanie.",
    rateLimit:
      "Domyślnie {{rateLimit}} zapytań na minutę na klucz. Powyżej dostajesz 429 z nagłówkiem Retry-After.",
    tools:
      "Wywołania narzędzi działają tylko w modelach, które je obsługują. Tabela pokazuje które. W innym razie dostajesz 400 tools_not_supported.",
    refusals:
      "Bez cenzury nie znaczy nieomylny. Model wciąż może odmówić albo pomylić fakty. Przetestuj prompty na dwóch modelach, zanim się zdecydujesz.",
  },
  privacy: {
    title: "Co dzieje się z twoimi promptami",
    intro: "Zostawiamy rachunek, nie rozmowę.",
    noStore:
      "API nie zapisuje rozmów i nie tworzy wątków. U nas zostaje tylko rekord rozliczeniowy: jaki model, ile kredytów.",
    upstream:
      "Twój prompt trafia do dostawcy, który obsługuje model. Do tego, co otrzymuje, stosuje się jego regulamin.",
    callout:
      "Jeśli prompty nigdy nie mogą opuścić twojej infrastruktury, uruchom abliterowane wagi na własnym sprzęcie. W każdym innym przypadku API szybciej trafi na produkcję.",
  },
  others: {
    title: "Inne nieocenzurowane API, uczciwie",
    intro:
      "Nie jesteśmy jedyną opcją. U części z nich sami kupujemy. Fakty z ich własnej dokumentacji i cenników.",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    routerLink:
      "Przejście z OpenRoutera: jeden klucz do wszystkich modeli, trzy formaty",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Czy jest darmowe nieocenzurowane API LLM?",
      a: "U nas nie. Aplikacja czatu ma darmowe kredyty, API nie. Klucze API odblokowuje każdy plan, od {{subPrice}} miesięcznie. Narzędzia lokalne jak Ollama dają darmowe lokalne API, jeśli twój sprzęt udźwignie model.",
    },
    ids: {
      q: "Które identyfikatory modeli są nieocenzurowane?",
      a: "Teraz {{count}}, w tabeli powyżej z dokładnymi identyfikatorami. GET /v1/models zwraca każdy model, który twój klucz może wywołać, z cenami i obsługą narzędzi.",
    },
    sdk: {
      q: "Czy nieocenzurowane API działa z SDK OpenAI?",
      a: "Tak. Ustaw base_url na base URL {{appName}}, użyj swojego klucza i wpisz nieocenzurowany identyfikator w pole model. SDK Anthropic też działa, z tym samym base URL bez /v1.",
    },
    refuse: {
      q: "Czy nieocenzurowany model nigdy nie odmówi?",
      a: "Odmawia dużo rzadziej, ale nie nigdy. Modele abliterowane tracą wyuczony odruch odmowy, ale nadal mogą odmówić albo się pomylić. Testuj na swoich prawdziwych promptach.",
    },
    logs: {
      q: "Czy {{appName}} zapisuje moje prompty z API?",
      a: "Z API nie zapisujemy żadnej rozmowy, tylko rekord rozliczeniowy: model i naliczone kredyty. Dostawca, który obsługuje model, widzi prompt, na własnych zasadach.",
    },
    local: {
      q: "Czy lepiej samemu hostować modele abliterowane?",
      a: "Jeśli masz GPU i surowe zasady dotyczące danych, tak. Narzędzie lokalne wystawia API zgodne z OpenAI na twoim komputerze. Jeśli chcesz nieocenzurowanych modeli wielkości frontier bez wynajmu sprzętu, hostowane API to tańszy start.",
    },
    docsLink: "Pełna dokumentacja API",
    directoryLink: "Zobacz abliterowane modele w czacie",
  },
  cta: {
    title: "Najpierw przetestuj. Potem podłącz.",
    subtitle:
      "Każdy model z tabeli działa też w aplikacji czatu. Przetestuj tam prompty, potem skopiuj identyfikator do kodu.",
    chat: "Przetestuj nieocenzurowany model w czacie",
    docs: "Czytaj dokumentację API",
  },
};
