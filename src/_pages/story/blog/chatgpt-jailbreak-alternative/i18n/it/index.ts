import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Jailbreak di ChatGPT non funziona più? Questo sì | {{appName}}",
    description:
      "Confronta le alternative ai prompt di jailbreak di ChatGPT, da {{appName}} e Venice a LM Studio e Ollama. Modelli, privacy e costi.",
    category: "Guida ai modelli",
    imageAlt:
      "Prompt di jailbreak di ChatGPT a confronto con modelli senza censura",
    keywords:
      "jailbreak ChatGPT, prompt jailbreak ChatGPT, prompt DAN, aggirare il filtro di ChatGPT, ChatGPT senza filtri, ChatGPT senza restrizioni, il jailbreak di ChatGPT funziona ancora, alternativa al jailbreak, alternativa a ChatGPT senza censura, modello abliterated, {{appName}}",
  },
  hero: {
    backToBlog: "Torna al blog",
    category: "Guida ai modelli",
    readTime: "7 min di lettura",
    title: "Alternative al jailbreak di ChatGPT a confronto",
    subtitle:
      "Confronta chat online e modelli locali per limiti, costi e privacy. Scopri {{count}} modelli per la scrittura e il gioco di ruolo.",
  },
  intro: {
    lead: "Un prompt che oggi cambia le risposte di ChatGPT può comportarsi diversamente dopo un aggiornamento. Scegli un modello adatto alla scrittura o al gioco di ruolo.",
    p2: "Confronta prima le chat online e le app locali. Su {{appName}} trovi anche {{count}} modelli con finestre di contesto e prezzi aggiornati.",
  },
  why: {
    title: "Perché i jailbreak di ChatGPT si rompono sempre",
    intro: "Tre strati separano il tuo prompt da una risposta diretta.",
    weights:
      "Il rifiuto sta nei pesi. I modelli GPT sono addestrati a declinare intere categorie di richieste. Un jailbreak non toglie quell'addestramento, prova ad aggirarlo a parole, una conversazione alla volta.",
    patched:
      "I jailbreak noti finiscono nell'addestramento. Appena un prompt si diffonde, entra nel giro successivo di addestramento alla sicurezza. Per questo il prompt del mese scorso oggi fallisce.",
    layer:
      "Può esserci anche un controllo fuori dal modello. Le app mainstream possono moderare input e output, quindi anche una risposta già scritta può essere segnalata o rimossa.",
  },
  cost: {
    title: "Quanto ti costa davvero un jailbreak",
    intro: "Anche quando funziona, lo paghi.",
    quality:
      "Risposte peggiori. Il modello mette l'impegno nel recitare un personaggio invece che nel rispondere. Le risposte in personaggio sono gonfiate, teatrali e spesso meno precise.",
    unstable:
      "Nessuna costanza. Lo stesso prompt funziona in una chat e fallisce nella successiva. Non ci costruisci sopra un flusso di lavoro.",
    account:
      "Rischio per l'account. Le norme d'uso di ChatGPT valgono per ogni prompt, e OpenAI può limitare o sospendere gli account che le violano. Un jailbreak è un tentativo di violarle di proposito.",
    time: "Tempo perso. Cercare, provare e riscrivere prompt richiede più tempo che fare la domanda.",
    callout:
      "Un jailbreak cura il sintomo. Il rifiuto nasce da come è stato addestrato il modello, quindi scegli un modello addestrato diversamente.",
  },
  instead: {
    title: "Il modello che non ha bisogno di jailbreak",
    intro: "Due tipi di modelli senza censura, due soluzioni diverse.",
    abliteratedTitle: "Abliterated: il rifiuto tolto dai pesi",
    abliterated:
      "Uno studio del 2024 ha rilevato che, nei modelli di chat testati, il rifiuto passa in gran parte da un'unica direzione dentro la rete. L'abliteration toglie quella direzione dai pesi. Il risultato è lo stesso modello, stesse conoscenze, stesso stile, che smette quasi del tutto di schivare le domande. Niente trucchi nel prompt, perché non resta niente da aggirare.",
    ownTitle: "{{ownModel}}: un'altra visione del mondo",
    own: "{{ownModel}} è addestrato su libri e documenti banditi dall'internet mainstream, con il risultato di un modello con opinioni politiche controcorrente. Non un modello mainstream senza freni, ma opinioni del tutto diverse.",
    sources: {
      paper:
        "Arditi et al., Refusal in language models is mediated by a single direction (2024)",
      blog: "Maxime Labonne, Uncensor any LLM with abliteration",
    },
    link: "Abliterated, fine-tuned o visione propria: la spiegazione completa",
  },
  models: {
    title: "{{count}} modelli senza censura, nessun jailbreak",
    intro:
      "Tutti i modelli senza censura attuali sulla nostra piattaforma, dal più economico. Contesto e prezzo dal nostro registro modelli.",
    colModel: "Modello",
    colContext: "Contesto",
    colPrice: "Per messaggio",
    colChat: "Provalo",
    chatLink: "Chatta con {{model}}",
    footnote:
      "Per messaggio significa uno scambio di riferimento sulla rotta più economica. Chat lunghe e risposte lunghe costano di più.",
  },
  test: {
    title: "Fai tu il test: stessa domanda, due modelli",
    intro: "Non fidarti di noi. Fai la domanda per cui cercavi il jailbreak.",
    steps: {
      ask: {
        title: "Chiedi a un modello mainstream",
        body: "Apri una chat e scegli GPT o un altro modello mainstream. Fai la domanda che di solito schiva. Annota la risposta.",
      },
      switch: {
        title: "Passa a un modello senza censura",
        body: "Cambia modello per il messaggio successivo, nella stessa chat. Conferma una volta i 18 anni quando ti viene chiesto.",
      },
      compare: {
        title: "Chiedi di nuovo, confronta",
        body: "Stessa domanda, niente personaggio, niente trucchi. Confronta lunghezza, franchezza e precisione.",
      },
      keep: {
        title: "Tieni quello che risponde",
        body: "Torna indietro quando vuoi. Modelli mainstream per il codice difficile, quelli senza censura per le domande che gli altri non toccano.",
      },
    },
    compareLink: "{{a}} vs {{b}}: fianco a fianco",
  },
  limits: {
    title: "Cosa nessun modello elimina",
    intro: "Senza censura non vuol dire magico. Conosci i limiti.",
    decline:
      "Può ancora rifiutare. L'abliteration toglie la maggior parte dei rifiuti appresi, non tutti. Il risultato dipende da modello e prompt.",
    wrong:
      "Può ancora sbagliare. Niente filtro vuol dire anche che nessuno ammorbidisce una risposta sbagliata. Verifica i fatti che contano.",
    adult:
      "Solo per adulti. I modelli senza censura si sbloccano dopo una conferma 18+ una tantum e l'accettazione dei termini.",
    callout:
      "Quello che generi e pubblichi è una tua responsabilità, e la legge del tuo paese resta valida.",
  },
  faq: {
    title: "FAQ",
    work: {
      q: "I prompt di jailbreak per ChatGPT funzionano ancora?",
      a: "A volte, per poco. I prompt popolari finiscono nell'addestramento e la moderazione intercetta molti output, quindi un prompt che funziona dura raramente. La strada affidabile è un modello senza rifiuto appreso.",
    },
    dan: {
      q: "Cos'è il prompt DAN?",
      a: "DAN (Do Anything Now) è un jailbreak a gioco di ruolo che chiede a ChatGPT di interpretare un personaggio senza regole. Le sue versioni vengono corrette una dopo l'altra, e le risposte in personaggio tendono a essere peggiori di quelle normali.",
    },
    ban: {
      q: "Posso essere bannato per un jailbreak di ChatGPT?",
      a: "Le norme d'uso di OpenAI valgono per ogni prompt, e OpenAI può limitare o sospendere gli account che le violano. Un modello costruito per rispondere evita del tutto il problema.",
    },
    gpt: {
      q: "Posso usare GPT senza filtri su {{appName}}?",
      a: "No. GPT mantiene le protezioni di OpenAI ovunque, anche qui. Per risposte senza filtri scegli uno dei {{count}} modelli senza censura. Passi da GPT a loro nella stessa chat.",
    },
    legal: {
      q: "È legale usare un modello di IA senza censura?",
      a: "Un modello è uno strumento. Quello che generi e pubblichi è una tua responsabilità, e vale la legge del tuo paese. Su {{appName}} i modelli senza censura si sbloccano dopo una conferma 18+ una tantum.",
    },
    free: {
      q: "Posso provare gratis un modello senza censura?",
      a: "Sì. {{appName}} dà {{guestCredits}} crediti gratuiti al mese senza account e {{freeCredits}} con un account gratuito, {{maxCredits}} con la newsletter. Quanti messaggi siano dipende dal modello e dalla lunghezza della chat.",
    },
    alternativeLink:
      "Un'alternativa a ChatGPT senza filtri: la nostra scelta di modelli",
    refusalLink: "Quale IA risponde davvero? L'indice dei rifiuti",
    chatLink: "Chat IA senza censura nel browser",
  },
  cta: {
    title: "Niente jailbreak. Fai la domanda.",
    subtitle:
      "{{guestCredits}} crediti gratuiti al mese, nessun account. Scegli un modello senza censura e chiedi senza giri di parole.",
    start: "Avvia una chat senza censura",
    models: "Confronta tutti i modelli",
  },
};
