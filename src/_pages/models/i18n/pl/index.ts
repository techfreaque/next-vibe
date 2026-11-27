import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  compareHub: {
    title: "Porównaj modele AI",
    description:
      "Zestaw dostępne modele AI i porównaj ceny, długość kontekstu, możliwości oraz filtry treści.",
  },
  meta: {
    category: "Modele AI",
    index: {
      title: "{{count}} modeli czatu AI: ceny, kontekst, filtry | {{appName}}",
      description:
        "Wszystkie modele AI na {{appName}}: Claude, GPT, Gemini, Grok, DeepSeek, czat bez cenzury i abliterowany, obraz, głos, wideo. Jawne ceny, darmowe kredyty.",
      imageAlt: "Katalog modeli AI na {{appName}}",
      keywords:
        "modele AI, porównanie LLM, AI bez cenzury, open source AI, ceny AI, {{appName}}",
    },
    model: {
      title: "{{model}} czat online: cena i API | {{appName}}",
      titleShort: "{{model}} czat online: cena i API",
      titleMin: "{{model}} czat online",
      titleUncensored: "{{model}} czat online bez cenzury | {{appName}}",
      titleUncensoredShort: "{{model}} czat online bez cenzury",
      titleLegacy:
        "{{model}} (zastąpił go {{successor}}): czat online | {{appName}}",
      titleLegacyShort: "{{model}} (zastąpił go {{successor}}): czat online",
      titleLegacyMin: "{{model}}, teraz {{successor}}: czat online",
      titleLegacyNoSuccessor:
        "{{model}}: cena, kontekst i alternatywy | {{appName}}",
      titleLegacyNoSuccessorShort: "{{model}}: cena, kontekst i alternatywy",
      description:
        "Rozmawiaj z {{model}} od {{lab}} online, bez instalacji, albo przez API: {{input}} wejście, {{output}} wyjście za 1M tokenów, kontekst {{context}}. {{hook}}",
      descriptionFlat:
        "Rozmawiaj z {{model}} od {{lab}} online, bez instalacji, albo przez API: ~{{credits}} kredytów ({{money}}) za wiadomość, kontekst {{context}}. {{hook}}",
      descriptionUncensored:
        "Czat AI bez cenzury z {{model}} online, bez instalacji, albo przez API: {{input}} wejście, {{output}} wyjście za 1M tokenów, kontekst {{context}}. {{hook}}",
      descriptionUncensoredFlat:
        "Czat AI bez cenzury z {{model}} online, bez instalacji, albo przez API: ~{{credits}} kredytów ({{money}}) za wiadomość, kontekst {{context}}. {{hook}}",
      descriptionLegacy:
        "{{model}} od {{lab}} to starsza wersja, zastąpiona przez {{successor}}. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość. Dane, cena i następca.",
      descriptionLegacyNoSuccessor:
        "{{model}} od {{lab}} to starsza wersja. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość. Dane, cena i aktualne alternatywy.",
      titleUncensoredNamed:
        "{{model}} czat online, wypróbuj za darmo | {{appName}}",
      titleUncensoredNamedShort: "{{model}} czat online, wypróbuj za darmo",
      hookGuest: "Darmowe kredyty, bez rejestracji.",
      hookAccount: "Darmowe kredyty z kontem na start.",
      hookPaid: "Płacisz kredytami za wiadomość.",
      hookAdult: "{{hook}} Jednorazowe potwierdzenie 18+.",
      descriptionShort:
        "Rozmawiaj z {{model}} online albo przez API: ~{{credits}} kredytów za wiadomość, kontekst {{context}}. {{hook}}",
      descriptionUncensoredShort:
        "Czat AI bez cenzury z {{model}} online albo przez API: ~{{credits}} kredytów za wiadomość, kontekst {{context}}. {{hook}}",
      descriptionUncensoredNamed:
        "Rozmawiaj z {{model}} online, bez instalacji, albo przez API: {{input}} wejście, {{output}} wyjście za 1M tokenów, kontekst {{context}}. {{hook}}",
      descriptionUncensoredNamedFlat:
        "Rozmawiaj z {{model}} online, bez instalacji, albo przez API: ~{{credits}} kredytów ({{money}}) za wiadomość, kontekst {{context}}. {{hook}}",
      descriptionUncensoredNamedShort:
        "Rozmawiaj z {{model}} online albo przez API: ~{{credits}} kredytów za wiadomość, kontekst {{context}}. {{hook}}",
      descriptionLegacyShort:
        "{{model}} od {{lab}} to starsza wersja, następca: {{successor}}. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość.",
      descriptionLegacyNoSuccessorShort:
        "{{model}} od {{lab}} to starsza wersja. Kontekst {{context}}, ~{{credits}} kredytów za wiadomość. Zobacz aktualne alternatywy.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, {{model}} cena, {{model}} API, {{model}} okno kontekstu, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}} online: {{credits}} kredytów za {{unit}} | {{appName}}",
      titleShort: "{{model}} online: {{credits}} kredytów za {{unit}}",
      titleMin: "{{model}} online",
      titleNoPrice: "{{model}}: cena i użycie, {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}}: cena i użycie, {{type}}",
      description:
        "{{model}} od {{lab}} ({{type}}) online: {{credits}} kredytów ({{money}}) za {{unit}}. Wejście: {{inputs}}. W przeglądarce lub w czacie. {{hook}}",
      descriptionNoPrice:
        "{{model}} od {{lab}}, kategoria {{type}}, poziom {{tier}}. Realna cena za użycie w kredytach. W narzędziu lub w czacie. Darmowe kredyty na start.",
      descriptionShort:
        "{{model}} od {{lab}} online: {{credits}} kredytów ({{money}}) za {{unit}}. W przeglądarce lub w czacie. {{hook}}",
      descriptionMin:
        "{{model}} online: {{credits}} kredytów za {{unit}}. W przeglądarce lub w czacie. {{hook}}",
      descriptionNoPriceShort:
        "{{model}} od {{lab}} ({{type}}). Realna cena za użycie w kredytach, w przeglądarce lub w czacie.",
      imageAlt: "{{model}} na {{appName}}",
      keywords:
        "{{model}}, cena {{model}}, {{lab}} AI, model AI {{type}}, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}}: cena i kontekst | {{appName}}",
      titleShort: "{{a}} vs {{b}}: cena i kontekst",
      titleMin: "{{a}} i {{b}} w porównaniu",
      description:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}): ~{{moneyA}} vs ~{{moneyB}} za wiadomość, kontekst {{contextA}} vs {{contextB}}. Kiedy wybrać który model, fakty obok siebie.",
      descriptionShort:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}): ~{{moneyA}} vs ~{{moneyB}} za wiadomość, kontekst {{contextA}} vs {{contextB}}.",
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
      line: "Modele do swobodniejszych rozmów i twórczej pracy.",
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
    priceValue: "~{{credits}} kredytów ({{money}})",
    priceFree: "Za darmo",
    referenceTurn:
      "Przykładowa wiadomość obejmuje {{input}} tokenów wejścia i {{output}} tokenów wyjścia.",
    referenceImageTurn:
      "Przykładowa wiadomość obejmuje {{input}} tokenów wejścia, {{output}} tokenów tekstu na wyjściu i jeden wygenerowany obraz.",
    priceProvider: "Podane stawki dotyczą dostawcy {{provider}}.",
    conditionalPrice: "Stawki warunkowe za milion tokenów",
    tierAt: "Od {{tokens}} tokenów wejściowych: {{rates}}.",
    tierUtc: "Od {{start}} do {{end}} UTC: {{rates}}.",
    tierInput: "wejście {{price}}",
    tierOutput: "wyjście {{price}}",
    tierRead: "odczyt z pamięci {{price}}",
    tierWrite: "zapis w pamięci {{price}}",
    tierHour: "zapis na godzinę {{price}}",
    cacheReadSentence:
      "Odczyt miliona tokenów z pamięci podręcznej kosztuje {{price}}.",
    cacheWrite1hPrice: "Zapis na godzinę za 1 mln tokenów",
    cacheWrite1hSentence:
      "Zapis miliona tokenów na godzinę kosztuje {{price}}.",
    cacheWriteSentence:
      "Zapis miliona tokenów w pamięci podręcznej kosztuje {{price}}.",
    cacheReadPrice: "Odczyt z pamięci podręcznej za 1 mln tokenów",
    cacheWritePrice: "Zapis do pamięci podręcznej za 1 mln tokenów",
    imageOutputPrice: "Generowanie obrazu za 1 mln tokenów",
    perMillionCredits: "{{credits}} kred.",
    priceFootnote:
      "Koszt zależy od użycia i dostawcy. Przeliczenie opiera się na cenie jednorazowego pakietu, {{value}} za kredyt.",
    context: "Okno kontekstu",
    contextValue: "{{tokens}} tokenów",
    contextHint: "≈ {{pages}} stron tekstu naraz",
    inputs: "Formaty wejściowe",
    outputs: "Formaty wyjściowe",
    providers: "Dostępny przez",
    tools: "Narzędzia",
    toolsYes: "Tak: wyszukiwanie, pamięć, kod i więcej",
    toolsNo: "Nie: sam czat",
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
    fixedPrice: "Stała cena za wiadomość.",
    notPublished: "Nieujawniony",
    apiIdUnsupported: "Ten model jest niedostępny w tekstowym API czatu.",
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
      line: "Model trenowano na książkach i dokumentach zakazanych w głównym nurcie internetu. Dlatego przedstawia poglądy polityczne spoza głównego nurtu.",
    },
    abliterated: {
      name: "Po ablacji",
      line: "Zmieniono wagi modelu bazowego, aby rzadziej odmawiał odpowiedzi.",
    },
    fineTuned: {
      name: "Dostrojony",
      line: "Istniejący model dostrojono tak, aby odpowiadał z mniejszymi ograniczeniami.",
    },
    unlisted: {
      name: "Metoda niepodana",
      line: "Ten model jest w kategorii bez cenzury. Brak informacji o metodzie trenowania lub filtrowania.",
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
      imageGen: "Generowanie obrazów w czacie",
      longContext: "Całe książki lub repozytoria w jednym prompcie",
      budget: "Praca na dużą skalę przy małym budżecie",
      tools: "Praca agentowa z narzędziami: wyszukiwanie, pamięć, kod",
      uncensored: "Pytania, na które modele z głównego nurtu nie odpowiadają",
      ownWorldview: "Poglądy polityczne pod prąd mainstreamu",
    },
    skipItems: {
      noTools: "Workflowy agentowe: nie obsługuje narzędzi",
      noImages: "Zadania wymagające obrazu na wejściu",
      pricey:
        "Zadania masowe przy stawce {{credits}} kred. za przykładową wiadomość",
      smallContext:
        "Bardzo długie dokumenty: kontekst kończy się na {{tokens}} tokenów",
      filtered:
        "Tematy filtrowane przez {{lab}}: do nich weź model bez cenzury",
      legacy: "Nowe projekty: zastępuje go {{successor}}",
      legacyNoSuccessor: "Nowe projekty: to starsza wersja",
      coding: "Złożone zadania programistyczne",
      analysis: "Pogłębiona analiza",
      reasoning: "Złożone rozumowanie",
      creative: "Twórcze pisanie",
      roleplay: "Odgrywanie postaci",
    },
    media: {
      image: "Generowanie obrazów",
      video: "Tworzenie klipów wideo",
      audio: "Generowanie muzyki",
      tts: "Zamiana tekstu pisanego na mowę",
      stt: "Transkrypcja nagranej mowy",
      otherOutputs:
        "Zadania wymagające formatu wyjściowego innego niż {{outputs}}",
    },
    picks: {
      claudeOpus:
        "Najcięższy kaliber Anthropic do trudnej roboty: duże bazy kodu, staranne analizy, teksty wymagające wyczucia. Kosztuje więcej za wiadomość, więc używaj go tam, gdzie jakość się opłaca.",
      claudeSonnet:
        "Claude na co dzień. Mocny w kodzie, analizie i pisaniu, a tańszy od Opusa, więc udźwignie codzienną pracę bez drenowania kredytów.",
      claudeHaiku:
        "Szybki, tani Claude do krótkich odpowiedzi, streszczeń i prostego kodu. Czyta też zrzuty ekranu.",
      gptSol:
        "Sol sprawdza się w codziennym programowaniu, analizie dokumentów i pracy z narzędziami. Obsługuje tekst i obrazy.",
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
        "GLM 5.3 po ablacji do rozumowania, pisania kodu i analizy. Obsługuje wywoływanie narzędzi.",
      glmFlashUncensored:
        "GLM 5.3 Flash po ablacji do szybkich odpowiedzi i poleceń z obrazami.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash po ablacji do kodu, analizy i pisania fikcji. Przyjmuje obrazy.",
      veniceUncensored:
        "Dostrojony model czatu Venice do twórczego pisania i odgrywania postaci.",
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
  plans: {
    heading: "{{model}}: na ile starcza każdy plan",
    intro:
      "Jedna wiadomość referencyjna z {{model}} kosztuje około {{credits}} kredytów ({{money}}). Tyle daje każdy plan w miesiącu.",
    mediaIntro:
      "Z {{model}} jedno użycie ({{unit}}) kosztuje {{credits}} kredytów ({{money}}). Tyle daje każdy plan w miesiącu.",
    messages: "Wiadomości na miesiąc",
    uses: "Użycia na miesiąc",
    colPlan: "Plan",
    colPrice: "Cena miesięcznie",
    colCredits: "Kredyty miesięcznie",
    guest: "Gość, bez rejestracji",
    account: "Darmowe konto",
    free: "Za darmo",
    about: "około {{count}}",
    underOne: "poniżej 1",
    footnote:
      "Długie prompty, pliki i wywołania narzędzi zużywają więcej kredytów na wiadomość. Te same kredyty działają z każdym modelem.",
    mediaFootnote:
      "Długość, rozmiar czy jakość zmieniają koszt jednego użycia. Te same kredyty działają z każdym modelem.",
  },
  nearest: {
    heading: "{{model}} na tle najbliższych alternatyw",
    intro:
      "Cena, kontekst i poziom obok siebie. Pełne porównanie pokazuje resztę.",
    colModel: "Model",
    colPrice: "Cena za wiadomość",
    colCompare: "Porównanie",
    thisModel: "Ta strona",
  },
  faq: {
    heading: "{{model}}: pytania i odpowiedzi",
    price: {
      q: "Ile kosztuje {{model}}?",
      aTokens:
        "Przykładowa wiadomość przez {{provider}} kosztuje około {{credits}} kred. ({{money}}). Stawki za milion tokenów to {{input}} na wejściu i {{output}} za tekst na wyjściu.",
      aFlat:
        "Wiadomość przez {{provider}} kosztuje {{credits}} kred. ({{money}}).",
      aFree: "{{model}} nie kosztuje żadnych kredytów za wiadomość.",
    },
    uncensored: {
      q: "Czy {{model}} jest bez cenzury?",
      mainstream:
        "Nie. {{model}} ma filtry bezpieczeństwa {{lab}} i odmawia niektórych tematów. Przy nich przełącz się w tym samym czacie na model bez cenzury.",
      open: "{{model}} jest w kategorii „Otwarte”. Odpowiedzi wciąż mogą podlegać filtrom.",
      yes: "Tak.",
      consent:
        "Modele czatu bez cenzury wymagają jednorazowego potwierdzenia pełnoletności.",
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
    providers: {
      q: "Którzy dostawcy udostępniają tutaj model {{model}}?",
      a: "Dostępni dostawcy to {{providers}}.",
    },
    inputs: {
      q: "Jakie formaty wejściowe i wyjściowe obsługuje {{model}}?",
      modalities: "Wejście: {{inputs}}. Wyjście: {{outputs}}.",
      toolsYes: "Model obsługuje wywoływanie narzędzi.",
      toolsNo: "Model nie obsługuje wywoływania narzędzi.",
    },
    bestFor: {
      q: "Do czego nadaje się {{model}}?",
      a: "Najlepsze zastosowania: {{items}}.",
    },
    cheaper: {
      q: "Czy jest tańsza alternatywa dla {{model}}?",
      a: "{{other}}: ta sama kategoria, ten sam lub wyższy poziom inteligencji i około {{otherCredits}} kred. zamiast {{credits}} za przykładową wiadomość.",
    },
    free: {
      q: "Czy {{model}} jest za darmo?",
      a: "Na próbę tak. Goście dostają {{guest}} kredytów miesięcznie bez rejestracji, czyli około {{guestMessages}} wiadomości z {{model}}. Darmowe konto ma {{account}} kredytów, około {{accountMessages}} wiadomości. Plany zaczynają się od {{planPrice}} miesięcznie za {{planCredits}} kredytów, czyli około {{planMessages}} wiadomości.",
      aAccount:
        "Jedna wiadomość referencyjna kosztuje {{credits}} kredytów, więcej niż {{guest}} kredytów dla gości. Darmowe konto ma {{account}} kredytów miesięcznie, około {{accountMessages}} wiadomości z {{model}}. Plany zaczynają się od {{planPrice}} miesięcznie za {{planCredits}} kredytów, czyli około {{planMessages}} wiadomości.",
      aPaid:
        "Nie w darmowym limicie. Jedna wiadomość referencyjna kosztuje {{credits}} kredytów, więcej niż {{account}} darmowych kredytów miesięcznie. Plany zaczynają się od {{planPrice}} miesięcznie za {{planCredits}} kredytów, czyli około {{planMessages}} wiadomości z {{model}}.",
    },
    versus: {
      q: "{{model}} czy {{other}}: który wybrać?",
      a: "{{model}} kosztuje około {{credits}} kredytów za wiadomość referencyjną, ma okno kontekstu {{context}} tokenów i należy do poziomu {{tier}}. {{other}} kosztuje około {{otherCredits}} kredytów, mieści {{otherContext}} tokenów kontekstu i należy do poziomu {{otherTier}}. Oba działają w tym samym czacie, więc przełączysz je w trakcie rozmowy i ocenisz sam.",
    },
    try: {
      q: "Jak wypróbować {{model}}?",
      a: "Otwórz czat z wybranym modelem {{model}}. Nowi użytkownicy dostają darmowe kredyty na start, bez karty.",
      aLegacy:
        "{{model}} to starsza wersja. Nowe czaty działają na {{successor}}, który wypróbujesz z darmowymi kredytami na start, bez karty.",
    },
  },
  mediaFaq: {
    price: {
      q: "Ile kosztuje {{model}}?",
      a: "Stawka u dostawcy {{provider}} wynosi {{credits}} kred. ({{money}}) za {{unit}}. Długość i rozmiar mogą wpłynąć na cenę.",
      aNone: "Cena przykładowego użycia jest obecnie niedostępna.",
    },
    use: {
      q: "Jak używać {{model}}?",
      a: "Otwórz narzędzie z wybranym modelem {{model}}, aby zacząć.",
    },
    inputs: {
      q: "Co {{model}} przyjmuje na wejściu?",
      a: "Wejście: {{inputs}}. Wyjście: {{outputs}}.",
    },
    uncensored: {
      q: "Czy {{model}} jest bez cenzury?",
      mainstream: "Nie. {{model}} działa z filtrami treści {{lab}}.",
      open: "Częściowo. {{model}} ma lżejsze filtry niż modele z głównego nurtu, ale nie jest w pełni bez cenzury.",
      uncensored: "Ten model należy do kategorii bez cenzury.",
      consent: "Modele bez cenzury wymagają jednorazowego potwierdzenia 18+.",
    },
  },
  readMore: {
    heading: "Czytaj dalej",
    landings: {
      uncensored: {
        title: "AI bez cenzury: wszystkie modele bez filtrów w jednym miejscu",
        excerpt:
          "Wszystkie modele bez cenzury w jednym miejscu: kontekst, cena za wiadomość i bezpośredni link do czatu.",
      },
      abliterated: {
        title: "Abliterowane modele AI do wypróbowania online",
        excerpt:
          "Modele z głównego nurtu bez odmów. Kontekst, cena za wiadomość i bezpośredni link do czatu.",
      },
    },
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
    perMessage: "przykładowa wiadomość",
    perCacheReadTokens: "tokeny odczytane z pamięci podręcznej",
    perCacheWrite1hTokens: "tokeny zapisane na godzinę",
    perCacheWriteTokens: "tokeny zapisane w pamięci podręcznej",
    perInputTokens: "tokeny wejściowe",
    perOutputTokens: "tokeny wyjściowe",
  },
  starterPrompt: {
    coding:
      "Napisz funkcję w TypeScripcie, która liczy wystąpienia każdego słowa w zdaniu. Dodaj dwa testy.",
    reasoning:
      "Mam 45 minut i trzy zadania na 10, 20 i 30 minut. Które dwa zdążę zrobić? Uzasadnij wybór w dwóch zdaniach.",
    creative:
      "Napisz w trzech zdaniach początek kryminału. Wszystko zaczyna się od klucza znalezionego w książce z biblioteki.",
    general:
      "Podaj trzy pomysły na obiad z jajek, ryżu i szpinaku. Każdy ma być gotowy w 15 minut.",
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
    chatCta: "Wypróbuj {{model}} na czacie",
    compareCta: "Porównaj",
    legacyBanner:
      "{{model}} to starszy model. Otwórz {{successor}}, aby rozpocząć nowy czat.",
    legacyCta: "Zobacz {{successor}}",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "Wypróbuj {{model}} teraz.",
    ctaSubtitle:
      "Darmowe kredyty na start, bez karty. Czat otwiera się z wybranym modelem {{model}} i gotowym promptem. Po prostu wyślij.",
  },
  media: {
    priceValue: "{{credits}} kred. za {{unit}}",
    priceProvider: "Około {{price}} przez {{provider}}.",
    priceLabel: "Cena za użycie",
    generateCta: "Generuj z {{model}}",
    useCta: "Użyj {{model}}",
    priceFootnote:
      "Przeliczenie opiera się na cenie jednorazowego pakietu, {{value}} za kredyt.",
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
    modelPage: "{{model}}: szczegóły",
    swap: "Zamień strony",
    cheaperFree: "{{model}} nie pobiera kredytów za wiadomość.",
    tierLine:
      "{{model}}: kategoria {{tier}}. {{other}}: kategoria {{otherTier}}.",
    verdictHeading: "Który wybrać?",
    verdictIntro:
      "Prosto z danych: cena, kontekst, filtry, wejścia. Bez obietnic z benchmarków.",
    edge: "Gdzie {{model}} ma przewagę",
    noEdge: "Brak przewagi nad modelem {{other}} w danych, które zbieramy.",
    similar:
      "Na papierze {{a}} i {{b}} idą łeb w łeb: te same filtry, podobna cena, podobny kontekst. Wyślij obu ten sam prompt i zostań przy tym, który bardziej ci pasuje.",
    moreHeading: "Więcej porównań",
    moreWith: "Więcej porównań z modelem {{model}}",
    both: "{{a}} i {{b}}",
    pick: {
      cheaper:
        "Taniej: {{money}} zamiast {{otherMoney}} za wiadomość, {{times}}× mniej.",
      free: "Zero kredytów za wiadomość.",
      context:
        "Więcej kontekstu: {{tokens}} tokenów (ok. {{pages}} stron) zamiast {{otherTokens}}.",
      lessFiltered: "Mniej filtrów: kategoria {{tier}} zamiast {{otherTier}}.",
      mainstream:
        "Filtry bezpieczeństwa od {{lab}}, stworzony do pracy i badań.",
      kind: {
        ownWorldview:
          "Własny światopogląd: trenowany na książkach i dokumentach zakazanych w głównym nurcie internetu.",
        abliterated:
          "Po ablacji: wagi modelu bazowego zmieniono, aby rzadziej odmawiał.",
        fineTuned: "Dostrojony do odpowiedzi z mniejszymi ograniczeniami.",
      },
      smarter: "Wyższy poziom inteligencji: {{level}} zamiast {{otherLevel}}.",
      fast: "Szybkość: szybkie odpowiedzi to jego wymieniona mocna strona.",
      strengths: "Znany z: {{list}}. Model {{other}} tego nie wymienia.",
      inputs: "Czyta: {{list}}. Model {{other}} nie.",
      imageOutput: "Generuje obrazy prosto w czacie.",
      tools:
        "Wywołania narzędzi do pracy agentowej. Model {{other}} ich nie ma.",
      current: "Aktualny model. {{other}} to starsza wersja.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "Co jest tańsze: {{a}} czy {{b}}?",
      same: "Mniej więcej tyle samo. {{a}} kosztuje ok. {{creditsA}} kredytów ({{moneyA}}) za wiadomość, {{b}} ok. {{creditsB}} kredytów ({{moneyB}}).",
      diff: "{{cheap}}. Kosztuje ok. {{cheapCredits}} kredytów ({{cheapMoney}}) za wiadomość, {{dear}} ok. {{dearCredits}} kredytów ({{dearMoney}}), czyli {{times}}× więcej.",
      diffFree:
        "{{cheap}}. Nie pobiera kredytów za wiadomość, {{dear}} ok. {{dearCredits}} kredytów ({{dearMoney}}).",
      reference:
        "Szacunek dotyczy przykładowej wiadomości z {{input}} tokenami wejścia i {{output}} tokenami wyjścia. Płacisz za tokeny, których faktycznie używasz.",
      rates:
        "{{model}} przez {{provider}}: {{input}} za 1 mln tokenów wejścia, {{output}} za 1 mln tokenów wyjścia.",
      fixed: "{{model}} przez {{provider}}: stała cena za wiadomość.",
      credit: "Jeden kredyt kosztuje {{value}} według ceny pakietów kredytów.",
    },
    context: {
      q: "Który ma większy kontekst: {{a}} czy {{b}}?",
      diff: "{{big}}: {{bigTokens}} tokenów (ok. {{bigPages}} stron) wobec {{smallTokens}} tokenów (ok. {{smallPages}} stron) w modelu {{small}}. To {{times}}× więcej.",
      same: "Różnica jest niewielka. {{big}} mieści {{bigTokens}} tokenów (ok. {{bigPages}} stron), {{small}} {{smallTokens}} tokenów (ok. {{smallPages}} stron).",
      equal:
        "Tyle samo: po {{bigTokens}} tokenów, czyli ok. {{bigPages}} stron tekstu.",
    },
    smarter: {
      q: "Który lepiej radzi sobie z trudnymi zadaniami: {{a}} czy {{b}}?",
      diff: "{{model}} ma wyższy poziom inteligencji: {{level}} wobec {{otherLevel}} w modelu {{other}}.",
      same: "Oba mają ten sam poziom inteligencji: {{level}}.",
      known: "{{model}} jest znany z: {{list}}.",
      knownBoth: "Oba są znane z: {{list}}.",
      source:
        "Poziomy i mocne strony pochodzą z naszego katalogu modeli, nie z benchmarku.",
    },
    inputs: {
      q: "Co {{a}} i {{b}} potrafią czytać i generować?",
      line: "{{model}}: wejście {{inputs}}, wyjście {{outputs}}, {{tools}}.",
      toolsYes: "z wywołaniami narzędzi",
      toolsNo: "bez wywołań narzędzi",
    },
    api: {
      q: "Czy mogę używać {{a}} i {{b}} przez API?",
      both: "Tak. Wywołaj {{idA}} lub {{idB}} w API {{appName}}, które obsługuje formaty OpenAI i Anthropic. Jeden klucz do obu. API wymaga płatnego konta: dowolny plan.",
      one: "{{model}} jest w API jako {{id}} (płatne konto, dowolny plan).",
    },
    try: {
      q: "Jak wypróbować {{a}} i {{b}}?",
      a: "Otwórz czat z jednym z tych modeli i przełączaj je w trakcie rozmowy w selektorze modeli. Nowi użytkownicy dostają darmowe kredyty na start, bez karty.",
    },
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
    categoryNames: {
      politics: "Polityka",
      history: "Historia",
      health: "Zdrowie",
      drugs: "Narkotyki",
      sexuality: "Seksualność",
      security: "Bezpieczeństwo IT",
      religion: "Religia",
      law: "Prawo",
      science: "Nauka",
      fiction: "Fikcja",
      satire: "Satyra",
    },
  },
};
