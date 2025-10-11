import type { plansTranslations as EnglishPlansTranslations } from "../../../en/sections/pricing/plans";

export const plansTranslations: typeof EnglishPlansTranslations = {
  title: "Preispläne",
  subtitle:
    "Wählen Sie den perfekten Plan für die Social Media Bedürfnisse Ihres Unternehmens",
  monthly: "Monatlich",
  annually: "Jährlich",
  savePercent: "Sparen Sie mehr als {{percent}}%",
  supportBadge: "Dedizierter Support",
  contactUsLink: "Kontaktieren Sie uns",
  tailoredPackageText: "für ein maßgeschneidertes Paket.",
  perMonth: "/Monat",
  guaranteeBadge: "Experten-Kreativteam",
  flexibleBadge: "Jederzeit kündigen oder upgraden",
  customSolutionText:
    "Alle Pläne beinhalten Kontoeinrichtung, Content-Erstellung und Strategiegespräche. Benötigen Sie eine individuelle Lösung?",
  badge: "Wählen Sie den perfekten Plan für Ihr Unternehmen",
  processing: "Wird verarbeitet...",
  orSeparator: "oder",
  monthlyPosts: {
    starter: "2 Beiträge auf all Ihren Plattformen",
    professional: "4 Beiträge oder 2 Reels auf all Ihren Plattformen",
    premium: "8 Beiträge oder 4 Reels auf all Ihren Plattformen",
    enterprise: "Unbegrenzter Content",
  },
  strategyCalls: {
    starter: "Vierteljährlich",
    professional: "Monatlich",
    premium: "Monatlich",
    enterprise: "Wöchentlich",
  },
  STARTER: {
    name: "Starter",
    price: "{{price}}{{currency}}",
    description: "Perfekt für kleine Unternehmen, die gerade anfangen",
    features: {
      freeSocialSetup:
        "Social Media Konto-Einrichtung enthalten falls Sie noch keine haben",
      posts: "2 Bild- und Textbeiträge pro Monat auf all Ihren Plattformen",
      strategyCall: "Vierteljährliches Strategiegespräch",
      contentStrategy: "Grundlegende Content-Strategie",
      analytics: "Grundlegende Analytics",
      support: "E-Mail-Support",
      calendar: "Content-Kalender",
    },
    cta: "Starter wählen",
  },
  PROFESSIONAL: {
    name: "Professional",
    price: "{{price}}{{currency}}",
    description: "Ideal für wachsende Unternehmen",
    features: {
      freeSocialSetup:
        "Social Media Konto-Einrichtung enthalten falls Sie noch keine haben",
      contentStrategy: "Erweiterte Content-Strategie",
      posts: "4 Bild- und Textbeiträge pro Monat auf all Ihren Plattformen",
      reels: "2 Reels pro Monat auf all Ihren Plattformen",
      strategyCall: "Monatliches Strategiegespräch",
      analytics: "Erweiterte Analytics",
      support: "Prioritäts-E-Mail & Chat-Support",
      calendar: "Content-Kalender",
    },
    cta: "Professional wählen",
    badge: "Beliebtester",
  },
  PREMIUM: {
    name: "Premium",
    price: "{{price}}{{currency}}",
    description: "Komplettlösung mit Premium-Content-Erstellung",
    premiumFeatures: {
      premiumPosts:
        "8 Bild- und Textbeiträge pro Monat auf all Ihren Plattformen",
      premiumReels: "4 Reels pro Monat auf all Ihren Plattformen",
    },
    features: {
      freeSocialSetup:
        "Social Media Konto-Einrichtung enthalten falls Sie noch keine haben",
      strategyCalls: "Monatliche Strategiegespräche",
      contentStrategy: "Erweiterte Content-Strategie während des Monats",
      analytics: "Umfassende Analytics & Berichterstattung",
      accountManager: "Dedizierter Account Manager",
      support: "Prioritäts-Support",
    },
    cta: "Premium wählen",
    featureBadge: "Premium Content",
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: "Individuell",
    description:
      "Maßgeschneiderte Lösungen für Unternehmen jeder Größe mit besonderen Anforderungen.",
    featureBadge: "Individuelle Lösungen",
    features: {
      freeSocialSetup:
        "Social Media Konto-Einrichtung enthalten falls Sie noch keine haben",
      posts: "Unbegrenzter Content auf allen Plattformen",
      creativeTeam: "Dediziertes Kreativteam",
      onSiteProduction: "Vor-Ort-Produktionsoptionen",
      bottomNote: "Individuelle Lösungen für kleine und große Unternehmen.",
    },
    cta: "Jetzt starten",
  },
};
