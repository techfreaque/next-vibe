import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatywy dla NanoGPT: AI za użycie i bez cenzury (2026)",
    description:
      "NanoGPT ograniczył PRO, podniósł cenę i ujawnił wycieki danych u dostawców. Porównaj {{appName}}, OpenRouter, Venice, Featherless, Arli AI, Infermatic i inne.",
    category: "Porównanie",
    imageAlt:
      "Alternatywy dla NanoGPT z płatnością za użycie i modelami bez cenzury",
    keywords:
      "alternatywy dla NanoGPT, alternatywa dla NanoGPT, alternatywa nano-gpt, strony jak NanoGPT, NanoGPT vs OpenRouter, AI z płatnością za użycie, API AI bez cenzury, API z modelami abliterowanymi, alternatywa dla Featherless, NanoGPT PRO, NanoGPT alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Wróć do bloga",
    category: "Porównanie",
    readTime: "9 min czytania",
    title: "Alternatywy dla NanoGPT: płatność za użycie i modele bez cenzury",
    subtitle:
      "{{count}} alternatyw i {{appName}}, porównane według cenników, polityk prywatności i stron modeli sprawdzonych {{date}}.",
  },
  intro: {
    lead: "NanoGPT robi jedną rzecz bardzo dobrze: każdy model, płatność za użycie, od dziesięciu centów. W 2026 ograniczył też plan PRO, podniósł cenę, raz wstrzymał rejestracje i ujawnił wycieki promptów u kilku dostawców, z których korzysta.",
    p2: "Uczciwie: kupujemy od NanoGPT. {{appName}} kieruje dziś przez niego {{nanoGptModels}} modeli, z czego {{nanoGptUncensored}} bez cenzury. Oto alternatywy sprawdzone {{date}} i miejsca, w których NanoGPT nadal wygrywa.",
  },
  subject: {
    title: "NanoGPT dziś",
    intro: "Z cennika, regulaminu, polityki prywatności i bloga.",
    plans:
      "Cena: płatność za użycie od 0,10 USD w krypto albo 1 USD kartą. PRO: {{plans}}, z 60 mln tokenów wejściowych tygodniowo na wybranych modelach otwartych i 100 obrazami dziennie. Claude, GPT, Gemini i Grok zużywają saldo.",
    filter:
      "Filtr: 18+, bez ogólnego zakazu treści dla dorosłych. Regulamin zakazuje treści seksualnych z udziałem nieletnich i deepfake'ów prawdziwych osób.",
    privacy:
      "Prywatność: historia domyślnie w twojej przeglądarce, opcjonalnie szyfrowana synchronizacja. NanoGPT twierdzi, że przy normalnym użyciu nie zapisuje promptów, ale niektóre ścieżki pozwalają na trening.",
    extra:
      "Opłaty: większość modeli po cenie katalogowej. Wybór dostawcy, Private Mode albo własny klucz dokładają około 5%.",
  },
  why: {
    title: "Dlaczego ludzie szukają gdzie indziej",
    intro: "Cztery powody, każdy z publicznego źródła.",
    exposure:
      "Wycieki u dostawców. W listopadzie 2026 NanoGPT ujawnił, że prompty i odpowiedzi były wystawione u kilku dostawców przez tygodnie, a nawet miesiące, i wyłączył te ścieżki.",
    caps: "Limity. W lutym 2026 PRO przeszedł z nielimitowanego wejścia na 60 mln tokenów wejściowych tygodniowo, do tego limity chwilowe.",
    paused:
      "Wstrzymane rejestracje. W marcu 2026 zatrzymano nowe rejestracje do PRO z powodu nadużyć i niestabilności.",
    reliability:
      "Niezawodność. Recenzje skarżą się na nieudane wywołania narzędzi, za które i tak trzeba zapłacić.",
  },
  criteria: {
    title: "Co porównać przed zmianą",
    intro: "Decyduje pięć pytań.",
    one: "Rozliczenie: za token, za wiadomość, stały plan i minimalne doładowanie.",
    two: "Modele: ile nieocenzurowanych i abliterowanych i czy są też Claude, GPT i Gemini?",
    three:
      "Prywatność: kto zapisuje prompty, które ścieżki pozwalają na trening, co zostaje na twoim urządzeniu.",
    four: "API: format OpenAI czy Anthropic i który plan je odblokowuje.",
    five: "Media: obrazy, wideo, głos i muzyka na tym samym saldzie.",
  },
  table: {
    title: "Wszystkie obok siebie",
  },
  us: {
    title: "{{appName}}: każdy rodzaj modelu, jedno saldo",
    intro:
      "{{modelCount}} modeli w jednym czacie. Poziom filtra wybierasz przy każdej wiadomości.",
    models:
      "Modele: {{uncensored}} nieocenzurowanych obok {{mainstream}} z głównego nurtu i {{open}} otwartych. {{ownModel}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Efekt to model z przeciwnymi poglądami politycznymi.",
    fit: "NanoGPT w środku: {{nanoGptModels}} naszych modeli działa przez NanoGPT, w tym {{nanoGptExamples}}. Do tego {{imageModels}} modeli obrazowych, {{videoModels}} wideo i {{musicModels}} muzycznych na tym samym saldzie.",
    privacy:
      "Prywatność: czaty incognito zostają w pamięci lokalnej twojej przeglądarki, bez konta.",
    price:
      "Cena: {{guestCredits}} darmowych kredytów miesięcznie bez konta, {{freeCredits}} z kontem. Plany: {{planList}}. Pakiety kredytów doładowują aktywny plan i nigdy nie wygasają.",
    api: "API: endpointy zgodne z OpenAI i Anthropic. Odblokowuje je każdy zakup.",
    weak: "Gdzie jesteśmy słabsi: NanoGPT ma dużo więcej modeli i większość liczy po cenie katalogowej. My doliczamy {{markup}}% marży i wymagamy planu, zanim kupisz pakiety kredytów.",
    ownLink: "Zobacz {{ownModel}}",
    directoryLink: "Wszystkie abliterowane modele z kontekstem i ceną",
  },
  list: {
    title: "Opisane alternatywy, jedna po drugiej",
    intro:
      "Platformy z pełnym profilem w naszych danych porównawczych, sprawdzone na ich własnych stronach. Hostingi modeli ze stałą ceną i bramki API są w tabeli powyżej.",
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
    title: "Kiedy NanoGPT to nadal dobry wybór",
    intro: "Czasem oryginał to lepsza oferta.",
    one: "Chcesz najszerszej listy modeli po cenie katalogowej i zero subskrypcji.",
    two: "Płacisz małe kwoty w krypto, od dziesięciu centów, albo chcesz płacić za API bez konta.",
    three:
      "Żyjesz na modelach otwartych, a pula tokenów w PRO wystarcza ci na cały miesiąc.",
    versusLink: "{{appName}} vs NanoGPT: pełne porównanie",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Jaka jest najlepsza alternatywa dla NanoGPT?",
      a: "Dla deweloperów płacących za token: OpenRouter. Dla prywatności i kreatywnej aplikacji: Venice. Dla modeli otwartych i nieocenzurowanych w stałej cenie: Featherless albo Arli AI. Dla modeli nieocenzurowanych, otwartych i z głównego nurtu plus media w jednym czacie i na jednym saldzie: {{appName}}.",
    },
    free: {
      q: "Czy jest darmowa alternatywa dla NanoGPT?",
      a: "OpenRouter ma dzienne limity na darmowych modelach. LM Studio i Ollama są darmowe na własnym sprzęcie. {{appName}} daje {{guestCredits}} darmowych kredytów miesięcznie bez konta i {{freeCredits}} z kontem.",
    },
    filter: {
      q: "Które alternatywy mają modele bez cenzury?",
      a: "Venice, uncensored.ai, Featherless, Arli AI, Infermatic i {{appName}} mają modele nieocenzurowane lub abliterowane. OpenRouter ma ich niewiele. Na {{appName}} odblokowujesz je jednorazowym potwierdzeniem 18+.",
    },
    privacy: {
      q: "Która alternatywa jest najbezpieczniejsza dla prywatnych promptów?",
      a: "Lokalne narzędzie, takie jak LM Studio albo Ollama, trzyma prompty na twoim komputerze. Przy usługach hostowanych sprawdź, z jakich dostawców korzystają i czy zapisują logi. Każdy hostowany model widzi prompt, na który odpowiada.",
    },
    move: {
      q: "Czy mogę przejść bez przepisywania kodu?",
      a: "W większości tak. NanoGPT, OpenRouter i {{appName}} mówią w formacie OpenAI, więc zmieniasz bazowy URL, klucz i identyfikator modelu. {{appName}} obsługuje też format Anthropic.",
    },
  },
  cta: {
    title: "Każdy model. Jedno saldo.",
    subtitle:
      "{{guestCredits}} darmowych kredytów miesięcznie, bez konta. Zacznij incognito i wybierz dowolny model.",
    start: "Zacznij czat incognito",
    models: "Porównaj wszystkie modele",
  },
};
