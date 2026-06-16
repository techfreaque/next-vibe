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
    titleShort: "Strumień WS",
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
      rootFolderId: {
        label: "Folder główny",
        description:
          "Folder dla nowego wątku. Domyślnie 'private'. 'support' dla sesji wsparcia.",
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
      threadMirrorMode: {
        label: "Tryb kopiowania wątku",
        description:
          "Gdzie przechowywany jest wątek: po obu stronach, tylko u wywołującego, tylko u dostawcy lub nigdzie. 'both'/'cloud' zapisują wątek na tej instancji w REMOTE/<instancja wywołująca>.",
      },
      userMessageId: {
        label: "ID wiadomości użytkownika",
        description:
          "Identyfikator wiadomości użytkownika nadany przez wywołującego. Zapisywany bez zmian, aby synchronizacja wątku była idempotentna.",
      },
      parentMessageId: {
        label: "ID wiadomości nadrzędnej",
        description:
          "Identyfikator poprzedniej wiadomości-liścia wywołującego. Nowa wiadomość użytkownika łączy się z nią, aby zsynchronizowany wątek był jedną listą.",
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
      toolConfirmations: {
        title: "Potwierdzenia narzędzi",
        description:
          "Zatwierdź lub odrzuć wywołania narzędzi oczekujące na potwierdzenie. Stream wznowi się z wynikiem zatwierdzonego narzędzia.",
        messageId: {
          label: "ID wiadomości",
          description: "ID wiadomości narzędzia oczekującej na potwierdzenie",
        },
        confirmed: {
          label: "Potwierdzono",
          description: "True, aby zatwierdzić i wykonać; false, aby odrzucić",
        },
        updatedArgs: {
          label: "Zmienione argumenty",
          description:
            "Opcjonalnie edytowane argumenty narzędzia użyte przy wykonaniu",
        },
      },
      confirmationOverrides: {
        title: "Nadpisania potwierdzeń",
        description:
          "Reguły potwierdzania dla poszczególnych narzędzi z ulubionego/umiejętności wywołującego, stosowane do bramki execute-tool tej pętli.",
        toolId: {
          label: "ID narzędzia",
          description: "Narzędzie, którego dotyczy reguła potwierdzenia",
        },
        requiresConfirmation: {
          label: "Wymaga potwierdzenia",
          description: "Prawda, jeśli narzędzie musi czekać na potwierdzenie użytkownika",
        },
      },
      attachments: {
        title: "Załączniki",
        description:
          "Pliki dołączone do wiadomości użytkownika, zakodowane w base64 na potrzeby transportu.",
        filename: {
          label: "Nazwa pliku",
          description: "Oryginalna nazwa pliku",
        },
        mimeType: {
          label: "Typ MIME",
          description: "Typ zawartości pliku",
        },
        data: {
          label: "Dane",
          description: "Zawartość pliku zakodowana w base64",
        },
      },
      messageHistory: {
        label: "Historia wiadomości",
        description:
          "Kontekst rozmowy z instancji wywołującej. Provider nie przechowuje stanu wątku, więc wywołujący dostarcza wcześniejsze wiadomości przy każdej turze.",
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
