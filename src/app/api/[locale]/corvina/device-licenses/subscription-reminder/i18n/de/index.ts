export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Geräte-Abonnements",
    reminder: "Ablauferinnerungen",
  },
  post: {
    title: "Ablauferinnerungen senden",
    description:
      "Scannt alle Geräte, deren Abonnement innerhalb von 30 Tagen abläuft, und sendet eine Erinnerung an die hinterlegte E-Mail-Adresse. Jedes Gerät wird pro Ablaufzyklus nur einmal benachrichtigt.",
    response: {
      checked: "Geprüfte Geräte",
      reminded: "Gesendete Erinnerungen",
      errors: { item: "Fehler" },
    },
    widget: {
      title: "Ablauferinnerungen senden",
      back: "Zurück",
      description:
        "Prüft alle aktiven Geräte-Abonnements. Für jedes Gerät, das innerhalb von 30 Tagen abläuft, wird eine E-Mail an die Kontaktadresse gesendet. Mehrfaches Ausführen ist sicher — jedes Gerät erhält pro Zyklus nur eine E-Mail.",
      run: "Jetzt ausführen",
      runAgain: "Erneut ausführen",
      loading: "Geräte werden geprüft und Erinnerungen gesendet…",
      result: "Lauf abgeschlossen.",
      noErrors: "Keine Fehler.",
      sections: {
        about: "Was dieser Job macht",
        results: "Ergebnisse",
      },
      scanNote: "Prüft alle Geräte, deren Abonnement in 30 Tagen abläuft",
      safeNote: "Mehrfach ausführbar — ein E-Mail pro Gerät pro Zyklus",
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
      forbidden: {
        title: "Zugriff verweigert",
        description: "Admin-Zugriff erforderlich.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Nicht gespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler.",
      },
    },
    success: {
      title: "Fertig",
      description: "Erinnerungslauf abgeschlossen.",
    },
  },
  email: {
    subject: "Ihr Geräte-Abonnement läuft in {days} Tagen ab",
    greeting: "Hinweis zum Ablauf Ihres Abonnements",
    body: "Das Abonnement für Gerät {label} ({logicalId}) in der Organisation {org} läuft am {date} ab.",
    cta: "Jetzt verlängern — kontaktieren Sie uns",
    adminSubject: "[Admin] Abonnement läuft ab: {label}",
    adminBody:
      "Gerät {label} ({logicalId}) in Org {org} läuft am {date} ab. Kunden-E-Mail: {clientEmail}.",
  },
};
