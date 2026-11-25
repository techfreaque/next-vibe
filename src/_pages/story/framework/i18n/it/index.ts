import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Sviluppatori: framework next-vibe, API IA senza censura, MCP",
    description:
      "Scrivi un endpoint e ottieni interfaccia web, comando CLI, strumento MCP e strumento IA. Open source. Clona, installa, avvia. In più un'unica API compatibile con OpenAI e Anthropic per modelli mainstream e senza censura.",
    category: "Sviluppatori",
    imageAlt: "unbottled.ai per sviluppatori: API, MCP e self-hosting",
    keywords:
      "API IA senza censura, API compatibile OpenAI, API compatibile Anthropic, API modelli abliterated, API UncensoredLM, server MCP, IA self-hosted, next-vibe",
  },
  hero: {
    eyebrow: "Per sviluppatori",
    title: "Un solo definition.ts.",
    titleAccent: "Ogni interfaccia.",
    subtitle:
      "next-vibe è il framework TypeScript open source dietro {{appName}}. Scrivi un endpoint e ottieni interfaccia web, comando CLI, strumento MCP, strumento IA e altro. Stessa validazione, stessi tipi, zero codice di raccordo.",
    ctaFramework: "Guarda il pattern",
    ctaKeys: "Usa l'API",
    stats: {
      endpoints: "endpoint tipizzati nel repo",
      surfaces: "interfacce da una definizione",
      languages: "lingue, ogni testo tradotto",
      models: "modelli di chat, una chiave API",
    },
  },
  paths: {
    api: {
      label: "Chiama l'API",
      title: "{{modelCount}} modelli con una sola chiave",
      body: "Il tuo codice OpenAI o Anthropic, la nostra base URL. Modelli mainstream e senza censura con la stessa chiave.",
      link: "Quickstart",
    },
    selfHost: {
      label: "Self-hosting",
      title: "Fai girare l'intera piattaforma",
      body: "Open source. Clona, installa, avvia. Al resto pensa il browser.",
      link: "Installala",
    },
    framework: {
      label: "Costruisci sopra",
      title: "Una definizione, ogni interfaccia",
      body: "Scrivi un endpoint una volta. Ottieni interfaccia web, comando CLI, strumento MCP, strumento IA e altro.",
      link: "Guarda il pattern",
    },
  },
  quickstart: {
    eyebrow: "Quickstart",
    title: "Prima risposta in tre passi.",
    intro:
      "L'API parla OpenAI Chat Completions e Responses, e Anthropic Messages. Il tuo codice gira qui con tre modifiche: la base URL, la chiave e un id modello da `GET /v1/models`.",
    step1: {
      title: "Sblocca l'API e crea una chiave",
      description:
        "Qualsiasi piano da {{subPrice}} al mese la sblocca. Poi apri le chiavi API, dai un nome alla chiave e copiala. La vedi una volta sola.",
      ctaPlans: "Vedi i piani",
      ctaKeys: "Apri le chiavi API",
    },
    step2: {
      title: "Punta il tuo client su di noi",
      description:
        "I client OpenAI usano il primo URL. Claude Code e gli SDK Anthropic usano il secondo.",
      baseUrl: "Base URL OpenAI",
      baseUrlNote:
        "Nel percorso va bene qualsiasi locale. Cambia solo la lingua dei messaggi di errore.",
      anthropicBaseUrl: "Base URL Anthropic",
      anthropicNote:
        "Niente `/v1` alla fine: i client Anthropic aggiungono `/v1/messages` da soli.",
    },
    step3: {
      title: "Invia una richiesta",
      description:
        "Inserisci la tua chiave e lancia la richiesta. `{{model}}` è un id di modello. `GET /v1/models` elenca tutti gli id che la tua chiave può chiamare.",
      response: "Risposta di esempio",
    },
    agents: {
      title: "Gli agenti di coding funzionano subito",
      body: "Configurazioni testate, da copiare e incollare:",
      link: "Configurazioni per agenti di coding",
    },
    reference: "Riferimento API completo",
  },
  pricing: {
    eyebrow: "Prezzi",
    title: "Un piano la sblocca. Paghi a chiamata, in crediti.",
    intro:
      "Le stesse tariffe dell'app di chat. Nessun sovrapprezzo per l'API, nessun costo per utente, un solo saldo.",
    unlockTitle: "Sblocca l'API",
    unlockPlan: "Qualsiasi piano, da {{subPrice}} al mese",
    unlockGrant: "Crediti assegnati dal nostro team, come i crediti per tester",
    neverTitle: "Non la sblocca mai",
    never:
      "Il piano gratuito: quota mensile, bonus di registrazione e newsletter, guadagni da referral. Senza un piano o crediti assegnati, ogni chiamata `/v1` risponde 402 `paid_plan_required`.",
    billTitle: "Come si paga una chiamata",
    bill: "Costo del provider più il nostro ricarico, in crediti. `GET /v1/models` mostra per ogni modello i crediti per milione di token in input e in output. Ogni risposta riporta `usage.credits_charged`; in streaming serve `stream_options.include_usage`.",
    topup:
      "Ne vuoi di più? Gli abbonati ricaricano con pacchetti di crediti da {{packPrice}}. I crediti dei pacchetti non scadono mai.",
    facts: {
      credit: "1 credito = 1 centesimo di dollaro",
      rate: "{{rate}} richieste al minuto per chiave",
      keys: "Fino a {{maxKeys}} chiavi per account",
      preflight: "Crediti insufficienti: 402 prima che parta qualsiasi cosa",
    },
    modelsTitle: "Ogni prezzo arriva dall'API stessa",
    modelsResponse: "Risposta di esempio",
  },
  uncensored: {
    eyebrow: "Modelli senza censura",
    title: "Due modi di essere senza censura. Entrambi sull'API.",
    intro:
      "Quasi tutta l'IA senza censura è un modello mainstream con i rifiuti tagliati o eliminati con l'addestramento. Noi offriamo quelli, più uno addestrato in modo diverso fin dall'inizio. Scegli a ogni richiesta con l'id del modello.",
    abliterated: {
      label: "Abliterated e fine-tuned",
      title: "Modelli mainstream che smettono di schivare",
      body: "Rifiuti tagliati dai pesi o eliminati con l'addestramento. Stesse conoscenze, risposte dirette.",
    },
    worldview: {
      label: "Davvero senza censura",
      title: "Un modello con una sua visione del mondo",
      body: "{{model}} è addestrato su libri e documenti banditi dall'internet mainstream: il risultato è un modello con opinioni politiche controcorrente.",
    },
    more: "+{{count}} altri",
    consent:
      "Conferma una volta di avere 18 anni o più nella pagina delle chiavi API. Fino ad allora i modelli senza censura rispondono 403 `uncensored_consent_required` e non viene addebitato nulla.",
    allModels: "Tutti i modelli senza censura",
    catalog: "Sfoglia il catalogo dei modelli",
  },
  mcp: {
    eyebrow: "MCP e CLI",
    title: "Il tuo agente conosce già la tua app.",
    intro:
      "`bun i` scrive la configurazione MCP per Claude Code, Cursor, VS Code, OpenCode e Codex. Apri il repo nel tuo agente e gli strumenti sono già lì.",
    points: {
      stdio: "MCP via stdio. Nessun server in più, nessuna porta.",
      roles:
        "Stessi ruoli e stessa validazione dell'interfaccia web. I modelli arrivano solo dove il tuo ruolo lo consente.",
      connect:
        "Collega l'installazione al tuo account {{appName}} e i suoi agenti girano sui nostri modelli.",
      help: "Ogni comando si documenta da solo: `vibe <command> --help`.",
    },
    configNote:
      "La voce `atlas` che scrive `bun i`, accorciata. Il file vero contiene anche un server `hermes` e usa il percorso del tuo clone.",
  },
  selfHost: {
    eyebrow: "Self-hosting",
    title: "Fai girare tutto da te.",
    intro:
      "La piattaforma dietro {{appName}} è open source. Clona, installa, avvia. Poi ci pensa il browser. Niente Docker, niente file di configurazione.",
    terminal: "Terminale",
    db: "Postgres integrato (PGlite) di default. Quando non ti basta più, punta `DATABASE_URL` sul tuo Postgres.",
    guide: "Guida al self-hosting",
    github: "Codice su GitHub",
  },
  framework: {
    eyebrow: "Il framework",
    title: "Segui un endpoint.",
    intro:
      "Il modulo di contatto di questo repo, accorciato ma reale. Una sola definizione diventa interfaccia web, comando CLI, strumento MCP, schermata nativa, strumento IA e cron job. Il modulo vero lo trovi in fondo a questa pagina.",
    tabAdd: "Aggiungi il tuo",
    call: {
      title: "Chiamalo",
      cli: "CLI",
      mcp: "MCP",
      ai: "Strumento IA",
      cron: "Cron",
    },
    becomes: "Il modulo di contatto diventa",
    more: "Più altre {{count}} interfacce",
    source: "Sorgente completo su GitHub",
    live: "Provalo dal vivo qui sotto",
    docs: "Documentazione dei pattern su GitHub",
    deleteLine:
      "Una funzionalità è una cartella. Cancellala, lancia `vibe gen` e sparisce da tutte le interfacce in un colpo solo.",
    moreSurfaces: {
      webApi: "REST API",
      websocket: "Eventi WebSocket",
      adminPanel: "Pannello di amministrazione",
      vibeFrame: "Widget incorporabile",
    },
    surfaces: {
      web: {
        title: "Interfaccia web",
        body: "Il modulo in fondo a questa pagina. Campi, validazione e messaggio di conferma arrivano dalla definizione.",
      },
      cli: {
        title: "Comando CLI",
        body: "`vibe contact-form`, un flag per campo, help già incluso.",
      },
      mcp: {
        title: "Strumento MCP",
        body: "Gli agenti lo raggiungono tramite `vibe mcp` con lo strumento `execute-tool`. Lo schema di input arriva dritto da Zod.",
      },
      ai: {
        title: "Strumento IA",
        body: "I modelli possono chiamarlo. Con `requiresConfirmation` l'utente deve approvare prima.",
      },
      native: {
        title: "Schermata nativa",
        body: "L'app Expo mostra lo stesso widget con input nativi. Beta.",
      },
      cron: {
        title: "Cron job",
        body: "Ogni endpoint può girare a orari programmati. Stesso handler, nessun secondo percorso di codice.",
      },
    },
    maturity: {
      stable: {
        title: "In produzione",
        body: "{{appName}} gira su questo codice: web, CLI, MCP, strumenti IA, cron, realtime, pagamenti.",
      },
      beta: {
        title: "Beta",
        body: "Schermate React Native, sincronizzazione tra istanze e skill remote funzionano, ma con qualche spigolo.",
      },
      churn: {
        title: "Aspettati cambiamenti",
        body: "Un solo team, che va veloce. Ancora niente semver e la documentazione resta indietro rispetto al codice. Fissa un commit o fai un fork.",
      },
    },
  },
  faq: {
    title: "Le domande degli sviluppatori",
    free: {
      q: "Esiste un piano API gratuito?",
      a: "No. L'API si sblocca con qualsiasi piano, da {{subPrice}} al mese, oppure con crediti assegnati dal nostro team. La quota gratuita della chat non la sblocca.",
    },
    sdks: {
      q: "Quali SDK e strumenti funzionano?",
      a: "Gli SDK ufficiali di OpenAI e Anthropic, qualsiasi libreria compatibile con OpenAI e agenti di coding come Claude Code, Codex CLI, OpenCode, Aider, Cline e Continue. Cambi la base URL e la chiave.",
    },
    price: {
      q: "Quanto costa una chiamata?",
      a: "In crediti. Un credito vale un centesimo di dollaro. Ogni modello ha una tariffa in crediti per milione di token in input e in output, elencata in `GET /v1/models`. Ogni risposta riporta `usage.credits_charged` (in streaming con `stream_options.include_usage`), così sai sempre quanto ti è costata una chiamata.",
    },
    uncensored: {
      q: "Posso chiamare i modelli senza censura via API?",
      a: "Sì. Conferma una volta nella pagina delle chiavi API di avere almeno 18 anni, poi li chiami come qualsiasi altro modello. I modelli abliterated e UncensoredLM usano gli stessi endpoint.",
    },
    media: {
      q: "Anche immagini, voce, video e musica?",
      a: "Stessa chiave. `/v1/images`, `/v1/audio`, `/v1/videos` e `/v1/music` seguono i formati OpenAI dove esistono. Il riferimento API copre ogni endpoint.",
    },
    limits: {
      q: "Quali sono i limiti di frequenza?",
      a: "{{rate}} richieste al minuto per chiave di default. Oltre il limite ricevi HTTP 429 con un header `Retry-After`. Ti serve più throughput? Usa il modulo di contatto qui sotto.",
    },
    selfHost: {
      q: "Il self-hosting è gratis?",
      a: "Sì. Il codice è open source: MIT per l'app, GPL v3 per il framework. Usa le tue chiavi dei provider, oppure collega l'installazione al tuo account {{appName}} e paghi solo quello che usi.",
    },
    docker: {
      q: "Mi servono Docker o un server di database?",
      a: "No. Il database di default è Postgres integrato (PGlite). Più avanti passi a un Postgres completo cambiando `DATABASE_URL`.",
    },
  },
  contact: {
    eyebrow: "L'endpoint, dal vivo",
    title: "Domande, o stai costruendo qualcosa di grosso?",
    description:
      "Configurazione, integrazioni su misura, revisione dell'architettura. Ti risponde il team che l'ha costruito. Questo modulo è l'endpoint di contatto della sezione sul framework.",
  },
  code: {
    copy: "Copia",
    copied: "Copiato",
    wrap: "A capo",
    anthropic: "Anthropic",
  },
};
