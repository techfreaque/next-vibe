import type { translations as en } from "../en";

export const translations: typeof en = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Uruchom konfigurację grafu",
    description:
      "Wykonaj graf z konfiguracji inline bez konieczności zapisu grafu",
    fields: {
      config: {
        label: "Konfiguracja grafu",
        description: "Inline konfiguracja grafu (węzły, krawędzie, trigger)",
      },
      rangeFrom: {
        label: "Od",
        description: "Początek zakresu (data ISO)",
      },
      rangeTo: {
        label: "Do",
        description: "Koniec zakresu (data ISO)",
      },
    },
    response: {
      nodeCount: "Wykonane węzły",
      errorCount: "Błędy",
      errors: "Szczegóły błędów",
    },
    success: {
      title: "Konfiguracja wykonana",
      description: "Konfiguracja grafu wykonana pomyślnie",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
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
        title: "Walidacja nie powiodła się",
        description: "Nieprawidłowa konfiguracja grafu lub parametry",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt zasobów",
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
