import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Opérations Docker",
  titleShort: "Docker BDD",
  description: "Exécuter des commandes Docker et gérer les conteneurs",
  category: "Docker",
  tags: {
    docker: "Docker",
    utils: "Utilitaires",
    dockeroperations: "Opérations Docker",
  },
  container: {
    title: "Opérations Docker",
    description:
      "Exécuter des commandes Docker avec une gestion d'erreurs propre",
  },
  fields: {
    command: {
      label: "Commande Docker",
      description: "La commande Docker à exécuter",
      placeholder: "docker ps",
    },
    options: {
      label: "Options d'exécution",
      description: "Options de configuration de l'exécution de la commande",
      placeholder: "Configurer le délai et la journalisation",
    },
  },
  response: {
    success: {
      label: "Commande réussie",
    },
    output: {
      label: "Sortie de la commande",
    },
    error: {
      label: "Détails de l'erreur",
    },
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "Paramètres de commande Docker invalides",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Authentification requise pour les opérations Docker",
    },
    forbidden: {
      title: "Accès refusé",
      description: "Permissions insuffisantes pour les opérations Docker",
    },
    internal: {
      title: "Erreur Docker",
      description: "L'exécution de la commande Docker a échoué",
    },
    timeout: {
      title: "Délai de commande dépassé",
      description: "La commande Docker a dépassé le délai maximal",
    },
    executionFailed: {
      title: "Échec de l'exécution : {{error}}",
      description: "L'exécution de la commande Docker a échoué",
    },
    composeDownFailed: {
      title: "Échec de compose down : {{error}}",
      description: "L'opération Docker Compose down a échoué",
    },
    composeUpFailed: {
      title: "Échec de compose up : {{error}}",
      description: "L'opération Docker Compose up a échoué",
    },
  },
  success: {
    title: "Commande Docker réussie",
    description: "Commande Docker exécutée avec succès",
  },
  messages: {
    executingCommand: "Exécution de la commande Docker : {command}",
    timeoutError: "La commande Docker a expiré après {timeout} ms : {command}",
    commandFailed:
      "La commande Docker a échoué avec le code {code} : {command}",
    executionFailed: "Impossible d'exécuter la commande Docker : {command}",
    commandError: "Erreur de commande Docker : {error}",
  },
};
