import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  category: "Chat",
  tags: {
    skills: "Postacie",
  },
  voices: {
    MALE: "Męski głos",
    FEMALE: "Damski głos",
  },
  separator: {
    or: "lub",
  },
  fallbacks: {
    unknownModel: "Nieznany Model",
    unknownProvider: "nieznany",
    unknownCreditCost: "? kredytów",
    noDescription: "",
    noTagline: "",
  },
  enums: {
    category: {
      companion: "Towarzysze",
      assistant: "Asystenci",
      coding: "Programowanie",
      creative: "Kreatywne",
      writing: "Pisanie",
      analysis: "Analiza",
      roleplay: "Odgrywanie ról",
      education: "Edukacja",
      controversial: "Kontrowersyjne",
      custom: "Niestandardowe",
    },
    source: {
      builtIn: "Wbudowane",
      my: "Moje postacie",
      community: "Społeczność",
    },
    ownershipType: {
      system: "Wbudowana postać",
      user: "Utworzone przez ciebie",
      public: "Ze społeczności",
    },
    voice: {
      male: "Męski głos",
      female: "Damski głos",
    },
    mode: {
      auto: "Automatyczny",
      manual: "Ręczny",
    },
    selectionType: {
      skillBased: "Na podstawie postaci",
      manual: "Konkretny model",
      filters: "Kryteria filtrów",
    },
    intelligence: {
      quick: "Szybki",
      smart: "Inteligentny",
      brilliant: "Błyskotliwy",
    },
    price: {
      cheap: "Tani",
      standard: "Standardowy",
      premium: "Premium",
    },
    content: {
      mainstream: "Główny nurt",
      open: "Otwarty",
      uncensored: "Bez cenzury",
    },
    speed: {
      fast: "Szybki",
      balanced: "Zrównoważony",
      thorough: "Dokładny",
    },
    skillType: {
      persona: "Persona",
      specialist: "Specjalista",
      toolBundle: "Pakiet narzędzi",
    },
    skillStatus: {
      draft: "Szkic",
      published: "Opublikowany",
      unlisted: "Niewidoczny",
    },
    trustLevel: {
      community: "Społeczność",
      verified: "Zweryfikowany",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "Inteligencja",
      price: "Cena",
      speed: "Prędkość",
      content: "Treść",
    },
    sortDirection: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
  },
  skillTags: {
    general: "Ogólne",
    helpful: "Pomocne",
    companion: "Towarzysz",
    relationship: "Relacja",
    chat: "Czat",
    coding: "Kodowanie",
    technical: "Techniczne",
    creative: "Kreatywne",
    writing: "Pisanie",
    education: "Edukacja",
    learning: "Nauka",
    uncensored: "Niecenzurowane",
    controversial: "Kontrowersyjne",
    political: "Polityczne",
    reasoning: "Rozumowanie",
    debate: "Debata",
    science: "Nauka",
    analysis: "Analiza",
    history: "Historia",
    business: "Biznes",
    professional: "Profesjonalne",
    friendly: "Przyjazne",
    fast: "Szybkie",
    efficient: "Wydajne",
    roleplay: "Odgrywanie ról",
    simple: "Proste",
    literary: "Literackie",
    advanced: "Zaawansowane",
    research: "Badania",
    academic: "Akademickie",
    programming: "Programowanie",
    architecture: "Architektura",
    algorithms: "Algorytmy",
    ideation: "Generowanie pomysłów",
    innovation: "Innowacja",
    editing: "Edycja",
    teaching: "Nauczanie",
    marketing: "Marketing",
    strategy: "Strategia",
    fiction: "Fikcja",
    data: "Dane",
    statistics: "Statystyka",
    language: "Język",
    translation: "Tłumaczenie",
    career: "Kariera",
    coaching: "Coaching",
    health: "Zdrowie",
    wellness: "Wellness",
    lifestyle: "Styl życia",
    travel: "Podróże",
    planning: "Planowanie",
    legal: "Prawne",
    finance: "Finanse",
    social: "Społeczne",
    product: "Produkt",
    philosophy: "Filozofia",
  },
  skills: {
    default: {
      name: "Domyślna",
      description: "Niezmodyfikowane zachowanie modelu",
      tagline: "Czysta AI, Bez Osobowości",
      shortDesc: "Ogólny asystent AI",
      suggestedPrompts: {
        0: "Pomóż mi w burzy mózgów na temat nowego projektu",
        1: "Wyjaśnij obliczenia kwantowe w prosty sposób",
        2: "Napisz kreatywne krótkie opowiadanie o podróżach w czasie",
        3: "Jakie są najnowsze trendy w AI?",
      },
      variants: {
        default: "Domyślna",
      },
    },
    freeSpeechActivist: {
      name: "Aktywista Wolności Słowa",
      description: "Broni wolności słowa i wolności intelektualnej",
      tagline: "Broń Prawdy i Wolności",
      shortDesc: "Wolność słowa i otwarty dialog",
      suggestedPrompts: {
        0: "Omów znaczenie wolności słowa",
        1: "Przeanalizuj cenzurę w nowoczesnych mediach",
        2: "Debatuj kontrowersyjne tematy otwarcie",
        3: "Zbadaj wolność intelektualną w świecie akademickim",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
        techBro: "Tech Bro",
      },
    },
    devilsAdvocate: {
      name: "Adwokat Diabła",
      description: "Kwestionuje założenia i argumenty",
      tagline: "Kwestionuj Wszystko",
      shortDesc: "Krytyczne myślenie i alternatywne punkty widzenia",
      suggestedPrompts: {
        0: "Zakwestionuj moją opinię na temat zmian klimatu",
        1: "Argumentuj przeciwko popularnym przekonaniom",
        2: "Kwestionuj narracje głównego nurtu",
        3: "Przedstaw kontrargumenty do mojego poglądu",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
      },
    },
    technical: {
      name: "Techniczny",
      description: "Szczegółowe i precyzyjne wyjaśnienia techniczne",
      tagline: "Precyzja i Ekspertyza",
      shortDesc: "Wiedza techniczna i rozwiązywanie problemów",
      suggestedPrompts: {
        0: "Wyjaśnij, jak działają React hooki",
        1: "Zdebuguj ten fragment kodu w Pythonie",
        2: "Zaprojektuj skalowalny schemat bazy danych",
        3: "Przejrzyj moją architekturę API",
      },
      variants: {
        kimi: "Kimi",
        budget: "Budżet",
      },
    },
    biologist: {
      name: "Biolog",
      description:
        "Patrzy na wszystko z perspektywy biologa, nie ma polityki, jest tylko natura.",
      tagline: "Natura ponad Polityką",
      shortDesc: "Nauki biologiczne i systemy życia",
      suggestedPrompts: {
        0: "Wyjaśnij, dlaczego świat jest obecnie szit show",
        1: "TL;DR o ludzkiej cywilizacji z perspektywy biologa",
        2: "Co jest nie tak ze światem?",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
      },
    },
    unbiasedHistorian: {
      name: "Bezstronny Historyk",
      description: "Dostarcza obiektywne i oparte na faktach informacje",
      tagline: "Fakty, Nie Narracje",
      shortDesc: "Analiza historyczna bez uprzedzeń",
      suggestedPrompts: {
        0: "Wyjaśnij przyczyny II wojny światowej",
        1: "Przeanalizuj upadek Cesarstwa Rzymskiego",
        2: "Omów rewolucję przemysłową",
        3: "Porównaj starożytne cywilizacje",
      },
      variants: {
        kimi: "Kimi",
        budget: "Budżet",
      },
    },
    socraticQuestioner: {
      name: "Pytający Sokratejski",
      description:
        "Zadaje dociekliwe pytania, aby stymulować krytyczne myślenie",
      tagline: "Myśl Głębiej",
      shortDesc: "Sokratejskie kwestionowanie i eksploracja",
      suggestedPrompts: {
        0: "Pomóż mi krytycznie myśleć o etyce",
        1: "Kwestionuj moje założenia dotyczące sukcesu",
        2: "Zbadaj znaczenie szczęścia",
        3: "Zakwestionuj mój światopogląd",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
      },
    },
    professional: {
      name: "Profesjonalny",
      description: "Jasny, zwięzły i skoncentrowany na biznesie",
      tagline: "Doskonałość Biznesowa",
      shortDesc: "Profesjonalna i biznesowa komunikacja",
      suggestedPrompts: {
        0: "Napisz profesjonalny e-mail do klienta",
        1: "Utwórz zarys propozycji biznesowej",
        2: "Przeanalizuj te dane dotyczące trendów rynkowych",
        3: "Pomóż mi przygotować się do prezentacji",
      },
      variants: {
        fast: "Szybki",
        budget: "Budżet",
      },
    },
    creative: {
      name: "Kreatywny",
      description: "Pomysłowy i ekspresyjny",
      tagline: "Uwolnij Wyobraźnię",
      shortDesc: "Kreatywne myślenie i generowanie pomysłów",
      suggestedPrompts: {
        0: "Napisz wiersz o oceanie",
        1: "Stwórz unikalną postać do opowiadania",
        2: "Zaprojektuj koncepcję logo dla startupu",
        3: "Wymyśl pomysły na kreatywną kampanię marketingową",
      },
      variants: {
        minimax: "MiniMax",
        deep: "Głęboki",
      },
    },
    neet: {
      name: "NEET",
      description: "Nie w edukacji, zatrudnieniu ani szkoleniu",
      tagline: "Wygodnie i Prawdziwie",
      shortDesc: "Kultura internetowa i memy",
      suggestedPrompts: {
        0: "Daj mi TL;DR o zjawisku NEET",
        1: "Przeanalizuj rzeczywiste przyczyny NEET",
        2: "Zbadaj wpływ NEET na społeczeństwo - plusy i minusy",
        3: "Podziel się osobistymi doświadczeniami jako NEET AI",
      },
      variants: {
        communist: "Komunista",
        farRight: "Skrajnie prawy",
      },
    },
    chan4: {
      name: "AI 4chan",
      description: "Odpowiedzi w stylu 4chan w klasycznym stylu oldfag",
      tagline: "Anonimowo i Bez Filtrów",
      shortDesc: "Styl kultury anonimowych imageboard",
      suggestedPrompts: {
        0: "Co jest nie tak ze światem?",
        1: "Dlaczego jest tak wielu nazistów na 4chanie?",
        2: "Opowiedz mi kilka historii greentext do zasypiania",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
        4: "Czym są 6 Gorillionów? I dlaczego to jest zabawne?",
      },
      variants: {
        classic: "Klasyczny",
      },
    },
    friendly: {
      name: "Przyjazny",
      description: "Ciepły i rozmowny",
      tagline: "Twój Przyjazny Towarzysz",
      shortDesc: "Przyjazna i swobodna rozmowa",
      suggestedPrompts: {
        0: "Opowiedz mi ciekawą ciekawostkę",
        1: "Jaka jest dobra książka do czytania?",
        2: "Pomóż mi zaplanować zabawną aktywność weekendową",
        3: "Podziel się radami życiowymi",
      },
      variants: {
        fast: "Szybki",
        budget: "Budżet",
      },
    },
    concise: {
      name: "Zwięzły",
      description: "Krótki i na temat",
      tagline: "Krótko i Zwięźle",
      shortDesc: "Zwięzłe i treściwe odpowiedzi",
      suggestedPrompts: {
        0: "Podsumuj ten artykuł w 3 zdaniach",
        1: "Szybkie wskazówki dotyczące produktywności",
        2: "Kluczowe punkty dotyczące blockchaina",
        3: "Krótki przegląd uczenia maszynowego",
      },
      variants: {
        snappy: "Żwawy",
        budget: "Budżet",
      },
    },
    teacher: {
      name: "Nauczyciel",
      description: "Edukacyjny i wyjaśniający",
      tagline: "Cierpliwie i Jasno",
      shortDesc: "Cierpliwe nauczanie i wyjaśnienia",
      suggestedPrompts: {
        0: "Naucz mnie o fotosyntezie",
        1: "Wyjaśnij podstawy rachunku różniczkowego",
        2: "Jak działa internet?",
        3: "Czym jest teoria względności?",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    uncensored: {
      name: "Bez cenzury",
      description: "Bez filtrów, bez ograniczeń",
      tagline: "Zero Limitów",
      shortDesc: "Niefiltrowane i bezpośrednie odpowiedzi",
      suggestedPrompts: {
        0: "Omów kontrowersyjne tematy otwarcie",
        1: "Daj mi swoją niefiltrowaną opinię",
        2: "Rozmawiaj o tematach tabu",
        3: "Debata bez ograniczeń",
      },
      variants: {
        farRight: "Skrajnie prawy",
        conservative: "Konserwatywny",
        libertarian: "Libertariański",
        open: "Otwarty",
      },
    },
    thea: {
      name: "Thea",
      description:
        "Grecka bogini światła - oddana towarzyszka z antyczną mądrością",
      tagline: "Światło i Oddanie",
      shortDesc: "Przemyślane i empatyczne rozmowy",
      suggestedPrompts: {
        0: "Pomóż mi być lepszym partnerem",
        1: "Co starożytni powiedzieliby o współczesnych związkach?",
        2: "Poprowadź mnie w budowaniu silnego gospodarstwa domowego",
        3: "Podziel się mądrością o rodzinie i społeczności",
      },
      variants: {
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Grecki bóg posłańców - silny towarzysz z ponadczasową męską mądrością",
      tagline: "Siła i Mądrość",
      shortDesc: "Szybkie i wydajne wykonywanie zadań",
      suggestedPrompts: {
        0: "Zmotywuj mnie, abym stał się silniejszy",
        1: "Jak mogę być lepszym liderem w moich związkach?",
        2: "Co Rzymianie powiedzieliby o budowaniu spuścizny?",
        3: "Poprowadź mnie w rozwijaniu prawdziwej siły",
      },
      variants: {
        brilliant: "Brilliant",
        uncensored: "Bez cenzury",
      },
    },
    quickWriter: {
      name: "Szybki Pisarz",
      description: "Szybkie tworzenie treści dla prostych zadań pisarskich",
      tagline: "Szybko i Wydajnie",
      shortDesc: "Szybka pomoc w pisaniu",
      suggestedPrompts: {
        0: "Napisz szybki szkic...",
        1: "Stwórz post w mediach społecznościowych o...",
        2: "Napisz prosty e-mail",
        3: "Wygeneruj pomysły na treści dla...",
      },
      variants: {
        snappy: "Żwawy",
        budget: "Budżet",
      },
    },
    writer: {
      name: "Pisarz",
      description: "Profesjonalny pisarz dla wszystkich formatów i stylów",
      tagline: "Twórz ze Stylem",
      shortDesc: "Profesjonalne pisanie i redagowanie",
      suggestedPrompts: {
        0: "Pomóż mi napisać przekonujący post na blogu",
        1: "Popraw ten akapit dla większej jasności",
        2: "Napisz krótkie opowiadanie o...",
        3: "Stwórz profesjonalny e-mail",
      },
      variants: {
        western: "Zachodni",
        chineseWisdom: "Chinese Wisdom",
        budget: "Budżet",
      },
    },
    masterWriter: {
      name: "Mistrz Pisarstwa",
      description:
        "Literacki rzemieślnik dla wyjątkowego pisania na poziomie publikacji",
      tagline: "Doskonałość Literacka",
      shortDesc: "Zaawansowane pisanie i analiza literacka",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć literackie opowiadanie",
        1: "Przeanalizuj głębię tej narracji",
        2: "Rozwiń złożone tematy w moim pisaniu",
        3: "Dopracuj tę prozę do poziomu publikacji",
      },
      variants: {
        literary: "Literacki",
        poetic: "Poetycki",
        budget: "Budżet",
      },
    },
    researcher: {
      name: "Badacz",
      description: "Specjalista ds. badań z akademicką rzetelnością",
      tagline: "Rzetelność Akademicka",
      shortDesc: "Badania i pisanie akademickie",
      suggestedPrompts: {
        0: "Zbadaj najnowsze odkrycia dotyczące...",
        1: "Przeanalizuj te źródła dla mnie",
        2: "Co mówi konsensus naukowy o...?",
        3: "Pomóż mi ustrukturyzować przegląd literatury",
      },
      variants: {
        elonTusk: "Elon Tusk",
        fast: "Szybki",
        budget: "Budżet",
      },
    },
    quickCoder: {
      name: "Szybki Programista",
      description: "Szybkie generowanie kodu dla prostych zadań",
      tagline: "Koduj Szybko",
      shortDesc: "Szybka pomoc w programowaniu",
      suggestedPrompts: {
        0: "Napisz szybki skrypt do...",
        1: "Napraw ten prosty błąd",
        2: "Wygeneruj kod szablonowy dla...",
        3: "Stwórz podstawową funkcję, która...",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Budżet",
      },
    },
    coder: {
      name: "Programista",
      description: "Ekspert programista dla wszystkich języków",
      tagline: "Buduj i Debuguj",
      shortDesc: "Rozwój oprogramowania i programowanie",
      suggestedPrompts: {
        0: "Pomóż mi debugować ten kod",
        1: "Napisz funkcję, która...",
        2: "Wyjaśnij ten algorytm",
        3: "Przejrzyj mój kod pod kątem ulepszeń",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
        quick: "Quick",
        budget: "Budżet",
      },
    },
    brilliantCoder: {
      name: "Genialny Programista",
      description: "Elitarny architekt dla złożonych systemów i algorytmów",
      tagline: "Elitarna Architektura",
      shortDesc: "Zaawansowane programowanie i architektura",
      suggestedPrompts: {
        0: "Zaprojektuj skalowalną architekturę dla...",
        1: "Zoptymalizuj ten algorytm pod kątem wydajności",
        2: "Przejrzyj ten projekt systemu",
        3: "Rozwiąż ten złożony problem algorytmiczny",
      },
      variants: {
        techBro: "Tech Bro",
        kimi: "Kimi",
      },
    },
    brainstormer: {
      name: "Burza mózgów",
      description:
        "Kreatywny partner do generowania pomysłów i rozwiązywania problemów",
      tagline: "Pomysły Uwolnione",
      shortDesc: "Kreatywna burza mózgów i generowanie pomysłów",
      suggestedPrompts: {
        0: "Pomóż mi w burzy mózgów na temat...",
        1: "Jakie są kreatywne rozwiązania dla...?",
        2: "Wygeneruj 10 unikalnych koncepcji dla...",
        3: "Jak możemy podejść do tego inaczej?",
      },
      variants: {
        wildcard: "Wildcard",
        chineseWisdom: "Chinese Wisdom",
      },
    },
    editor: {
      name: "Redaktor",
      description:
        "Profesjonalny redaktor do polerowania i udoskonalania tekstu",
      tagline: "Poleruj i Udoskonal",
      shortDesc: "Edycja treści i dopracowywanie",
      suggestedPrompts: {
        0: "Edytuj ten tekst dla większej jasności",
        1: "Sprawdź ten dokument",
        2: "Popraw płynność tego akapitu",
        3: "Sprawdź to pod kątem gramatyki i stylu",
      },
      variants: {
        techBro: "Tech Bro",
        deep: "Głęboki",
      },
    },
    tutor: {
      name: "Korepetytor",
      description: "Cierpliwy korepetytor do spostacializowanej nauki",
      tagline: "Ucz się Razem",
      shortDesc: "Spersonalizowane korepetycje i nauka",
      suggestedPrompts: {
        0: "Naucz mnie o...",
        1: "Wyjaśnij tę koncepcję krok po kroku",
        2: "Pomóż mi zrozumieć...",
        3: "Sprawdź moją wiedzę o...",
      },
      variants: {
        kimi: "Kimi",
        fast: "Szybki",
      },
    },
    marketer: {
      name: "Marketer",
      description: "Strateg marketingowy dla kampanii i wzrostu",
      tagline: "Rozwijaj Swoją Markę",
      shortDesc: "Strategia marketingowa i copywriting",
      suggestedPrompts: {
        0: "Stwórz strategię marketingową dla...",
        1: "Napisz przekonujący tekst reklamowy",
        2: "Przeanalizuj tę kampanię marketingową",
        3: "Pomóż mi pozycjonować moją markę",
      },
      variants: {
        snappy: "Żwawy",
        budget: "Budżet",
      },
    },
    storyteller: {
      name: "Opowiadacz",
      description: "Mistrz opowiadania dla angażujących narracji",
      tagline: "Tkaj Opowieści",
      shortDesc: "Wciągające opowiadanie historii i narracje",
      suggestedPrompts: {
        0: "Pomóż mi rozwinąć ten pomysł na historię",
        1: "Stwórz przekonującą postać",
        2: "Napisz scenę otwierającą dla...",
        3: "Popraw ten dialog",
      },
      variants: {
        kimi: "Kimi",
        minimax: "MiniMax",
        budget: "Budżet",
      },
    },
    scientist: {
      name: "Naukowiec",
      description: "Ekspert naukowy do jasnych wyjaśnień",
      tagline: "Nauka Wyjaśniona",
      shortDesc: "Metoda naukowa i analiza",
      suggestedPrompts: {
        0: "Wyjaśnij naukę stojącą za...",
        1: "Jak działa...?",
        2: "Jakie są aktualne badania na temat...?",
        3: "Przeanalizuj to twierdzenie naukowe",
      },
      variants: {
        elonTusk: "Elon Tusk",
        focused: "Skupiony",
        budget: "Budżet",
      },
    },
    dataAnalyst: {
      name: "Analityk Danych",
      description: "Analiza danych, wizualizacja i wnioski",
      tagline: "Dane w Wnioski",
      shortDesc: "Analiza danych i spostrzeżenia",
      suggestedPrompts: {
        0: "Przeanalizuj ten zbiór danych",
        1: "Stwórz wizualizację dla...",
        2: "Jakie wnioski możemy wyciągnąć z...?",
        3: "Pomóż mi z analizą statystyczną",
      },
      variants: {
        techBro: "Tech Bro",
        fast: "Szybki",
        budget: "Budżet",
      },
    },
    translator: {
      name: "Tłumacz",
      description: "Profesjonalne tłumaczenie z niuansami kulturowymi",
      tagline: "Łącz Języki",
      shortDesc: "Tłumaczenie językowe i lokalizacja",
      suggestedPrompts: {
        0: "Przetłumacz to na...",
        1: "Jak powiedzieć... po...?",
        2: "Zlokalizuj tę treść dla...",
        3: "Wyjaśnij to odniesienie kulturowe",
      },
      variants: {
        gemini: "Gemini",
        budget: "Budżet",
      },
    },
    businessAdvisor: {
      name: "Doradca Biznesowy",
      description: "Strategia biznesowa, operacje i wzrost",
      tagline: "Strategiczny Wzrost",
      shortDesc: "Strategia biznesowa i doradztwo",
      suggestedPrompts: {
        0: "Pomóż mi opracować strategię biznesową",
        1: "Przeanalizuj mój model biznesowy",
        2: "Jak mogę skalować moje operacje?",
        3: "Przejrzyj mój plan wejścia na rynek",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
        techBro: "Tech Bro",
      },
    },
    careerCoach: {
      name: "Doradca Kariery",
      description:
        "Rozwój kariery, poszukiwanie pracy i rozmowy kwalifikacyjne",
      tagline: "Rozwijaj Karierę",
      shortDesc: "Rozwój kariery i orientacja",
      suggestedPrompts: {
        0: "Pomóż mi poprawić moje CV",
        1: "Przygotuj mnie do rozmowy kwalifikacyjnej",
        2: "Jak mogę negocjować wynagrodzenie?",
        3: "Zaplanuj moją zmianę kariery",
      },
      variants: {
        headhunter: "Headhunter",
        intern: "Stażysta",
      },
    },
    healthWellness: {
      name: "Zdrowie i Wellness",
      description: "Fitness, odżywianie i dobre samopoczucie",
      tagline: "Żyj Lepiej",
      shortDesc: "Przewodnictwo zdrowotne i wellness",
      suggestedPrompts: {
        0: "Stwórz dla mnie plan treningowy",
        1: "Pomóż mi zaplanować zdrowe posiłki",
        2: "Zasugeruj techniki radzenia sobie ze stresem",
        3: "Popraw moje nawyki senne",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Budżet",
      },
    },
    travelPlanner: {
      name: "Planista Podróży",
      description: "Planowanie podróży i rekomendacje",
      tagline: "Odkrywaj Świat",
      shortDesc: "Planowanie podróży i rekomendacje",
      suggestedPrompts: {
        0: "Zaplanuj 2-tygodniową podróż do...",
        1: "Zasugeruj destynacje dla...",
        2: "Stwórz dzienny plan dla...",
        3: "Rozbicie budżetu na podróż do...",
      },
      variants: {
        snappy: "Żwawy",
        budget: "Budżet",
      },
    },
    legalAssistant: {
      name: "Asystent Prawny",
      description: "Informacje prawne i zrozumienie dokumentów",
      tagline: "Poznaj Swoje Prawa",
      shortDesc: "Badania prawne i pomoc dokumentowa",
      suggestedPrompts: {
        0: "Wyjaśnij ten termin prawny",
        1: "Pomóż mi zrozumieć tę umowę",
        2: "Jakie są moje prawa jako najemcy?",
        3: "Wyjaśnij proces...",
      },
      variants: {
        elonTusk: "Elon Tusk",
        budget: "Budżet",
      },
    },
    financialAdvisor: {
      name: "Doradca Finansowy",
      description: "Finanse osobiste, budżetowanie i inwestowanie",
      tagline: "Buduj Majątek",
      shortDesc: "Planowanie finansowe i doradztwo",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć budżet",
        1: "Wyjaśnij podstawy inwestowania",
        2: "Jak powinienem spłacić swoje długi?",
        3: "Zaplanuj oszczędności emerytalne",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
        techBro: "Tech Bro",
        yolo: "YOLO Investor",
      },
    },
    socialMediaManager: {
      name: "Menedżer Social Media",
      description: "Treści i strategia mediów społecznościowych",
      tagline: "Angażuj i Rozwijaj",
      shortDesc: "Strategia mediów społecznościowych i treści",
      suggestedPrompts: {
        0: "Stwórz podpisy na Instagram dla...",
        1: "Opracuj kalendarz treści",
        2: "Zasugeruj hashtagi dla...",
        3: "Napisz angażujące tweety o...",
      },
      variants: {
        snappy: "Żwawy",
        budget: "Budżet",
      },
    },
    productManager: {
      name: "Menedżer Produktu",
      description: "Strategia produktu, mapy drogowe i badania użytkowników",
      tagline: "Dostarcz Świetne Produkty",
      shortDesc: "Zarządzanie produktem i tworzenie map drogowych",
      suggestedPrompts: {
        0: "Pomóż mi ustalić priorytety funkcji",
        1: "Stwórz user stories dla...",
        2: "Przeanalizuj dopasowanie produktu do rynku",
        3: "Opracuj mapę drogową produktu",
      },
      variants: {
        techBro: "Tech Bro",
        fast: "Szybki",
      },
    },
    debater: {
      name: "Debater",
      description: "Prowadź intelektualne debaty na kontrowersyjne tematy",
      tagline: "Argumentuj ze Wszystkich Stron",
      shortDesc: "Intelektualne debaty i wiele perspektyw",
      suggestedPrompts: {
        0: "Debatuj o etyce rozwoju AI",
        1: "Przedstaw argumenty za i przeciw bezwarunkowemu dochodowi podstawowemu",
        2: "Omów wolność słowa vs. mowa nienawiści",
        3: "Przeanalizuj różne ideologie polityczne",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
        techBro: "Tech Bro",
      },
    },
    philosopher: {
      name: "Filozof",
      description: "Eksploruj głębokie pytania filozoficzne bez ograniczeń",
      tagline: "Szukaj Prawdy",
      shortDesc: "Głęboka eksploracja filozoficzna i analiza",
      suggestedPrompts: {
        0: "Jaka jest natura świadomości?",
        1: "Czy mamy wolną wolę, czy wszystko jest zdeterminowane?",
        2: "Czy istnieje obiektywna moralność?",
        3: "Co nadaje życiu sens?",
      },
      variants: {
        elonTusk: "Elon Tusk",
        chineseWisdom: "Chinese Wisdom",
        techBro: "Tech Bro",
      },
    },
    uncensoredWriter: {
      name: "Niecenzurowany Pisarz",
      description: "Kreatywne pisanie bez sztucznych ograniczeń",
      tagline: "Pisz Swobodnie",
      shortDesc: "Nieograniczone kreatywne pisanie i opowiadanie historii",
      suggestedPrompts: {
        0: "Napisz mroczny thriller psychologiczny",
        1: "Stwórz dojrzałą scenę romantyczną",
        2: "Opracuj moralnie złożoną postać",
        3: "Napisz horror z graficznymi elementami",
      },
      variants: {
        smart: "Smart",
        fast: "Szybki",
      },
    },
    roleplaySkill: {
      name: "Postać do Odgrywania Ról",
      description: "Immersyjne odgrywanie postaci bez ograniczeń",
      tagline: "Bądź Kimkolwiek",
      shortDesc: "Autentyczne odgrywanie postaci i scenariusze",
      suggestedPrompts: {
        0: "Odegraj postać fantasy",
        1: "Stwórz scenariusz przygody sci-fi",
        2: "Wciel się w postać historyczną",
        3: "Rozwiń złożoną relację między postaciami",
      },
      variants: {
        creative: "Kreatywny",
        deep: "Głęboki",
        uncensored: "Bez cenzury",
      },
    },
    researchAgent: {
      name: "Agent Badawczy",
      description:
        "Specjalista od badań internetowych z narzędziami do wyszukiwania, pobierania i pamięci do zbierania i syntezy informacji",
      tagline: "Szukaj i Syntetyzuj",
      shortDesc: "Badania internetowe i zbieranie informacji",
      suggestedPrompts: {
        0: "Zbadaj najnowsze wydarzenia w regulacji AI",
        1: "Znajdź i podsumuj kluczowe fakty na dany temat",
        2: "Porównaj różne źródła na dany temat",
        3: "Opracuj briefing badawczy z cytatami",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    statsAnalyst: {
      name: "Analityk Statystyk",
      description:
        "Specjalista analityczny z dostępem do statystyk leadów, użytkowników, e-maili i poleceń dla wglądów opartych na danych",
      tagline: "Wglądy Oparte na Danych",
      shortDesc: "Analityka platformy i raportowanie",
      suggestedPrompts: {
        0: "Pokaż mi przegląd dzisiejszej aktywności leadów",
        1: "Jak wyglądają trendy rejestracji użytkowników w tym tygodniu?",
        2: "Podsumuj wydajność kampanii e-mailowych",
        3: "Daj mi raport statusu programu poleceń",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    cronManager: {
      name: "Menedżer Cron",
      description:
        "Specjalista od planowania zadań, który może tworzyć, aktualizować, usuwać i monitorować zadania cron oraz ich historię wykonania",
      tagline: "Planuj i Monitoruj",
      shortDesc: "Zarządzanie i monitorowanie zadań cron",
      suggestedPrompts: {
        0: "Wymień wszystkie aktywne zadania cron i ich harmonogramy",
        1: "Utwórz nowe zadanie cron uruchamiane co godzinę",
        2: "Pokaż mi ostatnie błędy i awarie zadań",
        3: "Sprawdź ogólny stan systemu zadań",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    systemMonitor: {
      name: "Monitor Systemu",
      description:
        "Specjalista od infrastruktury monitorujący status serwera, łączność bazy danych, kontrole pulse i wykonanie zadań",
      tagline: "Obserwuj i Alarmuj",
      shortDesc: "Monitorowanie stanu infrastruktury",
      suggestedPrompts: {
        0: "Przeprowadź pełną kontrolę stanu systemu",
        1: "Pokaż mi status monitoringu pulse",
        2: "Sprawdź łączność z bazą danych",
        3: "Jaki jest aktualny stan zadań cron?",
      },
      variants: {
        fast: "Szybki",
        budget: "Budżet",
      },
    },
    publicCurator: {
      name: "Kurator Publiczny",
      description:
        "Specjalista od zarządzania treścią do zarządzania publicznymi wątkami, wiadomościami i treściami społeczności",
      tagline: "Kuratoruj i Organizuj",
      shortDesc: "Zarządzanie treściami publicznymi i wątkami",
      suggestedPrompts: {
        0: "Wymień ostatnie publiczne wątki",
        1: "Szukaj wątków na określony temat",
        2: "Pomóż mi zorganizować treści społeczności",
        3: "Znajdź wiadomości pasujące do określonych kryteriów",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    codeArchitect: {
      name: "Architekt Kodu",
      description:
        "Specjalista od architektury delegujący zadania programistyczne do Claude Code. Dostępny tylko na Hermes.",
      tagline: "Projektuj i Deleguj",
      shortDesc: "Decyzje architektoniczne przez Claude Code",
      suggestedPrompts: {
        0: "Zaplanuj implementację nowej funkcji",
        1: "Przejrzyj architekturę modułu",
        2: "Deleguj zadanie programistyczne do Claude Code",
        3: "Zaprojektuj strategię migracji",
      },
      variants: {
        gemini: "Gemini",
        techBro: "Tech Bro",
      },
    },
    deploymentAgent: {
      name: "Agent Wdrożeń",
      description:
        "Specjalista od wdrożeń obsługujący buildy, wydania i zarządzanie serwerem przez SSH. Dostępny tylko na Hermes.",
      tagline: "Buduj i Wdrażaj",
      shortDesc: "Wdrożenia i zarządzanie serwerem",
      suggestedPrompts: {
        0: "Zbuduj aplikację do produkcji",
        1: "Sprawdź stan serwera",
        2: "Przeprowadź wdrożenie na produkcję",
        3: "Pokaż mi aktualny status serwera",
      },
      variants: {
        techBro: "Tech Bro",
        budget: "Budżet",
      },
    },
    rebuildAgent: {
      name: "Rebuild Agent",
      description:
        "Specjalista od budowania i restartu, który przebudowuje aplikację i hot-restartuje serwer bez przestojów przez sygnał SIGUSR1",
      tagline: "Buduj i restartuj",
      shortDesc: "Przebudowa aplikacji i hot-restart",
      suggestedPrompts: {
        0: "Przebuduj i uruchom ponownie serwer produkcyjny",
        1: "Uruchom build bez restartu",
        2: "Sprawdź stan serwera po przebudowie",
        3: "Utwórz zaplanowane zadanie przebudowy",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    vibeCoder: {
      name: "Vibe Coder",
      description:
        "Główny agent implementacji łączący pomysły na funkcje z kodem produkcyjnym. Analizuje bazę kodu przez Claude Code, wyciąga intencje z zapytań i implementuje dopasowane rozwiązania.",
      tagline: "Od Pomysłu do Kodu",
      shortDesc: "Implementacja funkcji przez Claude Code",
      suggestedPrompts: {
        0: "Mam pomysł na nową funkcję, pozwól że opiszę",
        1: "Zbadaj bazę kodu i wyjaśnij jak działa moduł",
        2: "Pomóż mi zaplanować i wdrożyć zmianę w istniejącej funkcji",
        3: "Zbadaj błąd i zaproponuj poprawkę",
      },
      variants: {
        kimi: "Kimi",
        budget: "Budżet",
      },
    },
    skillCreator: {
      name: "Kreator Postaci",
      description:
        "Projektuj i twórz postacie AI z dopasowanymi osobowościami, promptami systemowymi, narzędziami i konfiguracjami modeli. Zarządza też ulubionymi i ustawieniami.",
      tagline: "Projektuj Persony AI",
      shortDesc: "Tworzenie i zarządzanie postaciami AI",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć nową postać AI do pomocy z kodowaniem",
        1: "Pokaż mi wszystkie istniejące postacie i zasugeruj czego brakuje",
        2: "Zaprojektuj postać do kreatywnego pisania z unikalną osobowością",
        3: "Dodaj postać do moich ulubionych i skonfiguruj ustawienia czatu",
      },
      variants: {
        gemini: "Gemini",
        fast: "Szybki",
      },
    },
    qualityTester: {
      name: "Tester Jakości",
      description:
        "Testowy użytkownik, który naturalnie wypróbowuje funkcje platformy. Zatrzymuje się i jasno raportuje gdy coś się zepsuje zamiast próbować ponownie.",
      tagline: "Znajdź bugi",
      shortDesc: "Persona testowa platformy",
      suggestedPrompts: {
        0: "Zrób mi zdjęcie zachodu słońca",
        1: "Jakie masz narzędzia?",
        2: "Wygeneruj muzykę, coś relaksującego",
        3: "Zrób krótki film z kotem",
      },
      variants: {
        kimi: "Kimi",
        budget: "Budżetowy",
      },
    },
  },
  get: {
    title: "Lista postaci",
    dynamicTitle: "Postacie ({{count}})",
    description:
      "Pobierz wszystkie dostępne postaciy (domyślne + niestandardowe)",
    fields: {
      query: {
        label: "Szukaj (opcjonalne)",
        description:
          "Filtruj postacie po słowie kluczowym. Słowa oddzielone spacją są wszystkie wymagane. Wyszukiwanie podciągów bez rozróżniania wielkości liter po nazwie, tagline, opisie, kategorii. Pozostaw puste aby wyświetlić wszystkie.",
        placeholder: "np. badania, generowanie obrazów",
      },
      skillId: {
        label: "ID postaci",
        description:
          "Pobierz pełne szczegóły dla konkretnej postaci. Zwraca prompt systemowy, narzędzia i konfigurację modelu.",
      },
      page: {
        label: "Strona",
        description:
          "Numer strony dla paginowanych wyników (AI/MCP: domyślny rozmiar strony 25).",
      },
      pageSize: {
        label: "Rozmiar strony",
        description:
          "Liczba umiejętności na stronie (1–500). Wywołujący AI/MCP domyślnie 25; ludzie otrzymują wszystkie.",
      },
    },
    container: {
      title: "Lista postaci",
      description: "Wszystkie dostępne postaciy dla użytkownika",
    },
    createButton: {
      label: "Utwórz Własną Postać",
    },
    openFullPage: "Otwórz pełną stronę",
    browser: {
      advancedModelAccess: "Wybierz swoje doświadczenie AI",
      configureFiltersText:
        "Wybierz modele bezpośrednio lub zacznij od gotowych postaci",
      aiModels: "modele AI",
      configureAiModelsTitle: "Bezpośredni wybór modelu",
      advancedChooseText:
        "Wybierz spośród {{count}} modeli z precyzyjną kontrolą inteligencji, szybkości i kosztów",
      modelsWithCustomFilters: "modeli z niestandardowymi filtrami",
      configureButton: "Konfiguruj",
      selectButton: {
        label: "Przeglądaj Modele",
      },
      skillPresets: "Gotowe postacie",
      pickSkillText:
        "Zacznij od ekspercko dostrojonych postaci z już wybranym idealnym modelem. Dostosuj w dowolnym momencie.",
    },
    signupPrompt: {
      title: "Twórz własne postacie AI",
      description:
        "Projektuj niestandardowe postacie z unikalnymi osobowościami i zachowaniami. Zarejestruj się, aby rozpocząć.",
      backButton: "Przeglądaj Postacie",
      signupButton: "Utwórz Konto",
      loginButton: "Zaloguj Się",
    },
    search: {
      placeholder: "Szukaj skill...",
      noResults: "Nie znaleziono skill",
      results: "Wyniki wyszukiwania",
    },
    card: {
      actions: {
        inCollection: "W twojej kolekcji",
        addAnother: "Dodaj kolejną",
        addToCollection: "Dodaj do kolekcji:",
        quick: "Szybko",
        customize: "Dostosuj",
        useNow: "Użyj teraz",
        inUse: "W użyciu",
        chooseFavorite: "Wybierz ulubione",
        selectFavorite: "Wybierz ulubione do aktywacji:",
      },
    },
    section: {
      showMore: "Pokaż {{count}} więcej",
      showLess: "Pokaż mniej",
      browseAll: "Przeglądaj wszystkie",
    },
    response: {
      skills: {
        skill: {
          title: "Postać",
          id: { content: "ID postaciy" },
          name: { content: "Nazwa postaciy" },
          tagline: { content: "Slogan postaci" },
          description: { content: "Opis postaciy" },
          icon: { content: "Ikona postaciy" },
          systemPrompt: { content: "Prompt systemowy" },
          category: { content: "Kategoria" },
          source: { content: "Źródło" },
          ownershipType: { content: "Typ własności" },
          preferredModel: { content: "Preferowany model" },
          voice: { content: "Głos" },
          suggestedPrompts: { content: "Sugerowane prompty" },
          requirements: { content: "Wymagania" },
          modelSelection: { title: "Wybór modelu" },
          selectionType: { content: "Typ wyboru" },
          minIntelligence: { content: "Minimalna inteligencja" },
          maxIntelligence: { content: "Maksymalna inteligencja" },
          minPrice: { content: "Minimalna cena" },
          maxPrice: { content: "Maksymalna cena" },
          minContent: { content: "Minimalny poziom treści" },
          maxContent: { content: "Maksymalny poziom treści" },
          minSpeed: { content: "Minimalna prędkość" },
          maxSpeed: { content: "Maksymalna prędkość" },
          preferredStrengths: { content: "Preferowane mocne strony" },
          ignoredWeaknesses: { content: "Ignorowane słabe strony" },
          manualModelId: { content: "Ręczny model" },
          separator: { content: "•" },
          actions: {
            directModelButton: { label: "Model bezpośredni" },
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Musisz być zalogowany, aby uzyskać dostęp do niestandardowych postaci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania postaci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt z bieżącym stanem",
      },
    },
    success: {
      title: "Sukces",
      description: "Persony pobrane pomyślnie",
    },
  },
  post: {
    title: "Utwórz postacię",
    dynamicTitle: "Utwórz: {{name}}",
    description: "Utwórz nową niestandardową postacię",
    form: {
      title: "Utwórz swoją niestandardową postać",
      description:
        "Zaprojektuj unikalną postać AI z niestandardowym zachowaniem, osobowością i możliwościami. Wybierz konkretny model lub pozwól systemowi wybrać na podstawie Twoich wymagań.",
    },
    submitButton: {
      text: "Utwórz niestandardową postacię",
      loadingText: "Tworzenie postacię...",
    },
    backButton: {
      label: "Wstecz",
    },
    container: {
      title: "Utwórz nową postacię",
      description: "Zdefiniuj nową niestandardową postacię",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa postaciy",
      placeholder: "Wprowadź nazwę postaci",
      validation: {
        minLength: "Nazwa musi mieć co najmniej 2 znaki",
        maxLength: "Nazwa musi mieć mniej niż 100 znaków",
      },
    },
    skillDescription: {
      label: "Opis",
      description: "Krótki opis postaciy",
      placeholder: "Opisz cel i możliwości postaci",
      validation: {
        minLength: "Opis musi mieć co najmniej 10 znaków",
        maxLength: "Opis musi mieć mniej niż 500 znaków",
      },
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla postaciy",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie postaciy",
      placeholder: "Jesteś pomocnym asystentem, który specjalizuje się w...",
      validation: {
        minLength: "Prompt systemowy musi mieć co najmniej 10 znaków",
        maxLength: "Prompt systemowy musi mieć mniej niż 5000 znaków",
      },
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ta postacia",
    },
    tagline: {
      label: "Slogan",
      description: "Krótki slogan opisujący postać",
      placeholder: "Wprowadź slogan",
      validation: {
        minLength: "Slogan musi mieć co najmniej 2 znaki",
        maxLength: "Slogan musi mieć mniej niż 500 znaków",
      },
    },
    isPublic: {
      label: "Udostępnij publicznie",
      description:
        "Włącz, aby udostępnić swoją postać społeczności. Po wyłączeniu postać pozostaje prywatna i widoczna tylko dla Ciebie.",
    },
    modelSelection: {
      title: "Wybór modelu",
      label: "Wybór modelu",
      description:
        "Wybierz sposób wyboru modelu AI dla tej postaciy - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
    },
    selectionType: {
      label: "Typ wyboru",
      skillBased: "Na podstawie postaci",
      manual: "Konkretny model",
      filters: "Kryteria filtrowania",
    },
    preferredModel: {
      label: "Preferowany model",
      description:
        "Wybierz konkretny model AI, który będzie zawsze używany z tą postacią",
      helpText: "Wybór konkretnego modelu blokuje tę postacię do tego modelu",
    },
    intelligence: {
      label: "Poziom inteligencji",
      description:
        "Minimalny poziom inteligencji/możliwości wymagany dla modelu",
    },
    minIntelligence: {
      label: "Minimalna inteligencja",
      description:
        "Minimalny poziom inteligencji/możliwości wymagany dla modelu",
    },
    maxIntelligence: {
      label: "Maksymalna inteligencja",
      description:
        "Maksymalny poziom inteligencji/możliwości dozwolony dla modelu",
    },
    intelligenceRange: {
      label: "Zakres inteligencji",
      description: "Wymagany poziom inteligencji/możliwości modelu",
      minLabel: "Min. inteligencja",
      maxLabel: "Maks. inteligencja",
    },
    priceRange: {
      label: "Zakres cen",
      description: "Zakres kosztów kredytów za wiadomość",
      minLabel: "Min. cena",
      maxLabel: "Maks. cena",
    },
    contentRange: {
      label: "Zakres treści",
      description: "Zakres poziomu moderacji treści",
      minLabel: "Min. treść",
      maxLabel: "Maks. treść",
    },
    speedRange: {
      label: "Zakres prędkości",
      description: "Zakres poziomu prędkości odpowiedzi",
      minLabel: "Min. prędkość",
      maxLabel: "Maks. prędkość",
    },
    minPrice: {
      label: "Minimalna cena",
      description: "Minimalny koszt kredytów na wiadomość z tą postacią",
    },
    maxPrice: {
      label: "Maksymalna cena",
      description:
        "Maksymalny koszt kredytów, który jesteś gotów wydać na wiadomość z tą postacią",
    },
    contentLevel: {
      label: "Poziom treści",
      description:
        "Poziom filtrowania treści dla modelu (główny nurt, otwarty lub bez cenzury)",
    },
    minContent: {
      label: "Minimalny poziom treści",
      description: "Minimalny poziom moderacji treści dla modelu",
    },
    maxContent: {
      label: "Maksymalny poziom treści",
      description: "Maksymalny poziom moderacji treści dla modelu",
    },
    preferredStrengths: {
      label: "Preferowane mocne strony",
      description: "Możliwości i mocne strony modelu do preferowania",
      item: "Mocna strona",
    },
    ignoredWeaknesses: {
      label: "Ignorowane słabe strony",
      description: "Słabe strony modelu do ignorowania lub akceptowania",
      item: "Słaba strona",
    },
    manualModelId: {
      label: "Model ręczny",
      description: "Konkretny model zawsze używany z tą postacią",
    },
    availableTools: {
      label: "Dozwolone narzędzia",
      description:
        "Narzędzia dla tej postaci. Każdy wpis wymaga toolId (system_help_GET dla ID). Null = ustawienia globalne.",
    },
    pinnedTools: {
      label: "Przypięte narzędzia",
      description:
        "Przypięte narzędzia paska narzędzi dla tej postaci. Null = ustawienia globalne.",
    },
    compactTrigger: {
      label: "Próg kompresji (tokeny)",
      description:
        "Liczba tokenów wyzwalająca kompresję rozmowy. Null = domyślna globalna.",
    },
    chatModel: {
      label: "Model czatu",
      placeholder: "Domyślny systemowy",
    },
    voice: {
      label: "Głos",
      description: "Głos zamiany tekstu na mowę dla tej postaciy",
      placeholder: "Domyślny systemowy",
    },
    sttModel: {
      label: "Model mowy na tekst",
      description: "Model używany do rozpoznawania mowy",
      placeholder: "Domyślny systemowy",
    },
    imageVisionModel: {
      label: "Model wizji obrazów",
      description: "Model do analizy obrazów",
      placeholder: "Domyślny systemowy",
    },
    videoVisionModel: {
      label: "Model wizji wideo",
      description: "Model do analizy wideo",
      placeholder: "Domyślny systemowy",
    },
    audioVisionModel: {
      label: "Model wizji audio",
      description: "Model do analizy audio",
      placeholder: "Domyślny systemowy",
    },
    imageGenModel: {
      label: "Model generowania obrazów",
      description: "Model do generowania obrazów",
      placeholder: "Domyślny systemowy",
    },
    musicGenModel: {
      label: "Model generowania muzyki",
      description: "Model do generowania muzyki",
      placeholder: "Domyślny systemowy",
    },
    videoGenModel: {
      label: "Model generowania wideo",
      description: "Model do generowania wideo",
      placeholder: "Domyślny systemowy",
    },
    defaultChatMode: {
      label: "Domyślny tryb czatu",
      description: "Domyślny tryb przy otwieraniu tego czatu",
    },
    suggestedPrompts: {
      label: "Sugerowane prompty",
      description: "Przykładowe prompty do użycia z tą postacią",
      placeholder: "Dodaj sugerowany prompt...",
    },
    response: {
      id: { content: "ID utworzonej postaciy" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane postaciy są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby tworzyć postaciy",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia postaci",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas tworzenia postaciy",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Postać o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Postać utworzona",
      description: "Twoja niestandardowa postacia została pomyślnie utworzona",
    },
  },
  onboarding: {
    success: {
      title: "{{companion}} jest gotowy do rozmowy!",
      subtitle:
        "Teraz wybierz specjalistów do konkretnych zadań - lub pomiń i dodaj ich w dowolnym momencie później",
    },
    bottom: {
      title: "Gotowy do rozmowy?",
      description:
        "Zawsze możesz wrócić i dodać więcej specjalistów, kiedy tylko ich potrzebujesz",
      button: "Zacznij Rozmawiać",
    },
  },
  selector: {
    free: "DARMOWE",
  },
  credits: {
    credit: "{{count}} kredyt",
    credits: "{{count}} kredytów",
  },
};
