export const translations = {
  get: {
    tag: "lead-magnet-config",
    title: "Lead-Magnet-Konfiguration",
    description: "Deine aktuelle Lead-Magnet-Konfiguration abrufen",
    response: {
      exists: "Konfiguration vorhanden",
      config: "Konfiguration",
    },
    success: {
      title: "Konfiguration abgerufen",
      description:
        "Deine Lead-Magnet-Konfiguration wurde erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Anfragedaten sind ungültig",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Du hast keine Berechtigung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Konfiguration gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
  },
  widget: {
    loading: "Wird geladen…",
    pitch: {
      headline: "Aus Besuchern werden Abonnenten",
      body: "Wer deine Skill-Seite oder dein Creator-Profil besucht, sieht ein Anmeldefeld. Ein Klick - und die E-Mail-Adresse landet direkt in deiner Liste. Keine Extra-Apps, kein Mittelsmann, keine monatliche Gebühr für die Basis-Erfassung.",
      step1: "Jemand besucht deine Skill-Seite oder dein Creator-Profil",
      step2: "Er trägt sich ins Formular ein",
      step3: "Die E-Mail landet direkt in deiner Liste",
    },
    noConfig:
      "Verbinde eine E-Mail-Plattform, um Abonnenten über deine Skill-Seiten und dein Creator-Profil zu sammeln.",
    active: "Aktiv",
    inactive: "Inaktiv",
    choosePlatform: "E-Mail-Plattform verbinden",
    switchPlatform: "Plattform wechseln",
    selectPlaceholder: "Plattform wählen…",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "E-Mail (über Plattform)",
    },
    capturedLeads: "Erfasste Leads",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "E-Mail-Plattform trennen",
    description:
      "Lead-Magnet-Konfiguration entfernen und Lead-Erfassung stoppen",
    response: {
      deleted: "Getrennt",
    },
    success: {
      title: "Getrennt",
      description: "Deine E-Mail-Plattform wurde getrennt",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Anfragedaten sind ungültig",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Du hast keine Berechtigung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Konfiguration zum Löschen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      internal: {
        title: "Serverfehler",
        description: "Ein interner Fehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
    },
  },
};
