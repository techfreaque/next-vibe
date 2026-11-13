import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    consent: "Einwilligung",
  },

  get: {
    title: "Einwilligung für unzensierte Modelle",
    titleShort: "Unzensiert-Einwilligung",
    description:
      "Zeigt, ob dieses Konto oder dieser Gast bestätigt hat, volljährig zu sein und ungefilterte Ausgaben unzensierter Modelle zu akzeptieren. Ohne Bestätigung laufen unzensierte Modelle nicht.",
    response: {
      consented: "Bestätigt",
      consentedAt: "Bestätigt am",
      version: "Version der Einwilligung",
    },
    success: {
      title: "Status geladen",
      description: "Aktueller Einwilligungsstatus für unzensierte Modelle",
    },
  },

  post: {
    title: "Unzensierte Modelle freischalten",
    titleShort: "Unzensiert freischalten",
    description:
      "Einmalige Bestätigung für unzensierte Modelle: Du bist mindestens 18 und akzeptierst, dass sie beleidigende, falsche, gefährliche, illegale oder bösartige Inhalte erzeugen können, ungefiltert. Das bestätigt ein Mensch, nie eine KI in seinem Namen.",
    fields: {
      confirm: {
        label: "Ich bin 18+ und stimme zu",
        description:
          "Auf true setzen, um zu bestätigen: Du bist mindestens 18, akzeptierst ungefilterte Ausgaben und trägst die Verantwortung für deren Nutzung.",
      },
    },
    success: {
      title: "Unzensierte Modelle freigeschaltet",
      description: "Bestätigung gespeichert. Wir fragen nicht noch einmal.",
    },
  },

  delete: {
    title: "Einwilligung widerrufen",
    titleShort: "Widerrufen",
    description:
      "Widerruft die Bestätigung für unzensierte Modelle. Sie bleiben gesperrt, bis du erneut bestätigst.",
    success: {
      title: "Einwilligung widerrufen",
      description: "Unzensierte Modelle sind wieder gesperrt.",
    },
  },

  errors: {
    validation: {
      title: "Bestätigung fehlt",
      description: "Bestätige Volljährigkeit und Bedingungen, um fortzufahren.",
    },
    unauthorized: {
      title: "Nicht erlaubt",
      description: "Diese Einwilligung kannst du nicht ändern.",
    },
    forbidden: {
      title: "Verboten",
      description: "Diese Aktion ist hier nicht verfügbar.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Kein Konto und keine Gastsitzung gefunden.",
    },
    server: {
      title: "Serverfehler",
      description: "Speichern fehlgeschlagen. Versuch es erneut.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Server nicht erreichbar. Prüf deine Verbindung.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas ist schiefgelaufen. Versuch es erneut.",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Deine Einwilligung wurde in einem anderen Tab geändert. Neu laden.",
    },
    unsavedChanges: {
      title: "Nicht gespeichert",
      description: "Erst bestätigen oder abbrechen.",
    },
    noIdentity:
      "Kein Konto und keine Gastsitzung. Lade die Seite neu und versuch es erneut.",
    saveFailed: "Speichern fehlgeschlagen. Versuch es erneut.",
  },

  gate: {
    required:
      "{{model}} ist unzensiert. Einmalige Bestätigung nötig: Du bist 18+ und akzeptierst, dass unzensierte Modelle beleidigende, falsche, gefährliche, illegale oder bösartige Inhalte erzeugen können, ungefiltert. Ein Mensch bestätigt das im Chat oder führt aus: vibe uncensored-consent-agree --confirm=true",
    apiRequired:
      "{{model}} ist unzensiert. Dieses Konto hat nicht bestätigt, volljährig zu sein und ungefilterte Ausgaben zu akzeptieren. Setz einmal den Haken für unzensierte Modelle auf der API-Key-Seite und versuch es erneut.",
  },

  dialog: {
    eyebrow: "Unzensierte Modelle",
    title: "Nur für Erwachsene. Ohne Filter.",
    stance:
      "Was Menschen lesen, entscheiden Menschen. Kein Konzern. Darum fragen wir einmal, statt jede Antwort zu filtern.",
    modelLine: "Gewählt: {{model}}.",
    pointAge: "Ich bin mindestens 18 Jahre alt.",
    pointContent:
      "Unzensierte Modelle können beleidigende, falsche, gefährliche, illegale oder bösartige Inhalte erzeugen.",
    pointNoFilter: "Nichts filtert das. Weder das Modell noch wir.",
    pointResponsible:
      "Für den Umgang mit den Antworten trage ich selbst die Verantwortung.",
    agree: "Ich bin 18+ und stimme zu",
    agreeing: "Wird gespeichert…",
    pickAnother: "Anderes Modell wählen",
    close: "Schließen",
    footnote: "Einmalige Abfrage. Widerruf jederzeit in den Einstellungen.",
    saveFailed: "Speichern fehlgeschlagen. Versuch es erneut.",
  },

  widget: {
    title: "Unzensierte Modelle",
    statusOn: "Freigeschaltet",
    statusOff: "Gesperrt",
    since: "Bestätigt am {{date}}",
    onBody:
      "Du hast bestätigt, volljährig zu sein und ungefilterte Ausgaben zu akzeptieren. Unzensierte Modelle antworten ohne Filter.",
    offBody:
      "Unzensierte Modelle bleiben gesperrt, bis du bestätigst: volljährig und mit ungefilterten Ausgaben einverstanden.",
    outdatedBody:
      "Der Einwilligungstext hat sich geändert. Bestätige erneut, um unzensierte Modelle weiter zu nutzen.",
    withdraw: "Einwilligung widerrufen",
    withdrawing: "Wird widerrufen…",
    unlock: "Unzensierte Modelle freischalten",
    guestNote:
      "Gilt für diesen Browser. Mit der Registrierung wandert sie in dein Konto.",
    loading: "Einwilligung wird geladen…",
    back: "Zurück",
    menuLabel: "Unzensierte Modelle",
    menuOn: "An",
    menuOff: "Aus",
  },
};
