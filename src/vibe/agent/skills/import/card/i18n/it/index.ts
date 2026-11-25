import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strumenti AI",
  tags: {
    skills: "competenze",
  },
  enums: {
    visibility: {
      private: "Privato",
      unlisted: "Non elencato",
      public: "Pubblico",
    },
  },
  post: {
    title: "Importa scheda personaggio",
    titleShort: "Importa scheda",
    description:
      "Importa una scheda personaggio (V1, V2 o V3) da SillyTavern, Chub, RisuAI o qualsiasi app in formato Tavern. Accetta il file .json, una scheda .png con i dati incorporati o il JSON della scheda come testo. Nome, descrizione, personalità, scenario, primo messaggio, dialogo di esempio, istruzioni della scheda e tag diventano un nuovo personaggio tuo. L'immagine di una scheda PNG diventa l'avatar. Nulla nella scheda viene eseguito. Importare di nuovo la stessa scheda restituisce il personaggio esistente.",
    intro:
      "Porta con te i tuoi personaggi. Carica il file della scheda esportato da SillyTavern, Chub o RisuAI.",
    supported: "Schede V1, V2 e V3. JSON o PNG, fino a 10 MB.",
    mapping: {
      title: "Cosa viene importato",
      fields:
        "Nome, descrizione, personalità, scenario, primo messaggio, dialogo di esempio, istruzioni della scheda, tag, autore.",
      avatar: "Schede PNG: l'immagine diventa l'avatar.",
      safe: "Lorebook e script vengono saltati. Nulla nella scheda viene eseguito.",
    },
    card: {
      label: "File della scheda",
      description: "Scheda personaggio in .json o .png",
      validation: {
        required: "Scegli un file della scheda.",
        tooLarge: "Il file della scheda supera i 10 MB.",
      },
    },
    visibility: {
      label: "Visibilità",
      description:
        "Privato: solo tu. Non in elenco: fuori dalla lista pubblica. Pubblico: visibile a tutti.",
    },
    response: {
      id: { content: "ID personaggio" },
      name: { content: "Nome" },
      platform: { content: "Origine" },
      creatorName: { content: "Autore della scheda" },
      sourceUrl: { content: "Link di origine" },
      avatarUrl: { content: "Avatar" },
      alreadyImported: { content: "Già importato" },
      importedFields: { content: "Importato" },
    },
    fields: {
      name: "nome",
      avatar: "avatar",
      greeting: "primo messaggio",
      description: "descrizione",
      definition: "personalità e scenario",
      tags: "tag",
    },
    result: {
      imported: "{{name}} è pronto.",
      alreadyImported: "Hai già importato {{name}}. Apriamo la tua copia.",
      fieldsList: "Importato: {{fields}}",
      openSkill: "Apri personaggio",
      importAnother: "Importa un'altra scheda",
    },
    errors: {
      validation: {
        title: "Scheda non valida",
        description: "Scegli un file scheda personaggio (.json o .png).",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile raggiungere il server.",
      },
      unauthorized: {
        title: "Accesso richiesto",
        description: "Accedi per importare personaggi.",
      },
      forbidden: {
        title: "Non consentito",
        description: "Il tuo account non può importare personaggi.",
      },
      notFound: {
        title: "Non trovato",
        description: "Scheda non trovata.",
      },
      server: {
        title: "Importazione non riuscita",
        description:
          "Qualcosa è andato storto durante l'importazione. Riprova.",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto.",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate.",
      },
      conflict: {
        title: "Importazione in corso",
        description: "Questa scheda è già in fase di importazione.",
      },
      invalidCard:
        "Non è una scheda personaggio. Usa il file .json o .png esportato da SillyTavern, Chub o RisuAI.",
      noCardInPng:
        "Questo PNG non contiene dati della scheda. Esportalo di nuovo come scheda personaggio o usa il file .json.",
      rateLimited:
        "Troppe importazioni. Attendi {{seconds}} secondi e riprova.",
    },
    success: {
      title: "Personaggio importato",
      description: "La tua copia è pronta per chattare.",
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Importa scheda",
      loadingText: "Importazione...",
    },
  },
};
