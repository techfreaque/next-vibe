import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Usuń graf",
    titleShort: "Usuń graf",
    description: "Trwale usuń graf. Bez powrotu.",
    fields: {
      id: {
        label: "ID grafu",
        description: "UUID grafu do usunięcia",
      },
    },
    response: {
      deletedId: "ID usuniętego grafu",
    },
    widget: {
      confirmDescription:
        "Nieodwracalne. Graf i jego konfiguracja znikają — bez cofania. Działa tylko, gdy graf nie ma danych; w przeciwnym razie go zarchiwizuj.",
      deletedIdLabel: "Usunięte ID:",
      backToList: "Powrót do grafów",
    },
    success: {
      title: "Graf usunięty",
      description: "Graf został trwale usunięty",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie możesz usunąć tego grafu",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się usunąć grafu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Nieprawidłowe parametry",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono grafu",
      },
      conflict: {
        title: "Zawiera dane",
        description: "Graf ma punkty danych — zarchiwizuj go zamiast usuwać",
      },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
