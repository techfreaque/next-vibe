import { translations as avatarTranslations } from "../../avatar/i18n/de";
import { translations as passwordTranslations } from "../../password/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes - typed from English
  get: {
    title: "Benutzerprofil abrufen",
    description: "Aktuelle Benutzerprofilinformationen abrufen",
    response: {
      title: "Benutzerprofil-Antwort",
      description: "Aktuelle Benutzerprofildaten",
      user: {
        title: "Benutzerinformationen",
        description: "Benutzerprofildetails",
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
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzerprofil nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Profil erfolgreich abgerufen",
    },
  },
  update: {
    title: "Benutzerprofil aktualisieren",
    description: "Aktuelle Benutzerprofilinformationen aktualisieren",
    groups: {
      basicInfo: {
        title: "Grundlegende Informationen",
        description: "Aktualisieren Sie Ihre grundlegenden Profilinformationen",
      },
      profileDetails: {
        title: "Profildetails",
        description: "Verwalten Sie Ihre Profildetails und Einstellungen",
      },
      privacySettings: {
        title: "Datenschutzeinstellungen",
        description: "Steuern Sie, wer Ihre Profilinformationen sehen kann",
      },
    },
    fields: {
      email: {
        label: "E-Mail-Adresse",
        description: "Ihre E-Mail-Adresse",
        placeholder: "Geben Sie Ihre E-Mail-Adresse ein",
        help: "Ihre E-Mail-Adresse wird für Kontobenachrichtigungen und Kommunikation verwendet",
        validation: {
          invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        },
      },
      privateName: {
        label: "Privater Name",
        description: "Ihr interner/privater Name",
        placeholder: "Geben Sie Ihren privaten Namen ein",
        help: "Ihr privater Name wird intern und für private Kommunikation verwendet",
        validation: {
          minLength: "Der private Name muss mindestens 2 Zeichen lang sein",
          maxLength: "Der private Name darf nicht länger als 50 Zeichen sein",
        },
      },
      publicName: {
        label: "Öffentlicher Name",
        description: "Ihr öffentlicher Anzeigename",
        placeholder: "Geben Sie Ihren öffentlichen Namen ein",
        help: "Ihr öffentlicher Name wird für andere Benutzer sichtbar sein",
        validation: {
          minLength: "Der öffentliche Name muss mindestens 2 Zeichen lang sein",
          maxLength:
            "Der öffentliche Name darf nicht länger als 50 Zeichen sein",
        },
      },
      imageUrl: {
        label: "Profilbild",
        description: "URL zu Ihrem Profilbild",
        placeholder: "Bild-URL eingeben",
        help: "Geben Sie eine URL zu einem Bild an, das als Ihr Profilbild angezeigt wird",
        validation: {
          invalid: "Bitte geben Sie eine gültige Bild-URL ein",
        },
      },
      company: {
        label: "Unternehmen",
        description: "Ihr Unternehmensname",
        placeholder: "Geben Sie Ihr Unternehmen ein",
        help: "Ihr Unternehmensname wird in Ihrem Profil angezeigt",
        validation: {
          maxLength:
            "Der Unternehmensname darf nicht länger als 100 Zeichen sein",
        },
      },
      visibility: {
        label: "Profilsichtbarkeit",
        description: "Wer kann Ihr Profil sehen",
        placeholder: "Sichtbarkeitseinstellung auswählen",
        help: "Wählen Sie, wer Ihr Profil sehen kann: öffentlich (alle), privat (nur Sie) oder nur Kontakte",
      },
      marketingConsent: {
        label: "Marketing-Einverständnis",
        description: "Marketing-Kommunikation erhalten",
        placeholder: "Marketing-E-Mails aktivieren",
        help: "Wählen Sie, ob Sie Marketing-E-Mails und Werbemitteilungen erhalten möchten",
      },
      bio: {
        label: "Bio",
        description: "Eine kurze Beschreibung über Sie",
        placeholder: "Erzählen Sie uns etwas über sich...",
        help: "Teilen Sie eine kurze Beschreibung über sich mit, die in Ihrem Profil sichtbar sein wird",
        validation: {
          maxLength: "Die Bio darf nicht länger als 500 Zeichen sein",
        },
      },
    },
    response: {
      title: "Aktualisiertes Profil",
      description: "Ihre aktualisierten Profilinformationen",
      success: "Aktualisierung erfolgreich",
      message: "Ihr Profil wurde erfolgreich aktualisiert",
      user: "Aktualisierte Benutzerinformationen",
      changesSummary: {
        title: "Änderungszusammenfassung",
        description: "Zusammenfassung der Änderungen an Ihrem Profil",
        totalChanges: "Gesamte Änderungen",
        changedFields: "Geänderte Felder",
        verificationRequired: "Verifizierung erforderlich",
        lastUpdated: "Zuletzt aktualisiert",
      },
      nextSteps: "Nächste Schritte",
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
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzerprofil nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Profil erfolgreich aktualisiert",
      nextSteps:
        "Empfohlene nächste Schritte nach der Aktualisierung Ihres Profils",
    },
  },
  delete: {
    title: "Benutzerkonto löschen",
    description: "Ihr Benutzerkonto dauerhaft löschen",
    response: {
      title: "Löschstatus",
      description: "Kontolöschungsbestätigung",
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
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzerkonto nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Konto erfolgreich gelöscht",
    },
  },
  put: {
    response: {
      changedFields: {
        item: "Geändertes Feld",
      },
    },
  },
  category: "Benutzerprofil",
  tag: "Benutzerprofil",
  tags: {
    profile: "profil",
    user: "benutzer",
    account: "konto",
  },

  // Sub-routes
  avatar: avatarTranslations,
  password: passwordTranslations,
};
