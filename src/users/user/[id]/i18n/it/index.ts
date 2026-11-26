import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",
  tag: "Gestione utente",

  id: {
    roles: {
      post: {
        title: "Aggiungi il ruolo dell'utente",
        description: "Concedere un ruolo a un account utente specifico",
        container: {
          title: "Aggiungi Role",
          description: "Selezionare un ruolo da concedere a questo utente",
        },
        id: {
          label: "Utente ID",
          description:
            "Unico identificatore dell'utente per concedere il ruolo a",
          placeholder: "Inserisci utente ID...",
        },
        role: {
          label: "Role",
          description: "Il ruolo da concedere all'utente",
          placeholder: "Seleziona un ruolo...",
        },
        submit: {
          label: "Aggiungi Role",
        },
        response: {
          roleId: {
            content: "Assegnazione del ruolo ID",
          },
          userId: {
            content: "Utente ID",
          },
          assignedRole: {
            content: "Assegnato Role",
          },
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Devi essere connesso per gestire i ruoli degli utenti",
          },
          validation: {
            title: "Convalida non riuscita",
            description: "Si prega di fornire un utente valido ID e ruolo",
          },
          forbidden: {
            title: "Accesso Proibito",
            description:
              "Solo gli amministratori possono gestire i ruoli degli utenti",
          },
          notFound: {
            title: "Utente non trovato",
            description: "L'utente specificato non potrebbe essere trovato",
          },
          conflict: {
            title: "Role già assegnata",
            description: "Questo utente ha già il ruolo specificato",
          },
          network: {
            title: "Errore di rete",
            description: "Non è possibile connettersi al server",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai dei cambiamenti non salvati che saranno persi",
          },
          server: {
            title: "Errore del server",
            description:
              "Non è possibile aggiungere ruolo a causa di errore server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description:
              "Si è verificato un errore inaspettato, aggiungendo il ruolo",
          },
        },
        success: {
          title: "Role Aggiunto",
          description: "Il ruolo è stato concesso con successo all'utente",
        },
      },
      delete: {
        title: "Rimuovi il ruolo dell'utente",
        description: "Rivolgere un ruolo da un account utente specifico",
        container: {
          title: "Rimuovere Role",
          description: "Selezionare un ruolo da revocare da questo utente",
        },
        id: {
          label: "Utente ID",
          description:
            "Unico identificatore dell'utente per revocare il ruolo da",
          placeholder: "Inserisci utente ID...",
        },
        role: {
          label: "Role",
          description: "Il ruolo da revocare dall'utente",
          placeholder: "Seleziona un ruolo...",
        },
        submit: {
          label: "Rimuovere Role",
        },
        response: {
          success: {
            content: "Role Rimuovi",
          },
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Devi essere connesso per gestire i ruoli degli utenti",
          },
          validation: {
            title: "Convalida non riuscita",
            description: "Si prega di fornire un utente valido ID e ruolo",
          },
          forbidden: {
            title: "Accesso Proibito",
            description:
              "Solo gli amministratori possono gestire i ruoli degli utenti",
          },
          notFound: {
            title: "Utente non trovato",
            description: "L'utente specificato non potrebbe essere trovato",
          },
          conflict: {
            title: "Errore di conflitto",
            description:
              "Incapace di rimuovere il ruolo a causa delle dipendenze esistenti",
          },
          network: {
            title: "Errore di rete",
            description: "Non è possibile connettersi al server",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai dei cambiamenti non salvati che saranno persi",
          },
          server: {
            title: "Errore del server",
            description:
              "Non è possibile rimuovere il ruolo a causa di errore del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description:
              "Si è verificato un errore inaspettato mentre si rimuove il ruolo",
          },
        },
        success: {
          title: "Role Rimuovi",
          description: "Il ruolo è stato revocato con successo dall'utente",
        },
      },
    },
    get: {
      title: "Ottieni l'utente",
      titleShort: "Dettagli utente",
      description: "Recuperare informazioni dettagliate su un utente specifico",
      container: {
        title: "Dettagli utente",
        description: "Visualizza le informazioni dettagliate dell'utente",
      },
      id: {
        label: "Utente ID",
        description: "Identificatore unico per l'utente",
        placeholder: "Inserisci utente ID...",
      },
      response: {
        userProfile: {
          title: "Profilo utente",
          description: "Informazioni dettagliate sul profilo utente",
          basicInfo: {
            title: "Informazioni di base",
            description: "Informazioni utente core",
            id: {
              content: "Utente ID",
            },
            email: {
              content: "Indirizzo email",
            },
            privateName: {
              content: "Nome privato",
            },
            publicName: {
              content: "Nome pubblico",
            },
            firstName: {
              content: "Nome",
            },
            lastName: {
              content: "Ultimo nome",
            },
            company: {
              content: "Società",
            },
          },
          contactDetails: {
            title: "Dettagli di contatto",
            description: "Informazioni di contatto dell'utente",
            phone: {
              content: "Numero di telefono",
            },
            preferredContactMethod: {
              content: "Metodo di contatto preferito",
            },
            website: {
              content: "Sito web",
            },
          },
        },
        profileDetails: {
          title: "Dettagli del profilo",
          description: "Ulteriori informazioni sul profilo",
          imageUrl: {
            content: "Immagine del profilo",
          },
          bio: {
            content: "Biografia",
          },
          jobTitle: {
            content: "Titolo del lavoro",
          },
          leadId: {
            content: "Contatto associato ID",
          },
        },
        accountStatus: {
          title: "Stato dell'account",
          description: "Informazioni sullo stato dell'account utente",
          isActive: {
            content: "Stato attivo",
          },
          emailVerified: {
            content: "E-mail verificato",
          },
          stripeCustomerId: {
            content: "Stripe cliente ID",
          },
          userRoles: {
            content: "Ruoli utente",
          },
        },
        timestamps: {
          title: "Lampade da terra",
          description: "Creazione e aggiornamento di timestamp",
          createdAt: {
            content: "Creato a",
          },
          updatedAt: {
            content: "Aggiornato At",
          },
        },
        referralInfo: {
          title: "Informazioni di riferimento",
          description: "Catena di riferimento e guadagni",
          referredByUserId: {
            content: "Referred By (User ID)",
          },
          referredByCode: {
            content: "Codice di riferimento usato",
          },
          totalReferrals: {
            content: "Utenti rinviati",
          },
          totalEarnedCents: {
            content: "Totale Guadagnato (centri)",
          },
          confirmedEarnedCents: {
            content: "Confermato Guadagnato (centri)",
          },
          pendingEarnedCents: {
            content: "Prestiti (centri)",
          },
        },
        engagement: {
          title: "Credits & Engagement",
          description: "Saldo, spesa, guadagni e attività",
          creditBalance: {
            content: "Saldo crediti",
          },
          freeAllowance: {
            content: "Consentimento libero",
          },
          lifetimeCreditsSpent: {
            content: "Trascorrere la vita",
          },
          favoritesCount: {
            content: "Preferiti",
          },
          customSkillsCount: {
            content: "Competenze personalizzate",
          },
          newsletterConsent: {
            content: "Consenso Newsletter",
          },
          hasConfirmedNewsletter: {
            content: "Newsletter Confermata",
          },
        },
        leadId: {
          content: "Contatto associato ID",
        },
        email: {
          content: "Indirizzo email",
        },
        privateName: {
          content: "Nome privato",
        },
        publicName: {
          content: "Nome pubblico",
        },
        firstName: {
          content: "Nome",
        },
        lastName: {
          content: "Ultimo nome",
        },
        company: {
          content: "Società",
        },
        phone: {
          content: "Numero di telefono",
        },
        preferredContactMethod: {
          content: "Metodo di contatto preferito",
        },
        imageUrl: {
          content: "Immagine del profilo",
        },
        bio: {
          content: "Biografia",
        },
        website: {
          content: "Sito web",
        },
        jobTitle: {
          content: "Titolo del lavoro",
        },
        emailVerified: {
          content: "E-mail verificato",
        },
        isActive: {
          content: "Stato attivo",
        },
        stripeCustomerId: {
          content: "Stripe cliente ID",
        },
        userRoles: {
          content: "Ruoli utente",
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
      },
      errors: {
        unauthorized: {
          title: "Accesso non autorizzato",
          description:
            "Devi essere connesso per visualizzare i dettagli dell'utente",
        },
        validation: {
          title: "Convalida non riuscita",
          description: "Utente non valido ID fornito",
        },
        forbidden: {
          title: "Accesso Proibito",
          description: "Non hai il permesso di visualizzare questo utente",
        },
        notFound: {
          title: "Utente non trovato",
          description: "L'utente richiesto non è stato trovato",
          detail: "Nessun utente trovato con ID {{userId}}.",
        },
        conflict: {
          title: "Errore di conflitto",
          description:
            "Incapace di recuperare l'utente a causa dei conflitti esistenti",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
        server: {
          title: "Errore del server",
          description:
            "Non è possibile recuperare l'utente a causa di errore del server",
          detail: "Non è possibile caricare questo utente: {{error}}",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore inaspettato si è verificato durante il recupero dell'utente",
        },
      },
      success: {
        title: "Utente recuperato con successo",
        description: "I dettagli utente sono stati recuperati con successo",
      },
    },
    put: {
      title: "Aggiorna utente",
      titleShort: "Aggiorna utente",
      description:
        "Aggiornare le informazioni sull'utente e i dettagli del profilo",
      container: {
        title: "Aggiorna utente",
        description: "Modificare le informazioni e le impostazioni dell'utente",
      },
      id: {
        label: "Utente ID",
        description: "Univoco identificativo per l'utente per aggiornare",
        placeholder: "Inserisci utente ID...",
      },
      sections: {
        basicInfo: {
          title: "Informazioni di base",
          description: "Aggiornare le informazioni di base dell'utente",
        },
        contactInfo: {
          title: "Informazioni di contatto",
          description: "Aggiornare i dettagli del contatto",
        },
        profileDetails: {
          title: "Dettagli del profilo",
          description: "Aggiornare ulteriori informazioni sul profilo",
        },
        adminSettings: {
          title: "Impostazioni amministrative",
          description: "Aggiornare le impostazioni amministrative",
        },
      },
      email: {
        label: "Indirizzo email",
        description:
          "Indirizzo email dell'utente per il login e la comunicazione",
        placeholder: "Inserisci l'indirizzo e-mail...",
      },
      privateName: {
        label: "Nome privato",
        description:
          "Nome completo legale dell'utente (visibile solo agli amministratori)",
      },
      publicName: {
        label: "Nome pubblico",
        description:
          "Nome di visualizzazione dell'utente (visibile a tutti gli utenti)",
      },
      firstName: {
        label: "Nome",
        description: "Nome utente",
        placeholder: "Inserisci il nome...",
      },
      lastName: {
        label: "Ultimo nome",
        description: "cognome dell'utente",
        placeholder: "Inserisci il cognome...",
      },
      company: {
        label: "Società",
        description: "Azienda o organizzazione dell'utente",
        placeholder: "Inserisci il nome dell'azienda...",
      },
      phone: {
        label: "Numero di telefono",
        description: "Numero di telefono di contatto dell'utente",
        placeholder: "Inserisci il numero di telefono...",
      },
      preferredContactMethod: {
        label: "Metodo di contatto preferito",
        description: "Come l'utente preferisce essere contattato",
      },
      bio: {
        label: "Biografia",
        description: "Breve descrizione dell'utente",
        placeholder: "Entra in biografia...",
      },
      website: {
        label: "Sito web",
        description: "Sito personale o aziendale dell'utente",
        placeholder: "Inserisci il sito web URL...",
      },
      jobTitle: {
        label: "Titolo del lavoro",
        description: "Titolo o posizione del lavoro dell'utente",
        placeholder: "Inserire il titolo di lavoro...",
      },
      emailVerified: {
        label: "E-mail verificato",
        description: "Se l'e-mail dell'utente è verificata",
      },
      isActive: {
        label: "Stato attivo",
        description: "Se l'account utente è attivo",
      },
      leadId: {
        label: "ID del contatto",
        description: "Identificatore di contatto associato",
        placeholder: "Inserire il comando ID...",
      },
      isBanned: {
        label: "Banati",
        description: "Se l'utente è vietato dalla piattaforma",
      },
      bannedReason: {
        label: "Motivazione del bando",
        description: "Motivo per il divieto dell'utente",
      },
      response: {
        leadId: {
          content: "Contatto associato ID",
        },
        email: {
          content: "Indirizzo email",
        },
        privateName: {
          content: "Nome privato",
        },
        publicName: {
          content: "Nome pubblico",
        },
        firstName: {
          content: "Nome",
        },
        lastName: {
          content: "Ultimo nome",
        },
        company: {
          content: "Società",
        },
        phone: {
          content: "Numero di telefono",
        },
        preferredContactMethod: {
          content: "Metodo di contatto preferito",
        },
        imageUrl: {
          content: "Immagine del profilo",
        },
        bio: {
          content: "Biografia",
        },
        website: {
          content: "Sito web",
        },
        jobTitle: {
          content: "Titolo del lavoro",
        },
        emailVerified: {
          content: "E-mail verificato",
        },
        isActive: {
          content: "Stato attivo",
        },
        stripeCustomerId: {
          content: "Stripe cliente ID",
        },
        userRoles: {
          content: "Ruoli utente",
        },
        createdAt: {
          content: "Creato a",
        },
        updatedAt: {
          content: "Aggiornato At",
        },
      },
      errors: {
        unauthorized: {
          title: "Accesso non autorizzato",
          description: "Devi essere connesso per aggiornare gli utenti",
        },
        validation: {
          title: "Convalida non riuscita",
          description: "Si prega di controllare i dati del modulo e riprovare",
        },
        forbidden: {
          title: "Accesso Proibito",
          description: "Non hai il permesso di aggiornare questo utente",
        },
        notFound: {
          title: "Utente non trovato",
          description: "L'utente che aggiorna non potrebbe essere trovato",
          detail: "Nessun utente trovato con ID {{userId}}.",
        },
        conflict: {
          title: "Aggiornamento Conflict",
          description:
            "I dati dell'utente sono in conflitto con i record esistenti",
        },
        server: {
          title: "Errore del server",
          description:
            "Non è possibile aggiornare l'utente a causa dell'errore del server",
          detail:
            "Non è possibile salvare le modifiche a questo utente: {{error}}",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Si è verificato un errore inaspettato durante l'aggiornamento dell'utente",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
      },
      success: {
        title: "Aggiornato l'utente con successo",
        description:
          "Le informazioni dell'utente sono state aggiornate con successo",
      },
    },
    delete: {
      title: "Cancella l'utente",
      titleShort: "Cancella l'utente",
      description: "Cancellare permanentemente un account utente",
      container: {
        title: "Cancella l'utente",
        description: "Rimuovere permanentemente l'utente dal sistema",
      },
      id: {
        label: "Utente ID",
        description: "Univoco identificativo per l'utente da eliminare",
        placeholder: "Inserisci utente ID...",
        helpText: "WARNING: Questa azione non può essere annullata",
      },
      submitButton: {
        label: "Cancella l'utente",
        loadingText: "Deleting...",
      },
      response: {
        deletionResult: {
          title: "Risultato di cancellazione",
          description: "Risultato dell'operazione di cancellazione",
          success: {
            content: "Successo di cancellazione",
          },
          message: {
            content: "Messaggio di cancellazione",
          },
          deletedAt: {
            content: "Cancellato a",
          },
        },
        success: {
          content: "Successo di cancellazione",
        },
        message: {
          content: "Messaggio di cancellazione",
        },
      },
      errors: {
        unauthorized: {
          title: "Accesso non autorizzato",
          description: "Devi essere connesso per eliminare gli utenti",
        },
        validation: {
          title: "Convalida non riuscita",
          description: "Utente non valido ID fornito per la cancellazione",
        },
        forbidden: {
          title: "Accesso Proibito",
          description: "Non hai il permesso di eliminare gli utenti",
        },
        notFound: {
          title: "Utente non trovato",
          description: "L'utente da cancellare non potrebbe essere trovato",
          detail: "Nessun utente trovato con ID {{userId}}.",
        },
        server: {
          title: "Errore del server",
          description:
            "Non è possibile eliminare l'utente a causa di errore del server",
          detail: "Non è possibile eliminare questo utente: {{error}}",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore inaspettato si è verificato durante la cancellazione dell'utente",
        },
        conflict: {
          title: "Errore di conflitto",
          description:
            "Incapace di eliminare l'utente a causa delle dipendenze esistenti",
        },
        network: {
          title: "Errore di rete",
          description: "Non è possibile connettersi al server",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Hai dei cambiamenti non salvati che saranno persi",
        },
      },
      success: {
        title: "Utente eliminato con successo",
        description: "L'utente è stato cancellato con successo",
      },
    },
    widget: {
      userProfile: "Profilo utente",
      active: "Attivo",
      inactive: "Inattivo",
      leadId: "Contatto ID:",
      viewLead: "Visualizza contatto",
      created: "Creato",
      lastUpdated: "Ultimo aggiornamento",
      relatedRecords: "Dati collegati",
      relatedPayments: "Pagamenti",
      relatedThreadActivity: "Attività delle conversazioni",
      confirmBan: "Vuoi bloccare l’accesso all’account di {{name}}?",
      confirmUnban: "Vuoi ripristinare l’accesso all’account di {{name}}?",
      editAccountNamed: "Modifica account di {{name}}",
      saveAccount: "Salva le modifiche",
      fullProfile: "Profilo completo",
      referrals: "Referrals",
      subscription: "Abbonamento",
      creditHistory: "Storico crediti",
      identifiers: "Identificativi account",
      engagementTitle: "Crediti e attività",
      balance: "Saldo in crediti",
      freeAllowance: "Quota di crediti gratuiti",
      lifetimeSpend: "Crediti utilizzati",
      earned: "Guarnizione",
      earnedPending: "In attesa:",
      referred: "Riferito",
      favorites: "Preferiti",
      skills: "Skill",
      newsletter: "Newsletter",
      newsletterConfirmed: "Confermato",
      newsletterConsent: "Optato in",
      newsletterNone: "Nessuno",
      deleteUser: "Cancella l'utente",
      userDeletedSuccessfully: "Utente cancellato con successo",
      deletedAt: "Cancellato a",
      dangerZone: "Azioni irreversibili",
      deleteAccountHint: "Elimina definitivamente l’account di {{name}}.",
      cancelDeletion: "Annulla",
      confirmDeletion: "Confermare la cancellazione",
      confirmDeletionMessage:
        "L’account verrà eliminato definitivamente. L’operazione è irreversibile.",
      titleReferralCodes: "Visualizza codici di riferimento e statistiche",
      titleSubscription: "Visualizza abbonamento",
      copyLeadId: "Copia l’ID del contatto",
      noEarnings: "Nessun guadagno da referral",
      earningUnitsUnavailable: "Dettaglio dei guadagni non disponibile",
      titleCopyUserId: "Copia utente ID",
    },
    getCrm: {
      get: {
        title: "Ottieni il profilo utente CRM",
        titleShort: "Profilo CRM",
        description:
          "Recuperare i campi di fatturazione di un utente e il conteggio delle note",
        fields: {
          userId: {
            label: "Utente ID",
            description: "L'utente di guardare su",
            placeholder: "Utente UUID",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Utente non valido ID",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Devi essere connesso",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai accesso ai dati CRM di questo utente",
          },
          notFound: {
            title: "Non trovato",
            description: "Utente non trovato",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "La richiesta di rete è fallita",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Errore del server. riprovare",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
        },
        success: {
          title: "CRM Profilo caricato",
          description: "Dati utente CRM recuperati",
        },
        widget: {
          addNote: "Aggiungi nota",
          viewNotes: "Osservazioni",
        },
        response: {
          id: "Utente ID",
          email: "Email",
          privateName: "Nome",
          companyBillingName: "Società / Nome di fatturazione",
          vatNumber: "Numero di VAT",
          taxId: "Tassa fiscale ID",
          phone: "Telefono",
          addressLine1: "Indirizzo Linea 1",
          addressLine2: "Indirizzo Linea 2",
          city: "Città",
          region: "Regione",
          postalCode: "Codice Postale",
          billingCountry: "Paese",
          defaultCurrency: "Valuta di default",
          paymentTermsDays: "Termini di pagamento (giorni)",
          notesCount: "Totale note",
        },
      },
      tag: "CRM",
    },
    notesCreate: {
      post: {
        title: "Crea una nota utente",
        titleShort: "Crea note",
        description:
          "Aggiungi una nota CRM, registro delle chiamate, e-mail record, riunione o attività per un utente",
        fields: {
          userId: {
            label: "Utente",
            description: "L'utente di questa nota è circa",
            placeholder: "Seleziona l'utente",
          },
          type: {
            label: "Tipo di attività",
            description: "Che tipo di interazione questo record",
            placeholder: "Selezionare il tipo",
          },
          content: {
            label: "Contenuti",
            description: "Dettagli dell'attività",
            placeholder: "Scrivi quello che è successo...",
          },
          isPrivate: {
            label: "Privato",
            description: "Solo si possono vedere note private",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Controlla i campi e riprova",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Devi essere connesso",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai accesso a questo utente",
          },
          notFound: {
            title: "Non trovato",
            description: "Utente non trovato",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "La richiesta di rete è fallita",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Errore del server. riprovare",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
        },
        success: {
          title: "Nota Creata",
          description: "La nota è stata salvata",
        },
        widget: {
          created: "Nota Creata",
          noteId: "Nota ID",
          backToNotes: "Torna a Note",
        },
        response: {
          id: "Nota ID",
          userId: "Utente ID",
          authorUserId: "Autore ID",
          type: "Tipologia",
          content: "Contenuti",
          isPrivate: "Privato",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
        },
      },
      tag: "CRM",
    },
    notesList: {
      get: {
        title: "Elenca le note dell'utente",
        titleShort: "Note utente",
        description:
          "Elenca le note CRM per un utente, filtrate per tipo e visibilità",
        fields: {
          userId: {
            label: "Utente ID",
            description: "Di cui note alla lista",
            placeholder: "Utente UUID",
          },
          type: {
            label: "Tipologia",
            description: "Filtra per tipo di attività",
            placeholder: "Tutti i tipi",
          },
          isPrivate: {
            label: "Solo privato",
            description: "Mostra solo le note private",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Controllare i filtri e riprovare",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Devi essere connesso",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai accesso a queste note",
          },
          notFound: {
            title: "Non trovato",
            description: "Utente non trovato",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "La richiesta di rete è fallita",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Errore del server. riprovare",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
        },
        success: {
          title: "Note Caricate",
          description: "Note recuperate con successo",
        },
        widget: {
          addNote: "Aggiungi nota",
          total: "Totale",
          empty: "Non ci sono note",
          delete: "Elimina",
          private: "Privato",
          ago: "fa",
        },
        response: {
          notes: "Osservazioni",
          total: "Totale",
          note: {
            id: "Nota ID",
            userId: "Utente ID",
            authorUserId: "Autore ID",
            type: "Tipologia",
            content: "Contenuti",
            isPrivate: "Privato",
            createdAt: "Creato a",
            updatedAt: "Aggiornato At",
          },
        },
      },
      tag: "CRM",
    },
    noteDelete: {
      post: {
        title: "Cancella la nota utente",
        titleShort: "Eliminare le note",
        description:
          "Eliminare una nota CRM. solo l'autore o un amministratore possono fare questo",
        fields: {
          noteId: {
            label: "Nota ID",
            description: "La nota per cancellare",
            placeholder: "Nota UUID",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Nota non valida ID",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Devi essere connesso",
          },
          forbidden: {
            title: "Accesso negato",
            description:
              "Solo l'autore o un amministratore possono cancellare questa nota",
          },
          notFound: {
            title: "Non trovato",
            description: "Nota non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "La richiesta di rete è fallita",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          internal: {
            title: "Errore interno",
            description: "Errore del server. riprovare",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
        },
        success: {
          title: "Nota Cancellata",
          description: "La nota è stata definitivamente rimossa",
        },
        widget: {
          warning: "Questa nota verrà cancellata in modo permanente.",
          deleted: "Nota cancellata.",
          backToNotes: "Torna a Note",
        },
        response: {
          deleted: "Cancellato",
        },
      },
      tag: "CRM",
    },
  },
};
