import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  creditPricing: {
    badge: "Flexible Preisgestaltung",
    title: "Wählen Sie Ihren Plan",
    subtitle:
      "Zahlen Sie nur für das, was Sie nutzen, oder wählen Sie unbegrenzt",
    subscription: {
      badge: "Am beliebtesten",
      title: "Unbegrenzt",
      price: "€10",
      perMonth: "/Monat",
      description: "Bestes Preis-Leistungs-Verhältnis für Power-User",
      expiryInfo: "Monatlich abgerechnet, jederzeit kündbar",
      features: {
        credits: "Unbegrenzte Nachrichten",
        allModels: "Alle 40+ KI-Modelle",
        allFeatures: "Alle Funktionen enthalten",
        cancel: "Jederzeit kündbar",
      },
      button: "Jetzt abonnieren",
    },
    creditPack: {
      badge: "Pay-as-you-go",
      title: "Guthaben-Paket",
      price: "€5",
      description: "Perfekt für gelegentliche Nutzung",
      permanentInfo: "Guthaben verfallen nie",
      quantityLabel: "Anzahl der Pakete",
      pricePerPack: "€5 pro Paket",
      features: {
        credits: "€5 Guthaben-Paket",
        allModels: "Alle KI-Modelle enthalten",
        allFeatures: "Alle Funktionen enthalten",
        multiple: "Mehrere Pakete kaufen",
      },
      button: "Guthaben kaufen",
      buttonPlural: "{{quantity}} Guthaben-Pakete kaufen",
    },
    common: {
      processing: "Wird verarbeitet...",
    },
    costTransparency: {
      title: "Kostentransparenz",
      card: {
        title: "Modellkosten",
        description:
          "Sehen Sie genau, wie viele Credits jedes KI-Modell pro Nachricht kostet",
      },
      table: {
        provider: "Anbieter",
        model: "Modell",
        costPerMessage: "Kosten pro Nachricht",
        free: "Kostenlos",
        credits: "{{count}} Guthaben",
        creditsPlural: "{{count}} Guthaben",
        parameters: "{{count}} Parameter",
        features: "Funktionen",
        braveSearch: "Brave-Suche",
        braveSearchCost: "1 Guthaben",
        tts: "Text-zu-Sprache",
        ttsCost: "1 Guthaben",
        stt: "Sprache-zu-Text",
        sttCost: "1 Guthaben",
      },
    },
    calculator: {
      title: "Guthaben-Rechner",
      card: {
        title: "Schätzen Sie Ihre Nutzung",
        description:
          "Berechnen Sie, wie viele Credits Sie basierend auf Ihrer Nutzung benötigen",
      },
      messagesLabel: "Nachrichten pro Monat",
      estimates: {
        free: "Kostenlose Stufe (10 Nachrichten/Tag)",
        freeCredits: "€0",
        basic: "Basis-Modelle (GPT-3.5, Claude Haiku)",
        basicCredits: "~€{{count}}",
        pro: "Pro-Modelle (GPT-4, Claude Sonnet)",
        proCredits: "~€{{count}}",
        premium: "Premium-Modelle (GPT-4 Turbo, Claude Opus)",
        premiumCredits: "~€{{count}}",
      },
      recommendation: {
        title: "Unsere Empfehlung",
        freeTier:
          "Beginnen Sie mit unserer kostenlosen Stufe, um die Plattform auszuprobieren!",
        subscription:
          "Abonnieren Sie für unbegrenzte Nachrichten (€10/Monat deckt bis zu €{{credits}} Nutzung ab)",
        additionalPacks:
          "Abonnieren + {{packs}} zusätzliche(s) Guthaben-Paket(e) für intensive Nutzung kaufen",
      },
    },
    freeTier: {
      title: "Probieren Sie es zuerst kostenlos!",
      description:
        "Erhalten Sie 10 kostenlose Nachrichten pro Tag, um alle unsere KI-Modelle zu erkunden. Keine Kreditkarte erforderlich.",
      button: "Kostenlose Testversion starten",
    },
    buttons: {
      upgrade: "Upgrade",
      downgrade: "Downgrade",
      currentPlan: "Aktueller Plan",
      processing: "Wird verarbeitet...",
    },
  },
  comparison: {
    title: "Einfache, transparente Preisgestaltung",
    subtitle: "Wählen Sie den Plan, der am besten zu Ihnen passt",
    monthly: "Monatlich",
    annually: "Jährlich",
    customNote:
      "Benötigen Sie einen individuellen Plan? Kontaktieren Sie uns für Enterprise-Preise.",
  },
  plans: {
    title: "Wählen Sie Ihren Plan",
    subtitle: "Wählen Sie den perfekten Plan für Ihre Bedürfnisse",
    badge: "Beliebt",
    flexibleBadge: "Flexibel",
    supportBadge: "24/7 Support",
    guaranteeBadge: "Geld-zurück-Garantie",
    orSeparator: "oder",
    customSolutionText: "Benötigen Sie eine individuelle Lösung?",
    tailoredPackageText:
      "Wir können ein maßgeschneidertes Paket für Ihre spezifischen Bedürfnisse erstellen",
    monthly: "Monatlich",
    annually: "Jährlich",
    savePercent: "{{percent}}% sparen",
    perMonth: "/Monat",
    contactUsLink: "Kontaktieren Sie uns",
    STARTER: {
      title: "Kostenlos",
      name: "Kostenlos",
      price: "€0",
      description: "Perfekt zum Ausprobieren von Unbottled.ai",
      cta: "Jetzt starten",
      features: [
        "10 Nachrichten pro Tag",
        "Zugriff auf alle 40+ KI-Modelle",
        "Basis-Ordnerverwaltung",
        "Community-Personas",
      ],
    },
    PROFESSIONAL: {
      title: "Professional",
      name: "Professional",
      price: "€10",
      description: "Am besten für Profis und kleine Teams",
      cta: "Abonnieren",
      features: [
        "Unbegrenzte Nachrichten",
        "Zugriff auf alle 40+ KI-Modelle",
        "Erweiterte Ordnerverwaltung",
        "Prioritäts-Support",
      ],
    },
    PREMIUM: {
      title: "Premium",
      name: "Premium",
      price: "€25",
      description: "Perfekt für Power-User und wachsende Teams",
      cta: "Abonnieren",
      features: [
        "Alles aus Professional",
        "Benutzerdefinierte KI-Personas",
        "Erweiterte Analysen",
        "Dedizierter Support",
      ],
    },
    ENTERPRISE: {
      title: "Enterprise",
      name: "Enterprise",
      price: "Individuell",
      description: "Maßgeschneiderte Lösungen für große Organisationen",
      cta: "Vertrieb kontaktieren",
      features: [
        "Alles aus Premium",
        "Benutzerdefinierte Integrationen",
        "SLA-Garantien",
        "Dedizierter Account Manager",
      ],
    },
  },
  currentPlan: {
    badge: "Aktueller Plan",
  },
  upgrade: {
    processing: "Upgrade wird verarbeitet...",
  },
  subscribe: {
    processing: "Abonnement wird verarbeitet...",
  },
  downgrade: {
    title: "Plan herabstufen",
    description: "Sind Sie sicher, dass Sie Ihren Plan herabstufen möchten?",
    nextCycle:
      "Änderungen werden am Ende Ihres aktuellen Abrechnungszeitraums wirksam",
  },
};
