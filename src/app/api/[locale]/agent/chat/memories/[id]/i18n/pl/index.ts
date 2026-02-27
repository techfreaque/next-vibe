import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    memories: "Wspomnienia",
  },

  patch: {
    title: "Aktualizuj wspomnienie",
    description:
      "Aktualizuje istniejące wspomnienie. Wszystkie pola są opcjonalne — pominięte pola zachowują bieżącą wartość. Aby zaktualizować tylko tagi lub priorytet, po prostu pomiń treść. WAŻNE: nigdy nie przekazuj pustego ciągu dla treści — zostanie zignorowany i istniejąca treść zostanie zachowana. Aby usunąć wspomnienie, użyj endpointu delete.",
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
        "Zaktualizowany fakt do zapisania. Opcjonalne — pomiń, aby zachować bieżącą treść. Puste ciągi są ignorowane (treść nigdy nie jest nadpisywana pustą wartością).",
    },
    tags: {
      memories: "Wspomnienia",
      label: "Tagi",
      description:
        "Tagi do kategoryzacji (pozostaw puste, aby zachować bieżący)",
    },
    priority: {
      label: "Priorytet",
      description:
        "Wspomnienia o wyższym priorytecie pojawiają się pierwsze (pozostaw puste, aby zachować bieżący)",
    },
    isPublic: {
      label: "Publiczne",
      description:
        "Ustaw to wspomnienie jako widoczne w kontekstach publicznych i udostępnionych",
    },
    isArchived: {
      label: "Zarchiwizowane",
      description:
        "Zarchiwizuj to wspomnienie, aby wykluczyć je z kontekstu AI bez usuwania",
    },
    backButton: {
      label: "Wstecz",
    },
    submitButton: {
      label: "Aktualizuj wspomnienie",
    },
    deleteButton: {
      label: "Usuń wspomnienie",
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
      description: "Usuń to wspomnienie na stałe",
    },
    id: {
      label: "ID wspomnienia",
      description: "Unikalny identyfikator wspomnienia do usunięcia",
    },
    backButton: {
      label: "Wstecz",
    },
    deleteButton: {
      label: "Usuń",
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
