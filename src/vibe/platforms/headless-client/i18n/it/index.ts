import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Cliente intestato",
    titleShort: "headless",
    description: "Avviare il client di connessione remota senza testa",
    form: {
      title: "Cliente intestato",
      description:
        "Avvia le connessioni inversa- WS e l'esecutore degli strumenti. Nessun server web.",
    },
    fields: {
      computerName: {
        title: "Nome del computer",
        description:
          "Identificazione per questa macchina (defaults to OS hostname)",
      },
      remoteUrl: {
        title: "URL remoto",
        description: "Esame cloud URL per connettersi",
      },
      leadId: {
        title: "ID del contatto",
        description: "Il tuo UUID principale sull'istanza remota",
      },
      token: { title: "Token", description: "Collegamento a destra token" },
      output: { title: "Produzione" },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Input non valido",
      },
      network: { title: "Errore di rete", description: "Errore di rete" },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta",
      },
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      notFound: {
        title: "Account o sessione non trovati",
        description: "Account o sessione non trovati",
      },
      server: { title: "Errore del server", description: "Errore del server" },
      unknown: {
        title: "Errore sconosciuto",
        description: "Errore sconosciuto",
      },
      conflict: { title: "Conflitto", description: "Conflitto" },
      migrationFailed: "Migrazione fallita",
      migrationError: "Errore di migrazione",
    },
    success: {
      title: "Il cliente intestato ha iniziato",
      description:
        "Connessioni inversa- WS aperte, in attesa di richieste di strumenti",
    },
  },
};
