import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "Mettre à jour la base des pays visiteurs",
      titleShort: "Mise à jour Geo IP",
      description:
        "Charge la table mensuelle des pays DB-IP dans la base et complète le pays des leads qui n'en ont pas. Recherche hors ligne, aucun appel d'API par visite.",
      tag: "Geo IP",
      container: {
        title: "Base Geo IP",
        description: "Données IP vers pays de DB-IP (CC BY 4.0)",
      },
      fields: {
        force: {
          label: "Forcer le téléchargement",
          description:
            "Télécharger la version actuelle même si elle est déjà stockée",
        },
      },
      response: {
        status: "Statut",
        version: "Version",
        v4Ranges: "Plages IPv4",
        v6Ranges: "Plages IPv6",
        backfilled: "Leads complétés",
        unresolved: "Leads encore sans pays",
      },
      errors: {
        unauthorized: {
          title: "Non connecté",
          description: "Connecte-toi en admin pour mettre à jour la base geo.",
        },
        forbidden: {
          title: "Accès refusé",
          description: "Seuls les admins peuvent mettre à jour la base geo.",
        },
        server: {
          title: "Échec de la mise à jour",
          description:
            "La base geo n'a pas pu être mise à jour. Vérifie les logs.",
        },
        unknown: {
          title: "Erreur inattendue",
          description:
            "Un problème est survenu pendant la mise à jour de la base geo.",
        },
        validation: {
          title: "Saisie invalide",
          description: "Vérifie les champs de la requête.",
        },
        network: {
          title: "Erreur réseau",
          description: "La source geo est injoignable.",
        },
      },
      success: {
        title: "Base geo vérifiée",
        description: "La table des pays est à jour.",
      },
    },
    task: {
      description:
        "Mise à jour mensuelle des pays DB-IP et complément horaire du pays des leads",
    },
  },
  enums: {
    updateStatus: {
      updated: "Mise à jour faite",
      current: "Déjà à jour",
      unavailable: "Échec du téléchargement",
    },
  },
};
