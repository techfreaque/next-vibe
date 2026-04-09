export const translations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "Zapisz się i uzyskaj dostęp",
    description:
      "Podaj swoje dane, żeby dołączyć do listy twórcy i uzyskać dostęp do tego skilla",
    groups: {
      main: {
        title: "Uzyskaj dostęp",
        description: "Wpisz swoje dane poniżej",
      },
    },
    fields: {
      skillId: {
        label: "Skill",
        description: "Skill, do którego się zapisujesz",
      },
      firstName: {
        label: "Imię",
        description: "Twoje imię",
        placeholder: "np. Alex",
      },
      email: {
        label: "Adres e-mail",
        description: "Twój adres e-mail",
        placeholder: "ty@example.com",
      },
    },
    response: {
      captured: "Zapisano",
      nextStep: "Następny krok",
      signupUrl: "URL rejestracji",
    },
    success: {
      title: "Jesteś na liście!",
      description: "Sprawdź skrzynkę - i zarejestruj się, żeby używać skilla",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź swoje dane",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Brak autoryzacji",
      },
      forbidden: { title: "Brak dostępu", description: "Brak dostępu" },
      notFound: {
        title: "Nie znaleziono",
        description: "Skill nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wystąpił błąd wewnętrzny",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
  },
};
