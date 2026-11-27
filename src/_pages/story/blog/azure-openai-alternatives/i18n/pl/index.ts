import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Azure OpenAI bez cenzury: alternatywy API w porównaniu | {{appName}}",
    description:
      "Azure domyślnie filtruje każdy model i zakazuje erotycznych i romantycznych chatbotów nawet bez filtrów. Porównanie {{appName}}, OpenRouter, Venice, NanoGPT, API z modelami abliterowanymi, Bedrock, Vertex i własnego hostingu.",
    category: "Przewodnik dla deweloperów",
    imageAlt: "Alternatywy dla Azure OpenAI bez cenzury, w porównaniu",
    keywords:
      "alternatywa dla Azure OpenAI bez cenzury, alternatywa dla Azure OpenAI, Azure OpenAI wyłączenie filtra treści, Azure OpenAI bez filtra treści, Azure modified content filtering, Azure abuse monitoring opt out, Azure OpenAI NSFW, API LLM bez filtra treści, nieocenzurowane API LLM, API modeli abliterowanych, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla deweloperów",
    readTime: "10 min czytania",
    title: "Alternatywy dla Azure OpenAI bez cenzury",
    subtitle:
      "Filtry Azure, bramka zatwierdzeń i Code of Conduct, sprawdzone u źródła. Potem {{count}} alternatyw, uczciwie o tym, w czym każda wygrywa. Sprawdzone {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI domyślnie filtruje każdy model. Wyłączenie filtra wymaga zatwierdzonego wniosku. A nawet po zatwierdzeniu Code of Conduct nadal zakazuje erotycznych i romantycznych chatbotów.",
    p2: "Jeśli twój produkt to fikcja, roleplay, towarzysze, red-teaming albo po prostu szczere odpowiedzi, to jest mur, nie ustawienie. Oto dokładnie, na co Azure pozwala, co go zastępuje i jaka zmiana w kodzie przenosi klienta Azure OpenAI na {{appName}}.",
  },
  azure: {
    title: "Co Azure naprawdę filtruje",
    intro: "Prosto z dokumentacji i regulaminów Microsoftu.",
    defaults:
      "Domyślnie włączone: Microsoft Foundry stosuje domyślne ustawienia bezpieczeństwa do każdego modelu poza Whisper. Do High only możesz poluzować je sam.",
    approval:
      "Wyłączenie tylko za zgodą: opcje No filters i Annotate only wymagają zatwierdzenia modyfikowanego filtrowania treści. Wnioskować mogą tylko klienci obsługiwani przez zespół konta Microsoft lub w kwalifikowanym programie.",
    conduct:
      "Wyłączony filtr to nie pozwolenie: Code of Conduct zakazuje treści jednoznacznie seksualnych, w tym seksualnie sugestywnych i fetyszowych, oraz chatbotów erotycznych, romantycznych lub używanych do celów erotycznych albo romantycznych. Dosłowna przemoc, gore i mowa nienawiści też są zakazane.",
    monitoring:
      "Abuse monitoring: oznaczone prompty i odpowiedzi trafiają domyślnie do automatycznej weryfikacji, a w razie potrzeby do pracowników Microsoftu. Dane leżą w magazynie abuse monitoring w geografii twojego zasobu.",
    sunset:
      "Opt-out wygasa: według changelogu Microsoftu z 17 listopada 2026 Modified Abuse Monitoring przestanie być dostępny dla modeli wydanych od 1 listopada 2026, od daty, która nie została jeszcze podana.",
    models:
      "Brak modeli bez cenzury: w katalogu nie znaleźliśmy żadnego modelu abliterowanego ani nieocenzurowanego. Modele DeepSeek i Llama są na liście, żaden nie jest abliterowany.",
    callout:
      "Wniosek: na Azure aplikacja z fikcją dla dorosłych albo towarzyszami łamie Code of Conduct, bez względu na ustawienia filtra.",
  },
  rules: {
    title: "Azure, Bedrock, Vertex i Together: co naprawdę znaczy wyłączony",
    intro:
      "Każdy hyperscaler pozwala gdzieś obniżyć filtr. Żaden nie zmienia polityki użytkowania i żaden nie dostarcza wag bez cenzury.",
  },
  us: {
    title: "{{appName}}: modele bez cenzury w API OpenAI i Anthropic",
    intro:
      "{{modelCount}} modeli czatu pod jednym kluczem, {{uncensored}} z nich bez cenzury. Żadnej warstwy filtra na wybranym modelu.",
    models:
      "Modele: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM i Qwen obok {{uncensored}} modeli bez cenzury. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, co daje model z przeciwnymi poglądami politycznymi.",
    formats:
      "Formaty: OpenAI chat completions, OpenAI Responses API i Anthropic Messages API, plus obrazy, wideo, muzyka, mowa i transkrypcja pod tym samym kluczem.",
    consent:
      "Zasady: modele bez cenzury odblokowuje jednorazowa zgoda 18+ na twoim koncie. Bez wniosku, bez zespołu konta.",
    billing:
      "Rozliczenie: jedno saldo kredytów, nasza marża {{markup}}% od tego, co płacimy dostawcy. Każdy plan od {{apiSubPrice}} miesięcznie odblokowuje klucze API. Karta, PayPal albo krypto.",
    limits:
      "Limity: {{burst}} zapytań na minutę i {{streams}} równoległych strumieni na klucz jako pułap przeciw nadużyciom. Limity dostawców są przekazywane dalej.",
    weak: "Gdzie Azure nas bije: nie mamy raportu SOC 2, BAA, SLA ani wyboru regionu. Każdy prompt przechodzi przez nas do dostawcy, który obsługuje model. Nasza marża {{markup}}% sprawia, że za token jesteśmy droższi niż abliterowane routery poniżej. Brak też endpointu embeddings.",
    before: "Przed: klient Azure OpenAI",
    after: "Po: to samo SDK, skierowane na {{appName}}",
    codeNote:
      "Zmieniają się trzy rzeczy. AzureOpenAI staje się OpenAI z base_url. Nazwa deploymentu staje się identyfikatorem modelu. A content_filter_results znika z odpowiedzi, bo nie ma warstwy filtra, o której można by raportować.",
    docsLink: "Dokumentacja API: endpointy, uwierzytelnianie i limity",
    formatsLink: "API zgodne z OpenAI i Anthropic, wyjaśnione",
    toolsLink: "Jeden klucz w Claude Code, Codex CLI, Aider i innych",
  },
  models: {
    title: "{{apiUncensored}} modeli bez cenzury w API dziś",
    intro:
      "Każdy model bez cenzury, który możesz wywołać, z identyfikatorem do pola model. Od najtańszego.",
    colModel: "Model",
    colId: "Identyfikator API",
    colContext: "Kontekst",
    colPrice: "Za wiadomość",
  },
  prices: {
    title: "Cena za token, nasza kontra najtańsi hostowie",
    intro:
      "Te same wagi, inni hostowie. Za token nie jesteśmy najtańsi. Płacisz za jeden klucz do modeli bez cenzury, otwartych i z głównego nurtu, plus czat w przeglądarce.",
  },
  list: {
    title: "Alternatywy, jedna po drugiej",
    intro:
      "Z ich własnych stron i list modeli, czytane {{date}}. Czym każda jest, w czym wygrywa i jaki ma haczyk.",
  },
  stay: {
    title: "Kiedy zostać przy Azure",
    intro: "Czasem filtr to cena papierologii, której potrzebujesz.",
    compliance:
      "Potrzebujesz programów zgodności, regionalnego przechowywania danych i zespołu konta. To sprzedają hyperscalery. Bedrock wymienia na przykład ISO, SOC, CSA STAR, kwalifikowalność do HIPAA i FedRAMP High w GovCloud.",
    privacy:
      "Potrzebujesz warunków danych Microsoftu: prompty i odpowiedzi nie są dostępne dla OpenAI i bez twojej zgody nie służą do trenowania modeli bazowych.",
    sfw: "Twój produkt i tak jest bezpieczny w pracy. Wtedy domyślne ustawienia Azure kosztują cię niewiele.",
    callout:
      "Wiele zespołów dzieli ruch: Azure dla regulowanego obciążenia, drugi klucz dla fikcji, roleplayu, badań i red-teamingu.",
  },
  faq: {
    title: "FAQ",
    off: {
      q: "Czy mogę wyłączyć filtr treści Azure OpenAI?",
      a: "Tylko za zgodą. Klienci mogą sami poluzować filtry do High only. No filters i Annotate only wymagają zatwierdzonego wniosku o modyfikowane filtrowanie treści, dostępnego dla klientów obsługiwanych przez zespół konta Microsoft lub w kwalifikowanym programie.",
    },
    nsfw: {
      q: "Czy Azure OpenAI pozwala na aplikacje NSFW lub z towarzyszami bez filtrów?",
      a: "Nie. Microsoft Code of Conduct zakazuje treści jednoznacznie seksualnych oraz erotycznych i romantycznych chatbotów. Ustawienia filtra nie zmieniają Code of Conduct.",
    },
    monitoring: {
      q: "Czy nadal mogę zrezygnować z Azure abuse monitoring?",
      a: "Zatwierdzeni klienci mogli. Według changelogu Microsoftu z 17 listopada 2026 Modified Abuse Monitoring przestanie być dostępny dla modeli wydanych od 1 listopada 2026, od daty, która nie została jeszcze podana.",
    },
    best: {
      q: "Jaka jest najlepsza alternatywa dla Azure OpenAI bez cenzury?",
      a: "Najtańsze tokeny abliterowane: OpenUncensored lub Refuseless. Ogromny katalog modeli z głównego nurtu: OpenRouter. Własne modele Venice bez cenzury: Venice. Prompty, które nigdy nie opuszczają twoich maszyn: Ollama, LM Studio lub vLLM. Modele bez cenzury, otwarte i z głównego nurtu plus czat zespołowy pod jednym kluczem OpenAI i Anthropic: {{appName}}.",
    },
    sdk: {
      q: "Czy mogę zachować kod SDK Azure OpenAI?",
      a: "W większości tak. Zamień AzureOpenAI na OpenAI, ustaw base_url i klucz, a nazwę deploymentu zastąp identyfikatorem modelu, na przykład {{example}}. Zapytania i odpowiedzi zachowują format OpenAI.",
    },
    enterprise: {
      q: "Czy {{appName}} oferuje SOC 2, BAA albo SLA?",
      a: "Nie. Jeśli ich potrzebujesz, zostaw regulowane obciążenie u hyperscalera i używaj {{appName}} tam, gdzie filtry przeszkadzają.",
    },
    apiLink: "Nieocenzurowane API LLM: identyfikatory modeli, kod i limity",
    bedrockLink: "Alternatywy dla AWS Bedrock bez cenzury",
    openRouterLink: "Alternatywy dla OpenRouter w porównaniu",
    keysLink: "Zarządzaj kluczami API",
  },
  cta: {
    title: "To samo SDK. Zero warstwy filtra.",
    subtitle:
      "Najpierw przetestuj modele w czacie, {{guestCredits}} darmowych kredytów miesięcznie, bez konta. Potem podłącz API.",
    start: "Wypróbuj model bez cenzury",
    docs: "Czytaj dokumentację API",
  },
};
