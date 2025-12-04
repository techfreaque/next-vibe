import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Naciśnij klawisz",
  description: "Naciśnij klawisz lub kombinację klawiszy",
  form: {
    label: "Naciśnij klawisz",
    description: "Naciśnij klawisz lub kombinację klawiszy",
    fields: {
      key: {
        label: "Klawisz",
        description: "Klawisz lub kombinacja (np. Enter, Control+A, Control+Shift+R)",
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
    validation: { title: "Błąd walidacji", description: "Sprawdź wprowadzone dane i spróbuj ponownie" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci podczas operacji naciśnięcia klawisza" },
    unauthorized: { title: "Nieautoryzowany", description: "Nie masz uprawnień do wykonywania operacji naciśnięcia klawisza" },
    forbidden: { title: "Zabronione", description: "Operacja naciśnięcia klawisza jest zabroniona" },
    notFound: { title: "Nie znaleziono", description: "Żądany zasób nie został znaleziony" },
    serverError: { title: "Błąd serwera", description: "Wystąpił wewnętrzny błąd serwera podczas operacji naciśnięcia klawisza" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd podczas operacji naciśnięcia klawisza" },
    unsavedChanges: { title: "Niezapisane zmiany", description: "Masz niezapisane zmiany, które mogą zostać utracone" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt podczas operacji naciśnięcia klawisza" },
  },
  success: {
    title: "Operacja naciśnięcia klawisza pomyślna",
    description: "Klawisz został pomyślnie naciśnięty",
  },
};
