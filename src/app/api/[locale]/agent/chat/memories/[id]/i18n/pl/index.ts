import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Aktualizuj wspomnienie",
    description: "Aktualizuje istniejące wspomnienie według ID",
    container: {
      title: "Aktualizuj wspomnienie",
      description: "Zmodyfikuj istniejące wspomnienie",
    },
    id: {
      label: "ID wspomnienia",
      description: "Unikalny identyfikator wspomnienia do aktualizacji",
    },
    content: {
      label: "Treść wspomnienia",
      description:
        "Fakt do zapamiętania (pozostaw puste, aby zachować bieżący)",
    },
    tags: {
      label: "Tagi",
      description:
        "Tagi do kategoryzacji (pozostaw puste, aby zachować bieżący)",
    },
    priority: {
      label: "Priorytet",
      description:
        "Wspomnienia o wyższym priorytecie pojawiają się pierwsze (pozostaw puste, aby zachować bieżący)",
    },
    response: {
      success: {
        content: "Zaktualizowano pomyślnie",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Dane żądania są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować wspomnienia",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do aktualizacji tego wspomnienia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wspomnienie nie zostało znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji wspomnienia",
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
        description: "Wystąpił konflikt podczas aktualizacji wspomnienia",
      },
    },
    success: {
      title: "Sukces",
      description: "Wspomnienie zaktualizowane pomyślnie",
    },
  },
  delete: {
    title: "Usuń wspomnienie",
    description: "Usuwa wspomnienie według ID",
    container: {
      title: "Usuń wspomnienie",
      description: "Usuń wspomnienie na stałe",
    },
    id: {
      label: "ID wspomnienia",
      description: "Unikalny identyfikator wspomnienia do usunięcia",
    },
    response: {
      success: {
        content: "Usunięto pomyślnie",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Dane żądania są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby usuwać wspomnienia",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do usunięcia tego wspomnienia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wspomnienie nie zostało znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania wspomnienia",
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
        description: "Wystąpił konflikt podczas usuwania wspomnienia",
      },
    },
    success: {
      title: "Sukces",
      description: "Wspomnienie usunięte pomyślnie",
    },
  },
};
