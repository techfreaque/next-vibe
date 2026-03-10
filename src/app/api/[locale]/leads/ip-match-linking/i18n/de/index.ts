export const translations = {
  category: "Leads",
  tag: "IP-Übereinstimmungsverknüpfung",
  task: {
    description:
      "Anonyme Leads mit gleicher IP-Adresse scannen und als dieselbe Person verknüpfen",
  },
  post: {
    title: "IP-Übereinstimmungsverknüpfung",
    description: "Anonyme Leads mit gleicher IP-Adresse verknüpfen",
    container: {
      title: "IP-Übereinstimmungsverknüpfung",
      description:
        "Findet anonyme Leads mit übereinstimmenden IPs innerhalb des Zeitfensters und verknüpft sie",
    },
    fields: {
      dryRun: {
        label: "Testlauf",
        description: "Ohne Änderungen ausführen",
      },
      windowDays: {
        label: "Zeitfenster (Tage)",
        description:
          "Nur Leads abgleichen, die innerhalb dieser Anzahl von Tagen erstellt wurden",
      },
    },
    response: {
      pairsFound: "Gefundene Paare",
      pairsLinked: "Verknüpfte Paare",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler bei der IP-Übereinstimmungsverknüpfung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
    },
    success: {
      title: "IP-Verknüpfung abgeschlossen",
      description: "IP-übereinstimmende Leads erfolgreich verknüpft",
    },
  },
};
