import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    folders: "Foldery",
  },
  delete: {
    title: "Usuń plik wiedzy",
    titleShort: "Usuń plik",
    description: "Usuń plik wiedzy z projektu tego folderu",
    container: {
      title: "Usuń plik wiedzy",
      description: "AI nie będzie już widzieć tego pliku w tym folderze.",
    },
    id: { label: "ID folderu", description: "Folder, do którego należy plik" },
    fileId: { label: "ID pliku", description: "Plik do usunięcia" },
    response: { removedPath: "Usunięto" },
    backButton: { label: "Wstecz" },
    submitButton: { label: "Usuń plik", loadingText: "Usuwanie..." },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie możesz edytować tego projektu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono folderu lub pliku",
      },
      server: {
        title: "Błąd serwera",
        description: "Coś poszło nie tak. Spróbuj ponownie.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
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
        description: "Projekt został zmieniony gdzie indziej",
      },
      notSupported: {
        title: "Nieobsługiwane",
        description:
          "Projekty działają tylko w folderach prywatnych i udostępnionych",
      },
    },
    success: {
      title: "Zapisano",
      description: "Gotowe",
    },
  },
};
