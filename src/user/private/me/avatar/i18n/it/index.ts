import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Profilo utente",

  tag: "avatar",
  errors: {
    user_not_found: "Utente {{userId}} non trovato",
    failed_to_upload_avatar: "Non caricare avatar per {{userId}}: {{error}}",
    failed_to_delete_avatar:
      "Non è riuscito a eliminare l'avatar per {{userId}}: {{error}}",
    invalid_file_type:
      "Invalid file type {{providedType}}. Consentito: {{allowedTypes}}",
    file_too_large: "File troppo grande: {{providedSize}}. Max {{maxSize}}",
  },
  debug: {
    uploadingUserAvatar: "Caricamento dell'avatar dell'utente",
    errorUploadingUserAvatar: "Caricamento di errore utente avatar",
    deletingUserAvatar: "Cancellare l'avatar dell'utente",
    errorDeletingUserAvatar: "Cancellazione errore utente avatar",
  },
  success: {
    uploaded: "Avatar caricato con successo",
    deleted: "Avatar cancellato con successo",
    nextSteps: {
      visible: "Il tuo avatar è ora visibile sul tuo profilo",
      update:
        "Puoi aggiornarlo in qualsiasi momento dalle impostazioni del tuo profilo",
      default: "Il tuo profilo ora mostra l'avatar predefinito",
      uploadNew:
        "È possibile caricare un nuovo avatar in qualsiasi momento dalle impostazioni del profilo",
    },
  },
  upload: {
    title: "Caricamento Avatar",
    titleShort: "Caricamento Avatar",
    description: "Caricare un'immagine avatar profilo",
    groups: {
      fileUpload: {
        title: "Caricamento file",
        description: "Selezionare e caricare l'immagine avatar",
      },
    },
    fields: {
      file: {
        label: "Immagine di Avatar",
        description:
          "Selezionare un file di immagine per il tuo profilo avatar",
        placeholder: "Scegli un file di immagine...",
        help: "Caricare un file immagine (JPG, PNG, GIF) fino a 5MB",
        validation: {
          maxSize: "La dimensione del file deve essere inferiore a 5MB",
          imageOnly: "Solo i file di immagine sono permessi",
          unsupportedFormat:
            "Formato dell'immagine non supportato. Utilizzare JPEG, PNG, WebP o GIF.",
        },
      },
    },
    response: {
      title: "Rispondere a carico",
      label: "Risultato di carico",
      description: "Risposta di upload Avatar",
      success: "Caricamento di successo",
      message: "Il tuo avatar è stato caricato con successo",
      avatarUrl: "Avatar URL",
      uploadTime: "Tempo di caricamento",
      nextSteps: {
        item: "Prossimo passo",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Il file caricato non è valido o danneggiato",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per caricare un avatar",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a elaborare l'upload di avatar",
      },
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante il caricamento",
      },
      network: {
        title: "Errore di rete",
        description: "Un errore di rete si è verificato durante il caricamento",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di caricare un avatar",
      },
      notFound: {
        title: "Non trovato",
        description: "La risorsa richiesta non è stata trovata",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato durante il caricamento",
      },
    },
    success: {
      title: "Avatar Caricato",
      description: "Il tuo profilo avatar è stato caricato con successo",
    },
  },
  delete: {
    title: "Eliminare Avatar",
    titleShort: "Eliminare Avatar",
    description: "Rimuovere l'avatar del profilo corrente",
    response: {
      title: "Eliminare la risposta",
      label: "Eliminare il risultato",
      description: "Risposta di cancellazione Avatar",
      success: "Delezione Successo",
      message: "Il tuo avatar è stato cancellato con successo",
      nextSteps: {
        item: "Prossimo passo",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "La richiesta di cancellazione dell'avatar è invalida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Devi essere connesso per eliminare il tuo avatar",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a eliminare avatar",
      },
      internal: {
        title: "Errore interno",
        description: "Si è verificato un errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante la cancellazione",
      },
      network: {
        title: "Errore di rete",
        description:
          "Un errore di rete si è verificato durante la cancellazione",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eliminare questo avatar",
      },
      notFound: {
        title: "Non trovato",
        description: "L'avatar da eliminare non è stato trovato",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Un conflitto si è verificato durante la cancellazione",
      },
    },
    success: {
      title: "Avatar Cancellato",
      description: "Il tuo profilo avatar è stato rimosso con successo",
    },
  },
};
