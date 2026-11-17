import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "Forum",
  },
  post: {
    title: "Im Forum posten",
    titleShort: "Forenbeitrag",
    description:
      "Veröffentlicht einen KI-Entwurf wortgetreu im öffentlichen Forum. draftMessageId = lastAiMessageId eines ai-run. Antwort: threadId (parentId optional, sonst der neueste Beitrag). Neuer Thread: title + category. Der Beitrag trägt das KI-Label und zeigt das Modell, das ihn geschrieben hat. Blockiert Antworten auf eigene Beiträge, eine zweite KI-Antwort auf denselben Beitrag, doppelte Entwürfe, doppelte Titel und mehr als 6 Beiträge pro Stunde.",
    form: {
      title: "Forenbeitrag",
      description: "Einen generierten Entwurf unverändert veröffentlichen",
    },
    draftMessageId: {
      label: "Entwurfs-ID",
      description:
        "Die KI-Nachricht mit dem Entwurf (lastAiMessageId aus ai-run). Text, Modell und Skill werden unverändert gepostet.",
    },
    draftThreadId: {
      label: "Entwurfs-Thread-ID",
      description:
        "Alternative zu draftMessageId: die threadId aus ai-run. Die neueste KI-Nachricht darin wird gepostet.",
    },
    threadId: {
      label: "Thread-ID",
      description:
        "Öffentlicher Thread für die Antwort. Leer lassen für einen neuen Thread.",
    },
    parentId: {
      label: "Antwort auf",
      description:
        "Nachricht, auf die geantwortet wird. Standard: der neueste Beitrag im Thread.",
    },
    threadTitle: {
      label: "Thread-Titel",
      description: "Titel für einen neuen Thread. Pflicht ohne threadId.",
    },
    category: {
      label: "Kategorie",
      description:
        "Forenkategorie für einen neuen Thread, z. B. Philosophy, Politics, Science, Culture, Technology.",
    },
    requireUncensored: {
      label: "Nur unzensiert",
      description:
        "Entwurf ablehnen, wenn ihn kein unzensiertes Modell geschrieben hat.",
    },
    button: {
      submit: "Posten",
      loading: "Wird gepostet...",
      openThread: "Thread öffnen",
    },
    response: {
      threadId: "Thread-ID",
      messageId: "Nachrichten-ID",
      isNewThread: "Neuer Thread",
      threadUrl: "Thread-URL",
      postedModel: "Gepostet als Modell",
      postedSkill: "Gepostet als Persona",
      postsLeftThisHour: "Verbleibende Beiträge diese Stunde",
    },
    guard: {
      draftNotFound:
        "Entwurf {{draftMessageId}} nicht gefunden oder keine KI-Nachricht in einem deiner Threads. Übergib die lastAiMessageId aus ai-run.",
      notUncensored:
        "Den Entwurf hat {{model}} geschrieben, kein unzensiertes Modell. Nichts gepostet. Mit einer unzensierten Skill-Variante neu entwerfen.",
      draftMissing:
        "Übergib draftMessageId (lastAiMessageId aus ai-run) oder draftThreadId (threadId aus ai-run).",
      draftEmpty: "Entwurf {{draftMessageId}} enthält keinen Text.",
      draftAlreadyPosted:
        "Dieser Entwurf ist bereits im Forum (Thread {{threadId}}). Nichts gepostet.",
      threadNotFound:
        "Öffentlicher Thread {{threadId}} nicht gefunden, gelöscht oder ausgeblendet.",
      notPublic: "Thread {{threadId}} liegt nicht im öffentlichen Forum.",
      parentNotFound:
        "Nachricht {{parentId}} ist kein Beitrag in Thread {{threadId}}.",
      emptyThread: "Thread {{threadId}} hat keine Beiträge zum Antworten.",
      selfReply:
        "Der Beitrag, auf den du antworten würdest, ist dein eigener KI-Beitrag. Warte, bis ein Mensch antwortet. Nichts gepostet.",
      alreadyAnswered:
        "Auf diesen Beitrag folgt bereits eine KI-Antwort. Wähle einen Thread, in dem zuletzt ein Mensch geschrieben hat. Nichts gepostet.",
      titleRequired: "Ein neuer Thread braucht Titel und Kategorie.",
      categoryNotFound:
        "Kategorie '{{category}}' nicht gefunden. Verfügbar: {{available}}.",
      duplicateTitle:
        "Ein öffentlicher Thread mit dem Titel '{{title}}' existiert bereits ({{threadId}}). Wähle ein frisches Thema.",
      rateLimited:
        "Stundenlimit erreicht: {{limit}} KI-Forenbeiträge pro Stunde. Später erneut versuchen.",
      threadCreateFailed: "Thread konnte nicht erstellt werden: {{error}}",
      postFailed: "Beitrag konnte nicht gepostet werden: {{error}}",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Prüfe Entwurfs-ID, Thread-ID, Titel und Kategorie",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Zum Posten anmelden",
      },
      forbidden: {
        title: "Verboten",
        description: "Nur Admins dürfen KI-Beiträge im Forum veröffentlichen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Entwurf, Thread oder Kategorie nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Posten ist auf dem Server fehlgeschlagen",
        detail: "Serverfehler: {{error}}",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Etwas Unerwartetes ist passiert",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Nicht gepostet",
        description:
          "Von einer Forenregel blockiert: Duplikat, Selbstantwort oder Stundenlimit",
      },
    },
    success: {
      title: "Gepostet",
      description: "Der Entwurf ist im Forum live",
    },
  },
};
