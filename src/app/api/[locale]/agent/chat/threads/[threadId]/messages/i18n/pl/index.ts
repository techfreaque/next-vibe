import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Wiadomości",
  },
  loadingOlderMessages: "Ładowanie starszych wiadomości...",
  loadingNewerMessages: "Ładowanie nowszych wiadomości...",
  scrollUpForOlderMessages: "Przewiń w górę po starsze wiadomości",
  showOlderMessages: "Pokaż starsze wiadomości",
  showNewerMessages: "Pokaż nowsze wiadomości",
  transcribing: "Transkrypcja audio...",
  errorCode: "Kod błędu",
  compacting: {
    title: "Historia skompresowana",
    loading: "Kompresowanie historii...",
    failed: "Kompresowanie nie powiodło się",
  },
  get: {
    title: "List Thread Messages",
    description: "Retrieve all messages in a chat thread",
    container: {
      title: "Messages",
      description: "Thread message list",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to retrieve messages from",
    },
    rootFolderId: {
      label: "Folder główny",
      description:
        "Folder główny wątku (używany do routingu po stronie klienta)",
    },
    leafMessageId: {
      label: "ID wiadomości liścia",
      description: "ID wiadomości liścia aktywnej gałęzi",
    },
    response: {
      title: "Messages Response",
      description: "List of messages in the thread",
      messages: {
        message: {
          title: "Message",
          id: {
            content: "Message ID",
          },
          threadId: {
            content: "Thread ID",
          },
          role: {
            content: "Role",
          },
          content: {
            content: "Content",
          },
          parentId: {
            content: "Parent Message ID",
          },
          authorId: {
            content: "Author ID",
          },
          isAI: {
            content: "Is AI",
          },
          model: {
            content: "Model",
          },
          skill: {
            content: "Postać",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "ID sekwencji",
          },
          toolCalls: {
            content: "Wywołania narzędzi",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view messages",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do przeglądania tych wiadomości",
        incognitoNotAllowed:
          "Wątki incognito nie mogą być dostępne na serwerze",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Messages retrieved successfully",
    },
  },
  post: {
    title: "Create Message",
    description: "Create a new message in a chat thread",
    form: {
      title: "New Message",
      description: "Create a message in the thread",
    },
    sections: {
      message: {
        title: "Message Details",
        description: "Message content and settings",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to add message to",
    },
    rootFolderId: {
      label: "Folder główny",
      description:
        "Folder główny wątku (używany do routingu po stronie klienta)",
    },
    id: {
      label: "ID wiadomości",
      description: "ID wiadomości wygenerowane przez klienta",
    },
    content: {
      label: "Content",
      description: "Message content",
      placeholder: "Enter message content...",
    },
    role: {
      label: "Role",
      description: "Message role (user, assistant, system)",
    },
    parentId: {
      label: "Parent Message",
      description: "Parent message ID for branching",
    },
    model: {
      label: "Model",
      description: "AI model to use for response",
    },
    skill: {
      label: "Postać",
      description: "Postać/persona AI dla wiadomości",
    },
    metadata: {
      label: "Metadane",
      description: "Metadane wiadomości (załączniki, tokeny, itp.)",
    },
    response: {
      title: "Created Message",
      description: "Newly created message details",
      message: {
        title: "Message",
        id: {
          content: "Message ID",
        },
        threadId: {
          content: "Thread ID",
        },
        role: {
          content: "Role",
        },
        content: {
          content: "Content",
        },
        parentId: {
          content: "Parent Message ID",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid message data provided",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create messages",
        incognitoNotAllowed:
          "Wątki incognito nie mogą być dostępne na serwerze",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      createFailed: {
        title: "Nie udało się utworzyć wiadomości",
        description: "Błąd podczas tworzenia wiadomości",
      },
    },
    success: {
      title: "Success",
      description: "Message created successfully",
    },
  },
  enums: {
    role: {
      user: "Użytkownik",
      assistant: "Asystent",
    },
  },
  debugView: {
    systemPromptTitle: "Systemowy monit",
    copied: "Skopiowano!",
    systemMessageHint: "Wiadomość systemowa (ukryta przed użytkownikami)",
    systemPromptLabel: "monit systemowy · wiodący · buforowany",
    upcomingContextLabel: "nadchodzący kontekst asystenta · ostatnia wiadomość",
  },
  widget: {
    common: {
      send: "Wyślij",
      sending: "Wysyłanie...",
      cancel: "Anuluj",
      close: "Zamknij",
      copyButton: {
        copied: "Skopiowano!",
        copyToClipboard: "Kopiuj do schowka",
        copyAsMarkdown: "Kopiuj jako Markdown",
        copyAsText: "Kopiuj jako zwykły tekst",
      },
      viewModeToggle: {
        linearView: "Widok liniowy",
        threadedView: "Widok wątkowy",
        flatView: "Widok płaski",
        debugView: "Widok debugowania",
      },
      userMessageActions: {
        branch: "Rozgałęzienie",
        retry: "Ponów",
        deleteMessage: "Usuń wiadomość",
        cancelLoading: "Anuluj ładowanie",
        stopAudio: "Zatrzymaj audio",
        playAudio: "Odtwórz audio ({{cost}} kredytów)",
      },
      assistantMessageActions: {
        answerAsAI: "Odpowiedz jako AI",
        cancelLoading: "Anuluj ładowanie",
        stopAudio: "Zatrzymaj audio",
        playAudio: "Odtwórz audio ({{cost}} kredytów)",
        actualCostUsed: "Rzeczywisty koszt",
        credits: "Kredyty",
        tokens: "Tokeny",
        tokensUsed: "Użyte tokeny",
        inputTokens: "Wejście",
        outputTokens: "Wyjście",
        cachedTokens: "Cache",
        cachedPercent: "{{percent}}% z cache",
        cachedPercentTitle:
          "{{percent}}% tokenów wejściowych pobrano z cache, co obniżyło koszt",
        timeToFirstToken: "{{seconds}}s do pierwszego tokenu",
        timeToFirstTokenTitle: "Czas od zapytania do pierwszego tokenu",
        cacheWriteTokens: "Zapis do cache",
        cacheWrite: "{{tokens}} zapisano do cache",
        cacheWriteTitle:
          "{{tokens}} tokenów zapisano do cache w tym żądaniu (rozliczane wg stawki zapisu cache)",
        deleteMessage: "Usuń wiadomość",
        upvote: "Głosuj za",
        downvote: "Głosuj przeciw",
      },
      generatedMediaActions: {
        copy: "Kopiuj",
        copied: "Skopiowano",
        download: "Pobierz",
        showPrompt: "Pokaż prompt",
        hidePrompt: "Ukryj prompt",
      },
    },
    messages: {
      assistant: "Asystent",
      anonymous: "Anonimowy",
      you: "Ty",
      edited: "edytowano",
      branch: {
        previous: "Poprzednie rozgałęzienie",
        next: "Następne rozgałęzienie",
      },
      authorWithId: "{{name}} ({{id}})",
    },
    linearView: {
      answerModal: {
        title: "Odpowiedz jako AI",
        description: "Wygeneruj odpowiedź AI na tę wiadomość",
        inputPlaceholder: "Dodaj kontekst dla AI...",
        confirmLabel: "Generuj",
      },
      retryModal: {
        title: "Ponów z innym modelem",
        description: "Wygeneruj tę odpowiedź ponownie z innym modelem",
        confirmLabel: "Ponów",
      },
    },
    threadedView: {
      replyModal: {
        title: "Odpowiedz",
        description: "Wyślij wiadomość w odpowiedzi na ten post",
        inputPlaceholder: "Napisz odpowiedź...",
        confirmLabel: "Odpowiedz",
      },
      actions: {
        reply: "Odpowiedz",
        replyToMessage: "Odpowiedz na tę wiadomość",
        branch: "Rozgałęź",
        branchMessage: "Edytuj i rozgałęź",
        retry: "Ponów",
        retryWithDifferent: "Ponów z innym modelem",
        answerAsAI: "Odpowiedz jako AI",
        generateAIResponse: "Wygeneruj odpowiedź AI",
        cancelLoading: "Anuluj ładowanie",
        stop: "Zatrzymaj",
        stopAudio: "Zatrzymaj audio",
        playAudio: "Odtwórz audio ({{cost}} kredytów)",
        delete: "Usuń",
        deleteMessage: "Usuń wiadomość",
        share: "Udostępnij",
        copyPermalink: "Kopiuj permalink",
        upvote: "Głosuj za",
        downvote: "Głosuj przeciw",
        play: "Odtwórz",
        cancel: "Anuluj",
        parent: "Przejdź do rodzica",
      },
      answerModal: {
        title: "Odpowiedz jako AI",
        description: "Wygeneruj odpowiedź AI na tę wiadomość",
        inputPlaceholder: "Dodaj kontekst dla AI...",
        confirmLabel: "Generuj",
      },
      retryModal: {
        title: "Ponów z innym modelem",
        description: "Wygeneruj tę odpowiedź ponownie z innym modelem",
        confirmLabel: "Ponów",
      },
      anonymous: "Anonimowy",
      assistantFallback: "Asystent",
      userFallback: "Użytkownik",
      youLabel: "Ty",
      authorWithId: "{{name}} ({{id}})",
      reply: "odpowiedź",
      replies: "odpowiedzi",
      expandReplies: "Rozwiń odpowiedzi",
      collapseReplies: "Zwiń odpowiedzi",
      continueThread: "Kontynuuj wątek ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "Odpowiedz",
        description: "Wyślij wiadomość w odpowiedzi na ten post",
        inputPlaceholder: "Napisz odpowiedź...",
        confirmLabel: "Odpowiedz",
      },
      actions: {
        reply: "Odpowiedz",
        replyToMessage: "Odpowiedz na tę wiadomość",
        branch: "Rozgałęź",
        branchMessage: "Edytuj i rozgałęź",
        retry: "Ponów",
        retryWithDifferent: "Ponów z innym modelem",
        answerAsAI: "Odpowiedz jako AI",
        generateAIResponse: "Wygeneruj odpowiedź AI",
        delete: "Usuń",
        deleteMessage: "Usuń wiadomość",
        copyReference: "Kopiuj referencję",
        upvote: "Głosuj za",
        downvote: "Głosuj przeciw",
      },
      answerModal: {
        title: "Odpowiedz jako AI",
        description: "Wygeneruj odpowiedź AI na tę wiadomość",
        inputPlaceholder: "Dodaj kontekst dla AI...",
        confirmLabel: "Generuj",
      },
      retryModal: {
        title: "Ponów z innym modelem",
        description: "Wygeneruj tę odpowiedź ponownie z innym modelem",
        confirmLabel: "Ponów",
      },
      anonymous: "Anonimowy",
      assistantFallback: "Asystent",
      youLabel: "Ty",
      replyingTo: "Odpowiada na",
      replies: "Odpowiedzi:",
      clickToCopyRef: "Kliknij, aby skopiować referencję",
      postsById: "{{count}} postów tego ID",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "Wiadomość systemowa (ukryta przed użytkownikami)",
    },
    userProfile: {
      recentPosts: "Ostatnie posty",
      noPostsYet: "Brak postów",
      postCount: "{{count}} postów",
    },
    screenshot: {
      capture: "Zrób zrzut ekranu",
      capturing: "Wykonywanie...",
    },
    shareDialog: {
      title: "Udostępnij wątek",
    },
    messageEditor: {
      titles: {
        branch: "Edytuj i rozgałęź",
        reply: "Odpowiedz",
        cancel: "Anuluj",
      },
      hint: {
        branch: "Edycja tworzy nowe rozgałęzienie",
        reply: "Napisz odpowiedź",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Naciśnij",
        enter: "Enter",
        shiftEnter: "Shift+Enter",
        forNewLine: "dla nowej linii",
      },
    },
    voiceMode: {
      callMode: "Tryb połączenia",
      callModeDescription: "AI odpowie głosem",
      tapToRecord: "Stuknij, aby nagrać",
    },
    batchToolConfirmation: {
      title: "Potwierdź wywołania narzędzi wsadowych",
    },
  },
  flatView: {
    timestamp: {
      sun: "Nie",
      mon: "Pon",
      tue: "Wt",
      wed: "Śr",
      thu: "Czw",
      fri: "Pt",
      sat: "Sob",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
  },
};
