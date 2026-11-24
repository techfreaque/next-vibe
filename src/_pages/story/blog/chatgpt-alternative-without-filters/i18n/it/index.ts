import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "ChatGPT senza filtri: l’alternativa senza censura | {{appName}}",
    description:
      "Confronta le alternative a ChatGPT con meno rifiuti, tra cui {{appName}}, Venice, NanoGPT e app locali. Scopri modelli, limiti e opzioni di privacy.",
    category: "Guida",
    imageAlt: "{{appName}}: un'alternativa ChatGPT senza filtri",
    keywords:
      "ChatGPT alternativa, ChatGPT alternativa senza filtri, non censurato ChatGPT alternativa, ChatGPT senza restrizioni, non filtrate AI chat, non censurato AI, UncensoredLM, non censurato AI per la politica, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "7 min di lettura",
    title: "Alternative a ChatGPT con meno rifiuti",
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
    guideLink: "Leggi la guida a tutti i modelli senza censura",
  },
  privacy: {
    title: "Una chat AI senza filtri è privata?",
    intro: "Dipende dalla cartella. Ecco cosa succede, esattamente.",
    incognito:
      "Le chat in incognito restano nella memoria locale del tuo browser. La conversazione non viene salvata sui nostri server (i file generati restano salvati per un po' per motivi tecnici). Cancelli i dati del browser e spariscono.",
    transit:
      "Ogni messaggio passa comunque dal nostro server fino al fornitore del modello che scrive la risposta. Funziona così per qualsiasi AI ospitata online. Il consumo di crediti viene registrato per la fatturazione.",
    memory:
      "In incognito la memoria è spenta. La memoria persistente richiede un account gratuito e la cartella privata.",
    private:
      "Le chat private vengono salvate sul server e le vede solo il tuo account. Aprile da qualsiasi dispositivo su cui hai fatto l'accesso.",
    callout:
      "In breve: l'incognito tiene la tua cronologia fuori dai nostri server. Non nasconde i tuoi messaggi al modello che risponde.",
  },
  pricing: {
    title: "Quanto costa?",
    intro: "Crediti. Un solo saldo per tutti i modelli.",
    free: "Gratis: {{guestCredits}} crediti al mese senza account, {{freeCredits}} con un account gratuito, {{maxCredits}} con account e newsletter. Abbastanza per provare diversi modelli con le tue domande.",
    sub: "Piani mensili: quattro tagli, a partire da {{subCredits}} crediti per {{subPrice}}.",
    pack: "Pacchetti di crediti: una ricarica per gli abbonati, {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Carta, PayPal o cripto.",
    oneBalance:
      "Lo stesso saldo copre la generazione di immagini, video e musica, la voce in ingresso e in uscita e la ricerca web.",
    metered:
      "Ogni messaggio costa crediti in base al modello. I modelli Flash costano una frazione di un modello di punta. Ogni pagina modello mostra il prezzo.",
    link: "Vedi piani e pacchetti di crediti",
  },
  chatgptBetter: {
    title: "Quando conviene ChatGPT?",
    intro: "A volte. Ecco quando.",
    oneVendor:
      "Usi solo modelli OpenAI e non incappi mai in un rifiuto. Allora un fornitore, un'app e un abbonamento sono più semplici.",
    flatRate:
      "Vuoi un prezzo fisso e non pensare mai al costo per messaggio. I crediti si pagano a consumo, e l'uso quotidiano intenso dei modelli di punta si fa sentire.",
    firstFeatures:
      "Vuoi le novità di un laboratorio il giorno stesso del lancio. I laboratori spesso portano le nuove funzioni prima nelle proprie app.",
    wantFilter:
      "Vuoi il filtro. L'account di un minore o un ambiente di lavoro con regole rigide ha bisogno di paletti. Qui puoi restare sul livello mainstream, ma un prodotto blindato può andarti meglio.",
  },
  limits: {
    title: "Quali sono i contro?",
    intro: "Senza filtri ci sono dei compromessi. Conoscili prima di cambiare.",
    smaller:
      "La maggior parte dei modelli senza censura è più piccola dei modelli di punta. Diversi sono fatti per conversare e per la narrativa, non per analisi impegnative. UncensoredLM è fatto per risposte schiette, non per il codice. Nel ragionamento più difficile e nei lavori di codice lunghi vincono ancora i migliori modelli mainstream.",
    tools:
      "Non tutti i modelli senza censura supportano le chiamate agli strumenti. Controlla la pagina del modello prima di contare sulla ricerca web o su altri strumenti.",
    vendor:
      "I modelli mainstream conservano le misure di sicurezza del loro fornitore. Anche i modelli senza censura possono rifiutare una richiesta.",
    responsibility:
      "Verifica le informazioni importanti prima di condividere una risposta o di prendere una decisione basata su ciò che dice.",
  },
  faq: {
    filters: {
      q: "Posso disattivare le misure di sicurezza di GPT in un’alternativa a ChatGPT?",
      a: "Su {{appName}}, GPT mantiene le misure di sicurezza del suo fornitore. Se scegli un modello senza censura, risponde quell’altro modello, con il suo comportamento.",
    },
    title: "Domande frequenti",
    free: {
      q: "{{appName}} è gratis?",
      a: "Senza account: {{guestCredits}} crediti gratuiti al mese. Con un account gratuito: {{freeCredits}}. Con account e newsletter: {{maxCredits}}. Poi un piano, da {{subPrice}} al mese.",
    },
    account: {
      q: "Mi serve un account?",
      a: "No. La chat in incognito funziona senza. L'account serve per la memoria e per salvare le chat sul server.",
    },
    api: {
      q: "Posso usare questi modelli nei miei strumenti?",
      a: "Sì. Ogni piano a pagamento include un'API compatibile con OpenAI. Una chiave, tutti i modelli, compresi quelli senza censura.",
    },
    openSource: {
      q: "{{appName}} è open source?",
      a: "Sì. Il codice è open source con licenza MIT e GPL v3, e puoi far girare la tua istanza.",
    },
    apiLink: "Configura l'API nei tuoi strumenti di sviluppo",
    selfHostLink: "Avvia la tua istanza",
  },
  partners: {
    body: "Hai un canale, una newsletter o una community sull'AI? Il programma partner di {{appName}} ti paga una quota ricorrente su ogni pagamento che porti.",
    link: "Scopri il programma partner",
  },
  cta: {
    title: "Scegli un modello e inizia a chattare",
    subtitle:
      "Inizia senza registrarti con fino a {{guestCredits}} crediti gratuiti al mese.",
    chat: "Prova la chat AI senza censura",
    models: "Confronta tutti i modelli",
  },
};
