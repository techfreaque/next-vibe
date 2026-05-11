export const translations = {
  post: {
    title: "Wyświetl obraz",
    description:
      "Pobiera i wyświetla wcześniej przechwycony obraz na podstawie jego adresu URL. Użyj tego, aby ponownie przeanalizować zrzut ekranu lub obraz z wcześniejszego etapu rozmowy.",
    dynamicTitle: "Wyświetl: {{url}}",
    url: {
      label: "URL obrazu",
      description: "Adres URL przechowywanego obrazu",
      placeholder: "https://...",
    },
    response: {
      url: "URL obrazu",
    },
    errors: {
      validation_failed: {
        title: "Błąd walidacji",
        description: "Podany adres URL jest nieprawidłowy",
      },
      network_error: {
        title: "Błąd sieci",
        description: "Nie udało się pobrać obrazu",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do wyświetlenia tego obrazu",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Dostęp do tego obrazu jest zabroniony",
      },
      not_found: {
        title: "Obraz nie znaleziony",
        description: "Pod podanym adresem URL nie znaleziono żadnego obrazu",
      },
      server_error: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown_error: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsaved_changes: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Obraz załadowany",
      description: "Obraz został pomyślnie pobrany",
    },
  },
  tags: {
    vision: "Wizja",
    ai: "AI",
  },
};
