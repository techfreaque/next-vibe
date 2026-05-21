export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarme" },
  post: {
    title: "Massenalarm-Aktion",
    description:
      "Alle Alarme, die dem Filter entsprechen, quittieren, zurücksetzen oder löschen.",
    type: {
      label: "Aktion",
      description: "Auszuführende Massenaktion.",
    },
    filter: {
      label: "Filter",
      description: "OData-Filterausdruck zur Auswahl der betroffenen Alarme.",
      placeholder: "z.B. severity gt 3",
    },
    scopedOrganization: {
      label: "Organisation",
      description:
        "Aktion auf eine bestimmte Organisations-Ressourcen-ID einschränken.",
      placeholder: "z.B. exorde.connex.acme",
    },
    deviceName: {
      label: "Gerätename",
      description: "Aktion auf Alarme dieses Geräts einschränken.",
      placeholder: "z.B. mein-gerät",
    },
    comment: {
      label: "Kommentar",
      description: "Optionaler Kommentar zur Massenaktion.",
      placeholder: "Notiz hinzufügen…",
    },
    response: {
      success: "Ergebnis",
      message: "Meldung",
    },
    widget: {
      successTitle: "Massenaktion ausgeführt",
      successDescription:
        "Die Massenalarm-Aktion wurde erfolgreich ausgeführt.",
      submitButton: "Massenaktion ausführen",
      submitLoading: "Wird ausgeführt…",
      back: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Aktionstyp und Filter prüfen.",
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
        description: "Keine Berechtigung für Massenaktionen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Massenaktions-Endpunkt nicht gefunden.",
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
      description: "Massenalarm-Aktion ausgeführt.",
    },
  },
};
