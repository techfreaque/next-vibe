import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Crescita",
  tags: {
    vibeSense: "vibe-sense",
    growth: "crescita",
    campaigns: "campagne",
    spend: "spendere",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    funnelStep: {
      visit: "Prima visita",
      chat: "Primo messaggio di chat",
      signup: "Firma",
      newsletter: "Newsletter confermata",
      paid: "Pagamento anticipato",
      retained: "Rinnovo del secondo mese",
    },
    attributionTouch: {
      first: "Primo tocco",
      last: "Ultimo tocco",
    },
    channelType: {
      all: "Tutti i canali",
      campaign: "Campagna (UTM)",
      referral: "Codice invito",
      organic: "Riferimento organico",
      direct: "Regia",
    },
    paidKind: {
      subscription: "Abbonamento",
      pack: "Pacchetto di crediti",
    },
  },
  links: {
    get: {
      title: "Link di campagna",
      titleShort: "Link di campagna",
      description:
        "Tagged collegamenti per canale di marketing, con visite, iscrizioni e utenti paganti ogni link portato.",
      response: {
        links: "Links",
      },
      widget: {
        title: "Collegamenti di campagna",
        subtitle: "Etichetta ogni test di canale. Giudicalo da chi paga.",
        create: "Nuovo link",
        refresh: "Aggiorna",
        loading: "Caricamento in corso...",
        empty: {
          title: "Nessun link per la campagna",
          hint: "Creare un link per prova canale. Ogni visita, iscrizione e pagamento porta terre qui.",
          cta: "Crea il primo link",
        },
        visits: "Visite",
        signups: "Registrazioni",
        paid: "Pagato",
        funnel:
          "Visite {{visits}} → Registrazioni {{signups}} → {{paid}} pagato",
        paidRate: "{{rate}} delle visite pagate",
        refCode: "Ref. {{code}}",
        landsOn: "Destinazione: {{path}}",
        copy: "Copia il link",
        copied: "Affrontato",
        spend: "Spese di canale",
      },
    },
    post: {
      title: "Creare un link campagna",
      titleShort: "Nuovo link",
      description:
        "Costruire un link UTM -tagged per un canale, facoltativamente legato a un codice di riferimento.",
      fields: {
        name: {
          label: "Nome",
          description:
            "Nome interno, ad esempio 'Reddit r/LocalLLaMA launch post'",
          placeholder: "Post di lancio Reddit",
        },
        channel: {
          label: "Fonte (utm_source)",
          description: "Da dove proviene il traffico: reddit, youtube, x",
          placeholder: "reddit",
        },
        medium: {
          label: "Media (utm_medium)",
          description: "Tipo di traffico: sociale, cpc, email, video",
          placeholder: "social",
        },
        campaign: {
          label: "Campagna (utm_campaign)",
          description: "La prova che questo link appartiene a",
          placeholder: "launch-nov",
        },
        content: {
          label: "Contenuto (utm_content)",
          description: "Facoltativo. Quale creativo o collocamento",
          placeholder: "top-comment",
        },
        term: {
          label: "Termine (utm_term)",
          description: "Facoltativo. Parola chiave a pagamento",
          placeholder: "non censurato",
        },
        destinationPath: {
          label: "Percorso di atterraggio",
          description:
            "Percorso su questo sito il link si apre, ad esempio / o /en- US /story",
          placeholder: "/",
        },
        refCode: {
          label: "Codice invito",
          description:
            "Facoltativo. Percorsi la visita attraverso /track in modo che il codice di riferimento sia accreditato troppo",
          placeholder: "FRIEND2024",
        },
      },
      response: {
        id: "Link ID",
        url: "Campagna URL",
      },
      widget: {
        back: "Indietro",
        hint: "Stessa fonte per lo stesso canale, ogni volta. Spese e costi per gruppo di utenti paganti per fonte.",
        created: "Collegamento pronto. Condividi questo esatto URL:",
        copy: "Copia il link",
        copied: "Affrontato",
      },
    },
  },
  spend: {
    get: {
      title: "Trasmissione di canali",
      titleShort: "Trasmissione di canali",
      description:
        "Trascorrere per canale e periodo, con iscrizioni, utenti paganti e costi per utente pagato.",
      response: {
        rows: "Trascorrere le voci",
      },
      widget: {
        title: "Spese di canale",
        subtitle:
          "Ciò che ogni canale costa, e che cosa un utente pagante ti costa.",
        add: "Aggiungere la spesa",
        refresh: "Aggiorna",
        loading: "Caricamento in corso...",
        empty: {
          title: "Nessuna spesa registrata",
          hint: "Accedi a quale costo di prova del canale. Il costo per l'utente paga appare non appena porta qualcuno che paga.",
          cta: "Log primo passo",
        },
        period: "{{from}} – {{to}}",
        signups: "Registrazioni",
        paid: "Utenti che pagano",
        costPerPaid: "Costo / utente pagato",
        costPerSignup: "Costo / iscrizione",
        none: ", ",
        attribution:
          "Gli utenti contano verso il canale che li ha portati per la prima volta (primo tocco), entro il periodo.",
      },
    },
    post: {
      title: "Trascorrere il canale",
      titleShort: "Trascorsi",
      description:
        "Registra il costo di un canale in un periodo. Stesso canale e data di inizio sovrascrive l'ingresso.",
      fields: {
        channel: {
          label: "Canale",
          description:
            "utm_source del canale, o ref: CODE per un partner di riferimento",
          placeholder: "reddit",
        },
        periodStart: {
          label: "Da",
          description: "Primo giorno del periodo di spesa",
        },
        periodEnd: {
          label: "A",
          description: "Ultimo giorno del periodo di spesa",
        },
        amount: {
          label: "Importo",
          description: "Totale speso nel periodo",
        },
        currency: {
          label: "Valuta",
          description: "Valuta dell'importo",
        },
        note: {
          label: "Nota",
          description: "Facoltativo. Che cosa hanno comprato i soldi",
          placeholder: "2 posti promossi",
        },
      },
      response: {
        id: "Entrata ID",
      },
      widget: {
        back: "Indietro",
        hint: "Utilizzare il nome di origine esatto che i link campagna utilizzare, o il grafico non può corrispondere spendere agli utenti.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Dimensione del secchio",
      },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
      touch: {
        label: "Attribution",
        description: "Gruppo al primo o all'ultimo tocco",
      },
      channelType: {
        label: "Tipo di canale",
        description: "Campagna, referral, organico, diretto - o tutto",
      },
      channel: {
        label: "Canale",
        description:
          "Key del canale esatto: utm_source, ref: CODE, host del referrer o diretto. Vuoto = qualsiasi",
      },
      currency: {
        label: "Valuta",
        description: "Solo la spesa inserita in questa valuta è riassunta",
      },
    },
    funnelStep: {
      post: {
        title: "Passo del tunnel",
        titleShort: "Passo del tunnel",
        description:
          "Viaggi che raggiungono un passo imbuto di crescita per secchio, filtrabile per canale",
        fields: {
          step: {
            label: "Passo",
            description:
              "Fase di ingresso: visita, chat, iscrizione, newsletter, pagamento, trattenuta",
          },
          result: {
            label: "Percorsi",
            description: "Tasso di passo per secchio",
          },
        },
      },
    },
    channelSpend: {
      post: {
        title: "Trasmissione di canali",
        titleShort: "Trasmissione di canali",
        description:
          "Spesa di marketing per secchio, diffusa uniformemente su ogni periodo di spesa",
        fields: {
          result: {
            label: "Trascorrere",
            description: "Trascorrere per secchio",
          },
        },
      },
    },
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
        "Gli strumenti di crescita hanno bisogno del ruolo di amministratore",
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
    invalidRefCode: "Il codice referral {{code}} non esiste o non è inattivo",
    invalidPeriod:
      "La fine del periodo deve essere attivata o dopo il suo inizio",
    invalidDestination:
      "Il percorso di atterraggio deve iniziare con / e rimanere su questo sito",
  },
  success: {
    title: "Fatto",
    description: "Salvataggio",
  },
};
