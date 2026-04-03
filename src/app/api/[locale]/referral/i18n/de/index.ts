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
      limit: {
        label: "Limit",
        description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
      },
      offset: {
        label: "Offset",
        description: "Anzahl der zu überspringenden Ergebnisse",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "Verdiener-Benutzer-ID",
        sourceUserId: "Quell-Benutzer-ID",
        transactionId: "Transaktions-ID",
        level: "Ebene",
        amountCents: "Betrag (Cent)",
        currency: "Währung",
        status: "Status",
        createdAt: "Erstellt am",
      },
      totalCount: "Gesamtanzahl",
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
    submit: {
      label: "Code erstellen",
      loading: "Wird erstellt...",
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
            currentVisitors: "Aktuelle Besucher",
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
      widget: {
        empty: "Sie haben noch keine Empfehlungscodes",
        emptyHint: "Erstellen Sie Ihren ersten Code oben ↑",
        copied: "Kopiert!",
        copy: "Link kopieren",
        visitors: "Besucher",
        signups: "Anmeldungen",
        revenue: "Umsatz",
        earnings: "Einnahmen",
        inactive: "Dieser Empfehlungscode ist inaktiv",
        conversionHint:
          "Jeder {{examplePrice}}/Monat-Abonnent bringt Ihnen {{exampleEarning}}/Monat - wiederkehrend",
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
    widget: {
      emptyMessage:
        "Noch keine Aktivität - teilen Sie Ihren Empfehlungslink, um zu verdienen",
    },
    fields: {
      totalSignups: "Anmeldungen gesamt",
      totalSignupsDescription:
        "Anzahl der Nutzer, die sich mit Ihrem Empfehlungscode angemeldet haben",
      totalRevenue: "Gesamtumsatz",
      totalRevenueDescription: "Gesamtumsatz aus Ihren Empfehlungen",
      totalEarned: "Gesamt verdient",
      totalEarnedDescription: "Gesamte Provision aus Empfehlungen",
      availableBalance: "Verfügbares Guthaben",
      availableBalanceDescription: "Verfügbares Guthaben für Auszahlung",
      availableBalanceDescriptionLow:
        "Für KI-Chats ausgeben - andere Credits werden zuerst verwendet. {{minPayout}} verdienen, um Abhebung freizuschalten.",
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
      "🎉 Ihr Empfehlungscode ist bereit! Kopieren Sie den Link unten und verdienen Sie {{directPct}} Provision auf jedes Abonnement - plus Bonuseinnahmen aus deren Empfehlungen.",
    message: "Nachricht",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Auszahlungsanfragen",
        description: "Empfehlungs-Auszahlungsanfragen verwalten",
      },
      post: {
        title: "Auszahlung verarbeiten",
        description: "Auszahlungsanfrage genehmigen, ablehnen oder abschließen",
      },
      fields: {
        status: {
          label: "Statusfilter",
          description: "Nach Auszahlungsstatus filtern",
        },
        requestId: {
          label: "Anfrage-ID",
          description: "Kennung der Auszahlungsanfrage",
        },
        action: {
          label: "Aktion",
          description: "Aktion für die Auszahlungsanfrage",
        },
        adminNotes: {
          label: "Admin-Notizen",
          description: "Optionale Notizen für diese Aktion",
        },
        rejectionReason: {
          label: "Ablehnungsgrund",
          description: "Grund für die Ablehnung der Auszahlungsanfrage",
        },
      },
      widget: {
        empty: "Keine Auszahlungsanfragen gefunden",
        approve: "Genehmigen",
        reject: "Ablehnen",
        complete: "Abschließen",
        credits: "Credits",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Ihre Einnahmen",
      description: "Ihre Empfehlungseinnahmen und Auszahlungshistorie anzeigen",
    },
    post: {
      title: "Auszahlung beantragen",
      description: "Ihre Empfehlungseinnahmen auszahlen",
    },
    fields: {
      amountCents: {
        label: "Betrag (Credits)",
        description: "Auszuzahlender Betrag in Credits",
        placeholder: "z.B. 5000",
      },
      currency: {
        label: "Auszahlungsmethode",
        description: "Wie Sie Ihre Einnahmen erhalten möchten",
      },
      walletAddress: {
        label: "Wallet-Adresse",
        description: "Erforderlich für BTC- oder USDC-Auszahlungen",
        placeholder: "Ihre Wallet-Adresse",
      },
    },
    widget: {
      totalEarned: "Gesamt verdient",
      available: "Verfügbar",
      locked: "Gesperrt",
      credits: "Credits",
      readyForPayout: "bereit für Auszahlung",
      moreToUnlock: "mehr benötigt",
      pendingConfirmation: "ausstehende Bestätigung",
      requestPayout: "Auszahlung beantragen",
      payoutHistory: "Auszahlungshistorie",
      noPayout: "Noch keine Auszahlungsanfragen",
      howItWorksTitle: "So funktioniert es",
      step1Title: "Empfehlungscodes erstellen",
      step1Body:
        "Einzigartige Codes für verschiedene Zielgruppen generieren - Freunde, soziale Medien oder Kampagnen.",
      step2Title: "Link teilen",
      step2Body:
        "Wenn jemand über Ihren Link anmeldet und abonniert, verdienen Sie Provision.",
      step3Title: "Bezahlt werden",
      step3Body:
        "Einnahmen sind sofort verfügbar. Als Chat-Credits nutzen oder in Krypto auszahlen.",
      withdrawTitle: "Einnahmen auszahlen",
      withdrawDescription:
        "Mehrere Möglichkeiten, Ihre Empfehlungseinnahmen zu nutzen",
      useAsCredits: "Als Chat-Credits verwenden",
      useAsCreditsDesc:
        "Einnahmen sofort in Chat-Credits für KI-Gespräche umwandeln.",
      cryptoPayout: "In Krypto auszahlen",
      cryptoPayoutDesc:
        "Auszahlung in BTC oder USDC an Ihre Wallet-Adresse beantragen.",
      minimumNote:
        "Mindestbetrag: {{minPayout}}. Krypto-Auszahlungen werden innerhalb von {{cryptoPayoutHours}} Stunden nach Genehmigung bearbeitet.",
      progressLabel: "Fortschritt bis zur Auszahlung",
      unlockedOf: "freigeschaltet von",
      viewHistory: "Verlauf anzeigen",
      historyEmpty: "Ihre Auszahlungen erscheinen hier",
    },
    email: {
      user: {
        subjectCrypto: "Auszahlungsanfrage eingegangen",
        subjectCredits: "Credits umgewandelt",
        titleCrypto: "Ihre Auszahlungsanfrage",
        titleCredits: "Credits umgewandelt",
        previewCrypto: "Ihre Auszahlungsanfrage wird bearbeitet",
        previewCredits: "Ihre Credits wurden umgewandelt",
        bodyCrypto:
          "Wir haben Ihre Auszahlungsanfrage erhalten. Krypto-Auszahlungen werden innerhalb von {{cryptoPayoutHours}} Stunden nach Admin-Genehmigung bearbeitet.",
        bodyCredits:
          "Ihre Empfehlungseinnahmen wurden sofort in Chat-Credits umgewandelt und Ihrem Konto gutgeschrieben.",
        followUpCrypto:
          "Sie erhalten eine weitere E-Mail, sobald Ihre Auszahlung bearbeitet wurde.",
        labelAmount: "Betrag",
        labelMethod: "Methode",
        labelWallet: "Wallet",
        credits: "Credits",
      },
      admin: {
        subject: "Neue Auszahlungsanfrage",
        title: "Neue Auszahlungsanfrage",
        preview: "Auszahlungsanfrage eingereicht",
        body: "Ein Benutzer hat eine Auszahlungsanfrage eingereicht.",
        footer:
          "Bitte überprüfen und bearbeiten Sie diese Anfrage im Admin-Panel.",
        labelUser: "Benutzer",
        labelAmount: "Betrag",
        labelCurrency: "Währung",
        labelWallet: "Wallet",
        credits: "Credits",
      },
    },
    errors: {
      minimumAmount: "Mindestauszahlungsbetrag ist {{minPayout}}",
      walletRequired: "Wallet-Adresse für Krypto-Auszahlungen erforderlich",
      insufficientBalance: "Unzureichendes Guthaben für Auszahlung",
      notFound: "Auszahlungsanfrage nicht gefunden",
      invalidStatus:
        "Ungültiger Status der Auszahlungsanfrage für diesen Vorgang",
    },
    success: {
      creditsConverted: "Credits erfolgreich umgewandelt",
      payoutRequested:
        "Auszahlungsanfrage eingereicht - Bearbeitung innerhalb von {{hours}} Stunden",
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
