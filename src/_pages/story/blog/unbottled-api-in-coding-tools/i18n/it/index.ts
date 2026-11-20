import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Codex CLI e Claude Code su ogni modello - {{appName}} API",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider e Cline su una chiave {{appName}}. Claude, GPT, DeepSeek, GLM e modelli non censurati. Una base URL, un comando per strumento.",
    category: "Guida agli sviluppatori",
    imageAlt: "{{appName}} API strumenti di codifica interni",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, OpenAI compatibile API, Responses API, Anthropic Messages API, agente di codifica, modelli non censurati, fornitore personalizzato",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida agli sviluppatori",
    readTime: "8 minuti di lettura",
    title: "Una chiave per tutti i modelli, anche con Codex e Claude Code.",
    subtitle:
      "Codex CLI e Claude Code ora si connettono a {{appName}} direttamente, accanto a OpenCode, Continue, Aider e Cline. Una base URL, una chiave, un comando per strumento.",
  },
  intro: {
    lead: "Il tuo agente di codifica e' chiuso a un unico fornitore. Vuoi una seconda opinione da un altro laboratorio, un modello più economico per il lavoro grunto, o un modello che non rifiuta? Significa un altro account, un'altra chiave, un'altra bolletta.",
    p2: "{{appName}} parla tutti e tre i formati che codificano gli agenti utilizzano: completamento della chat OpenAI, OpenAI Responses API e Anthropic Messages API. Niente da installare tra di loro. Puntare uno strumento una volta, quindi passare tra Claude, GPT, DeepSeek, GLM, Kimi, Qwen e i modelli non censurati cambiando un id modello.",
    access:
      "Prima di iniziare: la API ha bisogno di un conto a pagamento. Qualsiasi piano, da {{subPrice}} al mese, lo sblocca. I crediti gratuiti e bonus non lo fanno.",
    accessLink: "Sblocca lo API",
  },
  why: {
    title: "Perché preoccuparsi",
    oneKey:
      "Una chiave, un saldo. Nessun account separato a Anthropic, OpenAI, DeepSeek, Moonshot e Z.ai.",
    uncensored:
      "Modelli non censurati nel tuo editor. Ricerca di sicurezza, richieste red-team, strumenti di finzione, dati che viaggia filtri mainstream. Scegli il livello del filtro, non il venditore.",
    switch:
      "Modello giusto per compito. Un modello di frontiera per il refattore duro, un modello flash per rinominare e testare l'impalcatura. Stessa configurazione, diverso id.",
    billing:
      "Stessi crediti dell'app chat, stessi prezzi. Ogni risposta riporta quanto costa.",
  },
  setup: {
    title: "Ottieni una chiave e una base URL",
    intro:
      "Due valori. Ogni strumento qui sotto ha bisogno esattamente di questi.",
    p1: "Creare una chiave in Impostazioni > API chiavi. Inizia con sk-unb- e viene mostrato una volta.",
    shortcut:
      "Percorso più veloce: subito dopo aver creato una chiave, la pagina dei tasti API mostra ogni blocco sottostante con la chiave già riempita. Scegli il tuo strumento, copia, scappa.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "Per gli strumenti di stile OpenAI: Codex, OpenCode, Continue, Aider, Cline. Il locale nel percorso cambia solo la lingua dei messaggi di errore.",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "Per gli SDK Claude Code e Anthropic. Stesso URL senza /v1: aggiungono /v1/messages stessi.",
    p2: "Mantenere la chiave in una variabile di ambiente, mai in un file che si impegna. La chiamata curl dimostra le opere chiave e elenca ogni modello id che il tuo account può chiamare, con dimensione del contesto, supporto degli strumenti e prezzi di credito.",
  },
  compat: {
    title: "Ogni strumento si collega direttamente",
    intro:
      "Gli agenti di codifica parlano tre diversi formati di filo. Serviamo tutti e tre, sulla stessa chiave e gli stessi modelli.",
    codex: "Codex CLI: OpenAI Responses API.",
    claudeCode: "Claude Code: API Anthropic Messages.",
    chat: "OpenCode, Continue, Aider, Cline: completamento chat OpenAI.",
    other:
      "Qualsiasi altra cosa con un campo base URL funziona allo stesso modo: base URL, chiave, modello id.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Completamenti di chat",
  },
  codex: {
    intro:
      "Agente terminale di OpenAI. Legge il tuo repo, esegue comandi, modifica i file.",
    p1: "Codex parla le risposte API, e anche noi. L'unico comando definisce l'inline del provider: nulla da modificare, niente da installare. Per l'uso quotidiano, aggiungere una volta la configurazione e avviare Codex con il profilo.",
    p2: 'Interruttore modelli con -m o la linea modello nel profilo. Mantenere wire_api = "risponse": il Codex corrente non accetta nient\'altro.',
  },
  claudeCode: {
    intro:
      "Agente terminale di Anthropic. Piani, modifiche, esegue i test, i subagenti delle uova.",
    p1: "Claude Code legge il suo gateway dalle variabili di ambiente. ANTHROPIC_BASE_URL è la base URL senza /v1. ANTHROPIC_MODEL imposta il modello principale. Le impostazioni predefinite OPUS e SONNET coprono il modello di picker e la modalità di pianificazione, il default HAIKU muove i lavori di sfondo come i titoli di sessione a un modello economico, e CLAUDE_CODE_SUBAGENT_MODEL copre i sottoagenti. CLAUDE_CODE_MAX_CONTEXT_TOKENS dice a Claude Code la dimensione reale del contesto di un modello non Claude, quindi si compatta al punto giusto.",
    p2: "Vuoi Claude? Getta le linee del modello. Claude Code chiede i suoi soliti id Claude e li inoltriamo al nostro modello Claude corrispondente, fatturato in crediti.",
    p3: "Claude Code invia un grande prompt del sistema, oltre 30k gettoni di ingresso anche per un compito banale. Un modello predefinito a buon mercato mantiene questo conveniente.",
  },
  opencode: {
    intro: "Agente terminale open-source con TUI e modalità run senza testa.",
    p1: "Salvare la configurazione come opencode.json nel vostro progetto, o come ~/.config/opencode/opencode.json per ogni progetto. La chiave rimane nel vostro ambiente. Aggiungi qualsiasi id da GET /v1/models alla mappa dei modelli, quindi scegline uno con /modelli nella TUI.",
    gotcha:
      "Aggiorna OpenCode prima. Old 1.0.x costruisce tirare il pacchetto più nuovo @ai-sdk/openai-compatibile e crash dopo la prima chiamata strumento con DecimalError: argomento Invalid. 1.19.5 esegue la stessa configurazione pulita.",
  },
  continue: {
    intro:
      "Assistente di codifica per il codice VS e JetBrains, oltre al cn CLI.",
    p1: "UNBOTTLED_API_KEY si risolve dal vostro ambiente. Aggiungi -p con un prompt per una corsa senza testa. L'estensione IDE legge ~/.continua/config.yaml: metti la stessa voce del modello lì.",
  },
  aider: {
    intro: "Abbina la programmazione nel tuo terminale, commessa inclusa.",
    p1: "Un comando, nessun file di configurazione. Aider vuole openai/ di fronte al modello id e lo spoglia prima che ci chiama. --edit-format diff mantiene le modifiche piccole; senza esso Aider cade indietro a resending interi file per ids modello non lo sa. Nominare i file da modificare sulla riga di comando, come al solito con Aider.",
  },
  cline: {
    intro: "Autonomo agente di codifica, in codice VS e come CLI.",
    p1: "Due comandi con Cline CLI: salvare il provider una volta, quindi eseguire cline. Base URL, chiave e modello id sono gli stessi tre valori di ovunque altro.",
  },
  models: {
    title: "Quale modello per quale lavoro",
    intro:
      "Tutti questi strumenti di chiamata, che gli agenti hanno bisogno. Ids sono ciò che va nella configurazione.",
    strong: {
      title: "Problemi duri",
      body: "Grandi refattori, codebases non familiari, debug multi-step. Più alti prezzi di credito, meno giri sbagliati.",
    },
    cheap: {
      title: "A buon mercato e veloce",
      body: "Rinominazioni, test, caldaia, lavori di fondo. Una frazione del prezzo di un modello di frontiera. Buon default per gli agenti che inviano grossi prompt.",
    },
    uncensored: {
      title: "Senza censura",
      body: "Stesso flusso di lavoro dell'agente, nessun riflesso di rifiuto. Analisi esplosiva, strumenti a red-team, oleodotti di finzione per adulti, raschietti altri modelli di lezione. Rimani responsabile di quello che costruisci.",
    },
    listNote:
      "Ids cambiano come i modelli vengono sostituiti. GET /v1/models è la fonte della verità: se un id non è elencato per la chiave, lo API restituisce 404 model_not_found. La mappatura è per Claude Code: i suoi ids Claude integrati vanno alla nostra nuova Claude della stessa famiglia.",
  },
  gotchas: {
    title: "Abbiamo colpito",
    intro: "Quindi non devi farlo.",
    localeUrl:
      "Copiare la base URL esattamente, /api/ <locale> /v1 incluso. Senza il locale si ottiene un reindirizzamento che alcuni clienti cadere. Senza /api si ottiene una pagina HTML invece di JSON.",
    anthropicUrl:
      "Claude Code ottiene la base URL senza /v1. Con /v1 chiama /v1/v1/messages e ottiene un 404.",
    modelId:
      "Utilizzare l'ID esatto da GET /v1/models, come {{model}}. Aider vuole openai/davanti. Gli ids Claude incorporati di Claude Code sono mappati per voi alla nostra nuova Claude della stessa famiglia. Qualsiasi altro id sconosciuto restituisce 404 model_not_found.",
    paid: "HTTP 402 con paid_plan_required significa che l'account non ha ancora alcun piano e nessun acquisto di credito. Qualsiasi piano lo risolve.",
    tools:
      "Un modello senza supporto per utensili restituisce 400 tools_not_supported una volta che l'agente invia strumenti. Controllare supports_tools in GET /v1/models.",
    rateLimit:
      "Ogni chiave consente 60 richieste al minuto. Gli agenti licenziano molte piccole chiamate. Se si colpisce 429, dare all'agente la propria chiave.",
  },
  cta: {
    title: "Filato in un unico comando.",
    subtitle:
      "Creare una chiave, copiare il blocco per il vostro strumento, scegliere un modello. I documenti API coprono ogni punto finale, campo, codice di errore e dettaglio di streaming.",
    key: "Creare una chiave API",
    docs: "Leggi i documenti API",
  },
};
