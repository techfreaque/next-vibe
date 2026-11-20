import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guardia di sistema",

  title: "Guardia di distruzione",
  titleShort: "Guardia di distruzione",
  description: "Distruggere ambienti di guardia e pulire le risorse",
  tag: "gestione della guardia",
  container: {
    title: "Configurazione della guardia di distruzione",
    description:
      "Configurare i parametri per distruggere gli ambienti di guardia",
  },
  fields: {
    projectPath: {
      title: "Percorso del progetto",
      description: "Percorso alla directory del progetto",
      placeholder: "/home/user/projects/my-project",
    },
    guardId: {
      title: "Guardia ID",
      description: "Identificatore unico per la guardia",
      placeholder: "guard_my_project_abc123",
    },
    force: {
      title: "Distruggere la forza",
      description: "La forza distrugge anche se la guardia sta correndo",
    },
    cleanupFiles: {
      title: "File di pulizia",
      description: "Rimuovere tutti i file relativi alla guardia",
    },
    dryRun: {
      title: "Correre a secco",
      description:
        "Anteprima cosa sarebbe distrutto senza distruggere realmente",
    },
    success: {
      title: "Operazione riuscita",
    },
    output: {
      title: "Produzione",
    },
    destroyedGuards: {
      title: "Guardie distruttive",
    },
    warnings: {
      title: "Avvertenze",
    },
    totalDestroyed: {
      title: "Totale Distrutto",
    },
    username: {
      title: "Nome utente",
    },
    wasRunning: {
      title: "Correre",
    },
    filesRemoved: {
      title: "File rimossi",
    },
    userRemoved: {
      title: "Utente rimosso",
    },
  },
  form: {
    title: "Distruggere la configurazione",
    description: "Configurare i parametri di distruzione",
  },
  response: {
    title: "Risposta",
    description: "Distruggere i dati di risposta",
  },
  errors: {
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    validation: {
      title: "Errore di convalida",
      description: "Parametri della richiesta non validi",
    },
    server: {
      title: "Errore del server",
      description: "Si è verificato un errore interno del server",
    },
    internal: {
      title: "Errore interno",
      description: "Si è verificato un errore interno",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore sconosciuto",
    },
    network: {
      title: "Errore di rete",
      description: "Si è verificato un errore di rete",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
    notFound: {
      title: "Non trovato",
      description: "Risorsa non trovata",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono in conflitto",
    },
    destruction_failed: {
      title: "La distruzione della guardia non è riuscita: {{error}}",
      description: "Non è riuscito a distruggere l'ambiente di guardia",
    },
    guard_not_found: {
      title: "Nessuna guardia trovata per il progetto ' {{project}}'",
      description:
        "Nessun ambiente di guardia trovato per il progetto specificato",
    },
  },
  success: {
    title: "Operazione riuscita",
    description: "Operazione completata",
  },
};
