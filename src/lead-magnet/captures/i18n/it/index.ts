import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Piombo catturati",
    titleShort: "Piombo catturati",
    description:
      "Tutti coloro che hanno presentato la vostra forma magnetica di piombo",
    tag: "lead-magnet-captures",
    response: {
      items: "Contatti",
      total: "Totale",
      page: "Pagina",
      pageSize: "Dimensione della pagina",
    },
    success: {
      title: "Piombo caricati",
      description: "I tuoi indizi catturati",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controlla il tuo input",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Nessun indizio trovato",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      internal: {
        title: "Errore del server",
        description: "Si è verificato un errore interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
    },
  },
  widget: {
    empty:
      "Nessun abbonato ancora. Condividi la tua pagina di abilità - ogni visita è la possibilità di crescere la tua lista.",
    exportCsv: "Export CSV",
    columns: {
      date: "Data",
      name: "Nome",
      email: "Email",
      status: "Stato",
    },
    statusSuccess: "Catturato",
    statusFailed: "Sfigato",
  },
};
