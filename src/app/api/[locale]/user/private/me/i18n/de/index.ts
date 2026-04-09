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
      id: "Benutzer-ID",
      leadId: "Lead-ID",
      isPublic: "Öffentliches Profil",
      email: "E-Mail-Adresse",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
      locale: "Gebietsschema",
      isActive: "Aktiv-Status",
      emailVerified: "E-Mail verifiziert",
      requireTwoFactor: "Zwei-Faktor-Authentifizierung erforderlich",
      marketingConsent: "Marketing-Zustimmung",
      userRoles: "Benutzerrollen",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      stripeCustomerId: "Stripe-Kunden-ID",
      bio: "Bio",
      websiteUrl: "Website",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Akzentfarbe",
      creatorHeaderImageUrl: "Header-Bild",
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
      profileInfo: {
        title: "Creator-Profil",
        description: "Bio, Social-Links und Branding für deine Skill-Seiten",
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
        label: "Newsletter abonnieren",
        description:
          "Gelegentliche Updates über neue Modelle und Features. Kein Spam, nur was zählt.",
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
      websiteUrl: {
        label: "Website",
        description: "Deine persönliche oder geschäftliche Website",
        placeholder: "https://deine-seite.de",
      },
      twitterUrl: {
        label: "X / Twitter",
        description: "Dein X (Twitter) Profil-URL",
        placeholder: "https://x.com/deinhandle",
      },
      youtubeUrl: {
        label: "YouTube",
        description: "Dein YouTube-Kanal-URL",
        placeholder: "https://youtube.com/@deinkanal",
      },
      instagramUrl: {
        label: "Instagram",
        description: "Dein Instagram-Profil-URL",
        placeholder: "https://instagram.com/deinhandle",
      },
      tiktokUrl: {
        label: "TikTok",
        description: "Dein TikTok-Profil-URL",
        placeholder: "https://tiktok.com/@deinhandle",
      },
      githubUrl: {
        label: "GitHub",
        description: "Dein GitHub-Profil-URL",
        placeholder: "https://github.com/deinbenutzername",
      },
      discordUrl: {
        label: "Discord",
        description: "Dein Discord-Server oder Profil-Link",
        placeholder: "https://discord.gg/deinserver",
      },
      creatorAccentColor: {
        label: "Akzentfarbe",
        description: "Hex-Farbe für dein Skill-Seiten-Branding (optional)",
        placeholder: "#7c3aed",
      },
      creatorHeaderImageUrl: {
        label: "Header-Bild",
        description: "Banner-Bild-URL für deinen Skill-Seiten-Hero",
        placeholder: "https://deine-seite.de/banner.jpg",
      },
    },
    response: {
      title: "Aktualisiertes Profil",
      description: "Ihre aktualisierten Profilinformationen",
      success: "Aktualisierung erfolgreich",
      message: "Ihr Profil wurde erfolgreich aktualisiert",
      id: "Benutzer-ID",
      leadId: "Lead-ID",
      isPublic: "Öffentliches Profil",
      email: "E-Mail-Adresse",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
      locale: "Gebietsschema",
      isActive: "Aktiv-Status",
      emailVerified: "E-Mail verifiziert",
      requireTwoFactor: "Zwei-Faktor-Authentifizierung erforderlich",
      marketingConsent: "Marketing-Zustimmung",
      userRoles: "Benutzerrollen",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
      stripeCustomerId: "Stripe-Kunden-ID",
      bio: "Bio",
      websiteUrl: "Website",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Akzentfarbe",
      creatorHeaderImageUrl: "Header-Bild",
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

  widget: {
    save: "Profil speichern",
    saving: "Wird gespeichert...",
    editProfile: "Profil bearbeiten",
    cancelEdit: "Abbrechen",
    memberSince: "Mitglied seit",
    profileCard: {
      title: "Creator-Profil",
      description: "Deine öffentliche Identität auf der Plattform",
    },
    socialCard: {
      title: "Social Links",
      description: "Verbinde deine Plattformen",
    },
    emailCard: {
      title: "E-Mail-Liste",
      description: "Baue dein Publikum mit Lead-Erfassung auf",
    },
    previewCard: {
      title: "Dein öffentliches Profil",
      description: "So sehen dich andere",
    },
    noPreview: "Fülle dein Profil aus, um eine Vorschau zu sehen",
    noSocials: "Noch keine Social Links hinzugefügt",
    viewPublicProfile: "Öffentliches Profil ansehen",
  },

  // Sub-routes
  avatar: avatarTranslations,
  password: passwordTranslations,
};
