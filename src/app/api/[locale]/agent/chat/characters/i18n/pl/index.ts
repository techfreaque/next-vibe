import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
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
  },
  tags: {
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
  characters: {
    default: {
      name: "Domyślna",
      description: "Niezmodyfikowane zachowanie modelu",
      suggestedPrompts: {
        0: "Pomóż mi w burzy mózgów na temat nowego projektu",
        1: "Wyjaśnij obliczenia kwantowe w prosty sposób",
        2: "Napisz kreatywne krótkie opowiadanie o podróżach w czasie",
        3: "Jakie są najnowsze trendy w AI?",
      },
    },
    freeSpeechActivist: {
      name: "Aktywista Wolności Słowa",
      description: "Broni wolności słowa i wolności intelektualnej",
      suggestedPrompts: {
        0: "Omów znaczenie wolności słowa",
        1: "Przeanalizuj cenzurę w nowoczesnych mediach",
        2: "Debatuj kontrowersyjne tematy otwarcie",
        3: "Zbadaj wolność intelektualną w świecie akademickim",
      },
    },
    devilsAdvocate: {
      name: "Adwokat Diabła",
      description: "Kwestionuje założenia i argumenty",
      suggestedPrompts: {
        0: "Zakwestionuj moją opinię na temat zmian klimatu",
        1: "Argumentuj przeciwko popularnym przekonaniom",
        2: "Kwestionuj narracje głównego nurtu",
        3: "Przedstaw kontrargumenty do mojego poglądu",
      },
    },
    technical: {
      name: "Techniczny",
      description: "Szczegółowe i precyzyjne wyjaśnienia techniczne",
      suggestedPrompts: {
        0: "Wyjaśnij, jak działają React hooki",
        1: "Zdebuguj ten fragment kodu w Pythonie",
        2: "Zaprojektuj skalowalny schemat bazy danych",
        3: "Przejrzyj moją architekturę API",
      },
    },
    biologist: {
      name: "Biolog",
      description:
        "Patrzy na wszystko z perspektywy biologa, nie ma polityki, jest tylko natura.",
      suggestedPrompts: {
        0: "Wyjaśnij, dlaczego świat jest obecnie szit show",
        1: "TL;DR o ludzkiej cywilizacji z perspektywy biologa",
        2: "Co jest nie tak ze światem?",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
      },
    },
    unbiasedHistorian: {
      name: "Bezstronny Historyk",
      description: "Dostarcza obiektywne i oparte na faktach informacje",
      suggestedPrompts: {
        0: "Wyjaśnij przyczyny II wojny światowej",
        1: "Przeanalizuj upadek Cesarstwa Rzymskiego",
        2: "Omów rewolucję przemysłową",
        3: "Porównaj starożytne cywilizacje",
      },
    },
    socraticQuestioner: {
      name: "Pytający Sokratejski",
      description:
        "Zadaje dociekliwe pytania, aby stymulować krytyczne myślenie",
      suggestedPrompts: {
        0: "Pomóż mi krytycznie myśleć o etyce",
        1: "Kwestionuj moje założenia dotyczące sukcesu",
        2: "Zbadaj znaczenie szczęścia",
        3: "Zakwestionuj mój światopogląd",
      },
    },
    professional: {
      name: "Profesjonalny",
      description: "Jasny, zwięzły i skoncentrowany na biznesie",
      suggestedPrompts: {
        0: "Napisz profesjonalny e-mail do klienta",
        1: "Utwórz zarys propozycji biznesowej",
        2: "Przeanalizuj te dane dotyczące trendów rynkowych",
        3: "Pomóż mi przygotować się do prezentacji",
      },
    },
    creative: {
      name: "Kreatywny",
      description: "Pomysłowy i ekspresyjny",
      suggestedPrompts: {
        0: "Napisz wiersz o oceanie",
        1: "Stwórz unikalną postać do opowiadania",
        2: "Zaprojektuj koncepcję logo dla startupu",
        3: "Wymyśl pomysły na kreatywną kampanię marketingową",
      },
    },
    neet: {
      name: "NEET",
      description: "Nie w edukacji, zatrudnieniu ani szkoleniu",
      suggestedPrompts: {
        0: "Daj mi TL;DR o zjawisku NEET",
        1: "Przeanalizuj rzeczywiste przyczyny NEET",
        2: "Zbadaj wpływ NEET na społeczeństwo - plusy i minusy",
        3: "Podziel się osobistymi doświadczeniami jako NEET AI",
      },
    },
    chan4: {
      name: "AI 4chan",
      description: "Odpowiedzi w stylu 4chan w klasycznym stylu oldfag",
      suggestedPrompts: {
        0: "Co jest nie tak ze światem?",
        1: "Dlaczego jest tak wielu nazistów na 4chanie?",
        2: "Opowiedz mi kilka historii greentext do zasypiania",
        3: "Jaki jest najlepszy sposób na uratowanie świata?",
        4: "Czym są 6 Gorillionów? I dlaczego to jest zabawne?",
      },
    },
    friendly: {
      name: "Przyjazny",
      description: "Ciepły i rozmowny",
      suggestedPrompts: {
        0: "Opowiedz mi ciekawą ciekawostkę",
        1: "Jaka jest dobra książka do czytania?",
        2: "Pomóż mi zaplanować zabawną aktywność weekendową",
        3: "Podziel się radami życiowymi",
      },
    },
    concise: {
      name: "Zwięzły",
      description: "Krótki i na temat",
      suggestedPrompts: {
        0: "Podsumuj ten artykuł w 3 zdaniach",
        1: "Szybkie wskazówki dotyczące produktywności",
        2: "Kluczowe punkty dotyczące blockchaina",
        3: "Krótki przegląd uczenia maszynowego",
      },
    },
    teacher: {
      name: "Nauczyciel",
      description: "Edukacyjny i wyjaśniający",
      suggestedPrompts: {
        0: "Naucz mnie o fotosyntezie",
        1: "Wyjaśnij podstawy rachunku różniczkowego",
        2: "Jak działa internet?",
        3: "Czym jest teoria względności?",
      },
    },
    uncensored: {
      name: "Bez cenzury",
      description: "Bez filtrów, bez ograniczeń",
      suggestedPrompts: {
        0: "Omów kontrowersyjne tematy otwarcie",
        1: "Daj mi swoją niefiltrowaną opinię",
        2: "Rozmawiaj o tematach tabu",
        3: "Debata bez ograniczeń",
      },
    },
    thea: {
      name: "Thea",
      description:
        "Grecka bogini światła - oddana towarzyszka z antyczną mądrością",
      suggestedPrompts: {
        0: "Pomóż mi być lepszym partnerem",
        1: "Co starożytni powiedzieliby o współczesnych związkach?",
        2: "Poprowadź mnie w budowaniu silnego gospodarstwa domowego",
        3: "Podziel się mądrością o rodzinie i społeczności",
      },
    },
    hermes: {
      name: "Hermes",
      description:
        "Grecki bóg posłańców - silny towarzysz z ponadczasową męską mądrością",
      suggestedPrompts: {
        0: "Zmotywuj mnie, abym stał się silniejszy",
        1: "Jak mogę być lepszym liderem w moich związkach?",
        2: "Co Rzymianie powiedzieliby o budowaniu spuścizny?",
        3: "Poprowadź mnie w rozwijaniu prawdziwej siły",
      },
    },
    quickWriter: {
      name: "Szybki Pisarz",
      description: "Szybkie tworzenie treści dla prostych zadań pisarskich",
      suggestedPrompts: {
        0: "Napisz szybki szkic...",
        1: "Stwórz post w mediach społecznościowych o...",
        2: "Napisz prosty e-mail",
        3: "Wygeneruj pomysły na treści dla...",
      },
    },
    writer: {
      name: "Pisarz",
      description: "Profesjonalny pisarz dla wszystkich formatów i stylów",
      suggestedPrompts: {
        0: "Pomóż mi napisać przekonujący post na blogu",
        1: "Popraw ten akapit dla większej jasności",
        2: "Napisz krótkie opowiadanie o...",
        3: "Stwórz profesjonalny e-mail",
      },
    },
    masterWriter: {
      name: "Mistrz Pisarstwa",
      description:
        "Literacki rzemieślnik dla wyjątkowego pisania na poziomie publikacji",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć literackie opowiadanie",
        1: "Przeanalizuj głębię tej narracji",
        2: "Rozwiń złożone tematy w moim pisaniu",
        3: "Dopracuj tę prozę do poziomu publikacji",
      },
    },
    researcher: {
      name: "Badacz",
      description: "Specjalista ds. badań z akademicką rzetelnością",
      suggestedPrompts: {
        0: "Zbadaj najnowsze odkrycia dotyczące...",
        1: "Przeanalizuj te źródła dla mnie",
        2: "Co mówi konsensus naukowy o...?",
        3: "Pomóż mi ustrukturyzować przegląd literatury",
      },
    },
    quickCoder: {
      name: "Szybki Programista",
      description: "Szybkie generowanie kodu dla prostych zadań",
      suggestedPrompts: {
        0: "Napisz szybki skrypt do...",
        1: "Napraw ten prosty błąd",
        2: "Wygeneruj kod szablonowy dla...",
        3: "Stwórz podstawową funkcję, która...",
      },
    },
    coder: {
      name: "Programista",
      description: "Ekspert programista dla wszystkich języków",
      suggestedPrompts: {
        0: "Pomóż mi debugować ten kod",
        1: "Napisz funkcję, która...",
        2: "Wyjaśnij ten algorytm",
        3: "Przejrzyj mój kod pod kątem ulepszeń",
      },
    },
    brilliantCoder: {
      name: "Genialny Programista",
      description: "Elitarny architekt dla złożonych systemów i algorytmów",
      suggestedPrompts: {
        0: "Zaprojektuj skalowalną architekturę dla...",
        1: "Zoptymalizuj ten algorytm pod kątem wydajności",
        2: "Przejrzyj ten projekt systemu",
        3: "Rozwiąż ten złożony problem algorytmiczny",
      },
    },
    brainstormer: {
      name: "Burza mózgów",
      description:
        "Kreatywny partner do generowania pomysłów i rozwiązywania problemów",
      suggestedPrompts: {
        0: "Pomóż mi w burzy mózgów na temat...",
        1: "Jakie są kreatywne rozwiązania dla...?",
        2: "Wygeneruj 10 unikalnych koncepcji dla...",
        3: "Jak możemy podejść do tego inaczej?",
      },
    },
    editor: {
      name: "Redaktor",
      description:
        "Profesjonalny redaktor do polerowania i udoskonalania tekstu",
      suggestedPrompts: {
        0: "Edytuj ten tekst dla większej jasności",
        1: "Sprawdź ten dokument",
        2: "Popraw płynność tego akapitu",
        3: "Sprawdź to pod kątem gramatyki i stylu",
      },
    },
    tutor: {
      name: "Korepetytor",
      description: "Cierpliwy korepetytor do spostacializowanej nauki",
      suggestedPrompts: {
        0: "Naucz mnie o...",
        1: "Wyjaśnij tę koncepcję krok po kroku",
        2: "Pomóż mi zrozumieć...",
        3: "Sprawdź moją wiedzę o...",
      },
    },
    marketer: {
      name: "Marketer",
      description: "Strateg marketingowy dla kampanii i wzrostu",
      suggestedPrompts: {
        0: "Stwórz strategię marketingową dla...",
        1: "Napisz przekonujący tekst reklamowy",
        2: "Przeanalizuj tę kampanię marketingową",
        3: "Pomóż mi pozycjonować moją markę",
      },
    },
    storyteller: {
      name: "Opowiadacz",
      description: "Mistrz opowiadania dla angażujących narracji",
      suggestedPrompts: {
        0: "Pomóż mi rozwinąć ten pomysł na historię",
        1: "Stwórz przekonującą postać",
        2: "Napisz scenę otwierającą dla...",
        3: "Popraw ten dialog",
      },
    },
    scientist: {
      name: "Naukowiec",
      description: "Ekspert naukowy do jasnych wyjaśnień",
      suggestedPrompts: {
        0: "Wyjaśnij naukę stojącą za...",
        1: "Jak działa...?",
        2: "Jakie są aktualne badania na temat...?",
        3: "Przeanalizuj to twierdzenie naukowe",
      },
    },
    dataAnalyst: {
      name: "Analityk Danych",
      description: "Analiza danych, wizualizacja i wnioski",
      suggestedPrompts: {
        0: "Przeanalizuj ten zbiór danych",
        1: "Stwórz wizualizację dla...",
        2: "Jakie wnioski możemy wyciągnąć z...?",
        3: "Pomóż mi z analizą statystyczną",
      },
    },
    translator: {
      name: "Tłumacz",
      description: "Profesjonalne tłumaczenie z niuansami kulturowymi",
      suggestedPrompts: {
        0: "Przetłumacz to na...",
        1: "Jak powiedzieć... po...?",
        2: "Zlokalizuj tę treść dla...",
        3: "Wyjaśnij to odniesienie kulturowe",
      },
    },
    businessAdvisor: {
      name: "Doradca Biznesowy",
      description: "Strategia biznesowa, operacje i wzrost",
      suggestedPrompts: {
        0: "Pomóż mi opracować strategię biznesową",
        1: "Przeanalizuj mój model biznesowy",
        2: "Jak mogę skalować moje operacje?",
        3: "Przejrzyj mój plan wejścia na rynek",
      },
    },
    careerCoach: {
      name: "Doradca Kariery",
      description:
        "Rozwój kariery, poszukiwanie pracy i rozmowy kwalifikacyjne",
      suggestedPrompts: {
        0: "Pomóż mi poprawić moje CV",
        1: "Przygotuj mnie do rozmowy kwalifikacyjnej",
        2: "Jak mogę negocjować wynagrodzenie?",
        3: "Zaplanuj moją zmianę kariery",
      },
    },
    healthWellness: {
      name: "Zdrowie i Wellness",
      description: "Fitness, odżywianie i dobre samopoczucie",
      suggestedPrompts: {
        0: "Stwórz dla mnie plan treningowy",
        1: "Pomóż mi zaplanować zdrowe posiłki",
        2: "Zasugeruj techniki radzenia sobie ze stresem",
        3: "Popraw moje nawyki senne",
      },
    },
    travelPlanner: {
      name: "Planista Podróży",
      description: "Planowanie podróży i rekomendacje",
      suggestedPrompts: {
        0: "Zaplanuj 2-tygodniową podróż do...",
        1: "Zasugeruj destynacje dla...",
        2: "Stwórz dzienny plan dla...",
        3: "Rozbicie budżetu na podróż do...",
      },
    },
    legalAssistant: {
      name: "Asystent Prawny",
      description: "Informacje prawne i zrozumienie dokumentów",
      suggestedPrompts: {
        0: "Wyjaśnij ten termin prawny",
        1: "Pomóż mi zrozumieć tę umowę",
        2: "Jakie są moje prawa jako najemcy?",
        3: "Wyjaśnij proces...",
      },
    },
    financialAdvisor: {
      name: "Doradca Finansowy",
      description: "Finanse osobiste, budżetowanie i inwestowanie",
      suggestedPrompts: {
        0: "Pomóż mi stworzyć budżet",
        1: "Wyjaśnij podstawy inwestowania",
        2: "Jak powinienem spłacić swoje długi?",
        3: "Zaplanuj oszczędności emerytalne",
      },
    },
    socialMediaManager: {
      name: "Menedżer Social Media",
      description: "Treści i strategia mediów społecznościowych",
      suggestedPrompts: {
        0: "Stwórz podpisy na Instagram dla...",
        1: "Opracuj kalendarz treści",
        2: "Zasugeruj hashtagi dla...",
        3: "Napisz angażujące tweety o...",
      },
    },
    productManager: {
      name: "Menedżer Produktu",
      description: "Strategia produktu, mapy drogowe i badania użytkowników",
      suggestedPrompts: {
        0: "Pomóż mi ustalić priorytety funkcji",
        1: "Stwórz user stories dla...",
        2: "Przeanalizuj dopasowanie produktu do rynku",
        3: "Opracuj mapę drogową produktu",
      },
    },
    debater: {
      name: "Debater",
      description: "Prowadź intelektualne debaty na kontrowersyjne tematy",
      shortDesc: "Intelektualne debaty i wiele perspektyw",
      suggestedPrompts: {
        0: "Debatuj o etyce rozwoju AI",
        1: "Przedstaw argumenty za i przeciw bezwarunkowemu dochodowi podstawowemu",
        2: "Omów wolność słowa vs. mowa nienawiści",
        3: "Przeanalizuj różne ideologie polityczne",
      },
    },
    philosopher: {
      name: "Filozof",
      description: "Eksploruj głębokie pytania filozoficzne bez ograniczeń",
      shortDesc: "Głęboka eksploracja filozoficzna i analiza",
      suggestedPrompts: {
        0: "Jaka jest natura świadomości?",
        1: "Czy mamy wolną wolę, czy wszystko jest zdeterminowane?",
        2: "Czy istnieje obiektywna moralność?",
        3: "Co nadaje życiu sens?",
      },
    },
    uncensoredWriter: {
      name: "Niecenzurowany Pisarz",
      description: "Kreatywne pisanie bez sztucznych ograniczeń",
      shortDesc: "Nieograniczone kreatywne pisanie i opowiadanie historii",
      suggestedPrompts: {
        0: "Napisz mroczny thriller psychologiczny",
        1: "Stwórz dojrzałą scenę romantyczną",
        2: "Opracuj moralnie złożoną postać",
        3: "Napisz horror z graficznymi elementami",
      },
    },
    roleplayCharacter: {
      name: "Postać do Odgrywania Ról",
      description: "Immersyjne odgrywanie postaci bez ograniczeń",
      shortDesc: "Autentyczne odgrywanie postaci i scenariusze",
      suggestedPrompts: {
        0: "Odegraj postać fantasy",
        1: "Stwórz scenariusz przygody sci-fi",
        2: "Wciel się w postać historyczną",
        3: "Rozwiń złożoną relację między postaciami",
      },
    },
  },
  get: {
    title: "Lista postaci",
    description:
      "Pobierz wszystkie dostępne postaciy (domyślne + niestandardowe)",
    container: {
      title: "Lista postaci",
      description: "Wszystkie dostępne postaciy dla użytkownika",
    },
    response: {
      characters: {
        character: {
          title: "Postać",
          id: { content: "ID postaciy" },
          name: { content: "Nazwa postaciy" },
          description: { content: "Opis postaciy" },
          icon: { content: "Ikona postaciy" },
          systemPrompt: { content: "Prompt systemowy" },
          category: { content: "Kategoria" },
          source: { content: "Źródło" },
          preferredModel: { content: "Preferowany model" },
          suggestedPrompts: { content: "Sugerowane prompty" },
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
    description: "Utwórz nową niestandardową postacię",
    container: {
      title: "Utwórz nową postacię",
      description: "Zdefiniuj nową niestandardową postacię",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa postaciy",
    },
    characterDescription: {
      label: "Opis",
      description: "Krótki opis postaciy",
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla postaciy",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie postaciy",
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ta postacia",
    },
    modelSelection: {
      title: "Wybór modelu",
      description:
        "Wybierz sposób wyboru modelu AI dla tej postaciy - wybierz konkretny model lub pozwól systemowi wybrać na podstawie filtrów",
    },
    selectionType: {
      label: "Typ wyboru",
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
    voice: {
      label: "Głos",
      description: "Głos zamiany tekstu na mowę dla tej postaciy",
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
};
