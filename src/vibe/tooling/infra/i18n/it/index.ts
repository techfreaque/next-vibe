import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Infrastrutture",
  type: "Infrastrutture",

  enums: {
    infraStatus: {
      pending: "Finanziamenti",
      provisioning: "Disposizioni",
      ready: "Pronti",
      degraded: "Degrado",
      error: "Errore",
    },
    componentStatus: {
      unknown: "Sconosciuto",
      healthy: "Salute",
      degraded: "Degrado",
      down: "Giù",
    },
    scaleComponent: {
      web: "Web (Next.js)",
      tasks: "Funzionalità Runner",
      storage: "Stoccaggio (MinIO)",
    },
  },

  errors: {
    noControlPlane:
      "Nessun collegamento SSH contrassegnato come piano di controllo. Etichetta prima un server nelle impostazioni SSH.",
    noClusterNodes:
      "Nessuna connessione SSH contrassegnata come nodi di cluster. Etichetta almeno un server come piano di controllo.",
    kubeconfigMissing: "Kubeconfig non trovato. Eseguire cluster-init prima.",
    pulumiNotInstalled:
      "Pulumi CLI non installato. Installarlo con: curl -fsSL https://get.pulumi.com | sh",
    sshExecFailed: "Il comando SSH non è riuscito su nodo",
    k3sInstallFailed: "installazione k3s fallito",
    scaleTargetNotFound: "Deployment non trovato in cluster",
    connectionNotFound: "Connessione SSH non trovata",
    encryptionFailed: "Decrittografia Credenziale fallita",
    connectTimeout: "Collegamento SSH time out",
    sshAuthFailed: "L'autenticazione SSH non è riuscita",
    sshConnectionFailed: "connessione SSH guasto",
    fingerprintMismatch: "Mismatch chiave di impronta digitale dell'host SSH",
  },

  cluster: {
    init: {
      post: {
        title: "Inizializzare Cluster",
        titleShort: "Init Cluster",
        description:
          "Fornire k3 su server SSH contrassegnati. Installa k3s, database, Redis, MinIO e ingresso.",
        container: { title: "Cluster Init" },
        fields: {
          clusterName: {
            label: "Nome del cluster",
            description:
              "Nome per questo cluster (utilizzato in kubeconfig ed etichette)",
            placeholder: "next-vibe-prod",
          },
          domain: {
            label: "Domini",
            description:
              "Dominio di base per l'ingresso (ad esempio example.com → app.example.com)",
            placeholder: "example.com",
          },
          email: {
            label: "Email",
            description: "Contatto email per Let's Encrypt TLS certificati",
            placeholder: "admin@example.com",
          },
          k3sVersion: {
            label: "Versione di k3s",
            description: "k3s rilascio per installare",
            placeholder: "v1.31.0+k3s1",
          },
          dryRun: {
            label: "Simulazione",
            description:
              "Anteprima cosa sarebbe installato senza apportare modifiche",
          },
          skipDatabase: {
            label: "Salta il database",
            description: "Installazione di Skip CloudNativePG PostgreSQL",
          },
          skipRedis: {
            label: "Skip Redis",
            description: "Installazione di Skip Redis Sentinel",
          },
          skipStorage: {
            label: "Salta la conservazione",
            description:
              "Salta MinIO installazione di archiviazione distribuita",
          },
          skipIngress: {
            label: "Salta l'ingresso",
            description: "Skip nginx-ingress e installazione cert-manager",
          },
        },
        response: {
          success: { title: "Operazione riuscita" },
          message: { title: "Messaggio" },
          nodesProvisioned: { title: "Nodi previsti" },
          componentsInstalled: { title: "Componenti installati" },
          kubeconfig: { title: "Kubeconfig" },
          duration: { title: "Durata (m)" },
        },
        success: {
          title: "Cluster pronto",
          description: "k3s cluster fornito con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Configurazione cluster non valido",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso all'amministratore richiesto",
          },
          server: {
            title: "Fornitura non riuscita",
            description: "L'inizializzazione del cluster è fallita",
          },
          notFound: {
            title: "Nessun risultato trovato",
            description:
              "No connessioni SSH contrassegnate come nodi di cluster",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Il cluster esiste già o viene fornito",
          },
          network: {
            title: "Errore di rete",
            description: "Non è possibile raggiungere i nodi di cluster",
          },
        },
      },
    },
    status: {
      get: {
        title: "Stato del cluster",
        titleShort: "Stato del cluster",
        description:
          "Mostrare la salute dei nodi k8s, i conteggi dei pod e lo stato dei componenti",
        container: { title: "Stato del cluster" },
        response: {
          nodes: { title: "Nodi" },
          components: { title: "Componenti" },
          overallStatus: { title: "Stato generale" },
          podCounts: { title: "Contenitori di Pod" },
        },
        success: {
          title: "Stato recuperato",
          description: "Stato cluster recuperato con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri non validi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso all'amministratore richiesto",
          },
          server: {
            title: "Errore del server",
            description: "Non riuscita a ottenere lo stato del cluster",
          },
          notFound: {
            title: "Nessun cluster",
            description:
              "Nessun cluster configurato. Eseguire cluster-init prima.",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Non poteva raggiungere il cluster",
          },
        },
      },
    },
  },

  deploy: {
    push: {
      post: {
        title: "Distribuzione",
        titleShort: "Distribuzione",
        description:
          "Applicare le modifiche dell'infrastruttura tramite Pulumi (pulumi up)",
        container: { title: "Distribuzione" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nome dello stack Pulumi",
            placeholder: "prod",
          },
          skipPreview: {
            label: "Salta Anteprima",
            description:
              "Applicare le modifiche senza mostrare prima un'anteprima",
          },
        },
        response: {
          success: { title: "Operazione riuscita" },
          message: { title: "Messaggio" },
          changes: { title: "Variazioni" },
          duration: { title: "Durata (m)" },
        },
        success: {
          title: "Distribuito",
          description: "Infrastrutture impiegate con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Configurazione di distribuzione non valida",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso all'amministratore richiesto",
          },
          server: {
            title: "Diploy non riuscito",
            description: "Pulumi è fallito",
          },
          notFound: {
            title: "Nessun cluster",
            description: "Nessun cluster configurato",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Una distribuzione è già in corso",
          },
          network: {
            title: "Errore di rete",
            description: "Non poteva raggiungere il cluster",
          },
        },
      },
    },
    preview: {
      post: {
        title: "Anteprima di distribuzione",
        titleShort: "Anteprima",
        description:
          "Anteprima modifiche dell'infrastruttura senza applicarle (anteprima dipulumi)",
        container: { title: "Anteprima di distribuzione" },
        fields: {
          stack: {
            label: "Stack",
            description: "Nome dello stack Pulumi",
            placeholder: "prod",
          },
        },
        response: {
          success: { title: "Operazione riuscita" },
          message: { title: "Messaggio" },
          preview: { title: "Anteprima" },
          duration: { title: "Durata (m)" },
        },
        success: {
          title: "Anteprima pronto",
          description: "Anteprima generata con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Configurazione non valida",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso all'amministratore richiesto",
          },
          server: {
            title: "Anteprima non riuscita",
            description: "Anteprima Pulumi fallita",
          },
          notFound: {
            title: "Nessun cluster",
            description: "Nessun cluster configurato",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Non poteva raggiungere il cluster",
          },
        },
      },
    },
  },

  scale: {
    replicas: {
      post: {
        title: "Scala",
        titleShort: "Scala",
        description: "Scalare una distribuzione nel cluster",
        container: { title: "Distribuzione della scala" },
        fields: {
          component: {
            label: "Componenti",
            description: "Quale distribuzione per scala",
          },
          replicas: {
            label: "Replica",
            description: "Rivestimento obiettivo (0 = pausa)",
            placeholder: "2",
          },
        },
        response: {
          success: { title: "Operazione riuscita" },
          message: { title: "Messaggio" },
          previousReplicas: { title: "Precedente Replica" },
          newReplicas: { title: "Nuove repliche" },
        },
        success: {
          title: "Scala",
          description: "Distribuzione scalata con successo",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di scala non valida",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso all'amministratore richiesto",
          },
          server: {
            title: "Scala non riuscita",
            description: "Non è possibile scalare la distribuzione",
          },
          notFound: {
            title: "Distribuzione non trovata",
            description: "Deployment non trovato in cluster",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Rilevamento delle modifiche non rilevate",
          },
          conflict: {
            title: "Conflitto",
            description: "Si è verificato un conflitto",
          },
          network: {
            title: "Errore di rete",
            description: "Non poteva raggiungere il cluster",
          },
        },
      },
    },
  },
};
