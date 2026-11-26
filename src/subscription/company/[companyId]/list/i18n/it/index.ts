import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    subscription: "Abbonamento",
    company: "Società",
    list: "Elenco",
  },
  get: {
    title: "Abbonamenti del titolare",
    titleShort: "Abbonamenti del titolare",
    description: "Consulta l’abbonamento personale del titolare dell’azienda.",
    companyId: {
      label: "Società ID",
      description: "L'azienda i cui abbonamenti elencano",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Società non valida ID",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Iscriviti alla lista degli abbonamenti aziendali",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai accesso agli abbonamenti di questa azienda",
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
      title: "Abbonamenti Caricati",
      description: "Abbonamenti aziendali recuperati",
    },
  },
};
