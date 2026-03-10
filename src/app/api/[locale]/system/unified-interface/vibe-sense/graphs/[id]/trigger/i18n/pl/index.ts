import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Uruchom graf",
    description: "Ręczne uruchomienie wykonania grafu na żądanie",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      rangeFrom: { label: "Od", description: "Początek zakresu (data ISO)" },
      rangeTo: { label: "Do", description: "Koniec zakresu (data ISO)" },
    },
    response: {
      nodeCount: "Wykonane węzły",
      errorCount: "Błędy",
    },
    widget: {
      nodesExecuted: "Wykonane węzły",
      errors: "Błędy",
      errorDetails: "Error details",
      nodeLabel: "Node",
    },
    success: {
      title: "Graf wykonany",
      description: "Graf uruchomiony pomyślnie",
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
        description: "Wykonanie grafu nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      notFound: { title: "Nie znaleziono", description: "Graf nie znaleziony" },
      conflict: { title: "Konflikt", description: "Konflikt zasobów" },
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
