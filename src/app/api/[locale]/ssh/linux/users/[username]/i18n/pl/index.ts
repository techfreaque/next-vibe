export const translations = {
  delete: {
    title: "Usuń użytkownika Linux",
    description: "Usuń konto użytkownika OS z hosta",
    fields: {
      removeHome: {
        label: "Usuń katalog domowy",
        description: "Usuń również katalog domowy użytkownika",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description:
          "Nie można usunąć użytkowników systemowych ani bieżącego użytkownika procesu",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się usunąć użytkownika",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik nie znaleziony",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: {
        title: "Konflikt",
        description: "Nie można usunąć użytkownika",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: {
      title: "Użytkownik usunięty",
      description: "Konto użytkownika OS usunięte pomyślnie",
    },
  },
};
