import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Chat AI gratis senza registrazione né email | {{appName}}",
    description:
      "Chat AI gratis senza registrazione su {{appName}}: crediti gratuiti ogni mese, modelli mainstream e senza censura, cronologia in incognito nel browser.",
    category: "Guida",
    imageAlt: "Una chat IA che parte senza modulo di registrazione",
    keywords:
      "chat AI gratis senza registrazione, chat IA senza registrazione, chat AI anonima, chat IA anonima, IA senza account, chat AI senza registrazione, chat IA gratis senza registrazione, chat IA senza login, chat IA privata, chat IA senza censura senza registrazione, chat IA in incognito, chatbot senza email, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "6 min di lettura",
    title: "Chat AI gratis e senza registrazione. Niente email. Niente numero.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, {{modelCount}} modelli di chat, una cronologia in incognito che resta nel tuo browser. E l'elenco onesto di ciò che l'anonimato non copre.",
  },
  intro: {
    lead: "Vuoi fare una sola domanda. Il chatbot vuole prima la tua email, una password, un numero di telefono e un clic sul banner dei cookie. Quando finalmente entri, la domanda ti è passata di mente.",
    p2: "Su {{appName}} apri una chat e scrivi. Nessun modulo. Questa guida mostra cosa ottieni senza account, cosa significa davvero anonimo qui e quando conviene un account gratuito.",
  },
  guest: {
    title: "Cosa ottieni senza account",
    intro:
      "Senza registrazione non vuol dire demo. È il prodotto vero, a consumo.",
    credits:
      "{{guestCredits}} crediti gratuiti ogni mese, senza account, senza carta. Il plafond si rinnova ogni mese.",
    models:
      "Tutti i {{modelCount}} modelli di chat di {{labCount}} laboratori: mainstream, aperti e senza censura, in un unico selettore di modelli.",
    uncensored:
      "Anche i {{uncensored}} modelli senza censura, dopo una conferma 18+ una tantum.",
    media:
      "Generazione di immagini, video, musica e voce con gli stessi crediti: {{imageModels}} modelli di immagine, {{videoModels}} modelli video.",
    mediaLink: "Crea immagini, video e musica",
  },
  starters: {
    title: "I modelli più economici per iniziare",
    intro:
      "I due modelli di testo più economici di ogni fascia, presi dal nostro registro. Economico non vuol dire debole: sono quelli che fanno durare di più {{guestCredits}} crediti.",
    footnote:
      "Per messaggio indica uno scambio di riferimento sulla rotta più economica. Con {{cheapestModel}}, {{guestCredits}} crediti ospite bastano per circa {{guestMessages}} messaggi brevi. Le chat lunghe e le risposte lunghe costano di più.",
  },
  table: {
    model: "Modello",
    context: "Contesto",
    price: "Per messaggio",
    chat: "Provalo",
    chatLink: "Chatta con {{model}}",
  },
  anonymous: {
    title: "Cosa significa anonimo qui, e cosa no",
    intro:
      "Privato non vuol dire invisibile. Ecco la versione onesta, senza promettere nulla che la nostra informativa sulla privacy non dica.",
    yesTitle: "Cosa resta a te",
    noEmail:
      "Niente nome, niente email, niente numero di telefono. Per risponderti non ci serve nessuno di questi.",
    incognito:
      "Le chat in incognito sono salvate nel tuo browser, non sui nostri server. Cancella i dati del browser e la cronologia sparisce.",
    trackers:
      "Nessun tracker di terze parti, nessun pixel pubblicitario, nessun fingerprinting. Un solo cookie proprietario dice al nostro server con quale browser sta parlando.",
    noTitle: "Chi vede comunque il tuo messaggio",
    provider:
      "Il fornitore di IA: ogni messaggio passa dal nostro server all'azienda che fa girare il modello, che vede il prompt per poter rispondere. Ogni IA ospitata funziona così.",
    media:
      "I media generati: immagini, audio e video creati senza account sono salvati sui nostri server, così puoi vederli e scaricarli, e vengono cancellati automaticamente dopo 4 mesi se non ti registri mai.",
    network:
      "La rete: come ogni sito, il nostro server vede la connessione che apre il tuo browser. Una VPN nasconde il tuo indirizzo anche a noi.",
    callout:
      "Ti serve un prompt che non lasci mai il tuo computer? Nessuna chat ospitata può promettertelo. Fai girare un modello in locale o in self-hosting.",
    policyLink: "Leggi l'informativa sulla privacy",
  },
  steps: {
    title: "Da zero a una risposta in meno di un minuto",
    intro: "Quattro passaggi. Nessuno è un modulo.",
    open: {
      title: "Apri una chat in incognito",
      body: "Un clic da qualsiasi pagina. Nessuna schermata di account davanti.",
    },
    pick: {
      title: "Scegli un modello",
      body: "Parti da uno economico, cambia quando vuoi. La chat conserva la cronologia quando cambi modello.",
    },
    confirm: {
      title: "Conferma 18+ se passi ai senza censura",
      body: "I modelli senza censura chiedono una sola volta la conferma 18+ e l'accettazione dei termini. I modelli mainstream e aperti non chiedono nulla.",
    },
    ask: {
      title: "Chiedi",
      body: "{{guestCredits}} crediti al mese. Quando finiscono, aspetta il mese successivo o crea un account gratuito.",
    },
  },
  account: {
    title: "Quando conviene un account gratuito",
    intro: "Mai obbligatorio. A volte utile.",
    credits:
      "Fino a {{freeCredits}} crediti gratuiti al mese con email verificata, invece di {{guestCredits}}.",
    sync: "Chat salvate nelle tue cartelle private, su ogni dispositivo su cui accedi.",
    control:
      "Esporta tutti i tuoi dati in JSON o elimina l'account dalle Impostazioni. L'eliminazione cancella i tuoi dati personali.",
    plans:
      "Piani da {{subPrice}} al mese quando i crediti gratuiti non bastano.",
  },
  stricter: {
    title: "Ti serve più privacy?",
    intro: "Scegli la configurazione adatta al rischio.",
    selfHost:
      "{{appName}} in self-hosting: il tuo server, i tuoi log, le tue regole",
    local: "Esegui un modello senza censura in locale, oppure online senza GPU",
    venice: "Alternative a Venice AI, confrontate sulla privacy",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Esiste una chat IA senza registrazione?",
      a: "Sì. Su {{appName}} apri una chat e scrivi, senza account e senza email. Gli ospiti ricevono {{guestCredits}} crediti gratuiti al mese su tutti i {{modelCount}} modelli di chat.",
    },
    anonymous: {
      q: "Una chat IA senza account è davvero anonima?",
      a: "Anonima nei nostri confronti, nel senso che non ti chiediamo mai chi sei e la cronologia in incognito resta nel tuo browser. Non invisibile: il fornitore di IA vede ogni prompt per rispondere, e il nostro server vede la tua connessione come qualsiasi sito.",
    },
    free: {
      q: "È gratis?",
      a: "{{guestCredits}} crediti al mese sono gratuiti senza account, fino a {{freeCredits}} con un account gratuito verificato. Quanto durano dipende dal modello: il più economico, {{cheapestModel}}, costa {{cheapestPrice}} per messaggio.",
    },
    uncensored: {
      q: "Posso usare un'IA senza censura senza registrarmi?",
      a: "Sì. Tutti i {{uncensored}} modelli senza censura funzionano senza account dopo una conferma 18+ una tantum.",
    },
    saved: {
      q: "Le mie chat vengono salvate?",
      a: "Le chat in incognito sono salvate solo nel tuo browser, quindi le ritrovi sullo stesso dispositivo. Cancella i dati del browser e spariscono. Con un account puoi anche salvare le chat in cartelle private sincronizzate tra i tuoi dispositivi.",
    },
    runOut: {
      q: "Cosa succede quando finiscono i crediti gratuiti?",
      a: "Aspetta il plafond del mese successivo, oppure crea un account gratuito e verifica l'email per avere fino a {{freeCredits}} crediti al mese. I crediti già spesi come ospite in quel mese rientrano nel totale.",
    },
    chatLink: "Chat IA senza censura nel browser",
    chatgptLink: "Un'alternativa a ChatGPT con modelli senza censura",
  },
  cta: {
    title: "Nessun modulo. Chiedi e basta.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, tutti i modelli, in incognito di default.",
    start: "Avvia una chat in incognito",
    models: "Confronta tutti i modelli",
  },
};
