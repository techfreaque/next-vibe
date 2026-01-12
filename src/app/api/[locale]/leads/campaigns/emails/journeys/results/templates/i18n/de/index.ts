import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  resultsJourney: {
    followup1: {
      previewText: "Sehen Sie echte Ergebnisse unserer Kunden",
      headline: "Echte Ergebnisse, Echte Kunden",
      subheadline:
        "Verlassen Sie sich nicht nur auf unser Wort - sehen Sie, was wir für Unternehmen wie Ihres erreicht haben",
      caseStudyTitle: "Erfolgsgeschichte",
      caseStudyCompany: "Unternehmen",
      caseStudyIndustry: "Branche",
      caseStudyTimeframe: "Zeitraum",
      caseStudyResults: "Erzielte Ergebnisse",
      roiTitle: "Ihr potenzieller ROI",
      roiExplanation:
        "Basierend auf ähnlichen Kunden ist das, was Sie erwarten können",
      metric1Label: "Umsatzwachstum",
      metric1Value: "Bis zu 300%",
      metric2Label: "Zeitersparnis",
      metric2Value: "20+ Stunden/Woche",
      ctaText: "Holen Sie sich Ihre individuelle ROI-Schätzung",
      urgency: "Solche Ergebnisse entstehen nicht durch Warten",
      subject: "Sehen Sie, wie wir Unternehmen wie Ihres geholfen haben",
    },
    initial: {
      previewText: "Entdecken Sie unsere professionellen Dienstleistungen",
      heroTitle: "Ergebnisse, die zählen",
      heroSubtitle: "Professionelle Lösungen für Ihr Unternehmen",
      priceText: "Ab {{price}}/Monat",
      processImagePlaceholder: "Unser Prozess",
      noContractTitle: "Kein Langzeitvertrag",
      monthlyCancellation: "Jederzeit kündbar",
      ctaText: "Jetzt starten",
      contactTitle: "Fragen? Wir sind für Sie da:",
      subject: "Erzielen Sie echte Ergebnisse mit unseren Dienstleistungen",
    },
    followup2: {
      previewText: "Warum die Wahl des richtigen Partners wichtig ist",
      greeting: "Überlegen Sie noch?",
      intro:
        "Wir verstehen, dass Sie die richtige Wahl treffen möchten. Lassen Sie uns transparent darüber sprechen, was uns auszeichnet.",
      competitorTitle: "Was Sie über Alternativen wissen sollten",
      competitorAnalysis:
        "Während es andere Optionen gibt, sollten Sie Folgendes bedenken:",
      competitorPoint1:
        "Höhere Kosten mit versteckten Gebühren, die sich summieren",
      competitorPoint2: "Eingeschränkter Support und längere Reaktionszeiten",
      competitorPoint3:
        "Weniger flexible Bedingungen und starre Vertragsanforderungen",
      opportunityCostTitle: "Die wahren Kosten des Wartens",
      opportunityCostText:
        "Jeder Tag ohne die richtige Lösung bedeutet verpasste Chancen und verlorenes Potenzial. Lassen Sie nicht zu, dass Unentschlossenheit Sie mehr kostet als unser Service.",
      ctaText: "Treffen Sie heute die kluge Wahl",
      urgency:
        "Begrenzte Plätze verfügbar diesen Monat. Verpassen Sie es nicht.",
      subject: "Die Wahrheit über Ihre Optionen",
    },
    followup3: {
      previewText: "Ihre letzte Gelegenheit wartet",
      greeting: "Dies ist Ihre letzte Chance",
      intro:
        "Wir haben unseren Wert geteilt, Bedenken angesprochen und gezeigt, was möglich ist. Jetzt ist Entscheidungszeit.",
      finalOpportunityTitle: "Letzte Gelegenheit",
      finalOpportunityText:
        "Dieses Sonderangebot läuft bald ab. Lassen Sie sich diese Gelegenheit nicht entgehen.",
      limitedTimeOffer: "Zeitlich begrenztes Angebot endet bald",
      whatYoureMissingTitle: "Was Sie verpassen:",
      missingPoint1: "Bewährte Ergebnisse, die echten ROI liefern",
      missingPoint2: "Expertenunterstützung, wenn Sie sie am meisten brauchen",
      missingPoint3: "Flexible Lösungen, die mit Ihnen wachsen",
      lastChance: "Letzte Chance, dieses Angebot zu nutzen",
      ctaText: "Sichern Sie sich jetzt Ihren Platz",
      subject: "Letzter Aufruf: Verpassen Sie diese Gelegenheit nicht",
    },
    nurture: {
      previewText: "Wertvolle Einblicke für Ihr Unternehmen",
      greeting: "Bleiben Sie informiert und wachsen Sie stärker",
      intro:
        "Wir sind hier, um Ihnen zum Erfolg zu verhelfen, ob Sie mit uns arbeiten oder nicht. Hier sind einige Einblicke, die Ihrem Unternehmen zum Erfolg verhelfen.",
      insightsTitle: "Brancheneinblicke & Tipps",
      insight1: "Neueste Trends und Best Practices in Ihrer Branche",
      insight2:
        "Bewährte Strategien zur Verbesserung von Effizienz und Ergebnissen",
      freeResourceTitle: "Kostenlose Ressource für Sie",
      freeResourceDescription:
        "Laden Sie unseren umfassenden Leitfaden voller umsetzbarer Tipps und Strategien herunter",
      noObligationText:
        "Ohne Verpflichtung - das ist unsere Art, Ihnen zum Erfolg zu verhelfen",
      ctaText: "Kostenlose Ressource herunterladen",
      subject: "Einblicke für das Wachstum Ihres Unternehmens",
    },
    reactivation: {
      previewText: "Wir würden uns freuen, Sie zurückzuhaben",
      greeting: "Wir haben Sie vermisst!",
      intro:
        "Wir haben bemerkt, dass Sie in letzter Zeit nicht aktiv waren. Wir haben einige aufregende Verbesserungen vorgenommen und haben ein spezielles Willkommen-zurück-Angebot nur für Sie.",
      specialOfferTitle: "Exklusives Willkommen-zurück-Angebot",
      discountOffer:
        "Erhalten Sie 50% Rabatt auf Ihren ersten Monat bei Ihrer Rückkehr",
      ctaText: "Fordern Sie Ihr Willkommen-zurück-Angebot an",
      subject: "Wir vermissen Sie - Sonderangebot im Inneren",
    },
  },
};
