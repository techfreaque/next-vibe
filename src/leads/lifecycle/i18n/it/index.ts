import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Ciclo di vita",
  enums: {
    journey: {
      firstChat: "Registrato, mai chattato",
      outOfCredits: "Crediti gratuiti utilizzati",
      whatsNew: "Tranquillo per 7 giorni",
      winBack: "Silenzio per 30 giorni",
      customerCheckin: "Abbonato attivo: feedback",
      lapsedWinback: "Ha già pagato, 14 giorni fermo",
      newsletterInvite: "Newsletter, nessun conto",
    },
    enrollmentStatus: {
      active: "Attivo",
      completed: "Completo",
      exited: "Esercizio",
    },
    exitReason: {
      goalMet: "Incontro di gol",
      unsubscribed: "Iscrizione annullata",
      suppressed: "Suppresse",
      ineligible: "Non più ammissibili",
      sendFailed: "Invia fallo",
    },
    sendStatus: {
      pending: "Finanziamenti",
      sent: "Inviato",
    },
    template: {
      firstChatPrompts: "Prima chat: tre suggerimenti",
      firstChatSkills: "Prima chat: inizia uno skill",
      outOfCredits: "Fuori dai crediti: piani",
      whatsNew: "Cosa c'è di nuovo",
      winBack: "Win-back: ultima email",
      paymentFailed: "Pagamento non riuscito",
      customerLikes: "Cliente: cosa funziona",
      customerBuildNext: "Cliente: cosa costruire",
      lapsedWinback: "Ex cliente: perché ha smesso",
      inviteSignup: "Invitare: creare un account",
      inviteReminder: "Invito: promemoria",
    },
  },
  errors: {
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accesso all'amministratore richiesto",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Nessuna autorizzazione",
    },
    server: {
      title: "Errore del server",
      description: "Funzionamento del ciclo di vita guasto",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    validation: {
      title: "Input non valido",
      description: "Controlla i valori e riprova",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Account o sessione non trovati",
    },
    conflict: { title: "Conflitto", description: "Conflitto" },
    network: { title: "Errore di rete", description: "Errore di rete" },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Modifiche non salvate",
    },
  },
  emails: {
    greeting: "Ciao,",
    greetingNamed: "Ciao {{name}},",
    signoff: "Il team di unbottled.ai",
    senderName: "unbottled.ai",
    unsubscribeText: "Annulla l'iscrizione:",
    ctaLine: "{{text}}: {{url}}",
    footerAccount: "Ricevi questa email perché hai un account unbottled.ai.",
    footerAccountLink: "Non ricevere più queste email",
    footerBilling: "Questo è un avviso di pagamento sul tuo abbonamento.",
    newModels: {
      one: "nuovo modello",
      few: "nuovi modelli",
      many: "nuovi modelli",
      other: "nuovi modelli",
    },
    tier: {
      mainstream: "Mainstream",
      open: "Open source",
      uncensored: "Senza censura",
    },
    firstChatPrompts: {
      subject: "Tre primi messaggi. Copia, incolla, invia.",
      preview:
        "Una domanda che le IA filtrate schivano, una sfida tra modelli, un'immagine.",
      intro:
        "Il tuo account è pronto e la chat è ancora vuota. Prendi uno di questi messaggi, incollalo, invialo.",
      uncensoredTitle: "1. Chiedi quello che le IA filtrate schivano",
      uncensoredPrompt:
        "«Difendi in un dibattito la posizione che di solito ti rifiuteresti di sostenere. A tutto gas, senza avvertenze.» Usa uno dei {{uncensoredCount}} modelli senza censura. Confermi una volta sola di avere almeno 18 anni.",
      mainstreamTitle: "2. Metti i big uno contro l'altro",
      mainstreamPrompt:
        "«Organizza un weekend economico a Lisbona. Dove mangiare, cosa evitare.» Chiedi a GPT. Poi passa a Claude o Gemini nello stesso thread e confronta.",
      mediaTitle: "3. Crea un'immagine",
      mediaPrompt:
        "«Una volpe con una sciarpa rossa in una strada innevata di Tokyo di notte, foto su pellicola.» Un prompt, un'immagine.",
      body: "I tuoi crediti gratuiti sono già sul tuo account. Senza carta.",
      cta: "Apri la mia chat",
      ps: "P.S. Qualcosa non va? Rispondi a questa email. Rispondiamo a ogni messaggio.",
    },
    firstChatSkills: {
      subject: "Non sai cosa scrivere? Scegli uno skill.",
      preview: "Personaggi e specialisti con voce, modello e strumenti propri.",
      intro:
        "La casella di chat vuota è la parte più difficile. Uno skill dà alla chat un compito prima che tu scriva una parola.",
      characterTitle: "Personaggi",
      characterBody:
        "Compagni, partner di gioco di ruolo, critici taglienti. Ognuno ha la sua voce e non la perde.",
      specialistTitle: "Specialisti",
      specialistBody:
        "Un programmatore, un editor, un ricercatore. Ognuno porta istruzioni, modello e strumenti propri.",
      body: "Scegline uno e salutalo.",
      cta: "Scegli uno skill",
    },
    outOfCredits: {
      subject: "Crediti gratuiti quasi finiti. Tornano il {{resetDate}}.",
      preview: "Non perdi niente. Thread e impostazioni restano come sono.",
      intro:
        "Hai usato quasi tutti i crediti gratuiti di questo mese. Si ricaricano il {{resetDate}}.",
      cta: "Vedi i miei crediti",
      plansLink: "Vedi i piani",
    },
    paymentFailed: {
      subject: "Il pagamento del tuo abbonamento non è andato a buon fine",
      preview:
        "Il piano resta attivo fino al {{graceDate}}. Aggiorna il metodo di pagamento per mantenerlo.",
      intro:
        "Non siamo riusciti ad addebitare l'ultimo pagamento del tuo abbonamento.",
      body: "Il tuo piano resta attivo fino al {{graceDate}}. Aggiorna prima il metodo di pagamento per mantenerlo. La tua banca ha trattenuto l'addebito in attesa di approvazione (succede spesso con le carte indiane)? Approvalo dalla pagina del tuo account. Puoi anche ricaricare con un pacchetto di crediti una tantum o pagare in crypto.",
      cta: "Aggiorna il metodo di pagamento",
      ps: "P.S. Già sistemato? Allora ignora questa email.",
    },
    customerLikes: {
      subject: "Una settimana con noi. Cosa funziona e cosa no?",
      preview:
        "Due domande. Basta una riga. Un feedback utile vale {{feedbackCredits}} crediti.",
      intro: "Hai il tuo piano da una settimana. Grazie. Due domande:",
      likeTitle: "Cosa ti piace?",
      likeBody:
        "Il modello, la funzione, il momento in cui tutto ha funzionato. Dicci cosa tenere.",
      missingTitle: "Cosa manca o non va?",
      missingBody:
        "Un bug, un'impostazione poco chiara, qualsiasi cosa ti abbia rallentato.",
      body: "Rispondi a una delle due domande con una riga. Un feedback utile ti vale {{feedbackCredits}} crediti.",
      cta: "Invia feedback",
    },
    customerBuildNext: {
      subject: "Cosa dovremmo costruire adesso?",
      preview: "Puoi dire la tua su cosa costruiamo dopo.",
      intro: "Ci sostieni da più di un mese. Grazie.",
      body: "Una domanda: se potessimo costruire una sola cosa per te, quale sarebbe? Un modello, una funzione, una correzione. Rispondi con una riga. Un feedback utile ti vale {{feedbackCredits}} crediti.",
      cta: "Invia un'idea",
    },
    lapsedWinback: {
      subject: "Cosa avremmo potuto fare meglio?",
      preview:
        "Basta una riga. Un feedback utile vale {{feedbackCredits}} crediti.",
      intro:
        "Hai già pagato per unbottled.ai e non ti vediamo da un po'. Se qualcosa ti ha scoraggiato, vorremmo saperlo.",
      body: "Rispondi con una riga: il prezzo, un modello che manca, un bug, qualsiasi cosa. Un feedback utile ti vale {{feedbackCredits}} crediti.",
      cta: "Invia feedback",
      newsPs:
        "P.S. Dalla tua ultima visita abbiamo aggiunto {{newModelCount}} {{newModelsPhrase}}, tra cui {{modelList}}.",
      newsPsAll: "P.S. Dalla tua ultima visita abbiamo aggiunto {{modelList}}.",
    },
    whatsNew: {
      subject: "{{newModelCount}} {{newModelsPhrase}} dalla tua ultima visita",
      subjectOne: "Novità dalla tua ultima visita: {{newModelName}}",
      preview:
        "Arrivati dopo la tua ultima visita. Già nel selettore dei modelli.",
      intro:
        "Dalla tua ultima visita abbiamo aggiunto {{newModelCount}} {{newModelsPhrase}}. I più recenti:",
      introOne: "Dalla tua ultima visita abbiamo aggiunto un modello:",
      body: "Apri un thread qualsiasi e cambia modello. La cronologia resta.",
      bodyMore:
        "E altri {{moreCount}}. Apri un thread qualsiasi e cambia modello a metà conversazione.",
      cta: "Apri le mie chat",
      introAll:
        "Dalla tua ultima visita abbiamo aggiunto {{newModelCount}} {{newModelsPhrase}}:",
    },
    whatsNewQuiet: {
      subject: "Chiedi a un modello, poi a un altro",
      preview: "Cambia modello nella stessa chat e confronta.",
      intro: "Prova così: fai la stessa domanda a due modelli.",
      compareTitle: "Cambio di modello",
      compareBody:
        "Chiedi a un modello, passa a un altro nello stesso thread, confronta le risposte.",
      body: "I tuoi thread sono dove li hai lasciati.",
      cta: "Apri le mie chat",
    },
    winBack: {
      subject: "Cosa è mancato?",
      preview: "Cosa è mancato? Basta una riga.",
      intro:
        "La tua ultima chat risale a più di un mese fa. Una domanda: cosa è mancato? Rispondi, basta una riga. Leggiamo ogni risposta e sistemiamo quello che possiamo.",
      body: "Il tuo account e i tuoi thread sono ancora lì, e i crediti gratuiti si ricaricano ancora ogni mese.",
      cta: "Dicci cosa è mancato",
      newsPs:
        "P.S. Dalla tua ultima visita abbiamo aggiunto {{newModelCount}} {{newModelsPhrase}}, tra cui {{modelList}}.",
      newsPsAll: "P.S. Dalla tua ultima visita abbiamo aggiunto {{modelList}}.",
    },
    inviteSignup: {
      subject: "Leggi la newsletter. Ora prova l'app.",
      preview:
        "Account gratuito, fino a {{freeCreditsMax}} crediti al mese. Nessuna carta.",
      intro:
        "Ricevi la nostra newsletter. L'app è a un passo: {{modelCount}} modelli, e il filtro lo decidi tu.",
      guestTitle: "Senza account: {{freeCreditsGuest}} crediti al mese",
      guestBody: "Abbastanza per provare qualche modello.",
      accountTitle: "Account gratuito: {{freeCreditsSignedIn}} crediti al mese",
      accountBody: "I tuoi thread salvati, su ogni dispositivo.",
      newsletterTitle:
        "Account + newsletter: {{freeCreditsMax}} crediti al mese",
      newsletterBody:
        "Tieni attiva la newsletter nel tuo account e il bonus è tuo.",
      body: "Nessuna carta. I crediti gratuiti si attivano appena confermi la tua email.",
      cta: "Crea il mio account gratuito",
    },
    inviteReminder: {
      subject: "Ultimo promemoria: il tuo account gratuito",
      preview:
        "{{freeCreditsMax}} crediti al mese invece di {{freeCreditsGuest}}. Nessuna carta.",
      intro:
        "Ultimo promemoria. Un account gratuito con la newsletter attiva riceve {{freeCreditsMax}} crediti ogni mese. Senza account: {{freeCreditsGuest}}.",
      body: "Ci vuole un minuto. Nessuna carta.",
      cta: "Crea il mio account gratuito",
      ps: "P.S. Dopo questo, niente più promemoria. La newsletter continua ad arrivare come sempre.",
    },
  },
  emailTemplates: {
    category: "Viaggi nel ciclo di vita",
    preview: {
      name: {
        label: "Nome",
        description: "Un nome di saluto. Vuoto = saluto generico.",
      },
    },
    firstChatPrompts: {
      name: "Lifecycle: prima chat",
      description:
        "Servizio. 24 h dopo la registrazione, account verificato, nessuna chat. Tre primi messaggi pronti da incollare.",
    },
    firstChatSkills: {
      name: "Lifecycle: prima chat, skill",
      description:
        "Servizio. Giorno 5, ancora nessuna chat. Gli skill danno un compito alla chat.",
    },
    outOfCredits: {
      name: "Lifecycle: crediti finiti",
      description:
        "Servizio. Crediti gratuiti del mese finiti, mai pagato. Data di ricarica e piani.",
    },
    paymentFailed: {
      name: "Lifecycle: pagamento non riuscito",
      description:
        "Transazionale. Abbonamento scaduto: una email per pagamento fallito, piano attivo fino alla fine del periodo di tolleranza.",
    },
    customerLikes: {
      name: "Lifecycle: check-in cliente",
      description:
        "Servizio. Abbonato attivo, 7 giorni di piano. Solo richiesta di feedback, risposta via email, crediti per il feedback come promesso nel footer.",
    },
    customerBuildNext: {
      name: "Lifecycle: cosa costruire",
      description:
        "Servizio. Abbonato attivo, circa 5 settimane. Chiede cosa costruire dopo.",
    },
    lapsedWinback: {
      name: "Lifecycle: ex clienti",
      description:
        "Marketing. Ha già pagato, nessun piano attivo, 14 giorni fermo. Chiede il motivo, elenca i nuovi modelli.",
    },
    whatsNew: {
      name: "Lifecycle: novità",
      description:
        "Marketing. 7 giorni senza chat. Modelli aggiunti dall'ultima chat.",
    },
    winBack: {
      name: "Lifecycle: riconquista",
      description:
        "Marketing. 30 giorni senza chat. Ultima email del percorso, chiede cosa è mancato.",
    },
    inviteSignup: {
      name: "Ciclo di vita: newsletter invita",
      description:
        "Confermato abbonato newsletter senza un account, 48 h dopo la conferma.",
    },
    inviteReminder: {
      name: "Ciclo di vita: invito promemoria",
      description: "Una settimana dopo l'invito, ancora nessun conto.",
    },
  },
  run: {
    post: {
      title: "Campagne email automatizzate",
      titleShort: "Ciclo di vita",
      description:
        "Iscrive i nuovi contatti idonei e invia le email programmate. L’arresto di emergenza sospende entrambe le operazioni.",
      container: {
        title: "Ciclo di vita",
        description:
          "Iscrivetevi e inviate. Rispetta l'interruttore di eliminazione e il tappo di frequenza.",
      },
      fields: {
        dryRun: {
          label: "Simulazione",
          description: "Non fare niente, solo rapporto",
        },
      },
      response: {
        paused: "In pausa",
        enrolled: "Iscritta",
        sent: "Inviato",
        exited: "Esercizio",
        deferred: "Deferito",
        failed: "Sfigato",
      },
      success: {
        title: "Durata ciclo finito",
        description: "Sono stati elaborati due passi di viaggio",
      },
    },
  },
  settings: {
    post: {
      title: "Impostazioni del ciclo di vita",
      titleShort: "Impostazioni del ciclo di vita",
      description:
        "Interruttore di uccidere, tappo di frequenza, inviare la modalità di treccia e consenso per le e-mail del ciclo di vita.",
      container: {
        title: "Impostazioni del ciclo di vita",
        description:
          "Lascia un campo vuoto per mantenere il suo valore attuale.",
      },
      fields: {
        paused: {
          label: "Pausa tutto il ciclo di vita invio",
          description: "Su = nulla è iscritto o inviato",
        },
        minHoursBetweenEmails: {
          label: "Min ore tra e-mail",
          description:
            "Tappo di frequenza per contatto, attraverso il ciclo di vita e le campagne",
        },
        maxSendsPerRun: {
          label: "E-mail max per corsa",
          description: "Gomma per ogni corsa programmata",
        },
        autoEnrollWindowDays: {
          label: "Finestra di iscrizione automatica (giorni)",
          description:
            "L'esecuzione programmata iscrive solo contatti il cui trigger è questo recente. I contatti piu' vecchi passano attraverso il backfill.",
        },
        requireUserMarketingConsent: {
          label: "Richiedere il consenso di marketing per gli utenti",
          description:
            "On = gli utenti registrati hanno bisogno di consenso di marketing o di un opt-in per newsletter confermato",
        },
      },
      response: {
        paused: "In pausa",
        minHoursBetweenEmails: "Min ore tra e-mail",
        maxSendsPerRun: "E-mail max per corsa",
        autoEnrollWindowDays: "Finestra di iscrizione automatica (giorni)",
        requireUserMarketingConsent: "consenso di marketing richiesto",
      },
      success: {
        title: "Impostazioni salvate",
        description: "Le impostazioni del ciclo di vita sono in vigore",
      },
    },
  },
  backfill: {
    post: {
      title: "Ricambio del ciclo di vita",
      titleShort: "Ricambio",
      description:
        "Anteprima, quindi iscrivere i contatti ammissibili esistenti nel viaggio giusto. Comincia al punto 0, si diffonda su una finestra di invio.",
      container: {
        title: "Recuperare contatti esistenti",
        description:
          "L'esecuzione a secco è il default. Non viene inviato nulla durante la pausa.",
      },
      fields: {
        dryRun: {
          label: "Simulazione",
          description: "Conta solo. Spegni di iscriverti.",
        },
        spreadHours: {
          label: "Diffusione su (ore)",
          description: "Finestra le prime e-mail sono diffuse attraverso",
        },
      },
      response: {
        dryRunResult: "Simulazione",
        segments: "Segmenti",
        journey: "Viaggio",
        eligible: "Idonea",
        alreadyEnrolled: "Già iscritta",
        enrolled: "Iscritta",
        autoEligible: "Correre programmata si iscriverebbe",
        heldSuppressed: "Tenuto: non sottoscritto / rimbalzato",
        heldPaid: "Tenuto: già pagato",
        heldNoConsent: "Tenuto: nessun consenso di marketing",
        heldUnverified: "Tenuto: e-mail non verificata",
        heldPendingNewsletter: "Tenuto: newsletter non confermata",
        heldInactiveAccount: "Tenuto: vietato / inattivo",
        heldNothingDue: "Tenuto: niente dovuto (attivo, ha crediti)",
      },
      success: {
        title: "Riempimento finito",
        description: "I conti del segmento sono nella risposta",
      },
    },
  },
  overview: {
    get: {
      title: "Viaggi nel ciclo di vita",
      titleShort: "Ciclo di vita",
      description:
        "Viaggi, iscrizioni, invii e conversioni. Uccidi il commutatore e il backfill.",
      response: {
        paused: "In pausa",
        minHoursBetweenEmails: "Min ore tra e-mail",
        maxSendsPerRun: "E-mail max per corsa",
        autoEnrollWindowDays: "Finestra di iscrizione automatica (giorni)",
        requireUserMarketingConsent: "consenso di marketing richiesto",
        journeys: "Percorsi",
        steps: "Passi",
        enrolled: "Iscritta",
        active: "Attivo",
        completed: "Completo",
        exited: "Esercizio",
        converted: "Convertito",
        unsubscribed: "Iscrizione annullata",
        sent: "Inviato",
        sent24h: "Inviato (24h)",
        attributedPaid: "Pagato dopo l'iscrizione",
      },
      success: {
        title: "Ciclo di vita caricato",
        description: "Il viaggio è carico",
      },
    },
  },
  widget: {
    title: "Viaggi nel ciclo di vita",
    refresh: "Aggiorna",
    pausedTitle: "In pausa",
    pausedBody: "Nulla è iscritto o inviato.",
    liveTitle: "Attivo",
    liveBody: "Due e-mail escono su ogni corsa.",
    pause: "Pausa tutto.",
    resume: "Riprendi l'invio",
    settings: "Impostazioni",
    backfill: "Ricambio",
    capLine: "Cap: 1 e-mail per {{hours}} h. Max {{max}} per corsa.",
    consentOn: "Gli utenti hanno bisogno del consenso di marketing.",
    consentOff: "Gli utenti non hanno bisogno del consenso di marketing.",
    noJourneys: "Nessun viaggio.",
    stepsLine: "Passi {{steps}}",
    enrolled: "Iscritta",
    active: "Attivo",
    sent: "Inviato",
    sent24h: "Inviato (24h)",
    converted: "Convertito",
    paid: "Pagato dopo",
    unsubscribed: "Soggetto",
  },
};
