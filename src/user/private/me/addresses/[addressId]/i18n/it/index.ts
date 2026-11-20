import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Indirizzi utente",
  tag: "indirizzi",

  update: {
    title: "Indirizzo di aggiornamento",
    titleShort: "Indirizzo di aggiornamento",
    description: "Modificare un indirizzo salvato",
    fields: {
      addressId: {
        label: "Indirizzo ID",
        description: "Indirizzo per l'aggiornamento",
      },
      label: {
        label: "Etichetta",
        description: "Nome questo indirizzo",
        placeholder: "Home",
      },
      fullName: {
        label: "Nome completo",
        description: "Nome del contatto",
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
      updated: "Aggiornato",
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
        description: "Questo indirizzo non appartiene a voi",
      },
      notFound: { title: "Non trovato", description: "Indirizzo non trovato" },
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
        detail: "Non è possibile aggiornare l'indirizzo: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
    success: {
      title: "Indirizzo Aggiornato",
      description: "Indirizzo salvato con successo",
    },
    widget: {
      updated: "Indirizzo aggiornato.",
      backToAddresses: "Torna agli indirizzi",
    },
  },

  delete: {
    title: "Cancella l'indirizzo",
    titleShort: "Cancella l'indirizzo",
    description: "Rimuovi un indirizzo salvato dal tuo account",
    fields: {
      addressId: {
        label: "Indirizzo ID",
        description: "Indirizzo per eliminare",
      },
    },
    response: {
      deleted: "Cancellato",
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
        description: "Questo indirizzo non appartiene a voi",
      },
      notFound: { title: "Non trovato", description: "Indirizzo non trovato" },
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
        detail: "Non è possibile eliminare l'indirizzo: {{error}}",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
    success: {
      title: "Indirizzo Cancellato",
      description: "Indirizzo rimosso dal tuo account",
    },
    widget: {
      deleted: "Indirizzo cancellato.",
      backToAddresses: "Torna agli indirizzi",
    },
  },
};
