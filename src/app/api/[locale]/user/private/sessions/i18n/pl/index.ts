export const translations = {
  list: {
    title: "Moje sesje",
    description: "Wyświetl wszystkie aktywne sesje dla Twojego konta",
    tag: "Sesje",
    response: {
      sessions: "Sesje",
    },
    success: {
      title: "Sesje pobrane",
      description: "Twoje aktywne sesje zostały pobrane",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
    },
  },
  create: {
    title: "Utwórz token sesji",
    description: "Utwórz nazwany token sesji dla programowego dostępu",
    tag: "Sesje",
    form: {
      name: "Nazwa tokena",
      namePlaceholder: "np. Mój bot agenta",
    },
    response: {
      token: "Token",
      id: "ID sesji",
      name: "Nazwa",
      message: "Skopiuj ten token — nie zostanie pokazany ponownie",
    },
    success: {
      title: "Sesja utworzona",
      description: "Twój token sesji został utworzony",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
    },
  },
  revoke: {
    title: "Unieważnij sesję",
    description: "Unieważnij token sesji według ID",
    tag: "Sesje",
    response: {
      message: "Sesja unieważniona",
    },
    success: {
      title: "Sesja unieważniona",
      description: "Sesja została unieważniona",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Sesja nie znaleziona",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
    },
  },
};
