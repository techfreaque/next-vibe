export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarme" },
  post: {
    title: "Alarm-Aktion",
    description:
      "Einen einzelnen Corvina-Alarm quittieren, zurücksetzen oder löschen.",
    alarmId: {
      label: "Alarm-ID",
      description: "ID des Alarms, auf den die Aktion angewendet wird.",
      placeholder: "z.B. alarm-001",
    },
    type: {
      label: "Aktion",
      description: "Auszuführende Aktion für den Alarm.",
    },
    comment: {
      label: "Kommentar",
      description: "Optionaler Kommentar zur Aktion.",
      placeholder: "Notiz hinzufügen…",
    },
    response: {
      success: "Ergebnis",
      message: "Meldung",
    },
    widget: {
      successTitle: "Aktion ausgeführt",
      successDescription: "Die Alarm-Aktion wurde erfolgreich ausgeführt.",
      submitButton: "Ausführen",
      submitLoading: "Wird ausgeführt…",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Alarm-ID und Aktionstyp prüfen.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina Platform API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung für diese Aktion.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Alarm nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Die Corvina Platform API meldet einen Serverfehler.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Erfolg",
      description: "Alarm-Aktion ausgeführt.",
    },
  },
};
