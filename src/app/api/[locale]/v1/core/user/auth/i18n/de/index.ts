import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    cookie_set_failed: "Authentifizierungs-Cookie konnte nicht gesetzt werden",
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
    native: {
      unsupported:
        "Diese Authentifizierungsmethode wird in React Native nicht unterstützt",
      storage_failed:
        "Authentifizierungsdaten konnten nicht gespeichert werden",
      clear_failed: "Authentifizierungsdaten konnten nicht gelöscht werden",
    },
    not_implemented_native:
      "Diese Funktion ist noch nicht für React Native implementiert",
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
    gettingCurrentUserFromTrpc: "Aktueller Benutzer wird von tRPC abgerufen",
    errorGettingAuthUserForTrpc:
      "Fehler beim Abrufen des Auth-Benutzers für tRPC",
    errorGettingUserRolesForTrpc:
      "Fehler beim Abrufen der Benutzerrollen für tRPC",
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
    gettingCurrentUserFromToken: "Aktueller Benutzer wird von Token abgerufen",
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
    errorGettingCurrentUserFromTrpc:
      "Fehler beim Abrufen des aktuellen Benutzers von tRPC",
  },
};
