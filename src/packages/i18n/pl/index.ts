import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  nextVibeUi: {
    web: {
      common: {
        accessibility: {
          srOnly: {
            more: "Więcej",
            previousSlide: "Poprzedni slajd",
            nextSlide: "Następny slajd",
            previousPage: "Poprzednia strona",
            nextPage: "Następna strona",
            close: "Zamknij",
            toggleMenu: "Przełącz menu",
          },
        },
        actions: {
          previous: "Poprzedni",
          next: "Następny",
        },
        customValue: "Niestandardowy",
        noOptionsFound: "Nie znaleziono opcji",
        useCustomValue: "Użyj '{{value}}'",
        addTags: "Dodaj tagi",
        addCustomValue: "Dodaj '{{value}}'",
        required: "Wymagane",
        enterPhoneNumber: "Wprowadź numer telefonu",
        unknownFieldType: "Nieznany typ pola",
        selectDate: "Wybierz datę",
        other: "Inne",
        searchCountries: "Wyszukaj kraje...",
        noCountryFound: "Nie znaleziono kraju",
        preferred: "Preferowane",
        allCountries: "Wszystkie kraje",
      },
      ui: {
        markdown: {
          thinking: "Myślenie",
          reasoningProcess: "Proces rozumowania",
          streaming: "(strumieniowanie...)",
          copied: "Skopiowano!",
          copy: "Kopiuj",
          copyCode: "Kopiuj kod",
        },
        multiSelect: {
          placeholder: "Wybierz elementy...",
          noResultsFound: "Nie znaleziono wyników",
        },
        iconPicker: {
          selectIcon: "Wybierz ikonę",
          title: "Wybierz ikonę",
          searchPlaceholder: "Szukaj ikon...",
          showing: "Pokazuję {{count}} ikon",
          categories: {
            all: "Wszystkie ikony",
            general: "Ogólne",
            ai: "AI i Technologia",
            education: "Edukacja",
            communication: "Komunikacja",
            science: "Nauka",
            arts: "Sztuka i Media",
            finance: "Finanse",
            lifestyle: "Styl życia",
            security: "Bezpieczeństwo",
            programming: "Programowanie",
            platforms: "Platformy",
            aiProviders: "Dostawcy AI",
            media: "Media",
            special: "Specjalne",
            navigation: "Nawigacja",
            ui: "Elementy UI",
          },
        },
      },
    },
    native: {
      ui: {
        autocompleteField: {
          custom: "Niestandardowy",
          noOptionsFound: "Nie znaleziono opcji",
          use: "Użyj {{value}}",
        },
        breadcrumb: {
          navigation: "nawigacja breadcrumb",
        },
        calendar: {
          stubWarning: "Używanie zaślepki: Calendar",
          stubLabel: "Calendar (zaślepka)",
        },
        carousel: {
          stubWarning: "Używanie zaślepki: Carousel",
          stubLabel: "Carousel (zaślepka)",
        },
        chart: {
          stubWarning: "Używanie zaślepki: Chart",
          stubLabel: "Chart (zaślepka)",
        },
        checkbox: {},
        collapsible: {},
        command: {
          stubWarning: "Używanie zaślepki: Command",
          stubLabel: "Command (zaślepka)",
        },
        container: {
          stubWarning: "Używanie zaślepki: Container",
          stubLabel: "Container (zaślepka)",
        },
        drawer: {
          stubWarning: "Używanie zaślepki: Drawer",
          stubLabel: "Drawer (zaślepka)",
        },
        dropdownItem: {
          stubWarning: "Używanie zaślepki: DropdownItem",
          stubLabel: "DropdownItem (zaślepka)",
        },
        form: {
          useFormFieldError:
            "useFormField powinno być używane wewnątrz <FormField>",
          endpointFormField: {
            stubWarning: "Używanie zaślepki: EndpointFormField",
            stubLabel: "EndpointFormField (zaślepka)",
          },
          formAlert: {
            stubWarning: "Używanie zaślepki: FormAlert",
            stubLabel: "FormAlert (zaślepka)",
          },
          formSection: {
            stubWarning: "Używanie zaślepki: FormSection",
            stubLabel: "FormSection (zaślepka)",
          },
          formStub: {
            stubWarning: "Używanie zaślepki: Form",
            stubLabel: "Form (zaślepka formularza)",
          },
        },
        inputOtp: {
          stubWarning: "Używanie zaślepki: InputOtp",
          stubLabel: "InputOtp (zaślepka)",
        },
        markdown: {
          stubWarning: "Używanie zaślepki: Markdown",
          stubLabel: "Markdown (zaślepka)",
        },
        menubar: {
          toggleGroupError:
            "Komponenty złożone ToggleGroup nie mogą być renderowane poza komponentem ToggleGroup",
        },
        pagination: {
          stubWarning: "Używanie zaślepki: Pagination",
          stubLabel: "Pagination (zaślepka)",
        },
        phoneField: {
          preferred: "Preferowany",
          allCountries: "Wszystkie kraje",
        },
        resizable: {
          stubWarning: "Używanie zaślepki: Resizable",
          stubLabel: "Resizable (zaślepka)",
        },
        scrollArea: {
          stubWarning: "Używanie zaślepki: ScrollArea",
          stubLabel: "ScrollArea (zaślepka)",
        },
        sheet: {
          stubWarning: "Używanie zaślepki: Sheet",
          stubLabel: "Sheet (zaślepka)",
        },
        sidebar: {
          stubWarning: "Używanie zaślepki: Sidebar",
          stubLabel: "Sidebar (zaślepka)",
        },
        slider: {
          stubWarning: "Używanie zaślepki: Slider",
          stubLabel: "Slider (zaślepka)",
        },
        sonner: {
          stubWarning: "Używanie zaślepki: Sonner",
          stubLabel: "Sonner (zaślepka)",
        },
        storage: {
          errorGetting: "Błąd pobierania z pamięci:",
          errorSetting: "Błąd ustawiania pamięci:",
          errorRemoving: "Błąd usuwania z pamięci:",
        },
        tabsStub: {
          stubWarning: "Używanie zaślepki: Tabs",
        },
        tagsField: {
          stubWarning: "Używanie zaślepki: TagsField",
          stubLabel: "TagsField (zaślepka)",
        },
        themeProvider: {
          stubWarning: "Używanie zaślepki: ThemeProvider",
          stubLabel: "ThemeProvider (zaślepka)",
        },
        title: {
          stubWarning: "Używanie zaślepki: Title",
          stubLabel: "Title (zaślepka)",
        },
        toast: {
          stubWarning: "Używanie zaślepki: Toast",
          stubLabel: "Toast (zaślepka)",
        },
        toaster: {
          stubWarning: "Używanie zaślepki: Toaster",
          stubLabel: "Toaster (zaślepka)",
        },
        toggleGroup: {
          toggleGroupError:
            "Komponenty złożone ToggleGroup nie mogą być renderowane poza komponentem ToggleGroup",
        },
        useMobile: {
          stubWarning: "Używanie zaślepki: UseMobile",
          stubLabel: "UseMobile (zaślepka)",
        },
        useToast: {
          stubWarning: "Używanie zaślepki: useToast",
        },
      },
    },
  },
};
