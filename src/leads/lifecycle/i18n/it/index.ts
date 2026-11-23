import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Ciclo di vita",
  enums: {
    journey: {
      firstChat: "Registrato, mai chattato",
      outOfCredits: "Crediti gratuiti utilizzati",
      whatsNew: "Tranquillo per 7 giorni",
      winBack: "Silenzio per 30 giorni",
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
      outOfCredits: "Fuori dai crediti: piani",
      whatsNew: "Cosa c'è di nuovo",
      winBack: "Win-back: ultima email",
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
    signoff: "Max",
    signature: "unbottled.ai",
    senderName: "Max di unbottled.ai",
    unsubscribeText: "Annulla l'iscrizione:",
    firstChatPrompts: {
      subject: "Tre primi messaggi, pronti da incollare",
      preview:
        "Uno senza censura, uno mainstream, un'immagine. Scegline uno e invia.",
      intro:
        "Il tuo account è pronto e la chat è ancora vuota. Ecco tre messaggi per iniziare. Copiane uno, incollalo, invia.",
      uncensoredTitle: "Chiedi senza prediche",
      uncensoredPrompt:
        '"Scrivi un noir in cui vince il cattivo. Niente lieto fine, niente morale." Scegli uno dei {{uncensoredCount}} modelli senza censura. Confermi una volta sola di avere almeno 18 anni.',
      mainstreamTitle: "Metti a confronto i big",
      mainstreamPrompt:
        '"Organizza un weekend low cost a Lisbona. Dove mangiare, cosa saltare." Chiedi prima a GPT. Poi passa a Claude o Gemini nello stesso thread e confronta.',
      mediaTitle: "Crea un'immagine, un video o una canzone",
      mediaPrompt:
        '"Una volpe con una sciarpa rossa in una strada innevata di Tokyo, di notte, foto su pellicola." Un prompt, un\'immagine. Video brevi e musica funzionano allo stesso modo.',
      body: "Il tuo account gratuito riceve {{freeCreditsSignedIn}} crediti ogni mese, {{freeCreditsMax}} con la newsletter attiva. Nessuna carta.",
      cta: "Invia il tuo primo messaggio",
      ps: "P.S. Non sai da dove partire? Rispondi a questa email. Leggiamo le risposte.",
    },
    outOfCredits: {
      subject: "I crediti gratuiti di questo mese sono finiti",
      preview:
        "Tornano il giorno 1. Oppure continua subito, piani da {{subscriptionPrice}} al mese.",
      intro:
        "Hai usato tutti i crediti gratuiti di questo mese. Tornano il giorno 1. Non vuoi aspettare? Scegli un piano. Prezzi chiari.",
      starterTitle: "Starter: {{subscriptionPrice}}/mese",
      starterBody:
        "{{subscriptionCredits}} crediti ogni mese. Disdici quando vuoi. Perfetto se chatti quasi ogni giorno.",
      moreTitle: "Ti serve di più? Tre piani più grandi",
      moreBody:
        "Plus: {{plusCredits}} crediti a {{plusPrice}}. Pro: {{proCredits}} a {{proPrice}}. Ultra: {{ultraCredits}} a {{ultraPrice}}. Ogni piano può aggiungere pacchetti di ricarica che non scadono mai.",
      body: "Paga con carta, PayPal o crypto. Stessi modelli, stesse impostazioni del filtro.",
      cta: "{{subscriptionCredits}} crediti a {{subscriptionPrice}}",
      ps: "P.S. Aspettare il giorno 1 va benissimo. I tuoi thread restano dove sono.",
    },
    whatsNew: {
      subject: "Cosa è cambiato mentre eri via",
      preview: "{{modelCount}} modelli, video e musica in chat, sei lingue.",
      intro:
        "La tua ultima chat risale a più di una settimana fa. Ecco le novità.",
      modelsTitle: "{{modelCount}} modelli di chat",
      modelsBody:
        "{{mainstreamCount}} mainstream, {{openCount}} open, {{uncensoredCount}} senza censura. Passa dall'uno all'altro nello stesso thread.",
      mediaTitle: "Immagini, video e musica",
      mediaBody:
        "Scrivi un prompt in chat. Ricevi un'immagine, una clip breve o un brano.",
      languagesTitle: "Sei lingue",
      languagesBody:
        "Tutta l'app è disponibile in italiano, inglese, tedesco, polacco, francese e spagnolo.",
      body: "I tuoi thread sono esattamente dove li hai lasciati.",
      cta: "Scopri tutti i modelli",
      ps: "P.S. Conosci qualcuno a cui servirebbe? Il tuo link referral ti paga il {{referralPercent}}% di tutto ciò che spende, ogni mese.",
    },
    winBack: {
      subject: "Un'ultima email da parte nostra",
      preview: "Il tuo account, i thread e i crediti gratuiti sono ancora qui.",
      intro:
        "La tua ultima chat risale a più di un mese fa. Questo è l'ultimo promemoria che ti mandiamo.",
      body: "Il tuo account, i tuoi thread e i crediti gratuiti mensili sono ancora lì. Ci sono più modelli dell'ultima volta, e il filtro lo decidi sempre tu.",
      cta: "Riprendi da dove avevi lasciato",
      ps: "P.S. Cosa ti ha frenato? Rispondi e diccelo. Leggiamo ogni risposta.",
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
      name: "Ciclo di vita: prima chat",
      description:
        "48 h dopo l'iscrizione, conto verificato, non chat ancora. Tre richiami concreti.",
    },
    outOfCredits: {
      name: "Ciclo di vita: fuori dai crediti",
      description:
        "Crediti gratuiti per il mese utilizzato, mai pagato. Prezzi del piano.",
    },
    whatsNew: {
      name: "Ciclo di vita: cosa è nuovo",
      description: "7 giorni senza chattare. Modelli, media, lingue.",
    },
    winBack: {
      name: "Ciclo di vita: win-back",
      description: "30 giorni senza chattare. Ultimo viaggio email.",
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
      title: "Esegui i viaggi del ciclo di vita",
      titleShort: "Ciclo di vita",
      description:
        "Iscrive i contatti appena idonei e invia le email di viaggio. Non fa niente mentre l'interruttore di eliminazione è acceso.",
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
