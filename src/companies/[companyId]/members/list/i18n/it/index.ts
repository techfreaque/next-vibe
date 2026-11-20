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
    members: "Membri",
    list: "Elenco",
  },
  get: {
    title: "Membri del gruppo",
    titleShort: "Membri del gruppo",
    description: "Elenca tutti i membri di questa società",
    companyId: {
      label: "Società ID",
      description: "La società i cui membri elencano",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Società non valida ID",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare i membri dell'azienda",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Tu non sei un membro di questa azienda",
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
      title: "Membri Caricati",
      description: "Elenco dei membri recuperati",
    },
    response: {
      id: "Membro ID",
      userId: "Utente ID",
      email: "Email",
      name: "Nome",
      role: "Role",
      isActive: "Attivo",
      joinedAt: "Adeguato",
    },
    widget: {
      back: "Indietro",
      loading: "Membri di caricamento...",
      title: "Membri del gruppo",
      memberSingular: "membro",
      memberPlural: "membri",
      invite: "Invitare gli Stati membri",
      updateRole: "Cambiare il ruolo",
      remove: "Rimuovi",
      active: "Attivo",
      inactive: "Inattivo",
      empty: {
        title: "Nessun membro del team",
        hint: "Invita i colleghi a collaborare alla contabilità e alle operazioni di questa azienda.",
        cta: "Invita il primo membro",
      },
    },
  },
};
