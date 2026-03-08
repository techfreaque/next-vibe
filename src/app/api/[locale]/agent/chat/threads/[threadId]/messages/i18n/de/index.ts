import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Nachrichten",
  },
  loadingOlderMessages: "Ältere Nachrichten werden geladen...",
  loadingNewerMessages: "Neuere Nachrichten werden geladen...",
  scrollUpForOlderMessages: "Nach oben scrollen für ältere Nachrichten",
  showOlderMessages: "Ältere Nachrichten anzeigen",
  showNewerMessages: "Neuere Nachrichten anzeigen",
  transcribing: "Audio wird transkribiert...",
  errorCode: "Fehlercode",
  compacting: {
    title: "Verlauf komprimiert",
    loading: "Verlauf wird komprimiert...",
    failed: "Komprimierung fehlgeschlagen",
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
      label: "Stammordner",
      description: "Stammordner des Threads (für Client-Routing verwendet)",
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
          character: {
            content: "Charakter",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "Sequenz-ID",
          },
          toolCalls: {
            content: "Tool-Aufrufe",
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
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Nachrichten anzuzeigen",
        incognitoNotAllowed:
          "Inkognito-Threads können nicht auf dem Server aufgerufen werden",
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
      label: "Stammordner",
      description: "Stammordner des Threads (für Client-Routing verwendet)",
    },
    id: {
      label: "Nachrichten-ID",
      description: "Client-generierte Nachrichten-ID",
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
    character: {
      label: "Charakter",
      description: "KI-Charakter/Persona für die Nachricht",
    },
    metadata: {
      label: "Metadaten",
      description: "Nachrichtenmetadaten (Anhänge, Tokens, etc.)",
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
          "Inkognito-Threads können nicht auf dem Server aufgerufen werden",
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
        title: "Fehler beim Erstellen der Nachricht",
        description: "Ein Fehler ist beim Erstellen der Nachricht aufgetreten",
      },
    },
    success: {
      title: "Success",
      description: "Message created successfully",
    },
  },
  enums: {
    role: {
      user: "Benutzer",
      assistant: "Assistent",
    },
  },
  debugView: {
    systemPromptTitle: "System-Prompt",
    copied: "Kopiert!",
    systemMessageHint: "Systemnachricht (für Benutzer verborgen)",
  },
  widget: {
    common: {
      send: "Senden",
      sending: "Wird gesendet...",
      cancel: "Abbrechen",
      close: "Schließen",
      copyButton: {
        copied: "Kopiert!",
        copyToClipboard: "In die Zwischenablage kopieren",
        copyAsMarkdown: "Als Markdown kopieren",
        copyAsText: "Als Klartext kopieren",
      },
      viewModeToggle: {
        linearView: "Lineare Ansicht",
        threadedView: "Thread-Ansicht",
        flatView: "Flache Ansicht",
        debugView: "Debug-Ansicht",
      },
      userMessageActions: {
        branch: "Verzweigung",
        retry: "Wiederholen",
        deleteMessage: "Nachricht löschen",
        cancelLoading: "Laden abbrechen",
        stopAudio: "Audio stoppen",
        playAudio: "Audio abspielen ({{cost}} Credits)",
      },
      assistantMessageActions: {
        answerAsAI: "Als KI antworten",
        cancelLoading: "Laden abbrechen",
        stopAudio: "Audio stoppen",
        playAudio: "Audio abspielen ({{cost}} Credits)",
        actualCostUsed: "Tatsächlich verbrauchte Kosten",
        credits: "Credits",
        tokens: "Tokens",
        tokensUsed: "Verwendete Tokens",
        deleteMessage: "Nachricht löschen",
        upvote: "Upvote",
        downvote: "Downvote",
      },
    },
    messages: {
      assistant: "Assistent",
      anonymous: "Anonym",
      you: "Sie",
      edited: "bearbeitet",
      branch: {
        previous: "Vorherige Verzweigung",
        next: "Nächste Verzweigung",
      },
      authorWithId: "{{name}} ({{id}})",
    },
    linearView: {
      answerModal: {
        title: "Als KI antworten",
        description: "Eine KI-Antwort auf diese Nachricht generieren",
        inputPlaceholder: "Kontext für die KI hinzufügen...",
        confirmLabel: "Generieren",
      },
      retryModal: {
        title: "Mit anderem Modell wiederholen",
        description: "Diese Antwort mit einem anderen Modell neu generieren",
        confirmLabel: "Wiederholen",
      },
    },
    threadedView: {
      replyModal: {
        title: "Antworten",
        description: "Sende eine Nachricht als Antwort auf diesen Beitrag",
        inputPlaceholder: "Schreibe deine Antwort...",
        confirmLabel: "Antworten",
      },
      actions: {
        reply: "Antworten",
        replyToMessage: "Auf diese Nachricht antworten",
        branch: "Verzweigen",
        branchMessage: "Bearbeiten & verzweigen",
        retry: "Wiederholen",
        retryWithDifferent: "Mit anderem Modell wiederholen",
        answerAsAI: "Als KI antworten",
        generateAIResponse: "KI-Antwort generieren",
        cancelLoading: "Laden abbrechen",
        stop: "Stoppen",
        stopAudio: "Audio stoppen",
        playAudio: "Audio abspielen ({{cost}} Credits)",
        delete: "Löschen",
        deleteMessage: "Nachricht löschen",
        share: "Teilen",
        copyPermalink: "Permalink kopieren",
        upvote: "Upvote",
        downvote: "Downvote",
        play: "Abspielen",
        cancel: "Abbrechen",
        parent: "Zum Elternelement",
      },
      answerModal: {
        title: "Als KI antworten",
        description: "Eine KI-Antwort auf diese Nachricht generieren",
        inputPlaceholder: "Kontext für die KI hinzufügen...",
        confirmLabel: "Generieren",
      },
      retryModal: {
        title: "Mit anderem Modell wiederholen",
        description: "Diese Antwort mit einem anderen Modell neu generieren",
        confirmLabel: "Wiederholen",
      },
      anonymous: "Anonym",
      assistantFallback: "Assistent",
      userFallback: "Benutzer",
      youLabel: "Sie",
      authorWithId: "{{name}} ({{id}})",
      reply: "Antwort",
      replies: "Antworten",
      expandReplies: "Antworten ausklappen",
      collapseReplies: "Antworten einklappen",
      continueThread: "Thread fortsetzen ({{count}} {{replyText}})",
    },
    flatView: {
      replyModal: {
        title: "Antworten",
        description: "Sende eine Nachricht als Antwort auf diesen Beitrag",
        inputPlaceholder: "Schreibe deine Antwort...",
        confirmLabel: "Antworten",
      },
      actions: {
        reply: "Antworten",
        replyToMessage: "Auf diese Nachricht antworten",
        branch: "Verzweigen",
        branchMessage: "Bearbeiten & verzweigen",
        retry: "Wiederholen",
        retryWithDifferent: "Mit anderem Modell wiederholen",
        answerAsAI: "Als KI antworten",
        generateAIResponse: "KI-Antwort generieren",
        delete: "Löschen",
        deleteMessage: "Nachricht löschen",
        copyReference: "Referenz kopieren",
        upvote: "Upvote",
        downvote: "Downvote",
      },
      answerModal: {
        title: "Als KI antworten",
        description: "Eine KI-Antwort auf diese Nachricht generieren",
        inputPlaceholder: "Kontext für die KI hinzufügen...",
        confirmLabel: "Generieren",
      },
      retryModal: {
        title: "Mit anderem Modell wiederholen",
        description: "Diese Antwort mit einem anderen Modell neu generieren",
        confirmLabel: "Wiederholen",
      },
      anonymous: "Anonym",
      assistantFallback: "Assistent",
      youLabel: "Sie",
      replyingTo: "Antwortet auf",
      replies: "Antworten:",
      clickToCopyRef: "Zum Kopieren klicken",
      postsById: "{{count}} Beiträge dieser ID",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "Systemnachricht (für Benutzer verborgen)",
    },
    userProfile: {
      recentPosts: "Neueste Beiträge",
      noPostsYet: "Noch keine Beiträge",
      postCount: "{{count}} Beiträge",
    },
    screenshot: {
      capture: "Screenshot aufnehmen",
      capturing: "Wird aufgenommen...",
    },
    shareDialog: {
      title: "Thread teilen",
    },
    messageEditor: {
      titles: {
        branch: "Bearbeiten & verzweigen",
        reply: "Antworten",
        cancel: "Abbrechen",
      },
      hint: {
        branch: "Bearbeiten erstellt eine neue Verzweigung",
        reply: "Schreibe deine Antwort",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Drücken Sie",
        enter: "Enter",
        shiftEnter: "Shift+Enter",
        forNewLine: "für neue Zeile",
      },
    },
    voiceMode: {
      callMode: "Anrufmodus",
      callModeDescription: "KI antwortet mit Sprache",
      tapToRecord: "Zum Aufnehmen tippen",
    },
    batchToolConfirmation: {
      title: "Batch-Tool-Aufrufe bestätigen",
    },
  },
};
