import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    folders: "Foldery",
  },
  get: {
    title: "Ustawienia projektu",
    titleShort: "Projekt",
    description: "Instrukcje i pliki wiedzy projektu w folderze",
    id: { label: "ID folderu", description: "Folder do odczytu" },
    response: {
      folderName: "Folder",
      instructions: "Instrukcje",
      canManage: "Może zarządzać",
      knowledgePath: "Ścieżka wiedzy",
      files: {
        id: "ID",
        name: "Nazwa",
        path: "Ścieżka",
        size: "Rozmiar",
        updatedAt: "Zaktualizowano",
      },
    },
    heading: "Projekt",
    subheading:
      "Instrukcje obowiązują w każdym czacie w tym folderze i jego podfolderach. Pliki wiedzy są dostępne dla AI.",
    instructionsTitle: "Instrukcje",
    noInstructions:
      "Brak instrukcji. Powiedz AI, jak ma się zachowywać w tym folderze.",
    editInstructions: "Edytuj instrukcje",
    addInstructions: "Dodaj instrukcje",
    knowledgeTitle: "Pliki wiedzy",
    noFiles:
      "Brak plików wiedzy. Dodaj notatki, briefy lub dokumenty, które AI ma znać.",
    addFile: "Dodaj plik",
    removeFile: "Usuń",
    bytes: "znaków",
    noData: "Ładowanie projektu...",
    noAccess: "Ustawienia projektu mogą zmieniać tylko edytorzy folderu.",
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
  patch: {
    title: "Edytuj instrukcje projektu",
    titleShort: "Instrukcje",
    description: "Ustal, czego AI przestrzega w każdym czacie tego folderu",
    container: {
      title: "Instrukcje projektu",
      description: "Obowiązują w każdym czacie w tym folderze i podfolderach",
    },
    id: { label: "ID folderu", description: "Folder do aktualizacji" },
    instructions: {
      label: "Instrukcje",
      description:
        "Jak AI ma się zachowywać, co ma wiedzieć, ton, format. Puste je usuwa.",
      placeholder:
        "np. Jesteś moim copywriterem. Krótko i mocno. Odpowiadaj zawsze punktami.",
    },
    response: { folderId: "Folder", hasInstructions: "Instrukcje aktywne" },
    backButton: { label: "Wstecz" },
    submitButton: { label: "Zapisz instrukcje", loadingText: "Zapisywanie..." },
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
