export const translations = {
  post: {
    title: "Nachricht bewerten",
    description: "Nachricht hoch- oder runterbewerten",
    container: {
      title: "Bewertung",
      description: "Geben Sie Ihre Bewertung für diese Nachricht ab",
    },
    form: {
      title: "Nachricht bewerten",
      description: "Hochbewerten, runterbewerten oder Bewertung entfernen",
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, der die Nachricht enthält",
    },
    messageId: {
      label: "Nachrichten-ID",
      description: "ID der zu bewertenden Nachricht",
    },
    vote: {
      label: "Bewertung",
      description:
        "Ihre Bewertung: Hochbewerten, Runterbewerten oder Entfernen",
      placeholder: "Bewertungstyp auswählen...",
      options: {
        upvote: "Hochbewerten",
        downvote: "Runterbewerten",
        remove: "Bewertung entfernen",
      },
    },
    response: {
      title: "Bewertungsergebnis",
      description: "Aktualisierte Bewertungszahlen",
      upvotes: {
        content: "Hochbewertungen",
      },
      downvotes: {
        content: "Runterbewertungen",
      },
      userVote: {
        content: "Ihre Bewertung",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Bewertungsdaten angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Nachrichten zu bewerten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese Nachricht zu bewerten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nachricht nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Bewertung konnte nicht gespeichert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Bewertungskonflikt aufgetreten",
      },
    },
    success: {
      title: "Bewertung gespeichert",
      description: "Ihre Bewertung wurde erfolgreich gespeichert",
    },
  },
};
