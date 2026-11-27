import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla Venice AI: prywatne i bez cenzury (2026)",
    description:
      "Venice AI kontra {{appName}}, OpenUncensored, NEAR AI Cloud, Maple, Proton Lumo i NanoGPT. Gdzie trafiają prompty, kto odmawia rzadziej, za co dopłacasz.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla Venice AI w porównaniu",
    keywords:
      "alternatywy dla Venice AI, alternatywa dla Venice AI, strony jak Venice AI, alternatywa Venice.ai, prywatna AI bez cenzury, alternatywa dla czatu AI bez cenzury, Venice AI vs NanoGPT, Venice AI vs FreedomGPT, AI bez cenzury z API, prywatny czat AI, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "10 min czytania",
    title: "Alternatywy dla Venice AI do prywatnych rozmów",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównane według tego, co mówią ich własne cenniki, polityki prywatności i zasady filtrów. Sprawdzone {{date}}.",
  },
  intro: {
    lead: "Venice zbudowało markę na dwóch obietnicach: prywatność i brak cenzury. Spore części obu dotrzymuje. Ale darmowy plan to 10 promptów tekstowych dziennie, filtr dla dorosłych wymaga Pro, a jego API nie ma natywnego endpointu Anthropic.",
    p2: "Oto alternatywy, sprawdzone {{date}} na ich własnych cennikach, politykach prywatności i stronach o filtrach. Uczciwie: kupujemy od Venice. {{appName}} kieruje dziś przez Venice {{veniceModels}} modeli, z czego {{veniceUncensored}} bez cenzury. Mówimy też, gdzie Venice wygrywa.",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Decyduje pięć pytań.",
    privacy:
      "Prywatność: gdzie trzymane są twoje czaty i czy ktoś na nich trenuje? Na urządzeniu, na serwerze czy do ulepszania modeli.",
    models:
      "Modele: ile nieocenzurowanych, jakiego rodzaju i czy w tym samym miejscu masz Claude, GPT i Gemini?",
    filter:
      "Filtr: co wolno w darmowym planie, co wymaga płatnego i czy jest weryfikacja wieku?",
    price:
      "Cena: darmowy limit, subskrypcja czy płatność za użycie. I co się dzieje, gdy limit się skończy.",
    api: "API: czy te same modele wywołasz z kodu i w jakim formacie?",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: jeden czat, każdy rodzaj modelu",
    intro:
      "{{modelCount}} modeli w jednym czacie i na jednym saldzie. Poziom filtra wybierasz przy każdej wiadomości.",
    models:
      "Modele: {{uncensored}} nieocenzurowanych obok {{mainstream}} z głównego nurtu i {{open}} otwartych. Zmiana w trakcie rozmowy. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    venice:
      "Venice w środku: {{veniceModels}} naszych modeli działa przez Venice, w tym {{veniceExamples}}. Te same modele, jedno konto z całą resztą.",
    privacy:
      "Prywatność: czaty incognito zostają w pamięci lokalnej twojej przeglądarki, bez konta. Prywatne czaty zapisują się tylko na twoim koncie.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem, {{maxCredits}} z newsletterem. Plany od {{subPrice}} miesięcznie. Pakiety kredytów doładowują aktywny plan i nigdy nie wygasają.",
    api: "API: te same modele przez endpointy zgodne z OpenAI i Anthropic. Odblokowuje je każdy plan od {{apiSubPrice}} miesięcznie.",
    weak: "Gdzie jesteśmy słabsi: katalog Venice jest większy, a na własnych modelach Venice jest tańsze za token, bo my doliczamy {{markup}} % narzutu do tego, co sami płacimy. Nie mamy płatności x402 za zapytanie ani warstwy tokenów jak VVV czy DIEM: nasze API wymaga konta i zakupu.",
    directoryLink: "Wszystkie abliterowane modele z kontekstem i ceną",
    ownLink: "Zobacz {{ownModel}}",
  },
  veniceApi: {
    title: "API Venice, sprawdzone {{veniceDate}}",
    intro: "Co dostają programiści, zanim rozejrzą się gdzie indziej.",
    formats:
      "Formaty: czat zgodny z OpenAI z endpointem Responses. Brak natywnego API Anthropic Messages: własny poradnik Claude Code uruchamia lokalne proxy tłumaczące.",
    payment:
      "Płatność: klucz API wymaga konta albo płacisz za zapytanie przez x402 z portfela USDC, w ogóle bez konta.",
    models:
      "Własne modele: Venice Uncensored 1.2 i Venice Role Play Uncensored, własne fine-tuny, obok abliterowanych wersji GLM, DeepSeek, Gemma i Qwen.",
    terms:
      "Regulamin: zakaz odsprzedaży dostępu i zakaz użycia API w zastosowaniach wysokiego ryzyka.",
    us: "W {{appName}} jeden klucz obsługuje OpenAI chat completions, Responses i Anthropic Messages. Claude Code łączy się bezpośrednio, także z modelami Venice.",
    apiLink: "API LLM bez cenzury: ID modeli, kod i limity",
  },
  list: {
    title: "{{count}} alternatyw, jedna po drugiej",
    intro:
      "Z ich własnych stron, sprawdzone {{date}}. Czym jest każda, jakie ma modele, na co pozwala jej filtr i co dzieje się z twoimi czatami.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modele:",
    filter: "Filtr:",
    privacy: "Prywatność:",
    price: "Cena:",
    priceValue: "Darmowy plan: {{free}}. Płatne: {{plans}}.",
    pro: "Największy plus:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  privacy: {
    title: "Prywatność: najmocniejsza karta Venice",
    intro:
      "Większość patrzy na Venice ze względu na prywatność. Tak wypada reszta.",
    us: "Na {{appName}} czaty incognito są w pamięci lokalnej twojej przeglądarki, nie na naszych serwerach. Wyczyść dane przeglądarki i ich nie ma.",
    transit:
      "Każdy hostowany model i tak widzi twój prompt. Venice, NanoGPT, my: wiadomość musi dotrzeć do serwera, na którym działa model. Tylko narzędzie lokalne trzyma ją na twoim komputerze.",
    callout:
      "Historia na urządzeniu trzyma twoje czaty z dala od serwerów firmy. Nie ukrywa ich przed modelem, który pisze odpowiedzi.",
  },
  stay: {
    title: "Kiedy Venice to nadal dobry wybór",
    intro: "Czasem oryginał to lepsza oferta.",
    crypto:
      "Masz VVV lub DIEM albo chcesz płacić za zapytanie API z portfela USDC, bez konta. Nikt inny z tej listy nie robi tego w ten sam sposób.",
    versusLink: "{{appName}} vs Venice: pełne porównanie",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla Venice AI?",
      a: "Zależy, dlaczego odchodzisz. Płatność za użycie i ogromna lista modeli: NanoGPT. Pełna prywatność: LM Studio na własnym komputerze. Jeden bezpośredni model z własnym światopoglądem: uncensored.ai. Modele nieocenzurowane, otwarte i z głównego nurtu plus media w jednym czacie i na jednym saldzie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla Venice AI?",
      a: "Tak. Własny darmowy plan Venice to 10 promptów tekstowych i 15 obrazowych dziennie. FreedomGPT startuje za darmo i bez konta. LM Studio jest darmowe na Twoim sprzęcie. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, {{maxCredits}} z newsletterem, w tym modele bez cenzury po jednorazowym potwierdzeniu 18+.",
    },
    private: {
      q: "Która alternatywa dla Venice jest najbardziej prywatna?",
      a: "Narzędzie lokalne jak LM Studio: model działa na twoim urządzeniu, a prompty nigdy go nie opuszczają. Wśród opcji hostowanych NanoGPT i tryb incognito {{appName}} trzymają historię czatu w przeglądarce. Każdy hostowany model i tak widzi prompt, na który odpowiada.",
    },
    api: {
      q: "Która alternatywa ma nieocenzurowane API?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter i {{appName}} oferują API zgodne z OpenAI. Abliterowane wagi samym API sprzedają po cenie dostawcy OpenUncensored i NEAR AI Cloud. Zakres bardzo się różni: OpenRouter nie ma modeli abliterowanych, NanoGPT ma ich dziesiątki. W {{appName}} każdy plan od {{apiSubPrice}} miesięcznie odblokowuje API.",
    },
    same: {
      q: "Czy mogę używać modeli Venice gdzie indziej?",
      a: "Część z nich. {{appName}} uruchamia {{veniceModels}} modeli przez Venice, w tym {{veniceExamples}}, w tym samym czacie co Claude, GPT i reszta. OpenRouter, NanoGPT i OpenUncensored też oferują Venice Uncensored.",
    },
    account: {
      q: "Czy potrzebuję konta, żeby spróbować?",
      a: "Nie na {{appName}}: czat incognito działa bez konta. Darmowe konto trzyma czaty na wszystkich urządzeniach i podnosi darmowy limit do {{freeCredits}} kredytów miesięcznie.",
    },
    noGpuLink: "Nieocenzurowany LLM online, bez GPU",
    apiLink: "Nieocenzurowane API LLM: identyfikatory, kod i limity",
    openRouterLink: "Alternatywy dla OpenRouter bez cenzury, porównane",
  },
  cta: {
    title: "Prywatnie, kiedy chcesz. Bez cenzury, kiedy trzeba.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij incognito i wybierz dowolny model.",
    start: "Zacznij czat incognito",
    models: "Porównaj wszystkie modele",
  },
};
