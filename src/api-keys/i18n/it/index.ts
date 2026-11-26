import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Account",

  widget: {
    adminOverview:
      "Gestisci le chiavi del tuo account. Consulta la documentazione API per collegare un’app.",
    loadFailed: "Impossibile caricare le chiavi API",
    retry: "Riprova",
    revokeNamed: "Revoca {{name}}",
    revokeConfirm:
      "Le app che usano questa chiave perderanno subito l’accesso.",
    cancel: "Annulla",
    upgradeTitle:
      "L'accesso API viene fornito con ogni piano, da {{subPrice}} al mese",
    upgradeBody:
      "Qualsiasi piano sblocca le chiavi API. I crediti gratuiti e bonus non lo fanno.",
    upgradeCta: "Sblocca lo API",
    createInactiveHint: "Scegli un piano per creare le chiavi.",
    docsLink: "Leggi i documenti API",
    back: "Indietro",
    loading: "Caricamento chiavi API...",
    intro:
      "Chiama i modelli {{modelCount}} dal tuo codice e dal tuo agente di codifica. Formati OpenAI e Anthropic. Fatturato contro i vostri crediti allo stesso prezzo della chat.",
    baseUrlTitle: "Base URL",
    baseUrlHint: "SDK OpenAI, Codex, OpenCode, Continua, Aider, Cline.",
    anthropicBaseUrlTitle: "Anthropic base URL",
    anthropicBaseUrlHint:
      "Codice Claude e SDK Anthropic. Stesso URL senza /v1: aggiungono /v1/messages stessi.",
    setupTitle: "Collegare uno strumento",
    setupKeyFilled:
      "La tua nuova chiave è già in ogni blocco. Ricevuto, incolla, corri. Dopo che l'hai licenziata, i blocchi tornano al portiere.",
    setupKeyMissing:
      "I blocchi mostrano {{placeholder}}. Creare una chiave e si riempiono di esso.",
    copy: "Copia",
    copied: "Affrontato",
    keysTitle: "Le tue chiavi",
    empty: "No API chiavi ancora",
    emptyHint: "Creane uno per iniziare a chiamare API.",
    nameLabel: "Nome chiave",
    namePlaceholder: "ad esempio. Claude Codice portatile",
    create: "Creare chiave",
    creating: "Creare...",
    createFailed: "Non ho potuto creare la chiave. Riprova.",
    newKeyTitle: "Copia la chiave ora",
    newKeyHint:
      "Questa è l'unica volta che viene mostrata la chiave completa. Memorizziamo un hash, non la chiave. Perderlo e dovete crearne uno nuovo.",
    dismiss: "L'ho salvata.",
    lastUsed: "Ultimo uso",
    neverUsed: "Mai usato",
    created: "Creato",
    revoke: "Votazioni",
    revoking: "Rispondendo...",
    revokeFailed: "Non posso revocare quella chiave. Riprova.",
    maskedKey: "{{prefix}}…",
    meta: "{{lastUsed}} · Creato {{created}} · {{rate}}",
    rateLimit: "{{n}} req/min",
    uncensoredLabel:
      "Consenti l’uso di modelli senza censura con le mie chiavi",
    uncensoredHint:
      "Sono 18+ e accetto che i modelli non censurati possono produrre contenuti offensivi, falsi, pericolosi, illegali o maligni, non filtrati. Sono responsabile di come lo uso. Senza questo, modello non censurato ids restituire HTTP 403.",
    uncensoredFailed: "Impossibile salvare. Riprova.",
    billingNote:
      "Di crediti restituisce HTTP 402. Lo streaming funziona su ogni punto finale.",
  },

  codingTools: {
    blocks: {
      oneCommand: "Un comando",
      config: "Configurazione permanente",
      run: "Allora comincia.",
      fields: "Impostazioni",
      check: "Controlla la tua chiave",
      request: "Prima richiesta",
    },
    tested: "Testato con {{name}} {{version}}",
    anyModel:
      "Swap {{model}} per qualsiasi id di GET /v1/models, come {{examples}}.",
    tools: {
      codex: {
        hint: "Incollare il comando e Codex corre su unbottled.ai. Per tenerlo, appendete il blocco a ~/.codex/config.toml e avviate Codex con --profile nonbottled.",
      },
      claudeCode: {
        hint: "Incolla il comando e il codice Claude viene eseguito su unbottled.ai. Per tenerlo, mettere gli stessi valori nel blocco inv di ~/.claude/settings.json, accanto a quello che è già lì. Getta le linee di modello e Claude Code corre sui nostri modelli Claude sotto i nomi che già conosce.",
      },
      opencode: {
        hint: "Salva come opencode.json nel tuo progetto, o come ~/.config/opencode/opencode.json per ogni progetto. Aggiungi qualsiasi modello id alla mappa dei modelli.",
      },
      continue: {
        hint: "Esegue il Continua CLI. L'estensione IDE legge ~/.continua/config.yaml: aggiungere la stessa voce del modello lì.",
      },
      aider: {
        hint: "Un comando. Aider vuole openai/ di fronte al modello id. Nominare i file da modificare dopo il comando, come al solito.",
      },
      cline: {
        hint: "Due comandi con Cline CLI: salvare il provider una volta, quindi eseguire cline.",
      },
      openaiCompatible: {
        hint: "Qualsiasi strumento o SDK con un campo base URL. Gli strumenti OpenAI -style prendono il /v1 URL. Gli strumenti Anthropic -style prendono lo URL senza /v1. Stessa chiave, stessi modelli.",
      },
      curl: {
        hint: "Dimostrare le opere chiave e elencare ogni modello id si può chiamare. Poi invia una prima richiesta.",
      },
    },
  },

  list: {
    title: "chiavi API",
    titleShort: "chiavi API",
    description:
      "Creare e revocare le chiavi API. Mostra gli URL di base, le configurazioni pronte per la codifica degli strumenti e delle chiavi.",
    tag: "API",
    response: {
      baseUrl: "Base URL",
      isPaid: "Piano a pagamento",
      keys: "Chiavi",
    },
    success: {
      title: "Tasti API caricati",
      description: "Le chiavi API sono state recuperate",
    },
  },

  create: {
    title: "Creare la chiave API",
    titleShort: "Nuova chiave",
    description:
      "Creare una chiave per la API. Funziona con i client OpenAI e Anthropic. La chiave completa viene restituita una volta.",
    tag: "API",
    form: {
      name: "Nome chiave",
      namePlaceholder: "A cosa serve questa chiave?",
    },
    response: {
      key: "Chiave API (mostra una volta)",
      id: "Chiave ID",
      keyPrefix: "Prefisso chiave",
    },
    success: {
      title: "Chiave creata",
      description: "Ricevuto. Non verrà riprodotta.",
    },
    errors: {
      limit: "Hai già chiavi attive {{max}}. Rivolgine uno per primo.",
      paidRequired:
        "Le chiavi API hanno bisogno di un conto a pagamento: qualsiasi piano, da {{subPrice}} al mese. Aggiungine uno a {{url}}.",
    },
  },

  revoke: {
    title: "Revoke chiave API",
    titleShort: "Votazioni",
    description:
      "Disattivare permanentemente una chiave API. Le chiamate che lo utilizzano falliscono subito.",
    tag: "API",
    response: {
      message:
        "La chiave revocata. Le chiamate che lo utilizzano ora falliscono.",
    },
    success: {
      title: "Chiave revocata",
      description: "La chiave API non può più essere utilizzata",
    },
    errors: {
      notFound: {
        detail: "Non c'è una chiave attiva con quella ID sul tuo account.",
      },
    },
  },

  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Richiesta non valida",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    server: {
      title: "Errore del server",
      description: "Errore del server interno",
      detail: "La richiesta di chiave API non è riuscita: {{error}}",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    forbidden: { title: "Accesso negato", description: "Accesso negato" },
    notFound: {
      title: "Account o sessione non trovati",
      description: "API chiave non trovata",
    },
    conflict: {
      title: "Conflitto",
      description: "Richiedi conflitti con lo stato",
    },
  },
};
