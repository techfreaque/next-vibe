import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "AWS Bedrock bez cenzury: alternatywy API w porównaniu | {{appName}}",
    description:
      "Bedrock Guardrails są opcjonalne, ale odmowy modeli i polityka AWS zostają. Porównanie Custom Model Import dla abliterowanych wag z {{appName}}, OpenRouter, Venice, NanoGPT i własnym hostingiem.",
    category: "Przewodnik dla deweloperów",
    imageAlt: "Alternatywy dla AWS Bedrock bez cenzury, w porównaniu",
    keywords:
      "alternatywa dla AWS Bedrock bez cenzury, alternatywa dla Bedrock, Bedrock bez guardrails, Bedrock Custom Model Import abliterowany, Bedrock model bez cenzury, Claude na Bedrock alternatywa, Bedrock Converse API alternatywa, Anthropic Messages API, nieocenzurowane API LLM, API modeli abliterowanych, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Przewodnik dla deweloperów",
    readTime: "8 min czytania",
    title: "Alternatywy dla AWS Bedrock bez cenzury",
    subtitle:
      "Guardrails, odmowy, polityka AWS i Custom Model Import, sprawdzone u źródła. Potem {{count}} alternatyw. Sprawdzone {{date}}.",
  },
  intro: {
    lead: "Bedrock nie narzuca ci filtra. Pomiń Guardrail, a Bedrock nie doda żadnego. Model nadal odmawia, polityka AWS nadal obowiązuje, a w katalogu nie ma wag bez cenzury.",
    p2: "Prawdziwe pytanie brzmi więc, gdzie działają modele abliterowane i ile kosztuje przeprowadzka. Oto fakty z dokumentacji AWS, droga przez Custom Model Import i zmiana w kodzie dla użytkowników Claude na Bedrock, którzy przechodzą na {{appName}}.",
  },
  bedrock: {
    title: "Co Bedrock filtruje, a czego nie",
    intro: "Prosto z dokumentacji i polityki AWS.",
    guardrails:
      "Guardrails są opcjonalne: działają tylko wtedy, gdy w wywołaniu podasz identyfikator i wersję guardrail.",
    refusals:
      "Brak Guardrail nie znaczy brak cenzury: modele są udostępniane tak, jak dostarczają je ich twórcy, więc Claude, Llama i reszta zachowują wyuczone odmowy.",
    csam: "Zawsze włączone: automatyczne wykrywanie CSAM w obrazach wejściowych i wyjściowych może zablokować zapytanie kodem HTTP 400.",
    policy:
      "Polityka: AWS Responsible AI Policy zabrania używania usługi do celowego obchodzenia filtrów bezpieczeństwa, a także dezinformacji, obrazów seksualnych bez zgody i szkodzenia małoletnim.",
    retention:
      "Wykrywanie nadużyć: AWS może w ograniczonych przypadkach przechowywać lub przeglądać dane wejściowe i wyjściowe. Claude Fable 5, 5.1 i 5.2 zatrzymują cały ruch do 30 dni, modele OpenAI poza gpt-oss zatrzymują oznaczony ruch do 30 dni. Dostawcy modeli nie dostają z tego nic.",
    models:
      "Brak wag bez cenzury: katalog zawiera DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma i Nemotron. Żaden nie jest abliterowany.",
  },
  import: {
    title: "Przynieś własne abliterowane wagi: Custom Model Import",
    intro:
      "Bedrock może hostować wagi, które wgrasz. To jedyny sposób, by uruchomić tam model abliterowany.",
    architectures:
      "Obsługiwane architektury: Mistral, Mixtral, Flan, Llama 2 do 3.3, GPTBigCode, Qwen2 do Qwen3 oraz gpt-oss 20B i 120B. Abliterowany Llama, Qwen lub gpt-oss pasuje.",
    excluded:
      "Nieobsługiwane: architektury DeepSeek V3, Kimi i GLM. Importy Qwen3 nie obsługują Converse API.",
    format:
      "Limity: safetensors z Hugging Face, poniżej 200 GB dla modeli tekstowych, kontekst poniżej 128K, bez inferencji wsadowej. Regiony: eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Koszt: $0.05718 za Custom Model Unit na minutę w US East i Oregonie, rozliczane w oknach 5-minutowych, plus $1.95 miesięcznie za przechowywanie na jednostkę. Frankfurt to $0.07144 za minutę.",
    callout:
      "Płacisz za moc modelu za minutę, nie za token. A polityka AWS przeciw obchodzeniu filtrów bezpieczeństwa nadal obejmuje twoje konto.",
  },
  prices: {
    title: "Własne ceny Bedrock za modele otwarte",
    intro:
      "Poziom standard, US East, za 1M tokenów, wejście / wyjście. Tylko seryjne wagi.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Wagi bez cenzury gdzie indziej, za token",
    oursIntro:
      "Modele abliterowane, których Bedrock nie ma: nasze kontra najtańsi hostowie.",
  },
  apis: {
    title: "Converse kontra formaty OpenAI i Anthropic",
    intro:
      "Bedrock mówi InvokeModel i Converse na bedrock-runtime, a na endpoincie bedrock-mantle dodaje Messages, Chat Completions i Responses. My mówimy OpenAI chat completions, Responses API i Anthropic Messages pod jednym base URL z jednym kluczem.",
    claude:
      "Dla użytkowników Claude na Bedrock to znaczy, że SDK Anthropic dalej działa. Zamień klienta Bedrock na zwykłego, ustaw base URL i klucz. Claude Code przyjmuje ten sam base URL jako ANTHROPIC_BASE_URL.",
    before: "Przed: Claude przez klienta Bedrock",
    after: "Po: to samo wywołanie Messages na {{appName}}",
    swap: "Ten sam kod, dowolny model: wpisz {{uncensoredExample}} w pole model, a wywołanie trafi do modelu bez cenzury.",
    converse:
      "Dziś na Converse? Przejdź raz na SDK OpenAI lub Anthropic, a każda bramka z tej strony, nas też, dzieli od ciebie jedna zmiana base URL.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex i Together obok siebie",
    intro:
      "Każdy hyperscaler pozwala gdzieś obniżyć filtr. Żaden nie zmienia polityki użytkowania i żaden nie dostarcza wag bez cenzury.",
  },
  us: {
    title: "{{appName}}: modele bez cenzury bez importowania wag",
    intro:
      "{{modelCount}} modeli czatu pod jednym kluczem, {{uncensored}} z nich bez cenzury. Płacisz za token, bez minut mocy.",
    models:
      "Modele: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM i Qwen obok {{uncensored}} modeli bez cenzury, w tym abliterowanych GLM, DeepSeek i Kimi, których Custom Model Import nie przyjmie. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, co daje model z przeciwnymi poglądami politycznymi.",
    formats:
      "Formaty: OpenAI chat completions, Responses API i Anthropic Messages, plus obrazy, wideo, muzyka, mowa i transkrypcja.",
    consent:
      "Zasady: modele bez cenzury odblokowuje jednorazowa zgoda 18+ na twoim koncie.",
    billing:
      "Rozliczenie: jedno saldo kredytów, nasza marża {{markup}}% od tego, co płacimy dostawcy. Każdy plan od {{apiSubPrice}} miesięcznie odblokowuje klucze API.",
    weak: "Gdzie Bedrock nas bije: IAM, VPC, regiony, rachunek AWS, ISO, SOC, CSA STAR, kwalifikowalność do HIPAA i FedRAMP High w GovCloud. Nie mamy raportu SOC 2, BAA, SLA ani wyboru regionu, a każdy prompt przechodzi przez nas do dostawcy, który obsługuje model.",
    docsLink: "Dokumentacja API: endpointy, uwierzytelnianie i limity",
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
  list: {
    title: "Alternatywy, jedna po drugiej",
    intro:
      "Z ich własnych stron i list modeli, czytane {{date}}. Czym każda jest, w czym wygrywa i jaki ma haczyk.",
  },
  stay: {
    title: "Kiedy zostać przy Bedrock",
    intro:
      "Jeśli twoje obciążenie żyje w AWS, pytanie o filtr może być tym mniejszym.",
    compliance:
      "Potrzebujesz zakresu zgodności, kontroli IAM i VPC oraz jednej faktury AWS.",
    retention:
      "Potrzebujesz zerowej retencji na region: tryb retencji none w Bedrock, ustawiany przez API.",
    weights:
      "Twój abliterowany model to Llama, Qwen lub gpt-oss, a stały ruch uzasadnia płacenie za minuty mocy.",
    callout:
      "Wiele zespołów dzieli ruch: Bedrock dla produkcji w AWS, drugi klucz dla fikcji, roleplayu, badań i red-teamingu.",
  },
  faq: {
    title: "FAQ",
    guardrails: {
      q: "Czy Bedrock filtruje treści bez Guardrails?",
      a: "Bedrock nie dodaje warstwy filtra, dopóki nie podepniesz Guardrail, poza automatycznym wykrywaniem CSAM w obrazach. Modele zachowują wyuczone odmowy, a AWS Responsible AI Policy nadal obowiązuje.",
    },
    uncensored: {
      q: "Czy Bedrock ma modele bez cenzury lub abliterowane?",
      a: "Nie w katalogu. Jedyna droga to Custom Model Import własnych wag, dla obsługiwanych architektur takich jak Llama, Qwen i gpt-oss.",
    },
    cost: {
      q: "Ile kosztuje Custom Model Import?",
      a: "$0.05718 za Custom Model Unit na minutę w US East i Oregonie, rozliczane w oknach 5-minutowych, plus $1.95 miesięcznie za przechowywanie na jednostkę. Płacisz za moc, nie za token.",
    },
    claude: {
      q: "Czy mogę przenieść kod Claude na Bedrock bez przepisywania?",
      a: "Tak. Zamień AnthropicBedrock na zwykłego klienta Anthropic, ustaw base_url na base URL {{appName}} bez /v1, użyj swojego klucza i naszego identyfikatora modelu. Zapytanie i odpowiedź Messages zachowują kształt.",
    },
    converse: {
      q: "Czy {{appName}} obsługuje Bedrock Converse API?",
      a: "Nie. Mówimy OpenAI chat completions, Responses API i Anthropic Messages. Kto raz odejdzie od Converse, ma każdego dostawcę zgodnego z OpenAI lub Anthropic o jedną zmianę base URL dalej.",
    },
    enterprise: {
      q: "Czy {{appName}} oferuje SOC 2, BAA albo SLA?",
      a: "Nie. Jeśli ich potrzebujesz, zostaw regulowane obciążenie na Bedrock i używaj {{appName}} tam, gdzie odmowy przeszkadzają.",
    },
    apiLink: "Nieocenzurowane API LLM: identyfikatory modeli, kod i limity",
    azureLink: "Alternatywy dla Azure OpenAI bez cenzury",
    openRouterLink: "Alternatywy dla OpenRouter w porównaniu",
    keysLink: "Zarządzaj kluczami API",
  },
  cta: {
    title: "Bez minut mocy. Bez odruchu odmowy.",
    subtitle:
      "Najpierw przetestuj modele w czacie, {{guestCredits}} darmowych kredytów miesięcznie, bez konta. Potem skieruj SDK na API.",
    start: "Wypróbuj model bez cenzury",
    docs: "Czytaj dokumentację API",
  },
};
