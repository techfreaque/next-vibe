import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a NoFilterGPT: chat IA senza censura (2026)",
    description:
      "Confronta NoFilterGPT con Venice, Unrestricted.chat, {{appName}} e app locali come Ollama. Modelli, limiti gratuiti, privacy e accesso all’API.",
    category: "Confronto",
    imageAlt: "Alternative a NoFilterGPT messe a confronto",
    keywords:
      "alternativa a NoFilterGPT, alternative a NoFilterGPT, siti come NoFilterGPT, NoFilterGPT vs Venice, chat AI senza censura, chat AI senza filtri, ChatGPT senza filtri, IA senza censura, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Confronto",
    readTime: "8 min di lettura",
    title: "Alternative a NoFilterGPT con più modelli tra cui scegliere",
    subtitle:
      "{{count}} alternative e {{appName}}, confrontate su ciò che dicono le loro pagine di prezzi, privacy e filtri.",
  },
  intro: {
    lead: "NoFilterGPT vende una cosa sola: un chatbot che non ti fa la predica. Giusto. Ma hai un solo modello, un limite giornaliero nel piano gratuito e una promessa sulla privacy da prendere sulla fiducia.",
    p2: "Ecco le alternative, verificate sulle loro pagine. Concorrenti al {{date}}, NoFilterGPT al {{nfDate}}. Per trasparenza: acquistiamo modelli da alcuni di loro e li offriamo nella nostra chat, {{veniceModels}} solo tramite Venice. Diciamo anche dove sono più forti.",
  },
  nfg: {
    title: "Cosa offre NoFilterGPT",
    intro:
      "Secondo la sua home page e la sua informativa privacy, lette il {{nfDate}}.",
    model:
      "Modello: un modello proprietario, descritto come basato sull'architettura GPT senza le solite restrizioni. Nessun modello di base dichiarato, nessuna scelta del modello.",
    price:
      "Prezzo: un piano Basic gratuito con messaggi limitati al giorno. Professional costa {{proPrice}} al mese per chat quasi illimitate, analisi delle immagini, generazione di immagini e accesso API.",
    media:
      "Media: generazione e modifica di immagini, video da un'immagine, voce in entrata e in uscita.",
    privacy:
      "Privacy: la home page dice che le conversazioni non vengono conservate e che le chat sono cifrate. L'informativa aggiunge che gli indirizzi IP possono essere registrati per sicurezza, che i dati di utilizzo vengono registrati e che sul sito gira Cloudflare Analytics.",
    payments: "Pagamenti: carte tramite Stripe, più ETH, BTC e USDC.",
    why: "Perché si cerca un'alternativa: per scegliere il modello, confrontare le risposte o verificare una promessa sulla privacy in un'informativa che la mette nero su bianco.",
    sourceHome: "Home page di NoFilterGPT",
    sourcePrivacy: "Informativa privacy di NoFilterGPT",
  },
  criteria: {
    title: "Cosa confrontare prima di cambiare",
    intro: "Decidono cinque domande.",
    models:
      "Modelli: un modello della casa o una scelta vera? Abliterati, davvero senza censura, e puoi ancora usare Claude, GPT e Gemini nello stesso posto?",
    filter:
      "Filtro: cosa è permesso nel piano gratuito, cosa richiede un piano a pagamento, e c'è una verifica dell'età?",
    privacy:
      "Privacy: dove finiscono le tue chat, cosa viene registrato e se qualcuno le usa per addestrare modelli.",
    price:
      "Prezzo: quota gratuita, abbonamento o pagamento a consumo. E cosa succede quando arrivi al limite.",
    api: "API: puoi chiamare gli stessi modelli dal tuo codice, e in quale formato?",
  },
  table: {
    title: "Tutte a confronto",
  },
  us: {
    title: "{{appName}}: ogni tipo di modello in una sola chat",
    intro:
      "{{modelCount}} modelli in una sola chat e con un solo saldo. Scegli il livello di filtro a ogni messaggio.",
    models:
      "Modelli: {{uncensored}} senza censura accanto a {{mainstream}} mainstream e {{open}} aperti. {{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, e ne esce un modello con opinioni politiche controcorrente.",
    switch:
      "Cambia modello a metà conversazione. Chiedi a un modello senza censura, poi verifica la risposta con uno mainstream.",
    privacy:
      "Privacy: le chat in incognito restano nella memoria locale del tuo browser, senza account. Le chat private vengono salvate solo nel tuo account.",
    price:
      "Prezzo: {{guestCredits}} crediti gratuiti al mese senza account, {{freeCredits}} con un account. Piani da {{subPrice}} al mese. I pacchetti di crediti ricaricano un piano attivo e non scadono mai.",
    api: "API: gli stessi modelli tramite endpoint compatibili con OpenAI e Anthropic. La sblocca qualsiasi piano da {{apiSubPrice}} al mese.",
    weak: "Dove siamo più deboli: niente piano illimitato. Ogni messaggio costa crediti e il prezzo dipende dal modello scelto.",
    hubLink: "Chat IA senza censura: tutti i modelli con contesto e prezzo",
    ownLink: "Scopri {{ownModel}}",
  },
  list: {
    title: "Le {{count}} alternative, una per una",
    intro:
      "Dalle loro pagine, verificate il {{date}}. Cos'è ciascuna, quali modelli ha, cosa permette il suo filtro, cosa succede alle tue chat.",
    heading: "{{number}}. {{name}}: {{kind}}",
    models: "Modelli:",
    filter: "Filtro:",
    privacy: "Privacy:",
    price: "Prezzo:",
    priceValue: "Gratis: {{free}}. A pagamento: {{plans}}.",
    pro: "Punto forte:",
    con: "Il limite:",
    forWho: "Sceglila se:",
    versusLink: "{{appName}} vs {{name}}: il confronto completo",
    visit: "Visita {{name}}",
  },
  privacy: {
    title: "Privacy: leggi l'informativa, non lo slogan",
    intro:
      "Nessun log è una promessa forte. Ecco cosa mette per iscritto ciascuno.",
    nfg: "NoFilterGPT: la home page dice che le chat non vengono conservate. L'informativa dice che indirizzi IP e dati di utilizzo possono essere registrati e che Cloudflare tratta i dati delle richieste.",
    us: "Su {{appName}} le chat in incognito stanno nella memoria locale del tuo browser, non sui nostri server. Cancella i dati del browser e spariscono.",
    transit:
      "Ogni modello ospitato vede il tuo prompt. NoFilterGPT, Venice, noi: il messaggio deve arrivare al server che fa girare il modello. Solo un programma locale lo tiene sul tuo computer.",
    callout:
      "Una cronologia sul dispositivo tiene le tue chat lontane dai server di un'azienda. Non le nasconde al modello che scrive le risposte.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Qual è la migliore alternativa a NoFilterGPT?",
      a: "Dipende da cosa ti manca. Un grande catalogo e la cronologia sul dispositivo: Venice. Un modello schietto con una sua visione del mondo: uncensored.ai. Pagamento a consumo: NanoGPT. Privacy totale: LM Studio sul tuo computer. Modelli senza censura, aperti e mainstream più i media, in una sola chat con un solo saldo: {{appName}}.",
    },
    free: {
      q: "Esiste un'alternativa gratuita a NoFilterGPT?",
      a: "Sì. FreedomGPT parte gratis senza account. LM Studio è gratuito sul tuo hardware. {{appName}} dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account, modelli senza censura inclusi dopo una sola conferma dei 18 anni.",
    },
    models: {
      q: "Che modello usa NoFilterGPT?",
      a: "La home page descrive un modello proprietario basato sull'architettura GPT e non indica un modello di base. Su {{appName}} ogni modello ha una sua pagina con laboratorio, finestra di contesto e prezzo. Sai chi ti risponde.",
    },
    private: {
      q: "Qual è l'alternativa più riservata?",
      a: "Un programma locale come LM Studio: il modello gira sul tuo dispositivo e i prompt non lo lasciano mai. Tra i servizi ospitati, Venice e l'incognito di {{appName}} tengono la cronologia nel browser. Ogni modello ospitato vede comunque il prompt a cui risponde.",
    },
    api: {
      q: "Quale alternativa ha un'API senza censura?",
      a: "Venice, NanoGPT, uncensored.ai, Gab AI e {{appName}} offrono API compatibili con OpenAI. NoFilterGPT mette la sua API nel piano Professional. Su {{appName}} qualsiasi piano da {{apiSubPrice}} al mese sblocca l'API.",
    },
    account: {
      q: "Serve un account per provarla?",
      a: "Non su {{appName}}: la chat in incognito funziona senza. Un account gratuito conserva le chat su tutti i dispositivi e porta la quota gratuita a {{freeCredits}} crediti al mese.",
    },
    chatgptLink: "Un'alternativa a ChatGPT senza filtri",
    kindsLink: "Abliterati, rifiniti o con una propria visione: i tre tipi",
  },
  cta: {
    title: "Scegli il modello. Non solo il filtro.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, senza account. Parti in incognito e prova qualsiasi modello.",
    start: "Avvia una chat in incognito",
    models: "Scopri i modelli senza censura",
  },
};
