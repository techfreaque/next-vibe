import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  post: {
    title: "Ponowna autoryzacja",
    description: "Odśwież dane uwierzytelniające dla tego połączenia zdalnego",
    instanceId: {
      label: "ID instancji",
      description: "Instancja do ponownej autoryzacji",
    },
    email: {
      label: "E-mail",
      description: "Twój adres e-mail na zdalnej instancji",
      placeholder: "ty@przyklad.pl",
      validation: {
        required: "E-mail jest wymagany",
        invalid: "Nieprawidłowy adres e-mail",
      },
    },
    password: {
      label: "Hasło",
      description: "Twoje hasło na zdalnej instancji",
      placeholder: "••••••••",
      validation: {
        required: "Hasło jest wymagane",
      },
    },
    actions: {
      submit: "Ponowna autoryzacja",
      submitting: "Autoryzuję…",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem zdalnym",
      },
      unauthorized: {
        title: "Nieprawidłowe dane",
        description: "Adres e-mail lub hasło jest nieprawidłowe",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień",
      },
      notFound: {
        title: "Niepołączono",
        description: "Nie znaleziono połączenia zdalnego dla tej instancji",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas ponownej autoryzacji",
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
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Autoryzacja odnowiona",
      description: "Twoje dane uwierzytelniające zostały pomyślnie odświeżone",
    },
  },
};
