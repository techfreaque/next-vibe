export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  post: {
    title: "Gerät hinzufügen",
    description: "Fügt ein neues Gerät zu einer Corvina-Organisation hinzu.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    name: {
      label: "Gerätename",
      description: "Eindeutiger maschinenlesbarer Name.",
      placeholder: "mein-geraet-01",
    },
    label: {
      label: "Bezeichnung",
      description: "Menschenlesbarer Anzeigename.",
      placeholder: "Mein Gerät",
    },
    response: { deviceId: "Geräte-ID", name: "Name", label: "Bezeichnung" },
    submitButton: {
      label: "Gerät hinzufügen",
      loadingText: "Wird hinzugefügt…",
    },
    backButton: { label: "Abbrechen" },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Gerätenamen-Format prüfen.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Verboten",
        description: "Kein Schreibzugriff auf diese Organisation.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Organisation nicht gefunden.",
      },
      conflict: {
        title: "Bereits vorhanden",
        description: "Ein Gerät mit diesem Namen existiert bereits.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina meldet einen Serverfehler.",
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
    widget: {
      added: "Gerät hinzugefügt",
    },
    success: {
      title: "Gerät hinzugefügt",
      description: "Das Gerät wurde erfolgreich erstellt.",
    },
  },
};
