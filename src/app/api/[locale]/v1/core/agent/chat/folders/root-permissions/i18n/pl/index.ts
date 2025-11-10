import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz uprawnienia folderu głównego",
    description: "Oblicz uprawnienia dla folderu głównego",
    container: {
      title: "Uprawnienia folderu głównego",
      description: "Zobacz uprawnienia dla folderów głównych",
    },
    rootFolderId: {
      label: "ID folderu głównego",
      description:
        "ID folderu głównego, dla którego sprawdzane są uprawnienia",
      placeholder: "private, shared, public lub incognito",
    },
    response: {
      canCreateThread: {
        content: "Może utworzyć wątek",
      },
      canCreateFolder: {
        content: "Może utworzyć folder",
      },
    },
    success: {
      title: "Sukces",
      description: "Uprawnienia folderu głównego pobrane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowy ID folderu głównego",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby sprawdzić uprawnienia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Folder główny nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
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
