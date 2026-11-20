import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Indirizzi utente",
  tag: "indirizzi",

  list: {
    title: "Indirizzi di fatturazione",
    titleShort: "I miei indirizzi",
    description: "Elenca gli indirizzi salvati",
    response: {
      addresses: "Indirizzi",
    },
    widget: {
      back: "Indietro",
      addAddress: "Aggiungi l'indirizzo",
      edit: "Modifica",
      delete: "Elimina",
      billing: "Fatturazione",
      delivery: "Consegna",
      empty: "Nessun indirizzo salvato",
      emptyHint: "Risparmiane uno per saltare digitandolo al checkout.",
      emptyCta: "Aggiungi il tuo primo indirizzo",
      loading: "Caricamento in corso...",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun indirizzo trovato",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      internal: {
        title: "Errore del server",
        description: "Errore del server interno",
        detail: "Non è possibile caricare i tuoi indirizzi: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Indirizzi recuperati",
    },
  },

  create: {
    title: "Aggiungi l'indirizzo",
    titleShort: "Aggiungi l'indirizzo",
    description: "Salvare un nuovo indirizzo sul tuo account",
    fields: {
      label: {
        label: "Etichetta",
        description: "Nomina questo indirizzo (ad es. Home, Ufficio)",
        placeholder: "Home",
      },
      fullName: {
        label: "Nome completo",
        description: "Nome di contatto per questo indirizzo",
        placeholder: "Jane Doe",
      },
      company: {
        label: "Società",
        description: "Nome della Società (opzionale)",
        placeholder: "Corda d'acme",
      },
      phone: {
        label: "Telefono",
        description: "Numero di telefono di contatto",
        placeholder: "+1 555 000 0000",
      },
      vatNumber: {
        label: "Numero di VAT",
        description: "EU VAT numero di registrazione",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "Tassa fiscale ID",
        description: "Identificazione fiscale nazionale",
        placeholder: "123-45-6789",
      },
      addressLine1: {
        label: "Indirizzo Linea 1",
        description: "Via e numero",
        placeholder: "123 St principale",
      },
      addressLine2: {
        label: "Indirizzo Linea 2",
        description: "Appartamento, suite, unità (opzionale)",
        placeholder: "Suite 4B",
      },
      city: { label: "Città", description: "Città", placeholder: "Berlino" },
      region: {
        label: "Stato / Regione",
        description: "Stato o regione (facoltativo)",
        placeholder: "Bayern",
      },
      postalCode: {
        label: "Codice Postale",
        description: "ZIP o codice postale",
        placeholder: "10115",
      },
      country: {
        label: "Paese",
        description: "ISO 3166 -1 alpha-2 codice paese",
        placeholder: "DE",
      },
      isDefaultBilling: {
        label: "Billing predefinito",
        description: "Utilizzare come indirizzo di fatturazione predefinito",
      },
      isDefaultDelivery: {
        label: "Consegna predefinita",
        description: "Utilizzare come indirizzo di consegna predefinito",
      },
    },
    response: {
      id: "Indirizzo ID",
      label: "Etichetta",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare i campi obbligatori",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      notFound: { title: "Non trovato", description: "Utente non trovato" },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      internal: {
        title: "Errore del server",
        description: "Errore del server interno",
        detail: "Non poteva salvare l'indirizzo: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
    success: {
      title: "Indirizzo salvato",
      description: "Indirizzo aggiunto al tuo account",
    },
    widget: {
      saved: "Indirizzo salvato.",
      backToAddresses: "Torna agli indirizzi",
    },
  },
};
