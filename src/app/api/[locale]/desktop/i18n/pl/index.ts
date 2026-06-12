import type { translations as enTranslations } from "../en";

/**
 * Desktop API translations (Polish)
 */

export const translations: typeof enTranslations = {
  "take-screenshot": {
    title: "Zrób zrzut ekranu pulpitu",
    titleShort: "Zrzut ekranu",
    dynamicTitle: "Zrzut: {{target}}",
    description: "Przechwyć zrzut ekranu pulpitu lub obszaru ekranu",
    form: {
      label: "Zrób zrzut ekranu",
      capturing: "Przechwytywanie…",
      refresh: "Ponów zrzut",
      description:
        "Przechwyć zrzut ekranu całego pulpitu lub określonego obszaru",
      fields: {
        outputPath: {
          label: "Ścieżka wyjściowa",
          description:
            "Bezwzględna ścieżka do zapisania zrzutu. Pomiń, aby zwrócić dane base64.",
          placeholder: "/tmp/screenshot.png",
        },
        screen: {
          label: "Indeks ekranu",
          description:
            "Indeks ekranu/monitora (0 = główny). Preferuj monitorName.",
          placeholder: "0",
        },
        monitorName: {
          label: "Nazwa monitora",
          description:
            "Nazwa wyjścia monitora (np. DP-1, HDMI-1). Użyj list-monitors, aby zobaczyć dostępne nazwy.",
          placeholder: "DP-1",
        },
        maxWidth: {
          label: "Maks. szerokość",
          description:
            "Skaluj do tej szerokości jeśli obraz jest szerszy. Przydatne dla AI - zrzuty z 4 monitorów są ogromne.",
          placeholder: "1920",
        },
      },
    },
    response: {
      success: "Zrzut ekranu przechwycony pomyślnie",
      imagePath: "Ścieżka, pod którą zapisano zrzut ekranu",
      imageData: "Dane zrzutu ekranu zakodowane w base64 (PNG)",
      width: "Szerokość zrzutu w pikselach",
      height: "Wysokość zrzutu w pikselach",
      monitorName: "Przechwycony monitor",
      originalWidth: "Oryginalna szerokość przed skalowaniem",
      originalHeight: "Oryginalna wysokość przed skalowaniem",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Wystąpił błąd sieci podczas przechwytywania zrzutu ekranu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnień do przechwytywania zrzutów ekranu pulpitu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przechwytywanie zrzutów ekranu pulpitu jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas przechwytywania zrzutu ekranu",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas przechwytywania zrzutu ekranu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przechwytywania zrzutu ekranu",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Zrzut ekranu przechwycony",
      description: "Zrzut ekranu pulpitu został pomyślnie przechwycony",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      captureAutomation: "Automatyzacja przechwytywania",
    },
  },
  "get-accessibility-tree": {
    title: "Pobierz drzewo dostępności",
    titleShort: "Drzewo A11y",
    dynamicTitle: "A11y: {{app}}",
    description:
      "Pobierz drzewo dostępności aktywnego okna lub określonej aplikacji",
    form: {
      label: "Pobierz drzewo dostępności",
      description: "Pobierz drzewo AT-SPI do inspekcji interfejsu pulpitu",
      fields: {
        appName: {
          label: "Nazwa aplikacji",
          description:
            "Nazwa procesu lub tytuł okna (pomiń dla aktywnego okna)",
          placeholder: "firefox",
        },
        maxDepth: {
          label: "Maks. głębokość",
          description:
            "Maksymalna głębokość drzewa do przeszukania (domyślnie: 5)",
          placeholder: "5",
        },
        includeActions: {
          label: "Uwzględnij akcje",
          description:
            "Pokaż dostępne akcje dla każdego węzła (kliknij, naciśnij, aktywuj...). Więcej szczegółów, większa odpowiedź.",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Drzewo dostępności pobrane pomyślnie",
      tree: "Drzewo dostępności jako tekst strukturalny",
      nodeCount: "Łączna liczba przeszukanych węzłów",
      truncated:
        "Czy zapytanie przekroczyło limit czasu i wynik może być niekompletny",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description:
          "Wystąpił błąd sieci podczas pobierania drzewa dostępności",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do dostępu do drzewa dostępności",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do drzewa dostępności jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Docelowa aplikacja lub okno nie zostały znalezione",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania drzewa dostępności",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas pobierania drzewa dostępności",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania drzewa dostępności",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Drzewo dostępności pobrane",
      description: "Drzewo dostępności zostało pomyślnie pobrane",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      accessibilityAutomation: "Automatyzacja dostępności",
    },
  },
  "list-monitors": {
    title: "Lista monitorów",
    titleShort: "Monitory",
    description:
      "Lista wszystkich podłączonych monitorów z rozdzielczością, pozycją i indeksem",
    form: {
      label: "Lista monitorów",
      description:
        "Wylicz wszystkie podłączone wyświetlacze. Używaj nazw monitorów do docelowych zrzutów ekranu.",
      fields: {},
    },
    response: {
      success: "Monitory zostały pomyślnie wylistowane",
      monitors: "Tablica podłączonych monitorów",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas listowania monitorów",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do listowania monitorów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Listowanie monitorów jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas listowania monitorów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas listowania monitorów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas listowania monitorów",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Listowanie monitorów nie jest dostępne w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Monitory wylistowane",
      description:
        "Wszystkie podłączone monitory zostały pomyślnie wylistowane",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      captureAutomation: "Automatyzacja przechwytywania",
    },
  },
  click: {
    title: "Kliknij",
    titleShort: "Kliknij",
    dynamicTitle: "Klik: {{x}},{{y}}",
    description:
      "Przesuń mysz do bezwzględnych współrzędnych i wykonaj kliknięcie",
    form: {
      label: "Kliknij",
      description: "Przesuń mysz do podanych współrzędnych i kliknij",
      fields: {
        x: {
          label: "Współrzędna X",
          description:
            "Pozioma współrzędna ekranu w pikselach (od lewej krawędzi)",
          placeholder: "100",
        },
        y: {
          label: "Współrzędna Y",
          description:
            "Pionowa współrzędna ekranu w pikselach (od górnej krawędzi)",
          placeholder: "200",
        },
        button: {
          label: "Przycisk myszy",
          description: "Przycisk myszy do kliknięcia (lewy, środkowy, prawy)",
          placeholder: "lewy",
          options: {
            left: "Lewy",
            middle: "Środkowy",
            right: "Prawy",
          },
        },
        doubleClick: {
          label: "Podwójne kliknięcie",
          description: "Wykonaj podwójne kliknięcie zamiast pojedynczego",
          placeholder: "false",
        },
      },
    },
    response: {
      success: "Kliknięcie wykonane pomyślnie",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas wykonywania kliknięcia",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania kliknięć na pulpicie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wykonywanie kliknięć na pulpicie jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas wykonywania kliknięcia",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wykonywania kliknięcia",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas wykonywania kliknięcia",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Kliknięcie wykonane",
      description: "Kliknięcie myszą zostało wykonane pomyślnie",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "type-text": {
    title: "Wpisz tekst",
    titleShort: "Wpisz tekst",
    dynamicTitle: "Wpisz: {{text}}",
    description: "Wpisz tekst do aktywnego okna za pomocą symulacji klawiatury",
    form: {
      label: "Wpisz tekst",
      description: "Wyślij naciśnięcia klawiszy do aktywnego okna",
      fields: {
        text: {
          label: "Tekst",
          description: "Tekst do wpisania w aktywnym oknie",
          placeholder: "Witaj, Świecie!",
        },
        delay: {
          label: "Opóźnienie (ms)",
          description:
            "Opóźnienie między naciśnięciami klawiszy w milisekundach (domyślnie: 12)",
          placeholder: "12",
        },
        windowId: {
          label: "ID okna",
          description:
            "Skoncentruj to okno przed wpisaniem tekstu (UUID z list-windows)",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Tytuł okna",
          description: "Skoncentruj okno zawierające ten tytuł przed wpisaniem",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Tekst wpisany pomyślnie",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas wpisywania tekstu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wpisywania tekstu na pulpicie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wpisywanie tekstu na pulpicie jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas wpisywania tekstu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wpisywania tekstu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas wpisywania tekstu",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Tekst wpisany",
      description: "Tekst został pomyślnie wpisany",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "press-key": {
    title: "Naciśnij klawisz",
    titleShort: "Klawisz",
    dynamicTitle: "Klawisz: {{key}}",
    description: "Naciśnij klawisz lub kombinację klawiszy za pomocą xdotool",
    form: {
      label: "Naciśnij klawisz",
      description:
        "Wyślij zdarzenie naciśnięcia klawisza do pulpitu (składnia xdotool)",
      fields: {
        key: {
          label: "Klawisz",
          description:
            "Nazwa klawisza lub kombinacja w składni xdotool (np. Return, ctrl+c, alt+F4)",
          placeholder: "Return",
        },
        repeat: {
          label: "Liczba powtórzeń",
          description: "Liczba naciśnięć klawisza (domyślnie: 1)",
          placeholder: "1",
        },
        delay: {
          label: "Opóźnienie (ms)",
          description:
            "Opóźnienie między kolejnymi naciśnięciami w milisekundach (domyślnie: 0)",
          placeholder: "0",
        },
        windowId: {
          label: "ID okna",
          description: "Skoncentruj to okno przed naciśnięciem klawisza",
          placeholder: "{uuid}",
        },
        windowTitle: {
          label: "Tytuł okna",
          description:
            "Skoncentruj okno z tym tytułem przed naciśnięciem klawisza",
          placeholder: "Kate",
        },
      },
    },
    response: {
      success: "Klawisz naciśnięty pomyślnie",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas naciskania klawisza",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do naciskania klawiszy na pulpicie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Naciskanie klawiszy na pulpicie jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas naciskania klawisza",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas naciskania klawisza",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas naciskania klawisza",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Klawisz naciśnięty",
      description: "Klawisz został pomyślnie naciśnięty",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "move-mouse": {
    title: "Przesuń mysz",
    titleShort: "Przesuń mysz",
    dynamicTitle: "Ruch: {{x}},{{y}}",
    description: "Przesuń kursor myszy do bezwzględnych współrzędnych ekranu",
    form: {
      label: "Przesuń mysz",
      description: "Przesuń kursor myszy do podanej pozycji na ekranie",
      fields: {
        x: {
          label: "Współrzędna X",
          description:
            "Pozioma współrzędna ekranu w pikselach (od lewej krawędzi)",
          placeholder: "100",
        },
        y: {
          label: "Współrzędna Y",
          description:
            "Pionowa współrzędna ekranu w pikselach (od górnej krawędzi)",
          placeholder: "200",
        },
      },
    },
    response: {
      success: "Mysz przesunięta pomyślnie",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas przesuwania myszy",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do poruszania myszą na pulpicie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Poruszanie myszą na pulpicie jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas przesuwania myszy",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas przesuwania myszy",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przesuwania myszy",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Mysz przesunięta",
      description: "Kursor myszy został pomyślnie przesunięty",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  scroll: {
    title: "Przewiń",
    titleShort: "Przewiń",
    dynamicTitle: "Przewiń: {{direction}}",
    description: "Przewiń w bieżącej lub podanej pozycji kursora",
    form: {
      label: "Przewiń",
      description: "Przewiń w górę, dół, lewo lub prawo w podanej pozycji",
      fields: {
        x: {
          label: "Współrzędna X",
          description:
            "Pozioma pozycja przewijania (bieżąca pozycja, jeśli pominięto)",
          placeholder: "100",
        },
        y: {
          label: "Współrzędna Y",
          description:
            "Pionowa pozycja przewijania (bieżąca pozycja, jeśli pominięto)",
          placeholder: "200",
        },
        direction: {
          label: "Kierunek",
          description: "Kierunek przewijania",
          placeholder: "dół",
          options: {
            up: "Góra",
            down: "Dół",
            left: "Lewo",
            right: "Prawo",
          },
        },
        amount: {
          label: "Ilość",
          description: "Liczba kroków przewijania (domyślnie: 3)",
          placeholder: "3",
        },
      },
    },
    response: {
      success: "Przewijanie wykonane pomyślnie",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas przewijania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do przewijania na pulpicie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przewijanie na pulpicie jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas przewijania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas przewijania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przewijania",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Przewinięto",
      description: "Przewijanie zostało wykonane pomyślnie",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "get-focused-window": {
    title: "Pobierz aktywne okno",
    titleShort: "Aktywne okno",
    description: "Pobierz informacje o aktualnie aktywnym oknie",
    form: {
      label: "Pobierz aktywne okno",
      description: "Pobierz ID okna, tytuł i PID aktywnego okna",
      fields: {},
    },
    response: {
      success: "Informacje o aktywnym oknie pobrane pomyślnie",
      windowId: "ID okna X11 aktywnego okna",
      windowTitle: "Tekst tytułu aktywnego okna",
      pid: "ID procesu aktywnego okna",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania aktywnego okna",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do pobierania informacji o oknach",
      },
      forbidden: {
        title: "Zabronione",
        description: "Pobieranie informacji o oknach jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono aktywnego okna",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania aktywnego okna",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas pobierania aktywnego okna",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania aktywnego okna",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Aktywne okno pobrane",
      description: "Informacje o aktywnym oknie zostały pomyślnie pobrane",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      windowManagement: "Zarządzanie oknami",
    },
  },
  "list-windows": {
    title: "Lista okien",
    titleShort: "Okna",
    description: "Lista wszystkich otwartych okien na pulpicie",
    form: {
      label: "Lista okien",
      description:
        "Pobierz listę wszystkich otwartych okien z ID, tytułami i pozycjami",
      fields: {},
    },
    response: {
      success: "Lista okien pobrana pomyślnie",
      windows: "Lista otwartych okien",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wprowadzone dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas listowania okien",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do listowania okien",
      },
      forbidden: {
        title: "Zabronione",
        description: "Listowanie okien jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono żadnych okien",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas listowania okien",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas listowania okien",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas listowania okien",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Okna wylistowane",
      description: "Lista okien została pobrana pomyślnie",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      windowManagement: "Zarządzanie oknami",
    },
  },
  "focus-window": {
    title: "Aktywuj okno",
    titleShort: "Fokus okna",
    dynamicTitle: "Fokus: {{target}}",
    description: "Przesuń okno na pierwszy plan i nadaj mu fokus",
    form: {
      label: "Aktywuj okno",
      description: "Aktywuj okno według jego ID, PID lub tytułu",
      fields: {
        windowId: {
          label: "ID okna",
          description:
            "ID okna X11 (szesnastkowe, np. 0x1234). Ma pierwszeństwo przed innymi opcjami.",
          placeholder: "0x1234",
        },
        pid: {
          label: "ID procesu",
          description: "Aktywuj okno należące do tego ID procesu",
          placeholder: "12345",
        },
        title: {
          label: "Tytuł okna",
          description:
            "Aktywuj okno, którego tytuł zawiera ten ciąg (z uwzględnieniem wielkości liter)",
          placeholder: "Firefox",
        },
      },
    },
    response: {
      success: "Okno aktywowane pomyślnie",
      error: "Komunikat błędu",
      executionId: "ID wykonania do śledzenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podaj co najmniej jedno z: ID okna, PID lub tytuł",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas aktywowania okna",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do aktywowania okien",
      },
      forbidden: {
        title: "Zabronione",
        description: "Aktywowanie okien jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wskazane okno nie zostało znalezione",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas aktywowania okna",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas aktywowania okna",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas aktywowania okna",
      },
      notImplemented: {
        title: "Nie zaimplementowano",
        description:
          "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
      },
    },
    success: {
      title: "Okno aktywowane",
      description: "Okno zostało pomyślnie przeniesione na pierwszy plan",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      windowManagement: "Zarządzanie oknami",
    },
  },
  "move-window-to-monitor": {
    title: "Przenieś okno na monitor",
    titleShort: "Przenieś okno",
    dynamicTitle: "Przenieś: {{target}}",
    description: "Przenieś okno na wybrany monitor",
    form: {
      label: "Przenieś okno na monitor",
      description: "Przenieś okno przez ID, PID lub tytuł na docelowy monitor",
      fields: {
        windowId: {
          label: "ID okna",
          description:
            "Wewnętrzny UUID okna KWin (z list-windows). Ma pierwszeństwo przed PID i tytułem.",
          placeholder: "{uuid}",
        },
        pid: {
          label: "ID procesu",
          description: "Przenieś okno należące do tego procesu",
          placeholder: "12345",
        },
        title: {
          label: "Tytuł okna",
          description:
            "Przenieś okno, którego tytuł zawiera ten ciąg (bez rozróżniania wielkości liter)",
          placeholder: "Firefox",
        },
        monitorName: {
          label: "Nazwa monitora",
          description:
            "Nazwa docelowego monitora (np. DP-1, HDMI-A-1). Użyj list-monitors, aby zobaczyć dostępne.",
          placeholder: "DP-1",
        },
        monitorIndex: {
          label: "Indeks monitora",
          description:
            "Indeks docelowego monitora (od 0). Preferuj nazwę monitora.",
          placeholder: "0",
        },
      },
    },
    response: {
      success: "Czy przeniesienie się powiodło",
      movedTo: "Monitor, na który przeniesiono okno",
      windowTitle: "Tytuł przeniesionego okna",
      error: "Komunikat błędu w razie niepowodzenia",
      executionId: "Unikalny identyfikator wykonania",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description:
          "Podaj co najmniej jeden identyfikator okna i cel monitora",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieciowy podczas przenoszenia okna",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do przenoszenia okien",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przenoszenie okien jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono podanego okna lub monitora",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas przenoszenia okna",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieznany błąd podczas przenoszenia okna",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przenoszenia okna",
      },
    },
    success: {
      title: "Okno przeniesione",
      description: "Okno zostało pomyślnie przeniesione na docelowy monitor",
    },
    category: "Desktop",
    tags: {
      desktopAutomation: "Automatyzacja pulpitu",
      windowManagement: "Zarządzanie oknami",
    },
  },

  title: "Narzędzia automatyzacji pulpitu",
  description: "Steruj pulpitem: zrzuty ekranu, mysz, klawiatura, okna",
  category: "Desktop",
  summary:
    "Wieloplatformowa automatyzacja pulpitu: Linux (ydotool/KWin/pyatspi) i Windows (PowerShell/UIAutomation)",
  tags: {
    desktopAutomation: "Automatyzacja pulpitu",
    inputAutomation: "Automatyzacja wprowadzania",
    windowManagement: "Zarządzanie oknami",
    captureAutomation: "Automatyzacja przechwytywania",
    accessibilityAutomation: "Automatyzacja dostępności",
  },

  tool: {
    takeScreenshot: "Zrób zrzut ekranu",
    getAccessibilityTree: "Pobierz drzewo dostępności",
    click: "Kliknij",
    typeText: "Wpisz tekst",
    pressKey: "Naciśnij klawisz",
    moveMouse: "Przesuń mysz",
    scroll: "Przewiń",
    getFocusedWindow: "Pobierz aktywne okno",
    listMonitors: "Lista monitorów",
    listWindows: "Lista okien",
    focusWindow: "Aktywuj okno",
    moveWindowToMonitor: "Przenieś okno na monitor",
  },

  widget: {
    noWindows: "Brak otwartych okien",
    windowCount_one: "{{count}} okno",
    windowCount_other: "{{count}} okien",
    actionFocus: "Aktywuj",
    actionType: "Wpisz",
    actionKey: "Klawisz",
    actionMove: "Przenieś",
    actionA11y: "A11y",
    actionTypeText: "Wpisz tekst",
    actionPressKey: "Naciśnij klawisz",
    actionScreenshot: "Zrzut ekranu",
    actionA11yTree: "Drzewo A11y",
    actionAllWindows: "← Wszystkie okna",
    actionAllMonitors: "Wszystkie monitory →",
    actionScreenshotLink: "Zrzut ekranu →",
    actionMoveWindowHere: "Przenieś okno tutaj",
    labelPrimary: "Główny",
    statusFocused: "Okno aktywowane",
    statusTyped: "Wpisano",
    statusPressed: "Naciśnięto",
    statusMoved: "Przeniesiono",
    statusScrolled: "Przewinięto",
    statusMouseMoved: "Mysz przesunięta",
    statusClickExecuted: "Kliknięto",
    labelSaved: "Zapisano:",
    labelTruncated: "⚠ Skrócono",
    filterPlaceholder: "Filtruj węzły…",
    titleTypeText: "Wpisz tekst",
    titlePressKey: "Naciśnij klawisz",
    titleClick: "Kliknij",
    titleScroll: "Przewiń",
    titleMoveMouse: "Przesuń mysz",
    titleMoveWindow: "Przenieś okno",
    titleA11yTree: "Drzewo dostępności",
    titleListWindows: "Okna",
    titleListMonitors: "Monitory",
    titleGetFocusedWindow: "Aktywne okno",
    titleFocusWindow: "Aktywuj okno",
  },

  repository: {
    platformNotSupported:
      "Platforma nieobsługiwana: {{platform}}. Obsługiwane są Linux i Windows.",
    windowsNotSupported: "Obsługa Windows wkrótce",
    macosNotSupported: "Obsługa macOS wkrótce",
    commandFailed: "Polecenie nie powiodło się: {{error}}",
    toolNotFound:
      "Wymagane narzędzie nie znalezione: {{tool}}. Zainstaluj przez: {{installCmd}}",
    screenshotFailed: "Nie udało się wykonać zrzutu ekranu",
    accessibilityFailed: "Nie udało się pobrać drzewa dostępności",
    focusWindowRequiresIdentifier:
      "Wymagane jest co najmniej jedno z: windowId, pid lub title",
    missingDep:
      "Brakuje pakietu systemowego: {{dep}}. Powinno pojawić się okno autoryzacji - zatwierdź, aby zainstalować automatycznie.",
  },
};
