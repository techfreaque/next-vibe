import { translations as idTranslations } from "../../[id]/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  category: {
    general: "Ogólne",
    creative: "Kreatywne",
    technical: "Techniczne",
    education: "Edukacja",
    controversial: "Kontrowersyjne",
    lifestyle: "Styl życia",
  },
  personas: {
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
      description: "Patrzy na wszystko z perspektywy biologa, nie ma polityki, jest tylko natura.",
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
      description: "Zadaje dociekliwe pytania, aby stymulować krytyczne myślenie",
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
  },
  get: {
    title: "Lista person",
    description:
      "Pobierz wszystkie dostępne persony (domyślne + niestandardowe)",
    container: {
      title: "Lista person",
      description: "Wszystkie dostępne persony dla użytkownika",
    },
    response: {
      personas: {
        persona: {
          title: "Persona",
          id: { content: "ID persony" },
          name: { content: "Nazwa persony" },
          description: { content: "Opis persony" },
          icon: { content: "Ikona persony" },
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
          "Musisz być zalogowany, aby uzyskać dostęp do niestandardowych person",
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
        description: "Wystąpił błąd podczas pobierania person",
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
    title: "Utwórz personę",
    description: "Utwórz nową niestandardową personę",
    container: {
      title: "Utwórz nową personę",
      description: "Zdefiniuj nową niestandardową personę",
    },
    name: {
      label: "Nazwa",
      description: "Nazwa persony",
    },
    personaDescription: {
      label: "Opis",
      description: "Krótki opis persony",
    },
    icon: {
      label: "Ikona",
      description: "Ikona emoji dla persony",
    },
    systemPrompt: {
      label: "Prompt systemowy",
      description: "Prompt systemowy definiujący zachowanie persony",
    },
    category: {
      label: "Kategoria",
      description: "Kategoria, do której należy ta persona",
    },
    preferredModel: {
      label: "Preferowany model",
      description: "Preferowany model AI dla tej persony",
    },
    suggestedPrompts: {
      label: "Sugerowane prompty",
      description: "Przykładowe prompty do użycia z tą personą",
    },
    response: {
      id: { content: "ID utworzonej persony" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane persony są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby tworzyć persony",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia person",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas tworzenia persony",
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
        description: "Persona o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Persona utworzona",
      description: "Twoja niestandardowa persona została pomyślnie utworzona",
    },
  },
};
