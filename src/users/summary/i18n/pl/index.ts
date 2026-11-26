import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Nieprawidłowe zapytanie",
      description: "Sprawdź okres i daty",
    },
    unauthorized: {
      title: "Wymagane logowanie",
      description: "Zaloguj się, aby zobaczyć statystyki",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Potrzebujesz roli admina",
    },
    notFound: {
      title: "Brak danych",
      description: "Nic do pokazania w tym okresie",
    },
    server: {
      title: "Nie udało się policzyć statystyk",
      description: "Serwer nie policzył statystyk użytkowników",
    },
    network: {
      title: "Błąd sieci",
      description: "Brak połączenia z serwerem",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description: "Coś poszło nie tak przy liczeniu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie koliduje z bieżącymi danymi",
    },
  },
  title: "Przegląd kont",
  description:
    "Sprawdź nowe konta klientów i potwierdzenia adresów e-mail. Zestawienie pomija konta pracowników i konta testowe.",
  accounts: "Konta klientów",
  signups: "Nowe w ciągu 7 dni",
  verified: "E-mail potwierdzony",
  unverified: "E-mail niepotwierdzony",
  reviewUnverified: "Nowe konta do weryfikacji ({{count}})",
  attention: "Do sprawdzenia",
  clear: "Wszystkie nowe konta mają potwierdzony adres e-mail.",
  unavailable: "Status potwierdzenia jest niedostępny.",
  recent: "Ostatnia aktywność",
  loading: "Wczytywanie przeglądu kont…",
};
