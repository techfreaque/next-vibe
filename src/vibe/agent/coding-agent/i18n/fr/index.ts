import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  "claude-code": "Claude Code",
  "open-code": "OpenCode",
  codex: "Codex",
  antigravity: "Antigravity CLI",
  idle: "Inactif",
  running: "En cours",
  completed: "Terminé",
  interrupted: "Interrompu",
  failed: "Échec",
  "read-only": "Lecture seule",
  "workspace-write": "Écriture dans le projet",
  "danger-full-access": "Accès complet",
  codingAgent: {
    tags: {
      tasks: "Tâches",
    },
    run: {
      post: {
        title: "Lancer l'agent de code",
        titleShort: "Agent de code",
        dynamicTitle: "Agent de code : {{prompt}}",
        description:
          "Exécute une tâche avec Claude Code, OpenCode, Codex ou Antigravity. Indiquez un nom pour conserver et reprendre la conversation avec guidage en direct, ou activez interactiveMode=true pour ouvrir un terminal.",
        fields: {
          name: {
            label: "Nom de l'agent",
            description:
              "Nom persistant facultatif (1 à 40 lettres, chiffres, tirets ou traits de soulignement). Réutiliser le nom reprend la conversation.",
          },
          prompt: {
            label: "Tâche",
            description:
              "La tâche ou la question à confier à l'agent de code. Précisez les chemins de fichiers, le contexte et les vérifications attendues.",
          },
          promptFile: {
            label: "Fichier de tâche",
            description:
              "Chemin d'un fichier de brief relatif au dossier courant. Alternative au texte direct.",
          },
          provider: {
            label: "Fournisseur",
            description:
              "CLI à utiliser : claude-code, open-code, codex ou antigravity. Par défaut codex pour un nouvel agent nommé, claude-code sinon.",
            options: {
              claudeCode: "Claude Code",
              openCode: "OpenCode",
              codex: "Codex",
              antigravity: "Antigravity CLI",
            },
          },
          model: {
            label: "Modèle",
            description:
              "Identifiant de modèle du fournisseur. Laissez vide pour le modèle par défaut (Gemini 4 Neon High pour Antigravity, gpt-6.2-sol pour Codex).",
          },
          effort: {
            label: "Effort de raisonnement",
            description:
              "Niveau de raisonnement pour Codex ou Antigravity (ex. low, medium, high).",
          },
          sandbox: {
            label: "Sandbox Codex",
            description:
              "Mode d'isolation fichiers pour Codex (read-only, workspace-write ou danger-full-access).",
          },
          cwd: {
            label: "Dossier de travail",
            description:
              "Dossier dans lequel l'agent s'exécute. Dossier courant par défaut.",
          },
          fresh: {
            label: "Nouvelle conversation",
            description:
              "Démarre une nouvelle conversation au lieu de reprendre le fil enregistré pour ce nom.",
          },
          taskTitle: {
            label: "Titre de la tâche",
            description:
              "Titre court pour archiver cette tâche. Généré à partir du prompt s'il est omis.",
          },
          interactiveMode: {
            label: "Mode interactif",
            description:
              "false (PAR DÉFAUT) : s'exécute sans interface et renvoie la sortie. true : ouvre un terminal en direct et renvoie le résultat à la fin.",
          },
          output: {
            label: "Sortie",
            description:
              "Réponse finale ou stdout combiné de l'agent. Vide lorsque la tâche s'exécute en arrière-plan.",
          },
          durationMs: {
            label: "Durée (ms)",
            description: "Durée totale d'exécution du processus.",
          },
          threadId: {
            label: "ID de conversation",
            description:
              "Identifiant de fil ou de session enregistré pour reprendre un agent nommé.",
          },
          status: {
            label: "État",
            description: "Issue du tour de l'agent persistant.",
          },
          taskId: {
            label: "ID de la tâche",
            description:
              "En mode interactif : ID de suivi de la tâche. Le résultat revient automatiquement.",
          },
          hint: {
            label: "Indication",
            description:
              "Indique à l'IA comment le résultat lui sera transmis.",
          },
        },
        errors: {
          validation: {
            title: "Erreur de validation",
            description:
              "Paramètres invalides. Vérifiez le nom, la tâche et les options.",
          },
          unauthorized: {
            title: "Non autorisé",
            description:
              "Connexion requise. Compte admin ou connexion CLI nécessaire.",
          },
          internal: {
            title: "Échec de l'exécution",
            description:
              "Le processus de l'agent n'a pas démarré ou s'est interrompu de façon inattendue.",
          },
          binaryMissing: {
            title:
              "{{bin}} n'est pas installé sur cette instance. Installez-le ou choisissez un autre fournisseur.",
            description:
              "Le binaire CLI de l'agent de code est introuvable dans le PATH du serveur.",
          },
          internalExitCode: {
            title: "Échec de l'exécution (code {{exitCode}})",
            description:
              "Le processus de l'agent de code s'est terminé avec un code non nul.",
          },
          forbidden: {
            title: "Accès refusé",
            description:
              "Accès refusé. Vérifiez les autorisations du fournisseur choisi.",
          },
          notFound: {
            title: "Introuvable",
            description:
              "Agent, fichier de tâche ou dossier de travail introuvable.",
          },
          vibeCoderRedirect: {
            title: "Utilisez plutôt ai-run avec vibe-coder",
            description:
              "L'agent de code est réglé sur vibe-coder. Utilisez l'outil ai-run avec la compétence vibe-coder.",
          },
          network: {
            title: "Erreur réseau",
            description:
              "Le fournisseur ou l'agent de code est indisponible pour le moment.",
          },
          unknown: {
            title: "Erreur inconnue",
            description:
              "Une erreur inattendue s'est produite pendant l'exécution.",
          },
          unsaved: {
            title: "Modifications non enregistrées",
            description: "Conflit avec des modifications non enregistrées.",
          },
          conflict: {
            title: "Conflit",
            description:
              "Une session utilise déjà ce nom ou la conversation enregistrée utilise un autre fournisseur.",
          },
          detail: "L'opération de l'agent a échoué : {{detail}}",
        },
        backButton: {
          label: "Retour",
        },
        submitButton: {
          label: "Lancer",
          loadingText: "Exécution...",
        },
        success: {
          title: "Agent de code terminé",
          description:
            "L'agent de code s'est terminé avec succès. Si la sortie est vide, le résultat arrivera dans le fil.",
        },
        widget: {
          runningBatch: "Exécution...",
          runningInteractive:
            "Ouverture de la session de terminal interactive...",
          escalated:
            "Exécution en arrière-plan. Le résultat sera injecté à la fin.",
          taskIdLabel: "ID de la tâche",
          outputLabel: "Sortie",
          interactiveSessionLaunched:
            "Session interactive lancée dans le terminal.",
          copyOutput: "Copier",
          copied: "Copié !",
          interactive: "Interactif",
          emptyPromptHint:
            "Saisissez un prompt ci-dessous pour lancer l'agent de code",
          agentNamePlaceholder: "Nom de l'agent (facultatif)",
        },
      },
    },
    say: {
      post: {
        title: "Guider un agent de code",
        titleShort: "Guider l'agent",
        description:
          "Envoie un message en cours de tour à un agent Codex ou Antigravity actif. Une fois le tour terminé, réutilisez son nom avec coding-agent pour continuer.",
        success: {
          title: "Message transmis",
          description: "Le message a été envoyé à l'agent en cours.",
        },
        fields: {
          message: {
            label: "Message",
            description: "Instruction à injecter dans le tour actif.",
          },
          messageFile: {
            label: "Fichier du message",
            description:
              "Chemin d'un fichier contenant le message, relatif au dossier courant.",
          },
          delivered: {
            label: "Transmis",
          },
        },
      },
    },
    interrupt: {
      post: {
        title: "Interrompre un agent de code",
        titleShort: "Interrompre l'agent",
        description:
          "Arrête le tour actif d'un agent Codex ou Antigravity. Réutilisez son nom plus tard pour reprendre la conversation.",
        success: {
          title: "Interruption demandée",
          description: "Demande d'interruption traitée pour l'agent de code.",
        },
        fields: {
          interrupted: {
            label: "Interruption envoyée",
          },
          noInterrupt: {
            label: "Aucun tour en cours",
          },
        },
      },
    },
    list: {
      post: {
        title: "Lister les agents de code",
        titleShort: "Lister les agents",
        description:
          "Liste les agents de code actifs et enregistrés. Indiquez un nom pour voir son état, ses dernières traces et sa dernière réponse.",
        success: {
          title: "Agents listés",
          description: "Agents de code actifs et enregistrés chargés.",
        },
        fields: {
          summary: "{{name}} · {{provider}} · {{status}}",
          agents: {
            label: "Agents",
          },
          noAgents: {
            label: "Aucun agent de code persistant pour l'instant.",
          },
          lines: {
            label: "Lignes de trace",
            description:
              "Nombre de dernières lignes de trace à afficher pour un agent donné.",
          },
          tail: {
            label: "Dernières traces",
          },
          emptyTail: {
            label: "La trace est vide.",
          },
          lastMessage: {
            label: "Dernière réponse",
          },
          lastError: {
            label: "Dernière erreur",
          },
          startedAt: {
            label: "Début",
          },
          finishedAt: {
            label: "Fin",
          },
        },
      },
    },
  },
};
