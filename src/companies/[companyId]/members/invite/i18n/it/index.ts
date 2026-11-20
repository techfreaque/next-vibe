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
    invite: "Invito",
  },
  post: {
    title: "Invitare gli Stati membri",
    titleShort: "Invitare gli Stati membri",
    description: "Invita un utente registrato alla società via email",
    companyId: {
      label: "Società ID",
      description: "La società per invitare l'utente a",
    },
    email: {
      label: "Email utente",
      description: "Email dell'utente registrato per invitare",
      placeholder: "colleague@company.com",
    },
    role: {
      label: "Role",
      description: "Il ruolo da assegnare al nuovo membro",
      placeholder: "Selezionare il ruolo",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare l'email e riprovare",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Iscriviti per invitare i membri",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "ruolo di amministratore o proprietario richiesto per invitare i membri",
      },
      conflict: {
        title: "Già un membro",
        description: "Questo utente è già un membro della società",
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
        title: "Utente non trovato",
        description: "Nessun utente registrato trovato con questa email",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Membro invitato",
      description: "L'utente è stato aggiunto alla società",
    },
    response: {
      memberId: "Membro ID",
      userId: "Utente ID",
      role: "Role",
    },
    widget: {
      back: "Torna ai Membri",
      invited: "Membro invitato",
    },
  },
};
