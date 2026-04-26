import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Przesuń mysz",
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
      description: "Wystąpił wewnętrzny błąd serwera podczas przesuwania myszy",
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
      description: "Ta funkcja nie jest dostępna w Twoim systemie operacyjnym",
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
};
