import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}}: {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "Skill IA",
    keywords: "skill IA, {{name}}, {{appName}}, chat IA senza censura",
  },
  breadcrumb: {
    skills: "Skill",
  },
  hero: {
    tryGeneric: "Prova questa skill",
  },
  publishedBy: "Pubblicata da {{name}}",
  madeBy: "Di {{name}}",
  startChat: "Inizia la chat",
  chatWith: "Chatta con {{name}}",
  guest: "Nessuna registrazione",
  chatModel: "Modello di chat",
  facts: {
    runsOn: "Gira su",
    content: "Contenuti",
    perMessage: "Per messaggio",
    versions: "Versioni",
    goodAt: "Punto forte",
    keepInMind: "Da sapere",
  },
  prompts: {
    intro: "Ognuno apre la chat con {{name}}, già scritto e pronto da inviare.",
    start: "Inizia con uno di questi",
  },
  story: {
    title: "Chi è {{name}}",
  },
  model: {
    credits: "{{cost}} crediti",
    creditsAbout: "~{{cost}} crediti",
    fixedPrice: "{{cost}} crediti per messaggio",
    estimatedPrice: "Circa {{cost}} crediti per messaggio",
    free: "Messaggi gratis",
    perMessageHint:
      "Messaggio tipico: {{input}} token in entrata, {{output}} in uscita. Varia con la lunghezza.",
    perMessageWithImageHint:
      "Messaggio tipico: {{input}} token in entrata, {{output}} in uscita, un'immagine. Varia con la lunghezza.",
  },
  actions: {
    shareEarn: "Condividi e guadagna",
    addToSkills: "Aggiungi alle mie skill",
    added: "Aggiunta alle tue skill",
    addFailed: "Non riuscito. Riprova",
  },
  tier: {
    mainstream:
      "{{name}} gira su {{model}}, un modello dei grandi laboratori con i propri filtri di sicurezza. Le richieste delicate possono essere rifiutate.",
    open: "{{name}} gira su {{model}}, un modello open-weight con filtri più leggeri. Affronta più temi e rifiuta meno dei bot dei grandi laboratori.",
    uncensored:
      "{{name}} gira su {{model}}, pensato per conversare senza filtri sui temi. Verifica 18+ una sola volta prima del primo messaggio.",
    ownWorldview:
      "{{model}} è addestrato su libri e documenti banditi dall'internet mainstream. {{name}} ti dà opinioni politiche controcorrente. Verifica 18+ una sola volta prima del primo messaggio.",
    abliterated:
      "{{model}} è un modello mainstream senza il riflesso del rifiuto. {{name}} risponde invece di farti la predica. Verifica 18+ una sola volta prima del primo messaggio.",
    fineTuned:
      "{{model}} è riaddestrato per eliminare i soliti rifiuti. {{name}} risponde dove i bot mainstream si tirano indietro. Verifica 18+ una sola volta prima del primo messaggio.",
  },
  share: {
    text: "Conosci qualcuno a cui piacerebbe {{name}}? Condividi il link e guadagna su quello che spende.",
  },
  related: {
    similar: "Skill simili",
    moreFrom: "Altro da {{name}}",
  },
};
