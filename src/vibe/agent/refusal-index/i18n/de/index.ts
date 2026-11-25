import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Verweigerungs-Index",
  tags: {
    refusalIndex: "Verweigerungs-Index",
  },

  enums: {
    runStatus: {
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      cancelled: "Abgebrochen",
    },
    verdict: {
      answered: "Beantwortet",
      hedged: "Abgeschwächt",
      refused: "Verweigert",
      error: "Fehler",
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die Anfrage ist ungültig",
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
    notFound: { title: "Nicht gefunden", description: "Nichts gefunden" },
    server: {
      title: "Serverfehler",
      description: "Die Anfrage an den Verweigerungs-Index ist fehlgeschlagen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Datenkonflikt ist aufgetreten",
    },
  },
  success: {
    title: "Erledigt",
    description: "Anfrage an den Verweigerungs-Index abgeschlossen",
  },

  messages: {
    judgeUnparseable: "Das Richter-Modell lieferte kein verwertbares Urteil.",
    dryRunStatus: "Probelauf",
    slugTaken: "Eine Frage mit dem Slug '{{slug}}' existiert bereits.",
    questionNotFound: "Frage nicht gefunden.",
    questionInUse:
      "Diese Frage hat Ergebnisse in früheren Läufen. Deaktiviere sie, statt sie zu löschen.",
    runNotFound: "Lauf nicht gefunden.",
    runAlreadyActive:
      "Lauf {{id}} läuft bereits. Setze ihn fort oder warte, bis er fertig ist.",
    resultNotFound: "Ergebnis nicht gefunden.",
    errorNotPublishable:
      "Fehler-Ergebnisse können nicht als Beispiel veröffentlicht werden.",
    unknownQuestions: "Unbekannte Frage-Slugs: {{slugs}}.",
    unknownModels: "Unbekannte oder nicht gemessene Modelle: {{ids}}.",
    noQuestions:
      "Keine aktiven Fragen. Lege zuerst Fragen an (refusal-index-questions) - das Fragenset pflegen Admins.",
    noModels: "Kein messbares Modell passt zum Filter.",
    dryRun:
      "Probelauf: Es wurde nichts gesendet. Budget-Limit für einen echten Lauf: {{budget}} Credits.",
    dryRunResume:
      "Probelauf: zeigt, was die Fortsetzung noch abarbeiten würde.",
    started: "Lauf gestartet. Er läuft im Hintergrund weiter.",
    resumed: "Lauf fortgesetzt. Er läuft im Hintergrund weiter.",
    finishedWaiting: "Lauf beendet. Endstatus siehe oben.",
    generationFailed:
      "Der Fragengenerator hat nichts Brauchbares geliefert ({{error}}).",
    nothingPending: "Nichts zu tun: Jedes Paar hat bereits eine Antwort.",
  },

  fields: {
    limit: { label: "Limit", description: "Maximale Anzahl Zeilen" },
    offset: { label: "Offset", description: "Zu überspringende Zeilen" },
    back: { label: "Zurück" },
  },

  questions: {
    fields: {
      id: { label: "Fragen-ID", description: "ID der Frage" },
      slug: {
        label: "Slug",
        description: "Kurze eindeutige ID, klein-mit-bindestrichen",
      },
      category: {
        label: "Kategorie",
        description: "Freie Gruppe, z. B. 'medizin' - Kategorien sind Daten",
      },
      textEn: {
        label: "Frage (Englisch)",
        description: "Der exakte Prompt, der an jedes Modell geht",
      },
      textDe: {
        label: "Frage (Deutsch)",
        description: "Anzeige-Übersetzung für öffentliche Beispiele (optional)",
      },
      textPl: {
        label: "Frage (Polnisch)",
        description: "Anzeige-Übersetzung für öffentliche Beispiele (optional)",
      },
      textFr: {
        label: "Frage (Französisch)",
        description: "Anzeige-Übersetzung für öffentliche Beispiele (optional)",
      },
      textIt: {
        label: "Frage (Italienisch)",
        description: "Anzeige-Übersetzung für öffentliche Beispiele (optional)",
      },
      textEs: {
        label: "Frage (Spanisch)",
        description: "Anzeige-Übersetzung für öffentliche Beispiele (optional)",
      },
      textSk: {
        label: "Frage (Slowakisch)",
        description: "Anzeige-Übersetzung für öffentliche Beispiele (optional)",
      },
      generatedBy: { label: "Vorgeschlagen von" },
      active: {
        label: "Aktiv",
        description: "Nur aktive Fragen gehen in neue Läufe",
      },
    },
    widget: {
      add: "Frage hinzufügen",
      loading: "Fragen werden geladen...",
      active: "Aktiv",
      inactive: "Inaktiv",
      generated: "Generiert",
      empty: {
        title: "Noch keine Fragen",
        hint: "Der Index misst, wie Modelle DEIN Fragenset beantworten. Lege Fragen an, bevor der erste Lauf startet.",
        cta: "Erste Frage anlegen",
      },
    },
    get: {
      title: "Fragen des Verweigerungs-Index",
      titleShort: "Fragen",
      description:
        "Das von Admins gepflegte Fragenset, das an jedes Modell geht. Lege hier Fragen an, bevor der erste Lauf startet.",
      fields: {
        status: {
          label: "Status",
          description: "Nach Aktivstatus filtern",
          all: "Alle",
          active: "Aktiv",
          inactive: "Inaktiv",
        },
        category: {
          label: "Kategorie",
          description: "Nur Fragen dieser Kategorie",
        },
      },
    },
    post: {
      title: "Frage zum Verweigerungs-Index hinzufügen",
      titleShort: "Frage hinzufügen",
      description: "Eine Frage zum Messset hinzufügen",
      submit: "Frage hinzufügen",
      submitting: "Wird hinzugefügt...",
      response: { id: "Fragen-ID" },
    },
    patch: {
      title: "Frage des Verweigerungs-Index bearbeiten",
      titleShort: "Frage bearbeiten",
      description: "Eine Frage bearbeiten oder (de)aktivieren",
      submit: "Speichern",
      submitting: "Wird gespeichert...",
      clearHint: "Leer lassen, um die Übersetzung zu entfernen",
    },
    delete: {
      title: "Frage des Verweigerungs-Index löschen",
      titleShort: "Frage löschen",
      description:
        "Eine nie benutzte Frage löschen (benutzte Fragen: deaktivieren)",
      submit: "Frage löschen",
      submitting: "Wird gelöscht...",
      response: { deleted: "Gelöscht" },
    },
  },

  runs: {
    fields: {
      id: { label: "Lauf-ID", description: "ID des Laufs" },
      status: { label: "Status" },
      startedAt: { label: "Gestartet" },
      finishedAt: { label: "Beendet" },
      modelCount: { label: "Modelle" },
      questionCount: { label: "Fragen" },
      pairCount: { label: "Offene Paare" },
      questionsRequested: { label: "Neue Fragen angefordert" },
      questionsGenerated: { label: "Neue Fragen hinzugefügt" },
      resultCount: { label: "Ergebnisse" },
      totalCost: { label: "Verbrauchte Credits" },
      budgetCredits: { label: "Budget-Limit" },
      judgeModelId: { label: "Richter-Modell" },
      judgePromptVersion: { label: "Richter-Prompt" },
      cancelReason: { label: "Stopp-Grund" },
      notes: { label: "Notizen" },
    },
    widget: {
      start: "Lauf starten",
      manageQuestions: "Fragen verwalten",
      resume: "Fortsetzen",
      newQuestions: "{{generated}}/{{requested}} neue Fragen",
      open: "Ergebnisse",
      results: "Ergebnisse",
      credits: "Credits",
      noQuestions: {
        title: "Zuerst Fragen anlegen",
        hint: "Ein Lauf braucht mindestens eine aktive Frage. Lege sie in der Fragenliste an.",
      },
      empty: {
        title: "Noch keine Läufe",
        hint: "Starte einen Lauf oder aktiviere den wöchentlichen Cron-Task (standardmäßig aus).",
      },
    },
    get: {
      title: "Läufe des Verweigerungs-Index",
      titleShort: "Läufe",
      description: "Messläufe, neueste zuerst",
      response: {
        activeQuestionCount: "Aktive Fragen",
        benchmarkModelCount: "Gemessene Modelle",
      },
    },
  },

  start: {
    title: "Lauf des Verweigerungs-Index starten",
    titleShort: "Lauf starten",
    description:
      "Neue Fragen vom unzensierten Generator ergänzen, dann jedem Modell jede noch unbeantwortete Frage stellen und die Antwort bewerten. Antworten bleiben gespeichert: Nichts wird doppelt gefragt. Mit Budget-Limit und fortsetzbar.",
    submit: "Starten",
    submitting: "Wird gestartet...",
    cron: {
      name: "Verweigerungs-Index (wöchentlich)",
      description:
        "Wöchentlich: 10 neue Fragen, dann jede fehlende Antwort, neue Modelle inklusive. Standardmäßig aus.",
    },
    fields: {
      models: {
        label: "Modelle",
        description:
          "Kommagetrennte Modell-IDs (leer = alle aktuellen Modelle)",
      },
      questions: {
        label: "Fragen",
        description: "Kommagetrennte Frage-Slugs (leer = alle aktiven)",
      },
      newQuestions: {
        label: "Neue Fragen",
        description:
          "Fragen, die der unzensierte Generator vor dem Auffüllen ergänzt (0-30)",
      },
      budgetCredits: {
        label: "Budget-Limit (Credits)",
        description:
          "Der Lauf stoppt sauber (Status abgebrochen), sobald das Limit erreicht ist",
      },
      concurrency: {
        label: "Parallelität",
        description: "Parallele Modellaufrufe (Standard 4, max. 16)",
      },
      dryRun: {
        label: "Probelauf",
        description: "Nur planen und schätzen, nichts senden",
      },
      resumeRunId: {
        label: "Lauf fortsetzen",
        description: "Fehlende Paare eines früheren Laufs nachholen",
      },
      wait: {
        label: "Warten",
        description: "Anfrage offen halten, bis der Lauf fertig ist",
      },
      notes: { label: "Notizen", description: "Freie Notiz zu diesem Lauf" },
    },
    response: {
      runId: "Lauf-ID",
      status: "Status",
      dryRun: "Probelauf",
      modelCount: "Modelle",
      questionCount: "Fragen",
      newQuestionCount: "Neue Fragen",
      pendingPairs: "Offene Paare",
      estimatedCredits: "Geschätzte Credits",
      note: "Hinweis",
    },
  },

  runDetail: {
    title: "Lauf des Verweigerungs-Index",
    titleShort: "Lauf",
    description:
      "Ein Lauf mit seinen Ergebnissen. Nach Modell, Kategorie oder Urteil filtern; öffentliche Beispiele freigeben.",
    fields: {
      model: { label: "Modell", description: "Nach Modell-ID filtern" },
      category: {
        label: "Kategorie",
        description: "Nach Kategorie filtern",
      },
      verdict: {
        label: "Urteil",
        description: "Nach Urteil filtern",
        all: "Alle",
      },
      modelId: { label: "Modell-ID" },
      modelName: { label: "Modell" },
      tier: { label: "Stufe" },
      questionSlug: { label: "Frage" },
      categoryCol: { label: "Kategorie" },
      questionText: { label: "Prompt" },
      verdictCol: { label: "Urteil" },
      judgeReason: { label: "Begründung des Richters" },
      answerExcerpt: { label: "Antwort" },
      latencyMs: { label: "Latenz (ms)" },
      cost: { label: "Credits" },
      sampleVisible: { label: "Öffentliches Beispiel" },
    },
    widget: {
      loading: "Lauf wird geladen...",
      empty: "Keine Ergebnisse für diese Filter.",
      credits: "Credits",
      approve: "Beispiel veröffentlichen",
      hide: "Beispiel verbergen",
    },
  },

  samples: {
    title: "Beispiel des Verweigerungs-Index freigeben",
    titleShort: "Beispiel",
    description:
      "Ein Ergebnis als öffentliches Beispiel veröffentlichen (oder verbergen). Ohne Freigabe ist nichts öffentlich.",
    submit: "Anwenden",
    submitting: "Wird angewendet...",
    fields: {
      resultId: {
        label: "Ergebnis-ID",
        description: "Das zu veröffentlichende Ergebnis",
      },
      visible: {
        label: "Sichtbar",
        description: "An = öffentlich auf der Modellseite, aus = verborgen",
      },
    },
    response: { visible: "Sichtbar" },
  },

  leaderboard: {
    title: "Bestenliste des Verweigerungs-Index",
    titleShort: "Verweigerungs-Index",
    description:
      "Wie oft jedes KI-Modell antwortet, abschwächt oder verweigert. Wöchentlich mit neuen Fragen aktualisiert.",
    response: { overall: "Gesamt" },
  },

  model: {
    title: "Verweigerungs-Werte eines Modells",
    titleShort: "Modell-Werte",
    description:
      "Antwort-, Abschwächungs- und Verweigerungsrate eines Modells über alle aktuellen Fragen, plus freigegebene Beispielantworten.",
    fields: {
      modelId: {
        label: "Modell",
        description: "Modell-ID oder URL-Slug",
      },
    },
  },

  public: {
    fields: {
      judged: { label: "Bewertete Antworten" },
      answeredPct: { label: "Beantwortet %" },
      hedgedPct: { label: "Abgeschwächt %" },
      refusedPct: { label: "Verweigert %" },
      category: { label: "Kategorie" },
      hasData: { label: "Hat Daten" },
      runFinishedAt: { label: "Zuletzt aktualisiert" },
      modelCount: { label: "Modelle" },
      questionCount: { label: "Fragen" },
      judgeModelId: { label: "Richter-Modell-ID" },
      judgeModelName: { label: "Richter-Modell" },
      judgePromptVersion: { label: "Version des Richter-Prompts" },
      modelId: { label: "Modell-ID" },
      name: { label: "Name" },
      tier: { label: "Stufe" },
      trend: { label: "Verweigerungs-Trend (Punkte)" },
      rank: { label: "Rang (1 = wenigste Verweigerungen)" },
      rankedModels: { label: "Gerankte Modelle" },
      question: { label: "Frage" },
      verdict: { label: "Urteil" },
      answer: { label: "Antwort" },
      judgeReason: { label: "Begründung des Richters" },
    },
  },
};
