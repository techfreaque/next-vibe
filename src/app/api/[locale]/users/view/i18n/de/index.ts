import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  tags: {
    user: "Benutzer",
    view: "Anzeigen",
  },

  badge: "Benutzerdetails",
  get: {
    title: "Benutzer anzeigen",
    description: "Detaillierte Informationen über einen Benutzer anzeigen",
    userId: {
      label: "Benutzer-ID",
    },
  },
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description:
        "Bitte überprüfen Sie die Benutzer-ID und versuchen Sie es erneut",
    },
    network: {
      title: "Verbindungsfehler",
      description:
        "Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Bitte melden Sie sich an, um Benutzerdetails anzuzeigen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung, diesen Benutzer anzuzeigen",
    },
    notFound: {
      title: "Benutzer nicht gefunden",
      description: "Wir konnten diesen Benutzer nicht finden",
    },
    serverError: {
      title: "Ein Fehler ist aufgetreten",
      description:
        "Die Benutzerdetails konnten nicht geladen werden. Bitte versuchen Sie es erneut",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description:
        "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben Änderungen, die noch nicht gespeichert wurden",
    },
    conflict: {
      title: "Datenkonflikt",
      description:
        "Die Benutzerdaten haben sich geändert. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut",
    },
  },
  success: {
    title: "Benutzer geladen",
    description: "Benutzerdetails erfolgreich geladen",
  },
  empty: "Keine Benutzerdaten gefunden",
  sections: {
    basicInfo: "Grundlegende Informationen",
    chatActivity: "Chat-Aktivität",
    credits: "Guthaben",
    payments: "Zahlungen",
    newsletter: "Newsletter",
    referrals: "Empfehlungen",
    recentActivity: "Letzte Aktivität",
  },
  status: {
    active: "Aktiv",
    banned: "Gesperrt",
    inactive: "Inaktiv",
    verified: "Verifiziert",
  },
  fields: {
    userId: "Benutzer-ID",
    locale: "Sprache",
    twoFactor: "Zwei-Faktor-Auth",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    marketing: "Marketing",
    optedIn: "Eingewilligt",
    optedOut: "Abgemeldet",
    created: "Erstellt",
    lastUpdated: "Zuletzt aktualisiert",
    banReason: "Sperrgrund",
    roles: "Rollen",
  },
  credits: {
    currentBalance: "Aktuelles Guthaben",
    availableCredits: "Verfügbares Guthaben",
    packBreakdown: "Guthabenpakete Aufschlüsselung",
    subscription: "Abonnement",
    permanent: "Dauerhaft",
    bonus: "Bonus",
    earned: "Verdient",
    expires: "Läuft ab",
  },
  payment: {
    stripeCustomerId: "Stripe-Kunden-ID",
    activeSubscription: "Aktives Abonnement",
  },
  common: {
    yes: "Ja",
    no: "Nein",
  },
  newsletter: {
    status: "Status",
    subscribed: "Abonniert",
    notSubscribed: "Nicht abonniert",
    subscribedAt: "Abonniert am",
    confirmedAt: "Bestätigt am",
    lastEmailSent: "Letzte E-Mail gesendet",
  },
  referrals: {
    totalReferrals: "Empfehlungen gesamt",
    activeCodes: "Aktive Codes",
    revenue: "Umsatz",
    earnings: "Verdienst",
  },
  activity: {
    lastLogin: "Letzter Login",
    lastThread: "Letzter Thread",
    lastMessage: "Letzte Nachricht",
    lastPayment: "Letzte Zahlung",
  },
  tabs: {
    overview: "Übersicht",
    credits: "Guthaben",
    referrals: "Empfehlungen",
    earnings: "Verdienste",
  },
  modelUsage: {
    title: "Modellnutzung",
    model: "Modell",
    spent: "Verbrauchtes Guthaben",
    messages: "Nachrichten",
    noUsage: "Keine Modellnutzungsdaten",
  },
  ban: {
    banUser: "Benutzer sperren",
    unbanUser: "Sperre aufheben",
  },
  widget: {
    actions: {
      edit: "Bearbeiten",
      delete: "Löschen",
      viewCreditHistory: "Guthabenhistorie anzeigen",
      viewSubscription: "Abonnement anzeigen",
      viewReferralCodes: "Empfehlungscodes anzeigen",
      viewReferralEarnings: "Empfehlungsverdienste anzeigen",
      addCredits: "Guthaben hinzufügen",
      viewLead: "Lead anzeigen",
      copyUserId: "Benutzer-ID kopieren",
      copied: "Kopiert!",
    },
    sections: {
      quickActions: "Schnellaktionen",
    },
    stats: {
      totalThreads: "Threads gesamt",
      totalMessages: "Nachrichten gesamt",
      userMessages: "Benutzernachrichten",
      lastActivity: "Letzte Aktivität",
      never: "Nie",
      freeCredits: "Kostenloses Guthaben",
      freePeriod: "Zeitraum",
      totalSpent: "Gesamt ausgegeben",
      totalPurchased: "Gesamt gekauft",
      totalRevenue: "Gesamtumsatz",
      payments: "Zahlungen",
      successful: "Erfolgreich",
      failed: "Fehlgeschlagen",
      totalRefunds: "Erstattungen gesamt",
      lastPayment: "Letzte Zahlung",
    },
  },
};
