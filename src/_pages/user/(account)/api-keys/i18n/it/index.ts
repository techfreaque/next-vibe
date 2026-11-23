import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "chiavi API",
  metaTitle: "Tasti API: {{appName}}",
  description:
    "Una chiave, modelli {{modelCount}}. Formati OpenAI e Anthropic, fatturati dai tuoi crediti.",
  unauthenticated: {
    title: "Accedi per gestire le chiavi API",
    subtitle:
      "Le chiavi appartengono al tuo account. Accedi, scegli qualsiasi piano da {{subPrice}} al mese e crea la tua prima chiave in pochi secondi.",
    point1: "Modelli {{modelCount}} dietro un endpoint compatibile OpenAI",
    point2:
      "Funziona in Claude Code, Codex, OpenCode, Cline e qualsiasi OpenAI SDK",
    point3: "Stesso prezzo della chat. Nessuna legge API separata.",
    logIn: "Accedi",
    signUp: "Crea account",
    docs: "Leggi i documenti API prima",
  },
};
