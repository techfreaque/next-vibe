import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un’alternativa a ChatGPT senza filtri | {{appName}}",
    description:
      "Cerchi ChatGPT senza filtri? Scopri quali protezioni mantiene GPT, confronta i modelli aperti e senza censura e prova un altro chatbot senza registrarti.",
    category: "Guida",
    imageAlt: "{{appName}}: un'alternativa ChatGPT senza filtri",
    keywords:
      "ChatGPT alternativa, ChatGPT alternativa senza filtri, non censurato ChatGPT alternativa, ChatGPT senza restrizioni, non filtrate AI chat, non censurato AI, UncensoredLM, non censurato AI per la politica, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "7 min lettura",
    title: "Un’alternativa a ChatGPT con modelli senza censura",
    subtitle:
      "Confronta i modelli più diffusi, aperti e senza censura su {{appName}}. Scopri cosa cambia nella chat quando passi a un altro modello e quanto costa ciascuna opzione.",
  },
  intro: {
    lead: "ChatGPT applica le misure di sicurezza di OpenAI. GPT le mantiene anche su {{appName}}. Per una chat con meno restrizioni puoi scegliere un altro modello, che può comunque rifiutare una richiesta o sbagliare.",
    p2: "Su {{appName}} puoi scegliere tra {{modelCount}} modelli di chat in tre categorie. Tutti usano lo stesso saldo di crediti.",
  },
  exists: {
    title: "Esiste un ChatGPT senza filtri?",
    p1: "ChatGPT applica le misure di sicurezza di OpenAI. Queste valgono anche quando scegli GPT su {{appName}}.",
    p2: "Per chattare con meno restrizioni, scegli un modello della categoria senza censura su {{appName}}. Puoi iniziare dal browser come ospite.",
  },
  tiers: {
    title: 'Cosa significa "senza filtri" in realtà?',
    intro: "Ogni modello ha un livello di contenuto. Ce ne sono tre.",
    mainstream:
      "Più diffusi ({{count}} modelli). Si applicano le misure di sicurezza del fornitore.",
    open: "Aperti ({{count}} modelli). I rifiuti variano a seconda del modello.",
    uncensored:
      "Senza censura ({{count}} modelli). La categoria raggruppa i modelli in base a come affrontano i temi delicati.",
    vendorRefusals:
      "Quando cambi modello su {{appName}}, scegli quale risponde. Continuano a valere le misure di sicurezza del modello che hai scelto.",
    twoKinds:
      "Alcuni modelli senza censura usano l’abliterazione o il fine-tuning per ridurre i rifiuti. UncensoredLM è stato addestrato su libri e documenti banditi dall’internet mainstream. Per questo esprime opinioni politiche fuori dal coro. Verifica le sue affermazioni consultando le tue fonti.",
    modelsLink: "Sfoglia ogni modello per livello di filtro",
  },
  switch: {
    title: "Posso cambiare i modelli nel bel mezzo di una chat?",
    intro: "Sì. Puoi scegliere un altro modello per il prossimo messaggio.",
    p1: "Se cambi modello durante una conversazione, la cronologia resta. Il nuovo modello può usare la parte che rientra nella sua finestra di contesto.",
    p2: "Puoi scrivere una bozza con un modello e chiedere a un altro di rivederla nella stessa chat.",
    caveat:
      "Ogni modello applica le proprie misure di sicurezza alla bozza e alla tua prossima richiesta.",
  },
  picks: {
    title: "Quale modello dovrei usare invece di ChatGPT?",
    intro:
      "Inizia dal lavoro. Ogni nome si collega alla pagina del modello con il prezzo e le specifiche.",
    builtUncensored: {
      title: "Politica e punti di vista",
      body: "UncensoredLM può offrire una prospettiva diversa su temi politici e controversi. Verifica le sue affermazioni con le tue fonti.",
    },
    everyday: {
      title: "Attività quotidiane",
      body: "Prova questi modelli per scrivere, programmare e analizzare informazioni.",
    },
    open: {
      title: "Modelli aperti per codice e ragionamento",
      body: "Prova questi modelli aperti per programmare o risolvere problemi. Confronta le risposte alla stessa domanda.",
    },
    unfiltered: {
      title: "Modelli senza censura per l’analisi",
      body: "Prova questi modelli per analisi, codice o testi lunghi. Possono comunque rifiutare una richiesta.",
    },
    fiction: {
      title: "Gioco di ruolo e narrativa dark",
      body: "Per una storia che prosegue nel tempo, confronta le finestre di contesto. Controlla anche se il modello può ricevere immagini.",
    },
    cheap: {
      title: "Modelli più economici",
      body: "Trovi il costo stimato nella scheda di ogni modello. Domande e risposte più lunghe possono consumare più crediti.",
    },
    compare:
      "Confronta le coppie disponibili per prezzo, finestra di contesto e funzionalità.",
    compareLink: "Confronta {{a}} con {{b}}",
    guideLink: "Leggi la guida di ogni modello non censurato",
  },
  privacy: {
    title: "Una chat AI non filtrata è privata?",
    intro: "Dipende dalla cartella. Ecco cosa succede.",
    incognito:
      "Incognito chat live nella memoria locale del tuo browser. La conversazione non viene salvata sui nostri server (i supporti generati vengono memorizzati temporaneamente per motivi tecnici). Cancellare i dati del browser ed è andato.",
    transit:
      "Ogni messaggio passa ancora attraverso il nostro server al fornitore di modelli che scrive la risposta. Ecco come funziona ogni AI ospitato. L'utilizzo del credito viene registrato in modo da fatturare funziona.",
    memory:
      "La memoria è spenta in incognito. La memoria persistente ha bisogno di un account gratuito e della cartella privata.",
    private:
      "Le chat private vengono salvate sul server e visibili solo sul tuo account. Apriteli da qualsiasi dispositivo in cui accedete.",
    callout:
      "Versione breve: incognito mantiene la tua storia fuori dai nostri server. Non nasconde i tuoi messaggi dal modello che li risponde.",
  },
  pricing: {
    title: "Quanto costa?",
    intro: "Crediti. Un saldo per ogni modello.",
    free: "Gratis: {{guestCredits}} accredita un mese senza un account, {{freeCredits}} con un account gratuito, {{maxCredits}} con un account e la newsletter. Abbastanza da provare diversi modelli sulle proprie richieste.",
    sub: "Piani mensili: quattro dimensioni, a partire dai crediti {{subCredits}} per {{subPrice}}.",
    pack: "Pacchetti per ricaricare i crediti dell’abbonamento. {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Paga con carta, PayPal o criptovalute.",
    oneBalance:
      "Lo stesso saldo copre l'immagine, la generazione di video e musica, l'ingresso vocale e l'output, e la ricerca web.",
    metered:
      "Ogni messaggio costa crediti in base al modello. I modelli Flash costano una frazione di un modello di frontiera. Ogni pagina modello mostra il prezzo.",
    link: "Vedi piani e pacchetti di credito",
  },
  chatgptBetter: {
    title: "Quando è ChatGPT la scelta migliore?",
    intro: "A volte. Ecco qua quando.",
    oneVendor:
      "Usa solo i modelli OpenAI e non colpisci mai un rifiuto. Poi un venditore, una app, un abbonamento è più semplice.",
    flatRate:
      "Si desidera una tassa piana e non si vuole mai pensare a costo per messaggio. I crediti sono misurati e l'uso quotidiano pesante dei modelli di frontiera aggiunge.",
    firstFeatures:
      "Si desidera che le nuove funzioni app di un laboratorio il giorno di lancio. I laboratori spesso spediscono nuove funzionalità nelle proprie app prima.",
    wantFilter:
      "Vuoi il filtro. Il conto di un bambino o un posto di lavoro con regole rigorose ha bisogno di guardrails. Potete rimanere sul livello principale qui, ma un prodotto bloccato può adattarsi meglio.",
  },
  limits: {
    title: "Quali sono i lati negativi?",
    intro:
      "Non filtrato viene fornito con i tradeoff. Conosceteli prima di passare.",
    smaller:
      "La maggior parte dei modelli non censurati sono più piccoli dei modelli di frontiera. Molti sono costruiti per la conversazione e la finzione, non l'analisi difficile. UncensoredLM è costruito per le risposte franche, non per il codice. Sul ragionamento più duro e lungo lavoro di codifica, i modelli principali top ancora vincere.",
    tools:
      "Non ogni modello non censurato supporta le chiamate degli strumenti. Controllare la pagina del modello prima di contare sulla ricerca web o altri strumenti.",
    vendor:
      "I modelli più diffusi conservano le misure di sicurezza del loro fornitore. Anche i modelli senza censura possono rifiutare una richiesta.",
    responsibility:
      "Verifica le informazioni importanti prima di condividere una risposta o di prendere una decisione basata su ciò che dice.",
  },
  faq: {
    filters: {
      q: "Posso disattivare le misure di sicurezza di GPT in un’alternativa a ChatGPT?",
      a: "Su {{appName}}, GPT mantiene le misure di sicurezza del suo fornitore. Se scegli un modello senza censura, risponde quell’altro modello, con il suo comportamento.",
    },
    title: "FAQ",
    free: {
      q: "{{appName}} è gratuito?",
      a: "Nessun conto: {{guestCredits}} crediti gratuiti al mese. Conto gratuito: {{freeCredits}}. Account + newsletter: {{maxCredits}}. Dopo di che: un piano, da {{subPrice}} al mese.",
    },
    account: {
      q: "Mi serve un conto?",
      a: "No. Incognito chat funziona senza uno. Hai bisogno di un account per la memoria e per le chat salvate sul server.",
    },
    api: {
      q: "Posso usare questi modelli nei miei strumenti?",
      a: "Si'. Ogni piano a pagamento include un OpenAI -compatibile API. Una chiave, ogni modello, quelle non censurate incluse.",
    },
    openSource: {
      q: "{{appName}} è open source?",
      a: "Si'. Il codice è open source sotto MIT e GPL v3, e si può eseguire la propria istanza.",
    },
    apiLink: "Impostare lo API nei tuoi strumenti di codifica",
    selfHostLink: "Eseguire la propria istanza",
  },
  partners: {
    body: "Eseguire un canale, newsletter o comunità su AI? Il programma partner {{appName}} paga una quota ricorrente di ogni pagamento che si riferisce.",
    link: "Vedere il programma partner",
  },
  cta: {
    title: "Scegli un modello e inizia a chattare",
    subtitle:
      "Inizia senza registrarti con fino a {{guestCredits}} crediti gratuiti al mese.",
    chat: "Prova la chat AI senza censura",
    models: "Confronta tutti i modelli",
  },
};
