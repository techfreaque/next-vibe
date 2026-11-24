import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternatywy dla OpenRoutera z modelami bez cenzury (2026) | {{appName}}",
    description:
      "Porównaj OpenRouter z Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT i {{appName}}. Sprawdź opłaty, własny hosting, filtry i prywatność.",
    category: "Przewodnik dla deweloperów",
    imageAlt: "Alternatywy dla OpenRoutera dla deweloperów, porównanie",
    keywords:
      "alternatywa dla OpenRoutera, alternatywy dla OpenRoutera, OpenRouter kontra NanoGPT, strony jak OpenRouter, bramka API LLM, API LLM bez cenzury, jeden klucz API do wszystkich modeli, API zgodne z OpenAI, API zgodne z Anthropic, modele bez cenzury OpenRouter, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla deweloperów",
    readTime: "9 min czytania",
    title: "Alternatywy dla OpenRouter do przekazywania zapytań do modeli",
    subtitle:
      "{{count}} alternatyw i {{appName}} w porównaniu: formaty API, modele bez cenzury, opłaty. Sprawdzone {{date}}.",
  },
  intro: {
    lead: "OpenRouter zapewnia dostęp do wielu dostawców przez jeden klucz API i ma czat w przeglądarce. W planie Standard podaje 5,5% opłaty platformowej. Porównaj inne bramki, jeśli zależy ci na własnym hostingu, dokładniejszych limitach lub innym rozliczaniu.",
    p2: "Sprawdziliśmy bramki w chmurze, samodzielnie hostowane proxy i aplikacje z modelami bez cenzury w oficjalnych dokumentacjach i cennikach. Sami kupujemy dostęp od OpenRoutera. Przez niego działa {{openRouterModels}} naszych modeli.",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Rozstrzyga sześć pytań.",
    catalog:
      "Katalog: ile modeli, z ilu laboratoriów i czy są tam te, których używasz dziś?",
    uncensored: "Modele bez cenzury: ile ma usunięte odmowy i jakiego rodzaju?",
    formats:
      "Formaty: tylko OpenAI chat completions, czy też Responses API i Anthropic Messages API, z których korzystają agenty do kodowania?",
    billing:
      "Rozliczenie: cena katalogowa plus opłata, marża czy subskrypcja? I co się dzieje przy zerowym saldzie?",
    data: "Dane: czy prompty są zapisywane, logowane albo używane do trenowania i czy to opt-in?",
    chat: "Czat: czy osoby, które nie piszą kodu, mogą używać tych samych modeli w przeglądarce?",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: jeden klucz, każdy rodzaj modelu",
    intro:
      "{{modelCount}} modeli czatu pod jednym kluczem, {{uncensored}} z nich bez cenzury.",
    models:
      "Modele: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM i Qwen obok {{uncensored}} modeli bez cenzury. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, przez co ma przeciwne poglądy polityczne.",
    formats:
      "Formaty: OpenAI chat completions, OpenAI Responses API i Anthropic Messages API. Każde SDK i każdy agent do kodowania wskazuje na jeden base URL.",
    billing:
      "Rozliczenie: jedno saldo kredytów, nasza marża {{markup}}% ponad to, co płacimy. Pierwszy zakup odblokowuje klucze API, plany zaczynają się od {{apiSubPrice}} miesięcznie.",
    chat: "Czat: te same modele w czacie webowym z folderami, narzędziami i generowaniem obrazów, wideo i muzyki. Osoby spoza działu dev też dostają modele.",
    openRouter:
      "OpenRouter w środku: {{openRouterModels}} naszych modeli idzie przez OpenRoutera. Te same modele, jedno konto razem z modelami bez cenzury.",
    weak: "Gdzie jesteśmy słabsi: katalog OpenRoutera jest dużo większy, pozwala podpiąć własne klucze dostawców i wybierać dostawcę dla każdego zapytania, a jego ceny są bliżej katalogowych, bo my doliczamy marżę. Jeśli potrzebujesz rzadkiego modelu, OpenRouter pewnie go ma.",
    codeLabel: "Przenosiny klienta OpenAI SDK: zmień base URL i klucz",
    docsLink: "Dokumentacja API: endpointy, uwierzytelnianie i limity",
    formatsLink: "API zgodne z OpenAI i Anthropic, wyjaśnione",
    toolsLink: "Jeden klucz w Claude Code, Codex CLI, Aiderze i innych",
  },
  models: {
    title: "{{apiUncensored}} modeli bez cenzury, które wywołasz już dziś",
    intro:
      "Każdy model bez cenzury w API, z identyfikatorem, który podajesz jako model. Od najtańszego.",
    colModel: "Model",
    colId: "ID w API",
    colContext: "Kontekst",
    colPrice: "Za wiadomość",
    footnote:
      "Cena jednej wiadomości referencyjnej z naszą marżą {{markup}}%. Etykieta pod nazwą mówi, jak powstał dany model.",
  },
  list: {
    title: "{{count}} alternatyw, jedna po drugiej",
    intro:
      "Według ich własnych stron, sprawdzone {{date}}. Czym jest każda, jak działa jej API, jakie ma modele i ile kosztuje.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Modele:",
    price: "Cena:",
    priceValue: "Za darmo: {{free}}. Płatnie: {{plans}}.",
    pro: "Największy plus:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} kontra {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  stay: {
    title: "Kiedy OpenRouter nadal jest dobrym wyborem",
    intro: "Czasem oryginał to lepsze narzędzie.",
    rare: "Potrzebujesz niszowego modelu albo konkretnego dostawcy, którego nie obsługuje nikt inny z tej listy.",
    callout:
      "Wiele zespołów ma oba: OpenRoutera do długiego ogona i drugi klucz do modeli bez cenzury oraz czatu dla całego zespołu.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla OpenRoutera?",
      a: "Zależy, czego ci w OpenRouterze brakuje. Dużo modeli bez cenzury i płatność za użycie: NanoGPT. Własne modele Venice i prywatność: Venice. Lokalnie i za darmo: Ollama. Modele bez cenzury, otwarte i mainstreamowe plus czat dla zespołu na jednym kluczu: {{appName}}.",
    },
    cheaper: {
      q: "Czy jest tańsza alternatywa dla OpenRoutera?",
      a: "Porównuj cenę modelu, nie opłatę. API prosto od dostawcy omija każdego pośrednika. Między bramkami ceny różnią się dla każdego modelu i często się zmieniają. Na {{appName}} płacisz to, co my, plus {{markup}}% marży, a każda strona modelu pokazuje cenę za wiadomość.",
    },
    uncensored: {
      q: "Która alternatywa dla OpenRoutera ma modele bez cenzury?",
      a: "NanoGPT, Venice, uncensored.ai, Gab AI i {{appName}} udostępniają modele bez cenzury przez API. {{appName}} ma ich teraz w API {{apiUncensored}}: abliterowane i dostrojone obok {{ownModel}}.",
    },
    sdk: {
      q: "Czy mogę zostawić swój kod z OpenAI SDK?",
      a: "Tak. Zmieniasz base URL i klucz API, resztę zostawiasz. Identyfikatory modeli różnią się między bramkami, więc je też podmień. Przykład: {{example}}.",
    },
    anthropic: {
      q: "Czy to działa z SDK Anthropic i agentami do kodowania?",
      a: "Na {{appName}} tak: Anthropic Messages API działa obok formatów OpenAI, więc Claude Code i inne agenty łączą się jednym kluczem, razem z modelami bez cenzury.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla OpenRoutera?",
      a: "Ollama jest darmowa, jeśli twój sprzęt udźwignie model. Sam OpenRouter ma darmowe modele z dziennymi limitami. {{appName}} daje co miesiąc darmowe kredyty na czat, a API odblokowuje pierwszy zakup.",
    },
    apiLink: "API LLM bez cenzury: identyfikatory, kod i limity",
    veniceLink: "Alternatywy dla Venice AI, porównanie",
    keysLink: "Zarządzaj kluczami API",
  },
  cta: {
    title: "Jeden klucz. Każdy model. Mniej odmów.",
    subtitle:
      "Najpierw sprawdź modele w czacie: {{guestCredits}} darmowych kredytów miesięcznie, bez konta.",
    start: "Wypróbuj model bez cenzury",
    docs: "Przeczytaj dokumentację API",
  },
};
