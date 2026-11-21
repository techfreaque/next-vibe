import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "Media Studio",
    history: "Verlauf",
  },
  get: {
    title: "Deine Generierungen",
    titleShort: "Generierungen",
    description:
      "Bilder, Videos, Musik, Sprachausgaben und Transkripte aus dem Studio, aus Chats und über die API. Neueste zuerst.",
    fields: {
      kind: {
        label: "Typ",
        description:
          "image, video, music, speech oder transcribe. Leer lassen für alles.",
      },
    },
    response: {
      items: "Generierungen",
      id: "ID",
      kind: "Typ",
      title: "Prompt",
      createdAt: "Erstellt",
      status: "Status",
      url: "Datei",
      transcript: "Transkript",
      credits: "Credits",
      model: "Modell",
      settings: "Einstellungen",
      source: "Erstellt in",
      threadId: "Chat",
      rootFolderId: "Ordner",
    },
    success: {
      title: "Verlauf geladen",
      description: "Deine Generierungen sind aufgelistet.",
    },
    errors: {
      validation: {
        title: "Ungültiger Filter",
        description: "Typ und Seite prüfen, dann erneut versuchen.",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Melde dich an, um deine Generierungen zu sehen.",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Du siehst nur deine eigenen Generierungen.",
      },
      notFound: {
        title: "Nichts gefunden",
        description: "Keine Generierung passt zu diesem Filter.",
      },
      server: {
        title: "Verlauf nicht verfügbar",
        description:
          "Dein Verlauf ließ sich nicht laden. Versuch es gleich noch einmal.",
      },
      network: {
        title: "Verbindung unterbrochen",
        description: "Prüf deine Verbindung und versuch es erneut.",
      },
      unknown: {
        title: "Etwas ist schiefgelaufen",
        description: "Dein Verlauf ließ sich nicht laden. Versuch es erneut.",
      },
      conflict: {
        title: "Verlauf geändert",
        description: "Neu laden, um die neuesten Ergebnisse zu sehen.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Speichere oder verwirf zuerst deine Änderungen.",
      },
    },
  },
  widget: {
    title: "Deine Generierungen",
    titles: {
      image: "Deine Bilder",
      video: "Deine Videos",
      music: "Deine Tracks",
      speech: "Deine Sprachaufnahmen",
      transcribe: "Deine Transkripte",
    },
    count: "{{count}} insgesamt",
    error: "Dein Verlauf wurde nicht geladen.",
    retry: "Neu laden",
    emptyTitle: "Noch nichts erstellt",
    emptyHint: "Jedes Ergebnis landet hier, fertig zum Herunterladen.",
    emptyKindHint: "Dein erstes Ergebnis erscheint hier, sobald es fertig ist.",
    runAgain: "Wiederholen",
    download: "Herunterladen",
    copyPrompt: "Prompt kopieren",
    copied: "Kopiert",
    copyFailed: "Kopieren blockiert",
    openInChat: "Im Chat öffnen",
    continueInChat: "Im Chat weitermachen",
    chatPrompt: "Das habe ich erstellt: {{url}}\n\nPrompt: {{prompt}}",
    open: "In voller Größe öffnen",
    credits: "{{amount}} Credits",
    source: {
      studio: "im Studio",
      chat: "im Chat",
      api: "per API",
    },
    status: {
      queued: "In der Warteschlange",
      running: "Wird generiert",
      saving: "Datei wird gespeichert",
      completed: "Fertig",
      failed: "Fehlgeschlagen",
    },
    pendingHint: "Video und Musik brauchen oft ein paar Minuten.",
    kinds: {
      image: "Bild",
      video: "Video",
      music: "Musik",
      speech: "Sprache",
      transcribe: "Transkript",
    },
  },
};
