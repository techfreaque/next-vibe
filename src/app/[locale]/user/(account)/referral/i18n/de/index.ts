export const translations = {
  backToChat: "Zurück zum Chat",
  title: "Deine Empfehlungskette. Wiederkehrend. Für immer.",
  description:
    "Jemanden empfehlen → {{directPct}} jeder Zahlung, die er je macht. Skill veröffentlichen, über den er sich anmeldet → {{skillPct}} gesamt. Deren Empfehlungen bringen dir auch was, Ebene für Ebene. Kein Ablaufdatum. Kein Limit.",
  tagline: "Empfehlungen & Skills",

  hero: {
    directEarning: "Du verdienst",
    directLabel: "auf jede Zahlung",
    directNote: "von Personen, die du empfiehlst, für immer",
    bonusEarning: "Via Skill-Link",
    bonusNote: "direkt + Skill-Bonus, wiederkehrend für immer",
  },

  commissionTable: {
    perMonth: "/ Mon.",
    colLevel: "Wer verdient",
    colCut: "Anteil",
    alwaysYours: "immer deins",
    heroLabel: "auf jede Zahlung",
    heroSub: "Wiederkehrend. Für immer.",
    chainTitle: "10 Abonnenten. Was du pro Monat verdienst.",
    chainSubtitle:
      "Jede Ebene ist die Hälfte der darüberliegenden. Einmalig aufgebaut — zahlt für immer.",
    youLabel: "Du",
    whoLabels: [
      "Du - wer auch immer sie direkt empfohlen hat",
      "Skill-Ersteller (falls anders) oder dein Empfehler",
      "Der Empfehler des Empfehlers",
      "Ebene 4",
      "Ebene 5",
      "Ebene 6",
    ],
    colExample: "Beispiel ({{examplePrice}}/Monat)",
    tableNote:
      "Empfehlungslink: {{directPct}} pro Nutzer. Skill-Link: {{directPct}} direkt + {{skillBonusPct}} Skill-Bonus = {{skillPct}} pro Nutzer. Beides wiederkehrend, für immer.",
  },

  commission: {
    title: "Die Kette, Ebene für Ebene",
    subtitle:
      "Jede Zahlung deiner Empfehlungen fließt die Kette hoch. Du sitzt auf Ebene 1 - {{directPct}} für immer. Jede Ebene darüber verdient auch.",
    directTitle: "Direkte Provision",
    directAmount: "Immer {{directPct}}",
    directDesc:
      "Jedes Mal, wenn jemand, den du empfohlen hast, zahlt, kriegst du {{directPct}}. Keine Ausnahmen. Kein Ablauf.",
    bonusTitle: "Netzwerkeinnahmen",
    bonusAmount: "Bis zu {{uplinePct}} mehr",
    bonusDesc:
      "Deine Empfehlungen empfehlen andere - du verdienst auch einen Anteil. {{level2Pct}} von Ebene 2, {{level3Pct}} von Ebene 3, jede Ebene halbiert.",
    totalTitle: "Gesamtpotenzial",
    totalAmount: "Bis zu {{totalPct}}",
    totalDesc: "Wenn deine Empfehlungen auch andere empfehlen",
    levelsTitle: "Ebenenübersicht",
    level1: "Du empfiehlst jemanden → {{directPct}} seiner Zahlungen",
    level2: "Er empfiehlt jemanden → {{level2Pct}} dieser Zahlungen",
    level3: "Diese empfehlen andere → {{level3Pct}}",
    level4: "Und so weiter, bis zu {{maxUplineLevels}} Ebenen",
  },

  story: {
    title: "Wie die Kette wächst",
    subtitle:
      "Dieselben 10 Abonnenten. Jede Ebene, die aktiviert wird, addiert sich — für immer.",
    totalLabel: "Gesamt / Monat",
    addedLabel: "+{{amount}} von dieser Ebene",
    levelLabel: "Ebene {{n}} aktiv",
    level1Desc: "Deine 10 direkten Abonnenten. {{directPct}} von jedem.",
    level2Desc:
      "Deine Empfehlungen empfehlen jemanden. Du verdienst auch davon.",
    level3Desc: "Deren Empfehlungen empfehlen. Die Kette baut sich weiter.",
    level4Desc: "Vierte Ebene. Zahlt immer noch.",
    level5Desc: "Fünfte Ebene.",
    level6Desc: "Sechste Ebene. Jeder Cent, für immer.",
    noob: {
      label: "Einstieg",
      earning: "~{{story_noob_earning}}/Monat",
      desc: "{{story_noob_users}} zahlende Abonnenten über deinen Empfehlungslink. {{directPct}} von jedem - passives Einkommen aus einem einzigen Post.",
    },
    mid: {
      label: "Wachsendes Publikum",
      earning: "~{{story_mid_earning}}/Monat",
      desc: "{{story_mid_users}} Abonnenten - Mix aus Empfehlungs- und Skill-Links. Manche ihrer Freunde haben auch angemeldet. Die Kette baut sich von selbst.",
    },
    pro: {
      label: "Etablierter Creator",
      earning: "~{{story_pro_earning}}/Monat",
      desc: "{{story_pro_users}} Abonnenten über beide Wege, plus Upline-Einnahmen von deren Empfehlungen. Voll am Compoundieren.",
    },
  },

  overview: {
    title: "Deine Einnahmen",
    subtitle: "Live-Statistiken. Aktualisiert bei jeder Zahlung.",
  },

  howItWorks: {
    title: "So funktioniert's",
    step1Title: "Empfehlungscode erstellen",
    step1Body:
      "Einzigartige Codes für verschiedene Zielgruppen - Freunde, Discord, ein Blog-Beitrag. Jeder separat getrackt.",
    step2Title: "Link teilen",
    step2Body:
      "Empfehlungslink → {{directPct}} pro Nutzer, für immer. Skill-Link → {{skillPct}} pro Nutzer ({{directPct}} + {{skillBonusPct}} Skill-Bonus). Zwei Quellen, ein Link.",
    step3Title: "Bezahlt werden",
    step3Body:
      "Credits sind sofort da. Ab {{minPayout}} in BTC oder USDC auszahlen.",
  },

  manage: {
    createSubtitle: "Codes für bestimmte Kampagnen oder Zielgruppen erstellen.",
    codesSubtitle: "Performance und Einnahmen für jeden Code verfolgen.",
  },
  createCode: {
    title: "Empfehlungscode erstellen",
    create: "Code erstellen",
    creating: "Wird erstellt...",
  },
  myCodes: {
    title: "Deine Empfehlungscodes",
    loading: "Lädt...",
    error: "Codes konnten nicht geladen werden",
    empty: "Noch keine Codes. Ersten Code oben erstellen ↑",
    copy: "Link kopieren",
    copied: "Kopiert!",
    uses: "Nutzungen",
    signups: "Anmeldungen",
    revenue: "Umsatz",
    earnings: "Verdient",
    inactive: "Inaktiv",
  },
  stats: {
    loading: "Lädt...",
    error: "Statistiken konnten nicht geladen werden",
    totalSignups: "Anmeldungen gesamt",
    totalSignupsDesc: "Nutzer, die sich über deinen Code angemeldet haben",
    totalRevenue: "Generierter Umsatz",
    totalRevenueDesc: "Gesamter Abonnementwert aus deinen Empfehlungen",
    totalEarned: "Gesamt verdient",
    totalEarnedDesc: "Deine Provision über alle Empfehlungen",
    availableBalance: "Verfügbares Guthaben",
    availableBalanceDesc:
      "Für KI-Chats ausgeben - andere Credits zuerst. {{minPayout}} verdienen, um Auszahlung freizuschalten.",
  },
  cta: {
    title: "Konto erstellen und anfangen zu verdienen",
    description:
      "Empfehlungslink holen. {{directPct}} auf jede Zahlung - wiederkehrend, ohne Ablauf. Skill veröffentlichen und {{skillPct}} verdienen.",
    signUp: "Konto erstellen",
    logIn: "Anmelden",
    pitch1: "{{directPct}} Empfehlungsprovision - wiederkehrend, kein Ablauf",
    pitch2:
      "Skill veröffentlichen → {{skillPct}} von jedem, der sich darüber anmeldet",
    pitch3: "Credits sofort. BTC/USDC ab {{minPayout}} Minimum.",
  },
  payout: {
    title: "Einnahmen auszahlen",
    description: "Zwei Wege, das Verdiente zu nutzen",
    useAsCredits: "Als Chat-Guthaben nutzen",
    useAsCreditsDesc:
      "Sofort. Kein Minimum. Wird 1:1 in KI-Gesprächsguthaben umgewandelt.",
    cryptoPayout: "In Krypto auszahlen",
    cryptoPayoutDesc: "BTC oder USDC an deine Wallet-Adresse.",
    minimumNote:
      "Minimum: {{minPayout}}. Bearbeitung innerhalb von {{cryptoPayoutHours}} Stunden nach Genehmigung.",
  },
  audienceCallout: {
    title: "Zwei Wege zu verdienen",
    newTitle: "Empfehlungslink — {{directPct}} pro Nutzer",
    newBody:
      "Code teilen. Jeder, der sich anmeldet und zahlt, bringt dir {{directPct}} jeder Zahlung, jeden Monat, für immer. Einmal gepostet. Für immer verdient.",
    newCta: "Deinen Empfehlungslink holen",
    proTitle: "Skill-Link — {{skillPct}} pro Nutzer",
    proBody:
      "Skill bauen. Link teilen. Jeder, der sich darüber anmeldet, zahlt dir {{directPct}} direkt + {{skillBonusPct}} Skill-Bonus = {{skillPct}} pro Nutzer, wiederkehrend. Keine Follower nötig.",
    proCta: "Skill bauen",
  },
  discord: {
    title: "Tritt der Community bei",
    description:
      "Strategien teilen, Fragen stellen, mit anderen Verdienern connecten.",
    cta: "Discord beitreten",
  },
};
