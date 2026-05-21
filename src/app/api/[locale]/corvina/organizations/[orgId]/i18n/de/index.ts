export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  get: {
    title: "Corvina-Organisation abrufen",
    description: "Lädt eine einzelne Kunden­organisation per ID.",
    container: {
      title: "Organisation",
      description: "Vollständige Details einer Corvina-Organisation.",
    },
    id: {
      label: "Organisations-ID",
      description: "Numerische oder namensbasierte Corvina-Organisations-ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Bezeichnung",
      status: "Status",
      resourceId: "Ressourcen-ID",
      privateAccess: "Privater Zugriff",
      allowDisablePrivateAccess: "Deaktivierung erlauben",
      hostname: "Hostname",
      hostnameAllowed: "Hostname erlaubt",
      dataEnabled: "Datendienst aktiv",
      vpnEnabled: "VPN aktiv",
      vpnPairingMode: "VPN-Kopplungsmodus",
      vpnOtpRequired: "VPN OTP erforderlich",
      ipAddressesWhitelist: "IP-Whitelist",
      userCanAccess: "Benutzerzugriff",
      storeEnabled: "Shop aktiv",
      dataTemporarilyDisabled: "Daten temporär deaktiviert",
      mfaRequired: "MFA erforderlich",
    },
    widget: {
      edit: "Bearbeiten",
      devices: "Geräte",
      devicesSubtitle: "Geräte & Abonnements verwalten",
      deviceAdd: "Hinzufügen",
      deviceView: "Anzeigen",
      deviceEdit: "Bearbeiten",
      deviceSubscription: "Abonnement",
      deviceBuy: "Kaufen",
      deviceNoSub: "kein Abo",
      deviceNone: "Keine Geräte registriert",
      users: "Benutzer",
      roles: "Rollen",
      deviceLicenses: "Abonnements",
      apps: "Apps",
      install: "App installieren",
      loading: "Organisation wird geladen…",
      sections: {
        identity: "Identität",
        network: "Netzwerk",
        securityServices: "Sicherheit & Dienste",
        settings: "Einstellungen",
      },
      labels: {
        name: "Name",
        label: "Bezeichnung",
        resourceId: "Ressourcen-ID",
        hostname: "Hostname",
        id: "ID",
        vpnMode: "VPN-Modus",
        ipWhitelist: "IP-Whitelist",
      },
      cli: {
        hostnameLabel: "Hostname: ",
      },
      badges: {
        dataOn: "Daten aktiv",
        dataOff: "Daten inaktiv",
        vpnOn: "VPN aktiv",
        vpnOff: "VPN inaktiv",
        private: "Privat",
        public: "Öffentlich",
        customHostname: "Eigener Hostname",
        mfaRequired: "MFA erforderlich",
        mfaOff: "MFA deaktiviert",
        vpnOtp: "VPN OTP",
        noOtp: "Kein OTP",
        storeOn: "Shop aktiv",
        storeOff: "Shop inaktiv",
        userAccess: "Benutzerzugriff",
        noUserAccess: "Kein Benutzerzugriff",
        dataTemporarilyDisabled: "Daten temporär deaktiviert",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Der API-Schlüssel hat keinen Lesezugriff auf diese Organisation.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    enums: {
      orgStatus: {
        new: "Neu",
        provisioning: "Einrichtung",
        done: "Aktiv",
        deleting: "Wird gelöscht",
        deleted: "Gelöscht",
      },
    },
    success: {
      title: "Erfolg",
      description: "Organisation erfolgreich geladen.",
    },
  },
  put: {
    title: "Corvina-Organisation aktualisieren",
    description: "Aktualisiert die Konfiguration einer Corvina-Organisation.",
    container: {
      title: "Organisation bearbeiten",
      description:
        "Bezeichnung, Netzwerkeinstellungen und Funktionsschalter anpassen.",
    },
    id: {
      label: "Organisations-ID",
      description:
        "Numerische oder namensbasierte ID der zu aktualisierenden Organisation.",
    },
    label: {
      label: "Bezeichnung",
      description: "Lesbarer Anzeigename in der Corvina-Oberfläche.",
      placeholder: "Meine Organisation",
    },
    hostname: {
      label: "Eigener Hostname",
      description:
        "Benutzerdefinierter Hostname für diese Organisation (leer lassen zum Entfernen).",
      placeholder: "https://org.beispiel.de",
    },
    ipAddressesWhitelist: {
      label: "IP-Whitelist",
      description:
        "Kommagetrennte Liste erlaubter IP-Adressen (leer lassen für unbeschränkten Zugriff).",
      placeholder: "127.0.0.1, 10.0.0.0/8",
    },
    privateAccess: {
      label: "Privater Zugriff",
      description: "Zugriff auf VPN-verbundene Nutzer beschränken.",
    },
    allowDisablePrivateAccess: {
      label: "Deaktivierung erlauben",
      description:
        "Nutzern erlauben, die Privatzugriff-Beschränkung vorübergehend aufzuheben.",
    },
    allowHostname: {
      label: "Eigenen Hostname erlauben",
      description: "Das Feld für den eigenen Hostname oben aktivieren.",
    },
    dataEnabled: {
      label: "Datendienst aktiv",
      description: "Datendienste für diese Organisation aktivieren.",
    },
    vpnEnabled: {
      label: "VPN aktiv",
      description: "VPN-Zugriff für diese Organisation aktivieren.",
    },
    storeEnabled: {
      label: "Shop aktiv",
      description: "Corvina-Shop für diese Organisation aktivieren.",
    },
    mfaRequired: {
      label: "MFA erforderlich",
      description:
        "Multi-Faktor-Authentifizierung für alle Benutzer erzwingen.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Bezeichnung",
      status: "Status",
      resourceId: "Ressourcen-ID",
      privateAccess: "Privater Zugriff",
      allowDisablePrivateAccess: "Deaktivierung erlauben",
      hostname: "Hostname",
      hostnameAllowed: "Hostname erlaubt",
      dataEnabled: "Datendienst aktiv",
      vpnEnabled: "VPN aktiv",
      vpnPairingMode: "VPN-Kopplungsmodus",
      vpnOtpRequired: "VPN OTP erforderlich",
      ipAddressesWhitelist: "IP-Whitelist",
      userCanAccess: "Benutzerzugriff",
      storeEnabled: "Shop aktiv",
      dataTemporarilyDisabled: "Daten temporär deaktiviert",
      mfaRequired: "MFA erforderlich",
    },
    submitButton: { label: "Änderungen speichern", loadingText: "Speichern…" },
    widget: { back: "Zurück" },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierung abgelehnt.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Der API-Schlüssel hat keinen Schreibzugriff auf diese Organisation.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt für diese Aktualisierung.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Gespeichert",
      description: "Organisation erfolgreich aktualisiert.",
    },
  },
};
