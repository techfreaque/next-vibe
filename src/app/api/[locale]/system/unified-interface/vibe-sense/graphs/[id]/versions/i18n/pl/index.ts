import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Historia wersji grafu",
    description:
      "Pobierz lancuch wersji grafu (przejscie przez parentVersionId)",
    fields: {
      id: { label: "ID grafu", description: "UUID grafu" },
      versions: {
        label: "Wersje",
        description: "Posortowana lista wersji przodkow (od najstarszej)",
        id: { label: "ID wersji", description: "UUID wersji" },
        name: { label: "Nazwa", description: "Nazwa grafu w tej wersji" },
        createdAt: {
          label: "Utworzono",
          description: "Kiedy ta wersja zostala utworzona",
        },
        isActive: {
          label: "Aktywna",
          description: "Czy to jest aktualnie aktywna wersja",
        },
      },
    },
    success: {
      title: "Historia wersji zaladowana",
      description: "Lancuch wersji zostal pomyslnie pobrany",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Brak dostepu do tego grafu",
      },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie zaladowac historii wersji",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad",
      },
      validation: {
        title: "Walidacja nie powiodla sie",
        description: "Nieprawidlowe parametry",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Graf nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt zasobow" },
      network: {
        title: "Blad sieci",
        description: "Zadanie sieciowe nie powiodlo sie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
