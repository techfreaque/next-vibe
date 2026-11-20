import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Utenti",

  post: {
    title: "Rimettitore di posta elettronica",
    titleShort: "Verificare il Mietitore",
    description:
      "Invia un promemoria agli account che non hanno confermato l’email entro 24 ore dalla registrazione. Per ottenere i crediti gratuiti, devono confermare l’indirizzo.",
    tag: "Verificare il Mietitore",
    container: {
      title: "Rimettitore di posta elettronica",
      description:
        "Account creati tra 24 e 25 ore fa con email ancora da confermare",
    },
    fields: {
      batchSize: {
        label: "Dimensione della batch",
        description: "Promemoria massima per corsa",
      },
      dryRun: {
        label: "Correre a secco",
        description: "Conta chi potrebbe ottenere un promemoria senza inviare",
      },
    },
    response: {
      candidates: "Conti non verificati nella finestra",
      sent: "Reminenti inviati",
      skipped: "Asciugata",
      failed: "Sfigato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description:
          "Devi essere un amministratore per inviare i promemoria di verifica",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      server: {
        title: "Errore del server",
        description: "Invio dei promemoria di verifica falliti",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Impostazioni di promemoria non valide",
      },
    },
    success: {
      title: "Reminders Processed",
      description: "Promemoria di e-mail verificate",
    },
  },
  task: {
    name: "verify-email-reminder",
    description:
      "Ogni ora invia un promemoria agli account che non hanno confermato l’email dopo 24 ore dalla registrazione",
  },
};
