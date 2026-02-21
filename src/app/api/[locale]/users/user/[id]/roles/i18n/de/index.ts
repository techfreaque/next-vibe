export const translations = {
  roles: {
    post: {
      title: "Benutzerrolle hinzufügen",
      description: "Einem bestimmten Benutzerkonto eine Rolle zuweisen",
      container: {
        title: "Rolle hinzufügen",
        description:
          "Wählen Sie eine Rolle aus, die diesem Benutzer gewährt werden soll",
      },
      id: {
        label: "Benutzer-ID",
        description:
          "Eindeutige Kennung des Benutzers, dem die Rolle zugewiesen werden soll",
        placeholder: "Benutzer-ID eingeben...",
      },
      role: {
        label: "Rolle",
        description: "Die dem Benutzer zu gewährende Rolle",
        placeholder: "Rolle auswählen...",
      },
      submit: {
        label: "Rolle hinzufügen",
      },
      response: {
        roleId: {
          content: "Rollenzuweisungs-ID",
        },
        userId: {
          content: "Benutzer-ID",
        },
        assignedRole: {
          content: "Zugewiesene Rolle",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um Benutzerrollen zu verwalten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Bitte geben Sie eine gültige Benutzer-ID und Rolle an",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Nur Administratoren können Benutzerrollen verwalten",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Der angegebene Benutzer konnte nicht gefunden werden",
        },
        conflict: {
          title: "Rolle bereits zugewiesen",
          description: "Dieser Benutzer hat die angegebene Rolle bereits",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server nicht möglich",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Rolle konnte aufgrund eines Serverfehlers nicht hinzugefügt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Beim Hinzufügen der Rolle ist ein unerwarteter Fehler aufgetreten",
        },
      },
      success: {
        title: "Rolle hinzugefügt",
        description: "Die Rolle wurde dem Benutzer erfolgreich gewährt",
      },
    },
    delete: {
      title: "Benutzerrolle entfernen",
      description: "Eine Rolle von einem bestimmten Benutzerkonto entziehen",
      container: {
        title: "Rolle entfernen",
        description:
          "Wählen Sie eine Rolle aus, die diesem Benutzer entzogen werden soll",
      },
      id: {
        label: "Benutzer-ID",
        description:
          "Eindeutige Kennung des Benutzers, dem die Rolle entzogen werden soll",
        placeholder: "Benutzer-ID eingeben...",
      },
      role: {
        label: "Rolle",
        description: "Die dem Benutzer zu entziehende Rolle",
        placeholder: "Rolle auswählen...",
      },
      submit: {
        label: "Rolle entfernen",
      },
      response: {
        success: {
          content: "Rolle entfernt",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um Benutzerrollen zu verwalten",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Bitte geben Sie eine gültige Benutzer-ID und Rolle an",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Nur Administratoren können Benutzerrollen verwalten",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Der angegebene Benutzer konnte nicht gefunden werden",
        },
        conflict: {
          title: "Konfliktfehler",
          description:
            "Rolle konnte aufgrund bestehender Abhängigkeiten nicht entfernt werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server nicht möglich",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Rolle konnte aufgrund eines Serverfehlers nicht entfernt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Beim Entfernen der Rolle ist ein unerwarteter Fehler aufgetreten",
        },
      },
      success: {
        title: "Rolle entfernt",
        description: "Die Rolle wurde dem Benutzer erfolgreich entzogen",
      },
    },
  },
};
