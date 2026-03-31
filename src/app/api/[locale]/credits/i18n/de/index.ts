import { translations as purchaseTranslations } from "../../purchase/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guthaben",
  tags: {
    credits: "credits",
    balance: "guthaben",
  },
  purchase: purchaseTranslations,
  repository: {
    tts: "Text-zu-Sprache",
    stt: "Sprache-zu-Text",
    search: "Suche",
    sttHotkey: "Sprache-zu-Text (Tastenkombination)",
  },
  enums: {
    creditType: {
      userSubscription: "Benutzer-Abonnement-Credits",
      leadFree: "Lead-Gratis-Credits",
    },
    transactionType: {
      purchase: "Kauf",
      subscription: "Abonnement",
      usage: "Verbrauch",
      expiry: "Ablauf",
      freeTier: "Kostenlos",
      monthlyReset: "Monatliche Zurücksetzung",
      freeGrant: "Kostenlose Gewährung",
      freeReset: "Kostenlose Zurücksetzung",
      refund: "Rückerstattung",
      transfer: "Übertragung",
      otherDevices: "Verbrauch von verknüpften Geräten/Sitzungen",
      referralEarning: "Empfehlungsverdienst",
      referralPayout: "Empfehlungsauszahlung",
    },
    packType: {
      subscription: "Abonnement",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Verdient",
    },
  },
  expire: {
    post: {
      title: "Credits ablaufen lassen",
      description:
        "Alte Abonnement-Credits ablaufen lassen (von Cron aufgerufen)",
      tag: "ablaufen",
      container: {
        title: "Credits ablaufen lassen",
        description: "Ergebnisse des Credits-Ablaufs",
      },
      response: {
        expiredCount: "Abgelaufene Anzahl",
      },
      success: {
        title: "Credits abgelaufen",
        description: "Alte Abonnement-Credits erfolgreich abgelaufen",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verweigert",
        },
        server: {
          title: "Serverfehler",
          description: "Fehler beim Ablaufen von Credits",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
    },
    task: {
      description: "Läuft alte Abonnement-Credits täglich ab",
      error: "Fehler beim Ablaufen von Credits",
    },
  },
  cleanup: {
    task: {
      description: "Bereinigt verwaiste Lead-Wallets wöchentlich",
      error: "Fehler beim Bereinigen verwaister Wallets",
    },
  },
  errors: {
    getBalanceFailed: "Fehler beim Abrufen des Credit-Guthabens",
    getLeadBalanceFailed: "Fehler beim Abrufen des Lead-Credit-Guthabens",
    getOrCreateLeadFailed: "Fehler beim Abrufen oder Erstellen des Leads",
    addCreditsFailed: "Fehler beim Hinzufügen von Credits",
    deductCreditsFailed: "Fehler beim Abziehen von Credits",
    insufficientCredits:
      "Unzureichende Credits. Sie benötigen {{cost}} Credits, um diese Funktion zu nutzen.",
    deductionFailed:
      "Fehler beim Abziehen von {{cost}} Credits. Bitte versuchen Sie es erneut.",
    getTransactionsFailed: "Fehler beim Abrufen der Credit-Transaktionen",
    invalidIdentifier: "Ungültige Benutzer- oder Lead-Kennung",
    userNotFound: "Benutzer nicht gefunden",
    noLeadFound: "Kein Lead für Benutzer gefunden",
    getCreditIdentifierFailed: "Fehler beim Abrufen der Credit-Kennung",
    noCreditSource: "Keine Credit-Quelle verfügbar",
    stripeCustomerFailed: "Fehler beim Erstellen des Stripe-Kunden",
    checkoutFailed: "Fehler beim Erstellen der Checkout-Sitzung",
    mergeFailed: "Fehler beim Zusammenführen der Lead-Credits",
    mergeLeadWalletsFailed:
      "Fehler beim Zusammenführen der Lead-Wallets mit dem Benutzerkonto",
    cleanupOrphanedFailed: "Fehler beim Bereinigen verwaister Lead-Wallets",
    monthlyResetFailed: "Fehler beim monatlichen Zurücksetzen der Credits",
    noLeadsToMerge: "Keine Leads zum Zusammenführen vorhanden",
    oldestLeadNotFound: "Ältester Lead im Cluster nicht gefunden",
    transactionFailed: "Fehler beim Erstellen des Transaktionsdatensatzes",
    not_implemented_on_native:
      "{{method}} ist auf der nativen Plattform nicht implementiert. Bitte verwenden Sie die Web-Version für diesen Vorgang.",
    expireCreditsFailed: "Fehler beim Ablaufen von Credits",
    invalidAmount: "Credit-Betrag muss eine positive Zahl sein",
    walletNotFound: "Wallet nicht gefunden",
    walletCreationFailed: "Fehler beim Erstellen des Wallets",
    addEarnedCreditsFailed: "Fehler beim Hinzufügen verdienter Credits",
    getEarnedBalanceFailed:
      "Fehler beim Abrufen des verdienten Credit-Guthabens",
    insufficientEarnedCredits:
      "Unzureichende verdiente Credits für diesen Vorgang",
    deductEarnedCreditsFailed: "Fehler beim Abziehen verdienter Credits",
    getReferralTransactionsFailed:
      "Fehler beim Abrufen der Empfehlungstransaktionen",
  },
  get: {
    title: "Credit-Guthaben abrufen",
    description: "Aktuelles Credit-Guthaben mit Aufschlüsselung abrufen",
    response: {
      title: "Credit-Guthaben",
      description: "Ihr aktuelles Credit-Guthaben und Aufschlüsselung",
    },
    balance: {
      title: "Ihr Credit-Guthaben",
      adminTitle: "Ausgabenlimit",
      description: "Nutzen Sie Ihre Credits bei {{modelCount}} KI-Modellen",
      adminDescription:
        "Credits wirken als Ausgabenlimit - kontrollieren Sie die erlaubte KI-Nutzung aller Benutzer.",
      credit: "{{count}} Credit",
      credits: "{{count}} Credits",
      expiring: {
        title: "Ablaufende Credits",
        description: "{{subCredits}} neue Credits pro Abonnementzyklus",
        adminDescription: "Zeitlich begrenzte Credits (Abonnementzyklus)",
      },
      permanent: {
        title: "Permanente Credits",
        description: "Laufen nie ab – gehören Ihnen",
        adminDescription: "Permanente Credits - laufen nie ab",
      },
      free: {
        title: "Kostenlose Credits",
        description: "{{count}} kostenlose Credits monatlich aufgefrischt",
        adminDescription:
          "{{count}} kostenlose Credits pro Pool/Monat (geteilt über Geräte)",
      },
      earned: {
        title: "Verdiente Credits",
        description:
          "Durch Empfehlungen verdient – klicken Sie, um Freunde einzuladen",
      },
      spending: {
        title: "Eigene verdiente Credits",
        adminDescription:
          "Ihre persönlichen Empfehlungsverdienste (nicht instanzweit)",
      },
    },
    total: {
      content: "Gesamt-Credits",
    },
    expiring: {
      content: "Ablaufende Credits (Abonnement)",
    },
    permanent: {
      content: "Permanente Credits (Pakete)",
    },
    free: {
      content: "Kostenlose Credits",
    },
    earned: {
      content: "Verdiente Credits (Empfehlungen)",
    },
    expiresAt: {
      content: "Läuft ab am",
    },
    success: {
      title: "Guthaben abgerufen",
      description: "Credit-Guthaben erfolgreich abgerufen",
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
        description:
          "Sie müssen angemeldet sein, um Ihr Credit-Guthaben anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung für diese Ressource",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen des Credit-Guthabens",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      noActiveSubscription: {
        title: "Aktives Abonnement erforderlich",
        description:
          "Sie müssen ein aktives Abonnement haben, um Credit-Packs zu kaufen",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
      no_active_subscription: {
        title: "Aktives Abonnement erforderlich",
        description:
          "Sie müssen ein aktives Abonnement haben, um Credit-Packs zu kaufen",
      },
    },
  },
  history: {
    get: {
      title: "Credit-Verlauf abrufen",
      description: "Paginierten Credit-Transaktionsverlauf abrufen",
      container: {
        title: "Credit-Verlauf",
        description: "Ihren Credit-Transaktionsverlauf anzeigen",
      },
      emptyState: "Noch keine Credit-Transaktionen",
      balance: "Guthaben danach: {{count}}",
      limit: {
        label: "Limit",
        description: "Maximale Anzahl zurückzugebender Transaktionen (1-100)",
      },
      offset: {
        label: "Offset",
        description:
          "Anzahl der zu überspringenden Transaktionen für Paginierung",
      },
      targetUserId: {
        label: "Ziel-Benutzer-ID",
      },
      targetLeadId: {
        label: "Ziel-Lead-ID",
      },
      id: "Transaktions-ID",
      amount: "Betrag",
      type: "Typ",
      modelId: "Modell",
      messageId: "Nachrichten-ID",
      createdAt: "Datum",
      transactions: {
        title: "Transaktionen",
        description: "Liste der Credit-Transaktionen",
      },
      paginationInfo: {
        total: "Gesamt-Transaktionen",
        totalPages: "Gesamt-Seiten",
      },
      totalCount: {
        content: "Gesamtanzahl",
      },
      transaction: {
        id: {
          content: "Transaktions-ID",
        },
        amount: {
          content: "Betrag",
        },
        balanceAfter: {
          content: "Guthaben danach",
        },
        type: {
          content: "Typ",
        },
        modelId: {
          content: "Modell",
        },
        messageId: {
          content: "Nachrichten-ID",
        },
        createdAt: {
          content: "Datum",
        },
      },
      success: {
        title: "Verlauf abgerufen",
        description: "Credit-Verlauf erfolgreich abgerufen",
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
          description:
            "Sie müssen angemeldet sein, um Ihren Credit-Verlauf anzuzeigen",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung für diese Ressource",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Fehler beim Abrufen des Credit-Verlaufs",
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
  },
  adminAdd: {
    post: {
      title: "Guthaben hinzufügen",
      description:
        "Guthabenpakete zu einem Benutzerkonto hinzufügen (nur Admin)",
      tag: "admin",
      container: {
        title: "Guthaben zum Benutzer hinzufügen",
        description:
          "Bonusguthaben einem bestimmten Benutzerkonto gutschreiben",
        selfTitle: "Guthaben zum eigenen Konto hinzufügen",
        selfDescription: "Sich selbst Bonusguthaben gutschreiben",
      },
      targetUserId: {
        label: "Zielbenutzer-ID",
        description: "Der Benutzer, dem Guthaben hinzugefügt werden soll",
      },
      amount: {
        label: "Betrag",
        description: "Anzahl der hinzuzufügenden Guthabenpunkte",
        placeholder: "Guthabenbetrag eingeben...",
      },
      packType: {
        label: "Pakettyp",
        description: "Art des Guthabenpakets",
      },
      response: {
        message: {
          content: "Ergebnis",
        },
      },
      backButton: {
        label: "Zurück",
      },
      submitButton: {
        label: "Guthaben hinzufügen",
        loadingText: "Wird hinzugefügt...",
      },
      success: {
        title: "Guthaben hinzugefügt",
        description: "Guthaben wurde dem Benutzerkonto hinzugefügt",
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
          description: "Admin-Zugang erforderlich",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Benutzer nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Fehler beim Hinzufügen von Guthaben",
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
  },
  email: {
    creditPack: {
      user: {
        subject: "Ihr Guthaben-Paket ist bereit - {{appName}}",
        title: "Credits wurden Ihrem Konto hinzugefügt",
        previewText: "{{credits}} Credits wurden Ihrem Konto hinzugefügt",
        greeting: "Hallo {{privateName}},",
        body: "Ihr Kauf eines Guthaben-Pakets war erfolgreich. {{credits}} permanente Credits wurden Ihrem Konto hinzugefügt und sind einsatzbereit.",
        cta: "Credits jetzt nutzen",
        signoff: "Vielen Dank für Ihren Kauf!\n\nDas {{appName}}-Team",
      },
      admin: {
        subject: "[{{appName}}] Guthaben-Paket gekauft - {{credits}} Credits",
        title: "Guthaben-Paket-Kauf",
        preview: "Ein Benutzer hat ein Guthaben-Paket gekauft",
        body: "Ein Benutzer hat ein Guthaben-Paket gekauft.",
        labelUser: "Benutzer",
        labelCredits: "Credits",
        footer: "Automatische Benachrichtigung von {{appName}}",
      },
    },
  },
};
