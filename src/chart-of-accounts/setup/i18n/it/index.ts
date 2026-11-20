import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "AT. ÖKR",
      DE: "DE. SKR03",
      XX: "XX - IFRS generico",
    },
  },
  post: {
    title: "Inizializzare Grafico dei conti",
    titleShort: "Configurazione iniziale",
    description:
      "Impostare un grafico di account di una società da un modello specifico paese. Idempotent. sicuro per eseguire più volte.",
    companyId: {
      label: "Società ID",
      description: "La società per inizializzare il grafico dei conti per",
      placeholder: "Entra in azienda UUID",
    },
    country: {
      label: "Paese",
      description:
        "Standard di paese da usare (AT = ÖKR, DE = SKR03, XX = IFRS Generico)",
      placeholder: "Seleziona il paese",
    },
    response: {
      created: "Conti creati",
      skipped: "Conti saltati (già esistiti)",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per impostare un grafico degli account",
      },
      validation: {
        title: "Errore di convalida",
        description: "Input non valido. società di controllo ID e paese",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Solo i proprietari e gli amministratori della società possono creare account",
      },
      server: {
        title: "Errore del server",
        description: "Impostazione fallito. si prega di riprovare",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Già inizializzato",
        description: "Questa società ha già un grafico dei conti",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: {
        title: "Template Non trovato",
        description:
          "Nessun grafico del modello di account trovato per questo paese",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Grafico dei conti pronti",
      description: "Tutti i conti sono stati creati per l'azienda",
    },
    widget: {
      viewAccounts: "Visualizza elenco degli account",
    },
  },
  title: "Grafico della configurazione dei conti",
  description: "Inizializzare gli account aziendali dal modello",
  category: "Grafico dei conti",
  tag: "Configurazione iniziale",
};
