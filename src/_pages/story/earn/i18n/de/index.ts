import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Verdienen mit {{appName}} - wiederkehrende Empfehlungsprovision",
    category: "Verdienen",
    description:
      "Empfiehl {{appName}} und erhalte {{directPct}} jeder Zahlung deiner Empfehlungen - wiederkehrend, solange sie zahlen. Veröffentliche einen Skill und erhalte {{skillBonusPct}} auf Nutzer, die andere darüber bringen.",
    imageAlt: "Verdienen mit {{appName}}",
    keywords:
      "{{appName}}, Empfehlungsprogramm, Affiliate, wiederkehrende Provision, KI-Skills, passives Einkommen",
  },
  hero: {
    eyebrow: "Verdienen",
    title: "Teile, was du nutzt. Kassiere jeden Monat.",
    subtitle:
      "{{directPct}} jeder Zahlung der Leute, die du mitbringst - nicht einmalig, sondern jeden Monat, den sie zahlen. Veröffentlichst du einen Skill, bekommst du {{skillBonusPct}}, wann immer andere ihn teilen.",
    ctaPrimary: "Link holen",
    ctaSecondary: "Skill bauen",
  },
  start: {
    label: "Von null an",
    title: "Drei Schritte. Ohne Reichweite.",
    intro:
      "Du musst kein Influencer sein. Ein Freund, der bleibt, zahlt dir jeden Monat, den er bleibt.",
    step1: {
      title: "Link holen",
      body: "Kostenloses Konto anlegen, Empfehlungsseite öffnen. Dein persönlicher Link steht in Sekunden.",
    },
    step2: {
      title: "Teilen - oder einen Skill teilen",
      body: "Link in den Chat, ins README, unters Video. Oder einen Skill veröffentlichen: Sein Share-Link trägt deine Empfehlung automatisch mit.",
    },
    step3: {
      title: "An jeder Zahlung verdienen",
      body: "{{directPct}} von allem, was sie zahlen, wiederkehrend. Bringt ein anderes Mitglied jemanden über deinen Skill, bekommst du {{skillBonusPct}} von diesem Nutzer.",
    },
  },
  split: {
    label: "Die Aufteilung",
    title: "Wohin jede Zahlung fließt",
    perUser: "Pro Nutzer bei {{examplePrice}}/Monat",
  },
  facts: {
    direct: "pro Empfehlung, wiederkehrend",
    skill: "als Skill-Ersteller, wenn andere teilen",
    payout: "Mindestauszahlung in Krypto",
    hours: "Bearbeitung der Krypto-Auszahlung",
    hoursValue: "{{cryptoPayoutHours}} Std.",
  },
  cta: {
    title: "Dein Link ist einen Klick entfernt.",
    subtitle:
      "Kostenloses Konto. Kein Mindestumsatz. Verdienste landen sofort als Credits - Auszahlung in BTC oder USDC ab {{minPayout}}.",
    primary: "Link holen",
    secondary: "Einsteiger-Guide lesen",
  },
};
