import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Periodi contabili",
    titleShort: "Periodi",
    description: "Elenca tutti i periodi contabili per un'azienda",
    companyId: {
      label: "Società ID",
      description: "Società i cui periodi di iscrizione",
      placeholder: "Entra in azienda UUID",
    },
    response: {
      periods: "Periodi",
      id: "ID",
      name: "Nome",
      startDate: "Inizio",
      endDate: "Fine",
      status: "Stato",
      closedAt: "Chiuso a",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Società non valida ID",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti",
      },
      server: {
        title: "Errore del server",
        description: "Non si possono caricare periodi",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Nessun periodo trovato" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Periodi accumulati",
      description: "Periodi contabili recuperati",
    },
    widget: {
      loading: "I periodi di carico...",
      empty: "Nessun periodo contabile trovato.",
      createButton: "Creare un periodo",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Aperto",
      CLOSED: "Chiuso",
      LOCKED: "Bloccati",
    },
  },
  title: "Elenco dei periodi",
  description: "Elenco dei periodi contabili",
  category: "Grafico dei conti",
  tag: "Periodo",
};
