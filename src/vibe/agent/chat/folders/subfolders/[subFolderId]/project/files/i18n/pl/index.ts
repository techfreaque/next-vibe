import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    folders: "Foldery",
  },
  post: {
    title: "Dodaj plik wiedzy",
    titleShort: "Dodaj plik",
    description:
      "Dodaj dokument, z którego AI może korzystać w każdym czacie tego folderu",
    container: {
      title: "Dodaj plik wiedzy",
      description:
        "Zapisany jako dokument Cortex. AI czyta go przez cortex-read i cortex-search.",
    },
    id: {
      label: "ID folderu",
      description: "Folder, do którego dodajesz plik",
    },
    name: {
      label: "Nazwa pliku",
      description: "Krótka nazwa. Rozszerzenie .md zostanie dodane.",
      placeholder: "brief-premiery",
    },
    content: {
      label: "Treść",
      description: "Wklej tekst dokumentu (najlepiej markdown)",
    },
    response: { fileId: "ID pliku", path: "Ścieżka Cortex" },
    backButton: { label: "Wstecz" },
    submitButton: { label: "Dodaj plik", loadingText: "Dodawanie..." },
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
