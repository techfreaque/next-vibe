import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zrób zrzut ekranu pulpitu",
  dynamicTitle: "Zrzut: {{target}}",
  description: "Przechwyć zrzut ekranu pulpitu lub obszaru ekranu",
  form: {
    label: "Zrób zrzut ekranu pulpitu",
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
      description: "Wystąpił błąd sieci podczas przechwytywania zrzutu ekranu",
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
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
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
};
