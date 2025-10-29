import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "schema-verify",
  post: {
    title: "Weryfikacja schematu",
    description:
      "Sprawdź integralność schematu bazy danych i opcjonalnie napraw problemy",
    form: {
      title: "Konfiguracja weryfikacji schematu",
      description: "Skonfiguruj parametry weryfikacji schematu",
    },
    response: {
      title: "Odpowiedź weryfikacji schematu",
      description: "Wyniki weryfikacji schematu",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do weryfikacji schematu",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry weryfikacji schematu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas weryfikacji schematu",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Operacja weryfikacji schematu nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas weryfikacji schematu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas weryfikacji schematu",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia do weryfikacji schematu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby weryfikacji schematu nie zostały znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wykryto konflikt weryfikacji schematu",
      },
    },
    success: {
      title: "Schemat zweryfikowany",
      description: "Weryfikacja schematu bazy danych zakończona pomyślnie",
    },
  },
  fields: {
    fixIssues: {
      title: "Napraw problemy",
      description: "Automatycznie napraw wykryte problemy schematu",
    },
    silent: {
      title: "Tryb cichy",
      description: "Ukryj komunikaty wyjściowe",
    },
    success: {
      title: "Status sukcesu",
    },
    valid: {
      title: "Schemat poprawny",
    },
    output: {
      title: "Wyjście",
    },
    issues: {
      title: "Znalezione problemy",
    },
    fixedIssues: {
      title: "Naprawione problemy",
    },
  },
  verified: {
    tables: "✅ Zweryfikowano {{count}} tabel",
    columns: "✅ Zweryfikowano {{count}} kolumn",
    indexes: "✅ Zweryfikowano {{count}} indeksów",
    constraints: "✅ Zweryfikowano {{count}} ograniczeń",
  },
  fixed: "🔧 Naprawiono {{count}} problemów ze schematem",
  validationPassed: "\n✅ Walidacja schematu zakończona pomyślnie - wszystkie sprawdzenia OK",
  validationFailed: "\n❌ Walidacja schematu nie powiodła się - znaleziono {{count}} problemów",
  dbConnectionFailed: "Nie udało się połączyć z bazą danych",
};
