import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Musisz być zalogowany, aby uzyskać dostęp do niestandardowych skilli",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania skilla",
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
        description: "Wystąpił konflikt z bieżącym stanem",
      },
    },
  },
  title: "Aktywność AI",
  description:
    "Sprawdź katalog modeli i rozmowy rozpoczęte w ciągu ostatnich siedmiu dni.",
  models: "Modele w katalogu",
  providers: "Dostawcy modeli",
  skills: "Opublikowane umiejętności społeczności",
  conversations: "Nowe rozmowy",
  reported: "Zgłoszone umiejętności",
  attention: "Do sprawdzenia",
  clear: "Brak zgłoszonych umiejętności.",
  unavailable: "Stan moderacji jest niedostępny.",
  recent: "Ostatnia aktywność",
  loading: "Wczytywanie aktywności AI…",
  failed: "Nie udało się wczytać aktywności AI.",
};
