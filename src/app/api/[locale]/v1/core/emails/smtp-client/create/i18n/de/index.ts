import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "SMTP-Konto erstellen",
  description: "Ein neues SMTP-Konto für den E-Mail-Versand erstellen",

  container: {
    title: "SMTP-Konto-Konfiguration",
    description: "SMTP-Kontoeinstellungen konfigurieren",
  },

  name: {
    label: "Kontoname",
    description: "Eindeutiger Name für dieses SMTP-Konto",
    placeholder: "Kontoname eingeben",
  },

  accountDescription: {
    label: "Beschreibung",
    description: "Optionale Beschreibung für dieses SMTP-Konto",
    placeholder: "Beschreibung eingeben",
  },

  host: {
    label: "SMTP-Host",
    description: "SMTP-Server-Hostname oder IP-Adresse",
    placeholder: "smtp.example.com",
  },

  port: {
    label: "Port",
    description: "SMTP-Server-Portnummer",
    placeholder: "587",
  },

  securityType: {
    label: "Sicherheitstyp",
    description: "SMTP-Sicherheitsprotokoll",
    placeholder: "Sicherheitstyp auswählen",
  },

  username: {
    label: "Benutzername",
    description: "SMTP-Authentifizierungs-Benutzername",
    placeholder: "Benutzername eingeben",
  },

  password: {
    label: "Passwort",
    description: "SMTP-Authentifizierungs-Passwort",
    placeholder: "Passwort eingeben",
  },

  fromEmail: {
    label: "Absender-E-Mail",
    description: "E-Mail-Adresse für den Versand",
    placeholder: "absender@example.com",
  },

  response: {
    account: {
      title: "SMTP-Konto erstellt",
      description: "SMTP-Konto erfolgreich erstellt",
      id: "Konto-ID",
      name: "Kontoname",
      accountDescription: "Kontobeschreibung",
      host: "SMTP-Host",
      port: "Port",
      securityType: "Sicherheitstyp",
      username: "Benutzername",
      fromEmail: "Absender-E-Mail",
      status: "Kontostatus",
      healthCheckStatus: "Gesundheitsstatus",
      priority: "Priorität",
      totalEmailsSent: "Gesendete E-Mails gesamt",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige SMTP-Konto-Parameter",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Admin-Zugriff erforderlich für SMTP-Konto-Erstellung",
    },
    conflict: {
      title: "Konto existiert bereits",
      description: "Ein SMTP-Konto mit diesem Namen existiert bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Fehler beim Erstellen des SMTP-Kontos",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf diese Ressource ist verboten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist aufgetreten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
  },

  success: {
    title: "SMTP-Konto erstellt",
    description: "SMTP-Konto erfolgreich erstellt",
  },
};
