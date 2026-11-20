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
    greeting: "Ciao.",
    greetingNamed: "Ciao {{name}},",
    signoff: "Massimo",
    signature: "unbottled.ai",
    senderName: "Max da unbottled.ai",
    unsubscribeText: "Cancellazione:",
    firstChatPrompts: {
      subject: "Tre primi messaggi, pronti a incollare",
      preview:
        "Un'immagine non censurata, una mainstream, una sola immagine. Scegline uno, fallo.",
      intro:
        "Il tuo account è pronto e la chat è ancora vuota. Qui ci sono tre messaggi per iniziare. Ricevuto, incollalo, manda.",
      uncensoredTitle: "Chiedere senza la lezione",
      uncensoredPrompt:
        '"Scrivi una storia del crimine oscuro dove vince il cattivo. Niente lieto fine, niente morale." Scegli uno dei modelli non censurati {{uncensoredCount}}. Si conferma una volta che hai 18 anni o più.',
      mainstreamTitle: "Metta i grandi nomi fianco a fianco",
      mainstreamPrompt:
        '"Plan un weekend economico a Lisbona. Dove mangiare, cosa saltare." Chiedi prima a GPT. Quindi passare a Claude o Gemini nello stesso thread e confrontare.',
      mediaTitle: "Fai un'immagine, un video o una canzone",
      mediaPrompt:
        '"Una volpe in una sciarpa rossa su una strada di Tokyo nevosa di notte, fotografia di film." Un prompt, un\'immagine. Brevi video e musica funzionano allo stesso modo.',
      body: "Il tuo account gratuito ottiene crediti {{freeCreditsSignedIn}} ogni mese, {{freeCreditsMax}} con la newsletter su. Niente carta.",
      cta: "Invia il tuo primo messaggio",
      ps: "P.S. Non so da dove cominciare? Rispondi a questa email. Abbiamo letto le risposte.",
    },
    outOfCredits: {
      subject: "I crediti gratuiti di questo mese vengono utilizzati",
      preview:
        "Tornano al primo. O continuate, i piani da {{subscriptionPrice}} al mese.",
      intro:
        "Hai usato tutti i crediti gratuiti di questo mese. Tornano al primo. Non vuoi aspettare? Scegli un piano. Prezzi allineati.",
      starterTitle: "Starter: {{subscriptionPrice}} /mese",
      starterBody:
        "{{subscriptionCredits}} si accredita ogni mese. Cancellare in qualsiasi momento. Si adatta se si chat più giorni.",
      moreTitle: "Ne hai bisogno? Tre piani più grandi",
      moreBody:
        "Inoltre: crediti {{plusCredits}} per {{plusPrice}}. Pro: {{proCredits}} per {{proPrice}}. Ultra: {{ultraCredits}} per {{ultraPrice}}. Ogni piano può aggiungere pacchetti top-up che non scadono mai.",
      body: "Paga con carta, PayPal o crypto. Stessi modelli, stesse impostazioni del filtro.",
      cta: "Ottieni crediti {{subscriptionCredits}} per {{subscriptionPrice}}",
      ps: "P.S. Aspettare la prima è bene anche. I tuoi fili rimangono dove sono.",
    },
    whatsNew: {
      subject: "Cosa è cambiato mentre eri via",
      preview: "Modelli {{modelCount}}, video e musica in chat, e francese.",
      intro:
        "La tua ultima chiacchierata e' stata piu' di una settimana fa. Ecco cosa c'e' di nuovo.",
      modelsTitle: "Modelli di chat {{modelCount}}",
      modelsBody:
        "{{mainstreamCount}} mainstream, {{openCount}} aperto, {{uncensoredCount}} non censurato. Passare tra loro metà del tempo.",
      mediaTitle: "Immagini, video e musica",
      mediaBody:
        "Digitare un prompt nella chat. Torna indietro una foto, un corto clip o una traccia.",
      languagesTitle: "Ora in francese",
      languagesBody: "L'intera app è in inglese, tedesco, polacco e francese.",
      body: "I tuoi fili sono proprio dove li hai lasciati.",
      cta: "Sfoglia tutti i modelli",
      ps: "P.S. Conosci qualcuno che lo userebbe? Il tuo link di riferimento ti paga {{referralPercent}} % di tutto ciò che spendono, ogni mese.",
    },
    winBack: {
      subject: "Un'ultima email da noi",
      preview: "Il tuo account, thread e crediti gratuiti sono ancora qui.",
      intro:
        "La tua ultima chiacchierata e' stata piu' di un mese fa. Questa e' l'ultima nudge che ci viene da noi.",
      body: "Il tuo account, i tuoi thread e i tuoi crediti gratuiti mensili sono ancora lì. Più modelli che l'ultima volta, e il filtro è ancora tuo da impostare.",
      cta: "Ritirata dove ti sei lasciato",
      ps: "P.S. Cosa ti ha fatto scendere? Colpisci la risposta e dicci. Leggiamo ogni risposta.",
    },
    inviteSignup: {
      subject: "Hai letto la newsletter. Ora utilizzare l'app.",
      preview:
        "Conto gratuito, fino a crediti {{freeCreditsMax}} al mese. Niente carta.",
      intro:
        "Hai la nostra newsletter. L'applicazione è a un passo di distanza: modelli {{modelCount}}, e si imposta il filtro.",
      guestTitle: "Nessun conto: Crediti {{freeCreditsGuest}} al mese",
      guestBody: "Abbastanza da testare alcuni modelli.",
      accountTitle: "Conto gratuito: Crediti {{freeCreditsSignedIn}} al mese",
      accountBody: "I filetti salvati, su ogni dispositivo.",
      newsletterTitle:
        "Account + newsletter: Crediti {{freeCreditsMax}} al mese",
      newsletterBody: "Tenere la newsletter sul tuo account e il bonus è tuo.",
      body: "Niente carta. Accendere i crediti gratuiti una volta confermata la tua email.",
      cta: "Crea il mio account gratuito",
    },
    inviteReminder: {
      subject: "Ultimo promemoria: il tuo account gratuito",
      preview:
        "{{freeCreditsMax}} accredita un mese invece di {{freeCreditsGuest}}. Niente carta.",
      intro:
        "Ultimo promemoria. Un account gratuito con la newsletter riceve crediti {{freeCreditsMax}} ogni mese. Senza uno: {{freeCreditsGuest}}.",
      body: "Ci vuole un minuto. Niente carta.",
      cta: "Crea il mio account gratuito",
      ps: "P.S. Non ci sono più promemoria dopo questo. La newsletter continua a venire come al solito.",
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
        paused: "Paused",
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
        paused: "Paused",
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
        paused: "Paused",
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
    pausedTitle: "Paused",
    pausedBody: "Nulla è iscritto o inviato.",
    liveTitle: "Live",
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
