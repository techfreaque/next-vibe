import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Operazioni Docker",
  titleShort: "Docker DB",
  description: "Eseguire i comandi Docker e gestire i container",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "Utilità",
    dockeroperations: "Operazioni Docker",
  },
  container: {
    title: "Operazioni Docker",
    description:
      "Eseguire i comandi Docker con una corretta gestione degli errori",
  },
  fields: {
    command: {
      label: "Comando Docker",
      description: "Il comando Docker per eseguire",
      placeholder: "docker ps",
    },
    options: {
      label: "Opzioni di esecuzione",
      description: "Opzioni di configurazione per l'esecuzione dei comandi",
      placeholder: "Configurare le opzioni di timeout e registrazione",
    },
  },
  response: {
    success: {
      label: "Successo di comando",
    },
    output: {
      label: "Uscita del comando",
    },
    error: {
      label: "Dettagli di errore",
    },
  },
  errors: {
    validation: {
      title: "Errore di convalida",
      description: "Parametri di comando Invalid Docker",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Autenticazione richiesta per le operazioni Docker",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Autorizzazioni insufficienti per le operazioni Docker",
    },
    internal: {
      title: "Errore di Docker",
      description: "Esecuzione dei comandi Docker non riuscita",
    },
    timeout: {
      title: "Timeout di comando",
      description: "Il comando Docker supera il limite di timeout",
    },
    executionFailed: {
      title: "Esecuzione fallita: {{error}}",
      description: "Esecuzione dei comandi Docker non riuscita",
    },
    composeDownFailed: {
      title: "Compose down fail: {{error}}",
      description: "Docker Compose down operazione guasto",
    },
    composeUpFailed: {
      title: "Compose up fallito: {{error}}",
      description: "Docker Compose up operazione guasto",
    },
  },
  success: {
    title: "Comando Docker Successo",
    description: "comando Docker eseguito con successo",
  },
  messages: {
    executingCommand: "Eseguire il comando Docker: {command}",
    timeoutError: "Il comando Docker è in orario dopo {timeout} ms: {command}",
    commandFailed:
      "Il comando Docker non è riuscito con il codice {code}: {command}",
    executionFailed: "Non eseguito il comando Docker: {command}",
    commandError: "Errore di comando Docker: {error}",
  },
};
