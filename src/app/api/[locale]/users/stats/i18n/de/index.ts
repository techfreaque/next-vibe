import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Benutzerstatistiken",
  description: "Umfassende Benutzeranalysen und Statistiken",
  category: "Benutzer",
  tag: "Statistiken",
  container: {
    title: "Benutzerstatistik-Dashboard",
    description: "Umfassende Benutzeranalysen und Statistiken anzeigen",
  },
  actions: {
    refresh: "Aktualisieren",
    refreshing: "Aktualisiere...",
  },
  basicFilters: {
    title: "Basis-Filter",
    description: "Benutzer nach Status und Rolle filtern",
  },
  subscriptionFilters: {
    title: "Abonnement-Filter",
    description: "Nach Abonnement und Zahlung filtern",
  },
  locationFilters: {
    title: "Standort-Filter",
    description: "Nach Land und Sprache filtern",
  },
  timePeriodOptions: {
    title: "Zeitraum-Optionen",
    description: "Zeitraum und Diagramm-Einstellungen konfigurieren",
  },
  sections: {
    filterOptions: {
      title: "Filter-Optionen",
      description: "Filter für Benutzerstatistiken konfigurieren",
    },
  },
  fields: {
    status: {
      label: "Status-Filter",
      description: "Statistiken nach Benutzerstatus filtern",
    },
    role: {
      label: "Rollen-Filter",
      description: "Statistiken nach Benutzerrolle filtern",
    },
    country: {
      label: "Länder-Filter",
      description: "Statistiken nach Land filtern",
      placeholder: "Land auswählen...",
    },
    language: {
      label: "Sprach-Filter",
      description: "Statistiken nach Sprache filtern",
      placeholder: "Sprache auswählen...",
    },
    search: {
      label: "Suchen",
      description: "Benutzer für Statistiken durchsuchen",
      placeholder: "Suchbegriff eingeben...",
    },
    chartType: {
      label: "Diagrammtyp",
      description: "Wählen Sie den Typ des anzuzeigenden Diagramms",
    },
    dateRangePreset: {
      label: "Datumsbereichsvorlage",
      description: "Wählen Sie einen vordefinierten Datumsbereich",
    },
    includeComparison: {
      label: "Vergleich einbeziehen",
      description: "Vergleich mit vorherigem Zeitraum einbeziehen",
    },
    timePeriod: {
      label: "Zeitraum",
      description: "Wählen Sie den Zeitraum für Statistiken",
    },
    subscriptionStatus: {
      label: "Abonnement-Status",
      description: "Nach Abonnement-Status filtern",
    },
    paymentMethod: {
      label: "Zahlungsmethode",
      description: "Nach Zahlungsmethode filtern",
    },
  },
  response: {
    overviewStats: {
      title: "Übersichts-Statistiken",
      description: "Allgemeine Benutzerstatistiken-Übersicht",
      totalUsers: {
        label: "Benutzer insgesamt",
      },
      activeUsers: {
        label: "Aktive Benutzer",
      },
      inactiveUsers: {
        label: "Inaktive Benutzer",
      },
      newUsers: {
        label: "Neue Benutzer",
      },
    },
    emailStats: {
      title: "E-Mail-Statistiken",
      description: "Benutzer E-Mail-Verifizierungsstatistiken",
      emailVerifiedUsers: {
        label: "Verifizierte E-Mails",
      },
      emailUnverifiedUsers: {
        label: "Unverifizierte E-Mails",
      },
      verificationRate: {
        label: "Verifizierungsrate",
      },
    },
    profileStats: {
      title: "Profil-Statistiken",
      description: "Benutzer-Profilvollständigkeitsstatistiken",
      complete: {
        title: "Profilvollständigkeit",
        description: "Detaillierte Profilvollständigkeitsmetriken",
        usersWithPhone: {
          content: "Benutzer mit Telefon",
        },
        usersWithBio: {
          content: "Benutzer mit Biografie",
        },
        usersWithWebsite: {
          content: "Benutzer mit Website",
        },
        usersWithJobTitle: {
          content: "Benutzer mit Jobtitel",
        },
        usersWithImage: {
          content: "Benutzer mit Profilbild",
        },
        completionRate: {
          content: "Profilvollständigkeitsrate",
        },
      },
    },
    subscriptionStats: {
      title: "Abonnement-Statistiken",
      description: "Benutzer-Abonnementverteilungsstatistiken",
      activeSubscriptions: {
        label: "Aktiv",
      },
      canceledSubscriptions: {
        label: "Storniert",
      },
      expiredSubscriptions: {
        label: "Abgelaufen",
      },
      noSubscription: {
        label: "Kein Abonnement",
      },
      subscriptionChart: {
        label: "Abonnementverteilung",
        description: "Visuelle Aufschlüsselung der Abonnementstatus",
      },
    },
    paymentStats: {
      title: "Zahlungsstatistiken",
      description: "Umsatz- und Transaktionsstatistiken",
      totalRevenue: {
        label: "Gesamtumsatz",
      },
      transactionCount: {
        label: "Transaktionen",
      },
      averageOrderValue: {
        label: "Durchschn. Bestellwert",
      },
      refundRate: {
        label: "Erstattungsrate",
      },
    },
    roleStats: {
      title: "Rollen-Statistiken",
      description: "Benutzer-Rollenverteilungsstatistiken",
      publicUsers: {
        label: "Öffentlich",
      },
      customerUsers: {
        label: "Kunden",
      },
      partnerAdminUsers: {
        label: "Partner-Admins",
      },
      partnerEmployeeUsers: {
        label: "Partner-Personal",
      },
      adminUsers: {
        label: "Admins",
      },
      roleChart: {
        label: "Rollenverteilung",
        description: "Visuelle Aufschlüsselung der Benutzer nach Rolle",
      },
    },
    timeStats: {
      title: "Zeitbasierte Statistiken",
      description: "Benutzererstellung und Wachstumsstatistiken über die Zeit",
      usersCreatedToday: {
        label: "Heute",
      },
      usersCreatedThisWeek: {
        label: "Diese Woche",
      },
      usersCreatedThisMonth: {
        label: "Diesen Monat",
      },
      usersCreatedLastMonth: {
        label: "Letzten Monat",
      },
      growthRate: {
        label: "Wachstumsrate",
      },
    },
    companyStats: {
      title: "Unternehmens-Statistiken",
      description: "Unternehmensbezogene Benutzerstatistiken",
      uniqueCompanies: {
        content: "Einzigartige Unternehmen",
      },
    },
    // Keep the flat structure for backward compatibility
    totalUsers: {
      content: "Benutzer insgesamt",
    },
    activeUsers: {
      content: "Aktive Benutzer",
    },
    inactiveUsers: {
      content: "Inaktive Benutzer",
    },
    newUsers: {
      content: "Neue Benutzer",
    },
    emailVerifiedUsers: {
      content: "E-Mail-verifizierte Benutzer",
    },
    emailUnverifiedUsers: {
      content: "E-Mail-unverifizierte Benutzer",
    },
    verificationRate: {
      content: "E-Mail-Verifizierungsrate",
    },
    usersWithPhone: {
      content: "Benutzer mit Telefon",
    },
    usersWithBio: {
      content: "Benutzer mit Biografie",
    },
    usersWithWebsite: {
      content: "Benutzer mit Website",
    },
    usersWithJobTitle: {
      content: "Benutzer mit Berufsbezeichnung",
    },
    usersWithImage: {
      content: "Benutzer mit Profilbild",
    },
    usersWithStripeId: {
      content: "Benutzer mit Stripe-ID",
    },
    usersWithoutStripeId: {
      content: "Benutzer ohne Stripe-ID",
    },
    stripeIntegrationRate: {
      content: "Stripe-Integrationsrate",
    },
    usersWithLeadId: {
      content: "Benutzer mit Lead-ID",
    },
    usersWithoutLeadId: {
      content: "Benutzer ohne Lead-ID",
    },
    leadAssociationRate: {
      content: "Lead-Assoziationsrate",
    },
    publicUsers: {
      content: "Öffentliche Benutzer",
    },
    customerUsers: {
      content: "Kunden-Benutzer",
    },
    partnerAdminUsers: {
      content: "Partner-Administrator-Benutzer",
    },
    partnerEmployeeUsers: {
      content: "Partner-Mitarbeiter-Benutzer",
    },
    adminUsers: {
      content: "Administrator-Benutzer",
    },
    uniqueCompanies: {
      content: "Einzigartige Unternehmen",
    },
    usersCreatedToday: {
      content: "Heute erstellte Benutzer",
    },
    usersCreatedThisWeek: {
      content: "Diese Woche erstellte Benutzer",
    },
    usersCreatedThisMonth: {
      content: "Diesen Monat erstellte Benutzer",
    },
    usersCreatedLastMonth: {
      content: "Letzten Monat erstellte Benutzer",
    },
    growthRate: {
      content: "Wachstumsrate",
    },
    leadToUserConversionRate: {
      content: "Lead-zu-Benutzer-Konversionsrate",
    },
    retentionRate: {
      content: "Benutzer-Bindungsrate",
    },
    generatedAt: {
      content: "Statistiken generiert am",
    },
    growthMetrics: {
      title: "Wachstumsmetriken",
      description: "Benutzer-Wachstums- und Konversionsmetriken",
      growthChart: {
        label: "Benutzerwachstum über Zeit",
        description: "Visuelle Darstellung der Benutzererstellungstrends",
      },
    },
    performanceRates: {
      title: "Leistungsraten",
      description: "Benutzer-Leistungs- und Konversionsmetriken",
      growthRate: {
        label: "Wachstumsrate",
      },
      leadToUserConversionRate: {
        label: "Lead-Konversion",
      },
      retentionRate: {
        label: "Bindungsrate",
      },
    },
    businessInsights: {
      title: "Geschäftseinblicke",
      description: "Business Intelligence und Analytik",
      uniqueCompanies: {
        label: "Einzigartige Unternehmen",
      },
      generatedAt: {
        label: "Generiert am",
      },
    },
  },
  errors: {
    validation: {
      title: "Validierung fehlgeschlagen",
      description: "Ungültige Statistikparameter angegeben",
    },
    unauthorized: {
      title: "Nicht autorisierter Zugriff",
      description: "Sie müssen angemeldet sein, um Statistiken anzuzeigen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung, Statistiken anzuzeigen",
    },
    notFound: {
      title: "Statistiken nicht gefunden",
      description:
        "Die angeforderten Statistiken konnten nicht gefunden werden",
    },
    conflict: {
      title: "Konfliktfehler",
      description:
        "Statistiken können aufgrund bestehender Konflikte nicht generiert werden",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung zum Server nicht möglich",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
    },
    server: {
      title: "Serverfehler",
      description:
        "Statistiken können aufgrund eines Serverfehlers nicht generiert werden",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unerwarteter Fehler ist beim Generieren der Statistiken aufgetreten",
    },
  },
  enums: {
    subscriptionStatusFilter: {
      all: "Alle",
      active: "Aktiv",
      trialing: "Testphase",
      pastDue: "Zahlungsrückstand",
      canceled: "Storniert",
      unpaid: "Unbezahlt",
      paused: "Pausiert",
      noSubscription: "Kein Abonnement",
    },
    paymentMethodFilter: {
      all: "Alle",
      card: "Karte",
      bankTransfer: "Banküberweisung",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA-Lastschrift",
      crypto: "Kryptowährung",
      noPaymentMethod: "Keine Zahlungsmethode",
    },
  },
  success: {
    title: "Statistiken erfolgreich generiert",
    description: "Benutzerstatistiken wurden erfolgreich generiert",
  },
};
