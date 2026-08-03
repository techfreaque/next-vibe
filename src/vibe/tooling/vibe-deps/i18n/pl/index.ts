import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Kompleksowy analizator zależności. Mapuje graf importów całej bazy kodu i egzekwuje granice pakietów. --mode=files / categories / unused dla grafu importów i martwego kodu. --mode=boundaries pokazuje każdy import pakietu do kodu aplikacji (przenosiny do wykonania przed ekstrakcją). --mode=layers zgłasza nielegalny kierunek między pakietami. --mode=shared-candidates szereguje prymitywy aplikacji, od których pakiety już zależą. --mode=importers --focus=X rozbija importerów pliku według pakietu.",
  category: "Narzędzia Deweloperskie",
  tag: "analiza",

  mode: {
    report: "Raport",
    files: "Pliki",
    categories: "Kategorie",
    unused: "Nieużywane",
    boundaries: "Granice",
    layers: "Warstwy",
    sharedCandidates: "Wspólni kandydaci",
    importers: "Importerzy",
    needsMove: "Do przeniesienia",
    unusedSymbols: "Nieużywane symbole",
    crossDomain: "Międzydomenowe",
    pageViolations: "Naruszenia Stron",
  },

  container: {
    title: "Analiza Zależności",
    description: "Skonfiguruj zakres i tryb skanowania zależności",
  },

  fields: {
    focus: {
      label: "Ścieżka Focusu",
      description:
        "Zawęź do konkretnego pliku lub katalogu (np. 'agent/ai-stream' lub 'user'). Zostaw puste, aby analizować całą bazę kodu.",
      placeholder: "np. agent/ai-stream lub user",
    },
    mode: {
      label: "Tryb",
      description:
        "files: graf importów pliku. categories: zestawienie według katalogu najwyższego poziomu. unused: pliki bez importerów. boundaries: importy pakietów do kodu aplikacji. layers: nielegalny kierunek między pakietami. shared-candidates: prymitywy aplikacji, od których zależą pakiety. importers: importerzy pliku według pakietu (wymaga --focus).",
    },
    package: {
      label: "Pakiet",
      description:
        "Zawęź boundaries/layers do jednego zadeklarowanego pakietu (np. vibe-ui, vibe-unified-ui). Zostaw puste dla wszystkich pakietów.",
      placeholder: "np. vibe-unified-ui",
    },
    depth: {
      label: "Głębokość",
      description:
        "Ile poziomów zależności przechodnich uwzględnić (domyślnie: 1, tylko bezpośrednie). 0 = bez ograniczeń.",
    },
    limit: {
      label: "Limit",
      description: "Maksymalna liczba zwracanych wpisów (domyślnie: 100).",
    },
  },

  response: {
    success: "Analiza zależności zakończona",
    entries: {
      title: "Wpisy Zależności",
      emptyState: {
        description: "Brak plików pasujących do podanego filtru.",
      },
      importedBy: "importowany przez",
    },
    summary: {
      title: "Podsumowanie",
      totalFiles: "Łączna liczba przeskanowanych plików",
      totalEdges: "Łączna liczba krawędzi importu",
      unusedCount: "Nieużywane eksporty",
    },
    boundaries: {
      title: "Granice Pakietów",
      cleanState: "Brak naruszeń granic. Pakiety są samowystarczalne.",
      legendTitle: "Legenda",
      legendOut: "out-of-package (pakiet sięga do kodu aplikacji)",
      legendCross: "cross-package (nielegalna zależność)",
      legendReverse: "reverse-direction (niższa warstwa importuje wyższą)",
      legendHot: "gorący cel (10+ importerów — najsilniejszy ciąg do core)",
      colTarget: "cel",
      colCount: "użycia",
      colKind: "rodzaj",
      packageHeader: "pakiet",
      violationsAcross: "naruszeń w",
      packagesWord: "pakietach",
    },
    layers: {
      title: "Kierunek Warstw",
      cleanState: "Kierunek jest czysty. Brak nielegalnych importów pakietów.",
      edge: "importuje",
    },
    sharedCandidates: {
      title: "Wspólni Kandydaci",
      description:
        "Pliki kodu aplikacji importowane przez pakiety, według liczby importerów-pakietów. Wysoko = przenieś do vibe-core.",
      colCount: "użycia pakietów",
      colPath: "ścieżka",
      emptyState:
        "Żadne pliki aplikacji nie są importowane przez kod pakietów.",
    },
    importers: {
      title: "Importerzy według Pakietu",
      colCount: "użycia",
      colGroup: "pakiet / kategoria",
    },
    needsMove: {
      title: "Lista Przeniesień",
      description:
        "Pliki jeszcze nie na docelowej pozycji, pogrupowane według obszaru docelowego. Pliki z whitelisty (już umieszczone) są pomijane. Czytaj od góry do dołu — to kolejność przenoszenia.",
      colTarget: "→ obszar",
      colPath: "plik",
      emptyState: "Wszystko w zakresie jest umieszczone. Nic do przeniesienia.",
      relocate: "relokacja",
      reorganize: "reorg",
    },
    unusedSymbols: {
      title: "Nieużywana Powierzchnia Publiczna",
      description:
        "Martwe eksporty, nieużywane metody statyczne i pliki bez importerów. Sygnały oparte na regex do przeglądu — konserwatywne (może pominąć użycie dynamiczne).",
      colKind: "rodzaj",
      colSymbol: "symbol",
      colPath: "plik",
      emptyState: "Brak nieużywanej powierzchni publicznej w zakresie.",
      wholeFile: "(cały plik — brak importerów)",
    },
    pageViolations: {
      title: "Naruszenia Architektury Strony",
      description:
        "Pliki page.tsx importujące więcej niż repository/definition/i18n/page-client. Strony muszą być cienkimi powłokami SSR — logika biznesowa, UI, enumy i dostęp do bazy danych należą do repository.ts lub page-client.tsx.",
      colCount: "naruszenia",
      colPath: "strona",
      emptyState: "Wszystkie pliki page.tsx respektują granicę architektury.",
    },
    crossDomain: {
      title: "Kandydaci Międzydomenowi",
      description:
        "Importy przekraczające granicę domeny, które NIE są dozwolonym prymitywem frameworka. Każdy to kandydat do przeniesienia do vibe (engine/core) lub rozłączenia. Najczęściej osiągane najpierw. Dozwolone krawędzie prymitywów liczone osobno, nie ukrywane.",
      colCount: "użycia",
      colTarget: "osiągany cel",
      emptyState:
        "Brak niesprawdzonych krawędzi międzydomenowych. Wszystko przekraczające jest dozwolone.",
      allowedTally: "dozwolone krawędzie prymitywów (nie wymienione)",
    },
    violations: {
      title: "Naruszenia",
      outOfPackage: "Poza pakietem",
      crossPackage: "Między pakietami",
      reverseDirection: "Odwrotny kierunek",
      total: "Razem",
    },
  },

  errors: {
    validation: {
      title: "Nieprawidłowe parametry",
      description: "Parametry analizy zależności są nieprawidłowe",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Podczas analizy zależności wystąpił błąd wewnętrzny",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do uruchomienia analizy zależności",
    },
    forbidden: {
      title: "Zabroniony",
      description: "Dostęp do analizy zależności jest zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Podana ścieżka focusu nie została znaleziona",
    },
    focusNotFound: "Żaden plik nie pasuje do ścieżki focusu {{focus}}",
    server: {
      title: "Błąd serwera",
      description: "Podczas analizy zależności wystąpił błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Podczas analizy zależności wystąpił nieznany błąd",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Podczas analizy zależności wystąpił konflikt",
    },
  },

  success: {
    title: "Analiza zakończona",
    description: "Analiza zależności zakończona pomyślnie",
  },
};
