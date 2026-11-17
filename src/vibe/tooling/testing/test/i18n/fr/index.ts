import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lancer les tests",
  titleShort: "Lancer les tests",
  description: "Exécuter la suite de tests avec des options facultatives",
  category: "Tests",
  tag: "Test",

  container: {
    title: "Configuration des tests",
    description: "Paramètres d'exécution des tests",
  },

  fields: {
    path: {
      label: "Chemin des tests",
      description: "Chemin des fichiers ou du répertoire de tests",
      placeholder: "src/",
    },
    verbose: {
      label: "Sortie détaillée",
      description: "Activer la sortie détaillée des tests",
    },
    watch: {
      label: "Mode watch",
      description: "Relancer les tests à chaque modification de fichier",
    },
    coverage: {
      label: "Rapport de couverture",
      description: "Générer le rapport de couverture des tests",
    },
  },

  response: {
    success: "Statut de l'exécution des tests",
    output: "Sortie et résultats des tests",
    duration: "Durée d'exécution des tests (ms)",
  },

  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de configuration des tests invalides",
    },
    internal: {
      title: "Erreur interne",
      description: "Échec de l'exécution des tests suite à une erreur interne",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Permission refusée pour exécuter les tests",
    },
    forbidden: {
      title: "Interdit",
      description: "L'exécution des tests est interdite",
    },
    notFound: {
      title: "Introuvable",
      description: "Fichiers ou répertoire de tests introuvables",
    },
    server: {
      title: "Erreur serveur",
      description: "Erreur serveur pendant l'exécution des tests",
    },
    unknown: {
      title: "Erreur inconnue",
      description: "Une erreur inattendue s'est produite",
    },
    unsaved: {
      title: "Modifications non enregistrées",
      description:
        "Des modifications non enregistrées peuvent influencer les tests",
    },
    conflict: {
      title: "Conflit",
      description: "Conflit détecté pendant l'exécution des tests",
    },
    executionFailed:
      "Échec de l'exécution des tests après {{duration}} ms : {{detail}}\n{{output}}",
    streamingUnsupported:
      "Les réponses en streaming ne sont pas prises en charge dans les tests",
    responseSchemaFailed:
      "Échec de la validation du schéma de réponse pour {{path}} : {{issues}}",
    requestFailed: "Échec de la requête de test : {{detail}}",
    browser: {
      serverNotRunning:
        "Le serveur de dev Atlas ne tourne pas. Lancez-le avec vibe dev",
      openFailed: "Impossible d'ouvrir la page du navigateur : {{detail}}",
      fillFailed: "Impossible de remplir les champs du formulaire : {{detail}}",
      submitFailed: "Impossible de cliquer sur le bouton d'envoi : {{detail}}",
      evaluateFailed:
        "Échec de l'évaluation du script sur la page : {{detail}}",
      resultTimeout:
        "Aucun résultat de mutation reçu dans les {{timeoutMs}} ms",
      parseFailed:
        "Impossible de parser la réponse en cache comme JSON : {{raw}}",
      cacheEmpty:
        "Le cache de mutation est vide : la réponse n'a jamais été chargée",
      requestFailed: "Échec du test navigateur : {{detail}}",
    },
  },

  success: {
    title: "Tests terminés",
    description: "Exécution des tests terminée",
  },
};
