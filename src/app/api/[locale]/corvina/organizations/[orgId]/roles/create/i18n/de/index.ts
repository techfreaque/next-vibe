export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Rollen",
  },
  post: {
    title: "Rolle erstellen",
    description: "Erstellt eine neue Rolle in einer Corvina-Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    name: {
      label: "Name",
      description: "Rollenname (min. 2 Zeichen).",
      placeholder: "meine-rolle",
    },
    label: {
      label: "Bezeichnung",
      description: "Lesbarer Anzeigename in der Oberfläche.",
      placeholder: "Meine Rolle",
    },
    descriptionField: {
      label: "Beschreibung",
      description: "Optionale Beschreibung der Berechtigungen dieser Rolle.",
      placeholder: "Gewährt Zugriff auf…",
    },
    type: {
      label: "Rollentyp",
      description: "Art der Ressource, auf die sich diese Rolle bezieht.",
    },
    enabled: {
      label: "Aktiv",
      description: "Rolle direkt nach der Erstellung aktivieren.",
    },
    defaultStar: {
      label: "Standardrolle",
      description: "Diese Rolle neuen Benutzern automatisch zuweisen.",
    },
    deviceGeneralPermission: {
      label: "Geräteberechtigung",
      description: "Allgemeine Berechtigungsstufe für Gerätezugriff.",
    },
    vpnGeneralPermission: {
      label: "VPN-Berechtigung",
      description: "Allgemeine Berechtigungsstufe für VPN-Zugriff.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Bezeichnung",
      type: "Typ",
      enabled: "Aktiv",
    },
    submitButton: {
      label: "Rolle erstellen",
      loadingText: "Wird erstellt…",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Der API-Schlüssel hat keine Berechtigung zum Erstellen von Rollen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Eine Rolle mit diesem Namen existiert bereits.",
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
      title: "Erstellt",
      description: "Rolle erfolgreich erstellt.",
    },
  },
};
