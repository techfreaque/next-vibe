import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zatrzymaj trace wydajności",
  description: "Zatrzymuje aktywne nagrywanie trace wydajności na wybranej stronie i zwraca metryki wydajności",
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
    validation: { title: "Błąd walidacji", description: "Sprawdź wprowadzone dane i spróbuj ponownie" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci podczas zatrzymywania trace wydajności" },
    unauthorized: { title: "Nieautoryzowany", description: "Nie masz uprawnień do zatrzymywania trace wydajności" },
    forbidden: { title: "Zabronione", description: "Zatrzymywanie trace wydajności jest zabronione" },
    notFound: { title: "Nie znaleziono", description: "Żądany zasób nie został znaleziony" },
    serverError: { title: "Błąd serwera", description: "Wystąpił wewnętrzny błąd serwera podczas zatrzymywania trace wydajności" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd podczas zatrzymywania trace wydajności" },
    unsavedChanges: { title: "Niezapisane zmiany", description: "Masz niezapisane zmiany, które mogą zostać utracone" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt podczas zatrzymywania trace wydajności" },
  },
  success: {
    title: "Trace wydajności zatrzymany pomyślnie",
    description: "Trace wydajności został pomyślnie zatrzymany",
  },
};
