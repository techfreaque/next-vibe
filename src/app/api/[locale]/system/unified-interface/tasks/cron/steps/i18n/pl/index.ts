export const translations = {
  put: {
    title: "Edytuj kroki zadania",
    description: "Zaktualizuj sekwencję kroków dla zadania cron-steps",
    container: {
      title: "Edytor kroków",
      description:
        "Zdefiniuj uporządkowaną listę kroków, które to zadanie wykona",
    },
    fields: {
      id: {
        label: "ID zadania",
        description: "Unikalny identyfikator zadania",
      },
      steps: {
        label: "Kroki (JSON)",
        description:
          "Tablica definicji kroków. Każdy krok musi mieć 'type' równy 'call' lub 'ai_agent'.",
        placeholder: '[{"type":"call","routeId":"moja-trasa","args":{}}]',
      },
    },
    response: {
      task: {
        title: "Zaktualizowane zadanie",
      },
      success: {
        title: "Sukces",
      },
    },
    submitButton: {
      label: "Zapisz kroki",
      loadingText: "Zapisywanie...",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podana konfiguracja kroków jest nieprawidłowa",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do aktualizacji tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Zadanie do aktualizacji nie zostało znalezione",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas zapisywania kroków",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego zadania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas aktualizacji zadania",
      },
    },
    success: {
      updated: {
        title: "Kroki zapisane",
        description: "Kroki zadania zostały pomyślnie zaktualizowane",
      },
    },
  },
  widget: {
    noSteps: "Brak skonfigurowanych kroków",
    addStep: "Dodaj krok",
    removeStep: "Usuń krok",
    stepType: "Typ kroku",
    call: "Wywołanie",
    aiAgent: "Agent AI",
    routeId: "ID trasy",
    args: "Argumenty",
    model: "Model",
    character: "Charakter",
    prompt: "Prompt",
    threadMode: "Tryb wątku",
    maxTurns: "Maks. rund",
    parallel: "Uruchom równolegle",
  },
};
