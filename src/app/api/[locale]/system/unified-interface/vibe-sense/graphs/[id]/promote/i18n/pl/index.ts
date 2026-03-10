import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Awansuj do systemu",
    description:
      "Awansuj graf admina do systemowego (tylko do odczytu, współdzielony)",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
    },
    response: {
      promotedId: "ID grafu",
    },
    widget: {
      confirmDescription:
        "Promoting this graph will make it system-owned and shared with all users. The current system version for this slug will be deactivated. This can be reversed by promoting a different version.",
      promotedIdLabel: "ID awansowanego:",
      viewButton: "Wyświetl",
    },
    success: {
      title: "Graf awansowany",
      description: "Graf pomyślnie awansowany do systemu",
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
        description: "Nie udało się awansować grafu",
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
