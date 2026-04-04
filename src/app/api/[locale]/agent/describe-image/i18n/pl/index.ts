// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    image: "Obraz",
    vision: "Wizja",
    ai: "AI",
  },
  post: {
    title: "Opisz obraz",
    dynamicTitle: "Opisz: {{filename}}",
    description: "Opisz zawartość obrazu za pomocą modelu AI",
    fileUrl: {
      label: "URL obrazu",
      description: "URL obrazu do opisania",
    },
    context: {
      label: "Kontekst",
      description: "Opcjonalny kontekst do opisu",
      placeholder: "Opisz ten obraz skupiając się na...",
    },
    submitButton: {
      label: "Opisz obraz",
      loadingText: "Opisuję...",
    },
    response: {
      text: "Opis",
      model: "Użyty model",
      creditCost: "Użyte kredyty",
    },
    errors: {
      validation_failed: {
        title: "Błąd walidacji",
        description: "Podaj prawidłowy URL obrazu",
      },
      network_error: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z usługą",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień",
      },
      not_found: {
        title: "Nie znaleziono",
        description: "Obraz nie został znaleziony",
      },
      server_error: {
        title: "Błąd serwera",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unknown_error: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved_changes: {
        title: "Niezapisane zmiany",
        description: "Zapisz zmiany przed opisaniem",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      noVisionModel: "Brak skonfigurowanego modelu wizji obrazu",
      descriptionFailed: "Nie udało się opisać obrazu",
      insufficientCredits:
        "Niewystarczające kredyty. Saldo: {{balance}}, wymagane: {{minimum}}",
      balanceCheckFailed: "Nie udało się sprawdzić salda",
      creditsFailed: "Nie udało się odliczyć kredytów",
    },
    success: {
      title: "Obraz opisany",
      description: "Obraz został pomyślnie opisany",
    },
  },
} as const;
