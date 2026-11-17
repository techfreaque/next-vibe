import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Déconnexion de l'utilisateur",
  titleShort: "Déconnexion",
  description: "Déconnecte l'utilisateur actuel et invalide sa session",
  category: "Gestion des utilisateurs",
  tag: "déconnexion",
  logoutButton: "Se déconnecter",
  loggingOut: "Déconnexion...",
  response: {
    title: "Réponse de déconnexion",
    description: "Réponse confirmant la déconnexion",
    success: "Succès",
    message: "Message",
    sessionsCleaned: "Sessions supprimées",
    nextSteps: "Prochaines étapes recommandées après la déconnexion",
  },
  errors: {
    validation: {
      title: "Erreur de validation",
      description: "La demande de déconnexion contient des données invalides",
    },
    unauthorized: {
      title: "Non autorisé",
      description: "Vous devez être connecté pour vous déconnecter",
    },
    internal: {
      title: "Erreur interne du serveur",
      description: "Une erreur interne s'est produite lors de la déconnexion",
      detail: "Échec de la déconnexion : {{error}} (utilisateur {{userId}})",
    },
    unknown: {
      title: "Erreur inconnue",
      description:
        "Une erreur inattendue s'est produite lors de la déconnexion",
    },
    session_deletion_failed: {
      title: "Échec de la suppression de la session",
      description: "Impossible de supprimer la session de l'utilisateur",
    },
    conflict: {
      title: "Conflit de déconnexion",
      description: "Un conflit s'est produit lors de la déconnexion",
    },
    forbidden: {
      title: "Accès interdit",
      description: "La déconnexion n'est pas autorisée",
    },
    network_error: {
      title: "Erreur réseau",
      description: "Erreur réseau lors de la déconnexion",
    },
    not_found: {
      title: "Introuvable",
      description: "Session introuvable",
    },
    server_error: {
      title: "Erreur serveur",
      description: "Erreur interne du serveur lors de la déconnexion",
    },
    unsaved_changes: {
      title: "Modifications non enregistrées",
      description: "Certaines modifications n'ont pas été enregistrées",
    },
    invalid_user: {
      title: "Utilisateur invalide",
      description: "L'utilisateur n'est pas valide ou n'existe pas",
    },
  },
  success: {
    title: "Déconnexion réussie",
    description: "Vous êtes déconnecté",
    message: "Utilisateur déconnecté",
  },
};
