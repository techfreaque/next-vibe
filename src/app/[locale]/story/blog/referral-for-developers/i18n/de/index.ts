import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Du hast was mit KI gebaut. Jetzt verdien damit, es zu teilen.",
    description:
      "Für Entwickler: Wie du deine bestehende KI-Arbeit - Blog-Posts, READMEs, Tutorials, Open-Source-Tools - in einen passiven Empfehlungs-Einkommensstrom verwandelst.",
    category: "Empfehlungsprogramm",
    imageAlt:
      "Das Terminal eines Entwicklers mit Einnahmenstatistiken neben Code",
    keywords:
      "Entwickler-Empfehlungsprogramm, KI-Affiliate, passives Einkommen Entwickler, Open-Source-Monetarisierung",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    brand: "unbottled.ai - ",
    category: "Für Entwickler",
    readTime: "5 Min. Lesezeit",
    title: "Du hast was mit KI gebaut. Jetzt verdien damit, es zu teilen.",
    subtitle:
      "Du shippst bereits mit KI. Dein Empfehlungslink ist ein Einkommensstrom, den du noch nicht angezapft hast.",
  },
  useCase: {
    title: "Wo Entwickler natürlich empfehlen",
    p1: "Du erstellst bereits Content, der Leute zu Tools führt. Ein Blog-Post über deinen Workflow. Ein README, das die KI erwähnt, die du benutzt hast. Ein YouTube-Tutorial. Eine Discord-Antwort, in der du eine Plattform empfiehlst. All das hat Empfehlungspotenzial, das die meisten Entwickler brachliegen lassen.",
    p2: "Das Muster ist simpel: Überall, wo du unbottled.ai natürlich erwähnen würdest, fügst du deinen Empfehlungscode ein. Leute, die klicken und abonnieren, bringen dir 10 % Provision - wiederkehrend. Du musst nicht ändern, was du sagst - füg einfach den Link hinzu.",
    examples: [
      'GitHub README: "Ich hab das mit der API von unbottled.ai gebaut. Wenn du es ausprobieren willst: [Empfehlungslink]"',
      'Blog-Post-Footer: "Tools die ich nutze: …unbottled.ai für KI-Zugang [ref-Link]"',
      'Discord/Slack: "Ich nutz unbottled.ai - hier meine Empfehlung, falls du es ausprobieren willst"',
      'YouTube-Beschreibung: "In diesem Video verwendete KI-Tools: unbottled.ai [Empfehlungslink]"',
    ],
  },
  apiAngle: {
    title: "Der API / next-vibe-Ansatz",
    p1: "Wenn du auf der unbottled.ai API oder mit next-vibe baust, sind deine Nutzer natürliche Empfehlungen. Jemand, der ein Tool benutzt, das du auf der Plattform gebaut hast, ist schon einen Schritt vom direkten Abonnieren entfernt.",
    p2: "next-vibe selbst ist Open Source. Wenn du darüber schreibst, dazu beiträgst oder etwas damit baust, erstellst du bereits genau den Content, der konvertiert - dein Empfehlungslink gehört da rein.",
  },
  math: {
    title: "Die Rechnung (Code-Stil)",
    subtitle: "Zwei Szenarien: Gelegenheitsnutzer vs. Heavy User",
    tableHeaderReferrals: "Empfohlene Nutzer",
    tableHeaderCasual: "Gelegentlich (Ø 8 $/Monat)",
    tableHeaderHeavy: "Dev (200 $+/Monat)",
    rows: [
      { referrals: "10", casual: "8 $/Monat", heavy: "100 $/Monat" },
      { referrals: "50", casual: "40 $/Monat", heavy: "500 $/Monat" },
      { referrals: "100", casual: "80 $/Monat", heavy: "1.000 $/Monat" },
    ],
    note: "Eine Power-User-Empfehlung = 12+ normale Empfehlungen an Einnahmen. Entwickler kennen die Zahlen bereits - der durchschnittliche Dev zahlt locker 200 $/Monat für Claude Code oder Codex. Die Entwickler-Zielgruppe, für die du schreibst, ist genau das High-ARPU-Ende dieser Tabelle.",
    growthNote:
      "Da unbottled.ai Modelle und Features hinzufügt, steigt der ARPU. Empfehlungen, die du heute machst, bringen dir nächstes Jahr mehr, ohne zusätzliche Arbeit.",
  },
  multilevel: {
    title: "Mehrstufig für Open-Source-Builder",
    p1: "Wenn du Open-Source-Tools oder -Bibliotheken veröffentlichst, die Entwickler nutzen, sind deine Nutzer selbst Entwickler. Manche davon geben unbottled.ai weiter. Wenn sie das tun, verdienst du ebenfalls einen Anteil dieser Empfehlungen - bis zu 5 Ebenen tief.",
    p2: "Ein populäres Open-Source-Projekt kann einen Empfehlungsbaum erzeugen, der passiv verdient, lange nachdem du zum nächsten Projekt weitergezogen bist. Du musst ihn nicht pflegen. Du musst nur den Link an der richtigen Stelle platziert haben.",
  },
  crypto: {
    title: "Auszahlung in Krypto - kein Bankkonto nötig",
    p1: "Einnahmen können in BTC oder USDC ausgezahlt werden. Verarbeitung innerhalb von 48 Stunden nach Genehmigung. Mindestauszahlung: 40 $.",
    p2: "Alternativ kannst du Einnahmen sofort in Plattform-Credits umwandeln. Wenn du unbottled.ai selbst nutzt (für Coding-Unterstützung, Prototyping, Tests), gleichen deine Empfehlungseinnahmen deine eigenen Nutzungskosten aus.",
  },
  close: {
    title: "Zapf den Strom an",
    p1: "Du baust, schreibst und redest bereits über KI-Tools. Einen Empfehlungslink hinzuzufügen kostet dich nichts und dauert fünf Minuten.",
    p2: "Der Zinseszinseffekt - wiederkehrende Provisionen, steigender ARPU, Mehrebenen-Kette - arbeitet umso mehr für dich, je öffentlicher du baust.",
    createCode: "Empfehlungscode erstellen",
    joinDiscord: "Discord beitreten",
    backToBlog: "Zurück zum Blog",
  },
};
