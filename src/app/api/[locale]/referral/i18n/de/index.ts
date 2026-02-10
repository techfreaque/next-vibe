import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main referral domain
  category: "Empfehlung",

  // Tags
  tags: {
    referral: "empfehlung",
    codes: "codes",
    earnings: "einnahmen",
    get: "abrufen",
    create: "erstellen",
    list: "liste",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Empfehlungscode abrufen",
    description: "Empfehlungscode-Details abrufen",
    form: {
      title: "Empfehlungscode-Details",
      description: "Empfehlungscode-Informationen anzeigen",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Empfehlungscode erstellen",
    description: "Neuen Empfehlungscode erstellen",
    form: {
      title: "Empfehlungscode erstellen",
      description: "Neuen Empfehlungscode generieren zum Teilen",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Empfehlungscode aktualisieren",
    description: "Empfehlungscode-Einstellungen aktualisieren",
    form: {
      title: "Empfehlungscode aktualisieren",
      description: "Empfehlungscode-Eigenschaften ändern",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Empfehlungscode deaktivieren",
    description: "Empfehlungscode deaktivieren",
    form: {
      title: "Empfehlungscode deaktivieren",
      description: "Diesen Empfehlungscode deaktivieren",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Empfehlung mit Lead verknüpfen",
      description: "Empfehlungscode vor der Anmeldung mit Lead verknüpfen",
      form: {
        title: "Empfehlungscode verknüpfen",
        description: "Empfehlungscode mit Ihrer Sitzung verknüpfen",
      },
    },
    success: {
      title: "Empfehlung verknüpft",
      description: "Empfehlungscode erfolgreich mit Ihrer Sitzung verknüpft",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "Empfehlungscodes auflisten",
        description: "Alle Ihre Empfehlungscodes mit Statistiken abrufen",
        form: {
          title: "Ihre Empfehlungscodes",
          description: "Ihre Empfehlungscodes anzeigen und verwalten",
        },
        response: {
          codes: {
            id: "ID",
            code: "Code",
            label: "Bezeichnung",
            currentUses: "Aktuelle Verwendungen",
            isActive: "Aktiv",
            createdAt: "Erstellt am",
            totalSignups: "Anmeldungen gesamt",
            totalRevenueCents: "Gesamtumsatz (Cents)",
            totalEarningsCents: "Gesamteinnahmen (Cents)",
          },
        },
      },
      success: {
        title: "Codes abgerufen",
        description: "Ihre Empfehlungscodes erfolgreich abgerufen",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Empfehlungsstatistiken",
      description: "Ihre Empfehlungsprogramm-Statistiken abrufen",
      form: {
        title: "Ihre Empfehlungsstatistiken",
        description: "Ihre Empfehlungsleistungsmetriken anzeigen",
      },
    },
    success: {
      title: "Statistiken abgerufen",
      description: "Ihre Empfehlungsstatistiken erfolgreich abgerufen",
    },
    fields: {
      totalSignups: "Anmeldungen gesamt",
      totalSignupsDesc:
        "Anzahl der Nutzer, die sich mit Ihrem Empfehlungscode angemeldet haben",
      totalRevenue: "Gesamtumsatz",
      totalRevenueDesc: "Gesamtumsatz aus Ihren Empfehlungen",
      totalEarned: "Gesamt verdient",
      totalEarnedDesc: "Gesamte Provision aus Empfehlungen",
      availableBalance: "Verfügbares Guthaben",
      availableBalanceDesc: "Verfügbares Guthaben für Auszahlung",
      totalRevenueCredits: "Gesamtumsatz (Credits)",
      totalEarnedCredits: "Gesamt verdient (Credits)",
      totalPaidOutCredits: "Gesamt ausgezahlt (Credits)",
      availableCredits: "Verfügbare Credits",
    },
  },

  // Earnings List endpoint
  earnings: {
    list: {
      get: {
        title: "Empfehlungseinnahmen auflisten",
        description: "Ihre Empfehlungseinnahmen-Historie abrufen",
        form: {
          title: "Ihre Empfehlungseinnahmen",
          description: "Ihre Einnahmen aus Empfehlungen anzeigen",
        },
        response: {
          earnings: {
            id: "ID",
            earnerUserId: "Verdiener Benutzer-ID",
            sourceUserId: "Quell-Benutzer-ID",
            transactionId: "Transaktions-ID",
            level: "Ebene",
            amountCents: "Betrag (Cents)",
            currency: "Währung",
            status: "Status",
            createdAt: "Erstellt am",
          },
        },
      },
      success: {
        title: "Einnahmen abgerufen",
        description: "Ihre Empfehlungseinnahmen erfolgreich abgerufen",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Empfehlungscode",
        description: "Eindeutiger Empfehlungscode",
        placeholder: "Code eingeben",
      },
      label: {
        label: "Bezeichnung",
        description: "Optionale Bezeichnung für diesen Code",
        placeholder: "Mein Empfehlungscode",
      },
      description: {
        label: "Beschreibung",
        description: "Optionale Beschreibung",
        placeholder: "Beschreibung eingeben",
      },
      maxUses: {
        label: "Maximale Verwendungen",
        description: "Maximale Anzahl der Verwendungen dieses Codes",
        placeholder: "Leer lassen für unbegrenzt",
      },
      expiresAt: {
        label: "Ablaufdatum",
        description: "Wann dieser Code abläuft",
        placeholder: "Datum auswählen",
      },
      isActive: {
        label: "Aktiv",
        description: "Ob dieser Code derzeit aktiv ist",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Code",
    label: "Bezeichnung",
    description: "Beschreibung",
    ownerUserId: "Besitzer Benutzer-ID",
    maxUses: "Maximale Verwendungen",
    currentUses: "Aktuelle Verwendungen",
    expiresAt: "Läuft ab am",
    isActive: "Aktiv",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    referralCode: "Empfehlungscode",
    success:
      "🎉 Ihr Empfehlungscode ist bereit! Kopieren Sie den Link unten und verdienen Sie 20% Provision auf jedes Abonnement.",
    message: "Nachricht",
  },

  // Payout errors
  payout: {
    errors: {
      minimumAmount: "Mindestauszahlungsbetrag ist $40",
      walletRequired: "Wallet-Adresse für Krypto-Auszahlungen erforderlich",
      insufficientBalance: "Unzureichendes Guthaben für Auszahlung",
      notFound: "Auszahlungsanfrage nicht gefunden",
      invalidStatus:
        "Ungültiger Status der Auszahlungsanfrage für diesen Vorgang",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Empfehlungscode-Parameter",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
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
      description: "Empfehlungscode nicht gefunden",
    },
    not_found: "Empfehlungscode nicht gefunden",
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    serverError: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Empfehlungscode existiert bereits",
    },
    code_exists: "Dieser Empfehlungscode existiert bereits",
    code_expired: "Dieser Empfehlungscode ist abgelaufen",
    code_inactive: "Dieser Empfehlungscode ist nicht aktiv",
    max_uses_reached:
      "Dieser Empfehlungscode hat seine maximale Verwendung erreicht",
    invalid_code: "Ungültiger Empfehlungscode",
  },

  // Success types
  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
    code_created: "Empfehlungscode erfolgreich erstellt",
    code_updated: "Empfehlungscode erfolgreich aktualisiert",
    code_deactivated: "Empfehlungscode erfolgreich deaktiviert",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Abonnement",
      creditPack: "Kreditpaket",
    },
    earningStatus: {
      pending: "Ausstehend",
      confirmed: "Bestätigt",
      canceled: "Storniert",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Credits",
    },
    payoutStatus: {
      pending: "Ausstehend",
      processing: "Wird verarbeitet",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      rejected: "Abgelehnt",
      approved: "Genehmigt",
    },
  },
};
