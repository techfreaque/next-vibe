import type { fieldsTranslations as EnglishFieldsTranslations } from "../../../../../../en/sections/templateApiImport/templateApi/import/form/fields";

export const fieldsTranslations: typeof EnglishFieldsTranslations = {
  format: {
    label: "Format Importu",
    placeholder: "Wybierz format importu",
    description: "Wybierz format swoich danych importu",
    options: {
      csv: "CSV (Wartości Oddzielone Przecinkami)",
      json: "JSON (JavaScript Object Notation)",
      xml: "XML (Extensible Markup Language)",
    },
  },
  mode: {
    label: "Tryb Importu",
    placeholder: "Wybierz tryb importu",
    description: "Wybierz sposób obsługi istniejących szablonów",
    options: {
      createonly: "Tylko tworzenie - Pomiń istniejące szablony",
      updateonly: "Tylko aktualizacja - Aktualizuj tylko istniejące szablony",
      createorupdate:
        "Twórz lub aktualizuj - Twórz nowe i aktualizuj istniejące",
    },
  },
  data: {
    label: "Dane Importu",
    placeholder: "Wklej tutaj swoje dane CSV, JSON lub XML...",
    description: "Dane szablonów do importu",
    help: "Upewnij się, że twoje dane są zgodne z poprawnym formatem dla wybranego typu importu",
  },
  validateOnly: {
    label: "Tylko Walidacja",
    description: "Tylko zwaliduj dane bez importowania",
    help: "Użyj tego do sprawdzenia formatu danych przed wykonaniem rzeczywistego importu",
  },
  skipErrors: {
    label: "Pomiń Błędy",
    description:
      "Kontynuuj przetwarzanie nawet jeśli niektóre wiersze mają błędy",
    help: "Gdy włączone, wiersze z błędami zostaną pominięte a import będzie kontynuowany",
  },
  defaultStatus: {
    label: "Domyślny Status",
    placeholder: "Wybierz domyślny status",
    description: "Domyślny status dla importowanych szablonów",
    options: {
      draft: "Szkic",
      published: "Opublikowany",
      archived: "Zarchiwizowany",
    },
  },
};
