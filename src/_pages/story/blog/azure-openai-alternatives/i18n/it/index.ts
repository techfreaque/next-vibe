import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternativa senza censura ad Azure OpenAI: API a confronto | {{appName}}",
    description:
      "Azure filtra ogni modello di default e vieta i chatbot erotici e romantici anche senza filtri. Confronta {{appName}}, OpenRouter, Venice, NanoGPT, API abliterated, Bedrock, Vertex e self-hosting.",
    category: "Guida per sviluppatori",
    imageAlt: "Alternative senza censura ad Azure OpenAI, a confronto",
    keywords:
      "alternativa senza censura ad Azure OpenAI, alternativa ad Azure OpenAI, disattivare filtro contenuti Azure OpenAI, Azure OpenAI senza filtro contenuti, filtro contenuti modificato Azure, opt-out abuse monitoring Azure, Azure OpenAI NSFW, API LLM senza filtro contenuti, API LLM senza censura, API modelli abliterated, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida per sviluppatori",
    readTime: "10 min di lettura",
    title: "Alternative senza censura ad Azure OpenAI",
    subtitle:
      "I filtri di Azure, il suo vaglio di approvazione e il suo Code of Conduct, letti alla fonte. Poi {{count}} alternative, oneste su dove ciascuna vince. Verificato il {{date}}.",
  },
  intro: {
    lead: "Azure OpenAI filtra ogni modello di default. Per disattivare il filtro serve una richiesta approvata. E anche approvata, il Code of Conduct vieta comunque i chatbot erotici e romantici.",
    p2: "Se il tuo prodotto è narrativa, roleplay, companion, red-teaming o semplicemente risposte schiette, quello è un muro, non un'impostazione. Ecco cosa permette esattamente Azure, cosa lo sostituisce e la modifica al codice per spostare un client Azure OpenAI su {{appName}}.",
  },
  azure: {
    title: "Cosa filtra davvero Azure",
    intro: "Direttamente dalla documentazione e dalle policy di Microsoft.",
    defaults:
      "Attivo di default: Microsoft Foundry applica impostazioni di sicurezza predefinite a ogni modello tranne Whisper. Puoi allentarle da solo fino a High only.",
    approval:
      "Disattivabile solo con approvazione: le opzioni No filters e Annotate only richiedono l'approvazione per il filtro contenuti modificato. Possono fare richiesta solo i clienti gestiti da un account team Microsoft o in un programma idoneo.",
    conduct:
      "Disattivato non vuol dire permesso: il Code of Conduct vieta i contenuti sessualmente espliciti, inclusi quelli allusivi e a tema fetish, e proibisce i chatbot erotici, romantici o usati a fini erotici o romantici. Vietati anche violenza grafica, gore e incitamento all'odio.",
    monitoring:
      "Abuse monitoring: prompt e completamenti segnalati vanno di default a una revisione automatica, e al personale Microsoft quando serve. I dati stanno in un abuse monitoring store nella geografia della tua risorsa.",
    sunset:
      "Fine dell'opt-out: il changelog di Microsoft del 17 novembre 2026 dice che Modified Abuse Monitoring non sarà più disponibile per i modelli rilasciati dal 1 novembre 2026, a partire da una data ancora da annunciare.",
    models:
      "Nessun modello senza censura: nel catalogo non abbiamo trovato modelli abliterated o senza censura. Ci sono modelli DeepSeek e Llama, nessuno abliterated.",
    callout:
      "In sintesi: su Azure un'app di narrativa per adulti o di companion viola il Code of Conduct, qualunque siano le impostazioni del filtro.",
  },
  rules: {
    title:
      "Azure, Bedrock, Vertex e Together: cosa significa davvero disattivato",
    intro:
      "Ogni hyperscaler ti lascia abbassare un filtro da qualche parte. Nessuno cambia la policy d'uso e nessuno fornisce pesi senza censura.",
  },
  us: {
    title: "{{appName}}: modelli senza censura su un'API OpenAI e Anthropic",
    intro:
      "{{modelCount}} modelli di chat dietro una sola chiave, {{uncensored}} dei quali senza censura. Nessun livello di filtro sopra il modello che scegli.",
    models:
      "Modelli: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM e Qwen accanto a {{uncensored}} modelli senza censura. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, il risultato è un modello con opinioni politiche controcorrente.",
    formats:
      "Formati: OpenAI chat completions, l'API OpenAI Responses e l'API Anthropic Messages, più immagini, video, musica, voce e trascrizione con la stessa chiave.",
    consent:
      "Regole: i modelli senza censura si sbloccano dopo un consenso 18+ una tantum sul tuo account. Nessuna richiesta, nessun account team.",
    billing:
      "Fatturazione: un unico saldo di crediti, con il nostro ricarico del {{markup}}% su quanto paghiamo a monte. Qualsiasi piano da {{apiSubPrice}} al mese sblocca le chiavi API. Carta, PayPal o crypto.",
    limits:
      "Limiti: {{burst}} richieste al minuto e {{streams}} stream simultanei per chiave come tetto anti-abuso. I limiti di frequenza a monte passano così come sono.",
    weak: "Dove Azure ci batte: non abbiamo report SOC 2, BAA, SLA né scelta della regione. Ogni prompt passa da noi al provider che serve il modello. Il nostro ricarico del {{markup}}% ci rende più cari per token dei router abliterated qui sotto. E niente endpoint per embeddings.",
    before: "Prima: il client Azure OpenAI",
    after: "Dopo: lo stesso SDK, puntato su {{appName}}",
    codeNote:
      "Cambiano tre cose. AzureOpenAI diventa OpenAI con una base_url. Il nome del tuo deployment diventa un id di modello. E content_filter_results sparisce dalle risposte, perché non c'è nessun livello di filtro da riportare.",
    docsLink: "Docs API: endpoint, autenticazione e limiti",
    formatsLink: "API compatibile OpenAI e Anthropic, spiegata",
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
  prices: {
    title: "Prezzo per token, il nostro contro gli host più economici",
    intro:
      "Stessi pesi, host diversi. Non siamo i più economici per token. Paghi per una sola chiave che copre modelli senza censura, aperti e mainstream, più una chat web.",
  },
  list: {
    title: "Le alternative, una per una",
    intro:
      "Dalle loro pagine e dai loro elenchi di modelli, letti il {{date}}. Cos'è ciascuna, dove vince e il rovescio.",
  },
  stay: {
    title: "Quando restare su Azure",
    intro: "A volte il filtro è il prezzo delle carte che ti servono.",
    compliance:
      "Ti servono programmi di conformità, residenza regionale dei dati e un account team. Gli hyperscaler vendono questo. Bedrock, per esempio, elenca ISO, SOC, CSA STAR, idoneità HIPAA e FedRAMP High in GovCloud.",
    privacy:
      "Ti servono i termini sui dati di Microsoft: prompt e completamenti non sono disponibili a OpenAI e non vengono usati per addestrare modelli di base senza il tuo permesso.",
    sfw: "Il tuo prodotto è comunque adatto a tutti. Allora le impostazioni predefinite di Azure ti costano poco.",
    callout:
      "Molti team dividono il carico: Azure per il workload regolamentato, una seconda chiave per narrativa, roleplay, ricerca e red-teaming.",
  },
  faq: {
    title: "FAQ",
    off: {
      q: "Posso disattivare il filtro contenuti di Azure OpenAI?",
      a: "Solo con approvazione. I clienti possono allentare da soli i filtri fino a High only. No filters e Annotate only richiedono una richiesta approvata di filtro contenuti modificato, aperta ai clienti gestiti da un account team Microsoft o in un programma idoneo.",
    },
    nsfw: {
      q: "Azure OpenAI permette NSFW o app di companion con i filtri disattivati?",
      a: "No. Il Code of Conduct di Microsoft vieta i contenuti sessualmente espliciti e proibisce i chatbot erotici o romantici. Le impostazioni dei filtri non cambiano il Code of Conduct.",
    },
    monitoring: {
      q: "Posso ancora rifiutare l'abuse monitoring di Azure?",
      a: "I clienti approvati potevano. Il changelog di Microsoft del 17 novembre 2026 dice che Modified Abuse Monitoring non sarà più disponibile per i modelli rilasciati dal 1 novembre 2026, a partire da una data ancora da annunciare.",
    },
    best: {
      q: "Qual è la migliore alternativa senza censura ad Azure OpenAI?",
      a: "Token abliterated più economici: OpenUncensored o Refuseless. Enorme catalogo mainstream: OpenRouter. Modelli senza censura propri di Venice: Venice. Prompt che non lasciano mai le tue macchine: Ollama, LM Studio o vLLM. Modelli senza censura, aperti e mainstream più una chat di team su una sola chiave OpenAI e Anthropic: {{appName}}.",
    },
    sdk: {
      q: "Posso tenere il mio codice SDK Azure OpenAI?",
      a: "In gran parte sì. Sostituisci AzureOpenAI con OpenAI, imposta base_url e la tua chiave, e cambia il nome del deployment con un id di modello come {{example}}. Richieste e risposte mantengono la forma OpenAI.",
    },
    enterprise: {
      q: "{{appName}} offre SOC 2, un BAA o un SLA?",
      a: "No. Se ti servono, tieni il workload regolamentato su un hyperscaler e usa {{appName}} dove i filtri danno fastidio.",
    },
    apiLink: "API LLM senza censura: id dei modelli, codice e limiti",
    bedrockLink: "Alternative senza censura ad AWS Bedrock",
    openRouterLink: "Alternative a OpenRouter, a confronto",
    keysLink: "Gestisci le tue chiavi API",
  },
  cta: {
    title: "Stesso SDK. Nessun livello di filtro.",
    subtitle:
      "Prova prima i modelli in chat, {{guestCredits}} crediti gratuiti al mese, senza account. Poi collega l'API.",
    start: "Prova un modello senza censura",
    docs: "Leggi la documentazione API",
  },
};
