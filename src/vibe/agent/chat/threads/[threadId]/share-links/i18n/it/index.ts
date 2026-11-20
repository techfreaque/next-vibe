import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    sharing: "Condividere",
  },
  // Top-level keys used across methods
  empty: "", // For hidden/internal fields
  linkId: {
    label: "Link ID",
  },
  label: {
    label: "Etichetta",
    description: "Etichetta opzionale per identificare questo link",
    placeholder: "Inserisci un'etichetta per questo link di condivisione",
  },
  allowPosting: {
    label: "Consentire la pubblicazione",
    description: "Consenti ai destinatari di inviare messaggi in questo thread",
  },
  requireAuth: {
    label: "Autenticazione richiesta",
    description: "Richiedete agli utenti di accedere a questo link",
  },
  shareLink: {
    label: "Etichetta",
    shareUrl: "Condividere URL",
    active: "Attivo",
    allowPosting: "Consentire la pubblicazione",
    requireAuth: "Requisisci Auth",
    accessCount: "Contatore di accesso",
    lastAccessedAt: "Ultimo accesso",
    createdAt: "Creato",
    editAction: "Modifica",
    deleteAction: "Votazioni",
  },
  shareLinks: {
    emptyTitle: "Nessun link di condivisione",
    emptyDescription:
      "Creare un link di condivisione per condividere questo thread con altri",
  },
  get: {
    title: "Ottieni collegamenti condivisi",
    titleShort: "Link di condivisione",
    description: "Recuperare tutti i link di condivisione per un thread",
    container: {
      title: "Link di condivisione",
      description: "Tutti i link condivisi per questo thread",
    },
    response: {
      shareLink: {
        title: "Link di condivisione",
        id: {
          content: "Link ID",
        },
        token: {
          content: "Token di condivisione",
        },
        label: {
          content: "Etichetta",
        },
        allowPosting: {
          content: "Consentire la pubblicazione",
        },
        requireAuth: {
          content: "Requisisci Auth",
        },
        active: {
          content: "Attivo",
        },
        accessCount: {
          content: "Contatore di accesso",
        },
        lastAccessedAt: {
          content: "Ultimo accesso",
        },
        createdAt: {
          content: "Creato",
        },
        editAction: {
          text: "Modifica",
        },
        deleteAction: {
          text: "Votazioni",
        },
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per visualizzare i link di condivisione",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Non hai il permesso di visualizzare questi link condivisi",
      },
      removed: {
        title: "Rimossa o in fase di revisione",
        description:
          "Questo thread condiviso è stato segnalato e non è più disponibile.",
      },
      notFound: {
        title: "Non trovato",
        description: "Filettatura o condivisione link non trovato",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscito a recuperare i link di condivisione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Questa risorsa è stata modificata",
      },
    },
    backButton: {
      label: "Indietro",
    },
    success: {
      title: "Operazione riuscita",
      description: "Condividi i link recuperati con successo",
    },
  },
  post: {
    title: "Creare link Condividi",
    titleShort: "Link di condivisione",
    description: "Creare un nuovo link di condivisione per un thread",
    container: {
      title: "Nuovo link Condividi",
      description: "Configura il tuo nuovo link di condivisione",
    },
    label: {
      label: "Etichetta",
      description: "Etichetta opzionale per identificare questo link",
      placeholder: "Inserisci un'etichetta per questo link di condivisione",
    },
    allowPosting: {
      label: "Consentire la pubblicazione",
      description:
        "Consenti ai destinatari di inviare messaggi in questo thread",
    },
    requireAuth: {
      label: "Autenticazione richiesta",
      description: "Richiedete agli utenti di accedere a questo link",
    },
    response: {
      id: {
        content: "Link ID",
      },
      token: {
        content: "Token di condivisione",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di link di condivisione non valida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per creare link condivisi",
      },
      forbidden: {
        title: "Accesso negato",
        description:
          "Solo i filetti nella cartella condivisa possono essere condivisi tramite link",
      },
      notFound: {
        title: "Non trovato",
        description: "Conversazione non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a creare link di condivisione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Questa risorsa è stata modificata",
      },
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Creare link",
      loadingText: "Creare...",
    },
    success: {
      title: "Operazione riuscita",
      description: "Condividi link creato con successo",
    },
  },
  patch: {
    title: "Aggiornamento Link Share",
    titleShort: "Aggiornamento Link",
    description: "Aggiornare un link di condivisione esistente",
    container: {
      title: "Aggiornamento Link Share",
      description: "Modificare le impostazioni del link di condivisione",
    },
    linkId: {
      label: "Link ID",
      description: "ID del link per aggiornare",
    },
    label: {
      label: "Etichetta",
      description: "Etichetta opzionale per identificare questo link",
      placeholder: "Inserisci un'etichetta per questo link di condivisione",
    },
    allowPosting: {
      label: "Consentire la pubblicazione",
      description:
        "Consenti ai destinatari di inviare messaggi in questo thread",
    },
    requireAuth: {
      label: "Autenticazione richiesta",
      description: "Richiedete agli utenti di accedere a questo link",
    },
    deleteAction: {
      text: "Link di fatturazione",
    },
    response: {
      id: {
        content: "Link ID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di aggiornamento non validi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere connesso per aggiornare i link di condivisione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questo link",
      },
      notFound: {
        title: "Non trovato",
        description: "Condividi link non trovato",
      },
      server: {
        title: "Errore del server",
        description: "Non è stato possibile aggiornare il link di condivisione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Questa risorsa è stata modificata",
      },
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Salvare le modifiche",
      loadingText: "Salvare...",
    },
    success: {
      title: "Operazione riuscita",
      description: "Condividi link aggiornato con successo",
    },
  },
  delete: {
    title: "Revoke Share Link",
    titleShort: "Link di fatturazione",
    description: "Revocare un link di condivisione attivo",
    container: {
      title: "Revoke Share Link",
      description: "Questo disattiva il link in modo permanente",
    },
    linkId: {
      label: "Link ID",
      description: "ID del link per revocare",
    },
    response: {
      id: {
        content: "Link ID",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Link non valido ID",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per revocare i link di condivisione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di revocare questo link",
      },
      notFound: {
        title: "Non trovato",
        description: "Condividi link non trovato",
      },
      server: {
        title: "Errore del server",
        description: "Non revocare il link di condivisione",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile connettersi al server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Questa risorsa è stata modificata",
      },
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Link di fatturazione",
      loadingText: "Rispondendo...",
    },
    success: {
      title: "Operazione riuscita",
      description: "Condividi link revocato con successo",
    },
  },
  widget: {
    shareDialog: {
      title: "Condividi",
      copyLink: "Copia il link",
    },
    visibility: {
      publicTitle: "Chiunque con il link può visualizzare",
      publicDescription:
        "Il filo è nella cartella condivisa. il collegamento è vivo.",
      privateTitle: "Privato",
      privateDescription: "Solo tu puoi accedere a questo thread.",
      makePublic: "Rendere pubblico",
      makePrivate: "Fare in privato",
      toggling: "Salvare...",
    },
    emailShare: {
      placeholder: "Invitare via email",
      send: "Invia",
    },
    common: {
      close: "Fatto",
    },
  },
};
