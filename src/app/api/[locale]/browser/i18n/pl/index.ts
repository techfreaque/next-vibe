/**
 * Browser API translations (Polish)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "Kliknij element",
    titleShort: "Kliknij",
    description:
      "Kliknij element po UID z migawki. Najpierw wywoÅaj take-snapshot.",
    dynamicTitle: "Klik: {{uid}}",

    form: {
      label: "Kliknij element",
      description: "Kliknij na okreÅlony element na stronie",
      fields: {
        uid: {
          label: "UID elementu",
          description: "UID elementu na stronie z migawki zawartoÅci strony",
          placeholder: "WprowadÅº UID elementu",
        },
        dblClick: {
          label: "PodwÃ³jne klikniÄcie",
          description:
            "Ustaw na true dla podwÃ³jnych klikniÄÄ. DomyÅlnie false",
        },
      },
    },

    response: {
      success: "Operacja klikniÄcia pomyÅlna",
      result: "Wynik operacji klikniÄcia",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas operacji klikniÄcia",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do wykonywania operacji klikniÄcia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja klikniÄcia jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany element nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji klikniÄcia",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas operacji klikniÄcia",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas operacji klikniÄcia",
      },
    },

    success: {
      title: "Operacja klikniÄcia pomyÅlna",
      description: "Element zostaÅ pomyÅlnie klikniÄty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "close-page": {
    title: "Zamknij stronÄ",
    titleShort: "Zamknij",
    description:
      "Zamknij bieÅ¼ÄcÄ stronÄ sesji. Ostatniej otwartej strony nie moÅ¼na zamknÄÄ.",

    form: {
      label: "Zamknij stronÄ",
      description: "Zamknij stronÄ przeglÄdarki wedÅug jej indeksu",
      fields: {
        pageIdx: {
          label: "Indeks strony",
          description:
            "Indeks strony do zamkniÄcia. WywoÅaj list_pages, aby wyÅwietliÄ strony",
          placeholder: "WprowadÅº indeks strony (np. 0)",
        },
      },
    },

    response: {
      success: "Strona pomyÅlnie zamkniÄta",
      result: "Wynik operacji zamykania strony",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas zamykania strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do zamykania stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Zamykanie strony jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädana strona nie zostaÅa znaleziona",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas zamykania strony",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas zamykania strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas zamykania strony",
      },
    },

    success: {
      title: "Strona pomyÅlnie zamkniÄta",
      description: "Strona zostaÅa pomyÅlnie zamkniÄta",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  drag: {
    title: "PrzeciÄgnij element",
    titleShort: "PrzeciÄgnij",
    description:
      "PrzeciÄgnij jeden element na drugi po UID. UID-y pobierz z take-snapshot.",
    dynamicTitle: "PrzeciÄgnij: {{from}} \u2192 {{to}}",

    form: {
      label: "PrzeciÄgnij element",
      description: "PrzeciÄgnij jeden element na inny element",
      fields: {
        from_uid: {
          label: "UID elementu ÅºrÃ³dÅowego",
          description: "UID elementu do przeciÄgniÄcia",
          placeholder: "WprowadÅº UID elementu ÅºrÃ³dÅowego",
        },
        to_uid: {
          label: "UID elementu docelowego",
          description: "UID elementu docelowego",
          placeholder: "WprowadÅº UID elementu docelowego",
        },
      },
    },

    response: {
      success: "Operacja przeciÄgniÄcia pomyÅlna",
      result: "Wynik operacji przeciÄgniÄcia",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas operacji przeciÄgania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnieÅ do wykonywania operacji przeciÄgania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja przeciÄgania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany element nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji przeciÄgania",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas operacji przeciÄgania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas operacji przeciÄgania",
      },
    },

    success: {
      title: "Operacja przeciÄgania pomyÅlna",
      description: "Element zostaÅ pomyÅlnie przeciÄgniÄty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  fill: {
    title: "WypeÅnij",
    titleShort: "WypeÅnij",
    description:
      "Wpisz tekst do input/textarea lub wybierz opcjÄ z listy po UID. UID-y pobierz z take-snapshot.",
    dynamicTitle: "WypeÅnij: {{uid}}",

    form: {
      label: "WypeÅnij element",
      description: "Wpisz tekst do elementu formularza",
      fields: {
        uid: {
          label: "UID elementu",
          description: "UID elementu na stronie z migawki treÅci strony",
          placeholder: "WprowadÅº UID elementu",
        },
        value: {
          label: "WartoÅÄ",
          description: "WartoÅÄ do wpisania",
          placeholder: "WprowadÅº wartoÅÄ do wypeÅnienia",
        },
      },
    },

    response: {
      success: "Operacja wypeÅniania pomyÅlna",
      result: "Wynik operacji wypeÅniania",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas operacji wypeÅniania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do wykonywania operacji wypeÅniania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja wypeÅniania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji wypeÅniania",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas operacji wypeÅniania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas operacji wypeÅniania",
      },
    },

    success: {
      title: "Operacja wypeÅniania pomyÅlna",
      description: "Element zostaÅ pomyÅlnie wypeÅniony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "fill-form": {
    category: "PrzeglÄdarka",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wejÅcia",
    },
    title: "WypeÅnij formularz",
    titleShort: "Formularz",
    description:
      "WypeÅnij wiele pÃ³l formularza naraz tablicÄ UID-Ã³w. Wydajniejsze niÅ¼ pojedyncze wywoÅania fill.",

    form: {
      label: "WypeÅnij elementy formularza",
      description: "WypeÅnij wiele elementÃ³w formularza jednoczeÅnie",
      fields: {
        elements: {
          label: "Elementy formularza",
          description: "Tablica elementÃ³w z migawki do wypeÅnienia",
          placeholder: "WprowadÅº elementy formularza (tablica JSON)",
          uid: {
            label: "UID elementu",
            description: "Unikalny identyfikator elementu do wypeÅnienia",
          },
          value: {
            label: "WartoÅÄ",
            description: "WartoÅÄ do wprowadzenia do elementu",
          },
        },
      },
    },

    response: {
      success: "Operacja wypeÅniania formularza pomyÅlna",
      result: {
        title: "Wynik",
        description: "Wynik operacji wypeÅniania formularza",
        filled: "Wszystko wypeÅnione",
        filledCount: "Liczba wypeÅnionych",
        elements: {
          uid: "UID elementu",
          filled: "PomyÅlnie wypeÅniono",
        },
      },
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas wypeÅniania formularza",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnieÅ do wykonywania operacji wypeÅniania formularza",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja wypeÅniania formularza jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas wypeÅniania formularza",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas wypeÅniania formularza",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas wypeÅniania formularza",
      },
    },

    success: {
      title: "WypeÅnianie formularza pomyÅlne",
      description:
        "Wszystkie elementy formularza zostaÅy pomyÅlnie wypeÅnione",
    },
  },
  "handle-dialog": {
    title: "ObsÅuÅ¼ dialog",
    titleShort: "Dialog",
    description:
      "Zaakceptuj lub odrzuÄ dialog przeglÄdarki (alert/confirm/prompt). WywoÅaj przed akcjÄ, ktÃ³ra go wyzwala.",
    dynamicTitle: "Dialog: {{action}}",

    form: {
      label: "ObsÅuÅ¼ dialog przeglÄdarki",
      description: "Zaakceptuj lub odrzuÄ dialog przeglÄdarki",
      fields: {
        action: {
          label: "Akcja",
          description: "Czy odrzuciÄ czy zaakceptowaÄ dialog",
          placeholder: "Wybierz akcjÄ",
          options: {
            accept: "Zaakceptuj",
            dismiss: "OdrzuÄ",
          },
        },
        promptText: {
          label: "Tekst promptu",
          description: "Opcjonalny tekst do wprowadzenia do dialogu",
          placeholder: "WprowadÅº tekst promptu (opcjonalnie)",
        },
      },
    },

    response: {
      success: "Operacja obsÅugi dialogu pomyÅlna",
      result: "Wynik obsÅugi dialogu",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas obsÅugi dialogu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnieÅ do wykonywania operacji obsÅugi dialogu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja obsÅugi dialogu jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas obsÅugi dialogu",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas obsÅugi dialogu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas obsÅugi dialogu",
      },
    },

    success: {
      title: "ObsÅuga dialogu pomyÅlna",
      description: "Dialog przeglÄdarki zostaÅ pomyÅlnie obsÅuÅ¼ony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      dialogAutomation: "Automatyzacja dialogÃ³w",
    },
  },
  hover: {
    title: "NajedÅº",
    titleShort: "NajedÅº",
    description:
      "NajedÅº na element po UID, aby pokazaÄ tooltip lub ukryte elementy sterujÄce.",
    dynamicTitle: "Hover: {{uid}}",

    form: {
      label: "NajedÅº na element",
      description: "PrzesuÅ kursor myszy nad element",
      fields: {
        uid: {
          label: "UID elementu",
          description: "UID elementu na stronie z migawki treÅci strony",
          placeholder: "WprowadÅº UID elementu",
        },
      },
    },

    response: {
      success: "Operacja najechania pomyÅlna",
      result: "Wynik operacji najechania",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas operacji najechania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do wykonywania operacji najechania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja najechania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji najechania",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas operacji najechania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas operacji najechania",
      },
    },

    success: {
      title: "Operacja najechania pomyÅlna",
      description: "Element zostaÅ pomyÅlnie najechany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "press-key": {
    title: "NaciÅnij klawisz",
    titleShort: "Klawisz",
    dynamicTitle: "Klawisz: {{key}}",
    description: "NaciÅnij klawisz lub kombinacjÄ klawiszy",
    form: {
      label: "NaciÅnij klawisz",
      description: "NaciÅnij klawisz lub kombinacjÄ klawiszy",
      fields: {
        key: {
          label: "Klawisz",
          description:
            "Klawisz lub kombinacja (np. Enter, Control+A, Control+Shift+R)",
          placeholder: "WprowadÅº klawisz lub kombinacjÄ",
        },
      },
    },
    response: {
      success: "Operacja naciÅniÄcia klawisza pomyÅlna",
      result: "Wynik operacji naciÅniÄcia klawisza",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas operacji naciÅniÄcia klawisza",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnieÅ do wykonywania operacji naciÅniÄcia klawisza",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja naciÅniÄcia klawisza jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji naciÅniÄcia klawisza",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas operacji naciÅniÄcia klawisza",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas operacji naciÅniÄcia klawisza",
      },
    },
    success: {
      title: "Operacja naciÅniÄcia klawisza pomyÅlna",
      description: "Klawisz zostaÅ pomyÅlnie naciÅniÄty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "upload-file": {
    title: "PrzeÅlij plik",
    titleShort: "PrzeÅlij",
    dynamicTitle: "Upload: {{file}}",
    description: "PrzeÅlij plik przez podany element",
    form: {
      label: "PrzeÅlij plik",
      description: "PrzeÅlij plik do elementu wejÅcia pliku",
      fields: {
        uid: {
          label: "UID elementu",
          description:
            "UID elementu wejÅcia pliku lub elementu, ktÃ³ry otworzy wybÃ³r pliku",
          placeholder: "WprowadÅº UID elementu",
        },
        filePath: {
          label: "ÅcieÅ¼ka pliku",
          description: "Lokalna ÅcieÅ¼ka pliku do przesÅania",
          placeholder: "WprowadÅº ÅcieÅ¼kÄ pliku",
        },
      },
    },
    response: {
      success: "Operacja przesyÅania pliku pomyÅlna",
      result: "Wynik operacji przesyÅania pliku",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas operacji przesyÅania pliku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnieÅ do wykonywania operacji przesyÅania pliku",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja przesyÅania pliku jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji przesyÅania pliku",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas operacji przesyÅania pliku",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas operacji przesyÅania pliku",
      },
    },
    success: {
      title: "Operacja przesyÅania pliku pomyÅlna",
      description: "Plik zostaÅ pomyÅlnie przesÅany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      inputAutomation: "Automatyzacja wprowadzania",
    },
  },
  "list-pages": {
    title: "Lista stron",
    titleShort: "Strony",
    description:
      "Wylistuj wszystkie otwarte karty z URL-ami. KaÅ¼da sesja ma jednÄ kartÄ; new-page jÄ zastÄpuje.",
    form: {
      label: "Lista stron",
      description: "Pobierz wszystkie otwarte strony przeglÄdarki",
      fields: {},
    },
    response: {
      success: "Operacja listowania stron pomyÅlna",
      result: {
        title: "Wynik",
        description: "Wynik listowania stron",
        pages: {
          idx: "Indeks",
          title: "TytuÅ",
          url: "URL",
          active: "Aktywny",
        },
        totalCount: "ÅÄczna liczba",
      },
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas listowania stron",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do listowania stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja listowania stron jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas listowania stron",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas listowania stron",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas listowania stron",
      },
    },
    success: {
      title: "Strony pomyÅlnie wylistowane",
      description: "Otwarte strony zostaÅy pomyÅlnie wylistowane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  "navigate-page": {
    title: "Nawiguj stronÄ",
    titleShort: "Nawiguj",
    dynamicTitle: "Nawiguj: {{target}}",
    description:
      "Nawiguj stronÄ sesji do URL, wstecz, naprzÃ³d lub przeÅaduj. Preferuj nad new-page dla tej samej karty.",
    form: {
      label: "Nawiguj stronÄ",
      description:
        "Nawiguj aktualnie wybranÄ stronÄ do URL lub przez historiÄ",
      fields: {
        type: {
          label: "Typ nawigacji",
          description:
            "Nawiguj po URL, wstecz lub do przodu w historii, lub odÅwieÅ¼",
          placeholder: "Wybierz typ nawigacji",
          options: {
            url: "URL",
            back: "Wstecz",
            forward: "Do przodu",
            reload: "OdÅwieÅ¼",
          },
        },
        url: {
          label: "URL",
          description: "Docelowy URL (tylko dla type=url)",
          placeholder: "WprowadÅº URL",
        },
        ignoreCache: {
          label: "Ignoruj cache",
          description: "Czy ignorowaÄ cache podczas odÅwieÅ¼ania",
          placeholder: "Ignoruj cache",
        },
        timeout: {
          label: "Limit czasu",
          description:
            "Maksymalny czas oczekiwania w milisekundach (0 dla domyÅlnego)",
          placeholder: "WprowadÅº limit czasu",
        },
      },
    },
    response: {
      success: "Operacja nawigacji pomyÅlna",
      result: "Wynik nawigacji",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas nawigacji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do nawigacji stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja nawigacji strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description: "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas nawigacji",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas nawigacji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas nawigacji",
      },
    },
    success: {
      title: "Nawigacja pomyÅlna",
      description: "Strona zostaÅa pomyÅlnie znawigowana",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  "new-page": {
    title: "Nowa strona",
    titleShort: "Nowa strona",
    dynamicTitle: "Nowa strona: {{url}}",
    description:
      "OtwÃ³rz nowÄ kartÄ pod danym URL. Sesja przejmuje kartÄ â wszystkie kolejne wywoÅania dziaÅajÄ na niej.",
    form: {
      label: "Nowa strona",
      description: "UtwÃ³rz nowÄ stronÄ przeglÄdarki i zaÅaduj URL",
      fields: {
        url: {
          label: "URL",
          description: "URL do zaÅadowania na nowej stronie",
          placeholder: "WprowadÅº URL",
        },
        timeout: {
          label: "Limit czasu",
          description:
            "Maksymalny czas oczekiwania w milisekundach (0 dla domyÅlnego)",
          placeholder: "WprowadÅº limit czasu",
        },
      },
    },
    response: {
      success: "Operacja tworzenia nowej strony pomyÅlna",
      result: "Wynik tworzenia nowej strony",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas tworzenia nowej strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do tworzenia nowych stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja tworzenia nowej strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas tworzenia nowej strony",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas tworzenia nowej strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas tworzenia nowej strony",
      },
    },
    success: {
      title: "Nowa strona pomyÅlnie utworzona",
      description: "Nowa strona zostaÅa pomyÅlnie utworzona",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  "select-page": {
    title: "Wybierz stronÄ",
    titleShort: "Wybierz",
    dynamicTitle: "Wybierz: {{page}}",
    description:
      "PrzeÅÄcz sesjÄ na konkretnÄ stronÄ po indeksie. Indeks znajdziesz przez list-pages. Nie aktualizuje Åledzonej karty sesji.",
    form: {
      label: "Wybierz stronÄ",
      description: "Wybierz stronÄ wedÅug jej indeksu",
      fields: {
        pageIdx: {
          label: "Indeks strony",
          description:
            "Indeks strony do wybrania (wywoÅaj list_pages aby wylistowaÄ strony)",
          placeholder: "WprowadÅº indeks strony",
        },
      },
    },
    response: {
      success: "Operacja wyboru strony pomyÅlna",
      result: "Wynik wyboru strony",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas wybierania strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do wybierania stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja wyboru strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas wybierania strony",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas wybierania strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas wybierania strony",
      },
    },
    success: {
      title: "Strona pomyÅlnie wybrana",
      description: "Strona zostaÅa pomyÅlnie wybrana",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      navigationAutomation: "Automatyzacja nawigacji",
    },
  },
  emulate: {
    title: "Emuluj",
    titleShort: "Emuluj",
    description:
      "Emuluj warunki sieciowe (offline/3G/4G) lub throttling CPU na bieÅ¼Äcej stronie.",
    dynamicTitle: "Emuluj: {{config}}",
    form: {
      label: "Emuluj urzÄdzenie",
      description: "Emuluj warunki sieciowe i dÅawienie CPU",
      fields: {
        networkConditions: {
          label: "Warunki sieciowe",
          description:
            "Ogranicz sieÄ (ustaw na Brak emulacji aby wyÅÄczyÄ)",
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
          label: "WspÃ³Åczynnik dÅawienia CPU",
          description:
            "WspÃ³Åczynnik spowolnienia CPU (1 aby wyÅÄczyÄ, 1-20)",
          placeholder: "WprowadÅº wspÃ³Åczynnik dÅawienia",
        },
      },
    },
    response: {
      success: "Operacja emulacji pomyÅlna",
      result: "Wynik operacji emulacji",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas emulacji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do emulacji funkcji urzÄdzenia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja emulacji urzÄdzenia jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description: "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas emulacji",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas emulacji",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas emulacji",
      },
    },
    success: {
      title: "Emulacja pomyÅlna",
      description: "Funkcje urzÄdzenia zostaÅy pomyÅlnie zemulowane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      performanceAutomation: "Automatyzacja wydajnoÅci",
    },
  },
  "resize-page": {
    title: "ZmieÅ rozmiar strony",
    titleShort: "ZmieÅ rozmiar",
    dynamicTitle: "Rozmiar: {{width}}x{{height}}",
    description:
      "ZmieÅ rozmiar viewportu przeglÄdarki do podanych wymiarÃ³w w pikselach.",
    form: {
      label: "ZmieÅ rozmiar strony",
      description: "ZmieÅ rozmiar strony do okreÅlonych wymiarÃ³w",
      fields: {
        width: {
          label: "SzerokoÅÄ",
          description: "SzerokoÅÄ strony w pikselach",
          placeholder: "WprowadÅº szerokoÅÄ",
        },
        height: {
          label: "WysokoÅÄ",
          description: "WysokoÅÄ strony w pikselach",
          placeholder: "WprowadÅº wysokoÅÄ",
        },
      },
    },
    response: {
      success: "Operacja zmiany rozmiaru strony pomyÅlna",
      result: "Wynik operacji zmiany rozmiaru strony",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas zmiany rozmiaru strony",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do zmiany rozmiaru stron",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja zmiany rozmiaru strony jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas zmiany rozmiaru strony",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas zmiany rozmiaru strony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas zmiany rozmiaru strony",
      },
    },
    success: {
      title: "Rozmiar strony pomyÅlnie zmieniony",
      description: "Rozmiar strony zostaÅ pomyÅlnie zmieniony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      viewportAutomation: "Automatyzacja widoku",
    },
  },
  "evaluate-script": {
    title: "Oceniaj skrypt",
    titleShort: "Skrypt",
    description:
      "Uruchom JavaScript na stronie i zwrÃ³Ä wynik. Dla stanu, ktÃ³rego take-snapshot nie ujawnia.",
    dynamicTitle: "Skrypt: {{snippet}}",
    form: {
      label: "Oceniaj skrypt",
      description: "Wykonaj JavaScript na stronie przeglÄdarki",
      fields: {
        function: {
          label: "Funkcja",
          description: "Deklaracja funkcji JavaScript do wykonania",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Argumenty",
          description:
            "Opcjonalna lista argumentÃ³w (UID elementÃ³w) do przekazania do funkcji",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "UID elementu",
            description: "Unikalny identyfikator elementu na stronie",
          },
        },
      },
    },
    response: {
      success: "Operacja oceny skryptu pomyÅlna",
      result: {
        title: "Wynik",
        description: "Wynik oceny skryptu",
        executed: "Wykonano",
        result: "WartoÅÄ zwracana",
      },
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas oceny skryptu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do oceny skryptÃ³w",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja oceny skryptu jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas oceny skryptu",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas oceny skryptu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas oceny skryptu",
      },
    },
    success: {
      title: "Skrypt pomyÅlnie oceniony",
      description: "JavaScript zostaÅ pomyÅlnie wykonany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      scriptExecution: "Wykonywanie skryptÃ³w",
    },
  },
  "get-console-message": {
    title: "Pobierz wiadomoÅÄ konsoli",
    titleShort: "Konsola",
    description:
      "Pobierz peÅnÄ treÅÄ konkretnej wiadomoÅci konsoli po msgid z list-console-messages.",
    dynamicTitle: "Konsola #{{id}}",
    form: {
      label: "Pobierz wiadomoÅÄ konsoli",
      description: "Pobierz okreÅlonÄ wiadomoÅÄ konsoli",
      fields: {
        msgid: {
          label: "ID wiadomoÅci",
          description:
            "ID wiadomoÅci konsoli z wylistowanych wiadomoÅci konsoli",
          placeholder: "WprowadÅº ID wiadomoÅci",
        },
      },
    },
    response: {
      success: "Operacja pobierania wiadomoÅci konsoli pomyÅlna",
      result: "Wynik pobierania wiadomoÅci konsoli",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas pobierania wiadomoÅci konsoli",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do pobierania wiadomoÅci konsoli",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja pobierania wiadomoÅci konsoli jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas pobierania wiadomoÅci konsoli",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas pobierania wiadomoÅci konsoli",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas pobierania wiadomoÅci konsoli",
      },
    },
    success: {
      title: "WiadomoÅÄ konsoli pomyÅlnie pobrana",
      description: "WiadomoÅÄ konsoli zostaÅa pomyÅlnie pobrana",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      debugging: "Debugowanie",
    },
  },
  "list-console-messages": {
    title: "Lista wiadomoÅci konsoli",
    titleShort: "Logi konsoli",
    description:
      "Lista wiadomoÅci konsoli od ostatniej nawigacji. Filtruj po typie (error/warn/log). UÅ¼ywaj po akcjach, by wykryÄ bÅÄdy JS.",
    form: {
      label: "Lista wiadomoÅci konsoli",
      description:
        "Pobierz wszystkie wiadomoÅci konsoli ze strony przeglÄdarki",
      fields: {
        includePreservedMessages: {
          label: "UwzglÄdnij zachowane wiadomoÅci",
          description:
            "Ustaw na true, aby zwrÃ³ciÄ zachowane wiadomoÅci z ostatnich 3 nawigacji",
          placeholder: "false",
        },
        pageIdx: {
          label: "Indeks strony",
          description:
            "Numer strony do zwrÃ³cenia (0-based, pomiÅ dla pierwszej strony)",
          placeholder: "WprowadÅº indeks strony",
        },
        pageSize: {
          label: "Rozmiar strony",
          description:
            "Maksymalna liczba wiadomoÅci do zwrÃ³cenia (pomiÅ, aby zwrÃ³ciÄ wszystkie wiadomoÅci)",
          placeholder: "WprowadÅº rozmiar strony",
        },
        types: {
          label: "Typy wiadomoÅci",
          description:
            "Filtruj wiadomoÅci, aby zwracaÄ tylko wiadomoÅci okreÅlonych typÃ³w (pomiÅ dla wszystkich)",
          placeholder: "Wybierz typy wiadomoÅci",
          options: {
            log: "Log",
            debug: "Debug",
            info: "Info",
            error: "BÅÄd",
            warn: "OstrzeÅ¼enie",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Tabela",
            trace: "Trace",
            clear: "WyczyÅÄ",
            startGroup: "Rozpocznij grupÄ",
            startGroupCollapsed: "Rozpocznij grupÄ zwiniÄte",
            endGroup: "ZakoÅcz grupÄ",
            assert: "Assert",
            profile: "Profil",
            profileEnd: "Koniec profilu",
            count: "Licznik",
            timeEnd: "Koniec czasu",
            verbose: "SzczegÃ³Åowe",
            issue: "Problem",
          },
        },
      },
    },
    response: {
      success: "WiadomoÅci konsoli pobrane pomyÅlnie",
      result: {
        title: "Wynik",
        description: "Wynik listy wiadomoÅci konsoli",
        messages: {
          msgid: "ID wiadomoÅci",
          type: "Typ",
          text: "WiadomoÅÄ",
          timestamp: "Znacznik czasu",
        },
        totalCount: "ÅÄczna liczba",
      },
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas listowania wiadomoÅci konsoli",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do listowania wiadomoÅci konsoli",
      },
      forbidden: {
        title: "Zabronione",
        description: "Listowanie wiadomoÅci konsoli jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas listowania wiadomoÅci konsoli",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas listowania wiadomoÅci konsoli",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas listowania wiadomoÅci konsoli",
      },
    },
    success: {
      title: "WiadomoÅci konsoli pobrane pomyÅlnie",
      description: "WiadomoÅci konsoli zostaÅy pomyÅlnie pobrane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      debugging: "Debugowanie",
    },
  },
  "get-network-request": {
    title: "Pobierz Å¼Ädanie sieciowe",
    titleShort: "Å»Ädanie",
    description:
      "Pobierz peÅne szczegÃ³Åy (nagÅÃ³wki, body) Å¼Ädania po reqid z list-network-requests.",
    dynamicTitle: "SieÄ #{{id}}",
    form: {
      label: "Pobierz Å¼Ädanie sieciowe",
      description:
        "Pobierz okreÅlone Å¼Ädanie sieciowe lub aktualnie wybrane",
      fields: {
        reqid: {
          label: "ID Å¼Ädania",
          description:
            "Reqid Å¼Ädania sieciowego (pomiÅ, aby pobraÄ aktualnie wybrane Å¼Ädanie w DevTools)",
          placeholder: "WprowadÅº ID Å¼Ädania",
        },
        maxBodyLength: {
          label: "Maks. dÅugoÅÄ treÅci",
          description:
            "Maksymalna liczba znakÃ³w zwracanych z treÅci Å¼Ädania/odpowiedzi. Nadmiar jest obcinany z powiadomieniem.",
          placeholder: "np. 10000",
        },
      },
    },
    response: {
      success: "Å»Ädanie sieciowe pobrane pomyÅlnie",
      result: "Wynik pobierania Å¼Ädania sieciowego",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas pobierania Å¼Ädania sieciowego",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do pobierania Å¼ÄdaÅ sieciowych",
      },
      forbidden: {
        title: "Zabronione",
        description: "Pobieranie Å¼ÄdaÅ sieciowych jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas pobierania Å¼Ädania sieciowego",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas pobierania Å¼Ädania sieciowego",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas pobierania Å¼Ädania sieciowego",
      },
    },
    success: {
      title: "Å»Ädanie sieciowe pobrane pomyÅlnie",
      description: "Å»Ädanie sieciowe zostaÅo pomyÅlnie pobrane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      networkAnalysis: "Analiza sieci",
    },
  },
  "list-network-requests": {
    title: "Lista Å¼ÄdaÅ sieciowych",
    titleShort: "Logi sieci",
    description:
      "Lista Å¼ÄdaÅ sieciowych od ostatniej nawigacji. Filtruj po typie zasobu (fetch/xhr/doc). Do inspekcji wywoÅaÅ API.",
    form: {
      label: "Lista Å¼ÄdaÅ sieciowych",
      description:
        "Pobierz wszystkie Å¼Ädania sieciowe ze strony przeglÄdarki",
      fields: {
        includePreservedRequests: {
          label: "UwzglÄdnij zachowane Å¼Ädania",
          description:
            "Ustaw na true, aby zwrÃ³ciÄ zachowane Å¼Ädania z ostatnich 3 nawigacji",
          placeholder: "false",
        },
        pageIdx: {
          label: "Indeks strony",
          description:
            "Numer strony do zwrÃ³cenia (0-based, pomiÅ dla pierwszej strony)",
          placeholder: "WprowadÅº indeks strony",
        },
        pageSize: {
          label: "Rozmiar strony",
          description:
            "Maksymalna liczba Å¼ÄdaÅ do zwrÃ³cenia (pomiÅ, aby zwrÃ³ciÄ wszystkie Å¼Ädania)",
          placeholder: "WprowadÅº rozmiar strony",
        },
        resourceTypes: {
          label: "Typy zasobÃ³w",
          description:
            "Filtruj Å¼Ädania, aby zwracaÄ tylko Å¼Ädania okreÅlonych typÃ³w zasobÃ³w (pomiÅ dla wszystkich)",
          placeholder: "Wybierz typy zasobÃ³w",
          options: {
            document: "Dokument",
            stylesheet: "Arkusz stylÃ³w",
            image: "Obraz",
            media: "Media",
            font: "Czcionka",
            script: "Skrypt",
            texttrack: "ÅcieÅ¼ka tekstowa",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Prefetch",
            eventsource: "Å¹rÃ³dÅo zdarzeÅ",
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
      success: "Å»Ädania sieciowe pobrane pomyÅlnie",
      result: {
        title: "Wynik",
        description: "Wynik listy Å¼ÄdaÅ sieciowych",
        requests: {
          reqid: "ID Å¼Ädania",
          url: "URL",
          method: "Metoda",
          status: "Status",
          type: "Typ",
        },
        totalCount: "ÅÄczna liczba",
      },
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas listowania Å¼ÄdaÅ sieciowych",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do listowania Å¼ÄdaÅ sieciowych",
      },
      forbidden: {
        title: "Zabronione",
        description: "Listowanie Å¼ÄdaÅ sieciowych jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas listowania Å¼ÄdaÅ sieciowych",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas listowania Å¼ÄdaÅ sieciowych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas listowania Å¼ÄdaÅ sieciowych",
      },
    },
    success: {
      title: "Å»Ädania sieciowe pobrane pomyÅlnie",
      description: "Å»Ädania sieciowe zostaÅy pomyÅlnie pobrane",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      networkAnalysis: "Analiza sieci",
    },
  },
  "performance-analyze-insight": {
    title: "Analizuj insight wydajnoÅci",
    titleShort: "Analiza",
    description:
      "WejdÅº gÅÄbiej w konkretny insight z wyniku trace (np. DocumentLatency, LCPBreakdown). WywoÅaj po performance-stop-trace.",
    form: {
      label: "Analizuj insight wydajnoÅci",
      description:
        "Pobierz szczegÃ³Åowe informacje o okreÅlonym insightu wydajnoÅci",
      fields: {
        insightSetId: {
          label: "ID zestawu insightÃ³w",
          description:
            "ID okreÅlonego zestawu insightÃ³w (uÅ¼ywaj tylko ID podanych na liÅcie DostÄpne zestawy insightÃ³w)",
          placeholder: "WprowadÅº ID zestawu insightÃ³w",
        },
        insightName: {
          label: "Nazwa insightu",
          description:
            "Nazwa insightu, o ktÃ³rym chcesz uzyskaÄ wiÄcej informacji (np. DocumentLatency lub LCPBreakdown)",
          placeholder: "WprowadÅº nazwÄ insightu",
        },
      },
    },
    response: {
      success: "Insight wydajnoÅci przeanalizowany pomyÅlnie",
      result: "Wynik analizy insightu wydajnoÅci",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas analizowania insightu wydajnoÅci",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Nie masz uprawnieÅ do analizowania insightÃ³w wydajnoÅci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Analizowanie insightÃ³w wydajnoÅci jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas analizowania insightu wydajnoÅci",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas analizowania insightu wydajnoÅci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas analizowania insightu wydajnoÅci",
      },
    },
    success: {
      title: "Insight wydajnoÅci przeanalizowany pomyÅlnie",
      description: "Insight wydajnoÅci zostaÅ pomyÅlnie przeanalizowany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      performanceAutomation: "Automatyzacja wydajnoÅci",
    },
  },
  "performance-start-trace": {
    title: "Rozpocznij trace wydajnoÅci",
    titleShort: "Start Åladu",
    description:
      "Uruchom trace wydajnoÅci, aby przechwyciÄ Core Web Vitals i metryki Åadowania. NastÄpnie wywoÅaj performance-stop-trace.",
    form: {
      label: "Rozpocznij trace wydajnoÅci",
      description:
        "Rozpocznij nagrywanie metryk wydajnoÅci dla strony przeglÄdarki",
      fields: {
        reload: {
          label: "PrzeÅaduj stronÄ",
          description:
            "OkreÅla, czy po rozpoczÄciu Åledzenia strona powinna zostaÄ automatycznie przeÅadowana",
          placeholder: "true",
        },
        autoStop: {
          label: "Automatyczne zatrzymanie",
          description:
            "OkreÅla, czy nagrywanie trace powinno zostaÄ automatycznie zatrzymane",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Trace wydajnoÅci rozpoczÄty pomyÅlnie",
      result: "Wynik rozpoczÄcia trace wydajnoÅci",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas rozpoczynania trace wydajnoÅci",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do rozpoczynania trace wydajnoÅci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Rozpoczynanie trace wydajnoÅci jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas rozpoczynania trace wydajnoÅci",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas rozpoczynania trace wydajnoÅci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas rozpoczynania trace wydajnoÅci",
      },
    },
    success: {
      title: "Trace wydajnoÅci rozpoczÄty pomyÅlnie",
      description: "Trace wydajnoÅci zostaÅ pomyÅlnie rozpoczÄty",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      performanceAutomation: "Automatyzacja wydajnoÅci",
    },
  },
  "performance-stop-trace": {
    title: "Zatrzymaj trace wydajnoÅci",
    titleShort: "Stop Åladu",
    description:
      "Zatrzymaj aktywny trace i zwrÃ³Ä metryki wydajnoÅci z ID zestawÃ³w insightÃ³w dla performance-analyze-insight.",
    form: {
      label: "Zatrzymaj trace wydajnoÅci",
      description: "Zatrzymaj aktywne nagrywanie trace wydajnoÅci",
      fields: {},
    },
    response: {
      success: "Trace wydajnoÅci zatrzymany pomyÅlnie",
      result: "Wynik zatrzymania trace wydajnoÅci z metrykami",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas zatrzymywania trace wydajnoÅci",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do zatrzymywania trace wydajnoÅci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Zatrzymywanie trace wydajnoÅci jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas zatrzymywania trace wydajnoÅci",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas zatrzymywania trace wydajnoÅci",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas zatrzymywania trace wydajnoÅci",
      },
    },
    success: {
      title: "Trace wydajnoÅci zatrzymany pomyÅlnie",
      description: "Trace wydajnoÅci zostaÅ pomyÅlnie zatrzymany",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      performanceAutomation: "Automatyzacja wydajnoÅci",
    },
  },
  "take-screenshot": {
    title: "ZrÃ³b zrzut ekranu",
    titleShort: "Zrzut ekranu",
    dynamicTitle: "Zrzut: {{target}}",
    description:
      "ZrÃ³b wizualny zrzut ekranu strony lub elementu. Zwraca obraz. Do weryfikacji stanu UI.",
    form: {
      label: "ZrÃ³b zrzut ekranu",
      description: "PrzechwyÄ zrzut ekranu strony przeglÄdarki lub elementu",
      fields: {
        uid: {
          label: "UID elementu",
          description:
            "UID elementu do zrzutu ekranu (pomiÅ, aby zrobiÄ zrzut ekranu caÅej strony)",
          placeholder: "WprowadÅº UID elementu",
        },
        fullPage: {
          label: "CaÅa strona",
          description:
            "JeÅli ustawiono na true, zrobi zrzut ekranu caÅej strony zamiast aktualnie widocznego obszaru (niekompatybilne z uid)",
          placeholder: "false",
        },
        format: {
          label: "Format",
          description:
            "Typ formatu do zapisania zrzutu ekranu (domyÅlnie: png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "JakoÅÄ",
          description:
            "JakoÅÄ kompresji dla formatÃ³w JPEG i WebP (0-100). WyÅ¼sze wartoÅci oznaczajÄ lepszÄ jakoÅÄ, ale wiÄksze rozmiary plikÃ³w. Ignorowane dla formatu PNG.",
          placeholder: "80",
        },
        filePath: {
          label: "ÅcieÅ¼ka pliku",
          description:
            "ÅcieÅ¼ka bezwzglÄdna lub wzglÄdna do bieÅ¼Äcego katalogu roboczego, aby zapisaÄ zrzut ekranu zamiast doÅÄczaÄ go do odpowiedzi",
          placeholder: "/ÅcieÅ¼ka/do/zrzutu-ekranu.png",
        },
      },
    },
    response: {
      success: "Zrzut ekranu przechwycony pomyÅlnie",
      result: "Wynik przechwytywania zrzutu ekranu",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description:
          "WystÄpiÅ bÅÄd sieci podczas przechwytywania zrzutu ekranu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do przechwytywania zrzutÃ³w ekranu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przechwytywanie zrzutÃ³w ekranu jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas przechwytywania zrzutu ekranu",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas przechwytywania zrzutu ekranu",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description:
          "WystÄpiÅ konflikt podczas przechwytywania zrzutu ekranu",
      },
    },
    success: {
      title: "Zrzut ekranu przechwycony pomyÅlnie",
      description: "Zrzut ekranu zostaÅ pomyÅlnie przechwycony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      captureAutomation: "Automatyzacja przechwytywania",
    },
  },
  "take-snapshot": {
    title: "ZrÃ³b snapshot",
    titleShort: "Migawka",
    description:
      "Pobierz drzewo a11y strony jako tekst. Wymagane przed click/fill/drag â dostarcza UID-Ã³w elementÃ³w.",
    form: {
      label: "ZrÃ³b snapshot",
      description:
        "PrzechwyÄ tekstowy snapshot strony przeglÄdarki na podstawie drzewa a11y",
      fields: {
        verbose: {
          label: "SzczegÃ³Åowy",
          description:
            "Czy doÅÄczyÄ wszystkie dostÄpne informacje w peÅnym drzewie a11y (domyÅlnie: false)",
          placeholder: "false",
        },
        filePath: {
          label: "ÅcieÅ¼ka pliku",
          description:
            "ÅcieÅ¼ka bezwzglÄdna lub wzglÄdna do bieÅ¼Äcego katalogu roboczego, aby zapisaÄ snapshot zamiast doÅÄczaÄ go do odpowiedzi",
          placeholder: "/ÅcieÅ¼ka/do/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snapshot przechwycony pomyÅlnie",
      result: "Wynik przechwytywania snapshot",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },
    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas przechwytywania snapshot",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do przechwytywania snapshot",
      },
      forbidden: {
        title: "Zabronione",
        description: "Przechwytywanie snapshot jest zabronione",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas przechwytywania snapshot",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description:
          "WystÄpiÅ nieznany bÅÄd podczas przechwytywania snapshot",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas przechwytywania snapshot",
      },
    },
    success: {
      title: "Snapshot przechwycony pomyÅlnie",
      description: "Snapshot zostaÅ pomyÅlnie przechwycony",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      captureAutomation: "Automatyzacja przechwytywania",
    },
  },
  "wait-for": {
    title: "Poczekaj na",
    titleShort: "Czekaj",
    dynamicTitle: "Czekaj: {{text}}",
    description:
      "Poczekaj, aÅ¼ dany tekst pojawi siÄ na stronie. UÅ¼ywaj po nawigacji lub akcjach asynchronicznych.",

    form: {
      label: "Poczekaj na tekst",
      description: "Poczekaj, aÅ¼ okreÅlony tekst pojawi siÄ na stronie",
      fields: {
        text: {
          label: "Tekst",
          description: "Tekst, ktÃ³ry ma pojawiÄ siÄ na stronie",
          placeholder: "WprowadÅº tekst, na ktÃ³ry czekaÄ",
        },
        timeout: {
          label: "Limit czasu",
          description:
            "Maksymalny czas oczekiwania w milisekundach. JeÅli ustawione na 0, zostanie uÅ¼yty domyÅlny limit",
          placeholder: "WprowadÅº limit czasu (ms)",
        },
        captureSnapshot: {
          label: "PrzechwyÄ snapshot",
          description:
            "Gdy wÅÄczone, doÅÄcza peÅny snapshot dostÄpnoÅci do odpowiedzi. DomyÅlnie wyÅÄczone.",
        },
      },
    },

    response: {
      success: "Operacja oczekiwania pomyÅlna",
      result: "Wynik operacji oczekiwania",
      error: "Komunikat bÅÄdu",
      executionId: "ID wykonania do Åledzenia",
    },

    errors: {
      validation: {
        title: "BÅÄd walidacji",
        description: "SprawdÅº wprowadzone dane i sprÃ³buj ponownie",
      },
      network: {
        title: "BÅÄd sieci",
        description: "WystÄpiÅ bÅÄd sieci podczas operacji oczekiwania",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnieÅ do wykonywania operacji oczekiwania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Operacja oczekiwania jest zabroniona",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Å»Ädany zasÃ³b nie zostaÅ znaleziony",
      },
      serverError: {
        title: "BÅÄd serwera",
        description:
          "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas operacji oczekiwania",
      },
      unknown: {
        title: "Nieznany bÅÄd",
        description: "WystÄpiÅ nieznany bÅÄd podczas operacji oczekiwania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
      },
      conflict: {
        title: "Konflikt",
        description: "WystÄpiÅ konflikt podczas operacji oczekiwania",
      },
    },

    success: {
      title: "Operacja oczekiwania pomyÅlna",
      description: "OkreÅlony tekst pojawiÅ siÄ na stronie",
    },
    category: "Browser",
    tags: {
      browserAutomation: "Automatyzacja przeglÄdarki",
      waitAutomation: "Automatyzacja oczekiwania",
    },
  },
  title: "Chrome DevTools MCP Tools",
  description:
    "Automatyzacja przeglÄdarki przez Chrome DevTools. PrzepÅyw: new-page â take-snapshot â interakcja (click/fill) â weryfikacja.",
  category: "Core API",
  summary:
    "DostÄp do narzÄdzi Chrome DevTools Protocol przez MCP dla automatyzacji webowej",
  tags: {
    browserAutomation: "Automatyzacja przeglÄdarki",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "NarzÄdzia MCP",
    webDebugging: "Debugowanie webowe",
    performanceAnalysis: "Analiza wydajnoÅci",
    inputAutomation: "Automatyzacja wprowadzania",
    captureAutomation: "Automatyzacja przechwytywania",
    debugging: "Debugowanie",
    dialogAutomation: "Automatyzacja dialogÃ³w",
    navigationAutomation: "Automatyzacja nawigacji",
    networkAnalysis: "Analiza sieci",
    performanceAutomation: "Automatyzacja wydajnoÅci",
    scriptExecution: "Wykonywanie skryptÃ³w",
    viewportAutomation: "Automatyzacja widoku",
    waitAutomation: "Automatyzacja oczekiwania",
  },

  form: {
    label: "Wykonanie narzÄdzia przeglÄdarki",
    description:
      "Wykonaj narzÄdzia Chrome DevTools MCP dla sterowania przeglÄdarkÄ i analizy",
    fields: {
      tool: {
        label: "NarzÄdzie",
        description: "Wybierz narzÄdzie Chrome DevTools MCP do wykonania",
        placeholder: "Wybierz narzÄdzie...",
      },
      arguments: {
        label: "Argumenty",
        description: "Argumenty JSON dla wybranego narzÄdzia (opcjonalne)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Kliknij element",
    drag: "PrzeciÄgnij element",
    fill: "WypeÅnij pole wejÅciowe",
    fillForm: "WypeÅnij formularz",
    handleDialog: "ObsÅuÅ¼ dialog",
    hover: "NajedÅº na element",
    pressKey: "NaciÅnij klawisz",
    uploadFile: "PrzeÅlij plik",

    // Navigation automation tools (6)
    closePage: "Zamknij stronÄ",
    listPages: "Lista stron",
    navigatePage: "Nawiguj stronÄ",
    newPage: "Nowa strona",
    selectPage: "Wybierz stronÄ",
    waitFor: "Czekaj na",

    // Emulation tools (2)
    emulate: "Emuluj urzÄdzenie",
    resizePage: "ZmieÅ rozmiar strony",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analizuj insight wydajnoÅci",
    performanceStartTrace: "Rozpocznij trace wydajnoÅci",
    performanceStopTrace: "Zatrzymaj trace wydajnoÅci",

    // Network tools (2)
    getNetworkRequest: "Pobierz Å¼Ädanie sieciowe",
    listNetworkRequests: "Lista Å¼ÄdaÅ sieciowych",

    // Debugging tools (5)
    evaluateScript: "Oceniaj skrypt",
    getConsoleMessage: "Pobierz wiadomoÅÄ konsoli",
    listConsoleMessages: "Lista wiadomoÅci konsoli",
    takeScreenshot: "ZrÃ³b zrzut ekranu",
    takeSnapshot: "ZrÃ³b snapshot",
  },

  status: {
    pending: "OczekujÄcy",
    running: "Uruchomiony",
    completed: "UkoÅczony",
    failed: "Niepowodzenie",
  },

  response: {
    success: "NarzÄdzie wykonane pomyÅlnie",
    result: "Wynik wykonania",
    status: "Aktualny status wykonania",
    statusItem: "Status item",
    executionId: "ID wykonania do Åledzenia",
  },

  examples: {
    requests: {
      navigate: {
        title: "Nawiguj do URL",
        description: "Nawiguj przeglÄdarkÄ do okreÅlonego URL",
      },
      screenshot: {
        title: "ZrÃ³b zrzut ekranu",
        description: "ZrÃ³b zrzut ekranu aktualnej strony",
      },
      click: {
        title: "Kliknij element",
        description: "Kliknij na okreÅlony element",
      },
      performance: {
        title: "Rozpocznij trace wydajnoÅci",
        description: "Rozpocznij nagrywanie metryk wydajnoÅci",
      },
      script: {
        title: "Oceniaj skrypt",
        description: "Wykonaj JavaScript w przeglÄdarce",
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
        title: "Wynik klikniÄcia",
        description: "Wynik klikniÄcia elementu",
      },
      performance: {
        title: "Trace wydajnoÅci rozpoczÄty",
        description: "Åledzenie wydajnoÅci zainicjowane",
      },
      script: {
        title: "Wynik oceny skryptu",
        description: "Wynik wykonania JavaScript",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Wykonanie narzÄdzia nie powiodÅo siÄ",
      description: "Wybrane narzÄdzie nie mogÅo zostaÄ wykonane pomyÅlnie",
    },
    invalidArguments: {
      title: "NieprawidÅowe argumenty",
      description: "Podane argumenty sÄ nieprawidÅowe dla tego narzÄdzia",
    },
    browserNotAvailable: {
      title: "PrzeglÄdarka niedostÄpna",
      description: "Instancja przeglÄdarki Chrome jest niedostÄpna",
    },
    toolNotFound: {
      title: "NarzÄdzie nie znalezione",
      description: "Å»Ädane narzÄdzie jest niedostÄpne",
    },
    validation: {
      title: "BÅÄd walidacji",
      description: "SprawdÅº swoje dane wejÅciowe i sprÃ³buj ponownie",
      toolRequired: "Wymagany jest wybÃ³r narzÄdzia",
      argumentsInvalid: "Argumenty muszÄ byÄ prawidÅowym JSON",
    },
    network: {
      title: "BÅÄd sieci",
      description: "WystÄpiÅ bÅÄd sieci podczas wykonywania narzÄdzia",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnieÅ do wykonywania narzÄdzi przeglÄdarki",
    },
    forbidden: {
      title: "Zabronione",
      description: "Wykonywanie narzÄdzi przeglÄdarki jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Å»Ädane narzÄdzie przeglÄdarki nie zostaÅo znalezione",
    },
    serverError: {
      title: "BÅÄd serwera",
      description:
        "WystÄpiÅ wewnÄtrzny bÅÄd serwera podczas wykonywania narzÄdzia",
    },
    unknown: {
      title: "Nieznany bÅÄd",
      description: "WystÄpiÅ nieznany bÅÄd podczas wykonywania narzÄdzia",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, ktÃ³re mogÄ zostaÄ utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "WystÄpiÅ konflikt podczas wykonywania narzÄdzia",
    },
  },

  success: {
    title: "NarzÄdzie wykonane pomyÅlnie",
    description: "NarzÄdzie przeglÄdarki zostaÅo wykonane pomyÅlnie",
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
      start: "Rozpoczynam wykonywanie narzÄdzia przeglÄdarki",
      success: "NarzÄdzie przeglÄdarki wykonane pomyÅlnie",
      error: "BÅÄd podczas wykonywania narzÄdzia przeglÄdarki",
    },
    mcp: {
      connect: {
        start: "ÅÄczenie z serwerem Chrome DevTools MCP",
        success: "PomyÅlnie poÅÄczono z serwerem MCP",
        error: "BÅÄd podczas ÅÄczenia z serwerem MCP",
        failedToInitialize:
          "Nie udaÅo siÄ zainicjowaÄ serwera Chrome DevTools MCP",
      },
      tool: {
        call: {
          start: "WywoÅujÄ narzÄdzie MCP",
          success: "NarzÄdzie MCP wywoÅane pomyÅlnie",
          error: "BÅÄd podczas wywoÅywania narzÄdzia MCP",
          invalidJsonArguments: "NieprawidÅowe argumenty JSON",
          executionFailed: "Wykonanie narzÄdzia nie powiodÅo siÄ: {{error}}",
          toolExecutionFailed: "Nie udaÅo siÄ wykonaÄ {{toolName}}",
        },
      },
    },
  },
};
