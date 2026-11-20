import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Email",
  tags: {
    emails: "Email",
  },
  title: "Elenco delle email",
  titleShort: "Elenco delle email",
  description:
    "Recuperare un elenco impaginato di e-mail con filtraggio e impaginazione",
  container: {
    title: "Elenco delle email",
    description:
      "Configurare i parametri dell'elenco e-mail e visualizzare i risultati",
  },
  filters: {
    title: "Filtri",
    description: "Filtro e email di ricerca",
  },
  displayOptions: {
    title: "Opzioni di visualizzazione",
  },
  fields: {
    dateRange: {
      title: "Gamma di date",
    },
    page: {
      label: "Pagina",
      description: "Numero di pagina per paginazione",
      placeholder: "Inserisci il numero di pagina",
    },
    limit: {
      label: "Limite",
      description: "Numero di articoli per pagina",
      placeholder: "Limiti di ingresso",
    },
    search: {
      label: "Cerca",
      description: "Cerca e-mail per soggetto, destinatario o mittente",
      placeholder: "Cercare e-mail...",
    },
    status: {
      label: "Stato",
      description: "Filtra per lo stato di e-mail",
      placeholder: "Selezionare lo stato",
    },
    channel: {
      label: "Canale",
      description: "Filtra per canale di messaggi",
    },
    type: {
      label: "Tipologia",
      description: "Filtra per email tipo",
      placeholder: "Selezionare il tipo",
    },
    sortBy: {
      label: "Ordina per",
      description: "Campo da smistamento",
      placeholder: "Seleziona il campo di selezione",
    },
    sortOrder: {
      label: "Ordinare",
      description: "Ordinare la direzione",
      placeholder: "Selezionare ordine ordinario",
    },
    dateFrom: {
      label: "Data da",
      description: "Filtra le email da questa data",
      placeholder: "Selezionare la data di inizio",
    },
    dateTo: {
      label: "Data di",
      description: "Filtra le email fino a questa data",
      placeholder: "Selezionare la data di fine",
    },
  },
  response: {
    emails: {
      title: "Email",
      emptyState: {
        title: "Nessuna email trovata",
        description: "Nessuna e-mail corrisponde ai filtri attuali",
      },
      item: {
        title: "Email",
        description: "Informazioni e-mail",
        id: "ID",
        subject: "Oggetto",
        recipientEmail: "Email sensibile",
        recipientName: "Nome del destinatario",
        senderEmail: "Email di pagamento",
        senderName: "Nome del fornitore",
        type: "Tipologia",
        status: "Stato",
        channel: "Canale",
        templateName: "Nome del modello",
        emailProvider: "Email Provider",
        externalId: "ID esterno",
        sentAt: "Inviato a",
        deliveredAt: "Consegnato a",
        openedAt: "Aperta",
        clickedAt: "Cliccato su",
        retryCount: "Conte di Retry",
        error: "Errore",
        userId: "Utente ID",
        leadId: "ID del contatto",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
        emailCore: {
          title: "Informazioni di base",
        },
        emailParties: {
          title: "Sender &amp; Recipiente",
        },
        emailMetadata: {
          title: "Metadati",
        },
        emailEngagement: {
          title: "Tracciamento dell'ingenuazione",
        },
        technicalDetails: {
          title: "Dettagli tecnici",
        },
        associatedIds: {
          title: "ID associati",
        },
        timestamps: {
          title: "Lampade da terra",
        },
      },
    },
    pagination: {
      title: "Pagina",
      description: "Informazioni sulla pagina",
      page: "Pagina corrente",
      limit: "Articoli per pagina",
      total: "Totale articoli",
      totalPages: "Pagine totali",
    },
    filters: {
      title: "Filtri applicati",
      description: "Filtri attualmente applicati",
      status: "Filtro di stato",
      type: "Tipo di filtro",
      search: "Ricerca di Query",
      dateFrom: "Data di inizio",
      dateTo: "Data di fine",
    },
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "I parametri previsti sono invalidi",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Devi essere autenticato per accedere a questa risorsa",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Non hai il permesso di accedere a questa risorsa",
    },
    notFound: {
      title: "Non trovato",
      description: "La risorsa richiesta non è stata trovata",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore del server interno",
      detail_list: "Non è possibile caricare messaggi: {{error}}",
      detail_get: "Non è possibile caricare il messaggio: {{error}}",
      detail_create: "Non è stato possibile salvare il messaggio: {{error}}",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto",
    },
    unsaved: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "La richiesta è in conflitto con lo stato attuale",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
  },
  success: {
    title: "Operazione riuscita",
    description: "Email recuperate con successo",
  },
  widget: {
    to: "A",
    retries: "Ritiri",
    opened: "Aperto",
    clicked: "Cliccato",
    stats: "Stat",
    graphs: "Grafi",
    refresh: "Aggiorna",
    searchPlaceholder: "Cercare e-mail...",
    clearSearch: "Azzera",
    emptyState: "Nessuna email trovata",
    emptyFiltered: "Nessun email corrisponde ai tuoi filtri",
    page: "Pagina",
    tabs: {
      all: "Tutti",
      sent: "Inviato",
      delivered: "Consegnato",
      opened: "Aperto",
      failed: "Sfigato",
      bounced: "Bounce",
    },
  },
  enums: {
    status: {
      pending: "Finanziamenti",
      sent: "Inviato",
      delivered: "Consegnato",
      opened: "Aperto",
      clicked: "Cliccato",
      bounced: "Bounce",
      failed: "Sfigato",
      unsubscribed: "Iscrizione annullata",
    },
    statusFilter: {
      any: "Tutti gli stati",
    },
    type: {
      transactional: "Transazione",
      marketing: "Marketing",
      notification: "Notifica",
      system: "Sistema",
      leadCampaign: "Campagna di acquisizione contatti",
      userCommunication: "Comunicazione dell'utente",
    },
    typeFilter: {
      any: "Tutti i tipi",
    },
    channel: {
      email: "Email",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Tutti i canali",
    },
    sortField: {
      subject: "Oggetto",
      recipientEmail: "Email sensibile",
      recipientName: "Nome del destinatario",
      type: "Tipologia",
      status: "Stato",
      sentAt: "Inviato a",
      createdAt: "Creato a",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
  },
};
