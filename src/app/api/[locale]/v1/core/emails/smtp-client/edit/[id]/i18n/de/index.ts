import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "SMTP-Konto anzeigen",
    description: "SMTP-Konto-Details abrufen",
    container: {
      title: "SMTP-Konto-Details",
      description: "SMTP-Konto-Konfiguration anzeigen",
    },
  },
  put: {
    title: "SMTP-Konto bearbeiten",
    description: "Bestehendes SMTP-Konto bearbeiten",
    container: {
      title: "SMTP-Konto-Einstellungen",
      description: "SMTP-Konto-Konfiguration aktualisieren",
    },
    updates: {
      title: "Felder aktualisieren",
      description: "Zu aktualisierende Felder",
    },
  },
  fields: {
    id: {
      label: "Konto-ID",
      description: "Die eindeutige Kennung für das SMTP-Konto",
    },
    name: {
      label: "Kontoname",
      description: "Der Name des SMTP-Kontos",
      placeholder: "Kontonamen eingeben",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung des SMTP-Kontos",
      placeholder: "Beschreibung eingeben",
    },
    host: {
      label: "SMTP-Host",
      description: "Der SMTP-Server-Hostname",
      placeholder: "smtp.beispiel.de",
    },
    port: {
      label: "Port",
      description: "Der SMTP-Server-Port",
      placeholder: "587",
    },
    securityType: {
      label: "Sicherheitstyp",
      description: "Das zu verwendende Sicherheitsprotokoll",
      placeholder: "Sicherheitstyp auswählen",
    },
    username: {
      label: "Benutzername",
      description: "Der SMTP-Authentifizierungsbenutzername",
      placeholder: "Benutzername eingeben",
    },
    password: {
      label: "Passwort",
      description: "Das SMTP-Authentifizierungspasswort",
      placeholder: "Passwort eingeben",
    },
    fromEmail: {
      label: "Absender-E-Mail",
      description: "Die Standard-Absender-E-Mail-Adresse",
      placeholder: "noreply@beispiel.de",
    },
    priority: {
      label: "Priorität",
      description: "Konto-Priorität (1-100)",
      placeholder: "10",
    },
  },
  response: {
    account: {
      title: "SMTP-Konto",
      description: "SMTP-Konto-Details",
      id: "Konto-ID",
      name: "Kontoname",
      fields: {
        description: "Beschreibung",
      },
      host: "SMTP-Host",
      port: "Port",
      securityType: "Sicherheitstyp",
      username: "Benutzername",
      fromEmail: "Absender-E-Mail",
      status: "Kontostatus",
      healthCheckStatus: "Gesundheitsprüfungsstatus",
      priority: "Priorität",
      totalEmailsSent: "Gesendete E-Mails insgesamt",
      lastUsedAt: "Zuletzt verwendet am",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verweigert",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "SMTP-Konto nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler",
    },
    networkError: {
      title: "Netzwerkfehler",
      description: "Netzwerkkommunikation fehlgeschlagen",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
  },
  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
  },
  actions: {
    back: "Zurück",
    cancel: "Abbrechen",
  },
  notFound: "Konto nicht gefunden",
};
