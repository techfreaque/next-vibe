export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  delete: {
    title: "Usuń organizację Corvina",
    description: "Trwale usuwa organizację Corvina na podstawie ID.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina do usunięcia.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      label: "Etykieta",
      status: "Status",
      resourceId: "ID zasobu",
    },
    widget: {
      title: "Usuń organizację",
      warning: "Ta operacja jest nieodwracalna.",
      confirmButton: "Usuń",
      cancelButton: "Anuluj",
      deletedTitle: "Organizacja usunięta",
      deletedDescription: "Organizacja została trwale usunięta.",
      backButton: "Wstecz",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Klucz API nie ma uprawnień do usunięcia tej organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Usunięto",
      description: "Organizacja usunięta pomyślnie.",
    },
  },
};
