import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Czyszczenie Vibe Sense",
    description: "Usuwa stare punkty danych i wygasza pamięć podręczną",
  },
  post: {
    title: "Czyszczenie Vibe Sense",
    description:
      "Uruchom czyszczenie retencyjne punktów danych i wygaś snapshoty",
    response: {
      nodesProcessed: "Przetworzone węzły",
      totalDeleted: "Usunięte wiersze",
      snapshotsDeleted: "Usunięte snapshoty",
      graphsChecked: "Sprawdzone grafy",
      graphsExecuted: "Wykonane grafy",
    },
    success: {
      title: "Czyszczenie zakończone",
      description: "Czyszczenie retencyjne zakończone",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Czyszczenie nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
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
