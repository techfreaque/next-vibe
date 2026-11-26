import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abbonamento",
    company: "Società",
    get: "Vai!",
  },
  view: {
    empty: "Nessun abbonamento",
    emptyHelp: "Sul tuo account non risulta alcun abbonamento.",
    status: "Stato",
    interval: "Frequenza di fatturazione",
    periodStart: "Inizio del periodo corrente",
    periodEnd: "Fine del periodo corrente",
    unavailable: "Non registrato",
    provider: "Fornitore di pagamento",
    cancellation: "Annullamento",
    endOfPeriod: "Alla fine del periodo",
    scheduled: "Annullamento programmato",
    canceled: "Annullato il",
    ended: "Terminato il",
    open: "Apri i dettagli dell’abbonamento",
    list: "Torna agli abbonamenti",
  },
  get: {
    title: "Abbonamento del titolare",
    titleShort: "Abbonamento del titolare",
    description: "Consulta l’abbonamento personale del titolare dell’azienda.",
    companyId: {
      label: "Società ID",
      description: "La società la cui sottoscrizione per recuperare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Società non valida ID",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare gli abbonamenti aziendali",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai accesso all'abbonamento di questa azienda",
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
        title: "Nessun abbonamento Trovato",
        description: "Questa società non ha abbonamento",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Abbonamento accumulato",
      description: "Abbonamento aziendale recuperato",
    },
  },
};
