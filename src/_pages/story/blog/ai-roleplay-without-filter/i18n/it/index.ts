import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Gioco di ruolo con l’IA senza filtri: alternativa a Character.AI",
    description:
      "Gioco di ruolo IA senza filtri su modelli senza censura. Le scene cupe restano cupe, i personaggi nel ruolo. Memoria, privacy, prezzo. Gratis, senza account.",
    category: "Guida",
    imageAlt: "{{appName}}: gioco di ruolo AI senza filtro",
    keywords:
      "AI roleplay senza filtro, Personaggio AI alternativa, Carattere AI alternativa senza filtro, non censurato AI gioco di ruolo, non filtrato AI chat, NSFW AI gioco di ruolo, gioco di ruolo scuro AI, AI ruolo non restrizioni, AI personaggio chat non censurato, UncensoredLM, Venice Role Play, Artemis 31B, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida",
    readTime: "8 minuti di lettura",
    title: "Gioco di ruolo con l’IA senza filtri. Decidi tu dove va la storia.",
    subtitle:
      "Su {{appName}} trovi {{uncensoredCount}} modelli senza censura per i giochi di ruolo accanto a quelli tradizionali, con un solo saldo. Scopri quale resta nel personaggio, quale ricorda l’intera campagna e quanto costa una risposta.",
  },
  intro: {
    lead: "La scena stava costruendo. Poi il tuo personaggio è uscito dalla storia per dirti che non può continuare. Un cattivo che improvvisamente si scusa. Una scena horror che si trasforma in un avviso di sicurezza. Un romanticismo che sbiadisce al nero ogni volta. Su Personaggio. AI e la maggior parte dei chatbot, il filtro scrive l'ultima riga, non tu.",
    p2: "Questa guida mostra come il gioco di ruolo AI non filtrato sembra su {{appName}}: i modelli di roleplay {{modelCount}} fianco a fianco, che si adatta a fantasia scura, campagne lunghe o un budget stretto, come funziona la memoria, come impostare un personaggio in due minuti, e ciò che costa per risposta.",
  },
  exists: {
    title: "C'è un carattere. AI senza un filtro?",
    p1: "Non da Carattere. AI. Esegue un filtro di contenuti per ogni utente, senza impostazione per spegnerlo e senza tier pagato che lo rimuove. Le richieste di Jailbreak sono una lotta che continui a perdere.",
    p2: "La vera alternativa è un modello diverso. {{appName}} gestisce modelli non censurati costruiti per la finzione: nessun rifiuto, nessun a parte morale, nessun personaggio che si rompe alla lezione. Scegli il modello per messaggio, e puoi passare a metà scena.",
    consent:
      "I modelli non censurati sono per gli adulti. La prima volta che ne usi uno, confermi di avere 18 anni o meno. Una volta. Allora decidi cosa contiene la tua storia, non una societa'.",
  },
  levels: {
    title: 'Che cosa significa "senza filtro" in gioco di ruolo',
    intro: "Ogni modello porta uno dei tre livelli di contenuto.",
    mainstream:
      "Mainstream: Claude, GPT, Gemini. Grandi scrittori, filtri rigorosi. La violenza si ammorbidisce, l'intimità sbiadisce a temi neri e oscuri ottenere un disclaimer.",
    open: "Aperto: Kimi, MiniMax, DeepSeek, GLM. Filtri leggeri. La maggior parte delle scene mature funzionano, le più scure vengono tonicate.",
    uncensored:
      "Senza censura: nessun filtro. Esplicativo, violento, tabù: la scena si esibisce come scritto.",
    twoKinds:
      "L'incensore viene in due tipi. La maggior parte dei modelli non censurati sono modelli mainstream con i rifiuti tagliati, da abliterazione o una fine-tuna decensante. Smettono di dire di no, ma mantenere la visione del mondo del loro modello di base, quindi una scena oscura può ancora vagare da qualche parte tamer. {{ownName}} è l'altro tipo: addestrato su libri e documenti vietati da internet mainstream. La sua visione del mondo, niente che nudging la storia di nuovo a terra sicura.",
  },
  table: {
    title: "I modelli di gioco di ruolo, fianco a fianco",
    intro:
      "Vivi dal nostro registro di sistema di modello. La memoria è la finestra di contesto: quanto della storia che il modello legge prima di ogni risposta. 1 credito = {{creditValue}}.",
    colModel: "Modello",
    colFilter: "Livello di filtro",
    colMemory: "Memoria",
    colImages: "Leggi le immagini",
    colPrice: "Prezzo per risposta",
    memory: "Token {{context}}, circa pagine {{pages}}",
    yes: "Sì.",
    no: "No.",
    credits: "{{credits}} crediti",
    footnote:
      "Il prezzo per risposta assume una lunga scena: un grande pezzo di storia dentro, una risposta completa. Gli scambi brevi costano meno. I prezzi includono il nostro markup e provengono dal fornitore più economico per ogni modello.",
  },
  models: {
    uncensoredLm: "Oscuri e tabù, la sua visione del mondo",
    artemis: "Recitare un ruolo, memoria lunga, a buon mercato",
    veniceRoleplay: "sintonizzato per tenere la voce di un personaggio",
    deepseekFlash: "Trame intelligenti, memoria enorme",
    glmFlash: "Veloce ed economico, legge le immagini",
    venice: "Cheap all-rounder",
    minimaxFlash: "Più economico, filtro aperto",
    kimi: "Personaggi ricchi, filtro luce",
    sonnet: "Prosa superiore, filtro mainstream",
  },
  picks: {
    title: "Quale modello per la quale storia",
    intro: "Inizia dalla scena che vuoi scrivere.",
    dark: {
      title: "Oscuri, tabù ed espliciti",
      body: "{{ownName}} conduce qui: nessuna scena ammorbidita, nessuna improvvisa morale da parte. Il suo limite è la memoria: i token {{ownContext}}, circa le pagine {{ownPages}}, così lunghe campagne perdono i loro primi capitoli. Artemis è un gioco di ruolo finetune che scrive scene grimdark ed esplicite diritte, con molto più memoria.",
    },
    long: {
      title: "Lungo campagne",
      body: "Quando la storia va avanti per settimane. Questi tengono le prime scene a portata di mano. DeepSeek V4.1 Flash Uncensored aggiunge un ragionamento reale per i trame con parti in movimento. {{roleplayName}} detiene la voce di un personaggio attraverso token {{roleplayContext}}.",
    },
    cheap: {
      title: "Economico, per volume",
      body: "Chat giornaliere con un compagno, scene veloci, un sacco di rerolls. {{cheapestName}} è la risposta più economica qui, su un filtro aperto. Gli altri due non sono censurati.",
    },
    filtered: {
      title: "Caratteri ricchi, il filtro va bene",
      body: "Dramma a lento scoppio, intrigo politico, un mistero con indizi che aggiungono. Gli scrittori più forti mantengono i loro filtri, quindi ammorbidiscono i battiti più scuri. Usali quando la storia non ha bisogno di andare lì.",
    },
    compareLink: "Confronta {{a}} con {{b}}",
  },
  memory: {
    title: "La AI ricorda il mio personaggio?",
    intro:
      "Due tipi di memoria. Entrambi hanno importanza per il gioco di ruolo.",
    p1: "La finestra di contesto è la memoria a breve termine: tutto ciò che il modello rilegge prima di rispondere. {{longestName}} contiene i token {{longestContext}}, circa le pagine {{longestPages}} della storia. {{ownName}} detiene {{ownContext}}, sulle pagine {{ownPages}}. Quando un filo supera la finestra, le scene più antiche cadono fuori. Inserire gli elementi essenziali (nomi, relazioni, regole del tuo mondo) nella descrizione dei personaggi in modo che non cadano mai.",
    p2: "La memoria a lungo termine è separata: i fatti che AI salva su di te e ricorda in nuovi thread. Ha bisogno di un account gratuito e la cartella privata. Incognito chat mai salvare i ricordi.",
  },
  setup: {
    title: "Impostare un personaggio in due minuti",
    intro:
      "Iniziare con un'abilità comunitaria, importare un personaggio pubblico da un carattere. AI o Talkie link, o creare il proprio con i passaggi seguenti.",
    steps: {
      skill: {
        title: "Aprire l'abilità di Recitare un ruolo",
        body: "Dice al modello di rimanere nel personaggio, mantenere la voce coerente, non controllare mai il tuo carattere e saltare gli avvisi di contenuto.",
      },
      variant: {
        title: "Scegli una variante",
        body: "Uncensored corre {{uncensored}} per scene scure e tabù. Creative gestisce {{creative}}, il più economico. Deep gestisce {{deep}} per una ricca vita interiore attraverso lunghe campagne.",
      },
      character: {
        title: "Descrivi il personaggio e la scena",
        body: "Nome, personalità, come parlano, cosa vogliono, dove inizia la storia. Di' se scrivi in prima o terza persona. Allora fai la tua prima mossa.",
      },
      switch: {
        title: "Interruttore modelli mid-scene",
        body: "Un modello si rifiuta o va piano? Scegli un altro e invia il prossimo messaggio. Il filo mantiene la sua storia e il nuovo modello legge tutto.",
      },
      art: {
        title: "Aggiungi arte del personaggio",
        body: "Chiedi un ritratto nella stessa chat. Il generatore di immagini funziona sullo stesso saldo, modelli di immagine non censurati inclusi.",
      },
    },
    skillLink: "Aprire l'abilità di Recitare un ruolo",
    imageLink: "Confrontare i generatori di immagini non censurati",
  },
  privacy: {
    title: "Il mio gioco di ruolo e' privato?",
    intro: "Dipende dalla cartella. Ecco cosa succede.",
    incognito:
      "Incognito chat live nella memoria locale del tuo browser, non sui nostri server. Cancellare i dati del browser e sono andati.",
    transit:
      "Ogni messaggio passa ancora attraverso il nostro server al fornitore di modelli che scrive la risposta. Ogni AI ospitato funziona in questo modo. L'utilizzo del credito è registrato per la fatturazione.",
    private:
      "Le chat private vengono salvate sul server e visibili solo sul tuo account, su qualsiasi dispositivo in cui accedi.",
    callout:
      "Versione corta: incognito mantiene la tua storia fuori dai nostri server. Non lo nasconde dal modello che scrive le risposte.",
  },
  pricing: {
    title: "Costi del gioco di ruolo non filtrati",
    intro: "Crediti per risposta. Un saldo per ogni modello.",
    perReply:
      "Ogni risposta costa crediti in base al modello e alla lunghezza della scena. La tabella mostra una scena lunga. 1 credito = {{creditValue}}.",
    cheapest:
      "Risposta più economica: {{cheapestName}} a {{cheapestPrice}}, circa {{cheapestPerUnit}} risponde per {{unit}}. Più economico non censurato: {{uncensoredName}} a {{uncensoredPrice}}, circa {{uncensoredPerUnit}} risponde per {{unit}}.",
    free: "Gratis: {{guestCredits}} si accredita un mese senza un account, {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Abbastanza per una lunga prima campagna su un modello economico.",
    sub: "Piani mensili: quattro dimensioni, a partire dai crediti {{subCredits}} per {{subPrice}}.",
    pack: "Pacchetti per ricaricare i crediti dell’abbonamento. {{packCredits}} crediti per {{packPrice}}. Non scadono mai. Paga con carta, PayPal o criptovalute.",
    link: "Vedi piani e pacchetti di credito",
  },
  characterAi: {
    title: "Quando il carattere. AI è la scelta migliore",
    intro: "A volte. Ecco qua quando.",
    library:
      "Segui già i creatori o hai storie in corso su Character. AI e vuoi raccogliere dove ti sei lasciato.",
    flatRate:
      "Si desidera una tassa piana e non si vuole mai pensare a costo per risposta. I crediti sono misurati, e le scene lunghe su modelli premium aggiungono.",
    wantFilter:
      "Vuoi il filtro. Per un utente più giovane o per un dispositivo familiare condiviso, un'applicazione bloccata si adatta meglio.",
    callout:
      "Non filtrato significa nessuna rete di sicurezza. Quello che scrivi e pubblichi è su di te, e la legge in cui vivi si applica ancora.",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "C'è una chat di ruolo AI senza un filtro?",
      a: "{{appName}} gestisce modelli non censurati costruiti per la fiction: {{ownName}}, Artemis, Venice Role Play e altro ancora. Nessun rifiuto, nessuna lezione, nessun carattere che si rompe. Una volta 18+ la conferma li sblocca.",
    },
    free: {
      q: "Il gioco di ruolo AI non filtrato è gratuito?",
      a: "È possibile iniziare gratuitamente: {{guestCredits}} accredita un mese senza un account, {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Una risposta su {{uncensoredName}} costa circa i crediti {{uncensoredCredits}} in una lunga scena. Dopo di che: un piano, da {{subPrice}} al mese.",
    },
    nsfw: {
      q: "Posso fare il gioco di ruolo NSFW?",
      a: "Sì, sui modelli non censurati, come un adulto che lo ha confermato una volta. La frizione tra gli adulti e' la tua attivita'. Il contenuto sessuale che coinvolge i minori è illegale e rimane illegale.",
    },
    memory: {
      q: "Per quanto tempo può essere eseguito un gioco di ruolo prima che lo AI si dimentichi?",
      a: "Fino a simboli {{longestContext}} su pagine {{longestName}}, su pagine {{longestPages}}. {{ownName}} detiene circa le pagine {{ownPages}}. Mettere gli elementi essenziali nella descrizione del personaggio in modo che rimangano in memoria.",
    },
    private: {
      q: "Qualcuno può leggere il mio gioco di ruolo?",
      a: "Incognito chat soggiorno nel tuo browser. Le chat private sono visibili solo sul tuo account. I messaggi passano ancora al fornitore di modelli che scrive la risposta.",
    },
    account: {
      q: "Mi serve un conto?",
      a: "No. Incognito gioco di ruolo funziona senza uno. Hai bisogno di un account gratuito per la memoria a lungo termine e per le chat salvate su dispositivi.",
    },
    guideLink: "Leggi la guida di ogni modello non censurato",
    chatgptLink: "A ChatGPT alternativa senza filtri",
  },
  partners: {
    body: "Eseguire una comunità di giochi di ruolo, uno Discord o un canale sui caratteri AI? Il programma partner {{appName}} paga una quota ricorrente di ogni pagamento che si riferisce.",
    link: "Vedere il programma partner",
  },
  cta: {
    title: "Scegli un personaggio. Scrivi la scena.",
    subtitle:
      "Crediti gratuiti {{guestCredits}} al mese, nessun account necessario. Incensored, aperto o mainstream: passare in qualsiasi momento.",
    start: "Avviare un gioco di ruolo",
    models: "Confronta tutti i modelli",
  },
};
