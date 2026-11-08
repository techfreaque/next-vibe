import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Moderation",
  },
  get: {
    title: "Gemeldete Inhalte",
    titleShort: "Moderations-Queue",
    description:
      "Gemeldete und ausgeblendete Feed-Beiträge und geteilte Threads, das Dringendste zuerst",
    fields: {
      minReports: {
        label: "Min. Meldungen",
        description: "Mindestzahl offener Meldungen (Standard: 1)",
      },
      limit: {
        label: "Limit",
        description: "Maximale Anzahl zurückgegebener Threads",
      },
      offset: {
        label: "Offset",
        description: "Anzahl zu überspringender Threads",
      },
    },
    response: {
      threads: {
        id: { content: "Thread-ID" },
        title: { content: "Titel" },
        rootFolderId: { content: "Ordner" },
        authorId: { content: "Autor-ID" },
        authorName: { content: "Autor" },
        authorBanned: { content: "Autor gesperrt" },
        moderationStatus: { content: "Status" },
        reportCount: { content: "Meldungen" },
        reasons: { content: "Gründe" },
        latestNote: { content: "Letzte Notiz" },
        updatedAt: { content: "Aktualisiert am" },
      },
      totalCount: { content: "Gesamt" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugriff erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Moderations-Queue konnte nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
    },
    success: {
      title: "Queue geladen",
      description: "Gemeldete Inhalte erfolgreich abgerufen",
    },
    note: "„{{note}}“",
    empty: "Nichts gemeldet. Die Community sieht gesund aus.",
    status: {
      visible: "Sichtbar",
      underReview: "In Prüfung",
      removed: "Entfernt",
      authorBanned: "Autor gesperrt",
    },
    reasons: {
      spam: "Spam",
      illegal: "Illegal",
      abuse: "Missbrauch",
      csamFlag: "Kinderschutz",
      other: "Sonstiges",
    },
    action: {
      dismiss: "Verwerfen",
      remove: "Entfernen",
      banAuthor: "Entfernen + Autor sperren",
    },
    backButton: {
      label: "Zurück",
    },
  },
  patch: {
    title: "Inhalt moderieren",
    titleShort: "Moderieren",
    description:
      "Meldungen verwerfen und Thread wiederherstellen, entfernen oder entfernen und den Autor sperren",
    fields: {
      id: {
        label: "Thread-ID",
        description: "ID des zu moderierenden Threads",
      },
      action: {
        label: "Aktion",
        description:
          "dismiss = wiederherstellen und Meldungen löschen, remove = dauerhaft ausblenden, ban = entfernen und Autor sperren",
      },
    },
    actions: {
      dismiss: "Meldungen verwerfen (wiederherstellen)",
      remove: "Inhalt entfernen",
      banAuthor: "Entfernen und Autor sperren",
    },
    response: {
      patchId: { content: "Thread-ID" },
      patchStatus: { content: "Neuer Status" },
      patchReportCount: { content: "Anzahl Meldungen" },
      authorBanned: { content: "Autor gesperrt" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugriff erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Thread konnte nicht moderiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt aufgetreten" },
      noAuthor: {
        title: "Kein registrierter Autor",
        description:
          "Dieser Thread stammt von einem Gast, es gibt kein Konto zum Sperren",
      },
    },
    success: {
      title: "Inhalt moderiert",
      description: "Aktion erfolgreich angewendet",
    },
  },
};
