import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Dziennik księgowy",
    description:
      "Lista wpisów dziennika z filtrami według firmy, okresu, statusu, źródła i zakresu dat",
    companyId: {
      label: "ID firmy",
      description: "Filtruj według firmy",
      placeholder: "UUID firmy",
    },
    periodId: {
      label: "ID okresu",
      description: "Filtruj według okresu księgowego",
      placeholder: "UUID okresu (opcjonalne)",
    },
    status: {
      label: "Status",
      description: "Filtruj według statusu wpisu",
      placeholder: "Dowolny status",
    },
    sourceType: {
      label: "Typ źródła",
      description: "Filtruj według źródła",
      placeholder: "Dowolne źródło",
    },
    dateFrom: {
      label: "Od",
      description: "Początek zakresu dat",
      placeholder: "",
    },
    dateTo: { label: "Do", description: "Koniec zakresu dat", placeholder: "" },
    response: {
      entries: "Wpisy",
      id: "ID",
      entryNumber: "Nr wpisu",
      date: "Data",
      description: "Opis",
      status: "Status",
      sourceType: "Źródło",
      postedAt: "Zaksięgowany",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź parametry filtrów",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Niewystarczające uprawnienia",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować wpisów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wpisów",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Wpisy załadowane",
      description: "Wpisy dziennika pobrane",
    },
  },
  title: "Lista dziennika",
  description: "Lista wpisów dziennika",
  category: "Plan kont",
  tag: "Dziennik",
};
