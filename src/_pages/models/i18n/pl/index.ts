import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modele AI",
    index: {
      title: "{{count}} modeli czatu AI - ceny, kontekst, filtry | {{appName}}",
      description:
        "Wszystkie modele na {{appName}} na jednej liście: Claude, GPT, Gemini, Grok, DeepSeek, czat otwarty i bez cenzury, a do tego obraz, głos, muzyka i wideo. Prawdziwa cena za użycie, okno kontekstu, wejścia. Wybierz i działaj.",
      imageAlt: "Katalog modeli AI na {{appName}}",
      keywords:
        "modele AI, porównanie LLM, AI bez cenzury, open source AI, ceny AI, {{appName}}",
    },
    model: {
      title: "{{model}}: cena, API i kontekst {{context}} | {{appName}}",
      titleShort: "{{model}}: cena, API i kontekst {{context}}",
      titleMin: "{{model}}: cena i API",
      titleUncensored: "{{model}}: AI bez cenzury, cena i API | {{appName}}",
      titleUncensoredShort: "{{model}}: AI bez cenzury, cena i API",
      titleUncensoredMin: "{{model}} bez cenzury: cena i API",
      titleLegacy: "{{model}}: cena i kontekst (starsza wersja) | {{appName}}",
      titleLegacyShort: "{{model}}: cena i kontekst (starsza wersja)",
      description:
        "{{model}} od {{lab}}: {{input}} za wejście, {{output}} za wyjście na 1M tokenów. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość. Darmowe kredyty na start.",
      descriptionFlat:
        "{{model}} od {{lab}}: ~{{credits}} kredytów ({{money}}) za wiadomość, kontekst {{context}}, poziom {{tier}}. Darmowe kredyty na start.",
      descriptionUncensored:
        "{{model}} odpowiada tam, gdzie filtrowane AI odmawia. {{input}} wejście, {{output}} wyjście za 1M tokenów, kontekst {{context}}. Czat lub API, 18+.",
      descriptionUncensoredFlat:
        "{{model}} odpowiada tam, gdzie filtrowane AI odmawia. ~{{credits}} kredytów ({{money}}) za wiadomość, kontekst {{context}}. Czat lub API, 18+.",
      descriptionLegacy:
        "{{model}} od {{lab}} to starsza wersja, zastąpiona przez {{successor}}. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość. Dane, cena i następca.",
      descriptionLegacyNoSuccessor:
        "{{model}} od {{lab}} to starsza wersja. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość. Dane, cena i aktualne alternatywy.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, {{model}} cena, {{model}} API, {{model}} okno kontekstu, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}}: cena {{credits}} kredytów za {{unit}} | {{appName}}",
      titleShort: "{{model}}: cena {{credits}} kredytów za {{unit}}",
      titleMin: "{{model}}: cena za {{unit}}",
      titleNoPrice: "{{model}}: cena i użycie, {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}}: cena i użycie, {{type}}",
      description:
        "{{model}} od {{lab}}, kategoria {{type}}: {{credits}} kredytów ({{money}}) za {{unit}}. Wejście: {{inputs}}. W narzędziu lub w czacie. Darmowe kredyty na start.",
      descriptionNoPrice:
        "{{model}} od {{lab}}, kategoria {{type}}, poziom {{tier}}. Realna cena za użycie w kredytach. W narzędziu lub w czacie. Darmowe kredyty na start.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, cena {{model}}, {{lab}} AI, model AI {{type}}, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}}: cena i kontekst | {{appName}}",
      titleShort: "{{a}} vs {{b}}: cena i kontekst",
      titleMin: "{{a}} vs {{b}}",
      description:
        "{{a}} vs {{b}}: ~{{creditsA}} vs ~{{creditsB}} kredytów za wiadomość, kontekst {{contextA}} vs {{contextB}}. Wejścia, narzędzia, filtry i API obok siebie.",
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
      line: "Dwa rodzaje, oba odpowiadają na wszystko. Większość to modele z głównego nurtu z wyciętym odruchem odmowy: ten sam trening, ten sam światopogląd, tylko bez wykrętów. UncensoredLM to drugi rodzaj: trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, więc jego poglądy polityczne idą pod prąd mainstreamu.",
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
    tokenPrice: "Cena za 1M tokenów",
    tokenPriceValue: "{{input}} wejście, {{output}} wyjście",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} kredytów",
    parameters: "Rozmiar",
    parametersValue: "{{count}} mld parametrów",
    strengths: "Mocne strony",
    uncensoredKind: "Rodzaj braku cenzury",
    apiId: "ID modelu w API",
    apiIdHint:
      "API zgodne z OpenAI i Anthropic. Wymaga płatnego konta: dowolny plan.",
    apiIdLegacy: "Już nie w API. Użyj {{successor}}.",
    apiIdLegacyNoSuccessor: "Już nie w API.",
    notListed: "Brak danych",
    notUncensored: "Filtrowany",
    fixedPrice: "Stała cena za wiadomość",
    notPublished: "Nieujawniony",
  },
  strengths: {
    coding: "Kod",
    reasoning: "Rozumowanie",
    analysis: "Analiza",
    creative: "Pisanie kreatywne",
    roleplay: "Roleplay",
    roleplayDark: "Mroczna fikcja",
    fast: "Szybkość",
    vision: "Rozumienie obrazów",
    imageGen: "Generowanie obrazów",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Własny światopogląd",
      line: "Trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie. Poglądy polityczne pod prąd mainstreamu.",
    },
    refusalsRemoved: {
      name: "Usunięte odmowy",
      line: "Zbudowany na istniejącym modelu i dotrenowany, żeby przestał odmawiać. Ten sam trening, ten sam światopogląd, bez wykrętów.",
    },
  },
  units: {
    image: "obraz",
    audio: "utwór",
    video: "klip {{seconds}} s",
    videoClip: "klip",
    tts: "{{chars}} znaków",
    stt: "{{seconds}} s audio",
  },
  bestFor: {
    heading: "Do czego {{model}} nadaje się najlepiej",
    good: "Sięgnij po niego do",
    skip: "Odpuść go przy",
    items: {
      coding: "Pisanie, przegląd i naprawa kodu",
      reasoning: "Wieloetapowe rozumowanie: matematyka, logika, planowanie",
      analysis: "Research i analiza długich materiałów",
      creative: "Pisanie kreatywne i burza mózgów",
      roleplay: "Roleplay i interaktywna fikcja",
      roleplayDark: "Mroczna fikcja i tematy tabu",
      fast: "Szybkie odpowiedzi, gdy liczy się czas",
      vision: "Czytanie zrzutów ekranu, zdjęć i skanów",
      videoInput: "Rozumienie wideo",
      audioInput: "Rozumienie audio",
      imageGen: "Tworzenie i edycja obrazów w czacie",
      longContext: "Całe książki lub repozytoria w jednym prompcie",
      budget: "Praca na dużą skalę przy małym budżecie",
      tools: "Praca agentowa z narzędziami: wyszukiwanie, pamięć, kod",
      uncensored: "Pytania, na które modele z głównego nurtu nie odpowiadają",
      ownWorldview: "Poglądy polityczne pod prąd mainstreamu",
    },
    skipItems: {
      noTools: "Workflowy agentowe: nie obsługuje narzędzi",
      textOnly: "Obrazy i zrzuty ekranu: czyta tylko tekst",
      pricey:
        "Zadania masowe: kosztuje więcej za wiadomość niż większość modeli tutaj",
      smallContext:
        "Bardzo długie dokumenty: kontekst kończy się na {{tokens}} tokenów",
      filtered:
        "Tematy filtrowane przez {{lab}}: do nich weź model bez cenzury",
      legacy: "Nowe projekty: zastępuje go {{successor}}",
      legacyNoSuccessor: "Nowe projekty: to starsza wersja",
    },
    picks: {
      claudeOpus:
        "Najcięższy kaliber Anthropic do trudnej roboty: duże bazy kodu, staranne analizy, teksty wymagające wyczucia. Kosztuje więcej za wiadomość, więc używaj go tam, gdzie jakość się opłaca.",
      claudeSonnet:
        "Claude na co dzień. Mocny w kodzie, analizie i pisaniu, a tańszy od Opusa, więc udźwignie codzienną pracę bez drenowania kredytów.",
      claudeHaiku:
        "Szybki, tani Claude do krótkich odpowiedzi, streszczeń i prostego kodu. Czyta też zrzuty ekranu.",
      gptSol:
        "Flagowiec OpenAI do rozumowania, kodu i długich analiz. Wybór, gdy chcesz jakości GPT przy trudnych problemach.",
      gptLuna:
        "Szybki, tani model OpenAI do codziennego czatu i szybkich pytań.",
      geminiArgon:
        "Najwyższa półka Google: rozumie tekst, obrazy, wideo i audio. Mocny w rozumowaniu i kodzie na mieszanych mediach.",
      geminiFlash:
        "Szybkie Gemini, które wciąż rozumie obrazy, wideo i audio. Dużo analizy i kodu za rozsądną cenę.",
      grok: "Flagowiec xAI z lżejszymi filtrami niż reszta dużych laboratoriów. Mocne rozumowanie i kod, mniej odmów.",
      deepseekPro:
        "Duży model rozumujący DeepSeek. Kod i analiza z najwyższej półki za ułamek ceny zamkniętych flagowców.",
      deepseekFlash:
        "Jeden z najtańszych naprawdę zdolnych modeli tutaj. Szybki kod i analiza, czyta obrazy, stworzony do dużej skali.",
      glm: "Otwarty model Z.AI do kodu i rozumowania. Mądre odpowiedzi w budżetowej cenie.",
      kimi: "Flagowiec Moonshot: rozumowanie, kod i pisanie kreatywne, do tego rozumie obrazy i wideo.",
      qwenMax:
        "Flagowy Qwen od Alibaby. Rozumowanie, kod i analiza, do tego rozumie obrazy i wideo.",
      mistralLarge:
        "Flagowiec Mistrala z Francji. Solidny w kodzie i analizie, czyta też obrazy.",
      metaWonder:
        "Topowy model Mety. Rozumie tekst, obrazy, wideo i audio, mocny w rozumowaniu, kodzie i pracy twórczej.",
      uncensoredLm:
        "Model bez cenzury z własnym światopoglądem. Trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, więc da ci poglądy polityczne, których duże laboratoria nie dadzą.",
      glmUncensored:
        "GLM 5.3 bez odmów. Ten sam mózg, ten sam światopogląd, odpowiada na wszystko. Jeden z najmocniejszych w rozumowaniu wśród modeli bez cenzury.",
      glmFlashUncensored:
        "Szybki, tani i bez odmów. GLM 5.3 Flash bez wykrętów, do tego czyta obrazy.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash bez odmów. Kod, analiza i fikcja bez moralizowania, w niskiej cenie.",
      veniceUncensored:
        "Własny model czatu bez cenzury od Venice. Tani i szybki, stworzony do pisania kreatywnego i roleplayu bez odmów.",
    },
  },
  related: {
    heading: "Podobne modele",
    intro:
      "To samo laboratorium, ten sam poziom, tańsze opcje. Każdy ma własną stronę.",
    reasons: {
      uncensored: "Wersja bez cenzury",
      original: "Model oryginalny",
      cheaper: "Tańszy, ten sam poziom",
      sameLab: "Też od {{lab}}",
      sameTier: "Ten sam poziom",
      sameType: "Ten sam typ",
    },
    perMessage: "~{{credits}} kredytów za wiadomość",
    perUse: "{{credits}} kredytów za {{unit}}",
  },
  faq: {
    heading: "{{model}}: pytania i odpowiedzi",
    price: {
      q: "Ile kosztuje {{model}}?",
      aTokens:
        "Około {{credits}} kredytów ({{money}}) za typową wiadomość: 16K tokenów na wejściu, 1,5K na wyjściu. Za 1M tokenów: {{input}} wejście, {{output}} wyjście. Płacisz za użycie w kredytach. Darmowe kredyty na start.",
      aFlat:
        "Około {{credits}} kredytów ({{money}}) za typową wiadomość. Płacisz za użycie w kredytach. Darmowe kredyty na start.",
      aFree: "{{model}} nie kosztuje żadnych kredytów za wiadomość.",
    },
    uncensored: {
      q: "Czy {{model}} jest bez cenzury?",
      mainstream:
        "Nie. {{model}} ma filtry bezpieczeństwa {{lab}} i odmawia niektórych tematów. Przy nich przełącz się w tym samym czacie na model bez cenzury.",
      open: "Częściowo. {{model}} to otwarty model z lżejszymi filtrami niż modele z głównego nurtu: odmawia rzadziej, ale nie jest w pełni bez cenzury. Jeśli chcesz zero odmów, wybierz model z poziomu Bez cenzury.",
      refusalsRemoved:
        "Tak. {{model}} to istniejący model z wyciętym odruchem odmowy: ten sam trening, ten sam światopogląd, po prostu przestaje się wykręcać. Modele bez cenzury wymagają jednorazowego potwierdzenia 18+.",
      ownWorldview:
        "Tak, i to inaczej niż większość. {{model}} jest trenowany na książkach i dokumentach zakazanych w mainstreamowym internecie, więc jego poglądy polityczne idą pod prąd mainstreamu. Większość innych modeli bez cenzury ma tylko usunięte odmowy. Modele bez cenzury wymagają jednorazowego potwierdzenia 18+.",
    },
    api: {
      q: "Czy mogę używać {{model}} przez API?",
      a: "Tak. Wywołaj go jako {{id}} w API {{appName}}, które obsługuje formaty OpenAI i Anthropic. API wymaga płatnego konta: dowolny plan.",
      legacy:
        "{{model}} to starsza wersja, której nie ma już w API. Użyj zamiast niego {{successor}} ({{id}}). API wymaga płatnego konta: dowolny plan.",
      legacyNoSuccessor:
        "{{model}} to starsza wersja, której nie ma już w API. GET /v1/models pokazuje każdy model, który możesz wywołać.",
    },
    context: {
      q: "Jak duże jest okno kontekstu {{model}}?",
      a: "{{tokens}} tokenów. To około {{pages}} stron tekstu naraz.",
    },
    inputs: {
      q: "Czy {{model}} czyta obrazy i używa narzędzi?",
      images: "Tak, czyta obrazy: wyślij zrzuty ekranu, zdjęcia lub skany.",
      imagesAndMore: "Tak, czyta obrazy. Inne wejścia: {{more}}.",
      textOnly: "Nie, czyta tylko tekst.",
      toolsYes:
        "Obsługuje wywoływanie narzędzi: wyszukiwanie w sieci, pamięć i kod w czacie, function calling w API.",
      toolsNo: "Nie obsługuje narzędzi, więc odpowiada z własnej wiedzy.",
    },
  },
  mediaFaq: {
    price: {
      q: "Ile kosztuje {{model}}?",
      a: "{{credits}} kredytów ({{money}}) za {{unit}}. Rozmiar, długość i opcje zmieniają cenę. Płacisz za użycie w kredytach. Darmowe kredyty na start.",
      aNone:
        "Cena zależy od rozmiaru, długości i opcji. Aktualną cenę pokazuje tabela powyżej. Płacisz za użycie w kredytach. Darmowe kredyty na start.",
    },
    use: {
      q: "Jak używać {{model}}?",
      a: "Otwórz narzędzie {{type}} z wybranym już {{model}} i uruchom. Albo poproś dowolny model czatu, żeby użył {{model}} za ciebie.",
    },
    inputs: {
      q: "Co {{model}} przyjmuje na wejściu?",
      a: "Wejście: {{inputs}}. Wyjście: {{outputs}}.",
    },
    uncensored: {
      q: "Czy {{model}} jest bez cenzury?",
      mainstream: "Nie. {{model}} działa z filtrami treści {{lab}}.",
      open: "Częściowo. {{model}} ma lżejsze filtry niż modele z głównego nurtu, ale nie jest w pełni bez cenzury.",
      uncensored:
        "Tak. {{model}} należy do poziomu Bez cenzury i generuje to, co filtrowane modele blokują.",
      consent: "Modele bez cenzury wymagają jednorazowego potwierdzenia 18+.",
    },
  },
  readMore: {
    heading: "Czytaj dalej",
  },
  directory: {
    heading: "Wszystkie strony modeli",
    intro:
      "Bezpośrednie linki do wszystkich {{count}} stron modeli, łącznie ze starszymi wersjami.",
  },
  breadcrumb: {
    models: "Modele AI",
  },
  jsonLd: {
    perMessage: "typowa wiadomość (16K tokenów na wejściu, 1,5K na wyjściu)",
    perInputTokens: "tokeny wejściowe",
    perOutputTokens: "tokeny wyjściowe",
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
    eyebrow:
      "{{chat}} modeli czatu, do tego modele obrazu: {{image}}, wideo: {{video}}, muzyki: {{music}}, głosu: {{voice}}",
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
      "Darmowe kredyty na start, bez karty. Czat otwiera się z wybranym modelem {{model}} i gotowym promptem. Po prostu wyślij.",
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
      "Darmowe kredyty na start, bez karty. Generator otwiera się z wybranym {{model}}.",
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
      "Jak {{model}} odpowiada na pytania Indeksu odmów. Stan na {{date}}, co tydzień nowe pytania.",
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
