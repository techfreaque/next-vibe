import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aziende",
  tags: {
    companies: "Aziende",
    create: "Creare",
    list: "Elenco",
    get: "Vai!",
    update: "Aggiornamento",
    members: "Membri",
    invite: "Invito",
    management: "Gestione",
  },
  endpointCategories: {
    companies: "Aziende",
    companyManagement: "Gestione aziendale",
    companyMembers: "Membri della Società",
  },
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

  // Shared auth/repository error messages
  auth: {
    errors: {
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eseguire questa azione",
      },
      notFound: {
        title: "Società non trovata",
        description: "Questa società non esiste",
      },
      server: {
        title: "Errore del server",
        description: "Qualcosa è andato storto. riprovare",
      },
      patchNotFound: {
        title: "Società non trovata",
        description: "Non è possibile trovare l'azienda per aggiornare",
      },
      patchServer: {
        title: "Errore del server",
        description: "Non è riuscito ad aggiornare la società",
      },
    },
  },

  // update-role endpoint translations
  updateRole: {
    patch: {
      title: "Aggiornamento del ruolo degli utenti",
      titleShort: "Aggiornamento Role",
      description: "Cambiare il ruolo di un membro. Solo il proprietario.",
      companyId: { label: "Società ID", description: "Società" },
      memberId: { label: "Membro ID", description: "Il membro per aggiornare" },
      role: {
        label: "Nuovo ruolo",
        description: "Role da assegnare a questo membro",
        placeholder: "Selezionare il ruolo",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Input non valido",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per aggiornare i ruoli dei membri",
        },
        forbidden: {
          title: "Solo proprietario",
          description:
            "Solo il proprietario dell'azienda può cambiare i ruoli dei membri",
        },
        conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
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
          title: "Membro non trovato",
          description: "Questo membro non esiste nella società",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Role Aggiornato",
        description: "Il ruolo degli Stati membri è cambiato con successo",
      },
      response: {
        memberId: "Membro ID",
        role: "Nuovo ruolo",
      },
      widget: {
        back: "Torna ai Membri",
        successLabel: "Role aggiornato",
        title: "Cambiare il ruolo dei membri",
      },
    },
  },

  // remove endpoint translations
  removeMember: {
    post: {
      title: "Rimuovere i membri",
      titleShort: "Rimuovere i membri",
      description:
        "Rimuovere un membro dalla società. Non è possibile rimuovere l'ultimo proprietario.",
      companyId: { label: "Società ID", description: "Società" },
      memberId: { label: "Membro ID", description: "Il membro da rimuovere" },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Input non valido",
        },
        unauthorized: {
          title: "Non firmata",
          description: "Accedi per rimuovere i membri",
        },
        forbidden: {
          title: "Accesso negato",
          description:
            "Il ruolo del proprietario o dell'amministratore richiesto. Non è possibile rimuovere l'ultimo proprietario.",
        },
        conflict: {
          title: "Ultimo proprietario",
          description:
            "Non è possibile rimuovere l'ultimo proprietario dell'azienda",
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
          title: "Membro non trovato",
          description: "Questo membro non esiste nella società",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai modifiche non salvate",
        },
      },
      success: {
        title: "Membro rimosso",
        description: "Il membro è stato rimosso dalla società",
      },
      response: {
        removedMemberId: "Membro rimosso ID",
      },
      widget: {
        back: "Torna ai Membri",
        successLabel: "Rimozione dei membri",
        confirmTitle: "Rimuovere questo membro?",
        confirmDescription:
          "Perderanno immediatamente l'accesso a questa azienda. Questo non può essere annullato.",
        confirmButton: "Sì, rimuovere il membro",
        cancelButton: "Annulla",
      },
    },
  },
};
