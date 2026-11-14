import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "{{appName}} Partnerprogramm - {{directPct}} wiederkehrend, ohne Limit",
    category: "Partner",
    description:
      "Creator, Newsletter und Verzeichnisse: {{directPct}} jedes Kaufs der Nutzer, die du zu {{appName}} bringst. Wiederkehrend, ohne Limit, pro Link messbar. Auszahlung in Credits oder BTC/USDC.",
    imageAlt: "{{appName}} Partnerprogramm",
    keywords:
      "{{appName}}, Affiliate-Programm, Partnerprogramm, unzensierte KI Affiliate, wiederkehrende Provision, Creator-Programm, Newsletter-Sponsoring",
  },
  hero: {
    eyebrow: "Partnerprogramm",
    title: "Deine Community will KI ohne Belehrung. Du verdienst daran mit.",
    subtitle:
      "{{directPct}} jedes Kaufs, solange sie zahlen. Ohne Limit. Ein Tracking-Link pro Video, Ausgabe oder Eintrag, damit du genau siehst, was konvertiert.",
    ctaPrimary: "Partnerlink holen",
    ctaSecondary: "Konditionen lesen",
  },
  facts: {
    commission: "jedes Kaufs, wiederkehrend",
    capValue: "Kein Limit",
    cap: "bei Nutzern und Provisionen",
    holdValue: "{{holdDays}} Tage",
    hold: "Widerrufsfrist, danach gehört es dir",
    minPayout: "Mindestauszahlung",
  },
  audience: {
    label: "Für wen",
    title: "Für alle, die ohnehin über KI sprechen",
    intro:
      "Wenn deine Zuschauer an Ablehnungen, Filtern oder Preisschranken scheitern, hast du den Pitch schon. Wir liefern Link und Zahlen.",
    creators: {
      title: "Creator",
      body: "YouTube, TikTok, Streams. Ein Link pro Video in die Beschreibung. Du siehst, welches Video zahlende Nutzer bringt, nicht nur Klicks.",
    },
    newsletters: {
      title: "Newsletter und Blogs",
      body: "Ein Link pro Ausgabe oder Beitrag. Wer sich anmeldet, bleibt dir zugeordnet. Eine Erwähnung zahlt sich dauerhaft aus.",
    },
    directories: {
      title: "Verzeichnisse und Vergleichsportale",
      body: "Liste uns mit deinem Link. Jeder Nutzer, der sich über deinen Eintrag anmeldet, bleibt dauerhaft dir zugeordnet.",
    },
  },
  steps: {
    label: "So funktioniert's",
    title: "In fünf Minuten startklar",
    intro: "Keine Bewerbung, keine Freigabe, keine Mindestreichweite.",
    step1: {
      title: "Kostenloses Konto anlegen",
      body: "Registrieren. Die Empfehlungsseite öffnet sich direkt danach.",
    },
    step2: {
      title: "Code wählen, dann ein Link pro Platzierung",
      body: "Einmal einen Empfehlungscode festlegen. Dann für jedes Video, jede Ausgabe, jeden Eintrag einen eigenen Tracking-Link. Jeder zählt Besuche, Anmeldungen und Einnahmen separat.",
    },
    step3: {
      title: "Teilen",
      body: "Beschreibung, angepinnter Kommentar, Newsletter-Fußzeile, Verzeichniseintrag. Wer sich darüber anmeldet, gehört zu dir.",
    },
    step4: {
      title: "An jedem Kauf verdienen",
      body: "{{directPct}} jeder Abo-Zahlung und jedes Credit-Pakets. Nach der {{holdDays}}-tägigen Widerrufsfrist wird daraus Guthaben, das du nutzt oder auszahlst.",
    },
  },
  terms: {
    label: "Die Konditionen",
    title: "Alles, was über deine Einnahmen entscheidet",
    intro:
      "Keine Stufen zum Freischalten, kein Kleingedrucktes jenseits dieser Tabelle.",
    rows: {
      commission: {
        term: "Provision",
        value:
          "{{directPct}} jedes Kaufs geworbener Nutzer: Abos und Credit-Pakete.",
      },
      duration: {
        term: "Laufzeit",
        value:
          "Wiederkehrend, solange sie zahlen. Wer sich über deinen Link anmeldet, bleibt dir zugeordnet.",
      },
      cap: {
        term: "Limit",
        value: "Keins. Weder bei Nutzern noch bei Provisionen.",
      },
      hold: {
        term: "Widerrufsfrist",
        value:
          "Neue Provisionen bleiben {{holdDays}} Tage ausstehend. Eine Erstattung oder Rückbuchung in dieser Zeit storniert sie. Danach sind sie bestätigt.",
      },
      payout: {
        term: "Auszahlung",
        value:
          "Bestätigte Provisionen 1:1 als Credits nutzen oder in BTC bzw. USDC auszahlen.",
      },
      minimum: {
        term: "Mindestauszahlung",
        value:
          "{{minPayout}}. Krypto-Auszahlungen werden innerhalb von {{cryptoPayoutHours}} Stunden nach Freigabe bearbeitet.",
      },
      second: {
        term: "Zweite Ebene",
        value:
          "Bringt jemand, den du geworben hast, eigene Nutzer mit, erhältst du zusätzlich {{level2Pct}} ihrer Zahlungen.",
      },
      tracking: {
        term: "Tracking",
        value:
          "Empfehlungscode plus UTM-Parameter auf jedem Link. Besuche, Anmeldungen, zahlende Nutzer und Einnahmen pro Link, live auf deiner Empfehlungsseite.",
      },
    },
  },
  product: {
    label: "Wohin du sie schickst",
    title: "Eine KI-Plattform, die deine Community wirklich empfehlen kann",
    intro:
      "Leicht zu pitchen, weil sie genau das löst, worüber Leute sich beschweren.",
    choice: {
      title: "Etablierte, offene und unzensierte Modelle",
      body: "Die großen Namen neben offenen und unzensierten Modellen, in einem Chat. Unzensiert gibt es in zwei Sorten: Mainstream-Modelle ohne Verweigerungen und UncensoredLM mit eigenem Weltbild. Modellwechsel jederzeit.",
    },
    control: {
      title: "Den Filter stellen sie selbst ein",
      body: "Keine stillen Ablehnungen, über die andere entscheiden. Jeder Nutzer wählt seine Filterstufe.",
    },
    free: {
      title: "Kostenloser Einstieg",
      body: "Neue Nutzer testen ohne Karte. Leichtes Ja für deine Community, leichte Conversion für dich.",
    },
  },
  faq: {
    label: "FAQ",
    title: "Was Partner fragen",
    items: {
      audience: {
        q: "Brauche ich eine Mindestreichweite?",
        a: "Nein. Keine Bewerbung, keine Followerzahl. Ein Leser mit Abo zahlt dir jeden Monat, den er bleibt.",
      },
      counts: {
        q: "Was zählt als Kauf?",
        a: "Jede Abo-Zahlung und jedes Credit-Paket eines geworbenen Nutzers. Verlängerungen zählen jedes Mal mit.",
      },
      attribution: {
        q: "Wie lange gilt die Zuordnung?",
        a: "Dauerhaft. Wer sich über deinen Link anmeldet, ist fest mit deinem Konto verknüpft. Nach der Anmeldung läuft kein Cookie ab.",
      },
      placements: {
        q: "Kann ich jede Platzierung einzeln messen?",
        a: "Ja. Lege auf deiner Empfehlungsseite einen Tracking-Link pro Video, Ausgabe oder Eintrag an. Jeder zeigt eigene Besuche, Anmeldungen, zahlende Nutzer und Einnahmen.",
      },
      refunds: {
        q: "Was passiert bei einer Erstattung?",
        a: "Provisionen bleiben {{holdDays}} Tage ausstehend. Wird der Kauf in dieser Zeit erstattet oder zurückgebucht, entfällt die Provision. Danach gehört sie dir.",
      },
      payout: {
        q: "Wie werde ich bezahlt?",
        a: "Bestätigte Provisionen landen als Credits auf deinem Konto. Oder du beantragst ab {{minPayout}} eine Auszahlung in BTC oder USDC, bearbeitet innerhalb von {{cryptoPayoutHours}} Stunden nach Freigabe.",
      },
    },
  },
  cta: {
    title: "Dein Link ist fünf Minuten entfernt.",
    subtitle:
      "Kostenloses Konto. Keine Freigabe. {{directPct}} jedes Kaufs, wiederkehrend, ohne Limit.",
    primary: "Partnerlink holen",
    secondary: "So funktionieren Empfehlungen",
  },
};
