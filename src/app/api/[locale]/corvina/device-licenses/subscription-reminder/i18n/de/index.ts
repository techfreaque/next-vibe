export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätelizenzen",
    reminder: "Abonnement-Erinnerung",
  },
  post: {
    title: "Abonnement-Erinnerungen senden",
    description:
      "Prüft alle Geräte, deren Abonnement innerhalb von 30 Tagen abläuft, und sendet eine Erinnerung. Einmal pro Ablaufzyklus pro Gerät.",
    response: {
      checked: "Geprüfte Geräte",
      reminded: "Gesendete Erinnerungen",
      errors: { item: "Fehler" },
    },
    widget: {
      title: "Abonnement-Erinnerungen",
      run: "Jetzt ausführen",
      runAgain: "Erneut ausführen",
      loading: "Erinnerungen werden gesendet…",
      result: "Erinnerungslauf abgeschlossen.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Fehlerhafte Anfrage.",
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
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden." },
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
    success: { title: "Fertig", description: "Erinnerungslauf abgeschlossen." },
  },
  email: {
    subject: "Ihr Geräteabonnement läuft in {days} Tagen ab",
    greeting: "Hinweis zum Abonnementablauf",
    body: "Das Abonnement für Gerät {label} ({logicalId}) in der Organisation {org} läuft am {date} ab.",
    cta: "Kontaktieren Sie uns zur Verlängerung",
    adminSubject: "[Admin] Abonnement läuft ab: {label}",
    adminBody:
      "Gerät {label} ({logicalId}) in Org {org} läuft am {date} ab. Kunden-E-Mail: {clientEmail}.",
  },
};
