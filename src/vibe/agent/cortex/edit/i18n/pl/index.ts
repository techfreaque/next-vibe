import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  patch: {
    title: "Edytuj plik",
    titleShort: "Edytuj plik",
    description:
      "Zmień fragment pliku. Znajdź tekst i zamień, albo edytuj konkretne linie.",
    dynamicTitle: "Edytowano: {{path}}",
    status: {
      loading: "Edytowanie...",
      done: "Edytowano",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description: "Który plik edytować",
      },
      find: {
        label: "Znajdź",
        description: "Tekst do znalezienia",
      },
      replace: {
        label: "Zamień",
        description: "Zamień na to",
      },
      startLine: {
        label: "Od linii",
        description: "Zacznij od tego numeru linii",
      },
      endLine: {
        label: "Do linii",
        description: "Zakończ na tym numerze linii",
      },
      newContent: {
        label: "Nowa treść",
        description: "Wstaw to zamiast tych linii",
      },
    },
    submitButton: {
      label: "Zastosuj",
      loadingText: "Stosowanie...",
    },
    response: {
      path: { content: "Ścieżka" },
      size: { text: "Rozmiar" },
      replacements: { text: "Zmiany" },
      updatedAt: { content: "Zaktualizowano" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Sprawdź ścieżkę i znajdź/zamień",
      },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie możesz tego edytować",
      },
      notFound: { title: "Nie znaleziono", description: "Plik nie istnieje" },
      findNotFound:
        'Nie znaleziono tekstu: "{{snippet}}" w {{path}}. Odczytaj plik przez cortex-read i spróbuj ponownie z dokładnym tekstem.',
      lineRangeOutOfBounds:
        "Zakres linii {{startLine}}-{{endLine}} wykracza poza plik. Plik ma {{lineCount}} linii.",
      missingEditStrategy:
        "Podaj find + replace albo startLine + endLine + newContent. Otrzymano: {{provided}}.",
      noParamsProvided: "nic",
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: {
        title: "Konflikt",
        description: "Plik się zmienił podczas edycji",
      },
    },
    success: {
      title: "Zapisano",
      description: "Zmiany zapisane",
    },
  },
};
