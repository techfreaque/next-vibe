import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main user profile routes - typed from English
  get: {
    title: "Benutzerprofil abrufen",
    titleShort: "Mein Profil",
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
      roles: "Rollen",
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
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorSlug: "Profil-URL",
      creatorAccentColor: "Akzentfarbe",
      creatorHeaderImageUrl: "Header-Bild",
      avatarUrl: "Profilbild",
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
    titleShort: "Profil aktualisieren",
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
      facebookUrl: {
        label: "Facebook",
        description: "Deine Facebook-Seite oder dein Profil-URL",
        placeholder: "https://facebook.com/deineseite",
      },
      discordUrl: {
        label: "Discord",
        description: "Dein Discord-Server oder Profil-Link",
        placeholder: "https://discord.gg/deinserver",
      },
      tribeUrl: {
        label: "Tribe",
        description: "Dein Tribe-Community-URL",
        placeholder: "https://deinecommunity.tribe.so",
      },
      rumbleUrl: {
        label: "Rumble",
        description: "Dein Rumble-Kanal-URL",
        placeholder: "https://rumble.com/c/deinkanal",
      },
      odyseeUrl: {
        label: "Odysee",
        description: "Dein Odysee-Kanal-URL",
        placeholder: "https://odysee.com/@deinkanal",
      },
      nostrUrl: {
        label: "Nostr",
        description: "Dein Nostr-Profil oder npub-Adresse",
        placeholder: "https://primal.net/p/npub1...",
      },
      gabUrl: {
        label: "Gab",
        description: "Dein Gab-Profil-URL",
        placeholder: "https://gab.com/deinhandle",
      },
      creatorSlug: {
        label: "Profil-URL",
        description:
          "Dein individueller Profillink – erscheint in deiner öffentlichen Adresse",
        placeholder: "jane-doe",
        validation: {
          invalid: "Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt",
        },
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
      facebookUrl: "Facebook",
      discordUrl: "Discord",
      tribeUrl: "Tribe",
      rumbleUrl: "Rumble",
      odyseeUrl: "Odysee",
      nostrUrl: "Nostr",
      gabUrl: "Gab",
      creatorSlug: "Profil-URL",
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
    titleShort: "Konto löschen",
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
      title: "Deine E-Mail-Liste",
      description:
        "Besucher deiner Skill-Seite und deines Creator-Profils können sich eintragen. Die Liste gehört dir - kein Mittelsmann.",
      manage: "Verwalten",
    },
    previewCard: {
      title: "Dein öffentliches Profil",
      description: "So sehen dich andere",
    },
    noPreview: "Fülle dein Profil aus, um eine Vorschau zu sehen",
    noSocials: "Noch keine Social Links hinzugefügt",
    viewPublicProfile: "Öffentliches Profil ansehen",
    profileUrl: "Dein Link",
    slugWarning:
      "Wenn du diese URL änderst, werden alle bestehenden Links zu deinem Profil ungültig.",
    bioPreview: "Vorschau",
    bioEdit: "Bearbeiten",
    skills: {
      title: "Meine Skills",
      chat: "Jetzt chatten",
      add: "Zur Sammlung hinzufügen",
      public: "Community",
      showLess: "Weniger anzeigen",
      hubSubtitle: "{count} veröffentlicht",
    },
    nav: {
      logout: "Abmelden",
      back: "←",
    },
    sections: {
      account: "Konto",
      subscription: "Abonnement",
      subscriptionHint: "Kein aktiver Plan — Upgrade für mehr Funktionen",
      manageSubscription: "Verwalten",
      noSubscription: "Kein aktiver Plan",
      upgrade: "Upgraden",
      addresses: "Rechnungsadressen",
      addressCount: "{count} gespeichert",
      addAddress: "Adresse hinzufügen",
      manageAddresses: "Verwalten",
      noAddresses: "Keine gespeichert",
      billing: "Rechnung",
      delivery: "Lieferung",
      edit: "Bearbeiten",
      credits: "Credits",
      creditsAvailable: "verfügbar",
      password: "Passwort",
      passwordHint: "Kontopasswort ändern",
      sessions: "Aktive Sitzungen",
      sessionsHint: "Verwalte deine Anmeldungen",
      creator: "Creator",
      referral: "Empfehlungsprogramm",
      referralHint: "Freunde einladen und Prämien erhalten",
    },
    deleteAccount: {
      dangerZone: "Gefahrenzone",
      button: "Konto löschen",
      confirmTitle: "Konto dauerhaft löschen",
      confirmDescription:
        "Dein Konto und alle zugehörigen Daten werden unwiderruflich gelöscht. Keine Wiederherstellung möglich.",
      confirmLabel: '"DELETE" eingeben zur Bestätigung',
      confirmPlaceholder: "DELETE",
      confirmButton: "Mein Konto für immer löschen",
      cancelButton: "Abbrechen",
      whatGetsDeleted: "Was gelöscht wird:",
      items: {
        profile: "Dein Profil und alle Einstellungen",
        chats: "Gesamter Chatverlauf und alle Threads",
        skills: "Alle eigenen Skills und Konfigurationen",
        files: "Alle Cortex-Dateien und Erinnerungen",
        subscriptions: "Aktive Abonnements",
        credits: "Verbleibende Guthaben",
      },
      deleting: "Wird gelöscht...",
      success: "Konto gelöscht. Weiterleitung...",
    },
  },

  // Sub-routes
  avatar: {
    category: "Benutzerprofil",

    tag: "avatar",
    errors: {
      user_not_found: "Benutzer nicht gefunden",
      failed_to_upload_avatar: "Avatar konnte nicht hochgeladen werden",
      failed_to_delete_avatar: "Avatar konnte nicht gelöscht werden",
      invalid_file_type: "Ungültiger Dateityp",
      file_too_large: "Datei zu groß",
    },
    debug: {
      uploadingUserAvatar: "Benutzer-Avatar wird hochgeladen",
      errorUploadingUserAvatar: "Fehler beim Hochladen des Benutzer-Avatars",
      deletingUserAvatar: "Benutzer-Avatar wird gelöscht",
      errorDeletingUserAvatar: "Fehler beim Löschen des Benutzer-Avatars",
    },
    success: {
      uploaded: "Avatar erfolgreich hochgeladen",
      deleted: "Avatar erfolgreich gelöscht",
      nextSteps: {
        visible: "Ihr Avatar ist jetzt in Ihrem Profil sichtbar",
        update:
          "Sie können ihn jederzeit in Ihren Profileinstellungen aktualisieren",
        default: "Ihr Profil zeigt jetzt den Standard-Avatar",
        uploadNew:
          "Sie können jederzeit einen neuen Avatar in Ihren Profileinstellungen hochladen",
      },
    },
    upload: {
      title: "Avatar Hochladen",
      description: "Ein Profilbild hochladen",
      groups: {
        fileUpload: {
          title: "Datei Hochladen",
          description: "Wählen Sie Ihr Avatar-Bild aus und laden Sie es hoch",
        },
      },
      fields: {
        file: {
          label: "Avatar-Bild",
          description: "Wählen Sie eine Bilddatei für Ihr Profilbild",
          placeholder: "Bilddatei wählen...",
          help: "Laden Sie eine Bilddatei (JPG, PNG, GIF) bis zu 5MB hoch",
          validation: {
            maxSize: "Dateigröße muss unter 5MB sein",
            imageOnly: "Nur Bilddateien sind erlaubt",
            unsupportedFormat:
              "Nicht unterstütztes Bildformat. Verwenden Sie JPEG, PNG, WebP oder GIF.",
          },
        },
      },
      response: {
        title: "Upload-Antwort",
        label: "Upload-Ergebnis",
        description: "Avatar-Upload-Antwort",
        success: "Upload Erfolgreich",
        message: "Ihr Avatar wurde erfolgreich hochgeladen",
        avatarUrl: "Avatar-URL",
        uploadTime: "Upload-Zeit",
        nextSteps: {
          item: "Nächster Schritt",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die hochgeladene Datei ist ungültig oder beschädigt",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um einen Avatar hochzuladen",
        },
        server: {
          title: "Serverfehler",
          description: "Avatar-Upload konnte nicht verarbeitet werden",
        },
        internal: {
          title: "Interner Fehler",
          description: "Ein interner Serverfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist beim Upload aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist beim Upload aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, einen Avatar hochzuladen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Die angeforderte Ressource wurde nicht gefunden",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist beim Upload aufgetreten",
        },
      },
      success: {
        title: "Avatar Hochgeladen",
        description: "Ihr Profilbild wurde erfolgreich hochgeladen",
      },
    },
    delete: {
      title: "Avatar Löschen",
      description: "Das aktuelle Profilbild entfernen",
      response: {
        title: "Lösch-Antwort",
        label: "Lösch-Ergebnis",
        description: "Avatar-Löschungsantwort",
        success: "Löschen Erfolgreich",
        message: "Ihr Avatar wurde erfolgreich gelöscht",
        nextSteps: {
          item: "Nächster Schritt",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die Avatar-Löschungsanfrage ist ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen angemeldet sein, um Ihren Avatar zu löschen",
        },
        server: {
          title: "Serverfehler",
          description: "Avatar konnte nicht gelöscht werden",
        },
        internal: {
          title: "Interner Fehler",
          description: "Ein interner Serverfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist beim Löschen aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Ein Netzwerkfehler ist beim Löschen aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, diesen Avatar zu löschen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Der zu löschende Avatar wurde nicht gefunden",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist beim Löschen aufgetreten",
        },
      },
      success: {
        title: "Avatar Gelöscht",
        description: "Ihr Profilbild wurde erfolgreich entfernt",
      },
    },
  },
  password: {
    category: "Benutzerprofil",

    title: "Passwort Ändern",
    description: "Ändern Sie Ihr Kontokennwort sicher",
    tag: "passwort-ändern",
    debug: {
      updatingPassword: "Passwort wird aktualisiert",
      errorUpdatingPassword: "Fehler beim Aktualisieren des Passworts",
      settingPassword: "Passwort wird gesetzt",
      errorSettingPassword: "Fehler beim Setzen des Passworts",
    },
    groups: {
      currentCredentials: {
        title: "Aktuelles Passwort",
        description: "Bestätigen Sie Ihr aktuelles Passwort, um fortzufahren",
      },
      newCredentials: {
        title: "Neues Passwort",
        description: "Wählen Sie ein starkes neues Passwort für Ihr Konto",
      },
    },
    currentPassword: {
      label: "Aktuelles Passwort",
      description: "Geben Sie Ihr aktuelles Passwort ein",
      placeholder: "Aktuelles Passwort eingeben",
      help: "Geben Sie Ihr aktuelles Passwort ein, um Ihre Identität zu bestätigen",
    },
    newPassword: {
      label: "Neues Passwort",
      description: "Geben Sie Ihr neues Passwort ein (mindestens 8 Zeichen)",
      placeholder: "Neues Passwort eingeben",
      help: "Wählen Sie ein starkes Passwort mit mindestens 8 Zeichen, einschließlich Buchstaben, Zahlen und Symbolen",
    },
    confirmPassword: {
      label: "Passwort Bestätigen",
      description: "Bestätigen Sie Ihr neues Passwort",
      placeholder: "Neues Passwort bestätigen",
      help: "Geben Sie Ihr neues Passwort erneut ein, um sicherzustellen, dass es korrekt eingegeben wurde",
    },
    twoFactorCode: {
      label: "Zwei-Faktor-Code",
      description:
        "Geben Sie Ihren Zwei-Faktor-Authentifizierungscode ein, falls aktiviert",
      placeholder: "2FA-Code eingeben",
    },
    response: {
      title: "Passwort-Änderungsantwort",
      description: "Antwort für die Passwort-Änderungsoperation",
      success: "Passwort erfolgreich aktualisiert",
      message: "Statusnachricht",
      securityTip: "Sicherheitstipp",
      nextSteps: {
        item: "Nächste Schritte",
      },
    },
    validation: {
      currentPassword: {
        minLength: "Aktuelles Passwort muss mindestens 8 Zeichen haben",
      },
      newPassword: {
        minLength: "Neues Passwort muss mindestens 8 Zeichen haben",
      },
      confirmPassword: {
        minLength: "Passwort-Bestätigung muss mindestens 8 Zeichen haben",
      },
      passwords: {
        mismatch: "Passwörter stimmen nicht überein",
      },
    },
    errors: {
      passwords_do_not_match: "Passwörter stimmen nicht überein",
      user_not_found: "Benutzer nicht gefunden",
      incorrect_password: "Falsches Passwort",
      update_failed: "Passwort konnte nicht aktualisiert werden",
      token_creation_failed: "Passwort-Token konnte nicht erstellt werden",
      two_factor_code_required:
        "Zwei-Faktor-Authentifizierungscode erforderlich",
      invalid_two_factor_code: "Ungültiger Zwei-Faktor-Authentifizierungscode",
      invalid_request: {
        title: "Ungültige Anfrage",
        description: "Die Passwort-Änderungsanfrage ist ungültig",
      },
      validation: {
        title: "Validierungsfehler",
        description:
          "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ihr Passwort zu ändern",
      },
      server: {
        title: "Serverfehler",
        description:
          "Passwort konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unerwarteter Fehler ist beim Aktualisieren des Passworts aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      forbidden: {
        title: "Zugriff Verboten",
        description: "Sie haben keine Berechtigung für diese Aktion",
      },
      notFound: {
        title: "Benutzer Nicht Gefunden",
        description: "Benutzerkonto konnte nicht gefunden werden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Datenkonflikt",
        description:
          "Ein Konflikt ist beim Aktualisieren des Passworts aufgetreten",
      },
    },
    success: {
      updated: "Passwort erfolgreich aktualisiert",
      securityTip:
        "Aktivieren Sie für erhöhte Sicherheit die Zwei-Faktor-Authentifizierung",
      nextSteps: {
        logoutOther:
          "Alle anderen Sitzungen wurden aus Sicherheitsgründen abgemeldet",
        enable2fa:
          "Erwägen Sie die Aktivierung der Zwei-Faktor-Authentifizierung für bessere Sicherheit",
      },
      title: "Passwort Aktualisiert",
      description: "Ihr Passwort wurde erfolgreich aktualisiert",
    },
    update: {
      success: {
        title: "Passwort Aktualisiert",
        description: "Ihr Passwort wurde erfolgreich aktualisiert",
      },
      errors: {
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Beim Aktualisieren des Passworts ist ein unerwarteter Fehler aufgetreten",
        },
      },
    },
  },
  addresses: {
    category: "Adressen",
    tag: "addresses",

    list: {
      title: "Meine Adressen",
      description: "Gespeicherte Adressen anzeigen",
      response: {
        addresses: "Adressen",
      },
      widget: {
        addAddress: "Adresse hinzufügen",
        edit: "Bearbeiten",
        delete: "Löschen",
        billing: "Rechnung",
        delivery: "Lieferung",
        empty: "Keine gespeicherten Adressen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrage",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Anmeldung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Adressen gefunden",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        internal: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
      },
      success: { title: "Erfolgreich", description: "Adressen abgerufen" },
    },

    create: {
      title: "Adresse hinzufügen",
      description: "Neue Adresse speichern",
      fields: {
        label: {
          label: "Bezeichnung",
          description: "Name für diese Adresse (z.B. Zuhause, Büro)",
          placeholder: "Zuhause",
        },
        fullName: {
          label: "Vollständiger Name",
          description: "Kontaktname für diese Adresse",
          placeholder: "Maria Muster",
        },
        company: {
          label: "Unternehmen",
          description: "Firmenname (optional)",
          placeholder: "Beispiel GmbH",
        },
        phone: {
          label: "Telefon",
          description: "Kontakttelefonnummer",
          placeholder: "+49 30 00000000",
        },
        vatNumber: {
          label: "USt-IdNr.",
          description: "Umsatzsteuer-Identifikationsnummer",
          placeholder: "DE123456789",
        },
        taxId: {
          label: "Steuernummer",
          description: "Nationale Steuerkennung",
          placeholder: "123/456/78901",
        },
        addressLine1: {
          label: "Adresszeile 1",
          description: "Straße und Hausnummer",
          placeholder: "Musterstraße 1",
        },
        addressLine2: {
          label: "Adresszeile 2",
          description: "Wohnung, Etage (optional)",
          placeholder: "3. OG",
        },
        city: { label: "Stadt", description: "Stadt", placeholder: "Berlin" },
        region: {
          label: "Bundesland / Region",
          description: "Bundesland oder Region (optional)",
          placeholder: "Bayern",
        },
        postalCode: {
          label: "Postleitzahl",
          description: "PLZ",
          placeholder: "10115",
        },
        country: {
          label: "Land",
          description: "ISO-3166-1-Alpha-2-Ländercode",
          placeholder: "DE",
        },
        isDefaultBilling: {
          label: "Standard-Rechnungsadresse",
          description: "Als Standard-Rechnungsadresse verwenden",
        },
        isDefaultDelivery: {
          label: "Standard-Lieferadresse",
          description: "Als Standard-Lieferadresse verwenden",
        },
      },
      response: {
        id: "Adress-ID",
        label: "Bezeichnung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Pflichtfelder prüfen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Anmeldung erforderlich",
        },
        forbidden: { title: "Verboten", description: "Zugriff verweigert" },
        notFound: {
          title: "Nicht gefunden",
          description: "Benutzer nicht gefunden",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        internal: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
      },
      success: {
        title: "Adresse gespeichert",
        description: "Adresse wurde Ihrem Konto hinzugefügt",
      },
      widget: {
        saved: "Adresse gespeichert.",
        backToAddresses: "Zurück zu Adressen",
      },
    },
  },
};
