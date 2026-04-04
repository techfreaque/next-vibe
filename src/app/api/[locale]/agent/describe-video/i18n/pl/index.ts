// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    video: "Wideo",
    vision: "Wizja",
    ai: "AI",
  },
  post: {
    title: "Opisz wideo",
    dynamicTitle: "Opisz: {{filename}}",
    description: "Opisz zawartość wideo za pomocą modelu AI",
    fileUrl: {
      label: "URL wideo",
      description: "URL wideo do opisania",
    },
    context: {
      label: "Kontekst",
      description: "Opcjonalny kontekst do opisu",
      placeholder: "Opisz to wideo skupiając się na...",
    },
    submitButton: {
      label: "Opisz wideo",
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
        description: "Podaj prawidłowy URL wideo",
      },
      network_error: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z usługą",
      },
      unauthorized: { title: "Brak autoryzacji", description: "Zaloguj się" },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      not_found: {
        title: "Nie znaleziono",
        description: "Wideo nie zostało znalezione",
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
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
      noVisionModel: "Brak skonfigurowanego modelu wizji wideo",
      descriptionFailed: "Nie udało się opisać wideo",
      insufficientCredits:
        "Niewystarczające kredyty. Saldo: {{balance}}, wymagane: {{minimum}}",
      balanceCheckFailed: "Nie udało się sprawdzić salda",
      creditsFailed: "Nie udało się odliczyć kredytów",
    },
    success: {
      title: "Wideo opisane",
      description: "Wideo zostało pomyślnie opisane",
    },
  },
} as const;
