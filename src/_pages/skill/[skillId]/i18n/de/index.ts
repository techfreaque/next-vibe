import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "KI-Skills",
    keywords: "KI-Skill, {{name}}, {{appName}}, unzensierter KI-Chat",
  },
  breadcrumb: {
    skills: "Skills",
  },
  hero: {
    tryGeneric: "Diesen Skill testen",
  },
  publishedBy: "Veröffentlicht von {{name}}",
  madeBy: "Von {{name}}",
  startChat: "Chat starten",
  chatWith: "Mit {{name}} chatten",
  guest: "Ohne Anmeldung",
  chatModel: "Chatmodell",
  facts: {
    runsOn: "Läuft auf",
    content: "Inhalte",
    perMessage: "Pro Nachricht",
    versions: "Versionen",
    goodAt: "Stark bei",
    keepInMind: "Gut zu wissen",
  },
  prompts: {
    intro:
      "Jede öffnet den Chat mit {{name}}, fertig getippt und bereit zum Senden.",
    start: "Starte mit einer dieser Nachrichten",
  },
  story: {
    title: "Über {{name}}",
  },
  model: {
    credits: "{{cost}} Credits",
    creditsAbout: "~{{cost}} Credits",
    fixedPrice: "{{cost}} Credits pro Nachricht",
    estimatedPrice: "Ca. {{cost}} Credits pro Nachricht",
    free: "Kostenlos pro Nachricht",
    perMessageHint:
      "Typische Nachricht: {{input}} Tokens rein, {{output}} raus. Variiert mit der Länge.",
    perMessageWithImageHint:
      "Typische Nachricht: {{input}} Tokens rein, {{output}} raus, ein Bild. Variiert mit der Länge.",
  },
  actions: {
    shareEarn: "Teilen & verdienen",
    addToSkills: "Zu meinen Skills",
    added: "In deinen Skills",
    addFailed: "Hat nicht geklappt. Nochmal",
  },
  tier: {
    mainstream:
      "{{name}} läuft auf {{model}}, einem Modell großer Anbieter mit eigenen Sicherheitsfiltern. Heikle Anfragen lehnt es mitunter ab.",
    open: "{{name}} läuft auf {{model}}, einem Open-Weight-Modell mit leichteren Filtern. Es diskutiert mehr und verweigert seltener als die Bots der großen Anbieter.",
    uncensored:
      "{{name}} läuft auf {{model}}, gebaut für Gespräche ohne Themenfilter. Einmalige Altersbestätigung (18+) vor der ersten Nachricht.",
    ownWorldview:
      "{{model}} ist mit Büchern und Dokumenten trainiert, die im Mainstream-Internet verbannt sind. {{name}} liefert politische Positionen gegen den Mainstream. Einmalige Altersbestätigung (18+) vor der ersten Nachricht.",
    abliterated:
      "{{model}} ist ein Mainstream-Modell ohne Verweigerungsreflex. {{name}} antwortet, statt zu belehren. Einmalige Altersbestätigung (18+) vor der ersten Nachricht.",
    fineTuned:
      "{{model}} ist so nachtrainiert, dass die üblichen Verweigerungen wegfallen. {{name}} antwortet dort, wo Mainstream-Bots ausweichen. Einmalige Altersbestätigung (18+) vor der ersten Nachricht.",
  },
  share: {
    text: "Kennst du jemanden, dem {{name}} gefällt? Teile den Link und verdiene an seinen Ausgaben mit.",
  },
  related: {
    similar: "Ähnliche Skills",
    moreFrom: "Mehr von {{name}}",
  },
};
