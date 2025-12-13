import type { translations as enTranslations } from "../en";
import { translations as purchaseTranslations } from "../../purchase/i18n/de";

export const translations: typeof enTranslations = {
  purchase: purchaseTranslations,
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
      otherDevices: "Verbrauch von anderen Geräten",
    },
  },
  expire: {
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
  },
  get: {
    title: "Credit-Guthaben abrufen",
    description: "Aktuelles Credit-Guthaben mit Aufschlüsselung abrufen",
    response: {
      title: "Credit-Guthaben",
      description: "Ihr aktuelles Credit-Guthaben und Aufschlüsselung",
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
      limit: {
        label: "Limit",
        description: "Maximale Anzahl zurückzugebender Transaktionen (1-100)",
      },
      offset: {
        label: "Offset",
        description:
          "Anzahl der zu überspringenden Transaktionen für Paginierung",
      },
      transactions: {
        title: "Transaktionen",
        description: "Liste der Credit-Transaktionen",
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
};
