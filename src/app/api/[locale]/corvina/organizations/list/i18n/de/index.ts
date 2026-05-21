export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  get: {
    title: "Corvina-Organisationen auflisten",
    description:
      "Liefert alle Kunden­organisationen des konfigurierten Corvina-Mandanten.",
    container: {
      title: "Corvina-Organisationen",
      description:
        "Alle Kunden­organisationen auf dem konfigurierten Corvina-Mandanten.",
    },
    response: {
      title: "Organisationen",
      description: "Vom Corvina-API zurückgegebene Kunden­organisationen.",
      organizations: {
        title: "Organisationen",
        description: "Jede Zeile entspricht einer Kunden­organisation.",
        id: "ID",
        name: "Name",
        label: "Bezeichnung",
        status: "Status",
        resourceId: "Ressourcen-ID",
        dataEnabled: "Daten",
        vpnEnabled: "VPN",
        privateAccess: "Privater Zugriff",
        allowDisablePrivateAccess: "Privat deaktivierbar",
        hostname: "Hostname",
        hostnameAllowed: "Hostname erlaubt",
        vpnPairingMode: "VPN-Modus",
        vpnOtpRequired: "VPN OTP",
        ipAddressesWhitelist: "IP-Whitelist",
        userCanAccess: "Benutzerzugriff",
        storeEnabled: "Store",
        dataTemporarilyDisabled: "Daten pausiert",
        mfaRequired: "MFA",
      },
      total: "Gesamt",
    },
    widget: {
      title: "Corvina-Organisationen",
      noOrgsFound: "Keine Organisationen gefunden",
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
        description:
          "Corvina hat den API-Schlüssel abgelehnt. CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Dem API-Schlüssel fehlt der nötige Scope zum Auflisten von Organisationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Corvina liefert 404 für den Organisationspfad.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Corvina meldet einen Konflikt beim Auflisten der Organisationen.",
      },
      server: {
        title: "Serverfehler",
        description:
          "Das Corvina-API hat einen internen Serverfehler gemeldet.",
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
      title: "Erfolg",
      description: "Organisationen erfolgreich geladen.",
    },
  },
};
