import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    back: "Torna al blog",
    category: "Confronto",
    readTime: "7 min di lettura",
    switching: "Perché si cerca un’alternativa",
    criteria: "Cosa controllare prima di cambiare",
    privacy:
      "Verifica dove viene salvata la cronologia e chi elabora le richieste. Un modello ospitato online riceve il prompt anche se l’interfaccia gira in locale.",
    table: "Tutte le opzioni a confronto",
    checked:
      "Prezzi della concorrenza verificati il {{date}}. Gli importi sono in dollari statunitensi. Il prezzo al pagamento può variare per paese. I dati di {{appName}} provengono dalla nostra configurazione attuale. Sugli schermi piccoli puoi scorrere la tabella in orizzontale.",
    alternatives: "Le altre opzioni nel dettaglio",
    price: "Prezzo.",
    pro: "Punto di forza.",
    con: "Limite.",
    fit: "Fa per te se",
    faq: "Domande frequenti",
    guides: "Altri confronti",
    modelCatalog: "Consulta il catalogo dei modelli",
  },
  kinds: {
    aggregator: "Chat online con più modelli",
    client: "Client per le tue chiavi API",
    selfHosted: "Interfaccia di chat da installare",
    gateway: "Gateway API con chat web",
    creativeChat: "Chat online per la creazione",
    singleProvider: "Chat online di un solo fornitore",
  },
  us: {
    title: "{{appName}}. Una chat online con filtri a scelta",
    intro:
      "Cambia modello durante la conversazione senza configurare chiavi API. Il catalogo contiene {{modelCount}} modelli per la chat, tra cui {{mainstream}} di largo uso, {{open}} aperti e {{uncensored}} senza censura. Per accedere a quelli senza censura, conferma di avere almeno 18 anni.",
    price:
      "Hai {{guestCredits}} crediti gratuiti al mese senza account o {{freeCredits}} con un account, {{maxCredits}} con la newsletter. I piani partono da {{subPrice}} al mese. Ogni richiesta consuma crediti alla tariffa del modello scelto.",
    privacy:
      "In incognito la cronologia resta nel browser. Un modello ospitato online riceve comunque il prompt necessario per rispondere.",
    api: "L’accesso alle API compatibili con OpenAI e Anthropic parte da {{apiSubPrice}} al mese.",
    cta: "Fai la stessa domanda a due modelli",
    ctaSubtitle:
      "Parti in incognito con {{guestCredits}} crediti gratuiti al mese. Scegli un modello e invia il primo messaggio.",
    start: "Apri una chat in incognito",
    models: "Scopri i modelli senza censura",
  },
  platforms: {
    poe: {
      free: "Punti gratuiti ogni giorno.",
      paid: "Da {{poeStart}} al mese",
      filter: "Regole di Poe e del bot",
      privacy: "Poe e i fornitori dei bot trattano i dati",
      api: "Compatibile con OpenAI, stessi punti del piano",
      media: "Immagini, video e audio",
      open: "Proprietario",
      models:
        "Poe è il servizio di Quora che mette insieme GPT, Claude, Gemini e i bot della community. Testi e contenuti multimediali consumano punti dallo stesso saldo, senza configurare chiavi dei fornitori.",
      price:
        "I punti gratuiti si rinnovano ogni 24 ore e quelli rimasti scadono. Il primo piano a pagamento indica 10.000 punti al giorno. Prompt, risposte o contesti più lunghi possono costare di più, a seconda del bot.",
      pro: "Puoi trovare bot della community, invitare persone in una chat di gruppo e pubblicare bot. I creatori idonei possono guadagnare per messaggio. Gli abbonati usano gli stessi punti in chat e via API.",
      con: "Il numero di richieste dipende dal saldo e dal costo del bot. Secondo l’informativa di Poe, fornitori e sviluppatori dei bot possono ricevere conversazioni e file. Si applicano sia le regole di Poe sia quelle del bot.",
      fit: "vuoi un catalogo di bot, chat di gruppo e un solo conto per modelli di più fornitori.",
    },
    typingMind: {
      free: "Interfaccia di base senza licenza.",
      paid: "{{typingStandard}} una tantum più il costo dei modelli",
      filter: "Regole del modello e del fornitore collegato",
      privacy: "Cronologia nel browser, sincronizzazione facoltativa",
      api: "Si collega ad API esterne",
      media: "Immagini e voce secondo piano e modello",
      open: "Proprietario, versione statica installabile con licenza",
      models:
        "TypingMind è un’interfaccia per le tue chiavi API o per endpoint compatibili. Si collega a GPT, Claude, Gemini e altri modelli. Con una licenza può conservare la cronologia nel browser.",
      price:
        "Standard costa {{typingStandard}}, Extended {{typingExtended}}. Premium era in promozione a {{typingPremium}}, con un prezzo di listino di {{typingList}}. Il consumo dei modelli e lo spazio aggiuntivo si pagano a parte.",
      pro: "Premium aggiunge cartelle di progetto e risposte affiancate con un contesto distinto per modello. Imposti i parametri e usi i fornitori che già paghi.",
      con: "La versione gratuita non salva le chat. Devi gestire chiavi e fatture. Per installarlo su un tuo server serve la licenza, che dà accesso all’app compilata.",
      fit: "vuoi pagare direttamente i fornitori e avere un client pronto con impostazioni dettagliate.",
    },
    libreChat: {
      free: "Software gratuito con licenza MIT.",
      paid: "Hosting e modelli secondo le esigenze",
      filter: "Dipende dall’istanza e dal modello",
      privacy: "Cronologia sulla tua istanza, richieste ai modelli online",
      api: "API dei fornitori e Agents API in beta",
      media: "Immagini tramite strumenti configurati",
      open: "MIT, installabile sul proprio server",
      models:
        "LibreChat si collega a fornitori come OpenAI, Anthropic e OpenRouter. Puoi installarlo su un tuo server oppure creare un account per provare la demo pubblica.",
      price:
        "La licenza è gratuita. Metti in conto il server e i modelli a pagamento. La demo pubblica serve per valutare il software.",
      pro: "Puoi modificare il codice. Il progetto offre agenti, MCP, ricerca nei file, importazione delle chat e vari formati di esportazione.",
      con: "Ti occupi di installazione, aggiornamenti e backup. Per i dati sensibili e i dialoghi importanti è meglio avere un’istanza tua.",
      fit: "vuoi un’interfaccia personalizzabile con più fornitori e puoi gestire il server.",
    },
    openWebUi: {
      free: "Installazione gratuita nei termini della licenza.",
      paid: "Hardware, hosting o modelli secondo le esigenze",
      filter: "Dipende dall’istanza e dal modello",
      privacy: "Può funzionare offline con modelli locali",
      api: "Ollama ed endpoint compatibili con OpenAI",
      media: "Immagini e voce tramite integrazioni",
      open: "Codice disponibile, vincoli sul marchio",
      models:
        "Open WebUI si installa in proprio e si collega a Ollama e alle API compatibili con OpenAI. Con un modello locale la chat può funzionare interamente offline.",
      price:
        "Il software è gratuito con il marchio del progetto. Per le installazioni più grandi, una licenza separata può consentire di usare un marchio proprio.",
      pro: "Puoi eseguire i modelli e conservare la cronologia sul tuo hardware, poi collegare un’API in cloud dalla stessa interfaccia se serve.",
      con: "I modelli locali richiedono hardware adeguato o un server a parte. Se offri accesso ad altre persone, conta anche la manutenzione e verifica i vincoli sul marchio.",
      fit: "vuoi gestire modelli locali e online dalla stessa interfaccia, anche senza connessione.",
    },
    openRouter: {
      free: "Alcuni modelli gratuiti.",
      paid: "Prezzo a consumo",
      filter: "Regole del modello e del fornitore",
      privacy: "Trattamento dei dati secondo il fornitore scelto",
      api: "API unificata",
      media: "Dipende dal modello",
      open: "Online, proprietario",
      models:
        "OpenRouter Chat è l’interfaccia web per provare il catalogo di OpenRouter. Invia la stessa richiesta a più modelli e confronta le risposte affiancate.",
      price:
        "I modelli a pagamento si fatturano a consumo. Nel piano Standard, sulle ricariche con carta si applica una commissione del {{routerFee}} con un minimo di {{routerMinimum}}. Le tariffe dei modelli sono quelle dei fornitori.",
      pro: "Puoi confrontare le risposte e scegliere il fornitore che elabora la richiesta. Lo stesso saldo vale anche per l’API.",
      con: "Le richieste gratuite hanno un limite. Il prezzo varia per modello e contesto. Le regole di conservazione dei dati dipendono dal fornitore scelto.",
      fit: "vuoi confrontare molti modelli nel browser e pagare a consumo.",
    },
    venice: {
      free: "10 richieste di testo e 15 di immagini al giorno sui modelli base.",
      paid: "Pro a {{venicePro}} al mese",
      filter: "Filtro dei contenuti per adulti disattivabile da Pro",
      privacy:
        "Cronologia locale per impostazione predefinita, protezioni diverse per modello",
      api: "API a crediti",
      media: "Immagini, video, voce e musica",
      open: "Online, proprietario",
      models:
        "Venice offre modelli di testo aperti e proprietari, con strumenti per immagini, video e audio. La sua pagina sulla privacy distingue quattro modalità di elaborazione con protezioni diverse.",
      price:
        "Pro costa {{venicePro}} al mese e include richieste di testo illimitate sui modelli previsti dal piano. Alcuni modelli avanzati e la generazione di contenuti multimediali consumano crediti.",
      pro: "La cronologia resta nel browser per impostazione predefinita. Pro offre backup cifrati e modelli con protezione hardware sulle opzioni compatibili.",
      con: "Il piano gratuito ha limiti giornalieri. Alcuni modelli avanzati ricevono le richieste tramite fornitori esterni. Per disattivare il filtro serve almeno Pro.",
      fit: "vuoi più controllo sui filtri e una chat online con cronologia locale.",
    },
    nanoGpt: {
      free: "Un modello gratuito sul web.",
      paid: "A consumo o Pro a {{nanoPro}} al mese",
      filter: "Termini del servizio e limiti dei modelli",
      privacy: "Cronologia nel browser, sincronizzazione facoltativa",
      api: "API con saldo prepagato o quota compatibile",
      media: "Immagini, video e voce",
      open: "Online, proprietario",
      models:
        "NanoGPT offre modelli di largo uso e aperti nel browser e via API. Puoi ricaricare il saldo senza abbonarti oppure scegliere un piano con una quota inclusa.",
      price:
        "Pro costa {{nanoPro}} al mese. Include fino a 60 milioni di token di input a settimana sui modelli aperti previsti dal piano e 100 immagini al giorno su quattro modelli.",
      pro: "Chat e API condividono il saldo. La cronologia resta nel browser per impostazione predefinita e puoi iniziare con un identificativo generato.",
      con: "Anche con Pro, la maggior parte dei modelli proprietari e la generazione di video e voce si pagano con il saldo. La quota vale solo per alcuni modelli.",
      fit: "i tuoi consumi cambiano oppure vuoi una quota pensata soprattutto per modelli aperti.",
    },
    chatGpt: {
      free: "Piano gratuito ChatGPT separato.",
      paid: "Plus a {{plus}} al mese",
      filter: "Regole di OpenAI",
      privacy: "Cronologia dell’account e controlli sull’addestramento",
      api: "API OpenAI fatturata a parte",
      media: "Immagini e voce",
      open: "Online, proprietario",
      models:
        "ChatGPT Plus è l’abbonamento di OpenAI. Comprende modelli OpenAI, conversazioni vocali, analisi di file, generazione di immagini e ricerca approfondita dove disponibile.",
      price:
        "OpenAI indica {{plus}} al mese. I limiti possono variare e l’API ha una fatturazione separata.",
      pro: "Voce, file e ricerca in una sola app, con una tariffa mensile chiara.",
      con: "Possono applicarsi limiti di utilizzo. La chat offre i modelli di un solo fornitore. Plus non copre l’uso generale dell’API OpenAI.",
      fit: "usi soprattutto i modelli OpenAI e gli strumenti integrati in ChatGPT.",
    },
  },
  posts: {
    poe: {
      metaTitle: "8 alternative a Poe a confronto (2026)",
      description:
        "Confronta le alternative a Poe con saldo condiviso, pagamento a consumo o chiavi API proprie. Prezzi, limiti e l’offerta di {{appName}}.",
      keywords:
        "alternative a Poe, alternativa a Poe AI, punti Poe, Poe o TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 alternative a Poe per budget diversi",
      subtitle:
        "Usa una chat online, paga a consumo o installa la tua interfaccia. Otto opzioni a confronto, tra cui {{appName}}.",
      lead: "Poe è comodo se passi spesso da un modello all’altro. Se una chat lunga costa più punti del previsto, guarda quanto pagheresti per la stessa conversazione altrove. Una quota giornaliera, un saldo prepagato e la fatturazione diretta dell’API rispondono a esigenze diverse.",
      overview: "Cosa offre Poe e come si paga",
      tradeoff:
        "Poe si distingue per il catalogo pubblico di bot, i compensi ai creatori e le chat di gruppo. Anche {{appName}} conteggia il consumo in crediti. Confronta il costo di una conversazione lunga sui modelli che usi davvero.",
      switch: {
        firstLink: "Rinnovi e punti inclusi in Poe",
        secondLink: "Poe e le alternative a consumo",
        first:
          "In una discussione su r/PoeAI alcuni abbonati hanno segnalato variazioni del prezzo di rinnovo e dei punti inclusi. Una persona pensava di passare a OpenRouter con TypingMind. Per un’altra il vecchio piano rimaneva conveniente.",
        second:
          "In un altro thread, un utente preferiva OpenRouter per la chiarezza dei costi. Un altro riteneva più conveniente la quota giornaliera di Poe se sfruttata con costanza. Sono esperienze individuali. Il confronto usa i prezzi ufficiali.",
      },
      criteria: {
        cost: "Se alterni periodi intensi e periodi tranquilli, confronta la ricarica con il prezzo dell’abbonamento in un mese con poche chat. Se chatti ogni giorno, conta quanti scambi effettivi copre la quota.",
        workflow:
          "Fai un elenco delle funzioni che usi oltre alla chat. I bot della community e i gruppi possono essere buoni motivi per restare. Se confronti soprattutto risposte, cerca modelli in parallelo o il cambio di modello nella stessa conversazione.",
      },
      faq: {
        best: {
          q: "Qual è la migliore alternativa a Poe?",
          a: "{{appName}} offre una chat online con modelli diffusi e senza censura. OpenRouter Chat e NanoGPT sono adatti al consumo. TypingMind accetta le tue chiavi, mentre Open WebUI si presta all’uso locale.",
        },
        free: {
          q: "C’è un’alternativa gratuita a Poe?",
          a: "{{appName}} offre {{guestCredits}} crediti gratuiti al mese senza account. OpenRouter dà accesso a una selezione di modelli gratuiti. LibreChat e Open WebUI non prevedono un costo software per l’uso in proprio. Hardware, hosting e modelli a pagamento possono costare.",
        },
        billing: {
          q: "Quali alternative a Poe si pagano a consumo?",
          a: "OpenRouter e NanoGPT scalano l’utilizzo da un saldo. TypingMind e LibreChat si collegano ad account con fatturazione diretta. La soluzione più economica dipende da modello, contesto e frequenza.",
        },
        privacy: {
          q: "Quale alternativa conserva le chat in locale?",
          a: "Open WebUI può girare offline con un modello locale. TypingMind salva la cronologia localmente per impostazione predefinita con una licenza. Venice, NanoGPT e {{appName}} in incognito possono tenere la cronologia sul dispositivo, anche se il modello online riceve il prompt.",
        },
        switching: {
          q: "Vale la pena tenere Poe per i bot della community?",
          a: "Spesso sì. Altre app hanno agenti e strumenti propri. Il catalogo pubblico, le chat di gruppo e i compensi ai creatori fanno parte di Poe. Prima di passare altrove, controlla che il nuovo servizio copra gli usi che ti interessano.",
        },
      },
    },
    typingMind: {
      metaTitle: "8 alternative a TypingMind a confronto (2026)",
      description:
        "Confronta le alternative a TypingMind per chiavi API proprie, modelli locali o chat online. Costi delle licenze, tariffe dei modelli e {{appName}}.",
      keywords:
        "alternative a TypingMind, TypingMind o LibreChat, TypingMind o Open WebUI, chiave API propria, {{appName}}",
      title: "8 alternative a TypingMind per chattare con l’IA",
      subtitle:
        "Mantieni le tue chiavi e installa un’interfaccia oppure apri una chat online. Otto opzioni a confronto, tra cui {{appName}}.",
      lead: "TypingMind riunisce in un’interfaccia curata i fornitori che già paghi. Se ti serve soprattutto una finestra di chat, somma licenza, consumo dei modelli ed eventuali costi di sincronizzazione. Potrebbe bastare un’interfaccia gratuita o convenirti una chat online con accesso gestito.",
      overview: "Cosa include la licenza TypingMind",
      tradeoff:
        "TypingMind ti lascia pagare direttamente i fornitori. Premium mostra più risposte indipendenti in parallelo. {{appName}} offre un solo catalogo e scala crediti al prezzo del modello. Un client come TypingMind è adatto a chi vuole usare un saldo già disponibile presso un fornitore.",
      switch: {
        firstLink: "Alternative gratuite da installare",
        secondLink: "Costi oltre la licenza TypingMind",
        first:
          "Su r/selfhosted, un utente trovava TypingMind troppo caro e cercava un’interfaccia da installare per il proprio accesso OpenAI. Ha provato Open WebUI e ha scritto che rispondeva alle sue esigenze.",
        second:
          "Su r/TypingMind, una persona interessata alla licenza a vita ha chiesto quali costi restassero da pagare. Le risposte hanno menzionato l’uso delle API e lo spazio facoltativo in cloud. Consulta la pagina dei prezzi per le condizioni attuali.",
      },
      criteria: {
        cost: "Calcola il totale annuo tra licenza, modelli, spazio ed eventuale server. Una quota fissa è più facile da mettere a budget. Se usi la chat di rado, pagare a consumo può avere senso.",
        workflow:
          "Se vuoi tenere le chiavi o usare un modello locale, valuta LibreChat e Open WebUI. Se ti servono contesti separati per modello o cartelle di progetto, provali prima di migrare.",
      },
      faq: {
        best: {
          q: "Qual è la migliore alternativa a TypingMind?",
          a: "LibreChat è un’opzione da installare per usare più fornitori. Open WebUI è adatto ai modelli locali, OpenRouter Chat al confronto tra modelli e {{appName}} alla chat online con modelli diffusi e senza censura, senza configurare chiavi.",
        },
        free: {
          q: "C’è un’alternativa gratuita a TypingMind?",
          a: "Puoi installare LibreChat e Open WebUI gratuitamente nei termini delle rispettive licenze. Server e consumo dei modelli a pagamento sono a parte. {{appName}} offre {{guestCredits}} crediti al mese senza account.",
        },
        billing: {
          q: "La licenza TypingMind include l’uso delle API?",
          a: "No. Compri la licenza una volta e paghi i fornitori a consumo. In locale, i costi sono hardware ed elettricità. ChatGPT Plus è un abbonamento separato e non copre l’uso generale delle API OpenAI.",
        },
        privacy: {
          q: "Con la cronologia locale il modello funziona offline?",
          a: "No. TypingMind può salvare la cronologia sul dispositivo e inviare il prompt al fornitore online. Con Open WebUI e un modello interamente locale, cronologia ed elaborazione possono restare sul tuo hardware.",
        },
        switching: {
          q: "Posso passare da TypingMind a Poe o OpenRouter Chat?",
          a: "Sì. Poe gestisce l’accesso ai modelli con i punti del piano. OpenRouter Chat scala i costi dal saldo e può inviare la stessa richiesta a più modelli. Salva le chat importanti e verifica i formati di importazione prima di cambiare.",
        },
      },
    },
  },
};
