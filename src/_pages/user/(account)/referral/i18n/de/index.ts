import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  backToChat: "Zurück zum Chat",
  title: "Link teilen. {{directPct}} von jeder Zahlung. Für immer.",
  description:
    "Wer sich über deinen Link anmeldet, bringt dir {{directPct}} jeder Zahlung. Kein Ablaufdatum, keine Obergrenze. Veröffentlichst du einen Skill, bekommst du {{skillBonusPct}} auf Nutzer, die andere darüber bringen.",
  tagline: "Empfehlungen & Skills",

  hero: {
    directEarning: "Du verdienst",
    directNote: "von Personen, die du empfiehlst, für immer",
    bonusEarning: "Als Skill-Ersteller",
    bonusNote: "wenn andere deinen Skill teilen, für immer",
  },

  commissionTable: {
    youLabel: "Du",
    perMonth: "/ Mon.",
    colLevel: "Wer verdient",
    colCut: "Anteil",
    alwaysYours: "immer deins",
    heroLabel: "auf jede Zahlung",
    heroSub: "Wiederkehrend. Für immer.",
    chainTitle: "10 Abonnenten. Was du pro Monat verdienst.",
    chainSubtitle:
      "Jede Ebene ist die Hälfte der darüberliegenden. Einmalig aufgebaut - zahlt für immer.",
    whoLabel0: "Du - wer auch immer sie direkt empfohlen hat",
    whoLabel1: "Skill-Ersteller (falls anders) oder dein Empfehler",
    whoLabel2: "Der Empfehler des Empfehlers",
    whoLabel3: "Ebene 4",
    whoLabel4: "Ebene 5",
    whoLabel5: "Ebene 6",
    tableNote:
      "Empfehlungslink: {{directPct}} pro Nutzer. Dein Skill, von anderen geteilt: {{skillBonusPct}} pro Nutzer. Beides wiederkehrend, für immer.",
  },

  story: {
    title: "Wie die Kette wächst",
    subtitle:
      "Dieselben 10 Abonnenten. Jede Ebene, die aktiviert wird, addiert sich - für immer.",
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
      "Empfehlungslink → {{directPct}} pro Nutzer, für immer. Dein Skill, von anderen geteilt → {{skillBonusPct}} pro Nutzer. Zwei Quellen, null Mehraufwand.",
    step3Title: "Bezahlt werden",
    step3Body:
      "Einnahmen werden {{holdDays}} Tage nach jeder Zahlung freigegeben - die Rückerstattungsfrist. Dann als Credits nutzen oder ab {{minPayout}} in BTC/USDC auszahlen.",
  },

  manage: {
    codesSubtitle: "Link kopieren, teilen, mitverdienen.",
  },
  myCodes: {
    title: "Deine Links",
  },
  cta: {
    title: "Konto erstellen und anfangen zu verdienen",
    description:
      "Empfehlungslink holen. {{directPct}} auf jede Zahlung - wiederkehrend, ohne Ablauf. Skill veröffentlichen und {{skillBonusPct}} verdienen, wenn andere ihn teilen.",
    signUp: "Konto erstellen",
    logIn: "Anmelden",
    pitch1: "{{directPct}} Empfehlungsprovision - wiederkehrend, kein Ablauf",
    pitch2:
      "Skill veröffentlichen → {{skillBonusPct}} von jedem, den andere darüber bringen",
    pitch3:
      "Freigabe {{holdDays}} Tage nach Zahlung. BTC/USDC ab {{minPayout}}.",
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
    newTitle: "Empfehlungslink - {{directPct}} pro Nutzer",
    newBody:
      "Code teilen. Jeder, der sich anmeldet und zahlt, bringt dir {{directPct}} jeder Zahlung, jeden Monat, für immer. Einmal gepostet. Für immer verdient.",
    newCta: "Deinen Empfehlungslink holen",
    proTitle: "Skill-Ersteller - {{skillBonusPct}} pro Nutzer",
    proBody:
      "Skill bauen. Link teilen. Jeder, der sich über deinen eigenen Link anmeldet, zahlt dir {{directPct}}, wiederkehrend. Der Hebel: Teilt jemand anderes deinen Skill mit seinem Link, gehören dir als Skill-Autor trotzdem {{skillBonusPct}}. Die Plattform trackt Skill-Autorenschaft - passive Attribution ohne extra Aufwand.",
    proCta: "Skill bauen",
  },
  discord: {
    title: "Tritt der Community bei",
    description:
      "Strategien teilen, Fragen stellen, mit anderen Verdienern connecten.",
    cta: "Discord beitreten",
  },
};
