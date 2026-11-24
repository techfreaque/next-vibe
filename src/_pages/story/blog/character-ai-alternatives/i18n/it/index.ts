import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternative a Character.AI per il gioco di ruolo (2026)",
    category: "Gioco di ruolo con l’IA",
    description:
      "Confronta le alternative a Character.AI per gioco di ruolo, narrativa e compagnia virtuale, tra cui Janitor AI, SpicyChat, DreamGen, SillyTavern e {{appName}}.",
    imageAlt:
      "Alternative a Character.AI per il gioco di ruolo e la compagnia virtuale",
    keywords:
      "alternative a Character AI, Character AI senza filtri, gioco di ruolo IA, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Gioco di ruolo con l’IA",
    readTime: "9 min di lettura",
    title: "Alternative a Character.AI per il gioco di ruolo",
    subtitle:
      "Trova personaggi pronti all’uso, un compagno con memoria o un modello da scegliere. Prezzi verificati il {{date}}.",
  },
  intro: {
    lead: "Su Janitor AI scegli un personaggio e inizi subito. Con SillyTavern gestisci tutta la configurazione. Kindroid e Nomi fanno al caso tuo se cerchi un compagno che si ricordi di te.",
    p2: "Sviluppiamo {{appName}} e lo presentiamo per primo per la scelta del modello e l’importazione dei personaggi. I prezzi degli altri servizi sono in dollari statunitensi, tratti dalle pagine ufficiali e dalle schede degli sviluppatori consultate il {{date}}.",
  },
  characterAi: { title: "Cosa offre oggi Character.AI" },
  switch: {
    title: "Perché c’è chi cerca un’alternativa",
    intro: "Dalle discussioni pubbliche emergono tre motivi diversi.",
    reasons: {
      filtering: {
        body: "Scene interrotte. Nell’aggiornamento dell’agosto 2025, Character.AI ha riconosciuto che, secondo gli utenti, il filtro interveniva troppo spesso.",
        source: "Aggiornamento di Character.AI su Reddit",
      },
      continuity: {
        body: "Il filo della storia si perde. Una persona cercava una memoria migliore, dialoghi credibili e spazio per scrivere le proprie battute nelle scene più lente.",
        source: "Discussione su gioco di ruolo e memoria su Reddit",
      },
      oldSite: {
        body: "La chiusura del vecchio sito. In una discussione su chi restava e chi se ne andava, una persona racconta di aver cambiato servizio definitivamente dopo la chiusura.",
        source: "Discussione su chi ha lasciato Character.AI su Reddit",
      },
    },
  },
  criteria: {
    title: "Cosa controllare prima di cambiare",
    intro:
      "Prova la stessa scena in due applicazioni. Torna il giorno dopo e chiedi un dettaglio dell’inizio.",
    filter:
      "Verifica quali argomenti consente il modello e se il servizio richiede un controllo dell’età.",
    memory:
      "Scopri se i dettagli già raccontati riemergono grazie a ricordi salvati, riassunti o schede di ambientazione.",
    price:
      "Conta i messaggi o i crediti che usa il modello che preferisci, comprese le risposte rigenerate.",
    privacy:
      "Controlla dove rimane la cronologia e chi elabora i tuoi messaggi.",
    characters:
      "Scegli tra un cast già pronto, schede modificabili e un compagno fisso.",
  },
  table: {
    title: "Character.AI e le alternative a confronto",
  },
  us: {
    title: "1. {{appName}}: importa un personaggio e scegli il modello",
    intro:
      "Inizia una scena nel browser o crea un personaggio ricorrente come skill.",
    models:
      "Tra i {{modelCount}} modelli di chat trovi {{uncensored}} senza censura, {{mainstream}} commerciali diffusi e {{open}} aperti. Puoi cambiare modello durante la scena.",
    characters:
      "La skill Gioco di ruolo aiuta il modello a restare nel personaggio. Sfoglia le skill pubblicate oppure creane una con l’editor o lo Skill Creator.",
    consent:
      "Per usare i modelli senza censura, conferma una volta di avere almeno 18 anni e di accettare risposte senza filtri.",
    import:
      "Importa un personaggio da un link pubblico di Character.AI o Talkie. La copia cita l’autore originale.",
    privacy:
      "La chat in incognito funziona senza account. La cronologia resta nel browser e il fornitore del modello riceve ogni messaggio per rispondere.",
    price:
      "{{guestCredits}} crediti al mese come ospite o {{freeCredits}} con un account gratuito. Abbonamenti da {{subPrice}} al mese. I modelli consumano crediti.",
    weak: "Character.AI e Janitor AI offrono più scelta per scoprire nuovi personaggi. Se giochi spesso, una tariffa fissa può rendere la spesa più prevedibile.",
    skillsLink: "Sfoglia le skill integrate e della community",
    roleplayLink: "Apri la skill Gioco di ruolo",
    creatorLink: "Crea un personaggio con lo Skill Creator",
  },
  list: {
    title: "Nove alternative in dettaglio",
    intro:
      "Scegli in base a come giochi. Sotto ogni servizio trovi i link alle fonti.",
    heading: "{{number}}. {{name}}: {{bestFor}}",
    filter: "Regole sui contenuti.",
    price: "Prezzo.",
    pro: "Punto di forza.",
    con: "Limite.",
    versusLink: "{{appName}} a confronto con {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI ospita personaggi pubblici e personalizzati per il gioco di ruolo testuale, con voci e chiamate. I messaggi standard restano gratuiti e senza limiti per chi può accedere alla chat.",
      pricing:
        "Chat standard gratuita. Negli Stati Uniti le opzioni sono {{plans}}. Lite include alcune funzioni premium e mantiene gli annunci. Plus offre tutte le funzioni di memoria e toglie gli annunci.",
      filter:
        "I contenuti pornografici sono vietati. La chat libera con i personaggi è riservata ai maggiorenni.",
      privacy: "Impostazione per l’addestramento dei modelli",
      pro: "Un ampio catalogo di personaggi dei fandom, con voci e chiamate integrate.",
      con: "I piani a pagamento aggiungono funzioni e mantengono le stesse regole sui contenuti espliciti.",
    },
    janitorAi: {
      bestFor: "i personaggi della community",
      summary:
        "Milioni di personaggi della community, profili di gioco modificabili e possibilità di collegare un modello esterno.",
      pricing:
        "Chat standard senza limiti. L’App Store statunitense mostra {{plans}}.",
      filter:
        "I personaggi Limitless possono trattare temi per adulti. L’app mobile si avvia in modalità protetta.",
      privacy: "I proxy esterni possono ricevere i messaggi",
      pro: "Un ampio catalogo e chat standard gratuite senza limiti. Janitor+ offre cinque volte il contesto, priorità e risposte alternative con modelli premium.",
      con: "Il contesto gratuito è di circa 9.000 token. Un proxy esterno può richiedere configurazione e avere costi aggiuntivi.",
    },
    sillyTavern: {
      bestFor: "il controllo in locale",
      summary:
        "Interfaccia gratuita e open source per modelli locali o in cloud. Importa schede dei personaggi e supporta schede di ambientazione e prompt preimpostati.",
      pricing:
        "Il software è gratuito. I modelli locali usano il tuo hardware. Le API in cloud si pagano a parte.",
      filter: "Il filtraggio dipende dal modello e dal servizio che lo esegue.",
      privacy: "Cronologia locale. Le API in cloud ricevono i messaggi.",
      pro: "Scegli schede, ambientazione, istruzioni e modello. Puoi eseguire tutto sul tuo computer.",
      con: "Devi installare e mantenere l’interfaccia e procurarti un modello. In locale serve hardware adeguato.",
    },
    chub: {
      bestFor: "le schede di ambientazione e le trame ramificate",
      summary:
        "Catalogo di schede e interfaccia online con dettagli richiamati da parole chiave, più personaggi per chat e conversazioni a più rami.",
      pricing:
        "Chub descrive crediti di prova occasionali. L’abbonamento ai modelli di Chub costa {{plans}}. I modelli esterni hanno tariffe proprie.",
      filter:
        "Chub descrive i suoi modelli come non censurati. I fornitori esterni applicano le loro regole.",
      privacy:
        "Le chat condivise possono diventare pubbliche. Le API esterne ricevono i messaggi.",
      pro: "Sviluppa trame parallele, aggiungi una scheda di ambientazione ed esporta in JSONL per SillyTavern o in formato testo.",
      con: "Per un uso regolare serve un abbonamento o un modello configurato da te. I crediti di prova sono limitati e occasionali.",
      free: "Crediti di prova occasionali",
    },
    crushOn: {
      bestFor: "il gioco di ruolo per adulti senza configurazione",
      summary:
        "Personaggi della community, scene di gruppo, voci preimpostate e cambio di modello senza chiave API.",
      pricing:
        "Chat senza limiti sui modelli gratuiti e 100 crediti al mese per i modelli Pro. I piani mensili sono {{plans}}.",
      filter:
        "Il gioco di ruolo per adulti è disponibile. I modelli avanzati hanno limiti specifici di accesso e di crediti.",
      privacy:
        "L’informativa consultata lascia aperta la questione dell’accesso dei creatori",
      pro: "Avvia una scena con personaggi del catalogo, gioca in gruppo e cambia modello nel corso della chat.",
      con: "Pro e Ultra hanno condizioni diverse. Anche con l’abbonamento alcuni modelli restano soggetti a limiti.",
    },
    spicyChat: {
      bestFor: "i personaggi per adulti e i profili di gioco",
      summary:
        "Servizio online per il gioco di ruolo per adulti, con personaggi della community, profili multipli e funzioni di memoria a pagamento.",
      pricing:
        "Contesto di 4.096 token nel piano gratuito. Negli Stati Uniti i piani annuali sono {{plans}}. Per i piani mensili consulta il sito.",
      filter:
        "Supporta il gioco di ruolo per adulti. I personaggi pubblici sono moderati.",
      privacy: "Servizio online. La conversazione in corso fa da contesto.",
      pro: "I piani a pagamento consentono di saltare la coda e modificare i ricordi. Quelli superiori aggiungono memoria semantica e immagini nella chat.",
      con: "Nel piano gratuito ci sono annunci e code. Sintesi vocale e controlli di generazione richiedono il piano più alto.",
    },
    kindroid: {
      bestFor: "un compagno con chiamate in diretta",
      summary:
        "Crea un compagno con un passato, memoria persistente, selfie e chiamate vocali o video.",
      pricing:
        "Anteprima una tantum di 50 messaggi, o 15 in alcune regioni. L’App Store statunitense mostra {{plans}}. Sul web può costare meno.",
      filter:
        "Per adulti. Kindroid dichiara di intervenire a livello di account per i rischi gravi nel mondo reale.",
      privacy: "Dati cifrati durante la trasmissione e la conservazione",
      pro: "Chiamate, messaggi spontanei, chat di gruppo e selfie con un compagno che ritrovi nel tempo.",
      con: "Dopo l’anteprima o la scadenza dell’abbonamento, l’account resta in sola lettura. La memoria extra costa di più.",
      free: "Anteprima una tantum",
    },
    nomi: {
      bestFor: "un compagno con messaggi gratuiti ogni giorno",
      summary:
        "Compagnia virtuale con memoria a lungo termine, selfie, chat di gruppo e voci sui piani a pagamento.",
      pricing:
        "50 messaggi gratuiti al giorno. Il piano Standard offre più durate ({{plans}}).",
      filter:
        "Per adulti. Nomi presenta le chat di testo come prive di filtri. Le immagini hanno limiti propri.",
      privacy: "Nomi dichiara di non vendere né noleggiare dati personali",
      pro: "Ritrova lo stesso compagno nel tempo o riunisci più compagni in una chat.",
      con: "La chat gratuita ha un limite giornaliero. Le funzioni vocali richiedono un abbonamento.",
    },
    venice: {
      bestFor: "le chat private con personaggi e le immagini",
      summary:
        "Venice unisce personaggi, chat generica, generazione di immagini e diversi modelli.",
      pricing:
        "Con i modelli di base sono gratuiti 10 prompt testuali e 15 richieste di immagini al giorno. {{plans}}. Per creare personaggi serve Pro.",
      filter:
        "Il filtro per adulti è attivo all’inizio. Gli utenti Pro idonei possono disattivarlo.",
      privacy:
        "La cronologia resta sul dispositivo per impostazione predefinita",
      pro: "Personaggi, chat e immagini nella stessa app, con backup cifrato facoltativo sui piani a pagamento.",
      con: "Le richieste di testo gratuite sono limitate. I modelli premium e alcune funzioni multimediali consumano crediti.",
    },
    nanoGpt: {
      bestFor: "scegliere il modello e pagare a consumo",
      summary:
        "Chat web e API con modelli testuali e multimediali. Scegli un preset o inserisci le tue istruzioni per il personaggio.",
      pricing:
        "Un modello web gratuito. Primo deposito da 0,10 USD in criptovaluta o 1 USD con carta. {{plans}}. PRO include alcuni modelli aperti.",
      filter:
        "Per adulti. I limiti cambiano a seconda del modello e del fornitore.",
      privacy:
        "Cronologia locale per impostazione predefinita. Le politiche cambiano tra fornitori.",
      pro: "Paghi quanto usi. Puoi collegare l’API anche a interfacce come SillyTavern.",
      con: "Devi preparare un personaggio o scegliere un’interfaccia. La maggior parte dei modelli scala il costo dal saldo.",
    },
  },
  import: {
    title: "Porta con te un personaggio di Character.AI",
    intro:
      "Inizia una nuova storia con ciò che l’autore del personaggio ha reso pubblico.",
    steps: {
      account: {
        title: "Accedi",
        body: "Con un account gratuito puoi modificare il personaggio dopo l’importazione.",
      },
      create: {
        title: "Apri l’editor dei personaggi",
        body: "Nella pagina delle skill creane una personalizzata e scegli di importarla da un link.",
      },
      paste: {
        title: "Incolla il link pubblico",
        body: "Usa un link di Character.AI o Talkie. L’importazione copia i campi visibili come nome, avatar, saluto e descrizione. Può copiare anche la definizione pubblica.",
      },
      model: {
        title: "Scegli il modello",
        body: "Inizia una conversazione con la tua copia. Puoi passare a un altro modello nella stessa chat.",
      },
    },
    callout:
      "La copia cita l’autore e rimanda all’originale. Le vecchie conversazioni restano sul servizio di partenza.",
  },
  privacy: {
    title: "Dove vanno i tuoi messaggi",
    intro: "Ecco come funziona l’incognito su {{appName}}.",
    incognito:
      "La cronologia resta nei dati del browser. Se li cancelli, cancelli anche la conversazione.",
    transit:
      "Il nostro servizio inoltra ogni messaggio al fornitore del modello. Registriamo i crediti usati per la fatturazione.",
    callout:
      "Per fare tutto in locale, abbina SillyTavern a un modello che gira sul tuo computer.",
  },
  stay: {
    title: "Quando restare su Character.AI",
    intro:
      "Character.AI è adatto alle chat moderate con personaggi che già conosci.",
    library: "Hai già i tuoi personaggi preferiti e usi le chiamate integrate.",
    flat: "Usi soprattutto la chat standard e dai più valore ai messaggi gratuiti senza limiti che alla scelta del modello.",
    callout:
      "Resta se gli strumenti e le regole di Character.AI si accordano con le tue storie.",
  },
  faq: {
    title: "Domande frequenti",
    best: {
      q: "Qual è la migliore alternativa a Character.AI?",
      a: "Janitor AI per il catalogo, SillyTavern per il controllo in locale, Kindroid o Nomi per un compagno abituale. Con {{appName}} puoi importare un personaggio pubblico e cambiare modello.",
    },
    free: {
      q: "Esiste un’alternativa gratuita a Character.AI?",
      a: "Janitor AI offre chat standard senza limiti. Nomi include 50 messaggi al giorno. SillyTavern è gratuito e richiede un modello a parte. {{appName}} offre {{guestCredits}} crediti mensili come ospite o {{freeCredits}} con un account gratuito.",
    },
    import: {
      q: "Posso spostare personaggi e conversazioni da Character.AI?",
      a: "Con un account gratuito, {{appName}} può importare i campi disponibili da un link pubblico di Character.AI o Talkie. Le definizioni private e le vecchie conversazioni restano sul servizio originale.",
    },
    nsfw: {
      q: "Quali alternative consentono il gioco di ruolo scritto per adulti?",
      a: "Janitor AI con Limitless, CrushOn e SpicyChat lo consentono secondo le proprie regole. In SillyTavern dipende dal modello e dal fornitore. {{appName}} sblocca i modelli senza censura dopo la conferma della maggiore età.",
    },
    private: {
      q: "Quale alternativa a Character.AI funziona in locale?",
      a: "SillyTavern può usare un modello locale e salvare le chat sul tuo computer. Venice e l’incognito di {{appName}} tengono la cronologia sul dispositivo, mentre il fornitore del modello ospitato elabora i messaggi.",
    },
    account: {
      q: "Posso provare {{appName}} senza un account?",
      a: "Sì. Usa i crediti ospite nella chat in incognito. Accedi per importare un personaggio o sincronizzare le chat salvate.",
    },
    memory: {
      q: "Quali alternative funzionano bene nelle scene lunghe?",
      a: "Le schede di ambientazione di Chub e SillyTavern richiamano i dettagli quando servono. Kindroid e Nomi puntano sulla memoria del compagno. Torna a una scena iniziale e verifica cosa ricorda il modello prima di pagare.",
    },
    roleplayLink: "Gioco di ruolo con IA senza filtri",
    kindsLink: "Come si distinguono i modelli IA senza censura",
  },
  partners: {
    body: "Gestisci una community di gioco di ruolo? Il programma partner di {{appName}} ti riconosce il {{referralPercent}}% di ogni pagamento che porti.",
    link: "Scopri il programma partner",
  },
  cta: {
    title: "Scegli un modello e inizia una scena",
    subtitle:
      "Come ospite hai {{guestCredits}} crediti gratuiti al mese per iniziare.",
    start: "Inizia a giocare di ruolo",
    skills: "Sfoglia le skill",
  },
};
