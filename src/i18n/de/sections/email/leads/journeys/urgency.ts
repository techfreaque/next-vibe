import type { urgencyTranslations as EnglishUrgencyTranslations } from "../../../../../en/sections/email/leads/journeys/urgency";

export const urgencyTranslations: typeof EnglishUrgencyTranslations = {
  initial: {
    subject: "🚨 Nur noch 5 Plätze frei (7 Tage verbleibend)",
    previewText: "Begrenzte Plätze verfügbar - Verpassen Sie es nicht!",
    greeting: "Hallo,",
    intro:
      "Ich melde mich, weil wir eine begrenzte Gelegenheit haben, die {{businessName}}'s Social Media Präsenz transformieren könnte – aber nur für die nächsten 7 Tage.",
    urgencyAlert: "🚨 NUR NOCH 5 PLÄTZE VERFÜGBAR 🚨",
    program:
      "Wir öffnen unser exklusives '90-Tage Social Media Transformation' Programm für nur 10 Unternehmen diesen Monat. Warum so wenige? Weil wir persönliche, individuelle Betreuung bieten, die einfach nicht auf Hunderte von Kunden skalierbar ist.",
    stats: {
      spotsLeft: "5",
      spotsLeftLabel: "Plätze frei",
      daysToApply: "7",
      daysToApplyLabel: "Tage zur Bewerbung",
      daysToTransform: "90",
      daysToTransformLabel: "Tage zur Transformation",
    },
    socialProof: {
      quote:
        "Ich habe fast nicht beworben, weil ich dachte, es sei zu gut, um wahr zu sein. Beste Geschäftsentscheidung, die ich in Jahren getroffen habe. Wir sind jetzt ausgebucht!",
      author: "Rachel Kim",
      company: "Kim's Fotografie",
    },
    competition:
      "Hier ist, was dies dringend macht: Ihre Konkurrenten investieren bereits stark in Social Media. Jeder Tag, den Sie warten, ist ein weiterer Tag, an dem sie ihren Vorteil ausbauen.",
    ctaText: "Sichern Sie sich jetzt Ihren Platz",
    deadline: "⏰ Bewerbungsschluss: 7 Tage ab heute",
  },
  followup1: {
    subject: "3 Plätze seit gestern vergeben (2 übrig)",
    previewText: "3 Plätze seit gestern vergeben",
    greeting: "Hallo,",
    intro:
      "Ich wollte Ihnen ein kurzes Update zu unserem 90-Tage Social Media Transformation Programm geben.",
    update: "UPDATE: Nur noch 2 Plätze verfügbar!",
    progress:
      "Seit gestern haben sich 3 Unternehmen ihre Plätze gesichert. Die Resonanz war überwältigend, und in diesem Tempo werden wir in den nächsten 48 Stunden komplett ausgebucht sein.",
    concern:
      "Ich möchte nicht, dass {{businessName}} diese Gelegenheit verpasst. Hier ist, was Sie bekommen, wenn Sie sich heute Ihren Platz sichern:",
    benefits: [
      "Komplettes Social Media Audit und Strategie",
      "90 Tage Content-Erstellung und -Management",
      "Wöchentliche Performance-Berichte und Optimierung",
      "Direkter Zugang zu unserem Team über Slack",
      "Garantierte Ergebnisse oder Geld zurück",
    ],
    socialProof: {
      quote:
        "Ich zögerte zu committen, aber die Dringlichkeit war real. Sie waren am nächsten Tag ausgebucht! So froh, dass ich nicht gewartet habe – unsere Ergebnisse waren unglaublich.",
      author: "Tom Wilson",
      company: "Wilson Sanitär",
    },
    warning:
      "Lassen Sie diese Gelegenheit nicht entgleiten. Ihre Konkurrenten werden nicht warten, und Sie sollten es auch nicht.",
    ctaText: "Sichern Sie sich Ihren Platz, bevor er weg ist",
    stats: {
      spotsLeft: "2",
      spotsLeftLabel: "Plätze frei",
      estimatedToFill: "48Std",
      estimatedToFillLabel: "Geschätzt bis zur Füllung",
    },
  },
  followup2: {
    subject: "🚨 Letzte 24 Stunden für {{businessName}}",
    previewText: "Letzte 24 Stunden - Letzte Chance",
    greeting: "Hallo,",
    finalCall: "🚨 LETZTE 24 STUNDEN 🚨\nLetzte Chance für {{businessName}}",
    intro:
      "Das ist es. In 24 Stunden wird unser 90-Tage Social Media Transformation Programm komplett ausgebucht sein, und die nächste Öffnung wird erst nächstes Quartal sein.",
    personal:
      "Ich habe über {{businessName}} und das Potenzial, das ich sehe, nachgedacht. Sie haben alles, was es braucht, um Ihren Markt auf Social Media zu dominieren – Sie brauchen nur die richtige Strategie und Umsetzung.",
    consequences: "Hier ist, was passiert, wenn Sie warten:",
    risks: [
      "Ihre Konkurrenten bauen weiterhin ihren Social Media Vorteil aus",
      "Sie verpassen 90 Tage potenzieller Kundenakquise",
      "Die nächste Programm-Öffnung ist erst im Q2 (3+ Monate entfernt)",
      "Social Media Algorithmen werden noch wettbewerbsfähiger",
    ],
    socialProof: {
      quote:
        "Ich hätte fast auf die 'nächste Runde' gewartet, aber mir wurde klar, dass es vielleicht keine geben würde. Beste Entscheidung überhaupt – wir haben unsere Social Media Leads verdreifacht!",
      author: "Lisa Chen",
      company: "Chen Marketing",
    },
    belief:
      "Ich glaube an {{businessName}}'s Potenzial. Lassen Sie diese Gelegenheit nicht an sich vorbeiziehen. Ihr zukünftiges Ich wird Ihnen dafür danken, dass Sie heute gehandelt haben.",
    ctaText: "Sichern Sie sich den letzten Platz jetzt",
    finalDeadline:
      "⏰ Deadline: Morgen um Mitternacht\nNächste Öffnung: Erst im Q2 2024",
  },
  followup3: {
    subject: "🚨 LETZTER AUFRUF: Letzter Platz für {{businessName}}",
    previewText: "Letzte Gelegenheit - Letzte Chance",
    greeting: "Hallo,",
    intro:
      "Das ist meine letzte E-Mail über die exklusive Gelegenheit für {{businessName}}.",
    lastChance:
      "Die Deadline ist verstrichen, aber ich konnte einen letzten Platz für Sie sichern. Das ist wirklich die letzte Chance - keine Verlängerungen, keine Ausnahmen.",
    ctaText: "Sichern Sie sich Ihren letzten Platz",
    urgency: "🚨 LETZTER AUFRUF: Diese Gelegenheit läuft in 6 Stunden ab",
  },
  nurture: {
    subject: "Kostenlose Wachstums-Einblicke für {{businessName}}",
    previewText: "Wertvolle Einblicke für Ihr Unternehmen",
    greeting: "Hallo,",
    intro:
      "Ich weiß, dass Sie beschäftigt waren, und das Timing war nicht richtig für unsere vorherigen Gelegenheiten.",
    value:
      "Ich wollte einige wertvolle Einblicke teilen, die {{businessName}} beim Wachstum helfen könnten, unabhängig davon, ob wir zusammenarbeiten. Kein Druck, nur Wert.",
    ctaText: "Holen Sie sich kostenlose Wachstums-Einblicke",
    noStrings:
      "Keine Bedingungen - nur hilfreiche Ressourcen für Ihr Unternehmen",
  },
  reactivation: {
    subject: "🚨 Dringende Gelegenheit für {{businessName}}",
    previewText: "Dringende Gelegenheit - Begrenzte Zeit",
    greeting: "Hallo,",
    intro:
      "Ich weiß, es ist eine Weile her, seit wir das letzte Mal über {{businessName}} gesprochen haben.",
    urgent:
      "Etwas Dringendes ist aufgekommen, von dem ich denke, dass es perfekt für Sie sein könnte. Wir haben eine zeitlich begrenzte Gelegenheit, die speziell für Unternehmen wie Ihres entwickelt wurde.",
    ctaText: "Sehen Sie diese dringende Gelegenheit",
    timeLimit: "⚡ Begrenzte Zeit: Nur noch 48 Stunden verbleibend",
  },
};
