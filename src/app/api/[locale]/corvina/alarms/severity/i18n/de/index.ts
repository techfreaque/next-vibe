export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarme" },
  post: {
    title: "Alarm-Schweregrad-Zähler",
    description:
      "Gibt die Anzahl aktiver Alarme gruppiert nach Schweregrad zurück.",
    scopedOrganization: {
      label: "Organisation",
      description:
        "Zähler auf eine bestimmte Organisations-Ressourcen-ID einschränken.",
      placeholder: "z.B. exorde.connex.acme",
    },
    deviceName: {
      label: "Gerätename",
      description: "Zähler nach Gerätename filtern.",
      placeholder: "z.B. mein-gerät",
    },
    response: {
      data: {
        count: "Anzahl",
        severity: "Schweregrad",
      },
    },
    widget: {
      title: "Schweregrad-Zähler",
      noData: "Keine Alarmdaten.",
      severity: "Schweregrad",
      count: "Anzahl",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
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
        description: "Kein Zugriff auf Schweregrad-Zähler.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Schweregrad-Endpunkt nicht gefunden.",
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
      description: "Schweregrad-Zähler geladen.",
    },
  },
};
