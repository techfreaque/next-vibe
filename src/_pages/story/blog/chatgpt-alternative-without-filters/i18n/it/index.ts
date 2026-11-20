import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Un’alternativa a ChatGPT senza filtri | {{appName}}",
    description:
      "Un'alternativa ChatGPT non filtrata: i modelli {{modelCount}} dal mainstream al non censurato. Scegli il livello di filtro per chat. Libero di iniziare, nessun conto.",
    category: "Guida",
    imageAlt: "{{appName}}: un'alternativa ChatGPT senza filtri",
    keywords:
      "ChatGPT alternativa, ChatGPT alternativa senza filtri, non censurato ChatGPT alternativa, ChatGPT senza restrizioni, non filtrate AI chat, non censurato AI, UncensoredLM, non censurato AI per la politica, {{appName}}, Claude, GPT, Gemini, DeepSeek, Venice",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "7 min lettura",
    title: "Un’alternativa a ChatGPT senza filtri. Il livello lo scegli tu.",
    subtitle:
      "Claude, GPT e Gemini accanto ai modelli aperti e senza censura, tutti nella stessa chat su {{appName}}. Cosa cambia, cosa resta e quanto costa.",
  },
  intro: {
    lead: "Hai fatto una domanda normale. ChatGPT ha risposto con un disclaimer, una conferenza o un no educato. Un dettaglio medico, una scena del romanzo del crimine, una questione di sicurezza, una presa politica al di fuori del consenso. Il rifiuto è una decisione politica, presa per voi prima di scrivere una parola.",
    p2: "Ecco com’è un’alternativa senza filtri su {{appName}}: {{modelCount}} modelli, tre livelli di filtro, un solo saldo. Ci sono due tipi di modelli senza censura: quelli tradizionali modificati per ridurre i rifiuti e uno con una visione del mondo propria. Vediamo cosa funziona, quali sono i limiti e quando conviene ancora ChatGPT.",
  },
  exists: {
    title: "C'è uno ChatGPT senza filtri?",
    p1: "Non da OpenAI. I modelli GPT seguono le politiche di utilizzo di OpenAI ovunque tu li gestisca. Claude e Gemini seguono le regole dei propri fornitori. Qualsiasi applicazione che prometta un GPT non filtrato è eccessivamente venduto.",
    p2: "{{appName}} gestisce i modelli mainstream e, nella stessa chat, si aprono modelli con filtri leggeri e modelli non censurati senza filtro. La maggior parte di questi sono modelli mainstream con i rifiuti tagliati. Uno, UncensoredLM, ha una sua visione del mondo. Decidi tu quale risposta.",
  },
  tiers: {
    title: 'Cosa significa "senza filtri" in realtà?',
    intro: "Ogni modello ha un livello di contenuto. Ce ne sono tre.",
    mainstream:
      "Mainstream (modelli {{count}}): Claude, GPT, Gemini, Mistral. Filtri di sicurezza Big-lab. Rifiutano argomenti sensibili.",
    open: "Open (modelli {{count}}): DeepSeek, Kimi, GLM, Qwen, Grok, MiniMax e altro ancora. Filtri leggeri. Si occupano della maggior parte degli argomenti edgy.",
    uncensored:
      "Uncensored (modelli {{count}}), due tipi. Costruzioni non censurate di GLM, Qwen, Gemma e DeepSeek, più Venice: modelli tradizionali con i rifiuti tagliati, stessa visione del mondo. E UncensoredLM: addestrato su libri e documenti vietati da internet mainstream, la sua visione del mondo. Nessun filtro. Hai stabilito i limiti.",
    vendorRefusals:
      "Anche i modelli di Mainstream mantengono i filtri del loro fornitore. GPT su {{appName}} rifiuta ciò che GPT rifiuta ovunque. La differenza è ciò che siede accanto ad esso.",
    twoKinds:
      "L'incensore viene in due tipi. La maggior parte è iniziata come un modello mainstream o aperto e ha avuto il riflesso di rifiuto tagliato fuori, da abliteration o una fine-tune decensoring. Smettono di dire di no. I loro dati di formazione e il loro soggiorno di visione del mondo: sulla politica rispondono al modo in cui il modello di base lo vede, proprio senza il dodge, e nella finzione scura possono ammorbidire la scena. Sbloccato, non cambiato. UncensoredLM è l'altro tipo. Uncensored.ai lo forma su libri e documenti vietati da internet mainstream. Il risultato è una visione del mondo diversa: la politica prende quella corsa contro il mainstream, nessuna lezione, nessun nudge indietro alla linea di consenso.",
    modelsLink: "Sfoglia ogni modello per livello di filtro",
  },
  switch: {
    title: "Posso cambiare i modelli nel bel mezzo di una chat?",
    intro: "Si'. Scegli il modello per messaggio, non per account.",
    p1: "Avviare un filo con Claude. Colpisci un rifiuto. Scegli un modello non censurato e invia il messaggio successivo. Il filo mantiene la sua storia, e il nuovo modello legge tutto.",
    p2: "Funziona anche dall'altra parte. Progetto con un modello non censurato, poi consegnare il risultato ad un modello di frontiera per la struttura e la lucidatura.",
    caveat:
      "Il filtro vive nel modello, non nel filo. Un modello mainstream che legge una bozza non censurata può ancora rifiutarsi di continuare.",
  },
  picks: {
    title: "Quale modello dovrei usare invece di ChatGPT?",
    intro:
      "Inizia dal lavoro. Ogni nome si collega alla pagina del modello con il prezzo e le specifiche.",
    builtUncensored: {
      title:
        "Politica, altri punti di vista, dark roleplay: la sua visione del mondo",
      body: "UncensoredLM è l'unico modello qui che non è un modello mainstream sbloccato. Ha una sua visione del mondo. Le domande politiche e controverse prendono il mainstream non vi darà. I punti di vista eterodossi si discutono in pieno. Il gioco di ruolo scuro e tabù rimane buio. Niente moralizzazioni, niente di nuovo al consenso. La cattura: contesto 32K, solo testo, non per codice, e si dichiara contestato rivendicazioni come chiaramente come quelli risolti. Controlla i fatti che ti dà.",
    },
    everyday: {
      title: "Lavori quotidiani, filtri tradizionali",
      body: "Scrittura, ricerca, codice, analisi. La partita più vicina a ChatGPT, con lo stesso tipo di filtri.",
    },
    open: {
      title: "Smart, meno rifiuti",
      body: "Modelli aperti forti con filtri leggeri. Rispondono la maggior parte di ciò che un modello mainstream si schiude e tenere su codice e ragionamento.",
    },
    unfiltered: {
      title: "Nessun rifiuto, vero ragionamento",
      body: "I colpi pesanti tra i modelli bloccati dal rifiuto. Modelli di base forti con i rifiuti rimossi: codice, analisi e lunga scrittura su argomenti altri modelli bandiera. Stessa formazione, stessa visione del mondo, quindi per le prese politiche contro l'inizio mainstream con UncensoredLM.",
    },
    fiction: {
      title: "Recitare un ruolo e una fantasia oscura",
      body: "UncensoredLM porta a scene scure e tabù: il suo materiale formativo si trova al di fuori del consenso sicuro, quindi nulla ammorbidisce la storia. Venice Role Gioca per lunghe campagne (128K contesto) e input immagine. Venice Uncensored come il basso costo all-rounder.",
    },
    cheap: {
      title: "A buon mercato e veloce",
      body: "Alto volume ad un prezzo basso. Tre modelli flash bloccati dal rifiuto, più Claude Haiku per quando un filtro va bene.",
    },
    compare:
      "Torn tra due? Mettere il prezzo, la finestra di contesto e le capacità fianco a fianco. Inizia con UncensoredLM contro il modello di ChatGPT, contro Venice Role Play e contro un flagship limitato al rifiuto.",
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
      "Modelli a monte mantengono i propri rifiuti. Se Claude dice di no, cambiare modelli invece di discutere con esso.",
    responsibility:
      "Nessun filtro significa nessuna rete di sicurezza. Ciò che si genera e pubblica è su di voi, e la legge in cui vivete ancora applica.",
  },
  faq: {
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
    title: "Scegli il tuo filtro. Fai la tua domanda.",
    subtitle:
      "Crediti gratuiti {{guestCredits}} al mese, nessun account necessario. Mainstream, aperto o non censurato: passare in qualsiasi momento.",
    chat: "Avviare una chat non filtrata",
    models: "Confronta tutti i modelli",
  },
};
