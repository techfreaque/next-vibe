/**
 * Browser API translations (Polish)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "Kliknij element",
    titleShort: "Kliknij",
    description:
      "Kliknij element po UID z migawki. Najpierw wywołaj take-snapshot.",
    dynamicTitle: "Klik: {{uid}}",

    form: {
      label: "Kliknij element",
      description: "Kliknij na określony element na stronie",
      fields: {
        uid: {
          label: "UID elementu",
          description: "UID elementu na stronie z migawki zawartości strony",
          placeholder: "Wprowadź UID elementu",
        },
        dblClick: {
          label: "Podwójne kliknięcie",
          description: "Ustaw na true dla podwójnych kliknięć. Domyślnie false",
        },
      },
    },

    response: {
      success: "Operacja kliknięcia pomyślna",
      result: "Wynik operacji kliknięcia",
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
        description: "Wystąpił błąd sieci podczas operacji kliknięcia",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania operacji kliknięcia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja kliknięcia jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany element nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji kliknięcia",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas operacji kliknięcia",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji kliknięcia",
      },
    },

    success: {
      title: "Operacja kliknięcia pomyślna",
      description: "Element został pomyślnie kliknięty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "close-page": {
    title: "Zamknij stronę",
    titleShort: "Zamknij",
    description:
      "Zamknij bieżącą stronę sesji. Ostatniej otwartej strony nie można zamknąć.",

    form: {
      label: "Zamknij stronę",
      description: "Zamknij stronę przeglądarki według jej indeksu",
      fields: {
        pageIdx: {
          label: "Indeks strony",
          description:
            "Indeks strony do zamknięcia. Wywołaj list_pages, aby wyświetlić strony",
          placeholder: "Wprowadź indeks strony (np. 0)",
        },
      },
    },

    response: {
      success: "Strona pomyślnie zamknięta",
      result: "Wynik operacji zamykania strony",
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
        description: "Wystąpił błąd sieci podczas zamykania strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do zamykania stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Zamykanie strony jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądana strona nie została znaleziona",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas zamykania strony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas zamykania strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas zamykania strony",
      },
    },

    success: {
      title: "Strona pomyślnie zamknięta",
      description: "Strona została pomyślnie zamknięta",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  drag: {
    title: "Przeciągnij element",
    titleShort: "Przeciągnij",
    description:
      "Przeciągnij jeden element na drugi po UID. UID-y pobierz z take-snapshot.",
    dynamicTitle: "Przeciągnij: {{from}} \u2192 {{to}}",

    form: {
      label: "Przeciągnij element",
      description: "Przeciągnij jeden element na inny element",
      fields: {
        from_uid: {
          label: "UID elementu źródłowego",
          description: "UID elementu do przeciągnięcia",
          placeholder: "Wprowadź UID elementu źródłowego",
        },
        to_uid: {
          label: "UID elementu docelowego",
          description: "UID elementu docelowego",
          placeholder: "Wprowadź UID elementu docelowego",
        },
      },
    },

    response: {
      success: "Operacja przeciągnięcia pomyślna",
      result: "Wynik operacji przeciągnięcia",
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
        description: "Wystąpił błąd sieci podczas operacji przeciągania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania operacji przeciągania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja przeciągania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany element nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji przeciągania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas operacji przeciągania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji przeciągania",
      },
    },

    success: {
      title: "Operacja przeciągania pomyślna",
      description: "Element został pomyślnie przeciągnięty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  fill: {
    title: "Wypełnij",
    titleShort: "Wypełnij",
    description:
      "Wpisz tekst do input/textarea lub wybierz opcję z listy po UID. UID-y pobierz z take-snapshot.",
    dynamicTitle: "Wypełnij: {{uid}}",

    form: {
      label: "Wypełnij element",
      description: "Wpisz tekst do elementu formularza",
      fields: {
        uid: {
          label: "UID elementu",
          description: "UID elementu na stronie z migawki treści strony",
          placeholder: "Wprowadź UID elementu",
        },
        value: {
          label: "Wartość",
          description: "Wartość do wpisania",
          placeholder: "Wprowadź wartość do wypełnienia",
        },
      },
    },

    response: {
      success: "Operacja wypełniania pomyślna",
      result: "Wynik operacji wypełniania",
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
        description: "Wystąpił błąd sieci podczas operacji wypełniania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania operacji wypełniania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja wypełniania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji wypełniania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas operacji wypełniania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji wypełniania",
      },
    },

    success: {
      title: "Operacja wypełniania pomyślna",
      description: "Element został pomyślnie wypełniony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "fill-form": {
    category: "Przeglądarka",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wejścia",
    },
    title: "Wypełnij formularz",
    titleShort: "Formularz",
    description:
      "Wypełnij wiele pól formularza naraz tablicą UID-ów. Wydajniejsze niż pojedyncze wywołania fill.",

    form: {
      label: "Wypełnij elementy formularza",
      description: "Wypełnij wiele elementów formularza jednocześnie",
      fields: {
        elements: {
          label: "Elementy formularza",
          description: "Tablica elementów z migawki do wypełnienia",
          placeholder: "Wprowadź elementy formularza (tablica JSON)",
          uid: {
            label: "UID elementu",
            description: "Unikalny identyfikator elementu do wypełnienia",
          },
          value: {
            label: "Wartość",
            description: "Wartość do wprowadzenia do elementu",
          },
        },
      },
    },

    response: {
      success: "Operacja wypełniania formularza pomyślna",
      result: {
        title: "Wynik",
        description: "Wynik operacji wypełniania formularza",
        filled: "Wszystko wypełnione",
        filledCount: "Liczba wypełnionych",
        elements: {
          uid: "UID elementu",
          filled: "Pomyślnie wypełniono",
        },
      },
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
        description: "Wystąpił błąd sieci podczas wypełniania formularza",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnień do wykonywania operacji wypełniania formularza",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja wypełniania formularza jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas wypełniania formularza",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wypełniania formularza",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas wypełniania formularza",
      },
    },

    success: {
      title: "Wypełnianie formularza pomyślne",
      description: "Wszystkie elementy formularza zostały pomyślnie wypełnione",
    },
  },
  "handle-dialog": {
    title: "Obsłuż dialog",
    titleShort: "Dialog",
    description:
      "Zaakceptuj lub odrzuć dialog przeglądarki (alert/confirm/prompt). Wywołaj przed akcją, która go wyzwala.",
    dynamicTitle: "Dialog: {{action}}",

    form: {
      label: "Obsłuż dialog przeglądarki",
      description: "Zaakceptuj lub odrzuć dialog przeglądarki",
      fields: {
        action: {
          label: "Akcja",
          description: "Czy odrzucić czy zaakceptować dialog",
          placeholder: "Wybierz akcję",
          options: {
            accept: "Zaakceptuj",
            dismiss: "Odrzuć",
          },
        },
        promptText: {
          label: "Tekst promptu",
          description: "Opcjonalny tekst do wprowadzenia do dialogu",
          placeholder: "Wprowadź tekst promptu (opcjonalnie)",
        },
      },
    },

    response: {
      success: "Operacja obsługi dialogu pomyślna",
      result: "Wynik obsługi dialogu",
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
        description: "Wystąpił błąd sieci podczas obsługi dialogu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnień do wykonywania operacji obsługi dialogu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja obsługi dialogu jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas obsługi dialogu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas obsługi dialogu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas obsługi dialogu",
      },
    },

    success: {
      title: "Obsługa dialogu pomyślna",
      description: "Dialog przeglądarki został pomyślnie obsłużony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      dialogAutomation: "Automatyzacja dialogów",
    },
  },
  hover: {
    title: "Najedź",
    titleShort: "Najedź",
    description:
      "Najedź na element po UID, aby pokazać tooltip lub ukryte elementy sterujące.",
    dynamicTitle: "Hover: {{uid}}",

    form: {
      label: "Najedź na element",
      description: "Przesuń kursor myszy nad element",
      fields: {
        uid: {
          label: "UID elementu",
          description: "UID elementu na stronie z migawki treści strony",
          placeholder: "Wprowadź UID elementu",
        },
      },
    },

    response: {
      success: "Operacja najechania pomyślna",
      result: "Wynik operacji najechania",
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
        description: "Wystąpił błąd sieci podczas operacji najechania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania operacji najechania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja najechania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji najechania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas operacji najechania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji najechania",
      },
    },

    success: {
      title: "Operacja najechania pomyślna",
      description: "Element został pomyślnie najechany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "press-key": {
    title: "Naciśnij klawisz",
    titleShort: "Klawisz",
    dynamicTitle: "Klawisz: {{key}}",
    description: "Naciśnij klawisz lub kombinację klawiszy",
    form: {
      label: "Naciśnij klawisz",
      description: "Naciśnij klawisz lub kombinację klawiszy",
      fields: {
        key: {
          label: "Klawisz",
          description:
            "Klawisz lub kombinacja (np. Enter, Control+A, Control+Shift+R)",
          placeholder: "Wprowadź klawisz lub kombinację",
        },
      },
    },
    response: {
      success: "Operacja naciśnięcia klawisza pomyślna",
      result: "Wynik operacji naciśnięcia klawisza",
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
          "Wystąpił błąd sieci podczas operacji naciśnięcia klawisza",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnień do wykonywania operacji naciśnięcia klawisza",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja naciśnięcia klawisza jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji naciśnięcia klawisza",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas operacji naciśnięcia klawisza",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji naciśnięcia klawisza",
      },
    },
    success: {
      title: "Operacja naciśnięcia klawisza pomyślna",
      description: "Klawisz został pomyślnie naciśnięty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "upload-file": {
    title: "Prześlij plik",
    titleShort: "Prześlij",
    dynamicTitle: "Upload: {{file}}",
    description: "Prześlij plik przez podany element",
    form: {
      label: "Prześlij plik",
      description: "Prześlij plik do elementu wejścia pliku",
      fields: {
        uid: {
          label: "UID elementu",
          description:
            "UID elementu wejścia pliku lub elementu, który otworzy wybór pliku",
          placeholder: "Wprowadź UID elementu",
        },
        filePaths: {
          label: "Ścieżki plików",
          description:
            "Bezwzględna ścieżka pliku do przesłania, przy wyborze wielu plików kilka ścieżek. Dozwolony katalog projektu lub systemowy katalog tymczasowy.",
          placeholder: "/tmp/zdjecie.png",
        },
        includeSnapshot: {
          label: "Dołącz snapshot",
          description: "Zwróć snapshot strony po przesłaniu",
        },
      },
    },
    response: {
      success: "Operacja przesyłania pliku pomyślna",
      result: "Wynik operacji przesyłania pliku",
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
        description: "Wystąpił błąd sieci podczas operacji przesyłania pliku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnień do wykonywania operacji przesyłania pliku",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja przesyłania pliku jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji przesyłania pliku",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas operacji przesyłania pliku",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji przesyłania pliku",
      },
    },
    success: {
      title: "Operacja przesyłania pliku pomyślna",
      description: "Plik został pomyślnie przesłany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "list-pages": {
    title: "Lista stron",
    titleShort: "Strony",
    description:
      "Wylistuj wszystkie otwarte karty z URL-ami. Każda sesja ma jedną kartę; new-page ją zastępuje.",
    form: {
      label: "Lista stron",
      description: "Pobierz wszystkie otwarte strony przeglądarki",
      fields: {},
    },
    response: {
      success: "Operacja listowania stron pomyślna",
      result: {
        title: "Wynik",
        description: "Wynik listowania stron",
        pages: {
          idx: "Indeks",
          title: "Tytuł",
          url: "URL",
          active: "Aktywny",
        },
        totalCount: "Łączna liczba",
      },
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
        description: "Wystąpił błąd sieci podczas listowania stron",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do listowania stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja listowania stron jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas listowania stron",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas listowania stron",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas listowania stron",
      },
    },
    success: {
      title: "Strony pomyślnie wylistowane",
      description: "Otwarte strony zostały pomyślnie wylistowane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  "navigate-page": {
    title: "Nawiguj stronę",
    titleShort: "Nawiguj",
    dynamicTitle: "Nawiguj: {{target}}",
    description:
      "Nawiguj stronę sesji do URL, wstecz, naprzód lub przeładuj. Preferuj nad new-page dla tej samej karty.",
    form: {
      label: "Nawiguj stronę",
      description: "Nawiguj aktualnie wybraną stronę do URL lub przez historię",
      fields: {
        type: {
          label: "Typ nawigacji",
          description:
            "Nawiguj po URL, wstecz lub do przodu w historii, lub odśwież",
          placeholder: "Wybierz typ nawigacji",
          options: {
            url: "URL",
            back: "Wstecz",
            forward: "Do przodu",
            reload: "Odśwież",
          },
        },
        url: {
          label: "URL",
          description: "Docelowy URL (tylko dla type=url)",
          placeholder: "Wprowadź URL",
        },
        ignoreCache: {
          label: "Ignoruj cache",
          description: "Czy ignorować cache podczas odświeżania",
          placeholder: "Ignoruj cache",
        },
        timeout: {
          label: "Limit czasu",
          description:
            "Maksymalny czas oczekiwania w milisekundach (0 dla domyślnego)",
          placeholder: "Wprowadź limit czasu",
        },
      },
    },
    response: {
      success: "Operacja nawigacji pomyślna",
      result: "Wynik nawigacji",
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
        description: "Wystąpił błąd sieci podczas nawigacji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do nawigacji stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja nawigacji strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas nawigacji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas nawigacji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas nawigacji",
      },
    },
    success: {
      title: "Nawigacja pomyślna",
      description: "Strona została pomyślnie znawigowana",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  "new-page": {
    title: "Nowa strona",
    titleShort: "Nowa strona",
    dynamicTitle: "Nowa strona: {{url}}",
    description:
      "Otwórz nową kartę pod danym URL. Sesja przejmuje kartę — wszystkie kolejne wywołania działają na niej.",
    form: {
      label: "Nowa strona",
      description: "Utwórz nową stronę przeglądarki i załaduj URL",
      fields: {
        url: {
          label: "URL",
          description: "URL do załadowania na nowej stronie",
          placeholder: "Wprowadź URL",
        },
        replacePage: {
          label: "Zastąp stronę",
          description: "Zamknij istniejące strony przed otwarciem nowej",
        },
        background: {
          label: "Tło",
          description: "Otwórz stronę bez przenoszenia na pierwszy plan",
        },
        timeout: {
          label: "Limit czasu",
          description:
            "Maksymalny czas oczekiwania w milisekundach (0 dla domyślnego)",
          placeholder: "Wprowadź limit czasu",
        },
      },
    },
    response: {
      success: "Operacja tworzenia nowej strony pomyślna",
      result: "Wynik tworzenia nowej strony",
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
        description: "Wystąpił błąd sieci podczas tworzenia nowej strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do tworzenia nowych stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja tworzenia nowej strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas tworzenia nowej strony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas tworzenia nowej strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas tworzenia nowej strony",
      },
    },
    success: {
      title: "Nowa strona pomyślnie utworzona",
      description: "Nowa strona została pomyślnie utworzona",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  "select-page": {
    title: "Wybierz stronę",
    titleShort: "Wybierz",
    dynamicTitle: "Wybierz: {{page}}",
    description:
      "Przełącz sesję na konkretną stronę po indeksie. Indeks znajdziesz przez list-pages. Nie aktualizuje śledzonej karty sesji.",
    form: {
      label: "Wybierz stronę",
      description: "Wybierz stronę według jej indeksu",
      fields: {
        pageIdx: {
          label: "Indeks strony",
          description:
            "Indeks strony do wybrania (wywołaj list_pages aby wylistować strony)",
          placeholder: "Wprowadź indeks strony",
        },
      },
    },
    response: {
      success: "Operacja wyboru strony pomyślna",
      result: "Wynik wyboru strony",
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
        description: "Wystąpił błąd sieci podczas wybierania strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wybierania stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja wyboru strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas wybierania strony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wybierania strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas wybierania strony",
      },
    },
    success: {
      title: "Strona pomyślnie wybrana",
      description: "Strona została pomyślnie wybrana",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  emulate: {
    title: "Emuluj",
    titleShort: "Emuluj",
    description:
      "Emuluj warunki sieciowe (offline/3G/4G) lub throttling CPU na bieżącej stronie. Każde wywołanie jest bezwzględne: pominięte pola są resetowane. Nadpisanie user agenta działa od następnej nawigacji, więc po ustawieniu odśwież stronę.",
    dynamicTitle: "Emuluj: {{config}}",
    form: {
      label: "Emuluj urządzenie",
      description: "Emuluj warunki sieciowe i dławienie CPU",
      fields: {
        networkConditions: {
          label: "Warunki sieciowe",
          description: "Ogranicz sieć (ustaw na Brak emulacji aby wyłączyć)",
          placeholder: "Wybierz warunek sieciowy",
          options: {
            noEmulation: "Brak emulacji",
            offline: "Offline",
            slow3g: "Wolne 3G",
            fast3g: "Szybkie 3G",
            slow4g: "Wolne 4G",
            fast4g: "Szybkie 4G",
          },
        },
        cpuThrottlingRate: {
          label: "Współczynnik dławienia CPU",
          description: "Współczynnik spowolnienia CPU (1 aby wyłączyć, 1-20)",
          placeholder: "Wprowadź współczynnik dławienia",
        },
      },
    },
    response: {
      success: "Operacja emulacji pomyślna",
      result: "Wynik operacji emulacji",
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
        description: "Wystąpił błąd sieci podczas emulacji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do emulacji funkcji urządzenia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja emulacji urządzenia jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas emulacji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas emulacji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas emulacji",
      },
    },
    success: {
      title: "Emulacja pomyślna",
      description: "Funkcje urządzenia zostały pomyślnie zemulowane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      performanceAutomation: "Automatyzacja wydajności",
    },
  },
  "resize-page": {
    title: "Zmień rozmiar strony",
    titleShort: "Zmień rozmiar",
    dynamicTitle: "Rozmiar: {{width}}x{{height}}",
    description:
      "Zmień rozmiar viewportu przeglądarki do podanych wymiarów w pikselach.",
    form: {
      label: "Zmień rozmiar strony",
      description: "Zmień rozmiar strony do określonych wymiarów",
      fields: {
        width: {
          label: "Szerokość",
          description: "Szerokość strony w pikselach",
          placeholder: "Wprowadź szerokość",
        },
        height: {
          label: "Wysokość",
          description: "Wysokość strony w pikselach",
          placeholder: "Wprowadź wysokość",
        },
      },
    },
    response: {
      success: "Operacja zmiany rozmiaru strony pomyślna",
      result: "Wynik operacji zmiany rozmiaru strony",
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
        description: "Wystąpił błąd sieci podczas zmiany rozmiaru strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do zmiany rozmiaru stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja zmiany rozmiaru strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas zmiany rozmiaru strony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas zmiany rozmiaru strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas zmiany rozmiaru strony",
      },
    },
    success: {
      title: "Rozmiar strony pomyślnie zmieniony",
      description: "Rozmiar strony został pomyślnie zmieniony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      viewportAutomation: "Automatyzacja widoku",
    },
  },
  "evaluate-script": {
    title: "Oceniaj skrypt",
    titleShort: "Skrypt",
    description:
      "Uruchom JavaScript na stronie i zwróć wynik. Dla stanu, którego take-snapshot nie ujawnia.",
    dynamicTitle: "Skrypt: {{snippet}}",
    form: {
      label: "Oceniaj skrypt",
      description: "Wykonaj JavaScript na stronie przeglądarki",
      fields: {
        function: {
          label: "Funkcja",
          description: "Deklaracja funkcji JavaScript do wykonania",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Argumenty",
          description:
            "Opcjonalna lista argumentów (UID elementów) do przekazania do funkcji",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "UID elementu",
            description: "Unikalny identyfikator elementu na stronie",
          },
        },
      },
    },
    response: {
      success: "Operacja oceny skryptu pomyślna",
      result: {
        title: "Wynik",
        description: "Wynik oceny skryptu",
        executed: "Wykonano",
        result: "Wartość zwracana",
      },
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
        description: "Wystąpił błąd sieci podczas oceny skryptu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do oceny skryptów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja oceny skryptu jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas oceny skryptu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas oceny skryptu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas oceny skryptu",
      },
    },
    success: {
      title: "Skrypt pomyślnie oceniony",
      description: "JavaScript został pomyślnie wykonany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      scriptExecution: "Wykonywanie skryptów",
    },
  },
  "get-console-message": {
    title: "Pobierz wiadomość konsoli",
    titleShort: "Konsola",
    description:
      "Pobierz pełną treść konkretnej wiadomości konsoli po msgid z list-console-messages.",
    dynamicTitle: "Konsola #{{id}}",
    form: {
      label: "Pobierz wiadomość konsoli",
      description: "Pobierz określoną wiadomość konsoli",
      fields: {
        msgid: {
          label: "ID wiadomości",
          description:
            "ID wiadomości konsoli z wylistowanych wiadomości konsoli",
          placeholder: "Wprowadź ID wiadomości",
        },
      },
    },
    response: {
      success: "Operacja pobierania wiadomości konsoli pomyślna",
      result: "Wynik pobierania wiadomości konsoli",
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
          "Wystąpił błąd sieci podczas pobierania wiadomości konsoli",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do pobierania wiadomości konsoli",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja pobierania wiadomości konsoli jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania wiadomości konsoli",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas pobierania wiadomości konsoli",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania wiadomości konsoli",
      },
    },
    success: {
      title: "Wiadomość konsoli pomyślnie pobrana",
      description: "Wiadomość konsoli została pomyślnie pobrana",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      debugging: "Debugowanie",
    },
  },
  "list-console-messages": {
    title: "Lista wiadomości konsoli",
    titleShort: "Logi konsoli",
    description:
      "Lista wiadomości konsoli od ostatniej nawigacji. Filtruj po typie (error/warn/log). Używaj po akcjach, by wykryć błędy JS.",
    form: {
      label: "Lista wiadomości konsoli",
      description:
        "Pobierz wszystkie wiadomości konsoli ze strony przeglądarki",
      fields: {
        includePreservedMessages: {
          label: "Uwzględnij zachowane wiadomości",
          description:
            "Ustaw na true, aby zwrócić zachowane wiadomości z ostatnich 3 nawigacji",
          placeholder: "false",
        },
        pageIdx: {
          label: "Indeks strony",
          description:
            "Numer strony do zwrócenia (0-based, pomiń dla pierwszej strony)",
          placeholder: "Wprowadź indeks strony",
        },
        pageSize: {
          label: "Rozmiar strony",
          description:
            "Maksymalna liczba wiadomości do zwrócenia (pomiń, aby zwrócić wszystkie wiadomości)",
          placeholder: "Wprowadź rozmiar strony",
        },
        types: {
          label: "Typy wiadomości",
          description:
            "Filtruj wiadomości, aby zwracać tylko wiadomości określonych typów (pomiń dla wszystkich)",
          placeholder: "Wybierz typy wiadomości",
          options: {
            log: "Log",
            debug: "Debug",
            info: "Info",
            error: "Błąd",
            warn: "Ostrzeżenie",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Tabela",
            trace: "Trace",
            clear: "Wyczyść",
            startGroup: "Rozpocznij grupę",
            startGroupCollapsed: "Rozpocznij grupę zwinięte",
            endGroup: "Zakończ grupę",
            assert: "Assert",
            profile: "Profil",
            profileEnd: "Koniec profilu",
            count: "Licznik",
            timeEnd: "Koniec czasu",
            verbose: "Szczegółowe",
            issue: "Problem",
          },
        },
      },
    },
    response: {
      success: "Wiadomości konsoli pobrane pomyślnie",
      result: {
        title: "Wynik",
        description: "Wynik listy wiadomości konsoli",
        messages: {
          msgid: "ID wiadomości",
          type: "Typ",
          text: "Wiadomość",
          timestamp: "Znacznik czasu",
        },
        totalCount: "Łączna liczba",
      },
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
          "Wystąpił błąd sieci podczas listowania wiadomości konsoli",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do listowania wiadomości konsoli",
      },
      forbidden: {
        title: "Zabronione",
        description: "Listowanie wiadomości konsoli jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas listowania wiadomości konsoli",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas listowania wiadomości konsoli",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas listowania wiadomości konsoli",
      },
    },
    success: {
      title: "Wiadomości konsoli pobrane pomyślnie",
      description: "Wiadomości konsoli zostały pomyślnie pobrane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      debugging: "Debugowanie",
    },
  },
  "get-network-request": {
    title: "Pobierz żądanie sieciowe",
    titleShort: "Żądanie",
    description:
      "Pobierz pełne szczegóły (nagłówki, body) żądania po reqid z list-network-requests.",
    dynamicTitle: "Sieć #{{id}}",
    form: {
      label: "Pobierz żądanie sieciowe",
      description: "Pobierz określone żądanie sieciowe lub aktualnie wybrane",
      fields: {
        reqid: {
          label: "ID żądania",
          description:
            "Reqid żądania sieciowego (pomiń, aby pobrać aktualnie wybrane żądanie w DevTools)",
          placeholder: "Wprowadź ID żądania",
        },
        maxBodyLength: {
          label: "Maks. długość treści",
          description:
            "Maksymalna liczba znaków zwracanych z treści żądania/odpowiedzi. Nadmiar jest obcinany z powiadomieniem.",
          placeholder: "np. 10000",
        },
      },
    },
    response: {
      success: "Żądanie sieciowe pobrane pomyślnie",
      result: "Wynik pobierania żądania sieciowego",
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
          "Wystąpił błąd sieci podczas pobierania żądania sieciowego",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do pobierania żądań sieciowych",
      },
      forbidden: {
        title: "Zabronione",
        description: "Pobieranie żądań sieciowych jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania żądania sieciowego",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas pobierania żądania sieciowego",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania żądania sieciowego",
      },
    },
    success: {
      title: "Żądanie sieciowe pobrane pomyślnie",
      description: "Żądanie sieciowe zostało pomyślnie pobrane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      networkAnalysis: "Analiza sieci",
    },
  },
  "list-network-requests": {
    title: "Lista żądań sieciowych",
    titleShort: "Logi sieci",
    description:
      "Lista żądań sieciowych od ostatniej nawigacji. Filtruj po typie zasobu (fetch/xhr/doc). Do inspekcji wywołań API.",
    form: {
      label: "Lista żądań sieciowych",
      description: "Pobierz wszystkie żądania sieciowe ze strony przeglądarki",
      fields: {
        includePreservedRequests: {
          label: "Uwzględnij zachowane żądania",
          description:
            "Ustaw na true, aby zwrócić zachowane żądania z ostatnich 3 nawigacji",
          placeholder: "false",
        },
        pageIdx: {
          label: "Indeks strony",
          description:
            "Numer strony do zwrócenia (0-based, pomiń dla pierwszej strony)",
          placeholder: "Wprowadź indeks strony",
        },
        pageSize: {
          label: "Rozmiar strony",
          description:
            "Maksymalna liczba żądań do zwrócenia (pomiń, aby zwrócić wszystkie żądania)",
          placeholder: "Wprowadź rozmiar strony",
        },
        resourceTypes: {
          label: "Typy zasobów",
          description:
            "Filtruj żądania, aby zwracać tylko żądania określonych typów zasobów (pomiń dla wszystkich)",
          placeholder: "Wybierz typy zasobów",
          options: {
            document: "Dokument",
            stylesheet: "Arkusz stylów",
            image: "Obraz",
            media: "Media",
            font: "Czcionka",
            script: "Skrypt",
            texttrack: "Ścieżka tekstowa",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Źródło zdarzeń",
            websocket: "WebSocket",
            manifest: "Manifest",
            signedexchange: "Podpisana wymiana",
            ping: "Ping",
            cspviolationreport: "Raport naruszenia CSP",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Inne",
          },
        },
      },
    },
    response: {
      success: "Żądania sieciowe pobrane pomyślnie",
      result: {
        title: "Wynik",
        description: "Wynik listy żądań sieciowych",
        requests: {
          reqid: "ID żądania",
          url: "URL",
          method: "Metoda",
          status: "Status",
          type: "Typ",
        },
        totalCount: "Łączna liczba",
      },
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
        description: "Wystąpił błąd sieci podczas listowania żądań sieciowych",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do listowania żądań sieciowych",
      },
      forbidden: {
        title: "Zabronione",
        description: "Listowanie żądań sieciowych jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas listowania żądań sieciowych",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas listowania żądań sieciowych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas listowania żądań sieciowych",
      },
    },
    success: {
      title: "Żądania sieciowe pobrane pomyślnie",
      description: "Żądania sieciowe zostały pomyślnie pobrane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      networkAnalysis: "Analiza sieci",
    },
  },
  "performance-analyze-insight": {
    title: "Analizuj insight wydajności",
    titleShort: "Analiza",
    description:
      "Wejdź głębiej w konkretny insight z wyniku trace (np. DocumentLatency, LCPBreakdown). Wywołaj po performance-stop-trace.",
    form: {
      label: "Analizuj insight wydajności",
      description:
        "Pobierz szczegółowe informacje o określonym insightu wydajności",
      fields: {
        insightSetId: {
          label: "ID zestawu insightów",
          description:
            "ID określonego zestawu insightów (używaj tylko ID podanych na liście Dostępne zestawy insightów)",
          placeholder: "Wprowadź ID zestawu insightów",
        },
        insightName: {
          label: "Nazwa insightu",
          description:
            "Nazwa insightu, o którym chcesz uzyskać więcej informacji (np. DocumentLatency lub LCPBreakdown)",
          placeholder: "Wprowadź nazwę insightu",
        },
      },
    },
    response: {
      success: "Insight wydajności przeanalizowany pomyślnie",
      result: "Wynik analizy insightu wydajności",
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
          "Wystąpił błąd sieci podczas analizowania insightu wydajności",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do analizowania insightów wydajności",
      },
      forbidden: {
        title: "Zabronione",
        description: "Analizowanie insightów wydajności jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas analizowania insightu wydajności",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas analizowania insightu wydajności",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Wystąpił konflikt podczas analizowania insightu wydajności",
      },
    },
    success: {
      title: "Insight wydajności przeanalizowany pomyślnie",
      description: "Insight wydajności został pomyślnie przeanalizowany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      performanceAutomation: "Automatyzacja wydajności",
    },
  },
  "performance-start-trace": {
    title: "Rozpocznij trace wydajności",
    titleShort: "Start śladu",
    description:
      "Uruchom trace wydajności, aby przechwycić Core Web Vitals i metryki ładowania. Następnie wywołaj performance-stop-trace.",
    form: {
      label: "Rozpocznij trace wydajności",
      description:
        "Rozpocznij nagrywanie metryk wydajności dla strony przeglądarki",
      fields: {
        reload: {
          label: "Przeładuj stronę",
          description:
            "Określa, czy po rozpoczęciu śledzenia strona powinna zostać automatycznie przeładowana",
          placeholder: "true",
        },
        autoStop: {
          label: "Automatyczne zatrzymanie",
          description:
            "Określa, czy nagrywanie trace powinno zostać automatycznie zatrzymane",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Trace wydajności rozpoczęty pomyślnie",
      result: "Wynik rozpoczęcia trace wydajności",
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
          "Wystąpił błąd sieci podczas rozpoczynania trace wydajności",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do rozpoczynania trace wydajności",
      },
      forbidden: {
        title: "Zabronione",
        description: "Rozpoczynanie trace wydajności jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas rozpoczynania trace wydajności",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas rozpoczynania trace wydajności",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas rozpoczynania trace wydajności",
      },
    },
    success: {
      title: "Trace wydajności rozpoczęty pomyślnie",
      description: "Trace wydajności został pomyślnie rozpoczęty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      performanceAutomation: "Automatyzacja wydajności",
    },
  },
  "performance-stop-trace": {
    title: "Zatrzymaj trace wydajności",
    titleShort: "Stop śladu",
    description:
      "Zatrzymaj aktywny trace i zwróć metryki wydajności z ID zestawów insightów dla performance-analyze-insight.",
    form: {
      label: "Zatrzymaj trace wydajności",
      description: "Zatrzymaj aktywne nagrywanie trace wydajności",
      fields: {},
    },
    response: {
      success: "Trace wydajności zatrzymany pomyślnie",
      result: "Wynik zatrzymania trace wydajności z metrykami",
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
          "Wystąpił błąd sieci podczas zatrzymywania trace wydajności",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do zatrzymywania trace wydajności",
      },
      forbidden: {
        title: "Zabronione",
        description: "Zatrzymywanie trace wydajności jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas zatrzymywania trace wydajności",
      },
      unknown: {
        title: "Nieznany błąd",
        description:
          "Wystąpił nieznany błąd podczas zatrzymywania trace wydajności",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas zatrzymywania trace wydajności",
      },
    },
    success: {
      title: "Trace wydajności zatrzymany pomyślnie",
      description: "Trace wydajności został pomyślnie zatrzymany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      performanceAutomation: "Automatyzacja wydajności",
    },
  },
  "take-screenshot": {
    title: "Zrób zrzut ekranu",
    titleShort: "Zrzut ekranu",
    dynamicTitle: "Zrzut: {{target}}",
    description:
      "Zrób wizualny zrzut ekranu strony lub elementu. Zwraca obraz. Do weryfikacji stanu UI.",
    form: {
      label: "Zrób zrzut ekranu",
      description: "Przechwyć zrzut ekranu strony przeglądarki lub elementu",
      fields: {
        uid: {
          label: "UID elementu",
          description:
            "UID elementu do zrzutu ekranu (pomiń, aby zrobić zrzut ekranu całej strony)",
          placeholder: "Wprowadź UID elementu",
        },
        fullPage: {
          label: "Cała strona",
          description:
            "Jeśli ustawiono na true, zrobi zrzut ekranu całej strony zamiast aktualnie widocznego obszaru (niekompatybilne z uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Typ formatu do zapisania zrzutu ekranu (domyślnie: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Jakość",
          description:
            "Jakość kompresji dla formatów JPEG i WebP (0-100). Wyższe wartości oznaczają lepszą jakość, ale większe rozmiary plików. Ignorowane dla formatu PNG.",
          placeholder: "80",
        },
        filePath: {
          label: "Ścieżka pliku",
          description:
            "Ścieżka bezwzględna lub względna do bieżącego katalogu roboczego, aby zapisać zrzut ekranu zamiast dołączać go do odpowiedzi",
          placeholder: "/ścieżka/do/zrzutu-ekranu.png",
        },
      },
    },
    response: {
      success: "Zrzut ekranu przechwycony pomyślnie",
      result: "Wynik przechwytywania zrzutu ekranu",
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
        description: "Nie masz uprawnień do przechwytywania zrzutów ekranu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przechwytywanie zrzutów ekranu jest zabronione",
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
    },
    success: {
      title: "Zrzut ekranu przechwycony pomyślnie",
      description: "Zrzut ekranu został pomyślnie przechwycony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      captureAutomation: "Automatyzacja przechwytywania",
    },
  },
  "take-snapshot": {
    title: "Zrób snapshot",
    titleShort: "Migawka",
    description:
      "Pobierz drzewo a11y strony jako tekst. Wymagane przed click/fill/drag — dostarcza UID-ów elementów.",
    form: {
      label: "Zrób snapshot",
      description:
        "Przechwyć tekstowy snapshot strony przeglądarki na podstawie drzewa a11y",
      fields: {
        verbose: {
          label: "Szczegółowy",
          description:
            "Czy dołączyć wszystkie dostępne informacje w pełnym drzewie a11y (domyślnie: false)",
          placeholder: "false",
        },
        filePath: {
          label: "Ścieżka pliku",
          description:
            "Ścieżka bezwzględna lub względna do bieżącego katalogu roboczego, aby zapisać snapshot zamiast dołączać go do odpowiedzi",
          placeholder: "/ścieżka/do/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snapshot przechwycony pomyślnie",
      result: "Wynik przechwytywania snapshot",
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
        description: "Wystąpił błąd sieci podczas przechwytywania snapshot",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do przechwytywania snapshot",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przechwytywanie snapshot jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas przechwytywania snapshot",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas przechwytywania snapshot",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przechwytywania snapshot",
      },
    },
    success: {
      title: "Snapshot przechwycony pomyślnie",
      description: "Snapshot został pomyślnie przechwycony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      captureAutomation: "Automatyzacja przechwytywania",
    },
  },
  "wait-for": {
    title: "Poczekaj na",
    titleShort: "Czekaj",
    dynamicTitle: "Czekaj: {{text}}",
    description:
      "Poczekaj, aż dany tekst pojawi się na stronie. Używaj po nawigacji lub akcjach asynchronicznych.",

    form: {
      label: "Poczekaj na tekst",
      description: "Poczekaj, aż określony tekst pojawi się na stronie",
      fields: {
        text: {
          label: "Tekst",
          description: "Tekst, który ma pojawić się na stronie",
          placeholder: "Wprowadź tekst, na który czekać",
        },
        timeout: {
          label: "Limit czasu",
          description:
            "Maksymalny czas oczekiwania w milisekundach. Jeśli ustawione na 0, zostanie użyty domyślny limit",
          placeholder: "Wprowadź limit czasu (ms)",
        },
        captureSnapshot: {
          label: "Przechwyć snapshot",
          description:
            "Gdy włączone, dołącza pełny snapshot dostępności do odpowiedzi. Domyślnie wyłączone.",
        },
      },
    },

    response: {
      success: "Operacja oczekiwania pomyślna",
      result: "Wynik operacji oczekiwania",
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
        description: "Wystąpił błąd sieci podczas operacji oczekiwania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania operacji oczekiwania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja oczekiwania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      serverError: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas operacji oczekiwania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas operacji oczekiwania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które mogą zostać utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas operacji oczekiwania",
      },
    },

    success: {
      title: "Operacja oczekiwania pomyślna",
      description: "Określony tekst pojawił się na stronie",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglądarki",
      waitAutomation: "Automatyzacja oczekiwania",
    },
  },
  title: "Chrome DevTools MCP Tools",
  description:
    "Automatyzacja przeglądarki przez Chrome DevTools. Przepływ: new-page → take-snapshot → interakcja (click/fill) → weryfikacja.",
  category: "Core API",
  summary:
    "Dostęp do narzędzi Chrome DevTools Protocol przez MCP dla automatyzacji webowej",
  tags: {
    browserAutomation: "Automatyzacja przeglądarki",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "Narzędzia MCP",
    webDebugging: "Debugowanie webowe",
    performanceAnalysis: "Analiza wydajności",
    inputAutomation: "Automatyzacja wprowadzania",
    captureAutomation: "Automatyzacja przechwytywania",
    debugging: "Debugowanie",
    dialogAutomation: "Automatyzacja dialogów",
    navigationAutomation: "Automatyzacja nawigacji",
    networkAnalysis: "Analiza sieci",
    performanceAutomation: "Automatyzacja wydajności",
    scriptExecution: "Wykonywanie skryptów",
    viewportAutomation: "Automatyzacja widoku",
    waitAutomation: "Automatyzacja oczekiwania",
  },

  form: {
    label: "Wykonanie narzędzia przeglądarki",
    description:
      "Wykonaj narzędzia Chrome DevTools MCP dla sterowania przeglądarką i analizy",
    fields: {
      tool: {
        label: "Narzędzie",
        description: "Wybierz narzędzie Chrome DevTools MCP do wykonania",
        placeholder: "Wybierz narzędzie...",
      },
      arguments: {
        label: "Argumenty",
        description: "Argumenty JSON dla wybranego narzędzia (opcjonalne)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Kliknij element",
    drag: "Przeciągnij element",
    fill: "Wypełnij pole wejściowe",
    fillForm: "Wypełnij formularz",
    handleDialog: "Obsłuż dialog",
    hover: "Najedź na element",
    pressKey: "Naciśnij klawisz",
    uploadFile: "Prześlij plik",

    // Navigation automation tools (6)
    closePage: "Zamknij stronę",
    listPages: "Lista stron",
    navigatePage: "Nawiguj stronę",
    newPage: "Nowa strona",
    selectPage: "Wybierz stronę",
    waitFor: "Czekaj na",

    // Emulation tools (2)
    emulate: "Emuluj urządzenie",
    resizePage: "Zmień rozmiar strony",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analizuj insight wydajności",
    performanceStartTrace: "Rozpocznij trace wydajności",
    performanceStopTrace: "Zatrzymaj trace wydajności",

    // Network tools (2)
    getNetworkRequest: "Pobierz żądanie sieciowe",
    listNetworkRequests: "Lista żądań sieciowych",

    // Debugging tools (5)
    evaluateScript: "Oceniaj skrypt",
    getConsoleMessage: "Pobierz wiadomość konsoli",
    listConsoleMessages: "Lista wiadomości konsoli",
    takeScreenshot: "Zrób zrzut ekranu",
    takeSnapshot: "Zrób snapshot",
  },

  status: {
    pending: "Oczekujący",
    running: "Uruchomiony",
    completed: "Ukończony",
    failed: "Niepowodzenie",
  },

  response: {
    success: "Narzędzie wykonane pomyślnie",
    result: "Wynik wykonania",
    status: "Aktualny status wykonania",
    statusItem: "Status item",
    executionId: "ID wykonania do śledzenia",
  },

  examples: {
    requests: {
      navigate: {
        title: "Nawiguj do URL",
        description: "Nawiguj przeglądarkę do określonego URL",
      },
      screenshot: {
        title: "Zrób zrzut ekranu",
        description: "Zrób zrzut ekranu aktualnej strony",
      },
      click: {
        title: "Kliknij element",
        description: "Kliknij na określony element",
      },
      performance: {
        title: "Rozpocznij trace wydajności",
        description: "Rozpocznij nagrywanie metryk wydajności",
      },
      script: {
        title: "Oceniaj skrypt",
        description: "Wykonaj JavaScript w przeglądarce",
      },
    },
    responses: {
      navigate: {
        title: "Wynik nawigacji",
        description: "Wynik nawigacji strony",
      },
      screenshot: {
        title: "Wynik zrzutu ekranu",
        description: "Wynik wykonania zrzutu ekranu",
      },
      click: {
        title: "Wynik kliknięcia",
        description: "Wynik kliknięcia elementu",
      },
      performance: {
        title: "Trace wydajności rozpoczęty",
        description: "Śledzenie wydajności zainicjowane",
      },
      script: {
        title: "Wynik oceny skryptu",
        description: "Wynik wykonania JavaScript",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Wykonanie narzędzia nie powiodło się",
      description: "Wybrane narzędzie nie mogło zostać wykonane pomyślnie",
    },
    invalidArguments: {
      title: "Nieprawidłowe argumenty",
      description: "Podane argumenty są nieprawidłowe dla tego narzędzia",
    },
    browserNotAvailable: {
      title: "Przeglądarka niedostępna",
      description: "Instancja przeglądarki Chrome jest niedostępna",
    },
    toolNotFound: {
      title: "Narzędzie nie znalezione",
      description: "Żądane narzędzie jest niedostępne",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź swoje dane wejściowe i spróbuj ponownie",
      toolRequired: "Wymagany jest wybór narzędzia",
      argumentsInvalid: "Argumenty muszą być prawidłowym JSON",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas wykonywania narzędzia",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania narzędzi przeglądarki",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wykonywanie narzędzi przeglądarki jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądane narzędzie przeglądarki nie zostało znalezione",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas wykonywania narzędzia",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wykonywania narzędzia",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas wykonywania narzędzia",
    },
  },

  success: {
    title: "Narzędzie wykonane pomyślnie",
    description: "Narzędzie przeglądarki zostało wykonane pomyślnie",
  },

  shared: {
    instanceId: {
      label: "ID sesji",
      description:
        "ID sesji przeglądarki. Każde unikalne ID dostaje własną, izolowaną kartę. Zostaw puste dla domyślnej sesji.",
      placeholder: "np. moja-sesja-1",
    },
  },

  repository: {
    execute: {
      start: "Rozpoczynam wykonywanie narzędzia przeglądarki",
      success: "Narzędzie przeglądarki wykonane pomyślnie",
      error: "Błąd podczas wykonywania narzędzia przeglądarki",
    },
    mcp: {
      connect: {
        start: "Łączenie z serwerem Chrome DevTools MCP",
        success: "Pomyślnie połączono z serwerem MCP",
        error: "Błąd podczas łączenia z serwerem MCP",
        failedToInitialize:
          "Nie udało się zainicjować serwera Chrome DevTools MCP",
      },
      closePage: {
        noSession: "Brak aktywnej sesji — nic do zamknięcia",
        switchedToPage: "Zamknięto stronę, przełączono na stronę {{pageId}}",
        closedPage: "Zamknięto stronę {{pageId}}",
        pageNotInSession: "Strona {{pageId}} nie należy do tej sesji",
      },
      tool: {
        call: {
          start: "Wywołuję narzędzie MCP",
          success: "Narzędzie MCP wywołane pomyślnie",
          error: "Błąd podczas wywoływania narzędzia MCP",
          invalidJsonArguments: "Nieprawidłowe argumenty JSON",
          executionFailed: "Wykonanie narzędzia nie powiodło się: {{error}}",
          newPageFailed: "Nie udało się otworzyć nowej strony",
          toolExecutionFailed: "Nie udało się wykonać {{toolName}}",
        },
      },
    },
  },
};
