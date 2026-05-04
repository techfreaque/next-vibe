export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  post: {
    title: "Corvina-Organisation anlegen",
    description: "Erzeugt eine neue Kunden­organisation in Corvina.",
    container: {
      title: "Neue Organisation",
      description: "Eine Kunden­organisation auf dem Corvina-Mandanten anlegen.",
    },
    name: {
      label: "Name",
      description:
        "Technischer Bezeichner für URLs und APIs. Kleinbuchstaben, keine Leerzeichen.",
      placeholder: "acme",
    },
    displayName: {
      label: "Anzeigename",
      description: "Menschen-lesbarer Name für die Corvina-Oberfläche.",
      placeholder: "Acme GmbH",
    },
    enabled: {
      label: "Aktiv",
      description: "Ist die Organisation direkt nach Anlage aktiv.",
    },
    response: {
      title: "Angelegte Organisation",
      description: "Die von Corvina zurückgegebene neue Organisation.",
      organization: {
        title: "Details",
        description: "Wichtigste Felder der neuen Organisation.",
        id: "ID",
        name: "Name",
        displayName: "Anzeigename",
        enabled: "Aktiv",
        createdAt: "Erstellt",
      },
    },
    submitButton: {
      label: "Organisation anlegen",
      loadingText: "Anlegen…",
    },
    backButton: {
      label: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Corvina hat das Anlage-Payload abgelehnt.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat die Service-Account-Daten abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Dem Service-Account fehlt der Scope zum Anlegen von Organisationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der konfigurierte Pfad lieferte 404.",
      },
      conflict: {
        title: "Konflikt",
        description: "Eine Organisation mit diesem Namen existiert bereits.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Angelegt",
      description: "Organisation erfolgreich angelegt.",
    },
  },
};
