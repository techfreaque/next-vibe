import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  overview: {
    description: "Wyświetl i podgląd szablonów e-mail",
    template: "szablon",
    templates: "szablony",
    version: "Wersja",
    id: "ID",
    view_preview: "Wyświetl podgląd",
    total: "Wszystkie szablony",
  },
  preview: {
    back_to_templates: "Powrót do szablonów",
    previous: "Poprzedni szablon",
    next: "Następny szablon",
    id: "ID szablonu",
    version: "Wersja",
    category: "Kategoria",
    path: "Ścieżka szablonu",
    send_test: "Wyślij testową wiadomość e-mail",
    loading: "Ładowanie podglądu...",
    error_loading: "Nie udało się załadować podglądu wiadomości e-mail",
  },
  test: {
    title: "Test E-mail",
    description: "Wyślij testową wiadomość e-mail, aby zweryfikować szablon",
    recipient: "E-mail odbiorcy",
    template: "Szablon",
    success: "Testowa wiadomość e-mail została wysłana pomyślnie",
    send: "Wyślij testową wiadomość e-mail",
    sending: "Wysyłanie...",
  },
};
