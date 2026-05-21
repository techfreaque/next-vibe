export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Geräte-Abonnements",
    purchaseInquiry: "Kaufanfrage",
  },
  post: {
    title: "Abonnement-Verlängerung anfragen",
    description:
      "Anfrage zur Verlängerung für ein Gerät ohne aktives Abonnement. Wir melden uns innerhalb eines Werktages.",
    logicalId: {
      label: "Geräte-ID",
      description: "Der eindeutige Bezeichner des Geräts.",
    },
    orgResourceId: {
      label: "Organisation",
      description: "Die Organisation, zu der dieses Gerät gehört.",
    },
    deviceLabel: {
      label: "Gerätename",
      description: "Anzeigename des Geräts.",
    },
    contactName: {
      label: "Kontaktname",
      description: "Vollständiger Name der Kontaktperson.",
    },
    contactEmail: {
      label: "E-Mail-Adresse",
      description: "E-Mail-Adresse für Rückmeldungen.",
    },
    contactPhone: {
      label: "Telefonnummer",
      description: "Optionale Telefonnummer für Rückmeldungen.",
    },
    inquiryMessage: {
      label: "Nachricht",
      description: "Weitere Informationen oder Anforderungen.",
    },
    requestedMonths: {
      label: "Gewünschte Laufzeit (Monate)",
      description: "Für wie viele Monate interessieren Sie sich?",
    },
    response: {
      inquiryId: "Anfrage-ID",
      confirmationMessage: "Bestätigung",
    },
    widget: {
      title: "Abonnement-Verlängerung anfragen",
      back: "Zurück",
      description:
        "Füllen Sie Ihre Kontaktdaten aus — wir melden uns innerhalb eines Werktages zu Ihren Abonnementoptionen.",
      submit: "Anfrage einreichen",
      submitAnother: "Weitere Anfrage einreichen",
      submittedLabel: "Anfrage eingereicht",
      sections: {
        device: "Geräte",
        contact: "Kontaktdaten",
      },
      selected: "ausgewählt",
      selectAll: "Alle auswählen",
      deselectAll: "Alle abwählen",
      noSub: "Kein Abo",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Bitte prüfen Sie die Felder.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich.",
      },
      forbidden: { title: "Verboten", description: "Nicht erlaubt." },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerät nicht gefunden.",
      },
      conflict: { title: "Konflikt", description: "Konflikt." },
      server: { title: "Serverfehler", description: "Interner Serverfehler." },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Ungespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler.",
      },
    },
    success: {
      title: "Anfrage eingereicht",
      description: "Wir melden uns innerhalb eines Werktages.",
    },
  },
  email: {
    subject: "Neue Abonnementanfrage: {deviceId}",
    heading: "Neue Abonnementanfrage",
    device: "Gerät",
    org: "Organisation",
    contact: "Kontakt",
    email: "E-Mail",
    phone: "Telefon",
    months: "Gewünschte Monate",
    messageLabel: "Nachricht",
    noPhone: "Nicht angegeben",
    noMessage: "Keine Nachricht",
    noMonths: "Nicht angegeben",
  },
};
