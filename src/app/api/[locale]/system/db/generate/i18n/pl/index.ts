import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",
  tag: "migracja",
  post: {
    title: "Generuj migracje",
    description: "Generuj pliki migracji Drizzle ze zmian schematu",
    form: {
      title: "Konfiguracja generowania",
      description: "Skonfiguruj opcje generowania migracji",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      network: {
        title: "Generowanie nie powiodło się",
        description: "drizzle-kit generate nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby nie zostały znalezione",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      conflict: { title: "Konflikt", description: "Wykryto konflikt" },
    },
    success: {
      title: "Generowanie zakończone sukcesem",
      description: "Pliki migracji wygenerowane pomyślnie",
    },
  },
  fields: {
    success: { title: "Status sukcesu" },
    output: { title: "Wyjście" },
    duration: { title: "Czas trwania (ms)" },
  },
};
