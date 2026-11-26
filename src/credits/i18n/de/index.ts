import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guthaben",
  tags: {
    credits: "credits",
    balance: "guthaben",
  },
  purchase: {
    post: {
      title: "Credits kaufen",
      description: "Stripe-Checkout-Sitzung für Credit-Paket-Kauf erstellen",
      container: {
        title: "Credits kaufen",
        description: "Kaufe Credit-Pakete für AI-Funktionen",
      },
      quantity: {
        label: "Anzahl",
        description: "Anzahl der zu kaufenden Credit-Pakete (1-10)",
        placeholder: "Anzahl eingeben (1-10)",
      },
      provider: {
        label: "Zahlungsmethode wählen",
        description: "Wähl aus, wie du dein Credit-Paket bezahlen willst",
        placeholder: "Zahlungsanbieter auswählen",
      },
      checkoutUrl: {
        content: "Checkout-URL",
      },
      sessionId: {
        content: "Sitzungs-ID",
      },
      totalAmount: {
        content: "Gesamtbetrag (Cent)",
      },
      totalCredits: {
        content: "Gesamt-Credits",
      },
      success: {
        title: "Checkout erstellt",
        description: "Stripe-Checkout-Sitzung erfolgreich erstellt",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Kaufmenge",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkverbindung fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Melde dich an, um Credits zu kaufen",
        },
        forbidden: {
          title: "Verboten",
          description: "Du hast keine Berechtigung, Credits zu kaufen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Checkout-Sitzung konnte nicht erstellt werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Es gibt nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ressourcenkonflikt aufgetreten",
        },
        noActiveSubscription: {
          title: "Aktives Abonnement erforderlich",
          description: "Credit-Pakete gibt es nur mit aktivem Abo",
        },
      },
    },
  },
  repository: {
    bonusCreditsAdded: "{{amount}} Bonus-Credits gutgeschrieben",
    tts: "Text-zu-Sprache",
    stt: "Sprache-zu-Text",
    search: "Suche",
    sttHotkey: "Sprache-zu-Text (Tastenkombination)",
  },
  enums: {
    freeStatus: {
      active: "Gratis-Credits aktiv",
      verifyEmail: "E-Mail bestätigen, um die Konto-Credits freizuschalten",
      subnetLimit: "Gratis-Credits für dieses Netzwerk pausiert",
    },
    creditType: {
      userSubscription: "Benutzer-Abonnement-Credits",
      leadFree: "Lead-Gratis-Credits",
    },
    creditFeature: {
      textToSpeech: "Text-zu-Sprache",
      speechToText: "Sprache-zu-Text",
      memoryWrite: "Gedächtnis schreiben",
      memoryEdit: "Gedächtnis bearbeiten",
      memorySearch: "Gedächtnis durchsuchen",
      memoryEmbedding: "Gedächtnis-Einbettung",
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
      otherDevices: "Auf einem anderen Gerät verbraucht",
      referralEarning: "Empfehlungsverdienst",
      referralPayout: "Empfehlungsauszahlung",
    },
    fundingType: {
      freeAllowance: "Monatliches Gratiskontingent",
      freeBonus: "Bonus für Konto / Newsletter",
      referral: "Empfehlungs-Credits",
      purchased: "Gekauftes Paket",
      subscription: "Abo-Credits",
      adminGrant: "Admin-Gutschrift",
      freeUnknown: "Gratis, Stufe nicht erfasst",
      packUnknown: "Paket, Herkunft nicht erfasst",
    },
    packType: {
      subscription: "Abonnement",
      permanent: "Dauerhaft",
      bonus: "Bonus",
      earned: "Verdient",
    },
  },
  historyLabels: {
    signupCarryover: "Vor der Anmeldung als Gast verbraucht",
    sharedLimit: "Verknüpfte Geräte teilen ein Monatslimit",
    monthly: "Monatliche Gratis-Credits",
    monthlyGuest: "Monatliche Gratis-Credits (ohne Konto)",
    monthlyAccount: "Monatliche Gratis-Credits (Gratis-Konto)",
    monthlyAccountNewsletter:
      "Monatliche Gratis-Credits (Konto plus Newsletter)",
    freeGuest: "Gratis-Credits (ohne Konto)",
    accountUpgrade: "Bonus für Gratis-Konto",
    newsletterBonus: "Newsletter-Bonus",
    otherDevices: "Auf einem anderen Gerät verbraucht",
    linkedAccount: "Vom verknüpften Konto verbraucht",
  },
  expire: {
    post: {
      title: "Credits ablaufen lassen",
      titleShort: "Credits ablaufen",
      description:
        "Entfernt Abo-Credits nach ihrem Ablaufdatum. Läuft täglich automatisch; ein manueller Lauf lässt nur fällige Pakete ablaufen.",
      tag: "ablaufen",
      container: {
        title: "Credits ablaufen lassen",
        description:
          "Nur Abo-Pakete nach Ablaufdatum verfallen. Gekaufte Pakete und Bonus-Gutschriften bleiben unberührt.",
      },
      response: {
        expiredCount: "Abgelaufene Pakete",
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
      description: "Lässt täglich alte Abonnement-Credits verfallen.",
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
    purchasedModel:
      "Für dieses Modell brauchst du gekaufte Credits. Lade unter {{path}} Credits auf oder wähle ein kostenloses Modell.",
    clusterLimit:
      "Das gemeinsame Gratisguthaben ist aufgebraucht. Nutze gekaufte Credits oder warte auf den nächsten Zeitraum.",
    getBalanceFailed: "Fehler beim Abrufen des Credit-Guthabens",
    getLeadBalanceFailed: "Fehler beim Abrufen des Lead-Credit-Guthabens",
    getOrCreateLeadFailed: "Fehler beim Abrufen oder Erstellen des Leads",
    addCreditsFailed: "Fehler beim Hinzufügen von Credits",
    deductCreditsFailed: "Fehler beim Abziehen von Credits",
    insufficientCredits:
      "Nicht genug Credits. Für diese Funktion brauchst du {{cost}} Credits.",
    deductionFailed:
      "{{cost}} Credits konnten nicht abgebucht werden. Versuch es noch mal.",
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
      "{{method}} gibt es in der App noch nicht. Nutz dafür die Web-Version.",
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
    titleShort: "Guthaben",
    description: "Aktuelles Credit-Guthaben mit Aufschlüsselung abrufen",
    response: {
      title: "Credit-Guthaben",
      description: "Dein aktuelles Credit-Guthaben im Detail",
    },
    balance: {
      subscribe: "Pläne ansehen",
      freePlanHint:
        "{{count}} Gratis-Credits pro Monat, mit Newsletter {{max}}. Pläne ab {{planPrice}} für {{subCredits}} Credits im Monat.",
      lowBalance: {
        title: "Noch {{count}} Credits",
        emptyTitle: "Deine Credits sind aufgebraucht",
        hint: "Unten aufladen: {{packCredits}} Credits für {{packPrice}}, verfallen nie.",
        hintPlans:
          "Wähl unten einen Plan. Die Credits sind sofort nach der Zahlung da.",
        offersHint:
          "Aufladen, in Sekunden geht es weiter. Paket-Credits verfallen nie.",
        offersHintPlans: "Plan wählen, in Sekunden geht es weiter.",
      },
      freePlan: "Du nutzt den Gratis-Plan",
      guestPlan: "Gast-Guthaben",
      signUp: "Kostenlos registrieren",
      loadFailed: "Guthaben nicht geladen.",
      retry: "Erneut laden",
      title: "Deine Credits",
      adminTitle: "Ausgabenlimit",
      description: "Ein Guthaben für alle {{modelCount}} Modelle.",
      adminDescription:
        "Credits wirken als Ausgabenlimit. Steuer, wie viel KI-Nutzung alle Nutzer bekommen.",
      credit: "{{count}} Credit",
      credits: "{{count}} Credits",
      expiring: {
        title: "Ablaufende Credits",
        description: "Plan-Credits, jeden Abrechnungszyklus neu",
        adminDescription: "Zeitlich begrenzte Credits (Abonnementzyklus)",
      },
      permanent: {
        title: "Permanente Credits",
        description: "Verfallen nie. Gehören dir",
        adminDescription: "Permanente Credits, verfallen nie",
      },
      free: {
        title: "Kostenlose Credits",
        description: "{{count}} gratis jeden Monat, mit Newsletter {{max}}",
        descriptionGuest:
          "{{guest}} gratis jeden Monat. Mit Konto {{signedIn}}, mit Konto und Newsletter {{max}}.",
        adminDescription:
          "Gratis-Limit pro Pool/Monat (geteilt über Geräte): {{guest}} Gast, {{signedIn}} angemeldet, {{max}} angemeldet mit Newsletter",
      },
      earned: {
        title: "Verdiente Credits",
        description:
          "Durch Empfehlungen verdient. Klick, um Freunde einzuladen",
      },
      spending: {
        title: "Eigene verdiente Credits",
        adminDescription:
          "Deine persönlichen Empfehlungsverdienste (nicht instanzweit)",
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
    capacity: {
      content: "Gesamtkapazität",
    },
    freeStatus: {
      content: "Status der Gratis-Credits",
      subnetLimit:
        "Aus deinem Netzwerk kamen diesen Monat zu viele neue Gratis-Konten. Dieses Konto bekommt deshalb vorerst keine Gratis-Credits. Ein Credit-Kauf schaltet sie frei, sonst starten sie nächsten Monat, sobald das Netzwerk wieder Platz hat.",
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
        description: "Melde dich an, um dein Credit-Guthaben zu sehen",
      },
      forbidden: {
        title: "Verboten",
        description: "Du hast keine Berechtigung für diese Ressource",
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
        description: "Credit-Pakete gibt es nur mit aktivem Abo",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Du hast nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ressourcenkonflikt aufgetreten",
      },
      no_active_subscription: {
        title: "Aktives Abonnement erforderlich",
        description: "Credit-Pakete gibt es nur mit aktivem Abo",
      },
    },
  },
  history: {
    get: {
      packId: "Credit-Paket",
      showFilters: "Filter anzeigen",
      hideFilters: "Filter ausblenden",
      guestGrantsHidden: "Gratis-Gutschriften für Gäste ausgeblendet",
      recent: "Letzte Aktivität",
      payment: "Zahlung",
      recentTitle: "Letzte Kontobewegungen",
      guestDevice: "Gastgerät",
      kindAccount: "Konto",
      kindLead: "Lead ohne Konto",
      openPayment: "Zahlung öffnen",
      currentBalance: "Aktueller Stand",
      currentBalanceHint: "{{paid}} aus Paketen · {{free}} gratis",
      showingRange: "{{from}} bis {{to}} von {{total}}",
      from: "Von",
      to: "Bis",
      totals: "Summen",
      allTypes: "Alle Arten",
      filteredBy: "Gefiltert nach",
      clearFilters: "Alle entfernen",
      removeFilter: "Filter entfernen",
      spent: "Credit-Abgänge",
      granted: "Credit-Zugänge",
      entries: "Einträge",
      periodHint: "Im gefilterten Zeitraum",
      emptyFiltered: "Keine Einträge für diese Filter.",
      typeFilter: {
        label: "Art",
      },
      target: {
        label: "Kunde",
        description: "Konto-E-Mail, Nutzer-ID oder Lead-ID",
        placeholder: "kunde@example.com oder eine ID",
      },
      resolvedTarget: "Konto von",
      detail: "Modell oder Funktion",
      targetNotFound: "Kein Konto und kein Lead passt zu {{target}}.",
      lookupTitle: "Kundenkonto",
      lookupHint:
        "Suche ein Konto oder einen Lead per E-Mail, Nutzer-ID oder Lead-ID und sieh jede Gutschrift und Abbuchung.",
      openLedger: "Konto öffnen",
      changeTarget: "Anderen suchen",
      colDate: "Datum",
      colType: "Art",
      colDetail: "Modell oder Funktion",
      colAmount: "Betrag",
      colBalance: "Stand danach",
      showing: "Konto von {{who}}",
      bonusGrant: "Bonusgutschrift",
      relatedRecords: "Verknüpfte Datensätze",
      account: "Kundenkonto",
      lead: "Lead",
      openAccount: "Kundenkonto öffnen",
      openLead: "Lead öffnen",
      openPayouts: "Partnerauszahlungen ansehen",
      loading: "Credit-Verlauf wird geladen…",
      delta: "{{amount}} Credits",
      entryBalance: "Saldo nach Buchung: {{count}} Credits",
      emptyHint: "Jeder Credit, der rein- oder rausgeht, landet hier.",
      title: "Credit-Verlauf abrufen",
      titleShort: "Verlauf",
      description: "Paginierten Credit-Transaktionsverlauf abrufen",
      container: {
        title: "Credit-Verlauf",
        description: "Deinen Credit-Verlauf ansehen",
      },
      emptyState: "Noch keine Transaktionen",
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
          description: "Melde dich an, um deinen Credit-Verlauf zu sehen",
        },
        forbidden: {
          title: "Verboten",
          description: "Du hast keine Berechtigung für diese Ressource",
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
          description: "Du hast nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ressourcenkonflikt aufgetreten",
        },
      },
    },
  },
  adminAdd: {
    recipient: {
      details: "Empfängerdetails",
      lookup: "Konto-E-Mail oder Nutzer-ID",
      lookupDescription:
        "Gib die vollständige Konto-E-Mail-Adresse oder Nutzer-ID ein.",
      renewsOn: "Verlängert sich am {{date}}",
      endsOn: "Endet am {{date}}",
      packBalance: "Guthaben aus Paketen",
      freeBalance: "Gratis-Credits",
      balanceSplit: "{{total}} gesamt · {{paid}} aus Paketen · {{free}} gratis",
      stepHint: "Schritt 1: Empfänger prüfen. Schritt 2: Betrag wählen.",
      verified: "Empfänger geprüft",
      kind: "Empfängerart",
      kindAccount: "Konto · verknüpfte Geräte: {{count}}",
      subscription: "Abo",
      noSubscription: "Kein Abo",
      linkedDevices: "Verknüpfte Geräte",
      recentGrants: "Letzte Bonusgutschriften",
      noGrants: "Noch keine Bonusgutschriften",
      grantLine: "{{count}} Credits am {{date}}",
      nextStep: "Weiter: Credits diesem Konto gutschreiben",
      grant: "Credits gutschreiben",
      openLedger: "Kontoauszug öffnen",
      name: "Name",
      balance: "Aktueller Stand",
      joinedAt: "Registriert",
      noName: "Kein Name hinterlegt",
      credits: "{{count}} Credits",
      balanceLine: "Stand {{count}} Credits",
      joinedLine: "Registriert {{date}}",
      title: "Empfänger prüfen",
      description: "Prüfen, ob dieses Konto Bonus-Credits erhalten kann.",
      accountId: "Konto-ID",
      email: "E-Mail des Empfängers",
      noLinkedDevice: "Mit diesem Konto ist kein Gerät verknüpft.",
      loadFailed: "Empfänger konnte nicht geprüft werden.",
      loading: "Empfänger wird geprüft…",
      retry: "Erneut versuchen",
      openAccount: "Kundenkonto öffnen",
      change: "Anderen Empfänger auswählen",
      verify: "Prüfen",
    },
    post: {
      stepTwo: "Schritt 2 von 2: Betrag",
      testerPreset: "{{amount}} Credits verwenden",
      preview: "Stand {{before}} → {{after}} (+{{amount}})",
      title: "Guthaben hinzufügen",
      titleShort: "Guthaben hinzufügen",
      description:
        "Guthabenpakete zu einem Benutzerkonto hinzufügen (nur Admin)",
      tag: "admin",
      container: {
        title: "Bonus-Credits gutschreiben",
        description:
          "Empfänger auswählen und den genauen Betrag für sein Guthaben eingeben.",
        selfTitle: "Eigene Bonus-Credits gutschreiben",
        selfDescription: "Bonus-Credits auf das eigene Konto gutschreiben",
      },
      targetUserId: {
        label: "Empfänger",
        description: "Kundenkonto im Verzeichnis auswählen.",
      },
      amount: {
        label: "Betrag in Credits",
        description: "Geben Sie mindestens 1 Credit als ganze Zahl ein.",
        placeholder: "z. B. 25",
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
        label: "Bonus-Credits gutschreiben",
        loadingText: "Credits werden gutgeschrieben…",
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
          description: "Du hast nicht gespeicherte Änderungen",
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
        subject: "Dein {{appName}} Credit-Paket ist da",
        title: "Deine Credits sind da",
        previewText: "{{credits}} Credits sind jetzt auf deinem Konto",
        greeting: "Hallo {{privateName}},",
        body: "Dein Credit-Paket ist gebucht. {{credits}} Credits liegen jetzt auf deinem Konto, verfallen nie und sind sofort einsatzbereit.",
        cta: "Credits jetzt nutzen",
        signoff: "Danke für deinen Kauf!\n\nDas {{appName}}-Team",
      },
      admin: {
        subject: "[{{appName}}] Guthaben-Paket gekauft: {{credits}} Credits",
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
