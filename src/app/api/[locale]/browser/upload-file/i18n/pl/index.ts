import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Prześlij plik",
  description: "Prześlij plik przez podany element",
  form: {
    label: "Prześlij plik",
    description: "Prześlij plik do elementu wejścia pliku",
    fields: {
      uid: {
        label: "UID elementu",
        description: "UID elementu wejścia pliku lub elementu, który otworzy wybór pliku",
        placeholder: "Wprowadź UID elementu",
      },
      filePath: {
        label: "Ścieżka pliku",
        description: "Lokalna ścieżka pliku do przesłania",
        placeholder: "Wprowadź ścieżkę pliku",
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
    validation: { title: "Błąd walidacji", description: "Sprawdź wprowadzone dane i spróbuj ponownie" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci podczas operacji przesyłania pliku" },
    unauthorized: { title: "Nieautoryzowany", description: "Nie masz uprawnień do wykonywania operacji przesyłania pliku" },
    forbidden: { title: "Zabronione", description: "Operacja przesyłania pliku jest zabroniona" },
    notFound: { title: "Nie znaleziono", description: "Żądany zasób nie został znaleziony" },
    serverError: { title: "Błąd serwera", description: "Wystąpił wewnętrzny błąd serwera podczas operacji przesyłania pliku" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd podczas operacji przesyłania pliku" },
    unsavedChanges: { title: "Niezapisane zmiany", description: "Masz niezapisane zmiany, które mogą zostać utracone" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt podczas operacji przesyłania pliku" },
  },
  success: {
    title: "Operacja przesyłania pliku pomyślna",
    description: "Plik został pomyślnie przesłany",
  },
};
