import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    group: {
      uncensoredAi: "Uncensored.ai (Uncensored LM)",
      zai: "Z.AI (GLM)",
      moonshot: "Moonshot (Kimi)",
      deepseek: "DeepSeek",
      venice: "Venice",
      xai: "xAI (Grok)",
      anthropic: "Anthropic (Claude)",
      openai: "OpenAI (GPT)",
      google: "Google (Gemini)",
      otherChat: "Altri modelli chat",
      image: "Generazione immagini",
      video: "Generazione video",
      music: "Generazione musica",
      voice: "Voce (TTS + STT)",
      tools: "Strumenti (ricerca, recupero, memoria)",
      unattributed: "Non attribuito",
    },
  },
  post: {
    titleShort: "Spesa per modello",
    title: "Crediti spesi per famiglia di modelli",
    description:
      "Crediti spesi per intervallo su un gruppo: modelli chat per produttore (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, altri), immagini, video, musica, voce, strumenti. Tutti gli utenti inclusi, i gruppi sommano alla spesa totale. In crediti.",
    fields: {
      resolution: { label: "Risoluzione", description: "Tempo di calcolo" },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      group: {
        label: "Gruppo",
        description:
          "Famiglia di modelli (chat per produttore) o gruppo media / strumenti",
      },
      result: {
        label: "Crediti spesi",
        description: "Serie di tempo di uscita",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
    },
    success: {
      title: "Serie calcolata",
      description: "Serie temporale restituita",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso all'amministratore richiesto",
      },
      server: { title: "Errore del server", description: "Query fallito" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      validation: {
        title: "Convalida fallita",
        description: "Parametri della richiesta non validi",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Account o sessione non trovati",
      },
      conflict: { title: "Conflitto", description: "Conflitto" },
      network: {
        title: "Errore di rete",
        description: "La richiesta di rete è fallita",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Salvare le modifiche prima",
      },
    },
  },
};
