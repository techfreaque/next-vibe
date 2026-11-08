import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzerprofil",
  title: "Zwei-Faktor-Authentifizierung",
  titleShort: "Zwei-Faktor",
  description:
    "Schütze dein Konto mit einem Einmalcode aus einer Authenticator-App. Einrichten, deaktivieren oder Wiederherstellungscodes neu erzeugen.",
  tag: "zwei-faktor",
  enums: {
    action: {
      status: "Status",
      setup: "Einrichtung starten",
      enable: "Bestätigen und aktivieren",
      disable: "Deaktivieren",
      regenerate: "Wiederherstellungscodes neu erzeugen",
    },
  },
  fields: {
    action: {
      label: "Aktion",
      description:
        "status, setup, enable, disable oder regenerate. Setup liefert ein Geheimnis, enable bestätigt es mit einem Code.",
    },
    code: {
      label: "Authentifizierungscode",
      description:
        "6-stelliger Code aus deiner Authenticator-App oder ein Wiederherstellungscode.",
      placeholder: "123456",
    },
    password: {
      label: "Passwort",
      description:
        "Dein Kontopasswort (alternativ zum Code beim Deaktivieren).",
      placeholder: "Dein Passwort",
    },
  },
  response: {
    enabled: "Zwei-Faktor aktiv",
    message: "Status",
    recoveryCodesRemaining: "Verbleibende Wiederherstellungscodes",
    otpauthUri: "Authenticator-URI",
    secret: "Geheimer Schlüssel",
    qrDataUri: "QR-Code",
    recoveryCodes: "Wiederherstellungscodes",
  },
  widget: {
    back: "Zurück",
    statusOn: "An",
    statusOff: "Aus",
    offIntro:
      "Ein zweiter Schritt beim Login. Selbst mit deinem Passwort kommt niemand ohne den Code von deinem Handy hinein.",
    startSetup: "Zwei-Faktor einrichten",
    setupStep1:
      "1. Scanne diesen QR-Code mit einer Authenticator-App (Google Authenticator, Aegis, 1Password, Authy).",
    setupStep2: "Scannen geht nicht? Gib diesen Schlüssel manuell ein:",
    setupStep3: "2. Gib zur Bestätigung den 6-stelligen Code aus der App ein.",
    confirm: "Bestätigen und aktivieren",
    confirming: "Wird bestätigt...",
    cancelSetup: "Abbrechen",
    onIntro:
      "Beim Login wird ein Code aus deiner Authenticator-App verlangt. Verbleibende Wiederherstellungscodes: {{count}}.",
    recoveryTitle: "Wiederherstellungscodes sichern",
    recoveryHint:
      "Jeder Code funktioniert einmal, falls du dein Handy verlierst. Sie werden nur jetzt angezeigt. Bewahre sie sicher auf.",
    recoveryCopy: "Codes kopieren",
    recoveryCopied: "Kopiert",
    recoveryDone: "Ich habe sie gesichert",
    manageTitle: "Verwalten",
    manageHint:
      "Gib einen aktuellen Authenticator-Code (oder einen Wiederherstellungscode) ein, um Einstellungen zu ändern.",
    regenerate: "Wiederherstellungscodes neu erzeugen",
    disable: "Zwei-Faktor ausschalten",
    disablePasswordHint: "Oder bestätige stattdessen mit deinem Passwort:",
    working: "Wird ausgeführt...",
  },
  errors: {
    notConfigured:
      "Zwei-Faktor braucht einen Server-Schlüssel (JWT_SECRET_KEY), der nicht gesetzt ist.",
    alreadyEnabled:
      "Zwei-Faktor ist bereits aktiv. Deaktiviere es zuerst, um die Einrichtung neu zu starten.",
    notEnabled: "Zwei-Faktor ist nicht aktiviert.",
    noPendingSetup: "Keine Einrichtung offen. Starte zuerst die Einrichtung.",
    codeRequired: "Gib den 6-stelligen Code ein.",
    invalidCode:
      "Dieser Code ist ungültig. Prüfe die Uhrzeit auf deinem Handy und versuche es erneut.",
    credentialRequired:
      "Gib einen aktuellen Code, einen Wiederherstellungscode oder dein Passwort ein.",
    invalidPassword: "Falsches Passwort.",
    tooManyAttempts:
      "Zu viele Fehlversuche. Warte ein paar Minuten und versuche es erneut.",
    userNotFound: "Konto nicht gefunden.",
    failed: "Zwei-Faktor-Einstellungen konnten nicht aktualisiert werden.",
    validation: {
      title: "Validierungsfehler",
      description: "Prüfe deine Eingabe und versuche es erneut",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Du musst angemeldet sein, um Zwei-Faktor zu verwalten",
    },
    server: {
      title: "Serverfehler",
      description: "Zwei-Faktor konnte nicht aktualisiert werden",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Dafür fehlt dir die Berechtigung",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Konto konnte nicht gefunden werden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist aufgetreten",
    },
  },
  success: {
    title: "Zwei-Faktor aktualisiert",
    description: "Deine Zwei-Faktor-Einstellungen wurden gespeichert",
    status: "Zwei-Faktor-Status geladen.",
    setupStarted:
      "Scanne den QR-Code und bestätige mit einem Code, um es zu aktivieren.",
    enabled:
      "Zwei-Faktor ist aktiv. Sichere jetzt deine Wiederherstellungscodes - sie werden nur einmal angezeigt.",
    disabled: "Zwei-Faktor ist ausgeschaltet.",
    regenerated:
      "Neue Wiederherstellungscodes erzeugt. Die alten funktionieren nicht mehr.",
  },
};
