import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  tags: {
    leads: "Contatti",
    export: "Esportazione",
  },

  get: {
    title: "Esportazione Contatto",
    titleShort: "Esportazione Contatto",
    description: "L'esportazione porta i dati a file",
    form: {
      title: "Configurazione dell'esportazione",
      description:
        "Configurare i parametri di esportazione del contatto e i filtri",
    },
    format: {
      label: "Formato dell'esportazione",
      description: "Formato file per l'esportazione",
    },
    status: {
      label: "Stato del contatto",
      description: "Filtra per stato di contatto",
    },
    country: {
      label: "Paese",
      description: "Filtra per paese",
      placeholder: "Seleziona il paese",
    },
    language: {
      label: "Lingua",
      description: "Filtra per lingua",
      placeholder: "Seleziona la lingua",
    },
    source: {
      label: "Origine del contatto",
      description: "Filtra per fonte di contatto",
      placeholder: "Selezionare la sorgente",
    },
    search: {
      label: "Cerca",
      description: "La ricerca porta per testo",
      placeholder: "La ricerca porta...",
    },
    dateFrom: {
      label: "Data di inizio",
      description: "Esportazioni di cavi creati da questa data",
    },
    dateTo: {
      label: "Data di fine",
      description: "Export lead creati fino a questa data",
    },
    includeMetadata: {
      label: "Includere i metadati",
      description: "Includere la creazione e aggiornare i timestamp",
    },
    includeEngagementData: {
      label: "Includi i dati di coinvolgimento",
      description: "Includi il tracciamento e-mail e i dati della campagna",
    },
    response: {
      title: "Esporta file",
      description: "File di esportazione generato con i dati di contatto",
      fileName: "Nome del file",
      fileContent: "Contenuti file (Base64)",
      mimeType: "Tipo MIME",
      totalRecords: "Totale record",
      exportedAt: "Esportato a",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per esportare i cavi",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri o filtri di esportazione non validi",
      },
      server: {
        title: "Errore del server",
        description:
          "Errore del server interno è avvenuto durante l'esportazione",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore sconosciuto si è verificato durante l'esportazione",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete si è verificato durante l'esportazione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato all'esportazione di contatto",
      },
      notFound: {
        title: "Nessun dato",
        description:
          "Nessun indizio trovato corrispondenti criteri di esportazione",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Il conflitto di dati si è verificato durante l'esportazione",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description:
          "Ci sono cambiamenti non rilevati nel modulo di esportazione",
      },
    },
    success: {
      title: "Esportazione completa",
      description: "Esportazione di contatto completata con successo",
    },
  },
  widget: {
    exportLeads: "Esportazione Contatto",
    import: "Importazione",
    viewList: "Visualizza elenco",
    importLeadsTitle: "Importazione Contatto",
    viewLeadsListTitle: "Visualizza elenco dei lead",
    copyCsvTitle: "Copiare il contenuto CSV per la clipboard",
    generatingExport: "Generando esportazione...",
    generatingExportHint:
      "Ciò può richiedere un momento per grandi set di dati",
    exportReady: "Esportazione",
    fileReadyToDownload: "Il tuo file è pronto per il download",
    records: "Records",
    format: "Format",
    fileSize: "Dimensione del file",
    copied: "Copiato",
    copy: "Copia",
    download: "Scarica",
    exportedAt: "Esportato a:",
    nextSteps: "Prossimo passo:",
    viewLeads: "Visualizza Contatto",
    importLeads: "Importazione Contatto",
    configureExport: "Configurare l'esportazione",
    configureExportHint:
      "Seleziona il formato e i filtri qui sotto, quindi fai clic su Esporta per generare il tuo file",
    formatLabel: "Format",
    formatHint: "Scegliere CSV o Excel (XLSX)",
    statusFilter: "Filtro di stato",
    statusFilterHint:
      "L'esportazione porta solo a corrispondere uno stato specifico",
    dateRange: "Gamma di date",
    dateRangeHint: "Esportazione stretta in una finestra di tempo specifica",
    metadataEngagement: "Metadati e impegno",
    metadataEngagementHint:
      "Includere opzionalmente colonne extra per analisi avanzate",
    viewLeadsList: "Visualizza elenco dei lead",
    excelSpreadsheet: "Foglio di calcolo Excel",
    csvFile: "File CSV",
  },
  enums: {
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
  },
  headers: {
    email: "Email",
    businessName: "Nome di affari",
    contactName: "Nome di contatto",
    phone: "Telefono",
    country: "Paese",
    language: "Lingua",
    status: "Stato",
    source: "Fonte",
    website: "Sito web",
    notes: "Osservazioni",
    campaignStage: "Fase di campagna",
    emailsSent: "Inviare email",
    emailsOpened: "E-mail aperte",
    emailsClicked: "E-mail cliccate",
    lastEmailSent: "Ultimo messaggio",
    lastEngagement: "Ultimo coinvolgimento",
    unsubscribedAt: "Non sottoscritto a",
    createdAt: "Creato a",
    updatedAt: "Aggiornato At",
    lastEngagementAt: "Ultimo coinvolgimento",
    metadata: "Metadati",
    ipAddress: "IP Indirizzo",
    userAgent: "Agente Utente",
    deviceType: "Tipo di dispositivo",
    browser: "Browser",
    os: "OS",
    referralCode: "Codice invito",
  },
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
  },
  languages: {
    it: "Italiano",
    es: "Spagnolo",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
};
