import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  get: {
    title: "Eksportuj moje dane",
    titleShort: "Eksport danych",
    description:
      "Pobierz wszystko, co o Tobie przechowujemy: profil, czaty, wspomnienia, skille, kredyty, polecenia, newsletter, adresy. JSON plus czytelne podsumowanie.",
    tags: { export: "Eksport danych" },
    response: {
      json: { title: "Pełne dane (JSON)" },
      jsonFilename: { title: "Nazwa pliku JSON" },
      markdown: { title: "Podsumowanie (Markdown)" },
      markdownFilename: { title: "Nazwa pliku podsumowania" },
    },
    success: {
      title: "Eksport gotowy",
      description: "Archiwum Twoich danych zostało wygenerowane",
    },
    md: {
      heading: "Eksport Twoich danych",
      generated: "Wygenerowano",
      account: "Konto",
      email: "E-mail",
      name: "Nazwa",
      memberSince: "Członek od",
      contents: "Zawartość",
      records: "rekordów",
      note: "Pełne szczegóły są w pliku JSON. Eksport zawiera tylko dane powiązane z Twoim kontem.",
    },
    widget: {
      intro:
        "Pobierz kopię swoich danych: kompletny plik JSON i czytelne podsumowanie w Markdown. Tylko Twoje własne dane.",
      downloadJson: "Pobierz JSON",
      downloadMarkdown: "Pobierz podsumowanie",
      generate: "Przygotuj eksport",
      preparing: "Przygotowywanie...",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się, aby wyeksportować dane",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie możesz wyeksportować tych danych",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono konta",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Eksport nie powiódł się",
        description:
          "Nie udało się wygenerować eksportu. Spróbuj ponownie później.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
  },
};
