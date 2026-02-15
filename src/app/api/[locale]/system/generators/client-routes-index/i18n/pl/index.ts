import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Generuj indeks tras klienta",
    description: "Automatycznie generuj plik indeksu tras klienta",
    container: {
      title: "Generator indeksu tras klienta",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe dane",
        description: "Sprawdź konfigurację i spróbuj ponownie",
      },
      network: {
        title: "Błąd połączenia",
        description: "Nie udało się wygenerować indeksu. Spróbuj ponownie",
      },
      unauthorized: {
        title: "Wymagane logowanie",
        description: "Zaloguj się, aby użyć tego generatora",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do użycia tego generatora",
      },
      notFound: {
        title: "Nie znaleziono tras",
        description: "Nie można znaleźć tras do wygenerowania",
      },
      server: {
        title: "Generowanie nie powiodło się",
        description: "Nie udało się wygenerować indeksu. Spróbuj ponownie",
      },
      unknown: {
        title: "Nieoczekiwany błąd",
        description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
      },
      conflict: {
        title: "Konflikt pliku",
        description: "Plik indeksu ma konflikty. Rozwiąż je najpierw",
      },
    },
    success: {
      title: "Indeks wygenerowany",
      description: "Indeks tras klienta został pomyślnie wygenerowany",
    },
  },
};
