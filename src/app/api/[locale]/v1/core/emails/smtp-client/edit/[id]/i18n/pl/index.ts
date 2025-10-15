import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Wyświetl konto SMTP",
    description: "Pobierz szczegóły konta SMTP",
    container: {
      title: "Szczegóły konta SMTP",
      description: "Wyświetl konfigurację konta SMTP",
    },
  },
  put: {
    title: "Edytuj konto SMTP",
    description: "Edytuj istniejące konto SMTP",
    container: {
      title: "Ustawienia konta SMTP",
      description: "Zaktualizuj konfigurację konta SMTP",
    },
    updates: {
      title: "Aktualizuj pola",
      description: "Pola do zaktualizowania",
    },
  },
  fields: {
    id: {
      label: "ID Konta",
      description: "Unikalny identyfikator konta SMTP",
    },
    name: {
      label: "Nazwa Konta",
      description: "Nazwa konta SMTP",
      placeholder: "Wprowadź nazwę konta",
    },
    description: {
      label: "Opis",
      description: "Opcjonalny opis konta SMTP",
      placeholder: "Wprowadź opis",
    },
    host: {
      label: "Host SMTP",
      description: "Nazwa hosta serwera SMTP",
      placeholder: "smtp.przyklad.pl",
    },
    port: {
      label: "Port",
      description: "Port serwera SMTP",
      placeholder: "587",
    },
    securityType: {
      label: "Typ Zabezpieczeń",
      description: "Protokół zabezpieczeń do użycia",
      placeholder: "Wybierz typ zabezpieczeń",
    },
    username: {
      label: "Nazwa Użytkownika",
      description: "Nazwa użytkownika uwierzytelniania SMTP",
      placeholder: "Wprowadź nazwę użytkownika",
    },
    password: {
      label: "Hasło",
      description: "Hasło uwierzytelniania SMTP",
      placeholder: "Wprowadź hasło",
    },
    fromEmail: {
      label: "E-mail Nadawcy",
      description: "Domyślny adres e-mail nadawcy",
      placeholder: "noreply@przyklad.pl",
    },
    priority: {
      label: "Priorytet",
      description: "Priorytet konta (1-100)",
      placeholder: "10",
    },
  },
  response: {
    account: {
      title: "Konto SMTP",
      description: "Szczegóły konta SMTP",
      id: "ID Konta",
      name: "Nazwa Konta",
      fields: {
        description: "Opis",
      },
      host: "Host SMTP",
      port: "Port",
      securityType: "Typ Zabezpieczeń",
      username: "Nazwa Użytkownika",
      fromEmail: "E-mail Nadawcy",
      status: "Status Konta",
      healthCheckStatus: "Status Sprawdzania Kondycji",
      priority: "Priorytet",
      totalEmailsSent: "Łącznie Wysłanych E-maili",
      lastUsedAt: "Ostatnio Używane",
      createdAt: "Utworzone",
      updatedAt: "Zaktualizowane",
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabroniony",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Konto SMTP nie zostało znalezione",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    networkError: {
      title: "Błąd sieci",
      description: "Komunikacja sieciowa nie powiodła się",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
  },
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
  },
};
