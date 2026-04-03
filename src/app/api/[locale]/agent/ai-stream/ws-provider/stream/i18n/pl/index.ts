import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  endpointCategories: {
    ai: "AI",
  },
  tags: {
    ai: "AI",
    streaming: "Streaming",
  },
  post: {
    title: "Stream WS Provider",
    description:
      "Uruchamia strumień AI dla zdalnego klienta WS Provider. Klient wysyła wiadomość, model i opcjonalne definicje narzędzi. Zdarzenia AI są przesyłane strumieniowo przez standardowy kanał WebSocket. Narzędzia klienta wstrzymują strumień do momentu odesłania wyników.",
    fields: {
      content: {
        label: "Wiadomość",
        description: "Wiadomość użytkownika do wysłania do modelu AI",
        placeholder: "Wpisz wiadomość...",
      },
      model: {
        label: "Model",
        description: "Model AI do generowania",
      },
      threadId: {
        label: "ID wątku",
        description:
          "UUID istniejącego wątku do kontynuacji. Pomiń, aby rozpocząć nowy wątek.",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      skill: {
        label: "Umiejętność",
        description:
          "ID umiejętności lub 'default'. Definiuje osobowość AI i prompt systemowy.",
      },
      systemPrompt: {
        label: "Prompt systemowy",
        description:
          "Opcjonalne instrukcje systemowe od zdalnego klienta, dołączane do promptu systemowego umiejętności.",
        placeholder: "Wpisz instrukcje systemowe...",
      },
      instanceId: {
        label: "ID instancji",
        description:
          "Identyfikator zdalnej instancji. Używany jako podfolder do organizacji wątków.",
      },
      tools: {
        title: "Narzędzia klienta",
        description:
          "Definicje narzędzi dostarczone przez zdalnego klienta. Gdy AI wywoła jedno z nich, wykonanie zostanie wstrzymane do momentu odesłania wyniku przez klienta.",
        name: {
          label: "Nazwa narzędzia",
          description: "Unikalna nazwa tego narzędzia",
        },
        toolDescription: {
          label: "Opis narzędzia",
          description: "Opis działania narzędzia (widoczny dla AI)",
        },
        parameters: {
          label: "Schemat parametrów",
          description:
            "Obiekt JSON Schema opisujący parametry wejściowe narzędzia",
        },
      },
      timezone: {
        label: "Strefa czasowa",
        description:
          "Strefa czasowa klienta dla stabilnych znaczników czasu w cache",
      },
    },
    response: {
      responseThreadId: "ID wątku konwersacji",
      messageId: "ID wiadomości asystenta AI",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Odmowa dostępu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas streamingu",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas streamingu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Konflikt z niezapisanymi zmianami",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Stream uruchomiony",
      description: "Stream AI został pomyślnie uruchomiony",
    },
  },
};
