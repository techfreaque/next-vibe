import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  auth: {
    category: "Authentifizierung",
    search: {
      tag: "Auth",
    },
    authClient: {
      errors: {
        status_save_failed:
          "Authentifizierungsstatus konnte nicht gespeichert werden",
        status_remove_failed:
          "Authentifizierungsstatus konnte nicht entfernt werden",
        status_check_failed:
          "Authentifizierungsstatus konnte nicht überprüft werden",
        token_save_failed:
          "Authentifizierungstoken konnte nicht gespeichert werden",
        token_get_failed:
          "Authentifizierungstoken konnte nicht abgerufen werden",
        token_remove_failed:
          "Authentifizierungstoken konnte nicht entfernt werden",
      },
    },
    errors: {
      token_generation_failed:
        "Authentifizierungs-Token konnte nicht generiert werden",
      invalid_session: "Die Sitzung ist ungültig oder abgelaufen",
      missing_request_context: "Request-Kontext fehlt",
      missing_locale: "Locale fehlt in der Anfrage",
      unsupported_platform: "Plattform wird nicht unterstützt",
      session_retrieval_failed: "Sitzung konnte nicht abgerufen werden",
      missing_token: "Authentifizierungs-Token fehlt",
      invalid_token_signature: "Token-Signatur ist ungültig",
      jwt_payload_missing_id: "JWT-Payload fehlt Benutzer-ID",
      cookie_set_failed:
        "Authentifizierungs-Cookie konnte nicht gesetzt werden",
      cookie_clear_failed:
        "Authentifizierungs-Cookie konnte nicht gelöscht werden",
      publicPayloadNotSupported:
        "Öffentlicher JWT-Payload wird für CLI-Authentifizierung nicht unterstützt",
      jwt_signing_failed: "JWT-Token konnte nicht signiert werden",
      authentication_failed: "Authentifizierung fehlgeschlagen",
      user_not_authenticated: "Benutzer ist nicht authentifiziert",
      publicUserNotAllowed:
        "Öffentlicher Benutzer ist für diesen Endpunkt nicht erlaubt",
      validation_failed: "Validierung fehlgeschlagen",
      failed_to_create_lead: "Lead konnte nicht erstellt werden",
      native: {
        unsupported:
          "Diese Authentifizierungsmethode wird in React Native nicht unterstützt",
        storage_failed:
          "Authentifizierungsdaten konnten nicht gespeichert werden",
        clear_failed: "Authentifizierungsdaten konnten nicht gelöscht werden",
      },
      not_implemented_native:
        "Diese Funktion ist noch nicht für React Native implementiert",
      unknownError:
        "Ein unbekannter Fehler ist während der Authentifizierung aufgetreten",
    },
    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Konfiguration",
        description: "Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Antwortdaten",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        missing_locale: {
          title: "Fehlende Locale",
          description: "Locale-Parameter ist erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        token_generation_failed: {
          title: "Token-Generierung fehlgeschlagen",
          description: "Authentifizierungstoken konnte nicht generiert werden",
        },
        invalid_session: {
          title: "Ungültige Sitzung",
          description: "Die Sitzung ist ungültig oder abgelaufen",
        },
        missing_request_context: {
          title: "Fehlender Request-Kontext",
          description: "Request-Kontext fehlt",
        },
        unsupported_platform: {
          title: "Nicht unterstützte Plattform",
          description: "Plattform wird nicht unterstützt",
        },
        session_retrieval_failed: {
          title: "Sitzungsabruf fehlgeschlagen",
          description: "Sitzung konnte nicht abgerufen werden",
        },
        missing_token: {
          title: "Fehlender Token",
          description: "Authentifizierungstoken fehlt",
        },
        invalid_token_signature: {
          title: "Ungültige Token-Signatur",
          description: "Token-Signatur ist ungültig",
        },
        jwt_payload_missing_id: {
          title: "JWT-Payload fehlt ID",
          description: "JWT-Payload fehlt Benutzer-ID",
        },
        cookie_set_failed: {
          title: "Cookie-Setzung fehlgeschlagen",
          description: "Authentifizierungs-Cookie konnte nicht gesetzt werden",
        },
        cookie_clear_failed: {
          title: "Cookie-Löschung fehlgeschlagen",
          description: "Authentifizierungs-Cookie konnte nicht gelöscht werden",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
    check: {
      get: {
        title: "Authentifizierung prüfen",
        description: "Aktuellen Authentifizierungsstatus prüfen",
        response: {
          title: "Authentifizierungsstatus",
          description: "Aktueller Authentifizierungszustand",
          authenticated: "Authentifiziert",
          tokenValid: "Token gültig",
        },
      },
    },
    enums: {
      webSocketErrorCode: {
        unauthorized: "Nicht autorisiert",
        forbidden: "Verboten",
        invalidToken: "Ungültiger Token",
        tokenExpired: "Token abgelaufen",
        serverError: "Serverfehler",
      },
    },
    debug: {
      getAuthMinimalUserNext: {
        start: "getAuthMinimalUserNext: Authentifizierung wird zuerst geprüft",
        result: "getAuthMinimalUserNext: getCurrentUserNext Ergebnis",
        authenticated:
          "getAuthMinimalUserNext: Benutzer ist authentifiziert, leadId wird abgerufen",
        returningAuth:
          "getAuthMinimalUserNext: Authentifizierter Benutzer wird zurückgegeben",
        notAuthenticated:
          "getAuthMinimalUserNext: Benutzer nicht authentifiziert, öffentlicher Benutzer wird zurückgegeben",
      },
      signingJwt: "JWT wird signiert",
      jwtSignedSuccessfully: "JWT erfolgreich signiert",
      errorSigningJwt: "Fehler beim Signieren von JWT",
      verifyingJwt: "JWT wird verifiziert",
      invalidTokenPayload: "Ungültige Token-Nutzdaten",
      jwtVerifiedSuccessfully: "JWT erfolgreich verifiziert",
      errorVerifyingJwt: "Fehler beim Verifizieren von JWT",
      userIdNotExistsInDb: "Benutzer-ID existiert nicht in der Datenbank",
      sessionNotFound: "Sitzung nicht gefunden",
      sessionExpired: "Sitzung abgelaufen",
      errorValidatingUserSession: "Fehler beim Validieren der Benutzersitzung",
      errorGettingUserRoles: "Fehler beim Abrufen der Benutzerrollen",
      errorCheckingUserAuth: "Fehler beim Prüfen der Benutzerauthentifizierung",
      authenticatingCliUserWithPayload:
        "CLI-Benutzer wird mit Nutzdaten authentifiziert",
      errorAuthenticatingCliUserWithPayload:
        "Fehler beim Authentifizieren des CLI-Benutzers mit Nutzdaten",
      creatingCliToken: "CLI-Token wird erstellt",
      errorCreatingCliToken: "Fehler beim Erstellen des CLI-Tokens",
      validatingCliToken: "CLI-Token wird validiert",
      errorValidatingCliToken: "Fehler beim Validieren des CLI-Tokens",
      gettingCurrentUserFromNextjs:
        "Aktueller Benutzer wird von Next.js abgerufen",
      errorGettingAuthUserForNextjs:
        "Fehler beim Abrufen des Auth-Benutzers für Next.js",
      settingNextjsAuthCookies: "Next.js Auth-Cookies werden gesetzt",
      clearingNextjsAuthCookies: "Next.js Auth-Cookies werden gelöscht",
      gettingCurrentUserFromToken:
        "Aktueller Benutzer wird von Token abgerufen",
      errorGettingCurrentUserFromCli:
        "Fehler beim Abrufen des aktuellen Benutzers von CLI",
      errorGettingAuthUserForCli:
        "Fehler beim Abrufen des Auth-Benutzers für CLI",
      errorGettingUserRolesForCli:
        "Fehler beim Abrufen der Benutzerrollen für CLI",
      tokenFromAuthHeader: "Token aus Auth-Header",
      tokenFromCookie: "Token aus Cookie",
      noTokenFound: "Kein Token gefunden",
      errorExtractingToken: "Fehler beim Extrahieren des Tokens",
      errorParsingCookies: "Fehler beim Parsen der Cookies",
    },
  },
  private: {
    logout: {
      title: "Benutzer Abmelden",
      description:
        "Meldet den aktuellen Benutzer ab und macht seine Sitzung ungültig",
      category: "Benutzerverwaltung",
      tag: "abmelden",
      logoutButton: "Abmelden",
      loggingOut: "Abmelden...",
      response: {
        title: "Abmelde-Antwort",
        description: "Antwort, die eine erfolgreiche Abmeldung anzeigt",
        success: "Erfolg",
        message: "Nachricht",
        sessionsCleaned: "Sitzungen bereinigt",
        nextSteps: "Empfohlene nächste Schritte nach der Abmeldung",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die Abmelde-Anfrage enthält ungültige Daten",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen angemeldet sein, um sich abzumelden",
        },
        internal: {
          title: "Interner Serverfehler",
          description: "Ein interner Fehler ist beim Abmelden aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist beim Abmelden aufgetreten",
        },
        session_deletion_failed: {
          title: "Sitzungslöschung fehlgeschlagen",
          description: "Löschen der Benutzersitzung fehlgeschlagen",
        },
        conflict: {
          title: "Abmeldungskonflikt",
          description: "Ein Konflikt ist beim Abmelden aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Abmeldungsaktion ist verboten",
        },
        network_error: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Abmelden",
        },
        not_found: {
          title: "Nicht gefunden",
          description: "Sitzung nicht gefunden",
        },
        server_error: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Abmelden",
        },
        unsaved_changes: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        invalid_user: {
          title: "Ungültiger Benutzer",
          description: "Der Benutzer ist nicht gültig oder existiert nicht",
        },
      },
      success: {
        title: "Abmeldung erfolgreich",
        description: "Sie wurden erfolgreich abgemeldet",
        message: "Benutzer erfolgreich abgemeldet",
      },
    },
    me: {
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
        description: "Aktuelle Benutzerprofilinformationen aktualisieren",
        groups: {
          basicInfo: {
            title: "Grundlegende Informationen",
            description:
              "Aktualisieren Sie Ihre grundlegenden Profilinformationen",
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
            description:
              "Bio, Social-Links und Branding für deine Skill-Seiten",
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
              maxLength:
                "Der private Name darf nicht länger als 50 Zeichen sein",
            },
          },
          publicName: {
            label: "Öffentlicher Name",
            description: "Ihr öffentlicher Anzeigename",
            placeholder: "Geben Sie Ihren öffentlichen Namen ein",
            help: "Ihr öffentlicher Name wird für andere Benutzer sichtbar sein",
            validation: {
              minLength:
                "Der öffentliche Name muss mindestens 2 Zeichen lang sein",
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
          errorUploadingUserAvatar:
            "Fehler beim Hochladen des Benutzer-Avatars",
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
              description:
                "Wählen Sie Ihr Avatar-Bild aus und laden Sie es hoch",
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
              description:
                "Die hochgeladene Datei ist ungültig oder beschädigt",
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
              description:
                "Ein unerwarteter Fehler ist beim Upload aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Ein Netzwerkfehler ist beim Upload aufgetreten",
            },
            forbidden: {
              title: "Verboten",
              description:
                "Sie haben keine Berechtigung, einen Avatar hochzuladen",
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
              description:
                "Sie müssen angemeldet sein, um Ihren Avatar zu löschen",
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
              description:
                "Ein unerwarteter Fehler ist beim Löschen aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Ein Netzwerkfehler ist beim Löschen aufgetreten",
            },
            forbidden: {
              title: "Verboten",
              description:
                "Sie haben keine Berechtigung, diesen Avatar zu löschen",
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
            description:
              "Bestätigen Sie Ihr aktuelles Passwort, um fortzufahren",
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
          description:
            "Geben Sie Ihr neues Passwort ein (mindestens 8 Zeichen)",
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
          invalid_two_factor_code:
            "Ungültiger Zwei-Faktor-Authentifizierungscode",
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
            description:
              "Sie müssen angemeldet sein, um Ihr Passwort zu ändern",
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
            description:
              "Sie haben ungespeicherte Änderungen, die verloren gehen",
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
            city: {
              label: "Stadt",
              description: "Stadt",
              placeholder: "Berlin",
            },
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
    },
    session: {
      enums: {
        sessionErrorReason: {
          noTokenInCookies: "Kein Token in Cookies",
        },
      },
      errors: {
        session_not_found: "Sitzung nicht gefunden",
        session_lookup_failed: "Sitzungssuche fehlgeschlagen",
        expired_sessions_delete_failed:
          "Löschen abgelaufener Sitzungen fehlgeschlagen",
        session_creation_failed: "Sitzungserstellung fehlgeschlagen",
        session_creation_database_error:
          "Datenbankfehler beim Erstellen der Sitzung",
        user_sessions_delete_failed:
          "Löschen der Benutzersitzungen fehlgeschlagen",
        expired: "Sitzung ist abgelaufen",
      },
      post: {
        title: "Titel",
        description: "Endpunkt-Beschreibung",
        form: {
          title: "Konfiguration",
          description: "Parameter konfigurieren",
        },
        response: {
          title: "Antwort",
          description: "Antwortdaten",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
        },
      },
    },
    sessions: {
      category: "Benutzer",

      list: {
        title: "Meine Sitzungen",
        description: "Alle aktiven Sitzungen für Ihr Konto auflisten",
        tag: "Sitzungen",
        response: {
          sessions: "Sitzungen",
        },
        success: {
          title: "Sitzungen abgerufen",
          description: "Ihre aktiven Sitzungen wurden abgerufen",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrage",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: { title: "Verboten", description: "Zugriff verboten" },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: { title: "Konflikt", description: "Datenkonflikt" },
        },
      },
      create: {
        title: "Sitzungstoken erstellen",
        description:
          "Einen benannten Sitzungstoken für den programmatischen Zugriff erstellen",
        tag: "Sitzungen",
        form: {
          name: "Token-Name",
          namePlaceholder: "z.B. Mein Agent-Bot",
        },
        response: {
          token: "Token",
          id: "Sitzungs-ID",
          name: "Name",
          message: "Kopieren Sie diesen Token - er wird nicht wieder angezeigt",
        },
        success: {
          title: "Sitzung erstellt",
          description: "Ihr Sitzungstoken wurde erstellt",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrage",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: { title: "Verboten", description: "Zugriff verboten" },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: { title: "Konflikt", description: "Datenkonflikt" },
        },
      },
      revoke: {
        title: "Sitzung widerrufen",
        description: "Einen Sitzungstoken nach ID widerrufen",
        tag: "Sitzungen",
        response: {
          message: "Sitzung widerrufen",
        },
        success: {
          title: "Sitzung widerrufen",
          description: "Die Sitzung wurde widerrufen",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrage",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: { title: "Verboten", description: "Zugriff verboten" },
          notFound: {
            title: "Nicht gefunden",
            description: "Sitzung nicht gefunden",
          },
          conflict: { title: "Konflikt", description: "Datenkonflikt" },
        },
      },
    },
  },
  public: {
    login: {
      category: "Benutzer",
      title: "Willkommen zurück",
      description:
        "Greife auf unzensierte KI-Modelle und deine Gesprächsverläufe zu.",
      tag: "Authentifizierung",
      options: {
        category: "Benutzer",

        title: "Login-Optionen",
        description: "Login-Konfigurationsoptionen",
        tag: "login-optionen",
        container: {
          title: "Login-Konfiguration",
          description: "Login-Einstellungen und -Optionen konfigurieren",
        },
        fields: {
          email: {
            label: "E-Mail-Adresse",
            description: "Geben Sie Ihre E-Mail-Adresse ein",
            placeholder: "ihre@email.com",
          },
          allowPasswordAuth: {
            label: "Passwort-Authentifizierung erlauben",
            description: "Passwort-basierte Authentifizierung aktivieren",
          },
          allowSocialAuth: {
            label: "Social-Media-Authentifizierung erlauben",
            description: "Social-Media-Provider-Authentifizierung aktivieren",
          },
          maxAttempts: {
            label: "Maximale Login-Versuche",
            description: "Maximale Anzahl erlaubter Login-Versuche",
          },
          requireTwoFactor: {
            label: "Zwei-Faktor-Authentifizierung erforderlich",
            description: "2FA für Benutzer-Login erforderlich",
          },
          socialProviders: {
            label: "Social-Media-Anbieter",
            description: "Verfügbare Social-Media-Authentifizierungsanbieter",
          },
          socialProvider: {
            title: "Social-Media-Anbieter",
            description:
              "Social-Media-Authentifizierungsanbieter-Konfiguration",
            enabled: {
              label: "Aktiviert",
              description: "Ob dieser Anbieter aktiviert ist",
            },
            name: {
              label: "Anbieter-Name",
              description: "Name des Social-Media-Anbieters",
            },
            providers: {
              label: "Anbieter-Optionen",
              description: "Verfügbare Social-Media-Anbieter-Optionen",
            },
          },
        },
        response: {
          title: "Login-Optionen-Antwort",
          description: "Verfügbare Login-Konfigurationsoptionen",
          success: {
            badge: "Erfolgreich",
          },
          message: {
            content: "Statusnachricht",
          },
          forUser: {
            content: "E-Mail-Adresse",
          },
          loginMethods: {
            title: "Login-Methoden",
            description: "Verfügbare Authentifizierungsmethoden",
            password: {
              title: "Passwort-Login",
              description: "Standard-Passwort-Authentifizierung",
              enabled: {
                badge: "Aktiviert",
              },
            },
            social: {
              title: "Social-Login",
              description: "Social-Media-Authentifizierungsoptionen",
              enabled: {
                badge: "Aktiviert",
              },
              providers: {
                item: {
                  title: "Social-Media-Anbieter",
                  description: "Social-Authentifizierungsanbieter",
                },
                name: {
                  content: "Anbieter-Name",
                },
                id: {
                  content: "Anbieter-ID",
                },
                enabled: {
                  badge: "Verfügbar",
                },
                description: "Anbieter-Beschreibung",
              },
            },
          },
          security: {
            title: "Sicherheitseinstellungen",
            description: "Sicherheitsanforderungs-Zusammenfassung",
            maxAttempts: {
              content: "Maximale Login-Versuche",
            },
            requireTwoFactor: {
              badge: "2FA erforderlich",
            },
          },
          recommendations: {
            item: "Empfohlene Login-Option",
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
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
          unsavedChanges: {
            title: "Nicht gespeicherte Änderungen",
            description: "Änderungen wurden nicht gespeichert",
          },
        },
        success: {
          title: "Erfolgreich",
          description: "Login-Optionen erfolgreich abgerufen",
        },
        post: {
          title: "Login-Optionen",
          description: "Verfügbare Login-Optionen abrufen",
          response: {
            title: "Login-Optionen-Antwort",
            description: "Verfügbare Login-Konfigurationsoptionen",
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
            server: {
              title: "Serverfehler",
              description: "Interner Serverfehler aufgetreten",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unbekannter Fehler ist aufgetreten",
            },
          },
          success: {
            description: "Login-Optionen erfolgreich abgerufen",
          },
        },
        enums: {
          socialProviders: {
            google: "Google",
            github: "GitHub",
            facebook: "Facebook",
          },
        },
        messages: {
          successMessage: "Login-Optionen erfolgreich abgerufen",
          passwordAuthDescription:
            "Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an",
          socialAuthDescription:
            "Melden Sie sich mit Ihren Social-Media-Konten an",
          continueWithProvider: "Weiter mit {{provider}}",
          twoFactorRequired: "Erhöhte Sicherheit: 2FA erforderlich",
          standardSecurity: "Standard-Sicherheitsanforderungen",
          tryPasswordFirst: "Versuchen Sie zuerst die Passwort-Anmeldung",
          useSocialLogin: "Verwenden Sie Social-Login",
          socialLoginFaster: "Social-Login ist schneller für neue Benutzer",
        },
      },
      actions: {
        submit: "Anmelden",
        submitting: "Wird angemeldet...",
      },
      fields: {
        email: {
          label: "Deine E-Mail",
          description: "Die E-Mail, mit der du dich registriert hast.",
          placeholder: "E-Mail eingeben",
          validation: {
            required: "E-Mail ist erforderlich",
            invalid: "Bitte gib eine gültige E-Mail-Adresse ein",
          },
        },
        password: {
          label: "Dein Passwort",
          description:
            "Gib das Passwort ein, das du bei der Registrierung festgelegt hast.",
          placeholder: "Passwort eingeben",
          help: "Gib dein Kontopasswort ein",
          validation: {
            required: "Passwort ist erforderlich",
            minLength: "Passwort muss mindestens 8 Zeichen lang sein",
          },
        },
        rememberMe: {
          label: "Angemeldet bleiben",
        },
      },
      groups: {
        credentials: {
          title: "Anmeldedaten",
          description: "Geben Sie Ihre Anmeldeinformationen ein",
        },
        options: {
          title: "Anmeldeoptionen",
          description: "Zusätzliche Anmeldeeinstellungen und Optionen",
        },
        preferences: {
          title: "Anmeldeeinstellungen",
          description: "Zusätzliche Anmeldeoptionen",
        },
        advanced: {
          title: "Erweiterte Optionen",
          description: "Erweiterte Anmeldeeinstellungen",
        },
      },
      footer: {
        forgotPassword: "Passwort vergessen?",
        createAccount: "Noch kein Konto? Registrieren",
      },
      response: {
        title: "Anmeldungsantwort",
        description: "Anmeldungsantwortdaten",
        success: "Anmeldung erfolgreich",
        message: "Status-Nachricht",
        user: {
          title: "Benutzerdetails",
          description: "Informationen des angemeldeten Benutzers",
          id: "Benutzer-ID",
          email: "E-Mail-Adresse",
          firstName: "Vorname",
          lastName: "Nachname",
          privateName: "Privater Name",
          publicName: "Öffentlicher Name",
          imageUrl: "Profilbild",
        },
        sessionInfo: {
          title: "Sitzungsinformationen",
          description: "Details der Benutzersitzung",
          expiresAt: "Sitzung läuft ab",
          rememberMeActive: "Angemeldet bleiben Status",
          loginLocation: "Anmeldeort",
        },
        nextSteps: {
          title: "Nächste Schritte",
          item: "Nächste Schritte",
        },
      },
      errors: {
        title: "Anmeldefehler",
        account_locked: "Konto ist gesperrt",
        accountLocked: "Konto ist gesperrt",
        accountLockedDescription:
          "Ihr Konto wurde gesperrt. Bitte kontaktieren Sie den Support.",
        invalid_credentials: "Ungültige E-Mail oder Passwort",
        two_factor_required: "Zwei-Faktor-Authentifizierung erforderlich",
        auth_error: "Authentifizierungsfehler aufgetreten",
        user_not_found: "Benutzer nicht gefunden",
        session_creation_failed: "Sitzung konnte nicht erstellt werden",
        token_save_failed:
          "Authentifizierungs-Token konnte nicht gespeichert werden",
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Bitte überprüfen Sie Ihre Eingabe",
        },
        unauthorized: {
          title: "Anmeldung fehlgeschlagen",
          description: "Ungültige Anmeldedaten",
        },
        unknown: {
          title: "Anmeldungsfehler",
          description: "Bei der Anmeldung ist ein Fehler aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung fehlgeschlagen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Anmeldung nicht erlaubt",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Benutzerkonto nicht gefunden",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Änderungen wurden nicht gespeichert",
        },
        conflict: {
          title: "Anmeldungskonflikt",
          description: "Anmeldungskonflikt erkannt",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
        },
      },
      success: {
        title: "Login erfolgreich",
        description: "Du bist jetzt eingeloggt",
        message: "Willkommen zurück! Du hast dich erfolgreich eingeloggt.",
      },
      token: {
        save: {
          failed: "Authentifizierungstoken konnte nicht gespeichert werden",
          success: "Authentifizierungstoken erfolgreich gespeichert",
        },
      },
      process: {
        failed: "Anmeldevorgang fehlgeschlagen",
      },
      enums: {
        socialProviders: {
          google: "Google",
          github: "GitHub",
          facebook: "Facebook",
        },
      },
      dev: {
        quickLogin: "Schnell-Login (Dev)",
      },
    },
    resetPassword: {
      confirm: {
        category: "Benutzer",

        title: "Passwort-Reset bestätigen",
        description:
          "Bestätigen Sie Ihr Passwort-Reset mit einem neuen Passwort",
        tag: "Passwort-Reset",
        email: {
          title: "Passwort erfolgreich zurückgesetzt",
          subject: "Passwort erfolgreich zurückgesetzt - {{appName}}",
          previewText:
            "Ihr {{appName}}-Passwort wurde zurückgesetzt. Melden Sie sich an und chatten Sie mit {{modelCount}} KI-Modellen.",
          greeting: "Hey {{name}},",
          successMessage:
            "Ihr Passwort wurde zurückgesetzt. Alles erledigt - melden Sie sich an und machen Sie dort weiter, wo Sie aufgehört haben.",
          loginButton: "Bei {{appName}} anmelden",
          promoText:
            "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
          securityWarning:
            "Passwort nicht zurückgesetzt? Kontaktieren Sie sofort den Support - Ihr Konto könnte gefährdet sein.",
        },
        groups: {
          verification: {
            title: "Verifizierung",
            description: "Verifizieren Sie Ihre Passwort-Reset-Anfrage",
          },
          newPassword: {
            title: "Neues Passwort",
            description: "Setzen Sie Ihr neues Passwort",
          },
        },
        fields: {
          token: {
            label: "Reset-Token",
            description: "Der Passwort-Reset-Token aus Ihrer E-Mail",
            placeholder: "Reset-Token eingeben",
            help: "Überprüfen Sie Ihre E-Mail für den Passwort-Reset-Token und geben Sie ihn hier ein",
            validation: {
              required: "Reset-Token ist erforderlich",
            },
          },
          email: {
            label: "E-Mail-Adresse",
            description: "Ihre E-Mail-Adresse",
            placeholder: "E-Mail-Adresse eingeben",
            validation: {
              invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
            },
          },
          password: {
            label: "Neues Passwort",
            description: "Ihr neues Passwort",
            placeholder: "Neues Passwort eingeben",
            help: "Wählen Sie ein starkes Passwort mit mindestens 8 Zeichen, einschließlich Buchstaben, Zahlen und Symbolen",
            validation: {
              minLength: "Passwort muss mindestens 8 Zeichen lang sein",
            },
          },
          confirmPassword: {
            label: "Passwort bestätigen",
            description: "Bestätigen Sie Ihr neues Passwort",
            placeholder: "Neues Passwort bestätigen",
            validation: {
              minLength: "Passwort muss mindestens 8 Zeichen lang sein",
            },
          },
        },
        validation: {
          passwords: {
            mismatch: "Passwörter stimmen nicht überein",
          },
        },
        response: {
          title: "Passwort-Reset-Antwort",
          description: "Passwort-Reset-Bestätigungsantwort",
          message: {
            label: "Nachricht",
            description: "Antwortnachricht",
          },
          securityTip:
            "Erwägen Sie die Aktivierung der Zwei-Faktor-Authentifizierung für bessere Sicherheit",
          nextSteps: [
            "Melden Sie sich mit Ihrem neuen Passwort an",
            "Aktualisieren Sie gespeicherte Passwörter in Ihrem Browser",
            "Erwägen Sie die Aktivierung von 2FA für zusätzliche Sicherheit",
          ],
        },
        errors: {
          title: "Fehler beim Zurücksetzen des Passworts",
          no_email: "Kein Konto mit dieser E-Mail-Adresse gefunden",
          validation: {
            title: "Validierungsfehler",
            description:
              "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
            passwordsDoNotMatch: "Passwörter stimmen nicht überein",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Ungültiger oder abgelaufener Reset-Token",
          },
          internal: {
            title: "Serverfehler",
            description: "Ein interner Serverfehler ist aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkverbindungsfehler",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung für diese Aktion",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Reset-Token nicht gefunden oder abgelaufen",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Es gibt ungespeicherte Änderungen",
          },
          conflict: {
            title: "Konflikt",
            description:
              "Beim Verarbeiten Ihrer Anfrage ist ein Konflikt aufgetreten",
          },
        },
        success: {
          title: "Passwort-Reset erfolgreich",
          description: "Ihr Passwort wurde erfolgreich zurückgesetzt",
          message: "Passwort wurde erfolgreich zurückgesetzt",
          password_reset: "Ihr Passwort wurde erfolgreich zurückgesetzt",
        },
        actions: {
          requestNewLink: "Neuen Reset-Link anfordern",
        },
        emailTemplates: {
          confirm: {
            name: "E-Mail zur Passwort-Reset-Bestätigung",
            description:
              "E-Mail, die an Benutzer gesendet wird, nachdem ihr Passwort erfolgreich zurückgesetzt wurde",
            category: "Authentifizierung",
            preview: {
              publicName: {
                label: "Öffentlicher Name",
                description: "Der öffentliche Anzeigename des Benutzers",
              },
              userId: {
                label: "Benutzer-ID",
                description: "Die eindeutige Kennung des Benutzers",
              },
            },
          },
        },
      },
      request: {
        category: "Benutzer",
        title: "Passwort-Reset Anfrage",
        description: "Passwort-Reset anfordern",
        tag: "Passwort-Reset",
        ui: {
          title: "Passwort zurücksetzen",
          subtitle:
            "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen",
          sendResetLink: "Reset-Link senden",
          alreadyHaveAccount: "Bereits ein Konto? Anmelden",
        },
        actions: {
          submitting: "Senden...",
        },
        email: {
          title: "Ihr {{appName}}-Passwort zurücksetzen",
          subject: "Anfrage zur Passwortzurücksetzung - {{appName}}",
          previewText:
            "Ihr {{appName}}-Passwort zurücksetzen - Link gültig für {{hours}} Stunden.",
          greeting: "Hey {{name}},",
          requestInfo:
            "Jemand hat eine Passwortzurücksetzung für Ihr {{appName}}-Konto angefordert. Falls Sie das waren, klicken Sie auf den Button unten.",
          buttonText: "Mein Passwort zurücksetzen",
          expirationInfo:
            "Link läuft in {{hours}} Stunden ab. Falls Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail - Ihr Passwort bleibt unverändert.",
          signoff: "Das {{appName}} Team",
          promoText:
            "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
        },
        groups: {
          emailInput: {
            title: "E-Mail-Eingabe",
            description:
              "Geben Sie Ihre E-Mail-Adresse ein, um Reset-Anweisungen zu erhalten",
          },
        },
        fields: {
          email: {
            label: "E-Mail-Adresse",
            description: "Geben Sie Ihre E-Mail-Adresse ein",
            placeholder: "ihre@email.de",
            help: "Geben Sie die mit Ihrem Konto verknüpfte E-Mail-Adresse ein",
            validation: {
              invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
            },
          },
        },
        response: {
          title: "Reset-Anfrage-Antwort",
          description: "Passwort-Reset-Anfrage-Antwort",
          success: {
            message: "Passwort-Reset-Link erfolgreich gesendet",
          },
          deliveryInfo: {
            estimatedTime: "innerhalb von 5 Minuten",
            expiresAt: "4 Stunden ab jetzt",
          },
          nextSteps: {
            checkEmail: "Überprüfen Sie Ihren E-Mail-Eingang und Spam-Ordner",
            clickLink: "Klicken Sie auf den Reset-Link in der E-Mail",
            createPassword: "Erstellen Sie ein neues sicheres Passwort",
          },
        },
        errors: {
          title: "Fehler",
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Eingabe bereitgestellt",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Anfrage nicht autorisiert",
          },
          internal: {
            title: "Interner Fehler",
            description: "Interner Serverfehler",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkverbindungsfehler",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Änderungen wurden nicht gespeichert",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
          no_email: "Kein Konto mit dieser E-Mail-Adresse gefunden",
          email_generation_failed: "E-Mail konnte nicht generiert werden",
        },
        success: {
          title: "Anfrage gesendet",
          description: "Passwort-Reset-Anfrage erfolgreich gesendet",
        },
        post: {
          title: "Titel",
          description: "Endpunkt-Beschreibung",
          form: {
            title: "Konfiguration",
            description: "Parameter konfigurieren",
          },
          response: {
            title: "Antwort",
            description: "Antwortdaten",
          },
          errors: {
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            validation: {
              title: "Validierungsfehler",
              description: "Ungültige Anfrageparameter",
            },
            server: {
              title: "Serverfehler",
              description: "Interner Serverfehler",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unbekannter Fehler ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Netzwerkfehler aufgetreten",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verboten",
            },
            notFound: {
              title: "Nicht gefunden",
              description: "Ressource nicht gefunden",
            },
            conflict: {
              title: "Konflikt",
              description: "Datenkonflikt aufgetreten",
            },
          },
          success: {
            title: "Erfolg",
            description: "Vorgang erfolgreich abgeschlossen",
          },
        },
        emailTemplates: {
          request: {
            name: "E-Mail zur Passwort-Reset-Anfrage",
            description:
              "E-Mail, die an Benutzer mit einem Link zum Zurücksetzen ihres Passworts gesendet wird",
            category: "Authentifizierung",
            preview: {
              publicName: {
                label: "Öffentlicher Name",
                description: "Der öffentliche Anzeigename des Benutzers",
              },
              userId: {
                label: "Benutzer-ID",
                description: "Die eindeutige Kennung des Benutzers",
              },
              passwordResetUrl: {
                label: "Passwort-Reset-URL",
                description: "Die URL zum Zurücksetzen des Passworts",
              },
            },
          },
        },
      },
      validate: {
        category: "Benutzer",

        title: "Passwort-Reset-Token validieren",
        description: "Endpunkt zur Validierung des Passwort-Reset-Tokens",
        tag: "Passwort-Reset-Validierung",
        groups: {
          tokenInput: {
            title: "Token-Validierung",
            description:
              "Geben Sie das Passwort-Reset-Token zur Validierung ein",
          },
        },
        fields: {
          token: {
            label: "Reset-Token",
            description: "Passwort-Reset-Token aus der E-Mail",
            placeholder: "Reset-Token eingeben",
            help: "Geben Sie das Token ein, das Sie per E-Mail erhalten haben",
            validation: {
              required: "Reset-Token ist erforderlich",
            },
          },
        },
        response: {
          title: "Validierungsergebnis",
          description: "Token-Validierungsantwort",
          valid: "Token gültig",
          message: "Validierungsnachricht",
          validationMessage: "Reset-Token-Validierung abgeschlossen",
          userId: "Benutzer-ID",
          expiresAt: "Token läuft ab am",
          nextSteps: {
            item: "Nächste Schritte nach Validierung",
            steps: [
              "Fahren Sie fort, um Ihr neues Passwort festzulegen",
              "Wählen Sie ein starkes, einzigartiges Passwort",
            ],
          },
        },
        errors: {
          title: "Fehler",
          validation: {
            title: "Validierungsfehler",
            description: "Token-Validierung fehlgeschlagen",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Ungültiges oder abgelaufenes Token",
          },
          internal: {
            title: "Interner Fehler",
            description: "Interner Serverfehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Token nicht gefunden",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Ungespeicherte Änderungen erkannt",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
        },
        success: {
          title: "Token gültig",
          description: "Passwort-Reset-Token ist gültig",
        },
        post: {
          title: "Titel",
          description: "Endpunkt-Beschreibung",
          form: {
            title: "Konfiguration",
            description: "Parameter konfigurieren",
          },
          response: {
            title: "Antwort",
            description: "Antwortdaten",
          },
          errors: {
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            validation: {
              title: "Validierungsfehler",
              description: "Ungültige Anfrageparameter",
            },
            server: {
              title: "Serverfehler",
              description: "Interner Serverfehler",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unbekannter Fehler ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Netzwerkfehler aufgetreten",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verboten",
            },
            notFound: {
              title: "Nicht gefunden",
              description: "Ressource nicht gefunden",
            },
            conflict: {
              title: "Konflikt",
              description: "Datenkonflikt aufgetreten",
            },
          },
          success: {
            title: "Erfolg",
            description: "Vorgang erfolgreich abgeschlossen",
          },
        },
      },
      actions: {
        back: "Zurück",
        submit: "Absenden",
        submitting: "Wird gesendet...",
      },
      success: {
        password_reset: "Ihr Passwort wurde erfolgreich zurückgesetzt.",
      },
      errors: {
        tokenValidationFailed: "Token-Validierung fehlgeschlagen",
        userLookupFailed: "Benutzer konnte nicht gefunden werden",
        tokenDeletionFailed: "Token konnte nicht gelöscht werden",
        userDeletionFailed: "Benutzer konnte nicht gelöscht werden",
        resetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
        tokenCreationFailed: "Reset-Token konnte nicht erstellt werden",
        noDataReturned: "Keine Daten von der Datenbank zurückgegeben",
        tokenInvalid: "Reset-Token ist ungültig",
        tokenExpired: "Reset-Token ist abgelaufen",
        tokenVerificationFailed: "Token-Verifizierung fehlgeschlagen",
        userNotFound: "Benutzer nicht gefunden",
        passwordUpdateFailed: "Passwort konnte nicht aktualisiert werden",
        passwordResetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
        requestFailed: "Reset-Anfrage fehlgeschlagen",
        emailMismatch: "E-Mail stimmt nicht überein",
        confirmationFailed: "Passwort-Zurücksetzungsbestätigung fehlgeschlagen",
      },
    },
    signup: {
      category: "Benutzer",

      _components: {
        passwordStrength: {
          label: "Passwortstärke",
          weak: "Schwach",
          fair: "Ausreichend",
          good: "Gut",
          strong: "Stark",
          requirement: {
            minLength: {
              icon: "✗",
              text: "Mindestens 8 Zeichen",
            },
            uppercase: {
              icon: "✗",
              text: "Mindestens ein Großbuchstabe",
            },
            lowercase: {
              icon: "✗",
              text: "Mindestens ein Kleinbuchstabe",
            },
            number: {
              icon: "✗",
              text: "Mindestens eine Zahl",
            },
            special: {
              icon: "!",
              text: "Sonderzeichen (optional, verbessert Stärke)",
            },
          },
        },
        post: {
          title: "Titel",
          description: "Endpunkt-Beschreibung",
          form: {
            title: "Konfiguration",
            description: "Parameter konfigurieren",
          },
          response: {
            title: "Antwort",
            description: "Antwortdaten",
          },
          errors: {
            unauthorized: {
              title: "Nicht autorisiert",
              description: "Authentifizierung erforderlich",
            },
            validation: {
              title: "Validierungsfehler",
              description: "Ungültige Anfrageparameter",
            },
            server: {
              title: "Serverfehler",
              description: "Interner Serverfehler",
            },
            unknown: {
              title: "Unbekannter Fehler",
              description: "Ein unbekannter Fehler ist aufgetreten",
            },
            network: {
              title: "Netzwerkfehler",
              description: "Netzwerkfehler aufgetreten",
            },
            forbidden: {
              title: "Verboten",
              description: "Zugriff verboten",
            },
            notFound: {
              title: "Nicht gefunden",
              description: "Ressource nicht gefunden",
            },
            conflict: {
              title: "Konflikt",
              description: "Datenkonflikt aufgetreten",
            },
          },
          success: {
            title: "Erfolg",
            description: "Vorgang erfolgreich abgeschlossen",
          },
        },
      },
      title: "Benutzerregistrierung",
      description: "Endpunkt zur Benutzerregistrierung",
      tag: "Authentifizierung",
      actions: {
        submit: "Konto erstellen",
        submitting: "Konto wird erstellt...",
      },
      fields: {
        privateName: {
          label: "Dein privater Name",
          description:
            "Wie die KI dich in privaten Gesprächen ansprechen wird. Das bleibt zwischen dir und der KI - komplett privat.",
          placeholder: "Gib deinen Namen ein",
          validation: {
            required: "Privater Name ist erforderlich",
            minLength: "Name muss mindestens 2 Zeichen lang sein",
            maxLength: "Name darf nicht länger als 100 Zeichen sein",
          },
        },
        publicName: {
          label: "Dein öffentlicher Name",
          description:
            "Deine Identität in öffentlichen Chats und Foren. Andere User und KIs werden diesen Namen sehen. Wähle weise - er repräsentiert dich in der Community.",
          placeholder: "Gib deinen Anzeigenamen ein",
          validation: {
            required: "Anzeigename ist erforderlich",
            minLength: "Anzeigename muss mindestens 2 Zeichen lang sein",
            maxLength: "Anzeigename darf nicht länger als 100 Zeichen sein",
          },
        },
        email: {
          label: "Deine E-Mail",
          description:
            "Deine Login-Zugangsdaten und Kontaktmethode. Bleibt privat - wird niemals mit anderen Usern oder KIs geteilt.",
          placeholder: "E-Mail-Adresse eingeben",
          help: "Dies wird deine Login-E-Mail und primäre Kontaktmethode sein",
          validation: {
            required: "E-Mail ist erforderlich",
            invalid: "Bitte gib eine gültige E-Mail-Adresse ein",
          },
        },
        password: {
          label: "Dein Passwort",
          description:
            "Starke Passwörter schützen dein Konto. Wir implementieren bald Ende-zu-Ende-Verschlüsselung - ab diesem Zeitpunkt werden Passwort-Resets deinen Nachrichtenverlauf löschen, da nur du den Entschlüsselungsschlüssel besitzt. Speichere es also sicher ab.",
          placeholder: "Passwort eingeben",
          validation: {
            required: "Passwort ist erforderlich",
            minLength: "Passwort muss mindestens 8 Zeichen lang sein",
            complexity:
              "Passwort muss Großbuchstaben, Kleinbuchstaben und eine Zahl enthalten",
          },
        },
        confirmPassword: {
          label: "Passwort bestätigen",
          validation: {
            required: "Bitte bestätige dein Passwort",
            minLength: "Passwort muss mindestens 8 Zeichen lang sein",
            mismatch: "Passwörter stimmen nicht überein",
          },
        },

        acceptTerms: {
          label: "AGB akzeptieren",
          description:
            "Unsere Bedingungen respektieren deine Freiheit und Privatsphäre.",
          termsLink: "AGB",
          conditionsLink: "Datenschutz",
          descriptionPrefix: "Unsere",
          descriptionAnd: "und",
          descriptionSuffix: "respektieren deine Freiheit und Privatsphäre.",
          validation: {
            required: "Du musst die AGB akzeptieren, um fortzufahren",
          },
        },
        subscribeToNewsletter: {
          label: "Newsletter abonnieren",
          description:
            "Gelegentliche Updates über neue Modelle und Features. Kein Spam, nur was zählt.",
        },

        referralCode: {
          label: "Empfehlungscode (optional)",
          description:
            "Hast du einen Freund auf unbottled.ai? Gib seinen Code ein, um ihn zu unterstützen. Er wird dafür belohnt, dass er dich mitgebracht hat.",
          placeholder: "Empfehlungscode eingeben (optional)",
          labelPrefilled: "Empfehlungscode",
          descriptionPrefilled:
            "Dein Freund wird belohnt, wenn du ein Konto erstellst.",
        },
        supportedSkillId: {
          label: "Creator unterstützen",
          description:
            "Deine Registrierung bringt dem Ersteller dieses Skills +5% auf deine Abonnements.",
          selectorTitle: "Creator unterstützen",
          selectorDescription:
            "Du hast Skills von unabhängigen Creators in deine Favoriten aufgenommen. Wähle einen zum Unterstützen - er erhält +5% aus deinen Abonnements. Du kannst das jederzeit ändern.",
          selectorNone: "Keinen (überspringen)",
        },
        localFavorites: {
          label: "Lokale Favoriten",
        },
      },
      form: {
        title: "Willkommen bei Uncensored AI",
        description:
          "Hilf mit, unzensierte, privatsphäre-orientierte und wirklich unabhängige KI aufzubauen. unbottled.ai ist Open Source und Community-getrieben - deine Registrierung unterstützt die Entwicklung von KI-Technologie, die deine Freiheit respektiert.",
      },
      footer: {
        alreadyHaveAccount: "Haben Sie bereits ein Konto? Anmelden",
      },

      errors: {
        title: "Anmeldefehler",
        validation: {
          title: "Validierungsfehler",
          description:
            "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Serverfehler ist aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        conflict: {
          title: "Kontokonflikt",
          description: "Ein Konto mit dieser E-Mail existiert bereits",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description: "Zugriff verweigert",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        internal: {
          title: "Interner Fehler",
          description: "Ein interner Fehler ist aufgetreten",
        },
      },
      emailCheck: {
        title: "E-Mail-Verfügbarkeitsprüfung",
        description:
          "Prüfen Sie, ob die E-Mail für die Registrierung verfügbar ist",
        tag: "E-Mail-Prüfung",
        fields: {
          email: {
            label: "E-Mail-Adresse",
            description: "Zu prüfende E-Mail",
            placeholder: "E-Mail-Adresse eingeben",
            validation: {
              invalid: "Ungültiges E-Mail-Format",
            },
          },
        },
        response: {
          title: "E-Mail-Prüfungsantwort",
          description: "Ergebnis der E-Mail-Verfügbarkeitsprüfung",
          available: "E-Mail verfügbar",
          message: "Verfügbarkeitsnachricht",
        },
        errors: {
          validation: {
            title: "Ungültige E-Mail",
            description: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
          },
          internal: {
            title: "E-Mail-Prüfungsfehler",
            description: "Fehler bei der Überprüfung der E-Mail-Verfügbarkeit",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unerwarteter Fehler ist aufgetreten",
          },
          conflict: {
            title: "E-Mail bereits vergeben",
            description: "Diese E-Mail ist bereits registriert",
          },
          forbidden: {
            title: "Zugriff verweigert",
            description: "Sie haben keine Berechtigung, diese E-Mail zu prüfen",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler beim Prüfen der E-Mail",
          },
          notFound: {
            title: "Service nicht gefunden",
            description: "E-Mail-Prüfungsservice ist nicht verfügbar",
          },
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich zum Prüfen der E-Mail",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Sie haben ungespeicherte Änderungen",
          },
        },
        success: {
          title: "E-Mail-Prüfung abgeschlossen",
          description: "E-Mail-Verfügbarkeit erfolgreich geprüft",
        },
      },
      post: {
        title: "Registrierung",
        description: "Registrierungs-Endpunkt",
        form: {
          title: "Registrierungskonfiguration",
          description: "Registrierungsparameter konfigurieren",
        },
        response: {
          title: "Antwort",
          description: "Registrierungsantwortdaten",
          success: "Registrierung erfolgreich",
          message: "Statusnachricht",
          userId: "Benutzer-ID",
          nextSteps: "Nächste Schritte",
        },
        errors: {
          unauthorized: {
            title: "Nicht autorisiert",
            description: "Authentifizierung erforderlich",
          },
          validation: {
            title: "Validierungsfehler",
            description: "Ungültige Anfrageparameter",
          },
          server: {
            title: "Serverfehler",
            description: "Interner Serverfehler aufgetreten",
          },
          unknown: {
            title: "Unbekannter Fehler",
            description: "Ein unbekannter Fehler ist aufgetreten",
          },
          network: {
            title: "Netzwerkfehler",
            description: "Netzwerkfehler aufgetreten",
          },
          forbidden: {
            title: "Verboten",
            description: "Zugriff verboten",
          },
          notFound: {
            title: "Nicht gefunden",
            description: "Ressource nicht gefunden",
          },
          conflict: {
            title: "Konflikt",
            description: "Datenkonflikt aufgetreten",
          },
          unsaved: {
            title: "Ungespeicherte Änderungen",
            description: "Sie haben ungespeicherte Änderungen",
          },
        },
        success: {
          title: "Erfolg",
          description: "Vorgang erfolgreich abgeschlossen",
          processing: "Registrierung wird erfolgreich verarbeitet",
        },
      },
      response: {
        title: "Antwort",
        description: "Registrierungsantwortdaten",
        success: "Registrierung erfolgreich",
        message: "Statusnachricht",
        user: {
          id: "Benutzer-ID",
          email: "E-Mail-Adresse",
          firstName: "Vorname",
          lastName: "Nachname",
          privateName: "Privater Name",
          publicName: "Öffentlicher Name",
          imageUrl: "Profilbild-URL",
          verificationRequired: "Verifizierung erforderlich",
        },
        verificationInfo: {
          title: "E-Mail-Verifizierung",
          description: "Details zum E-Mail-Verifizierungsprozess",
          emailSent: "E-Mail gesendet",
          expiresAt: "Verifizierung läuft ab am",
          checkSpamFolder: "Spam-Ordner prüfen",
        },
        nextSteps: "Nächste Schritte",
      },
      success: {
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erfolgreich erstellt",
      },
      admin_notification: {
        title: "Neue Benutzeranmeldung",
        subject: "Neue Benutzeranmeldung - {{privateName}}",
        preview: "Neuer Benutzer {{privateName}} hat sich angemeldet",
        message: "Ein neuer Benutzer hat sich bei {{appName}} angemeldet",
        privateName: "Privater Name",
        publicName: "Öffentlicher Name",
        email: "E-Mail",
        locale: "Sprache",
        creditBalance: "Guthaben",
        leadCreditBalance: "Lead-Guthaben",
        signup_preferences: "Anmeldepräferenzen",
        user_details: "Benutzerdetails",
        basic_information: "Grundlegende Informationen",
        signup_type: "Anmeldetyp",
        direct_signup: "Direkte Anmeldung",
        newsletter: "Newsletter",
        subscribed: "Abonniert",
        not_subscribed: "Nicht abonniert",
        signup_details: "Anmeldedetails",
        signup_date: "Anmeldedatum",
        user_id: "Benutzer-ID",
        recommended_next_steps: "Empfohlene nächste Schritte",
        direct_recommendation:
          "Benutzerprofil und Zahlungseinrichtung überprüfen",
        contact_user: "Benutzer kontaktieren",
        footer: "Dies ist eine automatische Benachrichtigung von {{appName}}",
      },
      email: {
        subject: "Du bist dabei - {{appName}} wartet auf dich",
        previewText:
          "Hey {{privateName}}, dein Account ist bereit. Chatte mit Claude, GPT, Gemini, DeepSeek und {{modelCount}} weiteren - kostenlos, keine Kreditkarte nötig.",
        headline: "Deine KI wartet.",
        greeting: "Hey {{privateName}},",
        intro:
          "Willkommen bei {{appName}}. Du hast gerade Zugang zur umfassendsten KI-Chat-Plattform bekommen - alles, was du an ChatGPT liebst, plus Open-Source-Modelle und Modelle ohne Inhaltsfilter.",
        models: {
          title: "{{modelCount}} Modelle in 3 Kategorien",
          mainstream: "Mainstream",
          open: "Open Source",
          uncensored: "Unzensiert",
        },
        free: {
          title: "Was du kostenlos bekommst, für immer:",
          credits:
            "{{freeCredits}} Credits pro Monat - keine Karte, kein Ablaufdatum",
          allModels: "Zugriff auf alle {{modelCount}} KI-Modelle",
          uncensored:
            "4 unzensierte Modelle, die deine Fragen wirklich beantworten",
          chatModes: "Private, Inkognito-, Geteilte und Öffentliche Chat-Modi",
          noCard: "Keine Kreditkarte erforderlich - niemals",
        },
        ctaButton: "Jetzt chatten",
        upgrade: {
          title: "Mehr haben?",
          desc: "{{subscriptionPrice}}/Monat gibt dir {{subscriptionCredits}} Credits - das ist 40× mehr. Dazu kannst du extra Credit-Pakete kaufen, die niemals ablaufen. Perfekt für tägliche KI-Nutzung.",
          cta: "Auf Pro upgraden",
        },
        signoff: "Viel Spaß beim Chatten,\nDas {{appName}} Team",
        ps: "P.S. Nutze den Inkognito-Modus, um Gespräche nur auf deinem Gerät zu behalten - wir speichern sie niemals auf unseren Servern.",
      },
      emailTemplates: {
        welcome: {
          name: "Willkommens-E-Mail nach Registrierung",
          description:
            "Willkommens-E-Mail, die nach erfolgreicher Registrierung an Benutzer gesendet wird",
          category: "Authentifizierung",
          preview: {
            privateName: {
              label: "Privater Name",
              description: "Der private Name des Benutzers",
            },
            userId: {
              label: "Benutzer-ID",
              description: "Die eindeutige Kennung des Benutzers",
            },
            leadId: {
              label: "Lead-ID",
              description: "Die Lead-Kennung des Benutzers",
            },
          },
        },
        adminSignup: {
          name: "Admin-Benachrichtigungs-E-Mail bei Registrierung",
          description:
            "E-Mail, die an Admins gesendet wird, wenn sich ein neuer Benutzer registriert",
          category: "Administration",
          preview: {
            privateName: {
              label: "Privater Name",
            },
            publicName: {
              label: "Öffentlicher Name",
            },
            email: {
              label: "E-Mail-Adresse",
            },
            userId: {
              label: "Benutzer-ID",
            },
            subscribeToNewsletter: {
              label: "Newsletter-Abonnement",
            },
          },
        },
      },
    },
  },
  search: {
    category: "Benutzer",

    title: "Benutzersuche",
    description: "Nach Benutzern suchen",
    tag: "Benutzersuche",
    container: {
      title: "Such-Container",
      description: "Benutzersuche-Container",
    },
    groups: {
      searchCriteria: {
        title: "Suchkriterien",
        description: "Definieren Sie Ihre Suchparameter",
      },
      filters: {
        title: "Erweiterte Filter",
        description: "Zusätzliche Filteroptionen",
      },
      pagination: {
        title: "Seitennummerierung",
        description: "Steuern Sie, wie Ergebnisse paginiert werden",
      },
    },
    fields: {
      search: {
        label: "Suchanfrage",
        description: "Suchbegriffe eingeben",
        placeholder: "Benutzer suchen...",
        help: "Suche nach Name, E-Mail oder Unternehmen",
        validation: {
          minLength: "Suchanfrage muss mindestens 2 Zeichen lang sein",
        },
      },
      roles: {
        label: "Benutzerrollen",
        description: "Nach Benutzerrollen filtern",
        placeholder: "Rollen auswählen...",
        help: "Wählen Sie eine oder mehrere Rollen zum Filtern",
      },
      status: {
        label: "Benutzerstatus",
        description: "Nach Benutzerstatus filtern",
        placeholder: "Status auswählen...",
        help: "Filtern nach aktiv, inaktiv oder alle Benutzer",
      },
      limit: {
        label: "Limit",
        description: "Maximale Anzahl der Ergebnisse",
        help: "Geben Sie an, wie viele Ergebnisse zurückgegeben werden sollen (Standard: 10)",
      },
      offset: {
        label: "Offset",
        description: "Anzahl der zu überspringenden Ergebnisse",
        help: "Geben Sie den Paginierungs-Offset an (Standard: 0)",
      },
    },
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      all: "Alle",
    },
    response: {
      title: "Suchergebnisse",
      description: "Benutzersuche-Ergebnisse",
      success: {
        badge: "Erfolg",
      },
      message: {
        content: "Suchergebnis-Nachricht",
      },
      searchInfo: {
        title: "Suchinformationen",
        description: "Details über den Suchvorgang",
        searchTerm: "Suchbegriff",
        appliedFilters: "Angewandte Filter",
        searchTime: "Suchzeit",
        totalResults: "Gesamtergebnisse",
      },
      pagination: {
        title: "Paginierungsinfo",
        description: "Seitennavigationsinformationen",
        currentPage: "Aktuelle Seite",
        totalPages: "Gesamtseiten",
        itemsPerPage: "Artikel pro Seite",
        totalItems: "Gesamtartikel",
        hasMore: "Hat mehr",
        hasPrevious: "Hat vorherige",
      },
      actions: {
        title: "Verfügbare Aktionen",
        description: "Aktionen, die Sie mit den Ergebnissen durchführen können",
        type: "Aktionstyp",
        label: "Aktion",
        href: "Link",
      },
      users: {
        label: "Gefundene Benutzer",
        description: "Liste der übereinstimmenden Benutzer",
        item: {
          title: "Benutzer",
          description: "Benutzerkontoinformationen",
        },
        id: "Benutzer-ID",
        leadId: "Lead-ID",
        isPublic: "Öffentlich",
        firstName: "Vorname",
        lastName: "Nachname",
        privateName: "Privater Name",
        publicName: "Öffentlicher Name",
        company: "Unternehmen",
        email: "E-Mail",
        imageUrl: "Avatar",
        isActive: "Aktiv",
        emailVerified: "E-Mail verifiziert",
        requireTwoFactor: "2FA erforderlich",
        marketingConsent: "Marketing-Zustimmung",
        userRoles: {
          item: {
            title: "Rolle",
            description: "Benutzerrollenzuweisung",
          },
          id: "Rollen-ID",
          role: "Rolle",
        },
        createdAt: "Erstellt",
        updatedAt: "Aktualisiert",
      },
    },
    columns: {
      firstName: "Vorname",
      lastName: "Nachname",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
      email: "E-Mail",
      company: "Unternehmen",
      userRoles: "Rollen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Suchparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Suche nicht autorisiert",
      },
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Benutzer gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Suchkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen wurden nicht gespeichert",
      },
    },
    success: {
      title: "Suche erfolgreich",
      description: "Suche erfolgreich abgeschlossen",
    },
    post: {
      title: "Suche",
      description: "Such-Endpunkt",
      form: {
        title: "Suchkonfiguration",
        description: "Suchparameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Suchantwortdaten",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
  },
  "session-cleanup": {
    category: "Benutzer",

    post: {
      title: "Sitzungsbereinigung",
      description: "Abgelaufene Benutzersitzungen und Token bereinigen",
      tag: "Sitzungsbereinigung",
      container: {
        title: "Sitzungsbereinigung",
        description: "Sitzungsbereinigung konfigurieren und ausführen",
      },
      fields: {
        sessionRetentionDays: {
          label: "Sitzungsaufbewahrungstage",
          description: "Anzahl der Tage zur Aufbewahrung von Sitzungen",
        },
        tokenRetentionDays: {
          label: "Token-Aufbewahrungstage",
          description: "Anzahl der Tage zur Aufbewahrung von Token",
        },
        batchSize: {
          label: "Stapelgröße",
          description: "Anzahl der Datensätze pro Stapel",
        },
        dryRun: {
          label: "Probelauf",
          description: "Ohne tatsächliches Löschen ausführen",
        },
      },
      response: {
        sessionsDeleted: "Gelöschte Sitzungen",
        tokensDeleted: "Gelöschte Token",
        totalProcessed: "Gesamt verarbeitet",
        executionTimeMs: "Ausführungszeit (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen Administrator sein",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bereinigungskonfiguration",
        },
      },
      success: {
        title: "Sitzungsbereinigung abgeschlossen",
        description: "Sitzungen und Token erfolgreich bereinigt",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Abgelaufene Benutzersitzungen bereinigen, um die Systemsicherheit zu gewährleisten",
      purpose:
        "Entfernt abgelaufene Sitzungen zur Erhaltung der Sicherheit und Leistung",
      impact:
        "Verbessert die Systemleistung und Sicherheit durch Entfernung veralteter Sitzungsdaten",
      rollback: "Rollback nicht anwendbar für Bereinigungsoperationen",
    },
    errors: {
      default: "Ein Fehler ist beim Bereinigen der Sitzungen aufgetreten",
      execution_failed: {
        title: "Sitzungsbereinigung fehlgeschlagen",
        description: "Fehler beim Bereinigen abgelaufener Sitzungen",
      },
      partial_failure: {
        title: "Teilweise Sitzungsbereinigung fehlgeschlagen",
        description: "Einige Sitzungen konnten nicht bereinigt werden",
      },
      unknown_error: {
        title: "Unbekannter Sitzungsbereinigungsfehler",
        description:
          "Ein unbekannter Fehler ist während der Sitzungsbereinigung aufgetreten",
      },
      invalid_session_retention: {
        title: "Ungültige Sitzungsaufbewahrung",
        description: "Ungültige Sitzungsaufbewahrungsdauer angegeben",
      },
      invalid_token_retention: {
        title: "Ungültige Token-Aufbewahrung",
        description: "Ungültige Token-Aufbewahrungsdauer angegeben",
      },
      invalid_batch_size: {
        title: "Ungültige Stapelgröße",
        description: "Ungültige Stapelgröße für Bereinigung angegeben",
      },
      validation_failed: {
        title: "Validierung fehlgeschlagen",
        description:
          "Validierung der Sitzungsbereinigungskonfiguration fehlgeschlagen",
      },
    },
    success: {
      title: "Sitzungsbereinigung abgeschlossen",
      description: "Abgelaufene Sitzungen erfolgreich bereinigt",
    },
    monitoring: {
      alertTrigger: "Sitzungsbereinigungsaufgabe fehlgeschlagen",
    },
    documentation: {
      overview:
        "Diese Aufgabe entfernt abgelaufene Benutzersitzungen aus dem System, um Sicherheit und Leistung zu gewährleisten",
    },
  },
  sessionCleanup: {
    category: "Benutzer",

    post: {
      title: "Sitzungsbereinigung",
      description: "Abgelaufene Benutzersitzungen und Token bereinigen",
      tag: "Sitzungsbereinigung",
      container: {
        title: "Sitzungsbereinigung",
        description: "Sitzungsbereinigung konfigurieren und ausführen",
      },
      fields: {
        sessionRetentionDays: {
          label: "Sitzungsaufbewahrungstage",
          description: "Anzahl der Tage zur Aufbewahrung von Sitzungen",
        },
        tokenRetentionDays: {
          label: "Token-Aufbewahrungstage",
          description: "Anzahl der Tage zur Aufbewahrung von Token",
        },
        batchSize: {
          label: "Stapelgröße",
          description: "Anzahl der Datensätze pro Stapel",
        },
        dryRun: {
          label: "Probelauf",
          description: "Ohne tatsächliches Löschen ausführen",
        },
      },
      response: {
        sessionsDeleted: "Gelöschte Sitzungen",
        tokensDeleted: "Gelöschte Token",
        totalProcessed: "Gesamt verarbeitet",
        executionTimeMs: "Ausführungszeit (ms)",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen Administrator sein",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Bereinigungskonfiguration",
        },
      },
      success: {
        title: "Sitzungsbereinigung abgeschlossen",
        description: "Sitzungen und Token erfolgreich bereinigt",
      },
    },
    task: {
      name: "user-session-cleanup",
      description:
        "Abgelaufene Benutzersitzungen bereinigen, um die Systemsicherheit zu gewährleisten",
      purpose:
        "Entfernt abgelaufene Sitzungen zur Erhaltung der Sicherheit und Leistung",
      impact:
        "Verbessert die Systemleistung und Sicherheit durch Entfernung veralteter Sitzungsdaten",
      rollback: "Rollback nicht anwendbar für Bereinigungsoperationen",
    },
    errors: {
      default: "Ein Fehler ist beim Bereinigen der Sitzungen aufgetreten",
      execution_failed: {
        title: "Sitzungsbereinigung fehlgeschlagen",
        description: "Fehler beim Bereinigen abgelaufener Sitzungen",
      },
      partial_failure: {
        title: "Teilweise Sitzungsbereinigung fehlgeschlagen",
        description: "Einige Sitzungen konnten nicht bereinigt werden",
      },
      unknown_error: {
        title: "Unbekannter Sitzungsbereinigungsfehler",
        description:
          "Ein unbekannter Fehler ist während der Sitzungsbereinigung aufgetreten",
      },
      invalid_session_retention: {
        title: "Ungültige Sitzungsaufbewahrung",
        description: "Ungültige Sitzungsaufbewahrungsdauer angegeben",
      },
      invalid_token_retention: {
        title: "Ungültige Token-Aufbewahrung",
        description: "Ungültige Token-Aufbewahrungsdauer angegeben",
      },
      invalid_batch_size: {
        title: "Ungültige Stapelgröße",
        description: "Ungültige Stapelgröße für Bereinigung angegeben",
      },
      validation_failed: {
        title: "Validierung fehlgeschlagen",
        description:
          "Validierung der Sitzungsbereinigungskonfiguration fehlgeschlagen",
      },
    },
    success: {
      title: "Sitzungsbereinigung abgeschlossen",
      description: "Abgelaufene Sitzungen erfolgreich bereinigt",
    },
    monitoring: {
      alertTrigger: "Sitzungsbereinigungsaufgabe fehlgeschlagen",
    },
    documentation: {
      overview:
        "Diese Aufgabe entfernt abgelaufene Benutzersitzungen aus dem System, um Sicherheit und Leistung zu gewährleisten",
    },
  },
  userRoles: {
    errors: {
      find_failed: "Benutzerrollen konnten nicht gefunden werden",
      batch_find_failed: "Batch-Suche nach Benutzerrollen fehlgeschlagen",
      not_found: "Benutzerrolle nicht gefunden",
      lookup_failed: "Benutzerrolle konnte nicht abgerufen werden",
      add_failed: "Rolle konnte nicht zum Benutzer hinzugefügt werden",
      no_data_returned: "Keine Daten von der Datenbank zurückgegeben",
      remove_failed: "Rolle konnte nicht vom Benutzer entfernt werden",
      check_failed: "Überprüfung ob Benutzer Rolle hat fehlgeschlagen",
      delete_failed: "Benutzerrollen konnten nicht gelöscht werden",
      endpoint_not_created: "Benutzerrollen-Endpoint wurde noch nicht erstellt",
    },
    post: {
      title: "Benutzerrollen",
      description: "Benutzerrollen-Endpunkt",
      form: {
        title: "Benutzerrollen-Konfiguration",
        description: "Benutzerrollen-Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Benutzerrollen-Antwortdaten",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        database_connection_failed: {
          title: "Datenbankverbindung fehlgeschlagen",
          description: "Verbindung zur Datenbank fehlgeschlagen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
    },
    enums: {
      userRole: {
        public: "Öffentlich",
        customer: "Kunde",
        partnerAdmin: "Partner-Administrator",
        partnerEmployee: "Partner-Mitarbeiter",
        admin: "Administrator",
        cliOff: "CLI Deaktiviert",
        cliAuthBypass: "CLI Auth Bypass",
        aiToolOff: "KI-Tool Deaktiviert",
        webOff: "Web Deaktiviert",
        mcpOff: "MCP Deaktiviert",
        mcpVisible: "MCP Sichtbar",
        productionOff: "Produktion Deaktiviert",
        skillOff: "Skill Deaktiviert",
      },
    },
  },
  profileVisibility: {
    public: "Öffentlich",
    private: "Privat",
    contactsOnly: "Nur Kontakte",
  },
  contactMethods: {
    email: "E-Mail",
    phone: "Telefon",
    sms: "SMS",
    whatsapp: "WhatsApp",
  },
  theme: {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
  },
  userDetailLevel: {
    minimal: "Minimal",
    standard: "Standard",
    complete: "Vollständig",
  },
  language: {
    en: "Englisch",
    de: "Deutsch",
    pl: "Polnisch",
  },
  timezone: {
    utc: "UTC",
    america_new_york: "Amerika/New_York",
    america_los_angeles: "Amerika/Los_Angeles",
    europe_london: "Europa/London",
    europe_berlin: "Europa/Berlin",
    europe_warsaw: "Europa/Warschau",
    asia_tokyo: "Asien/Tokio",
    australia_sydney: "Australien/Sydney",
  },
  errors: {
    emailAlreadyInUse: "E-Mail-Adresse wird bereits verwendet",
    locale_required: "Locale ist erforderlich",
    auth_required:
      "Authentifizierung erforderlich. Eine dieser Rollen: {{roles}}",
    auth_retrieval_failed:
      "Authentifizierung konnte nicht abgerufen werden: {{error}}",
    not_found: "Benutzer nicht gefunden",
    not_found_by_id: "Kein Benutzer mit der ID {{userId}} gefunden",
    not_found_by_email:
      "Kein Benutzer mit der E-Mail-Adresse {{email}} gefunden",
    roles_lookup_failed: "Rollenabfrage für Benutzer {{userId}} fehlgeschlagen",
    roles_batch_fetch_failed:
      "Batch-Rollenabruf für {{count}} Benutzer fehlgeschlagen",
    id_lookup_failed:
      "Benutzer {{userId}} konnte nicht gefunden werden: {{error}}",
    email_lookup_failed:
      "Benutzer mit E-Mail {{email}} konnte nicht gefunden werden: {{error}}",
    email_check_failed:
      "E-Mail-Prüfung für {{email}} fehlgeschlagen: {{error}}",
    email_duplicate_check_failed:
      "Duplikat-Prüfung für E-Mail {{email}} (ohne Benutzer {{excludeUserId}}) fehlgeschlagen: {{error}}",
    search_failed: "Benutzersuche nach {{query}} fehlgeschlagen: {{error}}",
    list_failed: "Benutzerliste konnte nicht geladen werden: {{error}}",
    email_already_in_use: "E-Mail-Adresse wird bereits verwendet",
    creation_failed: "Benutzer konnte nicht erstellt werden: {{error}}",
    no_data_returned: "Keine Daten von der Datenbank zurückgegeben",
    password_hashing_failed:
      "Passwort-Hashing für {{email}} fehlgeschlagen: {{error}}",
    not_implemented_on_native:
      "Diese Funktion ist in React Native nicht implementiert",
    count_failed: "Fehler beim Abrufen der Benutzeranzahl: {{error}}",
  },
  userNoteType: {
    note: "Notiz",
    call: "Anruf",
    email: "E-Mail",
    meeting: "Meeting",
    task: "Aufgabe",
  },
  notifications: {
    profileUpdated: {
      title: "Profil aktualisiert",
      description: "Ihr Profil wurde erfolgreich aktualisiert",
    },
    updateFailed: {
      title: "Aktualisierung fehlgeschlagen",
      description:
        "Ihr Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
    },
  },
};
