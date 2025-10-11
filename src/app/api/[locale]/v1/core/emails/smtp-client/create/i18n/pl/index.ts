import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Utwórz konto SMTP",
  description: "Utwórz nowe konto SMTP do wysyłania e-maili",

  container: {
    title: "Konfiguracja konta SMTP",
    description: "Skonfiguruj ustawienia konta SMTP",
  },

  name: {
    label: "Nazwa konta",
    description: "Unikalna nazwa dla tego konta SMTP",
    placeholder: "Wprowadź nazwę konta",
  },

  accountDescription: {
    label: "Opis",
    description: "Opcjonalny opis dla tego konta SMTP",
    placeholder: "Wprowadź opis",
  },

  host: {
    label: "Host SMTP",
    description: "Nazwa hosta serwera SMTP lub adres IP",
    placeholder: "smtp.example.com",
  },

  port: {
    label: "Port",
    description: "Numer portu serwera SMTP",
    placeholder: "587",
  },

  securityType: {
    label: "Typ bezpieczeństwa",
    description: "Protokół bezpieczeństwa SMTP",
    placeholder: "Wybierz typ bezpieczeństwa",
  },

  username: {
    label: "Nazwa użytkownika",
    description: "Nazwa użytkownika do uwierzytelniania SMTP",
    placeholder: "Wprowadź nazwę użytkownika",
  },

  password: {
    label: "Hasło",
    description: "Hasło do uwierzytelniania SMTP",
    placeholder: "Wprowadź hasło",
  },

  fromEmail: {
    label: "E-mail nadawcy",
    description: "Adres e-mail do wysyłania",
    placeholder: "nadawca@example.com",
  },

  response: {
    account: {
      title: "Konto SMTP utworzone",
      description: "Pomyślnie utworzono konto SMTP",
      id: "ID konta",
      name: "Nazwa konta",
      accountDescription: "Opis konta",
      host: "Host SMTP",
      port: "Port",
      securityType: "Typ bezpieczeństwa",
      username: "Nazwa użytkownika",
      fromEmail: "E-mail nadawcy",
      status: "Status konta",
      healthCheckStatus: "Status sprawdzenia zdrowia",
      priority: "Priorytet",
      totalEmailsSent: "Łączna liczba wysłanych e-maili",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry konta SMTP",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uprawnienia administratora do tworzenia kont SMTP",
    },
    conflict: {
      title: "Konto istnieje",
      description: "Konto SMTP o tej nazwie już istnieje",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się utworzyć konta SMTP",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do tego zasobu jest zabroniony",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany",
    },
  },

  success: {
    title: "Konto SMTP utworzone",
    description: "Pomyślnie utworzono konto SMTP",
  },
};
