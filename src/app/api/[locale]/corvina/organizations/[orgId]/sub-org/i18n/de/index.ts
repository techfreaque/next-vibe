export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  post: {
    title: "Unterorganisation erstellen",
    description:
      "Erstellt eine untergeordnete Organisation unter einer bestehenden Corvina-Organisation.",
    orgId: {
      label: "Übergeordnete Organisations-ID",
      description: "Numerische ID der übergeordneten Corvina-Organisation.",
    },
    name: {
      label: "Name",
      description:
        "Kleingeschriebener Slug (Buchstaben, Zahlen, Bindestriche, Unterstriche).",
      placeholder: "meine-unterorg",
    },
    label: {
      label: "Bezeichnung",
      description: "Lesbarer Anzeigename in der Corvina-Oberfläche.",
      placeholder: "Meine Unterorganisation",
    },
    privateAccess: {
      label: "Privater Zugriff",
      description: "Zugriff auf VPN-verbundene Nutzer beschränken.",
    },
    allowDisablePrivateAccess: {
      label: "Deaktivierung erlauben",
      description:
        "Nutzern erlauben, die Privatzugriff-Beschränkung vorübergehend aufzuheben.",
    },
    hostname: {
      label: "Eigener Hostname",
      description: "Optionaler Hostname für diese Unterorganisation.",
      placeholder: "https://sub.beispiel.de",
    },
    allowHostname: {
      label: "Eigenen Hostname erlauben",
      description: "Das Hostname-Feld aktivieren.",
    },
    dataEnabled: {
      label: "Datendienst aktiv",
      description: "Datendienste für diese Organisation aktivieren.",
    },
    vpnEnabled: {
      label: "VPN aktiv",
      description: "VPN-Zugriff für diese Organisation aktivieren.",
    },
    storeEnabled: {
      label: "Shop aktiv",
      description: "Corvina-Shop für diese Organisation aktivieren.",
    },
    mfaRequired: {
      label: "MFA erforderlich",
      description:
        "Multi-Faktor-Authentifizierung für alle Benutzer erzwingen.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Bezeichnung",
      status: "Status",
      resourceId: "Ressourcen-ID",
    },
    submitButton: {
      label: "Unterorganisation erstellen",
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
          "Der API-Schlüssel hat keine Berechtigung zum Erstellen von Unterorganisationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine übergeordnete Organisation mit dieser ID gefunden.",
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
      title: "Erstellt",
      description: "Unterorganisation erfolgreich erstellt.",
    },
  },
};
