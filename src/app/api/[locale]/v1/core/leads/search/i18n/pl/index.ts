import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie leadami",
  tags: {
    leads: "Leady",
    search: "Szukaj",
  },
  get: {
    title: "Szukaj leadów",
    description: "Przeszukaj leady z filtrowaniem i stronicowaniem",
    form: {
      title: "Formularz wyszukiwania leadów",
      description: "Wprowadź kryteria wyszukiwania aby znaleźć leady",
    },
    search: {
      label: "Zapytanie wyszukiwania",
      description: "Termin wyszukiwania do filtrowania leadów po e-mailu, nazwie firmy lub notatkach",
    },
    limit: {
      label: "Limit wyników",
      description: "Maksymalna liczba wyników do zwrócenia (1-100)",
    },
    offset: {
      label: "Przesunięcie wyników",
      description: "Liczba wyników do pominięcia dla stronicowania",
    },
    response: {
      title: "Wyniki wyszukiwania",
      description: "Stronicowane wyniki wyszukiwania z danymi leadów",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Autoryzacja wymagana do przeszukiwania leadów",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry wyszukiwania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas wyszukiwania leadów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas wyszukiwania leadów",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas wyszukiwania leadów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony dla wyszukiwania leadów",
      },
      notFound: {
        title: "Brak wyników",
        description: "Nie znaleziono leadów pasujących do kryteriów wyszukiwania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany w formularzu wyszukiwania",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas wyszukiwania leadów",
      },
    },
    success: {
      title: "Wyszukiwanie zakończone",
      description: "Wyszukiwanie leadów zakończone pomyślnie",
    },
  },
};