export const translations = {
  post: {
    title: "Linux-Benutzer erstellen",
    description: "Neues OS-Benutzerkonto auf dem Host erstellen",
    fields: {
      username: {
        label: "Benutzername",
        description:
          "Kleinbuchstaben alphanumerisch + Bindestrich, 1-32 Zeichen",
        placeholder: "alice",
      },
      groups: {
        label: "Gruppen",
        description: "Zusätzliche Gruppen für den Benutzer",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Shell",
        description: "Login-Shell",
        placeholder: "/bin/bash",
      },
      homeDir: {
        label: "Heimverzeichnis",
        description: "Heimverzeichnispfad (Standard: /home/benutzername)",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Sudo-Zugang",
        description: "Zur sudo-Gruppe hinzufügen (nicht empfohlen)",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: { title: "Verboten", description: "LOCAL_MODE erforderlich" },
      server: {
        title: "Serverfehler",
        description: "Benutzer konnte nicht erstellt werden",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: {
        title: "Konflikt",
        description: "Benutzername existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Benutzer erstellt",
      description: "OS-Benutzerkonto erfolgreich erstellt",
    },
  },
  widget: {
    title: "Linux-Benutzer erstellen",
    createButton: "Benutzer erstellen",
    creating: "Erstellt...",
    sudoWarning:
      "Sudo-Zugang zu gewähren ist ein Sicherheitsrisiko. Mit Vorsicht verwenden.",
  },
};
