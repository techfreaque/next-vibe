import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nieocenzurowane API LLM: modele abliterowane | {{appName}}",
    description:
      "Modele abliterowane i bez cenzury przez jedno API zgodne z OpenAI i Anthropic. Identyfikatory modeli, ceny na tle innych hostów, co naprawdę dopuszczają Vertex, Azure, Bedrock i Together, kod i limity.",
    category: "Przewodnik dla deweloperów",
    imageAlt: "Nieocenzurowane API LLM z endpointami zgodnymi z OpenAI",
    keywords:
      "nieocenzurowane API LLM, API AI bez cenzury, API modeli abliterowanych, abliterowany LLM API, API LLM bez filtra treści, API LLM bez filtrów, API zgodne z OpenAI bez cenzury, NSFW LLM API, Gemini API wyłączenie safety settings, Vertex AI bez cenzury, Together AI bez cenzury, alternatywa dla Azure OpenAI bez cenzury, alternatywa dla Bedrock bez cenzury, hostowane modele abliterowane, alternatywa dla Venice API, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla deweloperów",
    readTime: "12 min czytania",
    title: "Nieocenzurowane API LLM. Twoje SDK. Bez odruchu odmowy.",
    subtitle:
      "{{count}} nieocenzurowanych modeli pod jednym kluczem zgodnym z OpenAI i Anthropic. Identyfikatory, kontekst i ceny prosto z naszego rejestru.",
  },
  intro: {
    lead: "Twoja aplikacja potrzebuje modelu, który odpowiada. Nie takiego, który poucza, i nie takiego, który odrzuca połowę testowych promptów. API z głównego nurtu filtrują z założenia, a własne abliterowane wagi to wynajem GPU.",
    p2: "{{appName}} udostępnia {{count}} nieocenzurowanych modeli przez te same endpointy /v1 co każdy model z głównego nurtu. Zmień base URL, zostań przy SDK OpenAI albo Anthropic, wybierz nieocenzurowany model. Poniżej lista, kod, ceny obok innych hostów, co naprawdę dopuszczają wielkie chmury i uczciwy haczyk.",
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
      "Brak sztywnego limitu zapytań. Rozliczenie za każde wywołanie z Twoich kredytów i wysoka ochrona przed nadużyciami. Odpowiedzi 429 od dostawcy modelu przekazujemy dalej z nagłówkiem Retry-After.",
    tools:
      "Wywołania narzędzi działają tylko w modelach, które je obsługują. Tabela pokazuje które. W innym razie dostajesz 400 tools_not_supported.",
    refusals:
      "Bez cenzury nie znaczy nieomylny. Model wciąż może odmówić albo pomylić fakty. Przetestuj prompty na dwóch modelach, zanim się zdecydujesz.",
  },
  privacy: {
    title: "Co dzieje się z twoimi promptami",
    intro: "API zachowuje rachunek, nie historię czatu.",
    noStore:
      "API nie tworzy wątków czatu. Zapisuje tylko wpis rozliczeniowy: jaki model, ile kredytów.",
    upstream:
      "Każdy prompt przechodzi przez nas do dostawcy, który obsługuje model. Do tego, co otrzymuje, stosuje się jego regulamin. Nasza polityka prywatności nie zawiera osobnej obietnicy braku logowania ani braku trenowania, więc oceniaj nas po tym, co faktycznie mówi.",
    callout:
      "Jeśli prompty nigdy nie mogą opuścić twojej infrastruktury, uruchom abliterowane wagi na własnym sprzęcie. W każdym innym przypadku API szybciej trafi na produkcję.",
  },
  abliterated: {
    title: "API modeli abliterowanych: kto serwuje które wagi",
    intro:
      "Te same abliterowane wagi stoją u kilku hostów. Oto ile każdy bierze za token, odczytane dziś z ich publicznych list modeli.",
    honest:
      "Uczciwa ocena: w cenie wygrywają routery. OpenUncensored i Refuseless sprzedają GLM 5.3 Flash i DeepSeek V4.1 Flash abliterated po $0.12 za wejście. Nasza cena z listy zawiera marżę {{markup}}%. Płacisz ją za jeden klucz do modeli bez cenzury, otwartych i z głównego nurtu, za media, format Anthropic i czat, z którego może korzystać twój zespół.",
  },
  noFilter: {
    title: "API LLM bez filtra treści: co naprawdę znaczy wyłączony",
    intro:
      "Każda duża chmura pozwala obniżyć filtr. Żadna nie usuwa wyuczonych odmów modelu ani jego polityki użytkowania.",
    vertex:
      "Vertex AI i Gemini API: progi bezpieczeństwa można ustawić na OFF, a OFF jest domyślne na Vertex od gemini-3.5-flash. Ochrona dzieci i inne podstawowe szkody pozostają blokowane, a alignment Gemini nadal odmawia. Prohibited Use Policy Google zakazuje treści jednoznacznie seksualnych i obchodzenia filtrów bezpieczeństwa, z wyjątkami dla pracy edukacyjnej, dokumentalnej, naukowej lub artystycznej. Własne wagi: Model Garden self-deploy na kontenerach vLLM lub TGI.",
    together:
      "Together AI: 24 modele czatu serverless, żaden bez cenzury. Regulamin zakazuje treści obscenicznych i pornografii. Własne wagi działają na dedykowanych endpointach od $5.49 za godzinę H100, a wgrywać można tylko fine-tuny architektury, którą Together już obsługuje.",
    azure:
      "Azure OpenAI: filtry domyślnie włączone, wyłączenie dopiero po zatwierdzonym wniosku, a Code of Conduct i tak zakazuje erotycznych i romantycznych chatbotów.",
    bedrock:
      "AWS Bedrock: brak filtra, dopóki nie podepniesz Guardrail, ale odmowy i polityka AWS zostają. Abliterowane wagi wymagają Custom Model Import, rozliczanego za minutę mocy.",
    azureLink: "Alternatywy dla Azure OpenAI bez cenzury, w całości",
    bedrockLink: "Alternatywy dla AWS Bedrock bez cenzury, w całości",
  },
  others: {
    title: "Inne nieocenzurowane API, uczciwie",
    intro:
      "Nie jesteśmy jedyną opcją. U części z nich sami kupujemy. Fakty z ich własnej dokumentacji, list modeli i cenników, odczytane {{date}}.",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    routerLink:
      "Przejście z OpenRoutera: jeden klucz do wszystkich modeli, trzy formaty",
    openRouterAlternatives: "Alternatywy dla OpenRouter w porównaniu",
    veniceAlternatives: "Alternatywy dla Venice AI w porównaniu",
    freedomGptAlternatives: "Alternatywy dla FreedomGPT w porównaniu",
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
      a: "API nie tworzy wątków czatu, zapisuje tylko wpis rozliczeniowy: model i naliczone kredyty. Każdy prompt przechodzi przez nas do dostawcy, który obsługuje model, na jego własnych zasadach. Nasza polityka prywatności nie zawiera osobnej obietnicy braku logowania. Jeśli potrzebujesz tego w umowie, hostuj samodzielnie.",
    },
    abliterated: {
      q: "Które API serwuje modele abliterowane?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice i {{appName}} serwują abliterowane wagi przez API zgodne z OpenAI. Routery są najtańsze za token. {{appName}} dokłada modele z głównego nurtu, media i czat w przeglądarce pod tym samym kluczem.",
    },
    noFilter: {
      q: "Czy jest API LLM bez filtra treści?",
      a: "Bedrock bez Guardrail i Gemini z safety settings na OFF nie dodają warstwy filtra, ale ich modele zachowują wyuczone odmowy, a polityki zakazują treści seksualnych. Azure wymaga zatwierdzonego wniosku, by wyłączyć filtry. Dla modeli, które nie odmawiają, użyj wag abliterowanych lub dostrojonych: hostowanych tutaj, na routerach powyżej albo na własnych GPU.",
    },
    vertex: {
      q: "Czy mogę wyłączyć filtry bezpieczeństwa Gemini?",
      a: "Tak. W Gemini API kategorie, których nie ustawisz, domyślnie mają Off od Gemini 2.5, a na Vertex OFF jest domyślne od gemini-3.5-flash. Podstawowe szkody, jak ochrona dzieci, pozostają blokowane, wyuczone odmowy Gemini zostają, a polityka Google zakazuje treści jednoznacznie seksualnych i obchodzenia filtrów bezpieczeństwa.",
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
