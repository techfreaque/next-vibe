import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Primi contatti",
  tags: {
    outreach: "outreach",
    crm: "crm",
    deals: "offerte",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Inviato",
      replied: "Sostituito",
      interested: "Interessi",
      deal: "Affare fatto",
      declined: "Declinato",
      optOut: "Optato fuori",
      bounced: "Bounce",
    },
    contactKind: {
      creator: "Creatore",
      newsletter: "Newsletter",
      directory: "Elenco",
      other: "Altro",
    },
    direction: {
      out: "Inviato da noi",
      in: "Rispondi da loro",
    },
    dealStatus: {
      proposed: "Proposta",
      committed: "Impegno",
      paid: "Pagato",
      canceled: "Annullamento",
    },
    angleGroup: {
      affiliate: "A · Affiliato",
      audienceFit: "B · Adattamento di Audience",
      mission: "C · Discorso gratuito / privacy",
      tryIt: "D · Provare / ottenere elencato",
      video: "Richiesta di video",
      infoFirst: "Tassi prima",
      negotiation: "Negoziazione",
      other: "Altro",
    },
    attributionBasis: {
      tracked: "Tracciato link / codice ref",
      channel: "A livello di canale",
      none: "Non rintracciato",
    },
  },
  crm: {
    get: {
      title: "Outreach CRM",
      titleShort: "Primi contatti",
      description:
        "Ogni contatto ha lanciato, dove ognuno si trova, e ciò che le offerte pagate hanno riportato in cartelloni e ricavi.",
      fields: {
        status: {
          label: "Stato",
          description: "Solo contatti in questo stato",
        },
        kind: {
          label: "Tipo...",
          description: "Creatore, newsletter, directory o altro",
        },
        angle: {
          label: "Angolo",
          description:
            "Prefisso angolo piazzola, ad es. A, B-audience-fit, VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Cerca",
          description: "Nome, e-mail, soggetto o note",
          placeholder: "Nome di ricerca, e-mail, soggetto...",
        },
        page: { label: "Pagina", description: "Numero di pagina" },
        limit: { label: "Per pagina", description: "Contatti per pagina" },
      },
      response: {
        summary: "Riepilogo",
        angles: "Angoli",
        contacts: "Contatti",
        deals: "Offerte",
        dealTotals: "Totale delle offerte",
      },
      widget: {
        title: "Primi contatti",
        subtitle:
          "Chi abbiamo lanciato, chi ha risposto, che cosa i soldi hanno comprato.",
        refresh: "Aggiorna",
        addContact: "Contatto",
        addDeal: "Aggiungi un'offerta",
        import: "Importa il registro",
        loading: "Caricamento in corso...",
        allStatuses: "Tutti",
        clearFilters: "Cancella filtri",
        kpi: {
          contacts: "Contatti",
          replyRate: "Tasso di risposta",
          replyRateHint: "{{replied}} di {{total}} risponde",
          deals: "Offerte a pagamento",
          spent: "Spettacolo",
          spentHint: "{{committed}} impegnato, non pagato ancora",
        },
        angles: {
          title: "Angoli",
          hint: "Tasso di risposta per angolo di lancio. Ruota verso quali risposte.",
          row: "{{contacts}} lanciato · {{replied}} ha risposto",
        },
        contacts: {
          title: "Contatti",
          columns: {
            contact: "Contatto",
            status: "Stato",
            angle: "Angolo",
            last: "Ultimo contatto",
            touches: "Email",
          },
          showing: "{{start}} – {{end}} di {{total}}",
          never: "mai",
          replied: "ha risposto {{date}}",
        },
        deals: {
          prepareBill: "Prepara fattura fornitore",
          title: "Offerte a pagamento",
          hint: "Trascorrere contro le visite, le iscrizioni e i ricavi ogni link tracciato dell'affare o il codice ref introdotto.",
          columns: {
            deal: "Affare fatto",
            status: "Stato",
            spend: "Trascorrere",
            visits: "Visite",
            signups: "Registrazioni",
            paying: "Pagamenti",
            revenue: "Ricavi",
            costPerSignup: "Costo / iscrizione",
          },
          live: "live {{date}}",
          basisChannel: "canale-wide, non affare specifico",
          basisNone: "nessun link, campagna o codice ref per abbinare",
          empty: {
            title: "Non sono ancora state pagate",
            hint: "Accedi a un accordo nel momento in cui un creatore accetta un prezzo. Collegare il link tracciato o codice ref in modo che i risultati a terra qui.",
          },
        },
        empty: {
          title: "Nessun outreach registrato",
          hint: "Importare il registro inviato, o registrare ogni e-mail come esce.",
          cta: "Importa il registro inviato",
          filtered: "Nessun contatto corrisponde a questi filtri",
        },
        text: {
          header:
            "{{total}} contatti · {{replied}} ha risposto ({{rate}}) · {{deals}} offerte pagate",
          statusLine: "Stato: {{counts}}",
          anglesTitle: "angoli (preso / risposto):",
          contactsTitle: "Contatti {{start}} - {{end}} di {{total}} :",
          dealsTitle: "Offerte a pagamento:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · visite {{visits}} · signup {{signups}} · pagamento {{paying}} · entrate {{revenue}} · costo / spedizione {{cps}}",
          pageHint:
            "Page {{page}} / {{pages}} - use --page= {{next}} per altro",
          noContacts: "Nessun contatto corrisponde.",
          noDeals: "Non sono state registrate offerte pagate.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Log Outreach Contatto",
      titleShort: "Contatto",
      description:
        "Creare o aggiornare un contatto via email. Passare un soggetto per registrare l'e-mail che hai appena inviato (o ricevuto).",
      fields: {
        email: {
          label: "Email",
          description: "Contattare l'email. Case-insensibile abbinato",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Nome",
          description: "Creatore, presa o persona",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Tipo...",
          description: "Creatore, newsletter, directory o altro",
        },
        url: {
          label: "URL",
          description: "Canale, sito o pagina newsletter",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Angolo",
          description:
            "Angolo di punta, ad esempio. A-affiliato, B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Stato",
          description:
            "Si muove solo in avanti (sent → ha risposto → interessato → affare). Le esiti sempre applicabili",
        },
        forceStatus: {
          label: "Stato della forza",
          description:
            "Impostare lo stato esattamente, anche se si muove all'indietro",
        },
        notes: {
          label: "Osservazioni",
          description: "Sostituisci le note di contatto",
          placeholder:
            "Tasso scheda $550 integrazione, 20-150K visualizzazioni",
        },
        refCode: {
          label: "Codice di riflessione",
          description: "Codice di riferimento fornito a questo contatto",
          placeholder: "moemoe",
        },
        channel: {
          label: "Canale",
          description:
            "Chiave del canale di crescita, ad esempio youtube, newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "link campagna ID",
          description:
            "utm_id del loro link tracciato. I documenti sconosciuti sono calati",
        },
        subject: {
          label: "Oggetto e-mail",
          description: "Impostare per registrare un tocco per questa email",
          placeholder: "I tuoi spettatori vogliono già questo",
        },
        direction: {
          label: "Direzione",
          description: "Inviato da noi (default) o una risposta da loro",
        },
        at: {
          label: "Inviato a",
          description: "Quando l'e-mail è uscita. Predefiniti per ora",
        },
        touchNote: {
          label: "Nota elettronica",
          description: "Che cosa ha detto o chiesto l'email",
          placeholder: "Richiesta di carta di tasso",
        },
      },
      response: {
        id: "Contatto ID",
        created: "Creato",
        status: "Stato",
        previousStatus: "Stato precedente",
        touchLogged: "E-mail registrata",
        contactCount: "Email inviate",
        warning: "Avvertenza",
      },
      widget: {
        back: "Indietro",
        hint: "Una chiamata per e-mail inviata. La stessa e-mail aggiorna lo stesso contatto.",
        touchSection: "Questa email",
        contactSection: "Contatto",
        submit: "Salvare il contatto",
        warnOptOut: "Questo contatto ha optato per. Non e-mail di nuovo.",
        warnBounced:
          "L'indirizzo e' gia' rimbalzato. Controllalo prima di inviarlo.",
        saved: "{{status}} · email inviate: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Salvare l'offerta di Outreach",
      titleShort: "Risparmiare l'offerta",
      description:
        "Creare un accordo pagato per un contatto, o aggiornare uno da ID. Attaccare il link campagna, utm_campaign o codice ref per misurarlo.",
      fields: {
        id: {
          label: "Affare fatto ID",
          description: "Impostare per aggiornare un accordo esistente",
        },
        contactEmail: {
          label: "Contattare e-mail",
          description: "Richiesto un nuovo accordo. Crea il contatto se nuovo",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Nome del contatto",
          description: "Utilizzato solo quando il contatto non esiste ancora",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Fornitura",
          description: "Cosa comprano i soldi",
          placeholder: "Integrazione YouTube",
        },
        amount: {
          label: "Importo",
          description: "Prezzo totale, in unità di valuta",
        },
        currency: {
          label: "Valuta",
          description: "Valuta dell'importo",
        },
        status: {
          label: "Stato",
          description: "Proposta, impegnata, pagata o annullata",
        },
        channel: {
          label: "Canale",
          description:
            "Chiave del canale di crescita, stesso come il canale spend utilizza",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "link campagna ID",
          description:
            "utm_id del link tracciato. Tenuto vuoto se il collegamento non è su questo caso",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Valore della campagna sul link tracciato",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Codice di riflessione",
          description: "Codice referral le azioni del creatore",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Gos live",
          description: "Data di pubblicazione. I ricavi da qui",
        },
        paidAt: {
          label: "Pagato su",
          description: "Predefiniti a ora quando lo stato viene pagato",
        },
        notes: {
          label: "Osservazioni",
          description: "Metodo di pagamento, fattura, termini",
          placeholder: "Payoneer, ref 1059964703",
        },
      },
      response: {
        id: "Affare fatto ID",
        created: "Creato",
        status: "Stato",
        linkFound: "Link campagna trovata",
      },
      widget: {
        back: "Indietro",
        hint: "Le offerte ricevute o pagate spostano il contatto a Deal.",
        submit: "Risparmiare l'affare",
      },
    },
  },
  import: {
    post: {
      title: "Importa il registro di accesso",
      titleShort: "Importa il log",
      description:
        "Parsare un registro inviato (linee separate da tab o tabelle di markdown) in contatti e tocchi. Sicuro da rifare: le email già memorizzate sono saltate.",
      fields: {
        content: {
          label: "Contenuto di registro",
          description:
            "Incolla le linee di invio o le tabelle di chiamata-log.md. Funziona contro istanze remote",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "File server",
          description:
            "Percorsi separati sotto.tmp/ sul server, ad esempio.tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "Ignora e-mail",
          description: "Indirizzi separati da comma che non sono accessibili",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Corsa a secco",
          description: "Parse e conteggio, non scrivere nulla",
        },
      },
      response: {
        rowsParsed: "Righe parsed",
        contactsCreated: "Contatti creati",
        contactsUpdated: "Contatti aggiornati",
        touchesAdded: "E-mail aggiunte",
        touchesDuplicate: "Già conosciuto",
        statusChanges: "Cambiamenti di stato",
        skipped: "Linee guidate",
        skippedLines: "Dettaglio asciutto",
      },
      widget: {
        back: "Indietro",
        hint: "Incolla il registro o il punto nei file del server. Ogni e-mail viene memorizzata una volta, tuttavia spesso si importa.",
        submit: "Importazione",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "nessuna email valida",
    noDate: "nessuna data valida",
    skippedStatus: "marcato SKIPPED",
    ignored: "indirizzo ignorato",
    columns: "troppo poche colonne",
    unreadable: "file non leggibile",
    outsideTmp: "percorso esterno.tmp/",
  },
  errors: {
    validation: {
      title: "Input non valido",
      description: "Controllare i campi evidenziati",
    },
    unauthorized: {
      title: "Non firmato",
      description: "Accedi come amministratore",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Gli strumenti di Outreach hanno bisogno del ruolo di amministratore",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Questa voce non esiste",
    },
    conflict: {
      title: "Conflitto",
      description:
        "L'ingresso è cambiato nel frattempo, ricarica e riprovazione",
    },
    server: {
      title: "Errore del server",
      description: "Non è possibile completare la richiesta",
    },
    network: {
      title: "Errore di rete",
      description: "Richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di imprevisto è fallito",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima",
    },
    dealNotFound: "Nessun accordo con ID {{id}}",
    dealNeedsContact: "Un nuovo affare ha bisogno di un'e-mail di contatto",
    dealNeedsFields:
      "Un nuovo affare ha bisogno di un consegnabile e un importo",
    importEmpty:
      "Passare il contenuto del registro o almeno un file del server",
  },
  success: {
    title: "Fatto",
    description: "Salvataggio",
  },
};
