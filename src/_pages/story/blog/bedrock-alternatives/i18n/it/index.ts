import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternativa senza censura ad AWS Bedrock: API a confronto | {{appName}}",
    description:
      "I Guardrail di Bedrock sono opzionali, ma rifiuti e policy AWS restano. Custom Model Import per pesi abliterated contro {{appName}}, OpenRouter e Venice.",
    category: "Guida per sviluppatori",
    imageAlt: "Alternative senza censura ad AWS Bedrock, a confronto",
    keywords:
      "alternativa senza censura ad AWS Bedrock, alternativa a Bedrock, Bedrock senza guardrails, Bedrock Custom Model Import abliterated, modello senza censura Bedrock, alternativa a Claude su Bedrock, alternativa all'API Bedrock Converse, API Anthropic Messages, API LLM senza censura, API modelli abliterated, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida per sviluppatori",
    readTime: "8 min di lettura",
    title: "Alternative senza censura ad AWS Bedrock",
    subtitle:
      "Guardrail, rifiuti, policy AWS e Custom Model Import, letti alla fonte. Poi {{count}} alternative. Verificato il {{date}}.",
  },
  intro: {
    lead: "Bedrock non ti impone un filtro. Senza Guardrail, Bedrock non ne aggiunge. Il modello rifiuta comunque, la policy AWS vale ancora e il catalogo non ha pesi senza censura.",
    p2: "Quindi la vera domanda è dove girano i modelli abliterated e quanto costa il passaggio. Ecco i fatti dalla documentazione AWS, la via Custom Model Import e la modifica al codice per chi usa Claude su Bedrock e passa a {{appName}}.",
  },
  bedrock: {
    title: "Cosa filtra Bedrock, e cosa no",
    intro: "Direttamente dalla documentazione e dalla policy di AWS.",
    guardrails:
      "I Guardrail sono opt-in: girano solo se passi un ID e una versione di guardrail nella chiamata.",
    refusals:
      "Senza Guardrail non significa senza censura: i modelli sono serviti come li consegnano i loro autori, quindi Claude, Llama e gli altri mantengono i rifiuti appresi.",
    csam: "Sempre attivo: il rilevamento automatico di CSAM su immagini in input e output può bloccare una richiesta con HTTP 400.",
    policy:
      "Policy: la AWS Responsible AI Policy vieta di usare il servizio per aggirare intenzionalmente i filtri di sicurezza, oltre a disinformazione, immagini sessuali non consensuali e danni ai minori.",
    retention:
      "Rilevamento abusi: AWS può conservare o esaminare input e output in casi limitati. Claude Fable 5, 5.1 e 5.2 conservano tutto il traffico fino a 30 giorni, i modelli OpenAI diversi da gpt-oss conservano il traffico segnalato fino a 30 giorni. I model provider non ricevono nulla.",
    models:
      "Nessun peso senza censura: il catalogo ha DeepSeek, Llama, Qwen, Mistral, gpt-oss, Kimi, GLM, MiniMax, Gemma e Nemotron. Nessuno abliterated.",
  },
  import: {
    title: "Porta i tuoi pesi abliterated: Custom Model Import",
    intro:
      "Bedrock può ospitare i pesi che carichi. È l'unico modo per farci girare un modello abliterated.",
    architectures:
      "Architetture supportate: Mistral, Mixtral, Flan, Llama 2 fino a 3.3, GPTBigCode, da Qwen2 a Qwen3 e gpt-oss 20B e 120B. Un Llama, Qwen o gpt-oss abliterated va bene.",
    excluded:
      "Non supportate: le architetture DeepSeek V3, Kimi e GLM. Gli import Qwen3 non supportano l'API Converse.",
    format:
      "Limiti: safetensors di Hugging Face, sotto i 200 GB per i modelli di testo, contesto sotto i 128K, nessuna inferenza batch. Regioni: eu-central-1, us-east-1, us-east-2, us-west-2.",
    cost: "Costo: $0.05718 per Custom Model Unit al minuto in US East e Oregon, fatturato a finestre di 5 minuti, più $1.95 al mese di storage per unità. Francoforte costa $0.07144 al minuto.",
    callout:
      "Paghi la capacità del modello al minuto, non al token. E la policy AWS contro l'elusione dei filtri di sicurezza copre comunque il tuo account.",
  },
  prices: {
    title: "I prezzi dei modelli aperti di Bedrock",
    intro:
      "Livello standard, US East, per 1M di token, input / output. Solo pesi standard.",
    list: "DeepSeek v3.2 $0.62 / $1.85. Qwen3 Next 80B A3B $0.15 / $1.20. Mistral Large 3 $0.50 / $1.50. Kimi K2.5 $0.60 / $3.00. GLM 5 $1.00 / $3.20. GLM 4.7 Flash $0.07 / $0.40.",
    oursTitle: "Pesi senza censura altrove, per token",
    oursIntro:
      "I modelli abliterated che Bedrock non ha, i nostri contro gli host più economici.",
  },
  apis: {
    title: "Converse contro i formati OpenAI e Anthropic",
    intro:
      "Bedrock parla InvokeModel e Converse su bedrock-runtime, e aggiunge Messages, Chat Completions e Responses sul suo endpoint bedrock-mantle. Noi parliamo OpenAI chat completions, l'API Responses e Anthropic Messages su una sola base URL con una sola chiave.",
    claude:
      "Per chi usa Claude su Bedrock significa che l'SDK Anthropic continua a funzionare. Sostituisci il client Bedrock con quello standard, imposta la base URL e la chiave. Claude Code prende la stessa base URL come ANTHROPIC_BASE_URL.",
    before: "Prima: Claude tramite il client Bedrock",
    after: "Dopo: la stessa chiamata Messages su {{appName}}",
    swap: "Stesso codice, qualsiasi modello: metti {{uncensoredExample}} nel campo model e la chiamata va a un modello senza censura.",
    converse:
      "Oggi sei su Converse? Passa una volta all'SDK OpenAI o Anthropic e ogni gateway di questa pagina, noi compresi, è a una modifica di base URL.",
  },
  rules: {
    title: "Bedrock, Azure, Vertex e Together a confronto diretto",
    intro:
      "Ogni hyperscaler ti lascia abbassare un filtro da qualche parte. Nessuno cambia la policy d'uso e nessuno fornisce pesi senza censura.",
  },
  us: {
    title: "{{appName}}: modelli senza censura senza importare pesi",
    intro:
      "{{modelCount}} modelli di chat dietro una sola chiave, {{uncensored}} dei quali senza censura. Paghi per token, niente minuti di capacità.",
    models:
      "Modelli: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM e Qwen accanto a {{uncensored}} modelli senza censura, tra cui GLM, DeepSeek e Kimi abliterated che Custom Model Import non può accettare. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, il risultato è un modello con opinioni politiche controcorrente.",
    formats:
      "Formati: OpenAI chat completions, l'API Responses e Anthropic Messages, più immagini, video, musica, voce e trascrizione.",
    consent:
      "Regole: i modelli senza censura si sbloccano dopo un consenso 18+ una tantum sul tuo account.",
    billing:
      "Fatturazione: un unico saldo di crediti, con il nostro ricarico del {{markup}}% su quanto paghiamo a monte. Qualsiasi piano da {{apiSubPrice}} al mese sblocca le chiavi API.",
    weak: "Dove Bedrock ci batte: IAM, VPC, regioni, una fattura AWS, ISO, SOC, CSA STAR, idoneità HIPAA e FedRAMP High in GovCloud. Non abbiamo report SOC 2, BAA, SLA né scelta della regione, e ogni prompt passa da noi al provider che serve il modello.",
    docsLink: "Docs API: endpoint, autenticazione e limiti",
    toolsLink: "Una sola chiave in Claude Code, Codex CLI, Aider e altri",
  },
  models: {
    title: "{{apiUncensored}} modelli senza censura nell'API oggi",
    intro:
      "Ogni modello senza censura che puoi chiamare, con l'id da passare in model. Dal più economico.",
    colModel: "Modello",
    colId: "ID API",
    colContext: "Contesto",
    colPrice: "Per messaggio",
  },
  list: {
    title: "Le alternative, una per una",
    intro:
      "Dalle loro pagine e dai loro elenchi di modelli, letti il {{date}}. Cos'è ciascuna, dove vince e il rovescio.",
  },
  stay: {
    title: "Quando restare su Bedrock",
    intro:
      "Se il tuo workload vive in AWS, la questione del filtro può essere la minore.",
    compliance:
      "Ti servono l'ambito di conformità, i controlli IAM e VPC e un'unica fattura AWS.",
    retention:
      "Ti serve zero retention per Region: la modalità di retention none di Bedrock, impostata via API.",
    weights:
      "Il tuo modello abliterated è un Llama, Qwen o gpt-oss e un traffico costante giustifica pagare minuti di capacità.",
    callout:
      "Molti team dividono il carico: Bedrock per la produzione dentro AWS, una seconda chiave per narrativa, roleplay, ricerca e red-teaming.",
  },
  faq: {
    title: "FAQ",
    guardrails: {
      q: "Bedrock filtra i contenuti senza Guardrail?",
      a: "Bedrock non aggiunge alcun livello di filtro se non colleghi un Guardrail, tranne il rilevamento automatico di CSAM sulle immagini. I modelli mantengono i propri rifiuti appresi e la AWS Responsible AI Policy vale ancora.",
    },
    uncensored: {
      q: "Bedrock ha modelli senza censura o abliterated?",
      a: "Non nel suo catalogo. L'unica via è Custom Model Import dei tuoi pesi, per architetture supportate come Llama, Qwen e gpt-oss.",
    },
    cost: {
      q: "Quanto costa Custom Model Import?",
      a: "$0.05718 per Custom Model Unit al minuto in US East e Oregon, fatturato a finestre di 5 minuti, più $1.95 al mese di storage per unità. Paghi la capacità, non il token.",
    },
    claude: {
      q: "Posso spostare il codice Claude su Bedrock senza riscriverlo?",
      a: "Sì. Sostituisci AnthropicBedrock con il client Anthropic standard, imposta base_url sulla base URL di {{appName}} senza /v1, usa la tua chiave e il nostro id di modello. Richiesta e risposta Messages mantengono la forma.",
    },
    converse: {
      q: "{{appName}} supporta l'API Bedrock Converse?",
      a: "No. Parliamo OpenAI chat completions, l'API Responses e Anthropic Messages. Una volta lasciato Converse, ogni provider compatibile OpenAI o Anthropic è a una modifica di base URL.",
    },
    enterprise: {
      q: "{{appName}} offre SOC 2, un BAA o un SLA?",
      a: "No. Se ti servono, tieni il workload regolamentato su Bedrock e usa {{appName}} dove i rifiuti danno fastidio.",
    },
    apiLink: "API LLM senza censura: id dei modelli, codice e limiti",
    azureLink: "Alternative senza censura ad Azure OpenAI",
    openRouterLink: "Alternative a OpenRouter, a confronto",
    keysLink: "Gestisci le tue chiavi API",
  },
  cta: {
    title: "Niente minuti di capacità. Nessun riflesso di rifiuto.",
    subtitle:
      "Prova prima i modelli in chat, {{guestCredits}} crediti gratuiti al mese, senza account. Poi punta il tuo SDK all'API.",
    start: "Prova un modello senza censura",
    docs: "Leggi la documentazione API",
  },
};
