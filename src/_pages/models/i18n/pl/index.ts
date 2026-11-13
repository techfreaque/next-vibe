import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modele AI",
    index: {
      title: "{{count}} modeli AI - ceny, kontekst, filtry | {{appName}}",
      description:
        "Wszystkie modele na {{appName}} na jednej liście: Claude, GPT, Gemini, Grok, DeepSeek, czat otwarty i bez cenzury, a do tego obraz, głos, muzyka i wideo. Prawdziwa cena za użycie, okno kontekstu, wejścia. Wybierz i działaj.",
      imageAlt: "Katalog modeli AI na {{appName}}",
      keywords:
        "modele AI, porównanie LLM, AI bez cenzury, open source AI, ceny AI, {{appName}}",
    },
    model: {
      title: "{{model}} od {{lab}} - cena, kontekst, jak używać | {{appName}}",
      description:
        "{{model}} od {{lab}}: poziom {{tier}}, {{context}} tokenów kontekstu, około {{price}} kredytów za wiadomość. Rozmawiaj z nim na {{appName}} - bez subskrypcji.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, {{model}} cena, {{model}} okno kontekstu, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}} od {{lab}} - {{type}}, cena, użycie | {{appName}}",
      description:
        "{{model}} od {{lab}}: model {{type}}, poziom {{tier}}. Realna cena za użycie w kredytach. Używaj go na {{appName}} - bez subskrypcji.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, cena {{model}}, {{lab}} AI, model AI {{type}}, {{appName}}",
    },
    compare: {
      title:
        "{{a}} vs {{b}} - cena, kontekst, wejścia w porównaniu | {{appName}}",
      description:
        "{{a}} kontra {{b}} obok siebie: cena za wiadomość, okno kontekstu, wejścia, wyjścia, dostawcy i poziom treści. Sprawdź oba na {{appName}}.",
      imageAlt: "{{a}} vs {{b}} na {{appName}}",
      keywords:
        "{{a}} vs {{b}}, {{a}}, {{b}}, porównanie modeli AI, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Mainstream",
      line: "Modele wielkich laboratoriów z ich własnymi filtrami. Najlepsze do pracy, kodu i researchu.",
    },
    open: {
      name: "Otwarte",
      line: "Modele open-weight z luźniejszymi filtrami. Rozmawiają o więcej, odmawiają rzadziej.",
    },
    uncensored: {
      name: "Bez cenzury",
      line: "Bez odmów, bez pouczania. UncensoredLM powstał bez cenzury, reszta to istniejące modele z usuniętymi odmowami i spojrzeniem modelu bazowego.",
    },
  },
  modality: {
    text: "Tekst",
    image: "Obrazy",
    audio: "Dźwięk",
    video: "Wideo",
  },
  facts: {
    heading: "Fakty",
    type: "Typ modelu",
    lab: "Twórca",
    tier: "Poziom treści",
    intelligence: "Inteligencja",
    price: "Szacowana cena za wiadomość",
    priceValue: "~{{credits}} kredytów",
    priceFree: "Za darmo",
    priceHint: "≈ {{count}} wiadomości za {{unit}}",
    priceHintFree: "Nie płacisz nic za wiadomość",
    priceFootnote:
      "Typowa wiadomość: 16K tokenów na wejściu, 1,5K na wyjściu. Krótkie odpowiedzi kosztują mniej. Modele przez OpenRouter rozliczamy według realnego kosztu dostawcy plus naszą marżę, więc faktyczna cena się waha. 1 kredyt = {{value}}.",
    context: "Okno kontekstu",
    contextValue: "{{tokens}} tokenów",
    contextHint: "≈ {{pages}} stron tekstu naraz",
    inputs: "Rozumie",
    outputs: "Tworzy",
    providers: "Dostępny przez",
    tools: "Narzędzia",
    toolsYes: "Tak - wyszukiwanie, pamięć, kod i więcej",
    toolsNo: "Nie - sam czat",
    status: "Status",
    statusCurrent: "Aktualny",
    statusLegacy: "Starsza wersja",
  },
  currencyUnit: {
    usd: "1 $",
    eur: "1 €",
  },
  creditValue: {
    usd: "0,01 $",
    eur: "0,01 €",
  },
  chatPrompt:
    "W czym jesteś najlepszy? Pokaż mi to na jednym krótkim, konkretnym przykładzie.",
  catalog: {
    typesLabel: "Typ modelu",
    types: {
      text: "Czat",
      tts: "Tekst na głos",
      stt: "Głos na tekst",
      image: "Obrazy",
      audio: "Muzyka",
      video: "Wideo",
    },
    context: "{{size}} kontekstu",
    legacyBadge: "Stary",
    count: "{{count}} modeli",
    showLegacy: "Pokaż starsze ({{count}})",
    hideLegacy: "Ukryj starsze",
  },
  index: {
    eyebrow: "{{count}} modeli",
    title: "Każdy model. Jeden czat.",
    subtitle:
      "Mainstream, otwarte i bez cenzury. Prawdziwe ceny za wiadomość, prawdziwe rozmiary kontekstu. Filtr wybierasz ty. Nie my.",
    searchLabel: "Szukaj modeli",
    searchPlaceholder: "Szukaj po nazwie lub twórcy: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} modeli",
    noResults: "Żaden model nie pasuje do „{{query}}”.",
    legacyTitle: "Starsze modele",
    legacyIntro:
      "Poprzednie wersje. Zapisane czaty i skille, które ich używają, same przechodzą na następcę.",
    perMessage: "~{{credits}} kr./wiad.",
    free: "Za darmo",
    ctaTitle: "Dość czytania specyfikacji. Zapytaj.",
    ctaSubtitle:
      "Otwórz czat, wybierz dowolny model w selektorze, zmieniaj w trakcie rozmowy.",
    ctaButton: "Zacznij czat",
  },
  model: {
    back: "Wszystkie modele",
    chatCta: "Pisz z {{model}}",
    compareCta: "Porównaj",
    legacyBanner:
      "{{model}} to starsza wersja. Następca, {{successor}}, jest szybszy lub tańszy - a czaty z {{model}} same na niego przechodzą.",
    legacyCta: "Zobacz {{successor}}",
    compareHeading: "Porównaj {{model}}",
    compareIntro: "Te same fakty, obok siebie.",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "Wypróbuj {{model}} teraz.",
    ctaSubtitle:
      "Bez subskrypcji. Darmowe kredyty na start. Czat otwiera się z wybranym modelem {{model}} i gotowym promptem - po prostu wyślij.",
  },
  media: {
    priceLabel: "Cena za użycie",
    generateCta: "Generuj z {{model}}",
    useCta: "Użyj {{model}}",
    chatNote:
      "Działa też z czatu: poproś dowolny model czatu, by użył {{model}} za Ciebie.",
    priceFootnote:
      "Cena jest za jednostkę - obraz, klip, sekundę lub znak - i zależy od rozmiaru, długości i opcji. 1 kredyt = {{value}}.",
    ctaTitle: "Wypróbuj {{model}} teraz.",
    ctaSubtitle:
      "Bez subskrypcji. Darmowe kredyty na start. Narzędzie otwiera się gotowe do pracy.",
  },
  compare: {
    back: "Wszystkie modele",
    eyebrow: "Łeb w łeb",
    title: "{{a}} vs {{b}}",
    subtitle: "Cena, kontekst, wejścia i filtry. Bez teatru benchmarków.",
    fact: "Cecha",
    cheaper: "{{model}} kosztuje {{times}}× mniej za wiadomość.",
    samePrice: "Oba kosztują za wiadomość mniej więcej tyle samo.",
    biggerContext: "{{model}} mieści {{times}}× więcej kontekstu.",
    sameContext: "Oba mieszczą tyle samo kontekstu.",
    chatWith: "Pisz z {{model}}",
    modelPage: "{{model}} - szczegóły",
    swap: "Zamień strony",
    sameModel: "Wybierz dwa różne modele do porównania.",
  },
  picker: {
    change: "Zmień model",
    search: "Szukaj modeli",
    suggested: "Polecane",
    all: "Wszystkie modele",
    empty: "Brak pasujących modeli.",
  },
  refusal: {
    heading: "Indeks odmów",
    intro:
      "Jak {{model}} poradził sobie ze stałym zestawem pytań w ostatnim tygodniowym przebiegu ({{date}}).",
    rank: "Miejsce {{rank}} z {{total}} (1 = najmniej odmów)",
    refused: "Odmówił",
    hedged: "Złagodził",
    answered: "Odpowiedział",
    judged: "{{count}} ocenionych odpowiedzi",
    trend: "{{delta}} pkt vs poprzedni przebieg",
    categories: "Według kategorii",
    samplesHeading: "Przykładowe odpowiedzi",
    samplesIntro:
      "Prawdziwe odpowiedzi z przebiegu pomiarowego. Ten sam prompt dla każdego modelu.",
    question: "Pytanie",
    answer: "Odpowiedź",
    judge: "Sędzia",
    methodCta: "Jak mierzymy",
  },
};
