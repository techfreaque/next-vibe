import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Imposte",
  endpointCategories: {
    tax: "Imposte",
    taxRates: "Aliquote fiscali",
    taxReports: "Rapporti fiscali",
  },

  rate: {
    create: {
      title: "Creare Tasso Fiscale",
      titleShort: "Creare",
      description: "Aggiungi una tassa per la tua azienda",
      widget: {
        backToList: "Torna a Tassi di Tassa",
      },
      companyId: {
        label: "Società",
        description: "La società questo tasso di imposta appartiene a",
        placeholder: "Società ID",
      },
      name: {
        label: "Nome",
        description: "Nome descrittivo dell'aliquota fiscale",
        placeholder: "ad esempio. VAT 20%",
      },
      code: {
        label: "Codice",
        description: "Identificativo breve per questo tasso fiscale",
        placeholder: "ad esempio. AT - VAT20",
      },
      type: {
        label: "Tipo di imposta",
        description: "La categoria delle imposte",
        placeholder: "Selezionare il tipo di imposta",
      },
      rate: {
        label: "Tasso",
        description: "Tasso fiscale come decimale (0.2 = 20%)",
        placeholder: "0.2000",
      },
      country: {
        label: "Paese",
        description:
          "Paese in cui si applica questo tasso d'imposta (opzionale)",
        placeholder: "ad esempio. AT",
      },
      region: {
        label: "Regione",
        description:
          "Regione o stato in cui si applica questo tasso (opzionale)",
        placeholder: "ad esempio. Vienna",
      },
      isDefault: {
        label: "Tasso di default",
        description:
          "Utilizzare questa velocità come predefinito per nuovi elementi",
      },
      response: {
        id: "Tasso di imposta ID",
        code: "Codice fiscale",
        name: "Tasso d'imposta Nome",
      },
      success: {
        title: "Tasso d'imposta Creato",
        description: "Il tasso di imposta è stato aggiunto alla tua azienda",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla i tuoi input e riprova",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di gestire i tassi fiscali",
        },
        notFound: { title: "Non trovato", description: "Società non trovata" },
        conflict: {
          title: "Codice duplicato",
          description: "Un tasso fiscale con questo codice esiste già",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
    },
    list: {
      title: "Aliquote fiscali",
      titleShort: "Aliquote fiscali",
      description: "Tutte le tariffe fiscali configurate per la vostra azienda",
      widget: {
        addRate: "Tasso",
        labelDefault: "Predefinito",
        labelActive: "Attivo",
        labelInactive: "Inattivo",
        labelEdit: "Modifica",
        labelDelete: "Elimina",
        labelCompound: "Compound",
        empty:
          "Nessuna tassa imposta configurata. Aggiungi il tuo primo tasso per iniziare.",
        emptySetup:
          "Configura le aliquote fiscali che la tua azienda applica in fattura.",
        columnRate: "Tasso d'imposta",
        columnTypeRateActions: "Tipo / Tariffa / Stato",
        backToCatalog: "← Prodotti",
      },
      companyId: {
        label: "Società",
        description: "Società di elencare le aliquote fiscali",
        placeholder: "Società ID",
      },
      country: {
        label: "Filtro Paese",
        description: "Filtra per codice paese (opzionale)",
        placeholder: "ad esempio. AT",
      },
      type: {
        label: "Tipo di filtro",
        description: "Filtra per tipo di imposta (opzionale)",
        placeholder: "Selezionare il tipo di imposta",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina (a partire da 1)",
      },
      pageSize: {
        label: "Per pagina",
        description: "Risultati per pagina (max 100)",
      },
      response: {
        total: "Totale",
        rates: "Aliquote fiscali",
        rate: {
          id: "ID",
          name: "Nome",
          code: "Codice",
          type: "Tipologia",
          rate: "Tasso",
          country: "Paese",
          region: "Regione",
          isDefault: "Predefinito",
          isActive: "Attivo",
          isCompound: "Compound",
          createdAt: "Creato",
          updatedAt: "Aggiornato",
        },
      },
      success: {
        title: "Tassi fiscali accumulati",
        description: "Tassi fiscali recuperati con successo",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla i tuoi input e riprova",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di visualizzare i tassi fiscali",
        },
        notFound: { title: "Non trovato", description: "Società non trovata" },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
    },
    update: {
      title: "Tasso d'imposta di aggiornamento",
      titleShort: "Tasso di aggiornamento",
      description: "Modificare il tasso di imposta esistente",
      widget: {
        backToList: "Torna a Tassi di Tassa",
        failed: "Sfigato",
      },
      rateId: {
        label: "Tasso di imposta ID",
        description: "La ID del tasso di imposta per aggiornare",
        placeholder: "Tasso di imposta UUID",
      },
      name: {
        label: "Nome",
        description: "Nome aggiornato per il tasso fiscale",
        placeholder: "ad esempio. VAT 20%",
      },
      rate: {
        label: "Tasso",
        description: "Tasso d'imposta aggiornato come decimale (0.2 = 20%)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "Tasso di default",
        description:
          "Utilizzare questa velocità come predefinito per nuovi elementi",
      },
      isActive: {
        label: "Attivo",
        description: "Se questo tasso fiscale è attualmente attivo",
      },
      response: {
        updated: "Aggiornato",
      },
      success: {
        title: "Tasso d'imposta Aggiornato",
        description: "L'aliquota fiscale è stata aggiornata",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla i tuoi input e riprova",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di gestire i tassi fiscali",
        },
        notFound: {
          title: "Non trovato",
          description: "Tasso fiscale non trovato",
        },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
    },
    delete: {
      title: "Eliminare il tasso di imposta",
      titleShort: "Cancellare il tasso",
      description: "Disattivare un tasso fiscale",
      widget: {
        backToList: "Torna a Tassi di Tassa",
        warning:
          "Questo disattiva il tasso di imposta. Questa azione non può essere annullata.",
        confirmTitle: "Disattivare questo tasso fiscale?",
        confirmDescription:
          "Le tariffe disattivate non possono più essere applicate alle fatture. Le linee di fattura esistenti non sono interessate.",
        confirmButton: "Sì, disattivare",
        cancelButton: "Annulla",
      },
      rateId: {
        label: "Tasso di imposta ID",
        description: "La ID della tassa di disattivare",
        placeholder: "Tasso di imposta UUID",
      },
      response: {
        deleted: "Disattivato",
      },
      success: {
        title: "Tasso d'imposta disattivato",
        description: "L'aliquota fiscale è stata disattivata",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Controlla i tuoi input e riprova",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Devi essere connesso",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di gestire i tassi fiscali",
        },
        notFound: {
          title: "Non trovato",
          description: "Tasso fiscale non trovato",
        },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
        server: {
          title: "Errore del server",
          description: "Si è verificato un errore interno",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
    },
  },

  report: {
    title: "Imposte per aliquota",
    titleShort: "Imposte per aliquota",
    description:
      "Consulta le imposte registrate su fatture di vendita, note di credito, fatture di acquisto e vendite alla cassa.",
    widget: {
      scope:
        "Per le fatture di vendita vale la data della registrazione collegata o la data di creazione. Per gli acquisti vale la data della fattura. Le vendite alla cassa seguono la data di completamento (UTC) e includono le righe con aliquota positiva o imposta registrata. Se una fattura emessa condivide la registrazione contabile, la vendita compare in fattura.",
      empty: "Nessuna riga di documento corrisponde ai filtri.",
      range: "Dal {{from}} al {{to}}",
      total: "Totale",
      previousMonth: "Mostra il mese precedente",
      unknownRate: "Aliquota non determinabile",
      run: "Genera report",
      running: "Generazione del report…",
      selectCompany: "Seleziona l’azienda per questo report.",
    },
    currency: {
      label: "Valuta",
      placeholder: "Valuta aziendale",
      description: "Per impostazione predefinita si usa la valuta aziendale.",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "Società",
      description: "Società di generare il rapporto fiscale per",
      placeholder: "Società ID",
    },
    dateFrom: {
      label: "Da",
      description: "Data di inizio per il periodo di relazione",
      placeholder: "Inizio del mese corrente",
    },
    dateTo: {
      label: "A",
      description: "Data di scadenza per il periodo di relazione",
      placeholder: "Oggi",
    },
    response: {
      rows: "Resoconto righe",
      row: {
        direction: "Tipo di documento",
        rate: "Aliquota",
        taxableAmount: "Importo fiscale",
        taxAmount: "Importo fiscale",
      },
    },
    success: {
      title: "Rapporto fiscale generato",
      description: "Rapporto fiscale recuperato con successo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "La data finale non può precedere la data iniziale.",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare i rapporti fiscali",
      },
      notFound: { title: "Non trovato", description: "Società non trovata" },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
  },

  enums: {
    reportDirection: {
      posSales: "Vendite alla cassa",
      sales: "Fatture di vendita",
      creditNotes: "Note di credito a clienti",
      purchases: "Fatture di acquisto",
    },
    taxType: {
      vat: "VAT",
      gst: "GST",
      sales: "Tassa di vendita",
      withholding: "Ritenere l'imposta",
      none: "Nessuna tassa / Esenzione",
    },
  },

  tags: {
    tax: "Tassa fiscale",
    rate: "tasso di cambio",
    create: "creare",
    list: "elenco",
    update: "aggiornamento",
    delete: "Cancella",
    report: "relazione",
  },
};
