import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Du hast was mit KI gebaut. Jetzt verdien damit, es zu teilen.",
    description:
      "Für Entwickler: Deine GitHub READMEs, Blog-Posts und Tutorials haben bereits Empfehlungspotenzial. Hier die Rechnung - einschließlich des Skill-Bonus, der dein Einkommen pro Nutzer verdoppelt.",
    category: "Empfehlungsprogramm",
    imageAlt:
      "Das Terminal eines Entwicklers mit Einnahmenstatistiken neben Code",
    keywords:
      "Entwickler-Empfehlungsprogramm, KI-Affiliate, passives Einkommen Entwickler, Open-Source-Monetarisierung",
  },
  hero: {
    backToBlog: "Zurück zum Blog",
    brand: "{{appName}} - ",
    category: "Für Entwickler",
    readTime: "5 Min. Lesezeit",
    title: "Du hast was mit KI gebaut. Jetzt verdien damit, es zu teilen.",
    subtitle:
      "Du shippst bereits mit KI. Dein Empfehlungslink ist ein Einkommensstrom, den du noch nicht angezapft hast.",
  },
  useCase: {
    title: "Wo Entwickler auf natürliche Weise empfehlen",
    p1: "Du erstellst bereits Content, der Leute zu Tools führt. Ein Blog-Post über deinen Workflow. Ein README, das die KI erwähnt. Ein YouTube-Tutorial. Eine Discord-Antwort mit einer Empfehlung. All das hat Empfehlungspotenzial, das die meisten Entwickler brachliegen lassen.",
    p2: "Überall, wo du {{appName}} natürlich erwähnen würdest, fügst du deinen Empfehlungslink ein. Leute, die klicken und abonnieren, bringen dir 10 % jeder Zahlung - jeden Monat, für immer. Du änderst nichts an dem, was du sagst. Du fügst nur den Link hinzu.",
    examples: [
      'GitHub README: "Ich hab das mit der API von {{appName}} gebaut. Probier es aus: [dein Link]"',
      'Blog-Post-Footer: "Tools, die ich nutze: …{{appName}} für KI-Zugang [ref-Link]"',
      'Discord/Slack: "Ich nutze {{appName}} - hier meine Empfehlung, wenn du reinkommen willst"',
      'YouTube-Beschreibung: "In diesem Video verwendete KI-Tools: {{appName}} [Empfehlungslink]"',
    ],
  },
  skillAngle: {
    title: "Skill veröffentlichen - 5 % obendrauf",
    p1: "Jeder Skill, den du veröffentlichst, hat einen teilbaren Link. Wenn jemand sich über deinen Skill-Link anmeldet, verdienst du zusätzlich 5 % auf alle Zahlungen - on top der 10 % direkten Provision. Das macht 15 % von einem einzigen Nutzer, für immer.",
    p2: "Bettet deinen Skill-Link in ein GitHub README ein. Post ihn in einem Entwickler-Discord. Jede Person, die sich dadurch anmeldet, bringt dir beide Provisionen gleichzeitig. Du musst nicht wählen - der Skill-Link trägt beides.",
    p3: "Skills sind kostenlos zu erstellen. Kein bezahltes Abo nötig. Wenn du ein nützliches KI-Setup gebaut hast - ein Code-Reviewer, der deinen Stack kennt, oder ein Docs-Writer auf deinen Stil abgestimmt - teil es. Der Link erledigt den Rest.",
  },
  math: {
    title: "Die Rechnung (echte Zahlen)",
    subtitle: "Direkte Empfehlung vs. Skill-Empfehlung vs. Power-User",
    tableHeaderProfile: "Nutzerprofil",
    tableHeaderSpend: "Monatlicher Umsatz",
    tableHeaderDirect: "Nur direkt (10 %)",
    tableHeaderSkill: "Via Skill-Link (15 %)",
    rows: [
      {
        profile: "Gelegenheitsnutzer",
        spend: "8 $/Monat",
        direct: "0,80 $/Monat",
        skill: "1,20 $/Monat",
      },
      {
        profile: "Regulärer Abonnent",
        spend: "20 $/Monat",
        direct: "2,00 $/Monat",
        skill: "3,00 $/Monat",
      },
      {
        profile: "Heavy AI User",
        spend: "100 $/Monat",
        direct: "10,00 $/Monat",
        skill: "15,00 $/Monat",
      },
      {
        profile: "Entwickler / Power User",
        spend: "200 $+/Monat",
        direct: "20,00 $+/Monat",
        skill: "30,00 $+/Monat",
      },
    ],
    note: "Eine Entwickler-Empfehlung über deinen Skill-Link bringt dir 30 $/Monat. Das ist mehr als 37 Gelegenheitsnutzer zusammen. Entwickler geben bereits 100–200 $/Monat für KI-Tools aus - sie konvertieren schnell und kündigen selten.",
    growthNote:
      "Da {{appName}} Modelle und Features hinzufügt, steigt der ARPU. Empfehlungen, die du heute machst, bringen dir nächstes Jahr mehr - ohne zusätzliche Arbeit.",
  },
  chain: {
    title: "Die Kette - was passiert, wenn deine Empfehlungen weiterempfehlen",
    p1: "Wenn Leute, die du empfohlen hast, selbst andere empfehlen, verdienst du auch an diesen Zahlungen - bis zu 5 Ebenen tief:",
    level0: "Du → direkte Empfehlung: 10 % jeder Zahlung, für immer",
    level1:
      "Ihre Empfehlungen (Ebene 2): ~5 % jeder Zahlung (Hälfte des Upline-Pools von 10 %)",
    level2: "Ebene 3: ~2,5 % jeder Zahlung",
    level3: "Ebene 4: ~1,25 % jeder Zahlung",
    level4: "Ebene 5: ~0,625 % jeder Zahlung",
    total:
      "Maximale Gesamtausschüttung über alle Empfänger: ~20 % einer einzelnen Zahlung",
    p2: "Ehrliche Einschätzung: Die Ketten-Boni werden schnell klein. Das echte Einkommen steckt in den 10 % direkt + 5 % Skill. Wenn du öffentlich baust und deine Empfehlungen selbst Entwickler sind, addiert sich die Kette - aber optimiere nicht für Tiefe. Optimiere für qualitativ hochwertige direkte Empfehlungen.",
  },
  crypto: {
    title: "Auszahlung in Krypto - kein Bankkonto nötig",
    p1: "Auszahlung in BTC oder USDC. Verarbeitung innerhalb von 48 Stunden nach Genehmigung. Mindestbetrag: 40 $ - das entspricht etwa 2 Monaten von einem einzigen Entwickler-Abonnenten via Skill-Link.",
    p2: "Alternativ sofort in Plattform-Credits umwandeln. Wenn du {{appName}} selbst nutzt, gleichen deine Empfehlungseinnahmen deine eigenen Nutzungskosten aus.",
  },
  close: {
    title: "Zapf den Strom an",
    p1: "Du baust, schreibst und redest bereits über KI-Tools. Einen Empfehlungslink hinzuzufügen kostet nichts und dauert fünf Minuten. Einen Skill-Link an derselben Stelle zu platzieren verdoppelt dein Einkommen pro Nutzer.",
    p2: "Der Zinseszinseffekt - wiederkehrende Provisionen, steigender ARPU, Entwickler-zu-Entwickler-Kette - arbeitet umso mehr für dich, je öffentlicher du baust.",
    createCode: "Empfehlungscode erstellen",
    joinDiscord: "Discord beitreten",
    backToBlog: "Zurück zum Blog",
  },
};
