import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Individuale",
    },
    companyMemberRole: {
      owner: "Proprietario",
      admin: "Amministratore",
      member: "Membro",
      accountant: "Contabilità",
      viewer: "Visualizzatore",
    },
  },
  tags: {
    companies: "Aziende",
    update: "Aggiornamento",
    management: "Gestione",
  },
  patch: {
    title: "Aggiornamento della Società",
    titleShort: "Aggiornamento della Società",
    description:
      "Modificare i dettagli dell'azienda. Richiede ruolo di amministratore o proprietario.",
    companyId: {
      label: "Società ID",
      description: "L'azienda per aggiornare",
    },
    name: {
      label: "Nome della Società",
      description: "Nome legale della società",
      placeholder: "Acme GmbH",
    },
    type: {
      label: "Tipo di azienda",
      description: "Modello di business",
      placeholder: "Selezionare il tipo",
    },
    vatNumber: {
      label: "Numero di VAT",
      description: "numero di identificazione VAT",
      placeholder: "DE123456789",
    },
    country: {
      label: "Paese",
      description: "Paese di registrazione",
      placeholder: "DE",
    },
    currency: {
      label: "Valuta di default",
      description: "Moneta di fatturazione primaria",
      placeholder: "EUR",
    },
    email: {
      label: "Email della società",
      description: "E-mail di business primaria",
      placeholder: "contact@company.com",
    },
    phone: {
      label: "Telefono della società",
      description: "Telefono aziendale primario",
      placeholder: "+43 1 234 5678",
    },
    website: {
      label: "Sito web",
      description: "Sito web della Società URL",
      placeholder: "https://company.com",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla il modulo e riprova",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per aggiornare i dettagli dell'azienda",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "ruolo di amministratore o proprietario richiesto per aggiornare i dettagli della società",
      },
      conflict: {
        title: "Conflitto",
        description: "Conflittuale dei dati",
      },
      server: {
        title: "Errore del server",
        description: "Qualcosa è andato storto. riprovare",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controllare la connessione e riprovare",
      },
      notFound: {
        title: "Società non trovata",
        description: "Questa società non esiste",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Aggiornamento della società",
      description: "Dati aziendali salvati con successo",
    },
    response: {
      id: "Società ID",
      name: "Nome della Società",
    },
    widget: {
      back: "Indietro",
      successLabel: "Aggiornamento della società",
      viewCompany: "Visualizza Azienda",
    },
  },
};
