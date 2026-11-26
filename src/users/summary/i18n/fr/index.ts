import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "Requête de stats invalide",
      description: "Vérifiez la période et les dates",
    },
    unauthorized: {
      title: "Connexion requise",
      description: "Connectez-vous pour voir les stats",
    },
    forbidden: {
      title: "Réservé aux admins",
      description: "Le rôle admin est requis pour voir les stats",
    },
    notFound: {
      title: "Aucune donnée",
      description: "Rien à afficher pour cette période",
    },
    server: {
      title: "Impossible de calculer les stats",
      description:
        "Le serveur n'a pas pu calculer les statistiques utilisateurs",
    },
    network: {
      title: "Erreur réseau",
      description: "Impossible de joindre le serveur",
    },
    unknown: {
      title: "Erreur inattendue",
      description: "Un problème est survenu lors du calcul des stats",
    },
    unsavedChanges: {
      title: "Modifications non enregistrées",
      description: "Vous avez des modifications non enregistrées",
    },
    conflict: {
      title: "Conflit",
      description: "La requête est en conflit avec les données actuelles",
    },
  },
  title: "Vue des comptes",
  description:
    "Consultez les inscriptions et la vérification des adresses e-mail des clients. Les comptes du personnel et de test sont exclus.",
  accounts: "Comptes clients",
  signups: "Créés en 7 jours",
  verified: "Adresse vérifiée",
  unverified: "Adresse non vérifiée",
  reviewUnverified: "Nouveaux comptes à vérifier ({{count}})",
  attention: "À vérifier",
  clear: "Tous les nouveaux comptes ont une adresse e-mail vérifiée.",
  unavailable: "État de vérification indisponible.",
  recent: "Activité récente",
  loading: "Chargement des comptes…",
};
