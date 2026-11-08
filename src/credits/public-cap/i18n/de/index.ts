import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    perDayUnit: "Credits/Tag",
    title: "Öffentliches Gratis-Tageslimit abrufen",
    titleShort: "Gratis-Limit",
    description: "Heutige globale Gratis-Guthaben-Ausgaben und Limit anzeigen",
    container: {
      title: "Öffentliches Gratis-Tageslimit",
      description: "Globales Tageslimit für nicht zahlende Nutzer",
    },
    spendToday: {
      content: "Heute ausgegeben",
    },
    capAmount: {
      content: "Tageslimit",
    },
    remainingToday: {
      content: "Heute verbleibend",
    },
    percentUsed: {
      content: "genutzt",
    },
    lastResetAt: {
      content: "Letzter Reset",
    },
    capExceeded: {
      content: "Limit überschritten",
    },
    perLeadCap: { content: "Limit pro Lead" },
    perIpCap: { content: "Limit pro IP" },
    topSpenders: { content: "Größte Gratis-Nutzer heute" },
    recentEvents: { content: "Letzte Limit-Ereignisse" },
    noData: "Heute noch nichts.",
    success: {
      title: "Limit-Status abgerufen",
      description: "Status des Gratis-Tageslimits erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Limit-Konfiguration nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Limit-Status konnte nicht abgerufen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
    },
  },
  post: {
    title: "Öffentliches Gratis-Tageslimit aktualisieren",
    titleShort: "Limit ändern",
    description: "Globales Tageslimit für nicht zahlende Nutzer aktualisieren",
    capAmount: {
      label: "Tageslimit (Credits)",
      description:
        "Maximale Credits, die nicht zahlende Nutzer täglich gemeinsam ausgeben können",
      placeholder: "z.B. 500",
    },
    perLeadCap: {
      label: "Tageslimit pro Lead (Credits)",
      description:
        "Maximale Gratis-Credits, die ein Gast pro Tag verbrauchen darf",
      placeholder: "z.B. 20",
    },
    perIpCap: {
      label: "Tageslimit pro IP (Credits)",
      description:
        "Maximale Gratis-Credits, die eine IP pro Tag verbrauchen darf",
      placeholder: "z.B. 40",
    },
    message: {
      content: "Ergebnis",
    },
    success: {
      title: "Limit aktualisiert",
      description: "Tageslimit erfolgreich aktualisiert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Das Limit muss eine positive Zahl sein",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Admin-Zugriff erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Limit-Konfiguration nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Limit konnte nicht aktualisiert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
    },
  },
  repository: {
    capUpdated: "Tageslimit auf {{capAmount}} Credits gesetzt",
    capExceeded:
      "Tägliches Gratis-Limit erreicht. Bitte registrieren Sie sich oder versuchen Sie es morgen erneut.",
    leadCapExceeded:
      "Dein Gratis-Limit für heute ist erreicht. Registriere dich oder gib deine E-Mail an – dann gibt es mehr Credits.",
    capUnavailable:
      "Das Gratis-Kontingent ist gerade nicht verfügbar. Registriere dich, um weiterzumachen.",
    getCapFailed: "Gratis-Limit-Konfiguration konnte nicht abgerufen werden",
    updateCapFailed: "Gratis-Limit konnte nicht aktualisiert werden",
    incrementFailed: "Gratis-Ausgaben konnten nicht erfasst werden",
  },
};
