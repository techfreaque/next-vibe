import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla Claude: z filtrami i bez (2026)",
    description:
      "Claude dobija do limitów i odmawia fikcji. Porównaj {{appName}}, ChatGPT, Gemini, Grok, DeepSeek, Kimi, Venice, NanoGPT, OpenRouter: cena i filtry.",
    category: "Porównanie",
    imageAlt: "Alternatywy dla Claude, z filtrami i bez, w porównaniu",
    keywords:
      "alternatywy dla Claude, alternatywa dla Claude, alternatywa dla Claude AI, strony jak Claude, Claude bez limitów, Claude bez filtrów, Claude bez cenzury, Claude vs ChatGPT, Claude vs Gemini, alternatywa dla Claude Pro, Claude alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "10 min czytania",
    title: "Alternatywy dla Claude, z filtrami i bez",
    subtitle:
      "{{count}} alternatyw i {{appName}}, od asystentów z głównego nurtu po modele bez cenzury. Sprawdzone {{date}} na ich własnych stronach.",
  },
  intro: {
    lead: "Claude to jeden z najlepszych modeli do pisania i kodu. Kończą mu się też wiadomości w najgorszym momencie, a jego zasady użytkowania zakazują erotycznego czatu w każdym planie.",
    p2: "Są więc dwa rodzaje alternatyw: inni asystenci z głównego nurtu na chwilę, gdy dobijesz do limitu, i modele bez cenzury do tego, czego Claude odmawia. Oto oba, sprawdzone {{date}}. Sami też uruchamiamy Claude, więc mówimy, gdzie nadal wygrywa.",
  },
  subject: {
    title: "Claude dziś",
    intro: "Z cennika, zasad użytkowania i polityki prywatności Anthropic.",
    plans:
      "Cena: darmowy plan z limitami, które resetują się co 5 godzin i co tydzień. Płatne: {{plans}}. Anthropic nie podaje dokładnej liczby wiadomości i potwierdził, że w godzinach szczytu w dni robocze zaostrza limity.",
    filter:
      "Filtr: zasady użytkowania zakazują treści o charakterze jednoznacznie seksualnym i erotycznego czatu oraz treści gloryfikujących drastyczną przemoc. Nie ma planu dla dorosłych.",
    privacy:
      "Prywatność: sam decydujesz, czy czaty trenują model. Z włączonym treningiem zanonimizowane czaty są przechowywane do pięciu lat. Z wyłączonym przez 30 dni.",
    extra:
      "Media: bez generowania obrazów i wideo. Claude rysuje wykresy i diagramy z kodu i ma tryb głosowy.",
  },
  why: {
    title: "Dlaczego ludzie szukają gdzie indziej",
    intro: "Cztery powody, każdy z publicznego źródła.",
    limits:
      "Limity użycia. W marcu 2026 Anthropic potwierdził, że w godzinach szczytu skraca 5-godzinne limity.",
    refusals:
      "Odmowy. Nowsze modele Claude odrzucają założenia fabularne i źle odczytują intencje.",
    adult:
      "Brak planu dla dorosłych. Erotyczny czat jest zakazany w każdym planie i w każdej aplikacji.",
    price:
      "Cena. Więcej użycia oznacza Max za 100 USD albo Ultra za 200 USD miesięcznie.",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Decyduje pięć pytań.",
    one: "Jakość: pisanie, kod i rozumowanie na twoich własnych zadaniach, nie na benchmarkach.",
    two: "Limity: limity wiadomości, okna resetu albo płatność za użycie bez limitu.",
    three: "Filtr: czego model odmawia i czy możesz wybrać inny.",
    four: "Prywatność: ustawienia treningu, czas przechowywania i to, co zostaje na twoim urządzeniu.",
    five: "Dodatki: obrazy, wideo, wyszukiwanie w sieci, API i cena każdego z nich.",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: Claude plus modele bez jego zasad",
    intro:
      "{{modelCount}} modeli w jednym czacie, łącznie z Claude. Model zmieniasz przy każdej wiadomości, a wątek zostaje.",
    models:
      "Modele: {{uncensored}} nieocenzurowanych obok {{mainstream}} z głównego nurtu i {{open}} otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    fit: "Bez 5-godzinnego okna: płacisz za wiadomość z jednego salda, więc piszesz dalej, dopóki masz kredyty. Obrazy, wideo i muzyka są na tym samym saldzie.",
    privacy:
      "Prywatność: czaty incognito zostają w pamięci lokalnej twojej przeglądarki, bez konta.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem. Plany: {{planList}}.",
    api: "API: endpointy zgodne z OpenAI i Anthropic, Claude w zestawie. Odblokowuje je każdy zakup.",
    weak: "Gdzie Claude wygrywa: Claude Code, Projects i Cowork to własne aplikacje Anthropic, a intensywne codzienne używanie samego Claude wychodzi taniej w planie Claude niż za wiadomość z naszą marżą {{markup}}%. Claude na {{appName}} też podlega zasadom Anthropic.",
    ownLink: "Zobacz {{ownModel}}",
    directoryLink: "Wszystkie abliterowane modele z kontekstem i ceną",
  },
  list: {
    title: "Opisane alternatywy, jedna po drugiej",
    intro:
      "Platformy z pełnym profilem w naszych danych porównawczych, sprawdzone na ich własnych stronach. ChatGPT, Gemini, Grok i pozostali asystenci są w tabeli powyżej.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modele:",
    filter: "Filtr:",
    price: "Cena:",
    priceValue: "Darmowy plan: {{free}}. Płatne: {{plans}}.",
    pro: "Największy plus:",
    con: "Haczyk:",
    forWho: "Wybierz, jeśli:",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    visit: "Odwiedź {{name}}",
  },
  stay: {
    title: "Kiedy Claude to nadal dobry wybór",
    intro: "Przy wielu zadaniach tak jest.",
    one: "Kodujesz cały dzień w Claude Code i plan to pokrywa.",
    two: "Żyjesz w Projects i chcesz własnych aplikacji Anthropic na każdym urządzeniu.",
    three:
      "Twoje teksty nigdy nie dotykają treści, których zakazują jego zasady.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla Claude?",
      a: "Asystent ogólny: ChatGPT albo Gemini. Research ze źródłami: Perplexity. Modele otwarte z mniejszą liczbą odmów: Kimi, GLM albo DeepSeek. Modele bez cenzury obok Claude w jednym wątku: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla Claude?",
      a: "ChatGPT, Gemini, Grok, DeepSeek i Mistral mają darmowe plany z limitami. LM Studio i Ollama są darmowe na własnym sprzęcie. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem, łącznie z Claude.",
    },
    filter: {
      q: "Czy istnieje Claude bez cenzury?",
      a: "Nie. Wagi Claude są zamknięte, a jego zasady obowiązują wszędzie. Działa inny model do scen, których Claude odmawia. Na {{appName}} {{uncensored}} nieocenzurowanych modeli odblokujesz jednorazowym potwierdzeniem 18+, w tym samym wątku co Claude.",
    },
    privacy: {
      q: "Która alternatywa dla Claude jest najbardziej prywatna?",
      a: "Model lokalny w LM Studio albo Ollama nigdzie nie wysyła twojego promptu. Przy usługach hostowanych szukaj wyłączenia treningu i krótkiego przechowywania danych. Incognito w {{appName}} trzyma historię czatu w twojej przeglądarce.",
    },
    move: {
      q: "Czy po zmianie mogę dalej używać Claude?",
      a: "Tak. {{appName}}, OpenRouter, NanoGPT i Poe udostępniają modele Claude. Używaj Claude do tego, w czym jest najlepszy, a do reszty zmień model.",
    },
  },
  cta: {
    title: "Claude zostaje. Mury znikają.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Claude i modele bez cenzury w jednym czacie.",
    start: "Zacznij czat incognito",
    models: "Porównaj wszystkie modele",
  },
};
