import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Germania (DE)",
      XX: "Generico (XX)",
    },
  },
  tags: { companies: "aziende", onboard: "a bordo", setup: "configurazione" },
  post: {
    title: "Azienda di bordo",
    titleShort: "A bordo",
    description:
      "Impostare una nuova società: grafico di account, tassi fiscali e conto bancario predefinito",
    companyId: {
      label: "Società ID",
      description: "L'azienda per l'allestimento",
    },
    country: {
      label: "Paese",
      description:
        "Paese determina le aliquote fiscali e il grafico del modello di account",
      placeholder: "DE",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla tutti i campi",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi a bordo di un'azienda",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Ruolo di amministrazione richiesto",
      },
      conflict: {
        title: "Già a bordo",
        description: "La società è già stata costituita",
      },
      server: {
        title: "Errore del server",
        description: "Non poteva completare l'imbarco",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controlla la connessione",
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
      title: "Azienda Pronta",
      description: "Azienda impostata con successo",
    },
    response: {
      accountsCreated: "Conti creati",
      accountsSkipped: "Conti saltati",
      taxRatesCreated: "Tassi fiscali creati",
      cashAccountId: "Conto in contanti ID",
      bankAccountId: "Conto bancario ID",
      success: "Operazione riuscita",
    },
  },
};
